import { promises as fs } from "node:fs";
import path from "node:path";
import { LOCAL_UPLOADS, storageMode } from "@/lib/store";

/** Serves files uploaded in local mode (development only). Supports Range for video seeking. */
const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".avif": "image/avif", ".gif": "image/gif", ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
};

export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (storageMode() !== "local" || !/^[\w.-]+$/.test(name)) return new Response("Not found", { status: 404 });
  const file = path.join(LOCAL_UPLOADS, name);
  let data: Buffer;
  try {
    data = await fs.readFile(file);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const type = TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream";
  const range = req.headers.get("range")?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1;
    if (start > end || start >= data.length) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${data.length}` } });
    return new Response(new Uint8Array(data.subarray(start, end + 1)), {
      status: 206,
      headers: { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${data.length}`, "Accept-Ranges": "bytes", "Content-Length": String(end - start + 1) },
    });
  }
  return new Response(new Uint8Array(data), {
    headers: { "Content-Type": type, "Accept-Ranges": "bytes", "Content-Length": String(data.length), "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
