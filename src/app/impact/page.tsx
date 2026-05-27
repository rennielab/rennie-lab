import { ContactButton } from "@/components/chrome/ContactButton";
import { IMPACT_CASE_STUDIES, type ImpactCategory } from "@/data/impactProjects";
import { ImpactCard } from "@/components/impact/ImpactCard";
import { AffiliationStrip } from "@/components/affiliations/AffiliationStrip";
import { ImpactFeatured } from "@/components/impact/ImpactFeatured";

export const metadata = {
  title: "Impact",
  description:
    "Forty percent of our capacity, given to the commons. Climate, community and movement work — pro-bono and at-cost programs across seventeen years.",
};

const NUMBERS: [string, string][] = [
  ["$1.1M+", "into the commons · since 2009"],
  ["22", "impact partners"],
  ["115", "impact projects"],
  ["40%", "of capacity · ongoing"],
];

const STAKES: { tag: string; v: string; sub: string }[] = [
  { tag: "We crossed the line",  v: "1.6°C", sub: "The first year to exceed the Paris Agreement threshold." },
  { tag: "Determined at design", v: "80%",   sub: "Product environmental impact, locked in during design." },
  { tag: "The deadline",         v: "2030",  sub: "Emissions must drop 42% to limit warming to 1.5°C." },
];

const PILLARS: { id: ImpactCategory; title: string; intro: string }[] = [
  {
    id: "climate",
    title: "Climate",
    intro:
      "Where the work meets the planet. Reforestation, redistribution, climate strategy as the operating logic — not the marketing line. Pointed at the systems that determine whether the next century is liveable.",
  },
  {
    id: "community",
    title: "Community",
    intro:
      "Where craft gets pointed at the people. Mental-health movements, hospital experience, community-led infrastructure. Built for the spaces between brands and society — and the long, slow work of holding them together.",
  },
  {
    id: "movement",
    title: "Movement",
    intro:
      "Where energy gets pointed at change. Athletes, marathons, the body in motion. Movements that make the case for something bigger than the result, and outlast the campaign that started them.",
  },
];

const FEATURED_SLUG = "patagonia-1percent";

export default function ImpactPage() {
  const featured = IMPACT_CASE_STUDIES.find((c) => c.slug === FEATURED_SLUG);
  const rest = IMPACT_CASE_STUDIES.filter((c) => c.slug !== FEATURED_SLUG);

  return (
    <div className="container">
      {/* Hero */}
      <section style={{ padding: "40px 0 64px" }}>
        <div className="mono rise" style={{ marginBottom: 32 }}>
          Impact · pro-bono + at-cost · climate · community · movement
        </div>
        <h1
          className="h-display rise delay-1"
          style={{ margin: 0, maxWidth: "16ch" }}
        >
          Work for the commons.
        </h1>
        <p
          className="body-lg rise delay-2"
          style={{ marginTop: 24, maxWidth: "60ch" }}
        >
          Forty percent of the studio&apos;s capacity, mostly pro-bono and at-cost.
          Programs and identities for charities, councils, coalitions, and the curious
          — chosen for their contribution to something larger than the brief.
        </p>
      </section>

      {/* Manifesto pull-quote — single declarative moment */}
      <section
        style={{
          padding: "96px 0",
          marginBottom: 80,
        }}
      >
        <div className="mono" style={{ marginBottom: 32 }}>
          The thesis · 01
        </div>
        <h2
          className="h-display"
          style={{
            margin: 0,
            maxWidth: "20ch",
            fontFamily: "var(--sans)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
          }}
        >
          Most studios call this their charity work. We call it the spine.
        </h2>
        <p
          className="body-lg"
          style={{ marginTop: 32, maxWidth: "56ch", color: "var(--ink-2)" }}
        >
          Since 2019 we have run a forty/sixty split. Forty percent of the studio&apos;s
          capacity goes to climate, community and movement work, mostly pro-bono and
          at-cost. The other sixty pays for it. The two halves don&apos;t compete for
          attention — they argue with each other, and the work is sharper for it.
        </p>
      </section>

      {/* Affiliations strip — credentials we hold ourselves to */}
      <section
        style={{
          padding: "32px 0 48px",
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

      {/* Stakes — the world the work is happening in */}
      <section
        style={{ padding: "0 0 96px" }}
      >
        <div className="mono" style={{ marginBottom: 32 }}>
          The stakes · why this work
        </div>
        <h2
          className="h-2"
          style={{ margin: "0 0 56px", maxWidth: "26ch", fontWeight: 700 }}
        >
          The world is past the threshold and the design phase is where the future
          gets locked in.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
          }}
        >
          {STAKES.map((s) => (
            <div
              key={s.tag}
              style={{
                padding: "28px 24px",
                borderTop: "1px solid var(--line)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div className="mono">{s.tag}</div>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 700,
                  fontSize: "clamp(56px, 6vw, 96px)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "var(--accent)",
                }}
              >
                {s.v}
              </div>
              <p className="body" style={{ margin: 0 }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured case study — magazine moment */}
      {featured && <ImpactFeatured caseStudy={featured} />}

      {/* Case studies grouped by pillar */}
      <section style={{ padding: "0 0 64px" }}>
        {PILLARS.map((pillar) => {
          const cases = rest.filter((c) => c.category === pillar.id);
          if (cases.length === 0) return null;
          return (
            <div key={pillar.id} style={{ marginBottom: 96 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 64,
                  alignItems: "end",
                  marginBottom: 40,
                  paddingTop: 64,
                  borderTop: "1px solid var(--line)",
                }}
              >
                <div>
                  <div className="mono" style={{ marginBottom: 24 }}>
                    {`Pillar · 0${PILLARS.indexOf(pillar) + 1} of 03 · ${cases.length} programs`}
                  </div>
                  <h2
                    className="h-1"
                    style={{
                      margin: 0,
                      maxWidth: "12ch",
                      fontFamily: "var(--sans)",
                      fontWeight: 700,
                    }}
                  >
                    {pillar.title}
                  </h2>
                </div>
                <p className="body-lg" style={{ margin: 0, maxWidth: "60ch" }}>
                  {pillar.intro}
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                }}
              >
                {cases.map((c) => (
                  <ImpactCard key={c.slug} caseStudy={c} />
                ))}
              </div>
            </div>
          );
        })}
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
