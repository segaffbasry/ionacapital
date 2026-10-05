"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import "@/components/motion";
import { Photo, Pill, reducedMotion } from "@/components/ui";
import { hero } from "@/lib/content";
import { splitLines } from "@/lib/split";

/* Full-bleed hero (feedback round 1: "the header just needs to be elevated", pointing at the Voltwise demo).
   The whole first screen is the company's own aerial of Gravel Pit Biogas under a wide sky, held in the palette by
   a navy veil that deepens towards the copy. The headline, lead and two pills sit bottom-left in white; the
   Kanadevia ridge graphic runs along the foot of the photo, exactly as the live hero overlays it, and the plant's
   name sits bottom-right as a caption. The header floats over it as glass pills (styles/chrome.css).
   Entrance (waits for `intro:done` from the preloader, whose navy ground fades straight into the veil): the photo
   settles from 108% to 100%, the ridge rises in, the headline's lines rise out of their masks, then the lead,
   pills, caption and header. This and the preloader are the only heavier moves on the page. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    const title = el.querySelector<HTMLElement>(".hero-title")!;
    const parts = gsap.utils.toArray<HTMLElement>(document.querySelectorAll("[data-hero-part]"));
    const img = el.querySelector(".hero-photo img");
    const ridge = el.querySelector(".hero-ridge");
    if (reducedMotion()) return;

    const split = splitLines(title);
    gsap.set(split.words, { yPercent: 110 });
    gsap.set(title, { opacity: 1 });
    let tl: gsap.core.Timeline | null = null;
    const play = () => {
      tl = gsap.timeline({ defaults: { ease: "kaib" } });
      tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 2 }, 0)
        .fromTo(ridge, { yPercent: 60 }, { yPercent: 0, duration: 1.2 }, .3);
      split.lines.forEach((line, i) => tl!.to(line, { yPercent: 0, duration: 1 }, .1 + i * .09));
      tl.fromTo(parts.filter((p) => p !== title), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, stagger: .07, clearProps: "transform,opacity" }, .4);
    };
    if (root.dataset.intro === "done") play(); else document.addEventListener("intro:done", play, { once: true });
    return () => { document.removeEventListener("intro:done", play); tl?.kill(); split.revert(); };
  }, []);

  return <section className="hero" ref={ref} data-hero data-tone="dark" aria-labelledby="hero-title">
    <Photo media={hero.image} sizes="100vw" priority reveal={false} large className="hero-photo" />
    <div className="hero-veil" aria-hidden="true" />
    <div className="hero-ridge" aria-hidden="true" style={{ backgroundImage: `url(${hero.ridge})` }} />
    <div className="wrap hero-inner">
      <div className="hero-copy">
        <h1 id="hero-title" className="hero-title" data-hero-part>{hero.title}</h1>
        <p className="hero-lead" data-hero-part>{hero.lead}</p>
        <div className="hero-actions">
          {hero.ctas.map((c, i) => <Pill key={c.href} href={c.href} tone={i === 0 ? "white" : "glass"} reveal={false} data-hero-part>{c.label}</Pill>)}
        </div>
      </div>
      <p className="hero-caption" data-hero-part>{hero.caption}</p>
    </div>
  </section>;
}
