"use client";

import { useRef, useState } from "react";
import { uploadFile, type StorageMode } from "./upload";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif";
const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";
const isVideo = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

type Common = { storage: StorageMode; folder: string; onUploaded: (url: string) => void };

function useUploads({ storage, folder, onUploaded }: Common) {
  const [jobs, setJobs] = useState<{ id: number; name: string; pct: number }[]>([]);
  const [error, setError] = useState("");
  const run = async (files: File[]) => {
    setError("");
    const results: string[] = [];
    await Promise.all(
      files.map(async (file) => {
        const id = Math.random();
        setJobs((j) => [...j, { id, name: file.name, pct: 0 }]);
        try {
          const url = await uploadFile(file, storage, folder, (pct) =>
            setJobs((j) => j.map((x) => (x.id === id ? { ...x, pct } : x))),
          );
          onUploaded(url);
          results.push(url);
        } catch (e) {
          setError(`${file.name}: ${(e as Error).message}`);
        } finally {
          setJobs((j) => j.filter((x) => x.id !== id));
        }
      }),
    );
    return results;
  };
  return { jobs, error, run };
}

function Dropzone({
  accept,
  multiple,
  label,
  hint,
  onFiles,
  disabled,
}: {
  accept: string;
  multiple?: boolean;
  label: string;
  hint: string;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      className="dropzone"
      data-over={over ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (disabled) return;
        const ok = accept.split(",");
        const files = Array.from(e.dataTransfer.files).filter((f) => ok.includes(f.type));
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
    >
      <button type="button" className="dropzone__btn" disabled={disabled} onClick={() => input.current?.click()}>
        <span className="dropzone__plus" aria-hidden="true">+</span>
        <span>{label}</span>
        <small>{hint}</small>
      </button>
      <input
        ref={input}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </div>
  );
}

function Progress({ jobs }: { jobs: { id: number; name: string; pct: number }[] }) {
  if (!jobs.length) return null;
  return (
    <ul className="uploads">
      {jobs.map((j) => (
        <li key={j.id}>
          <span>{j.name}</span>
          <span className="mono">{j.pct}%</span>
          <i style={{ width: `${j.pct}%` }} />
        </li>
      ))}
    </ul>
  );
}

/** One image or one video. */
export function SingleMedia({
  kind,
  value,
  onChange,
  label,
  hint,
  ...common
}: Omit<Common, "onUploaded"> & {
  kind: "image" | "video";
  value?: string;
  onChange: (url?: string) => void;
  onUploaded: (url: string) => void;
  label?: string;
  hint?: string;
}) {
  const { jobs, error, run } = useUploads({
    ...common,
    onUploaded: (url) => {
      common.onUploaded(url);
      onChange(url);
    },
  });
  return (
    <div className="media-field">
      {value ? (
        <div className="media-preview">
          {kind === "video" || isVideo(value) ? (
            <video src={value} controls muted playsInline preload="metadata" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" />
          )}
          <div className="media-preview__actions">
            <button type="button" className="abtn" onClick={() => onChange(undefined)}>Remove</button>
          </div>
        </div>
      ) : (
        <Dropzone
          accept={kind === "image" ? IMAGE_ACCEPT : VIDEO_ACCEPT}
          label={label ?? (kind === "image" ? "Upload cover image" : "Upload video")}
          hint={hint ?? (kind === "image" ? "JPG, PNG, WebP or AVIF · 4:3 looks best" : "MP4 or WebM · up to 500 MB")}
          onFiles={run}
          disabled={!!jobs.length || common.storage === "none"}
        />
      )}
      <Progress jobs={jobs} />
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}

/** Ordered list of images. */
export function GalleryField({
  value,
  onChange,
  ...common
}: Common & { value: string[]; onChange: (urls: string[]) => void }) {
  const latest = useRef(value);
  latest.current = value;
  const { jobs, error, run } = useUploads({
    ...common,
    onUploaded: (url) => {
      common.onUploaded(url);
      latest.current = [...latest.current, url];
      onChange(latest.current);
    },
  });
  const move = (i: number, d: -1 | 1) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="media-field">
      {value.length > 0 && (
        <ul className="gallery-edit">
          {value.map((url, i) => (
            <li key={url}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
              <div className="gallery-edit__bar">
                <button type="button" className="abtn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left">←</button>
                <button type="button" className="abtn" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move right">→</button>
                <button type="button" className="abtn abtn--danger" onClick={() => onChange(value.filter((u) => u !== url))} aria-label="Remove image">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Dropzone
        accept={IMAGE_ACCEPT}
        multiple
        label="Add gallery images"
        hint="Select or drop several at once"
        onFiles={run}
        disabled={common.storage === "none"}
      />
      <Progress jobs={jobs} />
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}
