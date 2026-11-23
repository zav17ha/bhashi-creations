"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mark } from "../Mark";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="admin-login">
      <form
        className="admin-login__card"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const password = new FormData(e.currentTarget).get("password");
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });
          if (res.ok) router.refresh();
          else {
            setError((await res.json().catch(() => ({}))).error || "Sign-in failed.");
            setBusy(false);
          }
        }}
      >
        <Mark className="admin-login__mark" />
        <h1 className="title">Studio admin</h1>
        <p className="muted">Sign in to manage the Bhashi Creations portfolio.</p>
        <label className="field">
          <span className="field__label">Password</span>
          <input name="password" type="password" required autoComplete="current-password" autoFocus />
        </label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="btn btn--solid" disabled={busy}>
          {busy ? "Signing in…" : "Sign in →"}
        </button>
      </form>
    </div>
  );
}
