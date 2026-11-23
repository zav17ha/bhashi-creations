import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GeneratedCover } from "@/components/Cover";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal, SplitText } from "@/components/Reveal";
import { TLink } from "@/components/TLink";
import { getPortfolio, getProjectBySlug } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPortfolio()).map((p) => ({ slug: p.slug }));
}
// Projects added in the admin after a deploy are rendered on first visit.
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await getProjectBySlug(slug);
  if (!found) return {};
  const p = found.project;
  return {
    title: p.title,
    description: p.summary,
    openGraph: p.cover ? { images: [p.cover] } : undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const found = await getProjectBySlug(slug);
  if (!found) notFound();
  const { project, index, all: projects } = found;
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <section className="page-hero container project-hero">
        <TLink href="/portfolio" className="back mono">← All projects</TLink>
        <p className="eyebrow">
          {project.category} · {String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
        </p>
        <SplitText as="h1" className="display" text={project.title} stagger={70} />
        <Reveal delay={300}>
          <dl className="project-meta">
            {project.client && (<div><dt className="mono">Client</dt><dd>{project.client}</dd></div>)}
            <div><dt className="mono">Discipline</dt><dd>{project.category}</dd></div>
            {project.services?.length ? (<div><dt className="mono">Services</dt><dd>{project.services.join(", ")}</dd></div>) : null}
            {project.year && (<div><dt className="mono">Year</dt><dd>{project.year}</dd></div>)}
          </dl>
        </Reveal>
      </section>

      <section className="container">
        <Reveal className="project-cover" variant="clip">
          {project.cover ? (
            <Image src={project.cover} alt={project.title} fill priority sizes="100vw" />
          ) : (
            <GeneratedCover project={project} index={index} />
          )}
        </Reveal>
      </section>

      <section className="section container project-body">
        <div className="project-body__side">
          <p className="eyebrow">Overview</p>
        </div>
        <div className="project-body__main">
          {(project.description ?? [project.summary]).map((para, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className={i === 0 ? "lead" : ""}>{para}</p>
            </Reveal>
          ))}
          {project.link && (
            <Reveal delay={150}>
              <a href={project.link.href} target="_blank" rel="noreferrer" className="btn btn--solid">
                {project.link.label} ↗
              </a>
            </Reveal>
          )}
        </div>
      </section>

      {(project.video || project.embed) && (
        <section className="container project-media">
          <Reveal className="project-video">
            {project.video ? (
              <video src={project.video} controls playsInline preload="metadata" />
            ) : (
              <iframe
                src={project.embed}
                title={`${project.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            )}
          </Reveal>
        </section>
      )}

      {project.gallery?.length ? (
        <section className="container gallery">
          {project.gallery.map((src, i) => (
            <Reveal key={src} className="gallery__item" delay={(i % 2) * 100}>
              <Image src={src} alt={`${project.title}, image ${i + 1}`} width={1600} height={1200} sizes="(max-width: 800px) 100vw, 50vw" />
            </Reveal>
          ))}
        </section>
      ) : null}

      <section className="section container next-project">
        <p className="eyebrow">Next project</p>
        <div className="next-project__card">
          <ProjectCard project={next} index={(index + 1) % projects.length} />
        </div>
      </section>
    </>
  );
}
