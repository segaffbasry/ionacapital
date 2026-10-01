# Kanadevia Inova Capital: homepage redesign (private prospect demo)

A one-page rebuild of [ionacapital.co.uk](https://ionacapital.co.uk/), the site of **Kanadevia Inova Capital** (formerly Iona Capital). It uses the company's own wordmark, fonts, photography and copy, restaged on the layout and motion of the reference site [kaib-invest.com](https://kaib-invest.com/). **Scope: homepage only.** Every other link points at the real page on ionacapital.co.uk.

Stack: Next.js 16 (App Router, TypeScript), GSAP + ScrollTrigger + CustomEase, and Lenis. No UI kit, no CSS framework and no other animation library. Plain CSS lives in `app/globals.css` and `styles/*.css`.

```bash
npm install
npm run dev        # http://127.0.0.1:3027
npm run build      # static build of the single route
npm run typecheck
npm run scrape     # refresh content/home.json from the live homepage, /sustainable-investment-focus/, the 3 sector pages and /investments/
npm run media      # re-download the photography and the ridge graphic, re-cut public/media (needs python3 + Pillow)
npm run logo       # rebuild lib/logo.ts, public/brand/*.svg and app/icon.svg from the live wordmark (needs python3 + fontTools + Pillow)
```

## Routes

| Route | What |
|---|---|
| `/` | The homepage. Statically generated. |
| `/icon.svg` | Favicon: the gradient "K" of the wordmark on a white tile. |

`next build` generates 4 static pages: `/`, `/_not-found` and `/icon.svg` in the route table, plus Next's internal page. There are no archive or detail pages.

## Recon (Phase 1)

**Live homepage, every visible section** (Elementor 4.3, Hello theme):

| # | Live section (Elementor id) | Items |
|---|---|---|
| 1 | Hero `80ee7b4`: landscape photo (`Iona-Head.jpg`) with the Kanadevia ridge graphic as overlay, H1 "Sustainable Infrastructure Investment", lead, "Who We Are" + "What We Do" | 1 + 2 CTAs |
| 2 | Purpose Statement `6b4cfc3d`: "For a future free of wasted waste." | 1 |
| 3 | "Sustainability Expertise / Articles" `703bd79c`: posts widget (latest 3) + "Discover Our Sustainablity Insights" | 3 + 1 CTA |
| 4 | `35f0edc4`: "for Investors" / "for Developers" image boxes, each with a button | 2 + 2 CTAs |
| 5 | Footer `2b278cd`: white logo, Pall Mall address + phone, Key Pages (5), Useful Information (4), X / LinkedIn / envelope | 9 links + 3 icons |

**Sitemaps:** `sitemap_index.xml` (Yoast): pages (15), posts (127), categories, tags, authors. Used to verify every outgoing link and to find the pages the homepage's buttons and nav lead to.

**Brand:**
- **Logo:** the header logo is a real vector, `wp-content/uploads/2021/02/kanadevia.svg` (viewBox 286.3 × 96.38). "Kanadevia" is one clip path of 15 sub-paths painted with an embedded 620 × 128 PNG gradient; "INOVA" is five paths filled `#2862a0`. `scripts/logo.py` groups the sub-paths into letters (counters merged into their outline), keeps the i's dot separate, and samples the PNG into a 5-stop SVG gradient (`#008c6b → #008b79 → #058292 → #0d76a9 → #196daf`), so nothing raster remains. Output: `lib/logo.ts` (10 + 5 letter parts), `public/brand/kanadevia-inova-dark.svg` (colour), `-light.svg` (white, matching the live `Logo_footer.svg`), `-kanadevia.svg`, `-inova.svg` (the two words alone), all transparent.
- **The wordmark has no symbol.** Its only free-standing shape is the dot of the i, which the preloader uses as its final beat.
- **Brand graphic:** `Kanadevia_graphic_element_RGB1920px.png`, a green-to-blue mountain ridge on transparency, laid over the bottom of the live hero (post-7.css `.elementor-background-overlay`). Kept as PNG and used the same way.
- **Favicon:** the live site has none of its own beyond WordPress defaults; `app/icon.svg` is the gradient "K".
- **Brand film:** none exists (no video on the site, no YouTube channel linked).
- **Fonts:** the live kit loads Raleway (hero H1, 700) and Noto Sans (everything else). Both self-hosted from `@fontsource-variable` (latin, variable weight).

**Structure:** header = logo, About (→ Team), Sustainability, Investment Focus (→ Bioenergy, Energy From Waste, Energy Efficiency), Investments, News (→ Insights), plus X, LinkedIn and a contact envelope. Footer as in the table above. Socials: X ([twitter.com/iona_capital](https://twitter.com/iona_capital?lang=en)) and LinkedIn ([iona-capital-ltd](https://www.linkedin.com/company/iona-capital-ltd/)).

**Photography found:** 20 real uploads across the page HTML and the Elementor post CSS of each page (`_scrape/css/post-*.css`): plant aerials (Brocklesby, Bridgwater, Crofthead, Cothen, Gravel Pit, Wardley), the hero valley, the London office, CHP and energy storage. No stock.

## Decisions (brief brackets left open)

| Bracket | Decision |
|---|---|
| Company name | **Kanadevia Inova Capital** (the live site's own name since the December 2024 acquisition; the domain still says Iona). |
| References | One reference was given, kaib-invest.com, so it serves as both **look and layout** and **motion and scroll**. |
| Palette | Proposed and applied: **Navy `#004961`**, **Kanadevia Green `#00a082`**, **Inova Blue `#2862a0`**, **White**. To be confirmed; every colour is a token on `:root`, so a swap is one edit. |
| Copied interaction | KAIB's `.button-ui` pill (hover + press), see "Copied interaction". |
| Fonts | UI/body: **Noto Sans**. Display (hero, section titles, quote, menu, facts): **Raleway** 700. Both from the live site. |
| Preloader frequency | Plays on every page load (the brief's default). |
| PostHog key | The standing Regen EU key (`lib/posthog.ts`), overridable with `NEXT_PUBLIC_POSTHOG_KEY`. |
| Homepage-only content | The live homepage has four content blocks. To reach the brief's 6 to 8 sections with real material, three sections carry items the homepage itself links to: the two About paragraphs ("Who We Are" button), the Investment Focus page and its three sectors ("What We Do" button + nav), and the portfolio list (nav "Investments"). |
| KAIB features not used | Its fixed 1px side frame lines, the "···" section dividers and its 150px section margins. Recent Regen feedback rejected ruled frames and "weird lines" as AI-looking, and the brief caps section padding at 96px. |
| Copy fixes | "Sustainablity" in the live insights button is corrected; "for Investors / for Developers" get a capital first letter in CSS only; dashes are removed by `undash()` ("the case for KVI — just click" → "the case for KVI, just click"). |

### Palette

| Token | Hex | Source | Use |
|---|---|---|---|
| `--navy` | `#004961` | live CSS text colour `rgb(0,73,97)` | headings, body text tints, footer, menu, solid pills |
| `--green` | `#00a082` | live CSS `rgb(0,160,130)`, start of the wordmark gradient | gradient start (facts, list dots), menu hover tint |
| `--blue` | `#2862a0` | "INOVA" fill in kanadevia.svg | gradient end, text links, focus ring, pill hover tint |
| `--white` | `#ffffff` | | ground |

Neutrals are `color-mix()` tints of navy (`--ink-2` 84%, `--ink-3` 78%, `--line` 16%, `--card` 5%) so they stay in the same hue. Contrast (computed, WCAG): navy on white 9.9:1; `--ink-2` 6.4:1 on white, 5.9:1 on `--card`; `--ink-3` (labels, dates) 5.4:1 on white, 4.7:1 on the row hover tint; blue links 6.3:1. On navy: white 9.9:1, the 78% white tint 6.7:1, the 70% tint (copyright) 5.7:1. The only gradient is the brand's own green to blue (logo, ridge graphic, fact numbers, list dots).

## Homepage

| # | Section | Look (KAIB pattern) | Live items | Built | Notes |
|---|---|---|---|---|---|
| 1 | Hero `[data-hero]` | headline + subtitle + 2 pills left, large 1px-framed media right | 1 H1, 1 lead, 2 CTAs, 1 photo, ridge | all | Photo: `VILE4778.jpg` (same valley and domes as the live `Iona-Head.jpg`, taller crop). Ridge overlay as live. |
| 2 | Purpose `#purpose` | indented statement, two photos, label \| text rows on hairlines | 1 quote | quote + 2 About paragraphs + 2 photos | |
| 3 | Investment Focus `#focus` | title left / subtitle + text right, then one grey card per service with image, title, text and round chevron | (button target) | 4 value points, 3 sector cards, 1 CTA | Sector text: each page's own paragraph about the firm's work (Bioenergy: its first two paragraphs). |
| 4 | Investments `#investments` | photo + heading/text, then ruled rows | (nav target) | 3 facts, 21 of 21 assets, 1 CTA | Facts are published figures: 17 operating plants (Wardley article, Oct 2025), "unlevered returns of 10% +" and "PRI A rating across all categories" (/sustainable-investment-focus/). All 21 assets are shown: they are one-line names in a 3-column ruled list (7 rows), shorter than a capped list plus explanation. |
| 5 | Articles `#articles` | indented heading, news rows (meta, title, text, chevron) with hover tint | 3 posts + 1 CTA | 3 posts (same three, same order) + 1 CTA | Rows add each post's featured image (as the live cards do). Text: each article's verbatim standfirst, clamped to 3 lines; the homepage excerpts repeat the title. |
| 6 | For investors / developers `#partners` | two grey cards side by side | 2 + 2 CTAs | 2 + 2 CTAs | |
| 7 | Footer | | address, phone, 9 links, 2 socials + envelope | all | Envelope is the "Contact Us" link in Useful Information and the header "Contact" pill. |

**Page height** (headless Chrome, production build, after all reveals):

| Width | Height | Viewports |
|---|---|---|
| 375 × 812 | 7,594px | 9.4 |
| 768 × 1024 | 7,301px | 7.1 |
| 1440 × 900 | 6,662px | 7.4 |

Section heights at 1440: hero 900, purpose 1,213, focus 1,596, investments 1,163, articles 982, partners 426, footer 382.

## How it works

### Files

```
app/layout.tsx          metadata (live title, noindex), boot script, PostHog, font preloads, <Shell>
app/page.tsx            → components/home/Home.tsx
components/Preloader.tsx   the intro timeline
components/Logo.tsx        the wordmark from lib/logo.ts (color / light / current tones, preloader parts)
components/motion.tsx      Lenis, reveals, link guard, header tone, focus trap
components/chrome.tsx      header, full-screen menu, footer, <Shell>
components/ui.tsx          Pill (the copied interaction), Chevron, Photo, SocialIcon
components/home/*.tsx      one file per section
content/home.json          scraped copy (npm run scrape)
lib/content.ts             every word on the page, shaped from home.json; undash()
lib/site.ts                nav, socials, on-page anchors
lib/ease.ts                easing curves, durations, scroll lerp (measured on KAIB)
lib/logo.ts                generated letter paths + gradient
lib/split.ts               line splitter for the paragraph reveal
lib/posthog.ts             analytics snippet
scripts/                   scrape.mjs, media.py, logo.py
styles/ui.css              pill, chevron, photo treatment, socials
styles/chrome.css          preloader, header, menu, footer
styles/home.css            sections
```

### Preloader

The company signs its name with its own letters. The wordmark is two lines of type and has no symbol, so it is built like handwriting rather than assembled like tiles:

| Time | Stage | What happens |
|---|---|---|
| 0.10 to 0.86s | Build | The nine letters of "Kanadevia" rise out of their baseline (clip path), 0.4s each, 0.045s apart, in the brand gradient. The i's dot drops onto its stem last with a small overshoot (`back.out`). "INOVA" wipes open left to right underneath (0.45 to 0.85s, a growing clip rect). |
| 0.86 to 1.15s | Hold | |
| 1.15 to 1.70s | Exit | The lock-up glides and scales into the header logo position (measured at exit time) while the white ground fades away. The hero sits on the same white, so nothing changes colour. |

One GSAP timeline, 1.7s. `intro:done` fires at 1.25s, so the hero entrance overlaps the landing. Handover removes `is-loading` from `<html>`, sets `data-intro="done"` and dispatches `intro:done`; Lenis is stopped until then. The header logo is hidden (`is-landing`) until the travelling logo arrives, then the two swap in one frame. A 2.3s failsafe releases the page even if frames stall. Reduced motion skips it instantly; `<noscript>` hides it; the effect cleans up its timeline and classes. The browser's scroll restoration is off so the intro always starts at the top (KAIB does the same with `scrollTo(0, 0)` on load).

Measured (production build, headless Chrome 1440 × 900): first paint 44ms (white), `intro:done` 1.31s, preloader gone 1.77s after navigation. Frames at 150 / 450 / 700 / 1000 / 1300 / 1600 / 2100ms showed white, build, hold, glide + hero opening, settled. There was no flash of page or hero before it and no colour jump.

### Hero entrance

Waits for `intro:done`. The frame opens downward (clip, 1.2s), the photo settles from 108% to 100% (1.8s), the ridge rises in (1.2s), the H1's lines rise out of their masks 0.09s apart, then the lead, pills and header nav fade up 0.08s apart. The preloader and the hero are the only places with heavier motion.

### Motion system

Measured on kaib-invest.com:
- `main-BNFPeRSb.css`: `.fade-in-section` is translateY(30px) + opacity, 0.5s ease-out. The tab line and news row use `cubic-bezier(.25,1,.3,1)`.
- `event-D0iGaMlh.js`: IntersectionObserver `{ rootMargin: "0px 0px -10% 0px", threshold: .2 }`. Silky scroll `l += (h - l) * .075`. Anchors are 800ms easeInOutQuad.

| Move | Applied to | Values |
|---|---|---|
| label | labels, pills, small links | opacity 0 → 1, y 12 → 0, 0.5s |
| heading | every section title, the purpose quote (whole phrase, never split) | opacity 0 → 1, y 30 → 0 (KAIB's 30px), 0.7s |
| text | the portfolio paragraph | each rendered line rises out of its mask (yPercent 105 → 0), 0.8s, 0.07s between lines |
| card | cards, rows, list items, facts, footer columns | batched, opacity + y 30, 0.6s, 0.08s apart |
| image | photography | clip-path opens from the bottom, 1.1s; `[data-parallax]` adds ±5% drift (scrub) |

All play once, all on `cubic-bezier(.25,1,.3,1)` (GSAP CustomEase `kaib`), start at `top 88%` (KAIB's -10% margin), and run at 75% duration in late sections (`[data-late]`: articles, partners, footer). There are no per-letter effects outside the preloader and hero.

- **Smooth scroll:** Lenis in lerp mode with `lerp: 0.075` (KAIB's factor), driven by the GSAP ticker and synced to ScrollTrigger. In-page anchors go through Lenis (0.8s easeInOutQuad) and move focus. The menu and preloader stop it.
- **Backdrop:** KAIB does not recolour on scroll, so there is no scene blending. Sections keep their own grounds (white, the 5% navy tint, navy).
- **Header:** no bar, no box, no rule. Its colour follows the section under it (`html[data-header]`, navy on light, white over the navy footer; the logo swaps to the white version). It hides on scroll down and returns on scroll up or focus.
- **Menu:** the header "Menu" pill opens a full-screen navy panel. One GSAP timeline: a clip wipe down (0.6s), then items rise with a 0.4s stagger spread; `reverse()` closes it at 1.6×. Left column: the six homepage sections (Lenis). Right: the live nav's five groups with their sub-pages. Focus trap, Esc closes, focus returns to the trigger.
- **Photography:** `saturate(.88)` + a 10% navy multiply veil, so landscapes sit within navy, green and blue without becoming duotone.
- **Links never navigate** (standing client rule for these demos): all hrefs are the real URLs (verifiable, `target="_blank" rel="noopener"`), but a capture-phase click/auxclick guard in `motion.tsx` cancels any link that does not start with `#`.

### Copied interaction

KAIB's `.button-ui` pill ("Explore our solutions", "Request institutional access", SERVICES, CONTACT), rebuilt as `Pill` (`components/ui.tsx`, `styles/ui.css`):

| | KAIB (computed) | Here (computed) |
|---|---|---|
| Rest | 48px high, radius 24px, 1px `#dce1e6`, `rgba(255,255,255,.05)` + blur(15px) | 48px, 24px, 1px `--line`, same fill + blur |
| Hover | bg + border → `#d8e2eb`, opacity .9 | bg + border → `--active` (`#dae4ef`, blue tint), opacity .9 |
| Press | `scale(.93)`, opacity .9 | `scale(.93)`, opacity .9 |
| Transition | `background-color .2s ease-out, border-color .2s ease-out, transform .2s ease-out, opaicty .2s ease-out` | the first three, `0.2s var(--ease-out)`; opacity un-animated, because KAIB's misspelling means it never animates either |

Compared side by side in headless Chrome by hovering and pressing the first hero pill on both sites. The values match apart from the palette-tinted hover colour. KAIB scopes hover to ≥1280px; here it is scoped to `(hover: hover)`. The same 0.5s `cubic-bezier(.25,1,.3,1)` row tint (KAIB `.insight-news-item:hover`) is used on the article rows and sector cards.

### Accessibility and fallbacks

- **Reduced motion:** no preloader, no Lenis, no reveals. Content renders in place (the boot script never adds `js`), and CSS transitions are cut to 0.01ms.
- **No JS:** the reveal guards depend on the `js` class, so everything is visible; `<noscript>` hides the preloader.
- **Keyboard:** skip link, then logo, nav, Contact, Menu, hero pills. The menu traps focus (40 Tabs and a Shift-Tab stayed inside), Esc closes it, and focus returns to Menu. Visible focus ring in blue (white on navy).
- **Landmarks and labels:** header/nav/main/footer landmarks, labelled sections, `aria-expanded`/`aria-controls` on Menu, `role="dialog"` + `aria-modal` + `inert` on the menu, and alt text on every photo.

## Private demo settings

- `<meta name="robots" content="noindex, nofollow, nocache">` (layout metadata). No sitemap, no robots route.
- PostHog EU (`lib/posthog.ts`): host `eu.i.posthog.com`, `defaults: "2026-05-30"`, pageview + pageleave + autocapture, session recording on, surveys off. `posthog.register({ site })` plus UTM properties when present. `scroll_depth` fires once each at 25 / 50 / 75 / 100%. Key overridable with `NEXT_PUBLIC_POSTHOG_KEY`. The script tag has no `id`.
- No visible tracking UI, no cookie banner, no Regen credit.

## Photography and assets

All downloaded from ionacapital.co.uk by `scripts/media.py` and cut to 1600 / 800px progressive JPEG (`public/media/`):

| File | Source upload | Used on the live site at |
|---|---|---|
| `hero` | `2021/07/VILE4778.jpg` | /sustainable-investing/ banner |
| `ridge.png` | `2025/04/Kanadevia_graphic_element_RGB1920px.png` | homepage hero overlay |
| `purpose` | `2021/11/Sustainable-Investment-Focus.jpg` | /sustainable-investment-focus/ banner |
| `team` | `2021/07/Iona_Office-22-scaled-e1680193363915.jpg` | /iona-team/ banner |
| `bioenergy` | `2021/11/Brocklesby-Biogas-Aerial.jpg` | /bioenergy/ case study |
| `efw` | `2021/11/Energy-from-Waste-Bridgwater.jpg` | /energy-from-waste/ case study |
| `efficiency` | `2021/11/Energy-Efficiency-1.jpg` | /energy-efficiency/ banner |
| `portfolio` | `2023/05/crofthead-scaled.jpg` | /about/ banner (Crofthead Biogas) |
| `post-wardley`, `post-cothen`, `post-gravel-pit` | the three posts' featured images | homepage article cards |

## Verification (last run)

- `npm run typecheck` and `npm run build` pass: 4 static pages (`/`, `/_not-found`, `/icon.svg` + Next's internal page).
- 375 / 768 / 1440 (production build, normal and reduced motion): no horizontal scroll, no hidden reveal targets left, no broken images, no console errors or warnings.
- Built HTML: no em or en dashes in visible text; no `href="#"`; every `target="_blank"` has `rel="noopener"`.
- Links: 19 outgoing URLs. 17 are in the Yoast sitemap and return 200; X and LinkedIn are the live header's own URLs. Clicking a news row stays on the page (guard).
