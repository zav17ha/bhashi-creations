import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { Reveal, SplitText } from "@/components/Reveal";
import { getCategories, getPortfolio } from "@/lib/store";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected graphic design, 3D, VFX, motion and marketing projects by Bhashi Creations.",
};

export default async function Portfolio() {
  const [projects, categories] = await Promise.all([getPortfolio(), getCategories()]);
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Portfolio · {String(projects.length).padStart(2, "0")} projects</p>
        <SplitText as="h1" className="display" text={"Selected\nworks."} stagger={90} />
      </section>
      <section className="container portfolio">
        <PortfolioGrid projects={projects} categories={categories} />
        <Reveal className="portfolio__more">
          <p className="muted">
            More work lives on{" "}
            <a className="u-link" href="https://linktr.ee/bhashicreations0" target="_blank" rel="noreferrer">Linktree</a>{" "}
            and{" "}
            <a className="u-link" href={site.socials[0].href} target="_blank" rel="noreferrer">Facebook</a>.
          </p>
        </Reveal>
      </section>
    </>
  );
}
