import { categories, type Project } from "@/content/projects";
import type { ClientGroup } from "@/content/site";

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const strs = (v: unknown, max = 200) =>
  Array.isArray(v) ? v.map((x) => str(x, max)).filter(Boolean).slice(0, 60) : [];

/** Only http(s) URLs or site-relative paths: never javascript:, data:, etc. */
export function safeUrl(v: unknown): string | undefined {
  const s = str(v, 2000);
  if (!s) return undefined;
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Turns a normal YouTube / Vimeo link into an embeddable player URL. */
export function toEmbedUrl(v: unknown): string | undefined {
  const s = safeUrl(v);
  if (!s || s.startsWith("/")) return undefined;
  const u = new URL(s);
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = u.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") id = u.searchParams.get("v");
    else {
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/);
      if (m) id = m[1];
    }
  }
  if (id && /^[\w-]{6,20}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const m = u.pathname.match(/(\d{5,})/);
    if (m) return `https://player.vimeo.com/video/${m[1]}`;
  }
  return undefined;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Validates and normalises a project list sent by the admin. Throws on bad input. */
export function cleanProjects(input: unknown): Project[] {
  if (!Array.isArray(input)) throw new Error("Expected a list of projects.");
  if (input.length > 500) throw new Error("Too many projects.");
  const seen = new Set<string>();

  return input.map((raw, i) => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const title = str(r.title, 140);
    if (!title) throw new Error(`Project ${i + 1} needs a title.`);
    const slug = slugify(str(r.slug) || title);
    if (!slug) throw new Error(`"${title}" needs a URL slug.`);
    if (seen.has(slug)) throw new Error(`Two projects use the URL "${slug}". Slugs must be unique.`);
    seen.add(slug);
    const category = str(r.category) as Project["category"];
    if (!categories.includes(category)) throw new Error(`"${title}" has an unknown category.`);
    // Kits only have a title and image, so their summary falls back to the title.
    const summary = str(r.summary, 300) || (category === "Apparel" ? title : "");
    if (!summary) throw new Error(`"${title}" needs a one-line summary.`);

    const link = r.link as Record<string, unknown> | undefined;
    const href = safeUrl(link?.href);
    const embedRaw = str(r.embed);
    const embed = embedRaw ? toEmbedUrl(embedRaw) : undefined;
    if (embedRaw && !embed) throw new Error(`"${title}": the video link must be a YouTube or Vimeo URL.`);

    const p: Project = { slug, title, category, summary };
    const client = str(r.client, 140);
    const year = str(r.year, 12);
    const description = strs(r.description, 4000);
    const services = strs(r.services, 80);
    const cover = safeUrl(r.cover);
    const gallery = (Array.isArray(r.gallery) ? r.gallery : []).map(safeUrl).filter((u): u is string => !!u).slice(0, 60);
    const video = safeUrl(r.video);
    if (client) p.client = client;
    if (year) p.year = year;
    if (description.length) p.description = description;
    if (services.length) p.services = services;
    if (cover) p.cover = cover;
    if (gallery.length) p.gallery = gallery;
    if (video) p.video = video;
    if (embed) p.embed = embed;
    if (href) p.link = { label: str(link?.label, 60) || "View project", href };
    if (r.featured === true) p.featured = true;
    return p;
  });
}

/** Validates the "Who I worked with" groups sent by the admin. Throws on bad input. */
export function cleanClientGroups(input: unknown): ClientGroup[] {
  if (!Array.isArray(input)) throw new Error("Expected a list of countries.");
  if (input.length > 30) throw new Error("Too many countries (max 30).");
  const ids = new Set<string>();
  return input.map((raw, gi) => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const label = str(r.label, 60);
    if (!label) throw new Error(`Country ${gi + 1} needs a name.`);
    let id = slugify(str(r.id) || label) || `group-${gi + 1}`;
    while (ids.has(id)) id += "-2";
    ids.add(id);
    const list = Array.isArray(r.clients) ? r.clients : [];
    if (list.length > 300) throw new Error(`Too many brands in ${label} (max 300).`);
    const clients = list.map((c) => {
      const cr = (c ?? {}) as Record<string, unknown>;
      const name = str(cr.name, 100);
      if (!name) throw new Error(`A brand in ${label} needs a name.`);
      const logo = safeUrl(cr.logo);
      return logo ? { name, logo } : { name };
    });
    return { id, label, clients };
  });
}
