/* Every word on the page, shaped from content/home.json (npm run scrape). Components never hold copy.
   House rule for these demos: no em or en dashes anywhere, so scraped text passes through undash(). */
import home from "@/content/home.json";

const SITE = "https://ionacapital.co.uk";

export function undash(text: string) {
  return text
    .replace(/\s+[—–]\s+/g, ", ") // "the case for KVI — just click" → "the case for KVI, just click"
    .replace(/(\d)\s*[–—]\s*(\d)/g, "$1 to $2")
    .replace(/[—–]/g, ", ");
}

const strip = (text: string) => undash(text).replace(/^"|"$/g, "").trim();
export type Link = { label: string; href: string };
export type Media = { src: string; alt: string; position?: string };

const media = (name: string, alt: string, position?: string): Media => ({ src: `/media/${name}`, alt, position });
export const srcSet = (m: Media) => `${m.src}-800.jpg 800w, ${m.src}-1600.jpg 1600w`;

/* 1. Hero: the live H1, lead and both buttons, verbatim. */
export const hero = {
  title: home.hero.title, // "Sustainable Infrastructure Investment"
  lead: home.hero.lead,
  ctas: home.hero.ctas as Link[],
  image: media("hero", "Anaerobic digestion domes in a green valley below wooded hills", "50% 62%"),
  // The live hero lays the Kanadevia ridge graphic over the bottom of this landscape (post-7.css background overlay).
  ridge: "/media/ridge.png",
  caption: "Kanadevia Inova Capital Ltd.",
};

/* 2. Purpose: the homepage's own "Purpose Statement" quote, with the two About paragraphs the "Who We Are" button leads to. */
export const purpose = {
  label: home.purpose.title, // "Purpose Statement"
  quote: strip(home.purpose.quote), // "For a future free of wasted waste."
  images: [
    media("purpose", "Biogas plant with green digester domes under a blue sky", "50% 60%"),
    media("team", "Kanadevia Inova Capital colleagues in a meeting at the London office", "40% 40%"),
  ],
  rows: [
    {
      title: "Who We Are",
      text: "Kanadevia Inova Capital (formerly Iona Capital) was created in 2011 to facilitate long-term sustainable investing into primary low-carbon infrastructure projects. Kanadevia Inova Capital manages funds for institutional investors which provide equity and subordinated debt into projects.",
      link: { label: "About", href: `${SITE}/about/` },
    },
    {
      title: "Part of Kanadevia Inova",
      text: "Kanadevia Inova Capital was acquired by Kanadevia Inova in December 2024. Kanadevia Inova is a global greentech leader, pioneering innovative solutions for the energy transition and circular economy. Based in Zurich and employing more than 3,000 people in 17 countries, Kanadevia Inova specialises in Waste to X (WtX) and Renewable Gas (RG), delivering turnkey systems that transform waste into valuable resources through cutting-edge technology.",
      link: { label: "Team", href: `${SITE}/iona-team/` },
    },
  ],
};

/* 3. Investment focus: the "What We Do" page's own heading and value list, then the three sectors from the nav. */
const sectorCopy: Record<string, { text: string; image: Media }> = {
  Bioenergy: {
    text: home.sectors[0].paragraphs.slice(0, 2).join(" "),
    image: media("bioenergy", "Aerial view of the Brocklesby Biogas anaerobic digestion facility in East Yorkshire"),
  },
  "Energy from Waste": {
    text: home.sectors[1].paragraphs[1], // the company's own EfW paragraph
    image: media("efw", "Aerial view of the Bridgwater Resource Recovery energy from waste facility in Somerset"),
  },
  "Energy Efficiency": {
    text: home.sectors[2].paragraphs[1], // the company's own CHP paragraph
    image: media("efficiency", "Containerised energy storage unit on a gravel site"),
  },
};

