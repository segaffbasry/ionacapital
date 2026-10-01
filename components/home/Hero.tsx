"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import "@/components/motion";
import { Photo, Pill, reducedMotion } from "@/components/ui";
import { hero } from "@/lib/content";
import { splitLines } from "@/lib/split";

/* KAIB's hero: the headline, a grey subtitle and two pills on the left; on the right, a large frame holding the
   moving image (KAIB: its ribbon film). Here the frame holds the live homepage's own scene (digester domes in a
   valley) with the Kanadevia ridge graphic laid along its foot, exactly as ionacapital.co.uk overlays it.
   Entrance (waits for `intro:done` from the preloader): the frame opens downward while the photo settles from
   108% to 100%, the ridge rises into place, the headline's lines rise out of their masks, then the lead, the pills
   and the header nav. This and the preloader are the only heavier moves on the page. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    const title = el.querySelector<HTMLElement>(".hero-title")!;
    const parts = gsap.utils.toArray<HTMLElement>(document.querySelectorAll("[data-hero-part]"));
    const frame = el.querySelector<HTMLElement>("[data-hero-image]")!;
    const img = frame.querySelector("img");
    const ridge = el.querySelector(".hero-ridge");
    if (reducedMotion()) { gsap.set([...parts, frame], { clearProps: "all", opacity: 1, clipPath: "none" }); return; }

    const split = splitLines(title);
    gsap.set(split.words, { yPercent: 110 });
    gsap.set(title, { opacity: 1 });
    let tl: gsap.core.Timeline | null = null;
    const play = () => {
      tl = gsap.timeline({ defaults: { ease: "kaib" } });
      tl.fromTo(frame, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" }, 0)
        .fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.8 }, 0)
        .fromTo(ridge, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2 }, .45);
      split.lines.forEach((line, i) => tl!.to(line, { yPercent: 0, duration: 1 }, .15 + i * .09));
      tl.fromTo(parts.filter((p) => p !== title), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, stagger: .08, clearProps: "transform,opacity" }, .45);
    };
    if (root.dataset.intro === "done") play(); else document.addEventListener("intro:done", play, { once: true });
    return () => { document.removeEventListener("intro:done", play); tl?.kill(); split.revert(); };
  }, []);

  return <section className="hero" ref={ref} data-hero aria-labelledby="hero-title">
    <div className="wrap hero-grid">
      <div className="hero-copy">
        <h1 id="hero-title" className="h1 hero-title" data-hero-part>{hero.title}</h1>
        <p className="hero-lead" data-hero-part>{hero.lead}</p>
        <div className="hero-actions">
          {hero.ctas.map((c) => <Pill key={c.href} href={c.href} reveal={false} data-hero-part>{c.label}</Pill>)}
        </div>
      </div>
      <div className="hero-frame" data-hero-image>
        <Photo media={hero.image} sizes="(min-width: 1024px) 60vw, 100vw" priority reveal={false} className="hero-photo" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-ridge" src={hero.ridge} alt="" aria-hidden="true" width={1600} height={800} />
      </div>
    </div>
  </section>;
}
