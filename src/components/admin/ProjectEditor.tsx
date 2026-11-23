"use client";

import { useRef, useState } from "react";
import { categories, type Category, type Project } from "@/content/projects";
import { slugify } from "@/lib/validate";
import { GalleryField, SingleMedia } from "./MediaFields";
import { discardUploads, type StorageMode } from "./upload";

type Draft = {
  title: string;
  slug: string;
  client: string;
  category: Category;
  year: string;
  summary: string;
  description: string;
  services: string;
  cover?: string;
  gallery: string[];
  video?: string;
  embed: string;
  linkLabel: string;
  linkHref: string;
  featured: boolean;
};

const toDraft = (p: Project | undefined, apparel: boolean): Draft => ({
  title: p?.title ?? "",
  slug: p?.slug ?? "",
  client: p?.client ?? "",
  category: apparel ? "Apparel" : p?.category ?? "Graphic Design",
  year: p?.year ?? String(new Date().getFullYear()),
  summary: p?.summary ?? "",
  description: (p?.description ?? []).join("\n\n"),
  services: (p?.services ?? []).join(", "),
  cover: p?.cover,
  gallery: p?.gallery ?? [],
  video: p?.video,
  embed: p?.embed ?? "",
  linkLabel: p?.link?.label ?? "",
  linkHref: p?.link?.href ?? "",
  featured: !!p?.featured,
});

const fromDraft = (d: Draft): Project => ({
  title: d.title.trim(),
  slug: slugify(d.slug || d.title),
  client: d.client.trim() || undefined,
  category: d.category,
  year: d.year.trim() || undefined,
  summary: d.summary.trim(),
  description: d.description.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
  services: d.services.split(",").map((s) => s.trim()).filter(Boolean),
  cover: d.cover,
  gallery: d.gallery,
  video: d.video,
  embed: d.embed.trim() || undefined,
  link: d.linkHref.trim() ? { label: d.linkLabel.trim() || "View project", href: d.linkHref.trim() } : undefined,
  featured: d.featured || undefined,
});

const media = (d: Draft) => [d.cover, d.video, ...d.gallery].filter((u): u is string => !!u);

