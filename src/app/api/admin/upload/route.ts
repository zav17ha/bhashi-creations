import { issueSignedToken } from "@vercel/blob";
import { handleUpload, handleUploadPresigned, type HandleUploadBody, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { blobAuthMode, deleteUnusedMedia, LOCAL_MEDIA_PREFIX, LOCAL_UPLOADS, storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_BYTES = 500 * 1024 * 1024; // 500 MB

const unauthorized = () => NextResponse.json({ error: "Please sign in again." }, { status: 401 });

/** Tells the admin which upload method this deployment uses. */
export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  const mode = storageMode();
  return NextResponse.json({ mode: mode === "blob" ? (blobAuthMode() === "oidc" ? "presigned" : "token") : mode });
}

/**
 * Blob mode: the browser uploads straight to Vercel Blob (no 4.5 MB serverless body limit).
 *  - Classic token stores: issues a short-lived client token (handleUpload).
 *  - OIDC stores (BLOB_STORE_ID): issues a presigned upload URL (handleUploadPresigned).
 * Local mode: receives the file and writes it to ./.data/uploads.
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const mode = storageMode();

  if (mode === "blob") {
    try {
      const raw = await req.json();
      const allowed = [...IMAGE_TYPES, ...VIDEO_TYPES];
      if (raw?.type === "blob.generate-presigned-url") {
        const result = await handleUploadPresigned({
          body: raw as HandleUploadPresignedBody,
          request: req,
          // Only used to verify upload-finished callbacks, which this site does not request.
          webhookPublicKey: process.env.BLOB_WEBHOOK_PUBLIC_KEY || "unused",
          getSignedToken: async (pathname) => {
            if (!pathname.startsWith("portfolio/")) throw new Error("Invalid upload path.");
            const token = await issueSignedToken({
              pathname,
              operations: ["put"],
              allowedContentTypes: allowed,
              maximumSizeInBytes: MAX_BYTES,
            });
            return { token, urlOptions: { addRandomSuffix: true, allowedContentTypes: allowed, maximumSizeInBytes: MAX_BYTES } };
          },
        });
        return NextResponse.json(result);
      }
      const body = raw as HandleUploadBody;
      const result = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async (pathname) => {
          if (!pathname.startsWith("portfolio/")) throw new Error("Invalid upload path.");
          return {
            allowedContentTypes: [...IMAGE_TYPES, ...VIDEO_TYPES],
            maximumSizeInBytes: MAX_BYTES,
            addRandomSuffix: true,
          };
        },
      });
      return NextResponse.json(result);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 });
    }
  }

  if (mode === "local") {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
    if (![...IMAGE_TYPES, ...VIDEO_TYPES].includes(file.type))
      return NextResponse.json({ error: `File type ${file.type || "unknown"} is not allowed.` }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "File is larger than 500 MB." }, { status: 400 });
    const ext = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "") || "";
    const base = path.basename(file.name, path.extname(file.name)).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const name = `${base || "file"}-${randomBytes(6).toString("hex")}${ext}`;
    await fs.mkdir(LOCAL_UPLOADS, { recursive: true });
    await fs.writeFile(path.join(LOCAL_UPLOADS, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `${LOCAL_MEDIA_PREFIX}${name}` });
  }

  return NextResponse.json({ error: "No storage configured. Connect a Vercel Blob store to this project." }, { status: 503 });
}

/** Deletes uploads that were abandoned (e.g. an edit was cancelled). Files still used anywhere are kept. */
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const { urls } = await req.json().catch(() => ({ urls: [] }));
  if (!Array.isArray(urls)) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  await deleteUnusedMedia(urls.filter((u): u is string => typeof u === "string"));
  return NextResponse.json({ ok: true });
}
