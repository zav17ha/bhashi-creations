"use client";

import { useEffect, useRef } from "react";

/**
 * Evenly spaced grid of tiny square dots behind the hero.
 * Dots near the pointer drift away and brighten, then spring back.
 * It only animates while dots are moving; idle cost is zero.
 * Touch devices and reduced-motion users get the static grid.
 */
export function DotGrid({ gap = 24, size = 2, radius = 130, push = 16 }: { gap?: number; size?: number; radius?: number; push?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const interactive =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, cols = 0, rows = 0, ox0 = 0, oy0 = 0;
    let offX = new Float32Array(0), offY = new Float32Array(0);
    let velX = new Float32Array(0), velY = new Float32Array(0);
    let glow = new Float32Array(0);
    let mx = -1e4, my = -1e4, raf = 0, visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor(w / gap) + 1;
      rows = Math.floor(h / gap) + 1;
      // centre the grid so the margins are even on both sides
      ox0 = (w - (cols - 1) * gap) / 2;
      oy0 = (h - (rows - 1) * gap) / 2;
      const n = cols * rows;
      offX = new Float32Array(n);
      offY = new Float32Array(n);
      velX = new Float32Array(n);
      velY = new Float32Array(n);
      glow = new Float32Array(n);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const half = size / 2;
      for (let r = 0, i = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, i++) {
          const g = glow[i];
          const x = ox0 + c * gap + offX[i];
          const y = oy0 + r * gap + offY[i];
          if (g > 0.02) {
            ctx.fillStyle = `rgba(${Math.round(160 - 113 * g)},${Math.round(180 - 89 * g)},255,${0.16 + g * 0.74})`;
            const s = size + g * 1.5;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
          } else {
            ctx.fillStyle = "rgba(160,180,255,0.16)";
            ctx.fillRect(x - half, y - half, size, size);
          }
        }
      }
    };

    const step = () => {
      raf = 0;
      if (!visible) return;
      let moving = false;
      for (let r = 0, i = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, i++) {
          const bx = ox0 + c * gap;
          const by = oy0 + r * gap;
          const dx = bx - mx;
          const dy = by - my;
          const d = Math.hypot(dx, dy);
          let tx = 0, ty = 0, tg = 0;
          if (d < radius && d > 0.01) {
            const f = 1 - d / radius;
            const k = f * f * push;
            tx = (dx / d) * k;
            ty = (dy / d) * k;
            tg = f;
          }
          // spring toward the target offset
          velX[i] = (velX[i] + (tx - offX[i]) * 0.14) * 0.74;
          velY[i] = (velY[i] + (ty - offY[i]) * 0.14) * 0.74;
          offX[i] += velX[i];
          offY[i] += velY[i];
          glow[i] += (tg - glow[i]) * 0.18;
          if (
            Math.abs(velX[i]) > 0.01 || Math.abs(velY[i]) > 0.01 ||
            Math.abs(offX[i] - tx) > 0.05 || Math.abs(offY[i] - ty) > 0.05 ||
            Math.abs(glow[i] - tg) > 0.01
          ) moving = true;
        }
      }
      draw();
      if (moving) raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (mx < -radius || my < -radius || mx > w + radius || my > h + radius) {
        mx = my = -1e4;
      }
      kick();
    };
    const onLeave = () => {
      mx = my = -1e4;
      kick();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [gap, size, radius, push]);

  return <canvas ref={canvasRef} className="dot-grid" aria-hidden="true" />;
}
