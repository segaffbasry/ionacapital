import { Chevron, Photo, Pill, linkProps } from "@/components/ui";
import { focus } from "@/lib/content";

/* KAIB's "Comprehensive Service Offerings": title left, a subtitle and short text right, then one grey card per
   service with the image on the left, title and text on the right and a round chevron button in the corner.
   Here: Investment Focus, the four ways the firm adds value, and the three sectors in the live nav. Each whole card
   links to its sector page. */
export function Focus() {
  return <section id="focus" className="section focus" tabIndex={-1} aria-labelledby="focus-title">
    <div className="wrap">
      <div className="split-head">
        <div>
          <p className="label" data-reveal="label">{focus.label}</p>
          <h2 id="focus-title" className="h2" data-reveal="heading">{focus.title}</h2>
        </div>
        <div className="split-head-body">
          <p className="h3" data-reveal="heading">{focus.kicker}</p>
          <ul className="value-list">{focus.value.map((v) => <li key={v} data-reveal="card">{v}</li>)}</ul>
        </div>
      </div>
      <ul className="cards">
        {focus.sectors.map((s) => <li key={s.href} data-reveal="card">
          <a className="card" href={s.href} {...linkProps(s.href)}>
            <Photo media={s.image} sizes="(min-width: 768px) 45vw, 100vw" reveal={false} className="card-photo" />
            <div className="card-body">
              <h3 className="h3 card-title">{s.title}</h3>
              <p className="card-text">{s.text}</p>
              <Chevron className="card-chevron" />
            </div>
          </a>
        </li>)}
      </ul>
      <div className="section-foot"><Pill href={focus.more.href}>{focus.more.label}</Pill></div>
    </div>
  </section>;
}
