"use client";

import { useState } from "react";
import { site } from "@/content/site";

const SERVICES = ["Digital Marketing", "Logo & Branding", "Graphic Design", "3D", "VFX & Video", "Motion", "Esports Apparel", "Something else"];
const BUDGETS = ["< $500", "$500 – 2k", "$2k – 5k", "$5k +", "Not sure yet"];

/**
 * No backend needed: the form composes a message and opens WhatsApp
 * (or the visitor's mail app when an email address is configured).
 */
export function ContactForm() {
  const [picked, setPicked] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [sent, setSent] = useState(false);

  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const compose = (form: HTMLFormElement) => {
    const d = new FormData(form);
    return [
      `Hi Bhashi Creations! I'm ${d.get("name")}.`,
      picked.length ? `Interested in: ${picked.join(", ")}` : "",
      budget ? `Budget: ${budget}` : "",
      d.get("email") ? `Email: ${d.get("email")}` : "",
      "",
      String(d.get("message") ?? ""),
    ]
      .filter((l, i, a) => l !== "" || (i > 0 && a[i - 1] !== ""))
      .join("\n");
  };

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        const text = compose(e.currentTarget);
        window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
        setSent(true);
      }}
    >
      <div className="form__row">
        <label className="field">
          <span className="field__label">Your name *</span>
          <input name="name" required autoComplete="name" placeholder="Jane Perera" />
        </label>
        <label className="field">
          <span className="field__label">Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="jane@company.com" />
        </label>
      </div>

      <fieldset className="field">
        <legend className="field__label">I&rsquo;m interested in</legend>
        <div className="chips">
          {SERVICES.map((s) => (
            <button type="button" key={s} className="chip" aria-pressed={picked.includes(s)} onClick={() => toggle(s)}>
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">Budget</legend>
        <div className="chips">
          {BUDGETS.map((b) => (
            <button type="button" key={b} className="chip" aria-pressed={budget === b} onClick={() => setBudget(budget === b ? "" : b)}>
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span className="field__label">Tell me about the project *</span>
        <textarea name="message" required rows={4} placeholder="Goals, timeline, links to references…" />
      </label>

      <div className="form__foot">
        <button type="submit" className="btn btn--solid">
          Send via WhatsApp <span aria-hidden="true">→</span>
        </button>
        <p className="form__note mono" role="status">
          {sent ? "WhatsApp opened in a new tab. Hit send there." : "Opens WhatsApp with your message ready to send."}
        </p>
      </div>
    </form>
  );
}
