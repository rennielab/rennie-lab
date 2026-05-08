import { ContactButton } from "@/components/chrome/ContactButton";
import { FEED } from "@/data/feed";

export const metadata = {
  title: "Impact — Rennie Lab",
  description:
    "Pro-bono and at-cost programs with charities, NGOs and movements. Ten programs since 2019.",
};

const NUMBERS: [string, string][] = [
  ["1,820", "pro-bono hours · 2025"],
  ["10", "partner charities"],
  ["14", "programs shipped"],
  ["1%", "of revenue · planet"],
];

export default function ImpactPage() {
  const programs = FEED.filter((f) => f.kind === "impact");

  return (
    <div className="container">
      <section style={{ padding: "40px 0 64px" }}>
        <div className="mono rise" style={{ marginBottom: 32 }}>
          Impact · pro-bono + at-cost programs
        </div>
        <h1
          className="h-display rise delay-1"
          style={{ margin: 0, maxWidth: "14ch" }}
        >
          Work for the <em style={{ color: "var(--accent)" }}>commons.</em>
        </h1>
        <p
          className="body-lg rise delay-2"
          style={{ marginTop: 24, maxWidth: "48ch" }}
        >
          A portion of the studio&apos;s hours each year is set aside for charities, NGOs
          and movements. Ten programs since 2019; here&apos;s where the time and craft has
          gone.
        </p>
      </section>

      {/* Numbers */}
      <section
        style={{
          padding: "48px 0",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          marginBottom: 96,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {NUMBERS.map(([v, l], i) => (
            <div key={i}>
              <div
                className="serif"
                style={{
                  fontSize: "clamp(56px, 7vw, 112px)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {v}
              </div>
              <div className="mono" style={{ marginTop: 12 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section style={{ padding: "0 0 96px" }}>
        <div className="mono" style={{ marginBottom: 24 }}>Active programs</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {programs.map((p) => (
            <article key={p.id} className="card">
              <div className="ph" data-tone={p.tone} style={{ aspectRatio: "16/10" }}>
                <span className="ph-tag">{p.cat} · charity</span>
              </div>
              <div style={{ padding: 28 }}>
                <div
                  className="mono"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{p.client}</span>
                  <span>{p.year}</span>
                </div>
                <h3
                  className="h-2"
                  style={{ margin: "14px 0", fontSize: "clamp(28px,3vw,40px)" }}
                >
                  {p.title}
                </h3>
                <p className="body" style={{ margin: 0 }}>
                  A multi-year partnership with creative direction, public-facing
                  programme design and on-the-ground production support.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Apply for support */}
      <section style={{ padding: "64px 0", borderTop: "1px solid var(--line)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <h2 className="h-1" style={{ margin: 0, maxWidth: "12ch" }}>
            Running a charity? <em>Tell us.</em>
          </h2>
          <div>
            <p className="body-lg" style={{ margin: "0 0 24px", maxWidth: "42ch" }}>
              We open one or two new pro-bono partnerships each year, alongside at-cost
              work for movements that need craft. The brief is open year-round.
            </p>
            <ContactButton>
              Open the brief <span className="arrow">→</span>
            </ContactButton>
          </div>
        </div>
      </section>
    </div>
  );
}
