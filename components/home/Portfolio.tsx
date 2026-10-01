import { Photo, Pill } from "@/components/ui";
import { portfolio } from "@/lib/content";

/* The portfolio, after KAIB's "Platform" block: a photograph beside the heading, text and three published facts,
   then every asset on /investments/ as a compact ruled list (KAIB's accordion rows, closed). */
export function Portfolio() {
  return <section id="investments" className="section portfolio" tabIndex={-1} aria-labelledby="portfolio-title">
    <div className="wrap">
      <div className="portfolio-top">
        <Photo media={portfolio.image} sizes="(min-width: 1024px) 55vw, 100vw" parallax className="portfolio-photo" />
        <div className="portfolio-copy">
          <p className="label" data-reveal="label">{portfolio.label}</p>
          <h2 id="portfolio-title" className="h2" data-reveal="heading">{portfolio.title}</h2>
          <p className="lead" data-reveal="text">{portfolio.text}</p>
          <dl className="facts">
            {portfolio.facts.map((f) => <div key={f.label} className="fact" data-reveal="card">
              <dt className="fact-value">{f.value}</dt>
              <dd className="fact-label">{f.label}</dd>
            </div>)}
          </dl>
        </div>
      </div>
      <div className="assets">
        <h3 className="label" data-reveal="label">Portfolio assets</h3>
        <ul className="asset-list">{portfolio.assets.map((a) => <li key={a} data-reveal="card">{a}</li>)}</ul>
        <div className="section-foot"><Pill href={portfolio.more.href}>{portfolio.more.label}</Pill></div>
      </div>
    </div>
  </section>;
}
