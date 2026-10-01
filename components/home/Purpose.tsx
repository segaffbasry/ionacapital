import { Photo, linkProps } from "@/components/ui";
import { purpose } from "@/lib/content";

/* KAIB's "hero-desc" + "About us" pair: an indented statement, two photographs side by side, then label | text rows
   on hairlines. The statement is the live homepage's Purpose Statement; the rows are the two About paragraphs the
   hero's "Who We Are" button leads to. */
export function Purpose() {
  return <section id="purpose" className="section purpose" tabIndex={-1} aria-labelledby="purpose-title">
    <div className="wrap">
      <div className="indent purpose-intro">
        <p className="label" data-reveal="label">{purpose.label}</p>
        <h2 id="purpose-title" className="h2 purpose-quote" data-reveal="heading">“{purpose.quote}”</h2>
      </div>
      <div className="purpose-images">
        <Photo media={purpose.images[0]} sizes="(min-width: 768px) 50vw, 100vw" parallax />
        <Photo media={purpose.images[1]} sizes="(min-width: 768px) 50vw, 100vw" parallax />
      </div>
      <div className="rows">
        {purpose.rows.map((r) => <div key={r.title} className="row" data-reveal="card">
          <h3 className="h3 row-title">{r.title}</h3>
          <div className="row-body">
            <p className="lead">{r.text}</p>
            <a href={r.link.href} className="text-link" {...linkProps(r.link.href)}>{r.link.label}</a>
          </div>
        </div>)}
      </div>
    </div>
  </section>;
}