export function ProjectEditor({
  project,
  storage,
  takenSlugs,
  onSave,
  onCancel,
  variant = "portfolio",
}: {
  variant?: "portfolio" | "apparel";
  project?: Project;
  storage: StorageMode;
  takenSlugs: string[];
  onSave: (p: Project) => Promise<string | null>;
  onCancel: () => void;
}) {
  const apparel = variant === "apparel";
  const [d, setD] = useState<Draft>(() => toDraft(project, apparel));
  const [slugTouched, setSlugTouched] = useState(!!project);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const uploaded = useRef<string[]>([]);
  const isNew = !project;

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setD((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "title" && !slugTouched) next.slug = slugify(String(v));
      return next;
    });
  const slug = slugify(d.slug || d.title);
  const folder = slug || "untitled";
  const track = (url: string) => uploaded.current.push(url);

  const cancel = () => {
    discardUploads(uploaded.current);
    onCancel();
  };

  return (
    <form
      className="editor"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        if (takenSlugs.includes(slug)) return setError(`Another project already uses the URL "/portfolio/${slug}".`);
        if (apparel && !d.cover) return setError("Add a kit image before publishing.");
        setBusy(true);
        const err = await onSave(fromDraft(d));
        setBusy(false);
        if (err) return setError(err);
        // Files uploaded during this edit but removed before saving.
        const kept = new Set(media(d));
        discardUploads(uploaded.current.filter((u) => !kept.has(u)));
      }}
    >
      <div className="editor__head">
        <button type="button" className="back mono" onClick={cancel}>← Back to {apparel ? "kits" : "projects"}</button>
        <h1 className="title">{isNew ? (apparel ? "New kit" : "New project") : d.title || "Edit"}</h1>
        {apparel && (
          <p className="muted editor__hint editor__hint--head">
            Kits show on the Apparel page as the image and title. Clicking one opens it full-size.
          </p>
        )}
      </div>

      {apparel ? (
        <>
          <section className="editor__section">
            <label className="field">
              <span className="field__label">Title *</span>
              <input
                value={d.title}
                onChange={(e) => set("title", e.target.value)}
                required
                maxLength={140}
                placeholder="Infinity Club Jersey"
              />
            </label>
          </section>
          <section className="editor__section">
            <h2 className="editor__h">Kit image *</h2>
            <p className="muted editor__hint">The mockup (front &amp; back works best). Shown at its own shape. Nothing is cropped.</p>
            <SingleMedia kind="image" value={d.cover} onChange={(u) => set("cover", u)} storage={storage} folder={folder} onUploaded={track} label="Upload kit image" hint="JPG, PNG or WebP" />
          </section>
        </>
      ) : (
        <>
          <section className="editor__section">
            <h2 className="editor__h">Basics</h2>
            <div className="editor__grid">
              <label className="field field--wide">
                <span className="field__label">Title *</span>
                <input value={d.title} onChange={(e) => set("title", e.target.value)} required maxLength={140} placeholder="Brand identity for …" />
              </label>
              <label className="field">
                <span className="field__label">Category *</span>
                <select value={d.category} onChange={(e) => set("category", e.target.value as Category)}>
                  {categories
                    .filter((c) => c !== "Apparel")
                    .map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                </select>
              </label>
              <label className="field">
                <span className="field__label">Year</span>
                <input value={d.year} onChange={(e) => set("year", e.target.value)} maxLength={12} />
              </label>
              <label className="field">
                <span className="field__label">Client</span>
                <input value={d.client} onChange={(e) => set("client", e.target.value)} maxLength={140} />
              </label>
              <label className="field">
                <span className="field__label">Page URL</span>
                <div className="slug">
                  <span className="mono">/portfolio/</span>
                  <input
                    value={d.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value);
                    }}
                    onBlur={() => set("slug", slug)}
                    placeholder="auto"
                  />
                </div>
                {!isNew && project && slug !== project.slug && (
                  <small className="admin-warn">Changing the URL breaks links already shared to the old one.</small>
                )}
              </label>
              <label className="field field--wide">
                <span className="field__label">One-line summary * <em>(shown on cards)</em></span>
                <input value={d.summary} onChange={(e) => set("summary", e.target.value)} required maxLength={300} />
              </label>
              <label className="field field--wide">
                <span className="field__label">Description <em>(leave a blank line between paragraphs)</em></span>
                <textarea rows={6} value={d.description} onChange={(e) => set("description", e.target.value)} />
              </label>
              <label className="field field--wide">
                <span className="field__label">Services <em>(comma separated)</em></span>
                <input value={d.services} onChange={(e) => set("services", e.target.value)} placeholder="Logo design, Brand identity" />
              </label>
            </div>
          </section>

          <section className="editor__section">
            <h2 className="editor__h">Cover image</h2>
            <p className="muted editor__hint">Shown on the portfolio grid and at the top of the project page. Without one, a generated brand cover is used.</p>
            <SingleMedia kind="image" value={d.cover} onChange={(u) => set("cover", u)} storage={storage} folder={folder} onUploaded={track} />
          </section>

          <section className="editor__section">
            <h2 className="editor__h">Gallery</h2>
            <GalleryField value={d.gallery} onChange={(g) => set("gallery", g)} storage={storage} folder={folder} onUploaded={track} />
          </section>

          <section className="editor__section">
            <h2 className="editor__h">Video</h2>
            <div className="editor__grid">
              <div className="field field--wide">
                <span className="field__label">Upload a video file</span>
                <SingleMedia kind="video" value={d.video} onChange={(u) => set("video", u)} storage={storage} folder={folder} onUploaded={track} />
              </div>
              <label className="field field--wide">
                <span className="field__label">…or paste a YouTube / Vimeo link</span>
                <input value={d.embed} onChange={(e) => set("embed", e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
              </label>
            </div>
          </section>

          <section className="editor__section">
            <h2 className="editor__h">External link</h2>
            <div className="editor__grid">
              <label className="field">
                <span className="field__label">Button text</span>
                <input value={d.linkLabel} onChange={(e) => set("linkLabel", e.target.value)} placeholder="View on Behance" maxLength={60} />
              </label>
              <label className="field">
                <span className="field__label">URL</span>
                <input value={d.linkHref} onChange={(e) => set("linkHref", e.target.value)} placeholder="https://…" type="url" />
              </label>
            </div>
          </section>
        </>
      )}

      <div className="editor__bar">
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button type="button" className="btn btn--small" onClick={cancel}>Cancel</button>
        <button className="btn btn--solid btn--small" disabled={busy || storage === "none"}>
          {busy ? "Saving…" : isNew ? (apparel ? "Publish kit" : "Publish project") : "Save changes"}
        </button>
      </div>
    </form>
  );
}
