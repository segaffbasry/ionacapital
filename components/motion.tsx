"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { reducedMotion } from "@/components/ui";
import { ANCHOR, EASE, EASE_OUT, REVEAL_START, RISE, SCROLL_LERP, timing } from "@/lib/ease";
import { getLenis, setLenis } from "@/lib/scroll";
import { splitLines } from "@/lib/split";

// Registered at module load so the preloader, hero and menu can build timelines on "kaib" in their own effects.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("kaib", EASE);
  CustomEase.create("kaibOut", EASE_OUT);
}

/* The reveal set (README "Motion system"): one small fixed set of moves, applied the same way everywhere.
   label    labels, pills, small links: fade and a 12px rise
   heading  the whole phrase fades and rises 30px, never split (KAIB .fade-in-section: translateY(30px), opacity 0)
   text     paragraphs: each rendered line rises out of its own mask, a beat after the one above
   card     cards and rows: batched, fade and 30px rise, 0.08s apart
   image    photography clips open from the bottom edge; [data-parallax] adds ±5% drift while it crosses the screen
   All play once, on KAIB's cubic-bezier(.25,1,.3,1); inside [data-late] sections they run at 75% of the duration. */
export function usePageMotion() {
  useEffect(() => {
    const reduced = reducedMotion();
    const root = document.documentElement;

    /* Links never leave the page (standing rule for these private demos): hrefs stay real and verifiable,
       but a capture-phase guard cancels any click or middle-click on a link that doesn't start with "#". */
    const stayOnPage = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (link && !link.getAttribute("href")!.startsWith("#")) event.preventDefault();
    };
    document.addEventListener("click", stayOnPage, true);
    document.addEventListener("auxclick", stayOnPage, true);

    /* Smooth scroll. KAIB's "silky scroll" moves the page 7.5% of the remaining distance every frame
       (event-D0iGaMlh.js: `l += (h - l) * .075`). Lenis in lerp mode does exactly that. Driven by the GSAP ticker
       so ScrollTrigger reads the same frame. */
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: SCROLL_LERP, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      if (root.classList.contains("is-loading")) lenis.stop();
    }
    const start = () => getLenis()?.start();
    document.addEventListener("intro:done", start);

    // In-page anchors go through Lenis (KAIB: 800ms easeInOutQuad) and move focus to the target.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
      if (!link) return;
      const hash = link.getAttribute("href")!;
      const target = hash === "#top" ? null : document.querySelector<HTMLElement>(hash);
      if (hash !== "#top" && !target) return;
      event.preventDefault();
      if (lenis) { lenis.start(); lenis.scrollTo(target ?? 0, { duration: ANCHOR.duration, easing: ANCHOR.easing }); }
      else (target ?? document.body).scrollIntoView();
      target?.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    /* Reveals. */
    const splits: { revert: () => void }[] = [];
    const scale = (el: Element) => (el.closest("[data-late]") ? timing.late : 1);
    // data-shown lifts the CSS start-state guards (globals.css) once GSAP has set its own start states.
    const mark = () => document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-shown", ""));
    const ctx = gsap.context(() => {
      if (reduced) { mark(); return; }
      const all = (kind: string) => gsap.utils.toArray<HTMLElement>(`[data-reveal="${kind}"]:not([data-hero] [data-reveal])`);
      const once = (el: Element, play: () => void, start = REVEAL_START) => ScrollTrigger.create({ trigger: el, start, once: true, onEnter: play });

      all("label").forEach((el) => {
        gsap.set(el, { opacity: 0, y: 12 });
        once(el, () => gsap.to(el, { opacity: 1, y: 0, duration: timing.label * scale(el), ease: "kaib", clearProps: "transform,opacity" }), "top 94%");
      });

      all("heading").forEach((el) => {
        gsap.set(el, { opacity: 0, y: RISE });
        once(el, () => gsap.to(el, { opacity: 1, y: 0, duration: timing.heading * scale(el), ease: "kaib", clearProps: "transform,opacity" }));
      });

      all("text").forEach((el) => {
        const split = splitLines(el);
        splits.push(split);
        gsap.set(split.words, { yPercent: 105 });
        once(el, () => split.lines.forEach((line, i) => gsap.to(line, { yPercent: 0, duration: timing.text * scale(el), ease: "kaib", delay: i * timing.lineStagger * scale(el) })), "top 92%");
      });

      const cards = all("card");
      gsap.set(cards, { opacity: 0, y: RISE });
      ScrollTrigger.batch(cards, { start: "top 92%", once: true, onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: timing.card * scale(batch[0]), ease: "kaib", stagger: timing.cardStagger, clearProps: "transform,opacity" }) });

      all("image").forEach((el) => {
        gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
        once(el, () => gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: timing.image * scale(el), ease: "kaib", clearProps: "clipPath" }), "top 90%");
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const media = el.querySelector("img"); if (!media) return;
        gsap.fromTo(media, { yPercent: -5, scale: 1.1 }, { yPercent: 5, scale: 1.1, ease: "none", scrollTrigger: { trigger: el, scrub: true, start: "top bottom", end: "bottom top" } });
      });
      mark();
    });

    /* The header takes its colour from whichever section is under it ([data-tone="dark"] flips it to white). */
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = 32;
      const dark = Array.from(document.querySelectorAll<HTMLElement>("main [data-tone='dark'], footer[data-tone='dark']")).some((el) => {
        const r = el.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe;
      });
      root.dataset.header = dark ? "dark" : "light";
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      document.removeEventListener("click", stayOnPage, true);
      document.removeEventListener("auxclick", stayOnPage, true);
      document.removeEventListener("click", onClick);
      document.removeEventListener("intro:done", start);
      window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); window.removeEventListener("load", refresh);
      cancelAnimationFrame(frame);
      ctx.revert();
      splits.forEach((split) => split.revert());
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy(); setLenis(null);
    };
  }, []);
}

/* Traps focus inside an overlay, closes on Escape, pauses the page scroll and returns focus to the trigger. */
export function focusOverlay(container: HTMLElement, close: () => void, trigger?: HTMLElement | null) {
  const previous = trigger ?? (document.activeElement as HTMLElement);
  getLenis()?.stop();
  document.documentElement.classList.add("overlay-open");
  const focusable = () => Array.from(container.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex='0']")).filter((el) => el.offsetParent !== null);
  focusable()[0]?.focus({ preventScroll: true });
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (event.key === "Tab") {
      const items = focusable(); const first = items[0]; const last = items[items.length - 1];
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener("keydown", handleKey);
  return () => {
    document.removeEventListener("keydown", handleKey);
    document.documentElement.classList.remove("overlay-open");
    getLenis()?.start();
    previous?.focus({ preventScroll: true });
  };
}
