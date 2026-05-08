import { SERVICES, ORBITAL_PROCESS } from "@/data/services";
import { ServicesAccordion } from "@/components/services/ServicesAccordion";
import { ContactButton } from "@/components/chrome/ContactButton";
import { DownloadButton } from "@/components/chrome/DownloadButton";

export const metadata = {
  title: "Services — Rennie Lab",
  description:
    "Three pillars of practice: Impact Products, Strategic Futures, and Creative Transformation. Built around the Orbital Design process.",
};

export default function ServicesPage() {
  return (
    <div className="container svc-page">
      <section className="svc-hero">
        <div className="mono" style={{ marginBottom: 32 }}>02 — Services</div>
        <h1 className="h-display rise" style={{ maxWidth: "14ch" }}>
          Three lanes.
          <br />
          One studio.
        </h1>
        <div className="svc-hero-grid rise delay-1">
          <p className="body-lg" style={{ margin: 0, maxWidth: "52ch" }}>
            We work in three lanes — Impact Products, Strategic Futures and Creative
            Transformation — built around the Orbital Design process. Engagement shapes
            range from short advisory sprints to multi-year build-and-run partnerships.
          </p>
          <div className="svc-hero-meta">
            <div>
              <div className="mono">Engagement</div>
              <div className="svc-meta-v">Sprint · Project · Retainer</div>
            </div>
            <div>
              <div className="mono">Footprint</div>
              <div className="svc-meta-v">SYD · SLC · LA · LDN</div>
            </div>
            <div>
              <div className="mono">Founded</div>
              <div className="svc-meta-v">2009</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 48, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <ContactButton>
            Start a brief <span className="arrow">→</span>
          </ContactButton>
          <DownloadButton kind="deck" className="btn btn-ghost">
            Download capabilities deck <span className="arrow">↓</span>
          </DownloadButton>
        </div>
      </section>

      <ServicesAccordion services={SERVICES} />

      <section className="svc-process">
        <div className="svc-process-head">
          <span className="mono">How we work</span>
          <span className="mono">The Orbital Design Process</span>
        </div>
        <div className="svc-process-grid">
          <div>
            <h2 className="h-2" style={{ margin: 0, maxWidth: "12ch" }}>
              The Orbital Design Process.
            </h2>
            <p className="body-lg" style={{ marginTop: 32, maxWidth: "44ch" }}>
              The work loops because the world does. Five phases, repeated as a
              relationship rather than a project — designed to keep the orbit holding
              after the launch.
            </p>
          </div>
          <div className="svc-process-steps">
            {ORBITAL_PROCESS.map((p) => (
              <div key={p.num} className="svc-step">
                <div className="svc-step-n mono">{p.num}</div>
                <div>
                  <h3 className="h-3" style={{ margin: 0 }}>{p.name}</h3>
                  <p className="body" style={{ marginTop: 12, maxWidth: "62ch" }}>
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-cta">
        <div className="mono">Start a project</div>
        <div className="svc-cta-row">
          <h2 className="h-1" style={{ margin: 0, maxWidth: "16ch" }}>
            Tell us where you&apos;re headed.
          </h2>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <ContactButton>
              Open the brief <span className="arrow">→</span>
            </ContactButton>
            <DownloadButton kind="deck" className="btn btn-ghost">
              Download deck <span className="arrow">↓</span>
            </DownloadButton>
          </div>
        </div>
      </section>
    </div>
  );
}
