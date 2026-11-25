import Image from "next/image";
import { ClientWall } from "@/components/ClientWall";
import { DotGrid } from "@/components/DotGrid";
import { Reveal, SplitText } from "@/components/Reveal";
import { Scramble } from "@/components/Scramble";
import { TiltMark } from "@/components/TiltMark";
import { TLink } from "@/components/TLink";
import { services, site } from "@/content/site";
import { getClients } from "@/lib/store";

export default async function Home() {
  const clientGroups = await getClients();

  return (
    <>
      <section className="hero">
        <DotGrid />
        <div className="hero__inner container">
          <div className="hero__copy">
            <p className="eyebrow">
              <Scramble auto delay={400} text="Digital Marketing · GFX · 3D · VFX" />
            </p>
            <SplitText as="h1" className="display hero__title" text={"Where\ncreativity\nreigns."} delay={150} stagger={90} />
            <Reveal delay={550}>
              <p className="lead hero__lead">
                Bhashi Creations is the creative studio of {site.ownerShort}, building brands, campaigns and visuals
                that refuse to blend in.
              </p>
            </Reveal>
            <Reveal delay={700} className="hero__ctas">
              <TLink href="/portfolio" className="btn btn--solid">
                View portfolio <span aria-hidden="true">→</span>
              </TLink>
              <TLink href="/contact" className="btn">
                Start a project
              </TLink>
            </Reveal>
          </div>
          <Reveal className="hero__visual" variant="fade" delay={300}>
            <TiltMark />
          </Reveal>
        </div>
        <div className="hero__foot container mono">
          <span>Sri Lanka · UAE · Working worldwide</span>
          <span className="hero__scroll">
            Scroll <i aria-hidden="true" />
          </span>
          <span className="hide-sm">Founder &amp; Creative Director · {site.ownerShort}</span>
        </div>
      </section>

      <section className="section container split-sec">
        <div className="split-sec__head">
          <p className="eyebrow">The studio</p>
          <SplitText className="title" text={"One studio.\nEvery perspective."} />
        </div>
        <div className="split-sec__body">
          <Reveal>
            <p className="lead">
              We turn ideas into visuals people stop scrolling for. Strategy, design, 3D and motion under one roof, so
              your brand looks, moves and speaks like one thing.
            </p>
          </Reveal>
          <ol className="steps-list">
            {[
              ["Think", "Strategy and content that start with your audience."],
              ["Design", "Identity, graphics and 3D with a sharp, consistent edge."],
              ["Move", "Video, VFX and motion that bring it all to life."],
            ].map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 80} className="steps-list__item">
                <span className="mono">0{i + 1}</span>
                <strong>{t}</strong>
                <span>{d}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <ClientWall groups={clientGroups} />

      <section className="section container">
        <div className="section__head">
          <div>
            <p className="eyebrow">What we do</p>
            <SplitText className="title" text={"Perspectives"} />
          </div>
          <TLink href="/services" className="link-arrow">
            <Scramble text="All services" /> <span aria-hidden="true">→</span>
          </TLink>
        </div>
        <ul className="disc-grid">
          {services.map((s, i) => (
            <Reveal as="li" key={s.code} delay={(i % 3) * 70}>
              <TLink href={"href" in s ? s.href : "/services"} className="disc">
                <span className="disc__top">
                  <span className="mono">{s.code}</span>
                  <span className="disc__arrow" aria-hidden="true">↗</span>
                </span>
                <span className="disc__title">{s.title}</span>
                <span className="disc__tags">{s.tags.slice(0, 3).join(" · ")}</span>
              </TLink>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section container founder">
        <Reveal className="founder__media" variant="clip">
          <Image src="/brand/dhanika.webp" alt={site.owner} width={1080} height={1350} sizes="(max-width: 900px) 90vw, 40vw" />
        </Reveal>
        <div className="founder__copy">
          <p className="eyebrow">The founder</p>
          <SplitText className="founder__quote" text={"The mind,\nbehind the pixels."} />
          <Reveal delay={200}>
            <p className="founder__name">{site.owner}</p>
            <p className="muted">
              Founder &amp; Creative Director, Bhashi Creations · Director,{" "}
              <a className="u-link" href={site.craxe.href} target="_blank" rel="noreferrer">
                Craxe
              </a>{" "}
              · Co-Founder, MX3 Esports
            </p>
            <TLink href="/about" className="btn">
              About Dhanika <span aria-hidden="true">→</span>
            </TLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
