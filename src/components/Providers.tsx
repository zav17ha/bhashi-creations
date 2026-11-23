"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Mark } from "./Mark";

type Phase = "boot" | "idle" | "cover" | "reveal";

type Ctx = { navigate: (href: string, label?: string) => void; phase: Phase };
const TransitionCtx = createContext<Ctx>({ navigate: () => {}, phase: "idle" });
export const usePageTransition = () => useContext(TransitionCtx);

const COVER_MS = 480;
const REVEAL_MS = 650;
const BOOT_MS = 1000;

const LABELS: Record<string, string> = {
  "/": "Home",
  "/portfolio": "Portfolio",
  "/apparel": "Apparel",
  "/services": "Services",
  "/about": "About",
  "/contact": "Contact",
};
function labelFor(href: string) {
  const path = href.split("?")[0];
  if (LABELS[path]) return LABELS[path];
  if (path.startsWith("/portfolio/")) return "Project";
  return "Loading";
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("boot");
  const [label, setLabel] = useState("");
  const [count, setCount] = useState(0);
  const pending = useRef<string | null>(null);

  // First-visit loader with counter; later hard loads just reveal.
  useEffect(() => {
    let first = true;
    try {
      first = !sessionStorage.getItem("bc-visited");
      sessionStorage.setItem("bc-visited", "1");
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!first || reduced) {
      setPhase("reveal");
      return;
    }
    let raf = 0;
    let done: ReturnType<typeof setTimeout>;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / BOOT_MS);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else done = setTimeout(() => setPhase("reveal"), 150);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, []);

  // Expose the phase to CSS (gates entrance animations).
  useEffect(() => {
    document.documentElement.dataset.phase = phase;
    if (phase === "reveal") {
      const t = setTimeout(() => setPhase("idle"), REVEAL_MS + 150);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const navigate = useCallback(
    (href: string, lbl?: string) => {
      if (pending.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      pending.current = href;
      setLabel(lbl ?? labelFor(href));
      setPhase("cover");
      router.prefetch(href);
      setTimeout(() => router.push(href, { scroll: false }), COVER_MS);
      // Safety net: never leave the curtain down.
      setTimeout(() => {
        if (pending.current === href) {
          pending.current = null;
          setPhase("reveal");
        }
      }, COVER_MS + 4000);
    },
    [router],
  );

  // New route rendered → jump to top behind the curtain, then lift it.
  useEffect(() => {
    if (!pending.current) return;
    pending.current = null;
    window.scrollTo({ top: 0, behavior: "instant" });
    const t = setTimeout(() => setPhase("reveal"), 60);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <TransitionCtx.Provider value={{ navigate, phase }}>
      {children}
      <div className="curtain" data-phase={phase} aria-hidden="true">
        <div className="curtain__layer curtain__layer--blue" />
        <div className="curtain__layer curtain__layer--dark">
          <div className="curtain__inner">
            <Mark className="curtain__mark" />
            {phase === "boot" ? (
              <div className="curtain__boot">
                <span className="curtain__brand">Bhashi Creations</span>
                <span className="curtain__count">{String(count).padStart(3, "0")}</span>
              </div>
            ) : (
              <span className="curtain__label">{label}</span>
            )}
          </div>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}
