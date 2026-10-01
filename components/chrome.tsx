"use client";

import gsap from "gsap";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { focusOverlay, usePageMotion } from "@/components/motion";
import { Pill, SocialIcon, linkProps, reducedMotion } from "@/components/ui";
import { footer } from "@/lib/content";
import { contact, nav, onPage, socials } from "@/lib/site";

/* Full-screen menu. In: a navy panel wipes down from the header (clip-path), then every item rises into place one
   after another; one GSAP timeline, so reverse() plays the exact way out. Left: the homepage's own sections
   (scrolled through Lenis). Right: the live site's five nav groups with their sub-pages. Focus is trapped,
   Esc closes, focus returns to the Menu button. */
function Menu({ open, close, trigger }: { open: boolean; close: () => void; trigger: HTMLElement | null }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "kaib" }, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .6, ease: "power3.inOut" }, 0)
      .fromTo(el.querySelectorAll("[data-menu-in]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6, stagger: { amount: .4 } }, .28);
    timeline.current = tl;
    return () => { tl.kill(); timeline.current = null; };
  }, []);

  useEffect(() => {
    const el = root.current, tl = timeline.current; if (!el || !tl) return;
    if (open) {
      el.style.visibility = "visible";
      tl.timeScale(reducedMotion() ? 50 : 1).play();
      return focusOverlay(el, close, trigger);
    }
    if (tl.progress() > 0) tl.timeScale(reducedMotion() ? 50 : 1.6).reverse();
  }, [open, close, trigger]);

  return <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open} data-lenis-prevent data-tone="dark">
    <div className="menu-top wrap">
      <a href="#top" className="brand" onClick={close} aria-label="Kanadevia Inova Capital, back to the top"><Logo id="menu" tone="light" title="" /></a>
      <Pill as="button" tone="dark" className="pill-sm" onClick={close} reveal={false}>Close</Pill>
    </div>
    <div className="menu-body wrap">
      <nav className="menu-page" aria-label="On this page">
        <p className="label" data-menu-in>On this page</p>
        <ul>{onPage.map((l) => <li key={l.href} data-menu-in><a href={l.href} onClick={close} className="menu-big">{l.label}</a></li>)}</ul>
      </nav>
      <nav className="menu-site" aria-label="Kanadevia Inova Capital site">
        {nav.map((g) => <div key={g.href} className="menu-group" data-menu-in>
          <a href={g.href} className="menu-group-title" {...linkProps(g.href)}>{g.label}</a>
          {g.children.length > 0 && <ul>{g.children.map((c) => <li key={c.href}><a href={c.href} {...linkProps(c.href)}>{c.label}</a></li>)}</ul>}
        </div>)}
      </nav>
    </div>
    <div className="menu-foot wrap" data-menu-in>
      <a href={footer.tel}>{footer.phone}</a>
      <a href={contact.href} {...linkProps(contact.href)}>{contact.label}</a>
      <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} {...linkProps(s.href)} aria-label={`Kanadevia Inova Capital on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}</ul>
    </div>
  </div>;
}

/* Frameless header after KAIB's topbar (logo left, text nav, pill buttons right) without its bar: no fill, no rule.
   Its colour follows the section underneath (motion.tsx sets html[data-header]); it slides away on the way down
   and returns on the way up. */
function Header() {
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const bar = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const el = bar.current; if (!el) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, delta = y - last;
      if (y < 80) { el.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(delta) < 6) return;
      el.classList.toggle("is-hidden", delta > 0 && !document.documentElement.classList.contains("overlay-open"));
      last = y;
    };
    const reveal = () => el.classList.remove("is-hidden");
    el.addEventListener("focusin", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener("focusin", reveal); window.removeEventListener("scroll", onScroll); };
  }, []);

  return <>
    <header className="site-header" ref={bar}>
      <div className="wrap site-header-inner">
        <a href="#top" className="brand" aria-label="Kanadevia Inova Capital, back to the top">
          <Logo id="head" tone="color" title="" className="brand-color" />
          <Logo id="head-light" tone="light" title="" className="brand-light" />
        </a>
        <nav className="header-nav" aria-label="Main" data-hero-part>
          <ul>{nav.map((g) => <li key={g.href}><a href={g.href} {...linkProps(g.href)}>{g.label}</a></li>)}</ul>
        </nav>
        <div className="header-actions" data-hero-part>
          <Pill href={contact.href} className="pill-sm header-contact" reveal={false}>Contact</Pill>
          <Pill as="button" className="pill-sm" reveal={false} aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu"
            onClick={(e) => { setTrigger(e.currentTarget); setOpen(true); }}>Menu</Pill>
        </div>
      </div>
    </header>
    <Menu open={open} close={close} trigger={trigger} />
  </>;
}

/* The live footer's own content: white logo, the Pall Mall address and phone, "Key Pages", "Useful Information"
   and the social icons, on navy. */
function Footer() {
  return <footer className="site-footer" data-tone="dark" data-late>
    <div className="wrap">
      <div className="footer-grid">
        <div className="footer-brand" data-reveal="card">
          <a href="#top" aria-label="Kanadevia Inova Capital, back to the top"><Logo id="foot" tone="light" title="" /></a>
          <address>
            {footer.company}<br />{footer.address[0]}<br />{footer.address[1]}<br />
            Tel: <a href={footer.tel}>{footer.phone}</a>
          </address>
        </div>
        {footer.groups.map((g) => <nav key={g.title} className="footer-col" aria-label={g.title} data-reveal="card">
          <h2 className="label">{g.title}</h2>
          <ul>{g.links.map((l) => <li key={l.href}><a href={l.href} {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
        </nav>)}
        <div className="footer-col" data-reveal="card">
          <h2 className="label">Follow</h2>
          <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} {...linkProps(s.href)} aria-label={`Kanadevia Inova Capital on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}</ul>
        </div>
      </div>
      <p className="footer-bar small">{footer.copyright}</p>
    </div>
  </footer>;
}

/* Everything around the page: header and menu, footer, smooth scroll and reveals. */
export function Shell({ children }: { children: ReactNode }) {
  usePageMotion();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" tabIndex={-1} />
    <Header />
    <main id="main" tabIndex={-1}>{children}</main>
    <Footer />
  </>;
}
