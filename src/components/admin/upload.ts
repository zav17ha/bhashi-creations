import { upload } from "@vercel/blob/client";

export type StorageMode = "blob" | "local" | "none";

/** Uploads one file and resolves with its public URL. */
export async function uploadFile(
  file: File,
  mode: StorageMode,
  folder: string,
  onProgress: (pct: number) => void,
): Promise<string> {
  if (mode === "none") throw new Error("Storage is not connected yet.");
  if (mode === "blob") {
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const res = await upload(`portfolio/${folder || "untitled"}/${safe}`, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
      multipart: file.size > 20 * 1024 * 1024,
      onUploadProgress: (e) => onProgress(Math.round(e.percentage)),
    });
    return res.url;
  }
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const j = JSON.parse(xhr.responseText);
        if (xhr.status < 300) resolve(j.url);
        else reject(new Error(j.error || "Upload failed."));
      } catch {
        reject(new Error("Upload failed."));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    const fd = new FormData();
    fd.append("file", file);
    xhr.send(fd);
  });
}

export async function discardUploads(urls: string[]) {
  if (!urls.length) return;
  await fetch("/api/admin/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  }).catch(() => {});
}
