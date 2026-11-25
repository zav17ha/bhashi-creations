"use client";

import { useState } from "react";
import type { Project } from "@/content/projects";

/** Admin: the portfolio filter categories (add, rename, reorder, delete). */
export function CategoriesPanel({
  categories,
  projects,
  locked,
  onSaved,
}: {
  categories: string[];
  projects: Project[];
  locked: boolean;
  onSaved: (categories: string[], projects?: Project[]) => void;
}) {
  const [msg, setMsg] = useState<{ kind: "saving" | "saved" | "error"; text: string } | null>(null);
  const used = (c: string) => projects.filter((p) => p.category === c).length;

  const save = async (next: string[], rename?: { from: string; to: string }) => {
    setMsg({ kind: "saving", text: "Saving…" });
    const res = await fetch("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories: next, rename }),
    }).catch(() => null);
    if (!res) return setMsg({ kind: "error", text: "Network error. Nothing was saved." });
    if (res.status === 401) return window.location.reload();
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg({ kind: "error", text: body.error || "Saving failed." });
    onSaved(body.categories, body.projects);
    setMsg({ kind: "saved", text: "Saved. The portfolio filters are updated." });
  };

  const exists = (name: string, except?: string) =>
    categories.some((c) => c !== except && c.toLowerCase() === name.toLowerCase());

  const add = () => {
    const name = prompt("New category name (e.g. Logo Design):")?.trim();
    if (!name) return;
    if (exists(name)) return alert(`"${name}" already exists.`);
    save([...categories, name]);
  };
  const rename = (c: string) => {
    const name = prompt("Rename category:", c)?.trim();
    if (!name || name === c) return;
    if (exists(name, c)) return alert(`"${name}" already exists.`);
    save(categories.map((x) => (x === c ? name : x)), { from: c, to: name });
  };
  const remove = (c: string) => {
    const n = used(c);
    if (n) return alert(`"${c}" is used by ${n} project${n > 1 ? "s" : ""}. Move ${n > 1 ? "them" : "it"} to another category first.`);
    if (confirm(`Delete the category "${c}"?`)) save(categories.filter((x) => x !== c));
  };
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= categories.length) return;
    const next = [...categories];
    [next[i], next[j]] = [next[j], next[i]];
    save(next);
  };

  return (
    <section className="cats">
      <div className="cats__head">
        <div>
          <h2 className="editor__h">Categories</h2>
          <p className="muted cats__hint">The filter buttons on the Portfolio page. Only categories with projects are shown there.</p>
        </div>
        <button className="abtn abtn--primary" onClick={add} disabled={locked}>+ Add category</button>
      </div>
      <ul className="cats__list">
        {categories.map((c, i) => (
          <li key={c} className="cat">
            <span className="cat__name">{c}</span>
            <span className="cat__count mono">{used(c)}</span>
            <span className="cat__actions">
              <button className="abtn" onClick={() => move(i, -1)} disabled={i === 0 || locked} aria-label={`Move ${c} earlier`}>←</button>
              <button className="abtn" onClick={() => move(i, 1)} disabled={i === categories.length - 1 || locked} aria-label={`Move ${c} later`}>→</button>
              <button className="abtn" onClick={() => rename(c)} disabled={locked}>Rename</button>
              <button className="abtn abtn--danger" onClick={() => remove(c)} disabled={locked} aria-label={`Delete ${c}`}>✕</button>
            </span>
          </li>
        ))}
      </ul>
      {msg && <p className={`admin-status admin-status--${msg.kind}`} role="status">{msg.text}</p>}
    </section>
  );
}