export const focus = {
  label: "What We Do", // the hero button that leads here
  title: home.focus.title, // "Investment Focus"
  kicker: home.focus.kicker, // "How Kanadevia Inova Capital adds value"
  value: home.focus.value,
  more: { label: "Discover Our Investment Approach", href: `${SITE}/sustainable-investment-focus/` },
  sectors: home.sectors.map((s) => ({ title: s.title, href: s.href, text: undash(sectorCopy[s.title].text), image: sectorCopy[s.title].image })),
};

/* 4. Investments: every asset named on /investments/, with the facts the company publishes about them. */
export const portfolio = {
  label: "Discover Our Portfolio",
  title: "Investments",
  text: home.focus.blocks[0].text, // "Kanadevia Inova Capital specialises in primary investments in sustainable infrastructure projects, ..."
  facts: [
    // "It brings Kanadevia Inova's biogas plant portfolio to 17 operating facilities" (Wardley and Lower Drayton article, Oct 2025)
    { value: "17", label: "operating biogas facilities" },
    // /sustainable-investment-focus/: "unlevered returns of 10% +"
    { value: "10%+", label: "target unlevered returns" },
    // /sustainable-investment-focus/: "a signatory to PRI with an A rating across all categories"
    { value: "A", label: "PRI rating across all categories" },
  ],
  assets: home.assets,
  image: media("portfolio", "Aerial view of Crofthead Biogas, Dumfries, with two green digester tanks"),
  more: { label: "Explore the portfolio map", href: `${SITE}/investments/` },
};

/* 5. Articles: the three posts the live homepage features, in its order. Excerpts from the homepage cards
   repeat the title, so each article's own standfirst (its first paragraph, verbatim) is used instead; CSS clamps it to 3 lines. */
const standfirst: Record<string, string> = {
  "kanadevia-inova-acquires-wardley-and-lower-drayton-biogas-plants-to-expand-renewable-gas-portfolio":
    "Both plants are accredited under the UK Government’s Renewable Heat Incentive Scheme and supplying biomethane to the gas grid, contributing to national renewable energy targets and strengthening Kanadevia Inova’s commitment to decarbonisation, circularity and supply security.",
  "kanadevia-inova-takes-majority-stake-in-dutch-biomethane-facility":
    "Swiss-based greentech company announces its first investment in the country’s biogas sector, paving the way for the development of further projects across Benelux.",
  "kanadevia-inova-acquires-iona-capital-along-with-uk-biogas-portfolio":
    "Swiss-based green-tech company Kanadevia Inova strengthens its commitment to accelerating decarbonisation by acquiring Iona Capital Limited (ICL), a UK-based asset management specialist in renewable gas, along with 11 existing plants and a substantial pipeline of projects globally.",
};
const postImages = ["post-wardley", "post-cothen", "post-gravel-pit"];
const postAlts = ["Wardley biogas plant with green digester tanks, aerial view", "Cothen biomethane facility in the Netherlands", "Gravel Pit Biogas plant among fields under a wide sky"];

export const articles = {
  label: home.articles.eyebrow, // "Sustainability Expertise"
  title: home.articles.title, // "Articles"
  posts: home.articles.posts.map((p, i) => {
    const slug = p.href.split("/").filter(Boolean).pop()!;
    return { title: p.title, href: p.href, date: p.date, category: "News", text: standfirst[slug] ?? undash(p.excerpt), image: media(postImages[i], postAlts[i]) };
  }),
  // The live label reads "Sustainablity"; the typo is corrected here.
  more: { label: home.articles.cta.label.replace("Sustainablity", "Sustainability"), href: home.articles.cta.href },
};

/* 6. For investors / for developers: both live boxes and their buttons, verbatim apart from the dash rule. */
export const audiences = home.audiences.map((a) => ({ title: a.title, text: undash(a.text), cta: a.cta as Link }));

/* Footer + menu */
export const footer = {
  company: "Kanadevia Inova Capital Ltd.",
  address: ["123 Pall Mall", "London SW1Y 5EA"],
  phone: "+44(0) 20 7064 3300",
  tel: "tel:+442070643300",
  groups: home.footer.groups as { title: string; links: Link[] }[],
  copyright: `© ${new Date().getFullYear()} Kanadevia Inova Capital Ltd.`,
};
