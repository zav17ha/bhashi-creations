import type { Metadata } from "next";
import { ApparelGallery } from "@/components/ApparelGallery";
import { Reveal, SplitText } from "@/components/Reveal";
import { TLink } from "@/components/TLink";
import { site } from "@/content/site";
import { getApparel } from "@/lib/store";

export const metadata: Metadata = {
  title: "Esports Apparel",
  description:
    "Esports jerseys, kits and team hoodies designed by Bhashi Creations through Dudes Streetwear, built around each roster's identity and sponsors.",
};

const included = [
  ["Concept & identity", "A design language built from the team's crest, colours and story."],
  ["Names & numbers", "Player names, numbers and nicknames set to read clearly on stream."],
  ["Sponsor layouts", "Partner logos placed front, back and on sleeves with clear hierarchy."],
  ["Mockups & print files", "Front and back mockups for launch posts, plus production-ready artwork."],
];

export default async function Apparel() {
  const kits = await getApparel();

  return (
    <>
      <section className="page-hero container apparel-hero">
        <p className="eyebrow">Esports apparel · Dudes Streetwear</p>
        <SplitText as="h1" className="display" text={"Kits built\nfor the stage."} stagger={80} />
        <Reveal delay={350} className="apparel-hero__row">
          <p className="lead page-hero__lead">
            Jerseys, kits and team hoodies designed by {site.ownerShort} through Dudes Streetwear, each one built around a
            roster&rsquo;s identity, player names and sponsor line-up.
          </p>
          <span className="mono apparel-hero__count">{String(kits.length).padStart(2, "0")} kits</span>
        </Reveal>
      </section>

      <section className="container">
        {kits.length ? (
          <ApparelGallery kits={kits.map((k) => ({ slug: k.slug, title: k.title, cover: k.cover }))} />
        ) : (
          <p className="muted">New kits are on the way.</p>
        )}
      </section>

      <section className="section container">
        <div className="section__head">
          <div>
            <p className="eyebrow">What&rsquo;s in a kit</p>
            <SplitText className="title" text={"From crest\nto print file."} />
          </div>
        </div>
        <ol className="included">
          {included.map(([t, d], i) => (
            <Reveal as="li" key={t} className="included__item" delay={i * 80}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section container center-cta">
        <SplitText className="title" text={"Kit up your team."} />
        <TLink href="/contact" className="btn btn--solid">Start an apparel order →</TLink>
      </section>
    </>
  );
}
