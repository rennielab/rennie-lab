import { ContactButton } from "@/components/chrome/ContactButton";
import { IMPACT_CASE_STUDIES } from "@/data/impactProjects";
import { ImpactGrid } from "@/components/impact/ImpactGrid";
import { ImpactCaseStudyDrawer } from "@/components/impact/ImpactCaseStudyDrawer";
import { AffiliationStrip } from "@/components/affiliations/AffiliationStrip";

export const metadata = {
  title: "Impact — Rennie Lab",
  description:
    "Impact case studies across movement, climate and community — Rennie Lab and Reny Studio's pro-bono and at-cost programs.",
};

const NUMBERS: [string, string][] = [
  ["$1.1M+", "pro-bono · since 2009"],
  ["22", "impact clients"],
  ["115", "impact projects"],
  ["40%", "of all work · 2026 target"],
];

export default function ImpactPage() {
  return (
    <div className="container">
      <section style={{ padding: "40px 0 64px" }}>
        <div className="mono rise" style={{ marginBottom: 32 }}>
          Impact · pro-bono + at-cost programs · movement · climate · community
        </div>
        <h1
          className="h-display rise delay-1"
          style={{ margin: 0, maxWidth: "16ch" }}
        >
          Work for the <em style={{ color: "var(--accent)" }}>commons.</em>
        </h1>
        <p
          className="body-lg rise delay-2"
          style={{ marginTop: 24, maxWidth: "60ch" }}
        >
          A selection of impact-driven projects across Rennie Lab and Reny Studio. Each was
          chosen not just for its creative output, but for its contribution to something
          larger than the brief — work across movement, climate and community.
        </p>
      </section>

      {/* Affiliations strip — credentials we hold ourselves to */}
      <section
        style={{
          padding: "32px 0 48px",
          borderTop: "1px solid var(--line)",
          marginBottom: 16,
        }}
      >
        <div className="mono" style={{ marginBottom: 24 }}>
          Credentials · accountability · alliances
        </div>
        <AffiliationStrip variant="page" />
      </section>

      {/* Numbers */}
      <section
        style={{
          padding: "48px 0",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          marginBottom: 80,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {NUMBERS.map(([v, l], i) => (
            <div key={i}>
              <div
                className="serif"
                style={{
                  fontSize: "clamp(48px, 6vw, 88px)",
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

      {/* Case studies */}
      <section style={{ padding: "0 0 96px" }}>
        <ImpactGrid caseStudies={IMPACT_CASE_STUDIES} />
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

      <ImpactCaseStudyDrawer />
    </div>
  );
}
