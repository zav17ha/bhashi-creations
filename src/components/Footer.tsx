import { site } from "@/content/site";
import { LocalTime } from "./LocalTime";
import { Mark } from "./Mark";
import { TLink } from "./TLink";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta">
          <p className="eyebrow">Have a project in mind?</p>
          <TLink href="/contact" className="footer__big">
            <span>Let&rsquo;s make it</span>
            <span className="footer__big-line">
              <span>
                reign<em>.</em>
              </span>
              <span className="footer__arrow" aria-hidden="true">→</span>
            </span>
          </TLink>
        </div>

        <div className="footer__cols">
          <div className="footer__brand">
            <Mark className="footer__mark" />
            <p>
              {site.legalName}
              <br />
              Digital Marketing · GFX · 3D · VFX
            </p>
          </div>
          <div>
            <h4 className="footer__h">Pages</h4>
            <ul>
              <li><TLink href="/">Home</TLink></li>
              <li><TLink href="/portfolio">Portfolio</TLink></li>
              <li><TLink href="/apparel">Apparel</TLink></li>
              <li><TLink href="/services">Services</TLink></li>
              <li><TLink href="/about">About</TLink></li>
              <li><TLink href="/contact">Contact</TLink></li>
            </ul>
          </div>
          <div>
            <h4 className="footer__h">Follow</h4>
            <ul>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="footer__h">Contact</h4>
            <ul>
              <li><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">{site.whatsappDisplay}</a></li>
              {site.email && <li><a href={`mailto:${site.email}`}>{site.email}</a></li>}
              {site.clocks.map((c) => (
                <li key={c.label} className="muted">
                  {c.place} · <LocalTime timeZone={c.timeZone} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom mono">
          <span>© {year} {site.legalName}</span>
          <span>
            Web solutions by{" "}
            <a href={site.craxe.href} target="_blank" rel="noreferrer" className="u-link">Craxe</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
