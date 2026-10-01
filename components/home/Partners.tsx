import { Pill } from "@/components/ui";
import { audiences } from "@/lib/content";

/* The live homepage's closing pair, "for Investors" and "for Developers", as two KAIB grey cards side by side,
   each with its own button. */
export function Partners() {
  return <section id="partners" className="section partners" tabIndex={-1} aria-label="For investors and developers" data-late>
    <div className="wrap partners-grid">
      {audiences.map((a) => <div key={a.title} className="partner" data-reveal="card">
        <h2 className="h2 partner-title">{a.title}</h2>
        <p className="lead">{a.text}</p>
        <Pill href={a.cta.href} tone="solid" reveal={false}>{a.cta.label}</Pill>
      </div>)}
    </div>
  </section>;
}
