import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { LocalTime } from "@/components/LocalTime";
import { Reveal, SplitText } from "@/components/Reveal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Bhashi Creations: digital marketing, GFX, 3D and VFX.",
};

export default function Contact() {
  return (
    <section className="container contact">
      <aside className="contact__intro">
        <p className="eyebrow">Contact</p>
        <SplitText as="h1" className="title contact__title" text={"Let’s build\nsomething bold."} stagger={70} />
        <Reveal delay={200}>
          <p className="contact__lead">
            Share a few details about your project and they&rsquo;ll arrive as a WhatsApp message to {site.ownerShort}.
          </p>
        </Reveal>

        <Reveal delay={280}>
          <dl className="contact__details">
            <div>
              <dt className="mono">WhatsApp</dt>
              <dd>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">{site.whatsappDisplay}</a>
              </dd>
            </div>
            {site.email && (
              <div>
                <dt className="mono">Email</dt>
                <dd><a href={`mailto:${site.email}`}>{site.email}</a></dd>
              </div>
            )}
            <div>
              <dt className="mono">Local time</dt>
              <dd className="contact__clocks">
                {site.clocks.map((c) => (
                  <span key={c.label}>
                    <LocalTime timeZone={c.timeZone} /> <span className="muted">{c.place}</span>
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="mono">Follow</dt>
              <dd className="contact__socials">
                {site.socials
                  .filter((s) => s.label !== "WhatsApp")
                  .map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
                  ))}
              </dd>
            </div>
          </dl>
        </Reveal>
      </aside>

      <Reveal className="contact__form" delay={120}>
        <ContactForm />
      </Reveal>
    </section>
  );
}
