"use client";

import { useMemo, useState } from "react";
import { categories, type Category, type Project } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Category | "All">("All");
  const list = useMemo(
    () => projects.map((p, i) => ({ p, i })).filter(({ p }) => active === "All" || p.category === active),
    [active, projects],
  );
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    projects.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return m;
  }, [projects]);

  return (
    <>
      <div className="filters" role="tablist" aria-label="Filter projects by category">
        {(["All", ...categories] as const).map((c) => {
          const n = c === "All" ? projects.length : counts.get(c) ?? 0;
          if (!n) return null;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              className="filter"
              data-active={active === c ? "" : undefined}
              onClick={() => setActive(c)}
            >
              {c}
              <sup>{String(n).padStart(2, "0")}</sup>
            </button>
          );
        })}
      </div>
      <div className="grid" key={active}>
        {list.map(({ p, i }, k) => (
          <div className="grid__item" key={p.slug} style={{ "--k": k } as React.CSSProperties}>
            <ProjectCard project={p} index={i} />
          </div>
        ))}
      </div>
    </>
  );
}
