import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, SplitText } from "@/components/Reveal";
import { TLink } from "@/components/TLink";
import { experience, site, ventures } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.owner}, founder & creative director of Bhashi Creations and Director at Craxe.`,
};

export default function About() {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">About</p>
        <SplitText as="h1" className="display" text={"The mind\nbehind the pixels."} stagger={80} />
      </section>

      <section className="container about">
        <Reveal className="about__media" variant="clip">
          <div className="about__frame">
            <Image src="/brand/dhanika.webp" alt={site.owner} width={1080} height={1350} priority sizes="(max-width: 900px) 90vw, 42vw" />
            <div className="about__overlay">
              <span className="about__overlay-name">Bhashitha Karunanayake</span>
              <span className="about__overlay-role">Founder &amp; Creative Director</span>
            </div>
          </div>
        </Reveal>

        <div className="about__copy">
          <Reveal>
            <p className="lead">
              I&rsquo;m Dhanika Bhashitha Karunanayake, a passionate and creative professional with over 7 years of
              experience in the digital industry, specializing in Marketing Management, Graphic Design, GFX &amp; VFX, and
              3D Architectural Visualization.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p>
              With a strong blend of creativity, technical expertise, and strategic thinking, I transform ideas into
              impactful visual experiences and effective digital solutions. My expertise spans creative design, visual
              storytelling, brand development, digital marketing, video production, and architectural visualization.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p>
              I have hands-on expertise in industry-leading creative software, including Adobe Photoshop, Adobe
              Illustrator, Adobe Premiere Pro, and Autodesk 3ds Max, enabling me to deliver professional graphic designs,
              engaging video content, stunning visual effects, and realistic 3D architectural renders.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p>
              Working with international clients and projects has allowed me to develop a global perspective, adapt to
              diverse creative industries, and deliver high-quality results that meet international standards.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <p>
              I&rsquo;m driven by innovation, creativity, and continuous growth, with a passion for bringing visions to
              life through the perfect combination of strategy, design, and technology.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <dl className="facts">
              <div><dt className="mono">Role</dt><dd>{site.ownerRole}</dd></div>
              <div><dt className="mono">Also</dt><dd>Director, Dudes (Pvt) Ltd · Director, <a className="u-link" href={site.craxe.href} target="_blank" rel="noreferrer">Craxe (Pvt) Ltd</a> · Co-Founder, MX3 Esports</dd></div>
              <div><dt className="mono">Perspectives</dt><dd>Marketing · GFX · 3D · VFX · Motion · Apparel</dd></div>
              <div><dt className="mono">Based in</dt><dd>{site.location}</dd></div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <a className="craxe" href={site.craxe.href} target="_blank" rel="noreferrer">
          <span className="eyebrow">Director</span>
          <span className="craxe__title">Craxe</span>
          <span className="craxe__text">
            Beyond the studio, Dhanika is a Director at Craxe, the web solutions team that built this site.
          </span>
          <span className="craxe__go mono">craxe.org ↗</span>
        </a>
      </section>

      <section className="section container">
        <div className="section__head">
          <div>
            <p className="eyebrow">Leadership</p>
            <SplitText className="title" text={"Business ventures\n& leadership"} />
          </div>
        </div>
        <ul className="ventures">
          {ventures.map((v, i) => {
            const body = (
              <>
                <span className="venture__n mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="venture__org">{v.org}</span>
                <span className="venture__title">{v.title}</span>
                {v.text && <span className="venture__text">{v.text}</span>}
              </>
            );
            return (
              <Reveal as="li" key={v.org} delay={i * 80}>
                {v.href ? (
                  <a href={v.href} target="_blank" rel="noreferrer" className="venture venture--link">
                    {body}
                  </a>
                ) : (
                  <div className="venture">{body}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </section>

      <section className="section container">
        <div className="section__head">
          <div>
            <p className="eyebrow">Experience</p>
            <SplitText className="title" text={"Professional\nexperience"} />
          </div>
        </div>
        <div className="exp">
          {experience.map((g, gi) => (
            <Reveal key={g.region} className="exp__group" delay={gi * 100}>
              <h3 className="exp__region">{g.region}</h3>
              <ul>
                {g.roles.map((r) => (
                  <li key={r.org} className="exp__row">
                    <span className="exp__org">{r.org}</span>
                    <span className="exp__title">{r.title}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container center-cta">
        <SplitText className="title" text={"Want to see the work?"} />
        <TLink href="/portfolio" className="btn btn--solid">Open portfolio →</TLink>
      </section>
    </>
  );
}
