"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { LocalTime } from "./LocalTime";
import { Scramble } from "./Scramble";
import { TLink } from "./TLink";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/apparel", label: "Apparel" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 200 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
      <header className="nav" data-hidden={hidden && !open ? "" : undefined} data-scrolled={scrolled ? "" : undefined}>
        <div className="nav__bar container">
          <TLink href="/" label="Home" className="nav__logo" aria-label="Bhashi Creations home">
            <Image src="/brand/logo.png" alt="Bhashi Creations" width={640} height={304} priority />
          </TLink>
          <nav className="nav__links" aria-label="Main">
            {LINKS.map((l) => (
              <TLink key={l.href} href={l.href} className="nav__link" data-active={isActive(l.href) ? "" : undefined}>
                <Scramble text={l.label} />
              </TLink>
            ))}
          </nav>
          <div className="nav__end">
            <span className="nav__time mono">
              <span className="dot" />
              {site.clocks.map((c, i) => (
                <span key={c.label}>
                  {i > 0 && <span className="nav__sep">/</span>}
                  {c.label} <LocalTime timeZone={c.timeZone} />
                </span>
              ))}
            </span>
            <TLink href="/contact" className="btn btn--small">
              <Scramble text="Start a project" />
            </TLink>
            <button
              className="nav__burger"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className="menu" data-open={open ? "" : undefined} aria-hidden={!open}>
        <nav className="menu__links container" aria-label="Mobile">
          {LINKS.map((l, i) => (
            <TLink
              key={l.href}
              href={l.href}
              className="menu__link"
              tabIndex={open ? 0 : -1}
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
            </TLink>
          ))}
        </nav>
        <div className="menu__foot container mono">
          {site.socials.slice(0, 4).map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
