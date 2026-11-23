"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Reveal } from "./Reveal";

export type Kit = { slug: string; title: string; cover?: string };

/** Grid of kits; clicking one opens it full-size in an overlay (no separate page). */
export function ApparelGallery({ kits }: { kits: Kit[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + kits.length) % kits.length)),
    [kits.length],
  );

  useEffect(() => {
    if (open === null) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const current = open === null ? null : kits[open];

  return (
    <>
      <ul className="apparel-grid">
        {kits.map((k, i) => (
          <li key={k.slug}>
            <Reveal delay={(i % 3) * 80}>
              <button
                type="button"
                className="kit"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpen(i);
                }}
                aria-label={`View ${k.title}`}
              >
                <span className="kit__media">
                  {k.cover && (
                    <Image
                      src={k.cover}
                      alt=""
                      width={1600}
                      height={1600}
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  )}
                </span>
                <span className="kit__title">{k.title}</span>
              </button>
            </Reveal>
          </li>
        ))}
      </ul>

      {current &&
        createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={close}>
          <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
            {current.cover && (
              <Image
                key={current.slug}
                src={current.cover}
                alt={current.title}
                width={2000}
                height={2000}
                sizes="92vw"
                className="lightbox__img"
                priority
              />
            )}
            <figcaption className="lightbox__caption">
              <span>{current.title}</span>
              {kits.length > 1 && (
                <span className="mono">
                  {String((open ?? 0) + 1).padStart(2, "0")} / {String(kits.length).padStart(2, "0")}
                </span>
              )}
            </figcaption>
          </figure>
          <button ref={closeBtn} type="button" className="lightbox__close" onClick={close} aria-label="Close">
            ✕
          </button>
          {kits.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous kit"
              >
                ←
              </button>
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next kit"
              >
                →
              </button>
            </>
          )}
        </div>,
          // Rendered at the body level so it sits above the fixed nav.
          document.body,
        )}
    </>
  );
}
