/**
 * Site content storage (server only): projects and client brands.
 *
 *  - On Vercel with a Blob store connected: the lists + media live in Vercel Blob.
 *    A store can be connected two ways and both are supported:
 *      · BLOB_READ_WRITE_TOKEN (classic token), or
 *      · BLOB_STORE_ID + Vercel's built-in OIDC identity (newer stores).
 *  - Locally without a token: everything is written to ./.data so the admin
 *    can be tried out with `npm run dev`.
 *  - Until something is saved, the starter content in src/content/ is used.
 */
import { del, list, put } from "@vercel/blob";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { projects as seedProjects, type Project } from "@/content/projects";
import { clientGroups as seedClients, type ClientGroup } from "@/content/site";

export type StorageMode = "blob" | "local" | "none";

/** How the connected Blob store authenticates, or null if none is connected. */
export function blobAuthMode(): "token" | "oidc" | null {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return "token";
  if (process.env.BLOB_STORE_ID?.trim()) return "oidc";
  return null;
}

export function storageMode(): StorageMode {
  if (blobAuthMode()) return "blob";
  if (process.env.VERCEL) return "none"; // deployed but no Blob store connected
  return "local";
}

type Doc = "projects" | "clients";
const DATA_PREFIX: Record<Doc, string> = { projects: "data/projects-", clients: "data/clients-" };
const LOCAL_DIR = path.join(process.cwd(), ".data");
const localFile = (doc: Doc) => path.join(LOCAL_DIR, `${doc}.json`);
export const LOCAL_UPLOADS = path.join(LOCAL_DIR, "uploads");
export const LOCAL_MEDIA_PREFIX = "/media/";

const newestFirst = (a: { uploadedAt: Date }, b: { uploadedAt: Date }) =>
  new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();

/** Reads the latest saved JSON document, or null if nothing has been saved yet. */
async function readDoc(doc: Doc): Promise<Record<string, unknown> | null> {
  const mode = storageMode();
  if (mode === "blob") {
    const { blobs } = await list({ prefix: DATA_PREFIX[doc], limit: 100 });
    if (!blobs.length) return null;
    const latest = [...blobs].sort(newestFirst)[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Could not read ${doc} (${res.status})`);
    return res.json();
  }
  if (mode === "local") {
    try {
      return JSON.parse(await fs.readFile(localFile(doc), "utf8"));
    } catch {
      return null;
    }
  }
  return null;
}

async function writeDoc(doc: Doc, payload: Record<string, unknown>) {
  const mode = storageMode();
  const body = JSON.stringify({ updatedAt: new Date().toISOString(), ...payload }, null, 2);
  if (mode === "blob") {
    const previous = await list({ prefix: DATA_PREFIX[doc], limit: 100 });
    // A new file per save avoids CDN caching of an overwritten file.
    await put(`${DATA_PREFIX[doc]}${Date.now()}.json`, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: true,
    });
    // Keep the 5 most recent versions as backups.
    const stale = [...previous.blobs].sort(newestFirst).slice(4).map((b) => b.url);
    if (stale.length) await del(stale);
  } else if (mode === "local") {
    await fs.mkdir(LOCAL_DIR, { recursive: true });
    await fs.writeFile(localFile(doc), body);
  } else {
    throw new Error("No storage configured. Connect a Vercel Blob store to this project.");
  }
}

const fingerprint = (v: unknown) => createHash("sha1").update(JSON.stringify(v)).digest("hex").slice(0, 10);

/** Uncached read: used by the admin. */
export async function readProjects(): Promise<{ projects: Project[]; fromSeed: boolean }> {
  const stored = (await readDoc("projects"))?.projects as Project[] | undefined;
  return stored ? { projects: stored, fromSeed: false } : { projects: seedProjects, fromSeed: true };
}

/** Cached read: used by the public pages; refreshed whenever the admin saves. */
// The starter list's fingerprint is part of the key, so editing it in code invalidates the cache.
export const getProjects = unstable_cache(async () => (await readProjects()).projects, ["projects", fingerprint(seedProjects)], {
  tags: ["projects"],
});

/** Portfolio projects (everything except apparel). */
export async function getPortfolio() {
  return (await getProjects()).filter((p) => p.category !== "Apparel");
}

/** Kits shown on the /apparel page. */
export async function getApparel() {
  return (await getProjects()).filter((p) => p.category === "Apparel");
}

/** Looks a slug up among portfolio projects only: apparel has no detail pages. */
export async function getProjectBySlug(slug: string) {
  const all = await getPortfolio();
  const index = all.findIndex((p) => p.slug === slug);
  return index === -1 ? null : { project: all[index], index, all };
}

export async function saveProjects(projects: Project[]) {
  await writeDoc("projects", { projects });
  revalidateTag("projects", { expire: 0 });
  revalidatePath("/", "layout");
}

/* ---------- client brands ("Who I worked with") ---------- */

export async function readClients(): Promise<{ groups: ClientGroup[]; fromSeed: boolean }> {
  const stored = (await readDoc("clients"))?.groups as ClientGroup[] | undefined;
  return stored ? { groups: stored, fromSeed: false } : { groups: seedClients, fromSeed: true };
}

export const getClients = unstable_cache(async () => (await readClients()).groups, ["clients", fingerprint(seedClients)], {
  tags: ["clients"],
});

export async function saveClients(groups: ClientGroup[]) {
  await writeDoc("clients", { groups });
  revalidateTag("clients", { expire: 0 });
  revalidatePath("/", "layout");
}

export const logosOf = (groups: ClientGroup[]) =>
  groups.flatMap((g) => g.clients.map((c) => c.logo)).filter((u): u is string => !!u);

/** Every media URL a project references. */
export function mediaOf(p: Project): string[] {
  return [p.cover, p.video, ...(p.gallery ?? [])].filter((u): u is string => !!u);
}

/** Is this a file we uploaded (and therefore may delete)? */
export function isOwnMedia(url: string) {
  if (url.startsWith(LOCAL_MEDIA_PREFIX)) return true;
  try {
    return new URL(url).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/** Deletes uploaded files that no project or brand references any more. Call after saving. */
export async function deleteUnusedMedia(urls: string[]) {
  const candidates = [...new Set(urls)].filter(isOwnMedia);
  if (!candidates.length) return;
  const [{ projects }, { groups }] = await Promise.all([readProjects(), readClients()]);
  const referenced = new Set([...projects.flatMap(mediaOf), ...logosOf(groups)]);
  const targets = candidates.filter((u) => !referenced.has(u));
  if (!targets.length) return;
  const blobUrls = targets.filter((u) => !u.startsWith(LOCAL_MEDIA_PREFIX));
  const localUrls = targets.filter((u) => u.startsWith(LOCAL_MEDIA_PREFIX));
  if (blobUrls.length && storageMode() === "blob") await del(blobUrls);
  for (const u of localUrls) {
    await fs.rm(path.join(LOCAL_UPLOADS, path.basename(u)), { force: true });
  }
}
