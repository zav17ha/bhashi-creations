import { Footer } from "@/components/Footer";
import { Mark } from "@/components/Mark";
import { Nav } from "@/components/Nav";
import { TLink } from "@/components/TLink";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main">
    <section className="notfound container">
      <Mark className="notfound__mark" />
      <p className="eyebrow">Error 404</p>
      <h1 className="display">Lost in the render.</h1>
      <p className="lead">This page doesn&rsquo;t exist, or it&rsquo;s still in post-production.</p>
      <TLink href="/" className="btn btn--solid">Back home →</TLink>
    </section>
      </main>
      <Footer />
    </>
  );
}
