// Refreshes content/home.json from the live site. Run: npm run scrape
// The homepage gives every section's copy; /sustainable-investment-focus/, the three sector pages and /investments/
// give the items the homepage links to through "What We Do" and the nav (titles, leads, the 21 portfolio assets).
import * as cheerio from "cheerio";
import { writeFileSync } from "node:fs";

const BASE = "https://ionacapital.co.uk";
const clean = (s) => s.replace(/\s+/g, " ").trim();

async function load(path) {
  const res = await fetch(BASE + path, { headers: { "User-Agent": "Mozilla/5.0 (content refresh)" } });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return cheerio.load(await res.text());
}

const home = await load("/");
const section = (id) => home(`[data-id="${id}"]`);

// Hero (Elementor section 80ee7b4)
const hero = section("80ee7b4");
const heroData = {
  title: clean(hero.find("h1").text()),
  lead: clean(hero.find(".elementor-widget-text-editor").text()),
  ctas: hero.find(".elementor-button-wrapper a").map((_, a) => ({ label: clean(home(a).text()), href: new URL(home(a).attr("href"), BASE).href })).get(),
};

// Purpose statement (6b4cfc3d)
const purpose = section("6b4cfc3d");
const purposeData = {
  title: clean(purpose.find("h2").first().text()),
  quote: clean(purpose.find(".elementor-blockquote__content, blockquote").first().text()),
};

// Sustainability Expertise / Articles (703bd79c): the posts widget shows the three most recent posts
const articles = section("703bd79c");
const posts = articles.find("article.elementor-post").map((_, el) => {
  const $ = home(el);
  return {
    title: clean($.find(".elementor-post__title").text()),
    href: $.find(".elementor-post__title a").attr("href"),
    date: clean($.find(".elementor-post-date").text()),
    excerpt: clean($.find(".elementor-post__excerpt").text()),
    image: $.find("img").attr("src"),
  };
}).get();
const articlesData = {
  eyebrow: clean(articles.find("h4").first().text()),
  title: clean(articles.find("h2").first().text()),
  posts,
  cta: (() => { const a = articles.find(".elementor-button-wrapper a").first(); return { label: clean(a.text()), href: new URL(a.attr("href"), BASE).href }; })(),
};

// For Investors / For Developers (35f0edc4)
const audiences = section("35f0edc4").find(".elementor-widget-image-box").map((_, el) => {
  const box = home(el);
  const button = box.closest(".elementor-column, .elementor-widget-wrap").find(".elementor-button-wrapper a").first();
  return {
    title: clean(box.find(".elementor-image-box-title").text()),
    text: clean(box.find(".elementor-image-box-description").text()),
    cta: { label: clean(button.text()), href: new URL(button.attr("href"), BASE).href },
  };
}).get();

// Footer (2b278cd)
const foot = section("2b278cd");
const footer = {
  address: foot.find(".elementor-widget-text-editor").first().find("p").map((_, p) => clean(home(p).text())).get().filter(Boolean),
  groups: foot.find("h2").map((_, h) => {
    const head = home(h);
    const links = head.closest(".elementor-widget").next(".elementor-widget").find("a").map((__, a) => ({ label: clean(home(a).text()), href: new URL(home(a).attr("href"), BASE).href })).get();
    return { title: clean(head.text()), links };
  }).get(),
};

// Header nav (desktop menu, first instance only)
const nav = home("nav.elementor-nav-menu--main").first().find("ul.elementor-nav-menu > li").map((_, li) => {
  const $ = home(li);
  const top = $.children("a");
  return {
    label: clean(top.text()),
    href: top.attr("href"),
    children: $.find("ul a").map((__, a) => ({ label: clean(home(a).text()), href: home(a).attr("href") })).get(),
  };
}).get();
const socials = home(".elementor-social-icons-wrapper").first().find("a").map((_, a) => ({ label: clean(home(a).text()), href: home(a).attr("href") })).get();

// Investment focus: the four "how we add value" bullets and the four specialisation blocks
const focus = await load("/sustainable-investment-focus/");
const focusData = {
  title: clean(focus("h1").first().text()),
  kicker: clean(focus("p:contains('How Kanadevia Inova Capital adds value')").first().text()),
  value: focus(".elementor-icon-list-item, li").map((_, li) => clean(focus(li).text())).get().filter((t) => /^(Negotiating|De-risking|Delivering|Ensuring)/.test(t)),
  blocks: focus("h3").filter((_, h) => /:$/.test(clean(focus(h).text()))).map((_, h) => ({
    title: clean(focus(h).text()).replace(/:$/, ""),
    text: clean(focus(h).closest(".elementor-widget").next(".elementor-widget").text()),
  })).get(),
};

// The three sectors: H1 and first explanatory paragraph of each page
const sectors = [];
for (const path of ["/bioenergy/", "/energy-from-waste/", "/energy-efficiency/"]) {
  const $ = await load(path);
  const paras = $(".elementor-widget-text-editor p").map((_, p) => clean($(p).text())).get().filter((t) => t.length > 60);
  sectors.push({ title: clean($("h1").first().text()), href: BASE + path, paragraphs: paras.slice(0, 3) });
}

// Portfolio: every asset name on /investments/
const inv = await load("/investments/");
const assets = [...new Set(inv("p").map((_, p) => clean(inv(p).text())).get().filter((t) => /(Biogas|CHP|Energy|Recovery|Gwyriad|Waen|ASL|Services|UK)$/.test(t) && t.length < 40))];

const out = { scraped: new Date().toISOString(), hero: heroData, purpose: purposeData, articles: articlesData, audiences, footer, nav, socials, focus: focusData, sectors, assets };
writeFileSync(new URL("../content/home.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`hero ✓  purpose ✓  posts ${posts.length}  audiences ${audiences.length}  nav ${nav.length}  sectors ${sectors.length}  assets ${assets.length}`);
