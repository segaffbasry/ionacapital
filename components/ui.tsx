import type { ReactNode } from "react";
import { brandIcons, type BrandIcon } from "@/lib/brand-icons";
import { srcSet, type Media } from "@/lib/content";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Links that leave the page open in a new tab with rel="noopener" (brief); motion.tsx keeps them from navigating at all.
export const linkProps = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {});

/* THE COPIED INTERACTION (README "Copied interaction"): kaib-invest.com's `.button-ui`, the pill used for
   "Explore our solutions", "Request institutional access", SERVICES and CONTACT. Its CSS (main-BNFPeRSb.css, ≥1280px):
     .button-ui        { border: 1px solid --color-black100; border-radius: 28px;
                         transition: background-color .2s ease-out, border-color .2s ease-out, transform .2s ease-out, opaicty .2s ease-out }
     .button-ui:hover  { background-color: --color-button-active; border-color: --color-button-active; opacity: .9 }
     .button-ui:active { transform: scale(.93); opacity: .9 }
   The element is an <a> filling a rounded box, with the label in a span padded 0 32px (desktop-xl). Rebuilt as-is in
   styles/ui.css (.pill): same properties, durations and curve (--pill-dur, --ease-out), colours swapped for palette
   tints. KAIB misspells "opacity" in its transition list, so its opacity change is instant; that is kept. */
export function Pill({ href, children, tone = "light", className = "", reveal = true, onClick, as = "a", ...rest }: {
  href?: string; children: ReactNode; tone?: "light" | "solid" | "dark" | "white" | "glass"; className?: string; reveal?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void; as?: "a" | "button";
} & Record<string, unknown>) {
  const cls = `pill pill-${tone} ${className}`;
  const data = reveal ? { "data-reveal": "label" } : {};
  if (as === "button") return <button type="button" className={cls} onClick={onClick} {...data} {...rest}><span>{children}</span></button>;
  return <a href={href} className={cls} onClick={onClick} {...data} {...linkProps(href ?? "")} {...rest}><span>{children}</span></a>;
}

export function Arrow() {
  return <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M1 6h9.5M6.5 2 10.5 6l-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

/* KAIB's round card button (insight-news-button / chevron-right.svg in a 1px #a6acb2 circle). */
export function Chevron({ className = "" }: { className?: string }) {
  return <span className={`chevron ${className}`} aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 14 14" focusable="false"><path d="M5 2.5 9.5 7 5 11.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>;
}

export function SocialIcon({ icon, size = 18 }: { icon: BrandIcon; size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"><path d={brandIcons[icon]} fill="currentColor" /></svg>;
}

/* Photography: a 2-width srcset, the palette treatment (styles/ui.css .photo) and an optional parallax wrapper. */
export function Photo({ media, sizes, className = "", priority = false, parallax = false, reveal = true, large = false }: {
  media: Media; sizes: string; className?: string; priority?: boolean; parallax?: boolean; reveal?: boolean; large?: boolean;
}) {
  return <figure className={`photo ${className}`} data-reveal={reveal ? "image" : undefined} data-parallax={parallax ? "" : undefined}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`${media.src}-1600.jpg`} srcSet={srcSet(media, large)} sizes={sizes} alt={media.alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" style={media.position ? { objectPosition: media.position } : undefined} />
  </figure>;
}
