import type { Metadata } from "next";
import { Reveal, SplitText } from "@/components/Reveal";
import { TLink } from "@/components/TLink";
import { services } from "@/content/site";
import { slugify } from "@/lib/validate";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital marketing, graphic design, 3D visualization, VFX & video, motion design and esports apparel by Bhashi Creations.",
};

const steps = [
  ["Discover", "Goals, audience and competitors, and what success looks like."],
  ["Concept", "Moodboards and first directions. You pick the route; we sharpen it."],
  ["Create", "Design, 3D, shoots and edits, with check-ins along the way."],
  ["Deliver", "Final files for every platform, plus guidance to stay consistent."],
];

export default function Services() {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Services</p>
        <SplitText as="h1" className="display" text={"Six disciplines.\nOne vision."} stagger={80} />
        <Reveal delay={350}>
          <p className="lead page-hero__lead">
            Hire one discipline or the whole studio. Either way, one creative eye across everything your brand puts out.
          </p>
        </Reveal>
      </section>

      <section className="container svc">
        <nav className="svc__index" aria-label="Services">
          <p className="eyebrow">Index</p>
          <ol>
            {services.map((s) => (
              <li key={s.code}>
                <a href={`#${slugify(s.title)}`}>
                  <span className="mono">{s.code}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="svc__list">
          {services.map((s) => (
            <Reveal as="article" key={s.code} className="svc-item">
              <span id={slugify(s.title)} className="svc-item__anchor" />
              <header className="svc-item__head">
                <span className="mono">{s.code}</span>
                <h2>{s.title}</h2>
              </header>
              <p className="svc-item__text">{s.text}</p>
              <ul className="svc-item__list">
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {"href" in s && (
                <TLink href={s.href} className="link-arrow svc-item__link">
                  See the apparel <span aria-hidden="true">→</span>
                </TLink>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <div>
            <p className="eyebrow">Process</p>
            <SplitText className="title" text={"How we work"} />
          </div>
        </div>
        <ol className="timeline">
          {steps.map(([t, d], i) => (
            <Reveal as="li" key={t} className="timeline__step" delay={i * 90}>
              <span className="timeline__dot" aria-hidden="true" />
              <span className="mono">Step {String(i + 1).padStart(2, "0")}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section container center-cta">
        <SplitText className="title" text={"Got a brief?"} />
        <TLink href="/contact" className="btn btn--solid">Start a project →</TLink>
      </section>
    </>
  );
}
