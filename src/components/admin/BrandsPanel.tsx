"use client";

import { useEffect, useRef, useState } from "react";
import type { Client, ClientGroup } from "@/content/site";
import { slugify } from "@/lib/validate";
import { SingleMedia } from "./MediaFields";
import { discardUploads, type StorageMode } from "./upload";

type Editing = { group: number; index: number | "new" };

/** Admin: countries and the brands in each ("Who I worked with" on the home page). */
export function BrandsPanel({
  initial,
  fromSeed: seed,
  storage,
  onCount,
}: {
  initial: ClientGroup[];
  fromSeed: boolean;
  storage: StorageMode;
  onCount: (n: number) => void;
}) {
  const [groups, setGroups] = useState(initial);
  const [fromSeed, setFromSeed] = useState(seed);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" | "error"; msg?: string }>({ kind: "idle" });
  const locked = storage === "none";

  const save = async (next: ClientGroup[]): Promise<string | null> => {
    setStatus({ kind: "saving" });
    const res = await fetch("/api/admin/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groups: next }),
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
    setGroups(body.groups);
    setFromSeed(false);
    onCount(body.groups.reduce((n: number, g: ClientGroup) => n + g.clients.length, 0));
    setStatus({ kind: "saved", msg: "Saved. The home page is updated." });
    return null;
  };

  const swap = <T,>(arr: T[], i: number, j: number) => {
    const next = [...arr];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };

  const addCountry = () => {
    const label = prompt("Country or region name (e.g. Qatar):")?.trim();
    if (!label) return;
    if (groups.some((g) => g.label.toLowerCase() === label.toLowerCase())) return alert(`"${label}" already exists.`);
    save([...groups, { id: slugify(label), label, clients: [] }]);
  };
  const renameCountry = (gi: number) => {
    const label = prompt("Rename country:", groups[gi].label)?.trim();
    if (!label || label === groups[gi].label) return;
    save(groups.map((g, k) => (k === gi ? { ...g, label } : g)));
  };
  const deleteCountry = (gi: number) => {
    const g = groups[gi];
    const msg = g.clients.length
      ? `Delete "${g.label}" and its ${g.clients.length} brands? Their logos are deleted too. This can't be undone.`
      : `Delete "${g.label}"?`;
    if (confirm(msg)) save(groups.filter((_, k) => k !== gi));
  };
  const moveBrand = (gi: number, bi: number, d: -1 | 1) => {
    const list = groups[gi].clients;
    if (bi + d < 0 || bi + d >= list.length) return;
    save(groups.map((g, k) => (k === gi ? { ...g, clients: swap(list, bi, bi + d) } : g)));
  };
  const deleteBrand = (gi: number, bi: number) => {
    const c = groups[gi].clients[bi];
    if (confirm(`Delete "${c.name}"?${c.logo ? " Its logo is deleted too." : ""}`))
      save(groups.map((g, k) => (k === gi ? { ...g, clients: g.clients.filter((_, j) => j !== bi) } : g)));
  };

  return (
    <div className="brands-admin">
      {fromSeed && !locked && (
        <div className="notice">These are the starter brands from the code. Your first save copies them into storage.</div>
      )}

      <div className="admin-bar">
        <button className="btn btn--solid" onClick={addCountry} disabled={locked}>
          + Add country
        </button>
        <p className={`admin-status admin-status--${status.kind}`} role="status">
          {status.kind === "saving"
            ? "Saving…"
            : status.msg ?? "Brands shown in “Who I worked with” on the home page, one tab per country."}
        </p>
      </div>

      {groups.length === 0 && <p className="muted admin-empty">No countries yet. Add the first one.</p>}

      {groups.map((g, gi) => (
        <section key={g.id} className="bgroup">
          <header className="bgroup__head">
            <div>
              <h2 className="bgroup__name">{g.label}</h2>
              <span className="mono muted">
                {g.clients.length} brand{g.clients.length === 1 ? "" : "s"}
                {g.clients.length === 0 && " · hidden on the site until it has a brand"}
              </span>
            </div>
            <div className="bgroup__actions">
              <button className="abtn" onClick={() => save(swap(groups, gi, gi - 1))} disabled={gi === 0} aria-label={`Move ${g.label} left in tabs`}>↑</button>
              <button className="abtn" onClick={() => save(swap(groups, gi, gi + 1))} disabled={gi === groups.length - 1} aria-label={`Move ${g.label} right in tabs`}>↓</button>
              <button className="abtn" onClick={() => renameCountry(gi)}>Rename</button>
              <button className="abtn abtn--danger" onClick={() => deleteCountry(gi)}>Delete</button>
              <button className="abtn abtn--primary" onClick={() => setEditing({ group: gi, index: "new" })} disabled={locked}>
                + Add brand
              </button>
            </div>
          </header>

          {g.clients.length > 0 && (
            <ul className="bgrid">
              {g.clients.map((c, bi) => (
                <li key={`${c.name}-${bi}`} className="btile">
                  <div className="btile__plate">
                    {c.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logo} alt="" />
                    ) : (
                      <span className="btile__noLogo">No logo</span>
                    )}
                  </div>
                  <strong className="btile__name">{c.name}</strong>
                  <div className="btile__actions">
                    <button className="abtn" onClick={() => moveBrand(gi, bi, -1)} disabled={bi === 0} aria-label={`Move ${c.name} earlier`}>←</button>
                    <button className="abtn" onClick={() => moveBrand(gi, bi, 1)} disabled={bi === g.clients.length - 1} aria-label={`Move ${c.name} later`}>→</button>
                    <button className="abtn" onClick={() => setEditing({ group: gi, index: bi })}>Edit</button>
                    <button className="abtn abtn--danger" onClick={() => deleteBrand(gi, bi)} aria-label={`Delete ${c.name}`}>✕</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {editing && (
        <BrandEditor
          key={`${editing.group}-${editing.index}`}
          groups={groups}
          start={editing}
          storage={storage}
          onClose={() => setEditing(null)}
          onSave={async (brand, targetGroup) => {
            const { group: gi, index } = editing;
            const next = groups.map((g) => ({ ...g, clients: [...g.clients] }));
            if (index !== "new") next[gi].clients.splice(index, 1); // remove from its old place
            if (index !== "new" && targetGroup === gi) next[gi].clients.splice(index, 0, brand); // same country: keep position
            else next[targetGroup].clients.push(brand);
            const err = await save(next);
            if (!err) setEditing(null);
            return err;
          }}
        />
      )}
    </div>
  );
}

function BrandEditor({
  groups,
  start,
  storage,
  onSave,
  onClose,
}: {
  groups: ClientGroup[];
  start: Editing;
  storage: StorageMode;
  onSave: (brand: Client, group: number) => Promise<string | null>;
  onClose: () => void;
}) {
  const existing = start.index === "new" ? undefined : groups[start.group].clients[start.index];
  const [name, setName] = useState(existing?.name ?? "");
  const [logo, setLogo] = useState<string | undefined>(existing?.logo);
  const [group, setGroup] = useState(start.group);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const uploaded = useRef<string[]>([]);
  const nameInput = useRef<HTMLInputElement>(null);

  const cancel = () => {
    discardUploads(uploaded.current);
    onClose();
  };

  useEffect(() => {
    nameInput.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={existing ? `Edit ${existing.name}` : "Add brand"}>
      <form
        className="modal__card"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim()) return setError("Add the brand name.");
          setBusy(true);
          const err = await onSave(logo ? { name: name.trim(), logo } : { name: name.trim() }, group);
          setBusy(false);
          if (err) return setError(err);
          discardUploads(uploaded.current.filter((u) => u !== logo)); // replaced uploads
        }}
      >
        <h2 className="title">{existing ? "Edit brand" : "Add brand"}</h2>

        <label className="field">
          <span className="field__label">Brand name *</span>
          <input ref={nameInput} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="MSI Gaming Sri Lanka" />
        </label>

        <label className="field">
          <span className="field__label">Country</span>
          <select value={group} onChange={(e) => setGroup(Number(e.target.value))}>
            {groups.map((g, i) => (
              <option key={g.id} value={i}>{g.label}</option>
            ))}
          </select>
        </label>

        <div className="field">
          <span className="field__label">Logo</span>
          <p className="muted editor__hint">PNG with a transparent or white background works best. Without a logo, the name is shown.</p>
          <SingleMedia
            kind="image"
            value={logo}
            onChange={setLogo}
            storage={storage}
            folder={`clients-${groups[group]?.id ?? "brands"}`}
            onUploaded={(u) => uploaded.current.push(u)}
            label="Upload logo"
            hint="PNG, WebP or JPG"
          />
        </div>

        {error && <p className="admin-error" role="alert">{error}</p>}
        <div className="modal__actions">
          <button type="button" className="btn btn--small" onClick={cancel}>Cancel</button>
          <button className="btn btn--solid btn--small" disabled={busy || storage === "none"}>
            {busy ? "Saving…" : existing ? "Save brand" : "Add brand"}
          </button>
        </div>
      </form>
    </div>
  );
}
