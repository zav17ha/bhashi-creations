"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** The 3D brand mark, tilting gently toward the pointer. Animates only while the pointer moves. */
export function TiltMark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--rx", `${(-cy * 8).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(cx * 10).toFixed(2)}deg`);
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className="tilt">
      <div className="tilt__inner">
        <Image
          src="/brand/mark-3d.jpg"
          alt="Bhashi Creations 3D mark"
          width={1400}
          height={1400}
          priority
          sizes="(max-width: 900px) 60vw, 34vw"
          className="tilt__img"
        />
      </div>
    </div>
  );
}
