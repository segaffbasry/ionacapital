/* One easing family for the whole site, measured on kaib-invest.com (assets/main-BNFPeRSb.css, assets/event-D0iGaMlh.js).
   The CSS twins live in app/globals.css as --ease-* custom properties. */

// KAIB's tab underline and news-row hover: `transition: transform .5s cubic-bezier(.25,1,.3,1)`. A long, soft
// ease-out; every reveal on this page uses it.
export const EASE = "0.25,1,0.3,1";
// KAIB `.fade-in-section` and `.button-ui`: plain CSS `ease-out` = cubic-bezier(0,0,.58,1).
export const EASE_OUT = "0,0,0.58,1";

export const timing = {
  // KAIB fades sections in over .5s (desktop) from 30px; headings and cards keep that, text lines and images run longer
  // because they travel further (a full line height, a full clip).
  label: 0.5,
  heading: 0.7,
  text: 0.8,
  lineStagger: 0.07,
  card: 0.6,
  cardStagger: 0.08,
  image: 1.1,
  late: 0.75, // multiplier for sections marked data-late
};

// KAIB's IntersectionObserver: { rootMargin: "0px 0px -10% 0px", threshold: .2 } → ScrollTrigger "top 90%" (+20% of the element).
export const REVEAL_START = "top 88%";
// KAIB rises fade-ins 30px (desktop) / 20px (below 1280px).
export const RISE = 30;

// KAIB "silky scroll": each frame moves 7.5% of the way to the target (`l += (h - l) * K`, K = .075). Lenis' lerp is the same factor.
export const SCROLL_LERP = 0.075;
// KAIB anchor scroll: 800ms easeInOutQuad (`e < .5 ? 2e² : -1 + (4 - 2e)e`).
export const ANCHOR = { duration: 0.8, easing: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t) };
