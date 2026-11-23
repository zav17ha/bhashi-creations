import Image from "next/image";
import type { Project } from "@/content/projects";
import { GeneratedCover } from "./Cover";
import { TLink } from "./TLink";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <TLink href={`/portfolio/${project.slug}`} label={project.title} className="card">
      <div className="card__media">
        {project.cover ? (
          <Image src={project.cover} alt={project.title} fill sizes="(max-width: 800px) 100vw, 50vw" className="card__img" />
        ) : (
          <GeneratedCover project={project} index={index} />
        )}
        <span className="card__sweep" aria-hidden="true" />
        <span className="card__arrow" aria-hidden="true">↗</span>
      </div>
      <div className="card__meta">
        <span className="card__index">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="card__title">{project.title}</h3>
        <span className="card__cat">{project.category}</span>
      </div>
      <p className="card__summary">{project.summary}</p>
    </TLink>
  );
}
