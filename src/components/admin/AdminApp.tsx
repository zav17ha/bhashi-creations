"use client";

import { useState } from "react";
import type { Project } from "@/content/projects";
import type { ClientGroup } from "@/content/site";
import { BrandsPanel } from "./BrandsPanel";
import { CategoriesPanel } from "./CategoriesPanel";
import { Mark } from "../Mark";
import { ProjectEditor } from "./ProjectEditor";
import type { StorageMode } from "./upload";

type Props = {
  initial: Project[];
  fromSeed: boolean;
  storage: StorageMode;
  clients: ClientGroup[];
  clientsFromSeed: boolean;
  blobEnv?: string[];
  categories: string[];
};
type Tab = "portfolio" | "apparel" | "brands";

const isApparel = (p: Project) => p.category === "Apparel";

export function AdminApp({ initial, fromSeed: seed, storage, clients, clientsFromSeed, blobEnv = [], categories: initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [projects, setProjects] = useState(initial);
  const [fromSeed, setFromSeed] = useState(seed);
  const [tab, setTab] = useState<Tab>("portfolio");
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" | "error"; msg?: string }>({ kind: "idle" });

  const apparelTab = tab === "apparel";
  // Items shown in the current tab, with their index in the full list.
  const visible = projects.map((p, i) => ({ p, i })).filter(({ p }) => isApparel(p) === apparelTab);
  const [brandCount, setBrandCount] = useState(() => clients.reduce((n, g) => n + g.clients.length, 0));
  const counts = {
    portfolio: projects.filter((p) => !isApparel(p)).length,
    apparel: projects.filter(isApparel).length,
    brands: brandCount,
  };

  /** Persists the whole list. Returns an error message, or null on success. */
  const save = async (next: Project[]): Promise<string | null> => {
    setStatus({ kind: "saving" });
    const res = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects: next }),
    }).catch(() => null);
    if (!res) {
      setStatus({ kind: "error", msg: "Network error. Nothing was saved." });
      return "Network error. Nothing was saved.";
    }
    if (res.status === 401) {
      window.location.reload();
      return "Session expired.";
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus({ kind: "error", msg: body.error });
      return body.error || "Saving failed.";
    }
    setProjects(body.projects);
    setFromSeed(false);
    setStatus({ kind: "saved", msg: "Saved. The live site is updated." });
    return null;
  };

  /** Moves an item up/down among the items of the current tab. */
  const move = (k: number, d: -1 | 1) => {
    const a = visible[k];
    const b = visible[k + d];
    if (!a || !b) return;
    const next = [...projects];
    [next[a.i], next[b.i]] = [next[b.i], next[a.i]];
    save(next);
  };
  const remove = (i: number) => {
    if (!confirm(`Delete "${projects[i].title}"? Its uploaded images and video are deleted too. This can't be undone.`)) return;
    save(projects.filter((_, k) => k !== i));
  };

  if (editing !== null) {
    const current = editing === "new" ? undefined : projects[editing];
    return (
      <div className="admin container">
        <ProjectEditor
          key={`${tab}-${editing}`}
          variant={apparelTab ? "apparel" : "portfolio"}
          categories={categories}
          project={current}
          storage={storage}
          takenSlugs={projects.filter((p) => p !== current).map((p) => p.slug)}
          onCancel={() => setEditing(null)}
          onSave={async (p) => {
            let next: Project[];
            if (editing === "new") {
              // New items go to the top of their own tab.
              const firstOfTab = projects.findIndex((x) => isApparel(x) === apparelTab);
              const at = firstOfTab === -1 ? (apparelTab ? 0 : projects.length) : firstOfTab;
              next = [...projects.slice(0, at), p, ...projects.slice(at)];
            } else {
              next = projects.map((x, k) => (k === editing ? p : x));
            }
            const err = await save(next);
            if (!err) {
              setEditing(null);
              window.scrollTo(0, 0);
            }
            return err;
          }}
        />
      </div>
    );
  }

  return (
    <div className="admin container">
      <header className="admin-top">
        <div className="admin-top__brand">
          <Mark className="admin-top__mark" />
          <div>
            <h1 className="title">Studio admin</h1>
            <p className="muted mono">storage: {storage === "blob" ? "Vercel Blob" : storage === "local" ? "local (dev)" : "not connected"}</p>
          </div>
        </div>
        <div className="admin-top__actions">
          <a className="btn btn--small" href={tab === "brands" ? "/" : apparelTab ? "/apparel" : "/portfolio"} target="_blank" rel="noreferrer">
            View {tab === "brands" ? "home" : apparelTab ? "apparel" : "portfolio"} ↗
          </a>
          <button
            className="btn btn--small"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.reload();
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <nav className="admin-tabs" role="tablist" aria-label="Sections">
        {(["portfolio", "apparel", "brands"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className="admin-tab" onClick={() => setTab(t)}>
            {t === "portfolio" ? "Portfolio" : t === "apparel" ? "Apparel" : "Brands"}
            <sup>{String(counts[t]).padStart(2, "0")}</sup>
          </button>
        ))}
      </nav>

      {storage === "none" && (
        <div className="notice notice--warn">
          <strong>Storage isn&rsquo;t connected to this deployment.</strong> In Vercel, open this project, then Storage, and
          make sure the Blob store is connected to <em>Production</em> (and Preview if you use it). Then open Deployments
          and <em>Redeploy</em>: a store only reaches deployments made after it was connected.
          <br />
          <span className="mono notice__env">
            Blob settings this deployment can see: {blobEnv.length ? blobEnv.join(", ") : "none"}
          </span>
        </div>
      )}
      {tab === "brands" ? (
        <BrandsPanel initial={clients} fromSeed={clientsFromSeed} storage={storage} onCount={setBrandCount} />
      ) : (
        <>
      {fromSeed && storage !== "none" && (
        <div className="notice">
          These are the starter items from the code. Your first save copies them into storage. After that, everything is managed here.
        </div>
      )}

      <div className="admin-bar">
        <button className="btn btn--solid" onClick={() => setEditing("new")} disabled={storage === "none"}>
          {apparelTab ? "+ Add kit" : "+ Add project"}
        </button>
        <p className={`admin-status admin-status--${status.kind}`} role="status">
          {status.kind === "saving"
            ? "Saving…"
            : status.msg ??
              (apparelTab
                ? "Jerseys, kits and hoodies shown on the Apparel page. Changes publish immediately."
                : "Changes publish to the live site immediately.")}
        </p>
      </div>

      {!apparelTab && (
        <CategoriesPanel
          categories={categories}
          projects={projects}
          locked={storage === "none"}
          onSaved={(cats, updated) => {
            setCategories(cats);
            if (updated) setProjects(updated);
          }}
        />
      )}

      {visible.length === 0 ? (
        <p className="muted admin-empty">{apparelTab ? "No kits yet. Add the first one." : "No projects yet."}</p>
      ) : (
        <ul className={`admin-list ${apparelTab ? "admin-list--kits" : ""}`}>
          {visible.map(({ p, i }, k) => (
            <li key={p.slug} className="admin-row">
              <div className="admin-row__thumb">
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt="" />
                ) : (
                  <Mark />
                )}
              </div>
              <div className="admin-row__info">
                <strong>{p.title}</strong>
                {!apparelTab && (
                  <span className="mono muted">
                    {p.category}
                    {p.year ? ` · ${p.year}` : ""} · /portfolio/{p.slug}
                  </span>
                )}
              </div>
              <div className="admin-row__actions">
                <button className="abtn" onClick={() => move(k, -1)} disabled={k === 0} aria-label="Move up">↑</button>
                <button className="abtn" onClick={() => move(k, 1)} disabled={k === visible.length - 1} aria-label="Move down">↓</button>
                <button className="abtn" onClick={() => setEditing(i)}>Edit</button>
                <button className="abtn abtn--danger" onClick={() => remove(i)} aria-label={`Delete ${p.title}`}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
        </>
      )}
    </div>
  );
}
