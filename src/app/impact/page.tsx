import { ContactButton } from "@/components/chrome/ContactButton";
import { IMPACT_CASE_STUDIES } from "@/data/impactProjects";
import { ImpactWall } from "@/components/impact/ImpactWall";
import { AffiliationStrip } from "@/components/affiliations/AffiliationStrip";

export const metadata = {
  title: "Impact",
  description:
    "Forty percent of our capacity, given to the commons. Climate, community and movement work — pro-bono and at-cost across seventeen years.",
};

const NUMBERS: [string, string][] = [
  ["$1.1M+", "into the commons · since 2009"],
  ["22", "impact partners"],
  ["115", "impact projects"],
  ["40%", "of capacity · ongoing"],
];

export default function ImpactPage() {
  return (
    <div className="container">
      {/* Statement — the relevant information, clean, at the top */}
      <section className="proj-statement">
        <div className="mono rise" style={{ marginBottom: 28 }}>
          Impact · {IMPACT_CASE_STUDIES.length} programs · climate · community · movement
        </div>
        <div className="proj-statement-text rise delay-1">
          <p>
            <span className="proj-statement-name">
              Rennie<sup className="proj-statement-reg">®</sup>
            </span>{" "}
            gives forty percent of the studio&apos;s capacity to the commons — climate,
            community and movement work, mostly pro-bono and at-cost.
          </p>
          <p>
            Programs and identities for charities, councils, coalitions and the curious,
            chosen for their contribution to something larger than the brief. Most studios
            call this their charity work. We call it the spine.
          </p>
        </div>
      </section>

      {/* The proof — clean stat row */}
      <section className="impact-stats-section rise delay-2">
        <div className="impact-stats">
          {NUMBERS.map(([v, l], i) => (
            <div key={i} className="impact-stat">
              <div className="impact-stat-figure">{v}</div>
              <div className="mono impact-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Case-study wall — same system as the Projects page */}
      <ImpactWall caseStudies={IMPACT_CASE_STUDIES} />

      {/* Credentials — quiet strip, mirrors the Projects logo wall */}
      <section style={{ padding: "32px 0 96px" }}>
        <div className="mono" style={{ marginBottom: 28, color: "var(--ink-3)" }}>
          Credentials · accountability · alliances
        </div>
        <AffiliationStrip variant="page" />
      </section>

      {/* Apply for Support — full-bleed red panel */}
      <section className="impact-apply">
        <div className="impact-apply-inner">
          <div className="mono" style={{ marginBottom: 24 }}>
            Apply for support · open year-round
          </div>
          <h2
            style={{
              margin: 0,
              maxWidth: "20ch",
              fontFamily: "var(--sans)",
              fontWeight: 700,
              fontSize: "clamp(48px, 6vw, 96px)",
              letterSpacing: "-0.025em",
              lineHeight: 1.02,
              color: "var(--cream)",
            }}
          >
            Running a charity, a coalition, or a movement that needs craft?
          </h2>
          <div className="impact-apply-grid">
            <div>
              <div className="mono" style={{ marginBottom: 12, color: "rgba(244,241,222,0.6)" }}>
                What we open
              </div>
              <p className="impact-apply-body">
                We open one or two new pro-bono partnerships per year, plus a handful
                of at-cost engagements for organisations that can&apos;t fund the work
                at full rate but need the same standard.
              </p>
            </div>
            <div>
              <div className="mono" style={{ marginBottom: 12, color: "rgba(244,241,222,0.6)" }}>
                Who we say yes to
              </div>
              <p className="impact-apply-body">
                Climate-aligned, community-anchored, movement-stage organisations.
                Bias toward First Nations leadership, regenerative work, and partners
                we can stay with for the second decade — not just the launch.
              </p>
            </div>
            <div>
              <div className="mono" style={{ marginBottom: 12, color: "rgba(244,241,222,0.6)" }}>
                What we&apos;ll need
              </div>
              <p className="impact-apply-body">
                A short brief — what you&apos;re trying to move, who&apos;s already
                in the room, the timeline, the constraints. We reply within two
                business days, on or off the record.
              </p>
            </div>
          </div>
          <div className="impact-apply-cta">
            <ContactButton>
              Open the brief <span className="arrow">→</span>
            </ContactButton>
          </div>
        </div>
      </section>
    </div>
  );
}
