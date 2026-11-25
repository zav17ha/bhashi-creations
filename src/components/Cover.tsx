import type { Project } from "@/content/projects";

/* Deterministic PRNG so server and client draw the same cover. */
function seeded(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const KNOWN: Record<string, string> = {
  Apparel: "APP",
  "Graphic Design": "GFX",
  "3D": "3D",
  "VFX & Video": "VFX",
  Motion: "MOT",
  Marketing: "MKT",
};
/** Short code printed on generated covers; derived from the name for custom categories. */
const codeFor = (category: string) =>
  KNOWN[category] ??
  (category.match(/[A-Za-z0-9]+/g) ?? ["WRK"])
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(2, "X");

/**
 * Generated artwork used until a real cover image is added:
 * angular facets (cut at the logo's angle) over a pixel grid.
 */
export function GeneratedCover({ project, index }: { project: Project; index: number }) {
  const rnd = seeded(project.slug);
  const id = `g-${project.slug}`;
  const hue = 222 + Math.round(rnd() * 16);
  const facets = Array.from({ length: 4 }, (_, k) => {
    const x = 60 + rnd() * 280;
    const y = 30 + rnd() * 180;
    const s = 70 + rnd() * 120;
    const pts = [
      [x, y],
      [x + s * 0.62, y + s * 0.7],
      [x + s * 0.5, y + s * 0.84],
      [x + s, y + s * 1.3],
      [x + s * 0.06, y + s * 2],
    ]
      .map((p) => p.map((n) => n.toFixed(1)).join(","))
      .join(" ");
    return { pts, o: 0.18 + k * 0.14, stroke: k === 3 };
  });
  const pixels = Array.from({ length: 22 }, () => ({
    x: Math.floor(rnd() * 20) * 20,
    y: Math.floor(rnd() * 15) * 20,
    o: 0.15 + rnd() * 0.6,
  }));

  return (
    <svg className="gen-cover" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 85% 8%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 90% 22%)`} />
        </linearGradient>
        <linearGradient id={`${id}-f`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#6f8cff" />
          <stop offset="1" stopColor="#1a3dff" />
        </linearGradient>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect x="9" y="9" width="2" height="2" fill="rgba(255,255,255,.12)" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-bg)`} />
      <rect width="400" height="300" fill={`url(#${id}-grid)`} />
      {pixels.map((p, i) => (
        <rect key={i} x={p.x + 3} y={p.y + 3} width="14" height="14" fill="#2f5bff" opacity={p.o * 0.6} />
      ))}
      {facets.map((f, i) =>
        f.stroke ? (
          <polygon key={i} points={f.pts} fill="none" stroke="#e8eeff" strokeWidth="1.2" opacity="0.55" />
        ) : (
          <polygon key={i} points={f.pts} fill={`url(#${id}-f)`} opacity={f.o} />
        ),
      )}
      <text x="20" y="282" className="gen-cover__code">
        {codeFor(project.category)}/{String(index + 1).padStart(2, "0")}
      </text>
    </svg>
  );
}
