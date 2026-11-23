"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

function useInView<T extends Element>(once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return [ref, inView] as const;
}

type RevealProps = {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  variant?: "up" | "fade" | "clip";
};

/** Fades / slides content in when it scrolls into view. */
export function Reveal({ children, as = "div", className = "", delay = 0, variant = "up" }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      className: `reveal reveal--${variant} ${className}`,
      "data-in": inView ? "" : undefined,
      style: { "--d": `${delay}ms` } as CSSProperties,
    },
    children,
  );
}

type SplitProps = {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  stagger?: number;
};

/** Headline whose words rise out of a mask one after another. */
export function SplitText({ text, as = "h2", className = "", delay = 0, stagger = 55 }: SplitProps) {
  const [ref, inView] = useInView<HTMLElement>();
  const lines = text.split("\n");
  let i = 0;
  return createElement(
    as,
    { ref, className: `split ${className}`, "data-in": inView ? "" : undefined, "aria-label": text.replace(/\n/g, " ") },
    lines.map((line, li) => (
      <span className="split__line" key={li} aria-hidden="true">
        {line.split(" ").map((word, wi) => {
          const d = delay + i++ * stagger;
          return (
            <span className="split__mask" key={wi}>
              <span className="split__word" style={{ "--d": `${d}ms` } as CSSProperties}>
                {word}
              </span>
            </span>
          );
        })}
      </span>
    )),
  );
}
