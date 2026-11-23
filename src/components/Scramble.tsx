"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_▚▞";

/**
 * Text that "decodes" itself: on mount (auto) and/or whenever its
 * closest link/button is hovered.
 */
export function Scramble({ text, auto = false, delay = 0 }: { text: string; auto?: boolean; delay?: number }) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);

  const run = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const dur = Math.min(900, 280 + text.length * 30);
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const fixed = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        s += i < fixed || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const host = ref.current?.closest("a, button");
    host?.addEventListener("pointerenter", run);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (auto) t = setTimeout(run, delay);
    return () => {
      host?.removeEventListener("pointerenter", run);
      clearTimeout(t);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span ref={ref} className="scramble">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
