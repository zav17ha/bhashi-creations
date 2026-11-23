"use client";

import Image from "next/image";
import { useState } from "react";
import type { Client } from "@/content/site";
import { SplitText } from "./Reveal";

type Group = { id: string; label: string; clients: Client[] };

/** "Who I worked with": a logo grid per region, switched with tabs. Scales to any number of logos. */
export function ClientWall({ groups }: { groups: Group[] }) {
  const visible = groups.filter((g) => g.clients.length);
  const [active, setActive] = useState(visible[0]?.id);
  const group = visible.find((g) => g.id === active) ?? visible[0];
  if (!group) return null;

  return (
    <section className="clients" aria-labelledby="clients-title">
      <div className="container">
        <div className="clients__head">
          <div>
            <p className="eyebrow">Clients</p>
            <SplitText as="h2" className="title" text={"Who I\nworked with"} />
            <span id="clients-title" className="sr-only">Who I worked with</span>
          </div>
          {visible.length > 1 && (
            <div className="clients__tabs" role="tablist" aria-label="Region">
              {visible.map((g) => (
                <button
                  key={g.id}
                  role="tab"
                  id={`tab-${g.id}`}
                  aria-selected={g.id === group.id}
                  aria-controls={`panel-${g.id}`}
                  className="clients__tab"
                  onClick={() => setActive(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <ul key={group.id} id={`panel-${group.id}`} role="tabpanel" aria-labelledby={`tab-${group.id}`} className="clients__grid">
          {group.clients.map((c, i) => (
            <li key={c.name} className="clients__cell" style={{ "--k": i } as React.CSSProperties}>
              {c.logo ? (
                <span className="clients__logo">
                  <Image src={c.logo} alt={c.name} fill sizes="(max-width: 700px) 40vw, 200px" />
                </span>
              ) : (
                <span className="clients__name">{c.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
