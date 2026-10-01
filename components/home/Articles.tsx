import { Chevron, Photo, Pill, linkProps } from "@/components/ui";
import { articles } from "@/lib/content";

/* KAIB's "Insight" news list: an indented heading, then one row per item (date and source, title, a short
   description, a round chevron) on hairlines, each row tinting on hover over .5s cubic-bezier(.25,1,.3,1).
   Rows here also carry the featured image the live homepage shows for each post. */
export function Articles() {
  return <section id="articles" className="section articles" tabIndex={-1} aria-labelledby="articles-title" data-late>
    <div className="wrap">
      <div className="indent articles-head">
        <p className="label" data-reveal="label">{articles.label}</p>
        <h2 id="articles-title" className="h2" data-reveal="heading">{articles.title}</h2>
      </div>
      <ul className="news">
        {articles.posts.map((p) => <li key={p.href} data-reveal="card">
          <a className="news-row" href={p.href} {...linkProps(p.href)}>
            <Photo media={p.image} sizes="(min-width: 768px) 200px, 30vw" reveal={false} className="news-photo" />
            <div className="news-main">
              <p className="news-meta"><time>{p.date}</time><span aria-hidden="true">·</span><span>{p.category}</span></p>
              <h3 className="h3 news-title">{p.title}</h3>
            </div>
            <p className="news-text">{p.text}</p>
            <Chevron className="news-chevron" />
          </a>
        </li>)}
      </ul>
      <div className="section-foot"><Pill href={articles.more.href}>{articles.more.label}</Pill></div>
    </div>
  </section>;
}
