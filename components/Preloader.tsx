"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import "@/components/motion";
import { reducedMotion } from "@/components/ui";
import { logo } from "@/lib/logo";

/* The company signing its name, built from the wordmark's own vector letters (lib/logo.ts).
   The Kanadevia Inova logo has no symbol: it is a two-line wordmark, "Kanadevia" in the green-to-blue gradient over
   "INOVA" in blue. The only free-standing shape is the dot of the i. So it is built like handwriting:
     Build  0.10–0.85s  the nine letters of "Kanadevia" rise out of their baseline one after another (0.4s each,
                        0.045s apart), the i's dot drops onto its stem last, and "INOVA" wipes open left to right
                        underneath (0.45–0.85s).
     Hold   0.85–1.15s
     Exit   1.15–1.70s  the lock-up glides into the header logo position while the white ground fades away. The hero
                        sits on the same white, so there is no colour change; the handover fires at 1.25s so the hero
                        entrance overlaps the landing.
   One GSAP timeline, 1.7s in all. */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    let handed = false;
    const handover = () => {
      if (handed) return; handed = true;
      root.classList.remove("is-loading");
      root.dataset.intro = "done";
      document.dispatchEvent(new Event("intro:done"));
    };
    // The header logo stays hidden (is-landing) until the travelling logo arrives; then the two swap in one frame.
    const finish = () => { handover(); root.classList.remove("is-landing"); el.style.display = "none"; };
    delete root.dataset.intro;
    if (reducedMotion()) { finish(); return; }
    root.classList.add("is-loading", "is-landing"); // already set by the boot script in app/layout.tsx

    const svg = el.querySelector<SVGSVGElement>(".logo")!;
    const letters = gsap.utils.toArray<SVGPathElement>(el.querySelectorAll("[data-letter]:not([data-part='dot'])"));
    const dot = el.querySelector("[data-part='dot']");
    const wipe = el.querySelector("[data-part='wipe']");
    const target = document.querySelector<SVGSVGElement>(".site-header .brand .logo");

    const tl = gsap.timeline({ defaults: { ease: "kaib", duration: .4 }, onComplete: finish });
    tl.set(el.querySelector(".preloader-sign"), { autoAlpha: 1 })
      .fromTo(letters, { y: 46 }, { y: 0, stagger: .045 }, .1)
      .fromTo(dot, { y: -26, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: "back.out(2.2)" }, .52)
      .fromTo(wipe, { attr: { width: 0 } }, { attr: { width: logo.viewBox[2] }, duration: .4, ease: "power2.inOut" }, .45)
      .addLabel("exit", 1.15)
      .add(() => {
        // Measured at exit time so a late web-font or a resize cannot misplace the landing.
        if (!target || !target.getBoundingClientRect().width) return;
        const from = svg.getBoundingClientRect(), to = target.getBoundingClientRect();
        gsap.to(svg, { x: to.left - from.left + (to.width - from.width) / 2, y: to.top - from.top + (to.height - from.height) / 2, scale: to.width / from.width, transformOrigin: "50% 50%", duration: .55, ease: "power3.inOut" });
      }, "exit")
      .to(el, { backgroundColor: "rgba(255,255,255,0)", duration: .5, ease: "kaibOut" }, "exit+=.05")
      .add(handover, "exit+=.1")
      .set({}, {}, "exit+=.55");

    // Development only: lets the intro be paused and scrubbed from the console (window.__intro.pause().seek(.5)).
    if (process.env.NODE_ENV !== "production") (window as unknown as { __intro: gsap.core.Timeline }).__intro = tl;
    window.scrollTo(0, 0);

    // Never hold the page beyond ~2s, even if a frame stalls.
    const failsafe = window.setTimeout(finish, 2300);
    return () => { window.clearTimeout(failsafe); tl.kill(); gsap.killTweensOf(svg); root.classList.remove("is-loading", "is-landing"); };
  }, []);

  return <div className="preloader" ref={ref} aria-hidden="true">
    <div className="preloader-sign"><Logo id="pre" parts title="" /></div>
  </div>;
}
