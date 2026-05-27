"use client";

import { useState } from "react";
import Link from "next/link";
import { ContactButton } from "@/components/chrome/ContactButton";
import { DownloadButton } from "@/components/chrome/DownloadButton";
import { OrbitalDiagram } from "@/components/services/OrbitalDiagram";

type Service = {
  n: string;
  kicker: string;
  title: string;
  lead: string;
  includes: string[];
  crafts: string[];
  caseTitle: string;
  caseClient: string;
  caseImage: string;
  tone: "red" | "cream" | "ocean" | "moss" | "sand";
};

const SERVICES: Service[] = [
  {
    n: "01",
    kicker: "Brand",
    title: "Brand Identity & Strategy",
    lead: "We build brands for their second decade. Most identity systems are designed to win a launch. Ours are designed to outlast a CMO, a category shift, and the in-house team that will inherit them. Positioning, narrative, identity, voice, rollout, and the documentation that lets your people take it further without coming back to us for permission. The work we are proudest of looks newer at year five than it did at launch.",
    includes: [
      "Brand positioning & narrative",
      "Visual identity systems",
      "Naming & verbal identity",
      "Brand architecture",
      "Guidelines & toolkits",
      "Launch strategy & rollout",
    ],
    crafts: ["Strategy", "Identity", "Naming", "Verbal", "Type", "Motion"],
    caseTitle: "Renaming Mental Strength",
    caseClient: "Marlee · formerly F4S",
    caseImage: "/projects/marlee.webp",
    tone: "red",
  },
  {
    n: "02",
    kicker: "Products",
    title: "Digital Products",
    lead: "Websites, apps and the digital products that bring brands to life. End-to-end product and service design: research, information architecture, interaction, interface, and shipped code. Pages built to load fast on a five-year-old phone in a regional area, and to stay accessible at the AA threshold without a separate audit. Systems built so the in-house team can keep building. The work we ship tends to be among the lightest in its category. We can show you the page weight.",
    includes: [
      "Websites & web platforms",
      "Native & web apps",
      "Information architecture",
      "Interaction & prototyping",
      "Design systems & component libraries",
      "Carbon-aware web & low-impact UX",
    ],
    crafts: ["Research", "IA", "UI", "Systems", "Prototype", "Carbon"],
    caseTitle: "Unifying a National Foundation",
    caseClient: "Heart Foundation Australia",
    caseImage: "/projects/heartfoundation.webp",
    tone: "ocean",
  },
  {
    n: "03",
    kicker: "Advisory",
    title: "Strategic Advisory",
    lead: "Strategy work that doesn't end in a deck. We sit beside founders, boards, CMOs and executive directors as a long-form retained partner. Monthly, sometimes for years. We are in the room for the hard board conversation, the capital raise, the announcement that lands wrong, the rebrand that scares the legal team. Most of what we do here never carries our name. That is the point.",
    includes: [
      "Founder & CEO advisory",
      "Brand health audits",
      "Portfolio & architecture reviews",
      "Strategic counsel by retainer",
      "Board-level workshops",
      "Capital-raise narrative",
    ],
    crafts: ["Counsel", "Workshops", "Audit", "Narrative", "Pitch"],
    caseTitle: "Making Generosity Visible",
    caseClient: "Patagonia × 1% For The Planet",
    caseImage: "/projects/patagonia.webp",
    tone: "cream",
  },
  {
    n: "04",
    kicker: "Environments",
    title: "Environments & Spaces",
    lead: "Spaces that work as hard as the people inside them. Retail, training facilities, exhibition design, brand environments — designed end to end with our partners. From the National Snowsports Training Centre in Jindabyne (a $12.8M facility for Snow Australia, NSWIS and the AIS) to flagship retail concepts for Buck Mason, Herschel and Mr Simple, the work is the same: read the brief, understand how people will move through the space, design with the operator and the long term in mind.",
    includes: [
      "Retail & flagship store design",
      "Training & high-performance environments",
      "Exhibition & brand activations",
      "Wayfinding & signage systems",
      "Material specification & joinery detail",
      "Fitout coordination with builders",
    ],
    crafts: ["Retail", "Wayfinding", "Spec", "Materials", "Activation"],
    caseTitle: "Designing for Olympic Performance",
    caseClient: "Snow Australia · NSWIS · AIS — National Snowsports Training Centre",
    caseImage: "/projects/nswis.webp",
    tone: "moss",
  },
  {
    n: "05",
    kicker: "Research",
    title: "Research & Insight",
    lead: "Most studios fold research into a project. We sell it on its own. Standalone fieldwork, interviews, archive and ethnography for studios, brands, policy teams and editorial titles who need a second mind in the room. We treat research as craft, and the deliverable is whatever form the work needs to take. A printed book, a public-facing site, a board paper, a year-long ethnography that will not be published for a decade. The point is that the work is true, and that it changes what the people who commissioned it do next.",
    includes: [
      "Audience research",
      "Cultural insight reports",
      "Field & ethnographic studies",
      "Archive & desk research",
      "Trends & foresight",
      "Strategic synthesis",
    ],
    crafts: ["Interview", "Field", "Archive", "Ethnography", "Synthesis"],
    caseTitle: "Innovating Australia's Innovator",
    caseClient: "John Holland · Rozelle Interchange",
    caseImage: "/projects/rozelleinterchange.webp",
    tone: "sand",
  },
];

const PROCESS = [
  { n: "01", t: "Origins",     d: "Understand the root causes and systemic dynamics of the problem. Use system mapping, stakeholder analysis, and sustainability assessments to see what's actually happening beneath the surface." },
  { n: "02", t: "Junctions",   d: "Identify the intersections and relationships within the system. Find the leverage points where small changes can create big impact. Map the key players, spot the risks, see the opportunities." },
  { n: "03", t: "Connections", d: "Develop concepts that address immediate needs and long-term impacts. This is where you brainstorm, ideate, and prototype with systems thinking baked in from the start." },
  { n: "04", t: "Reflections", d: "Gather feedback, assess impact, refine. Use tools like gigamapping and scenario planning to evaluate how the solution performs within the broader systems it touches." },
  { n: "05", t: "Directions",  d: "Make the necessary adjustments based on what you learned in Reflections. Prepare for implementation by maximising positive impacts across Systems, Humanity, and Ecology." },
  { n: "06", t: "Horizons",    d: "Look forward. Plan for scalability, adaptability, and regeneration. Make sure the solution can evolve as contexts change and systems shift." },
];

const PILLARS = [
  { letter: "S", word: "Systems",  body: "The interconnected frameworks that shape how things work — economies, supply chains, infrastructure, organisations. Systems are the scaffolding of modern life." },
  { letter: "H", word: "Humanity", body: "The collective wellbeing of people, communities, cultures. Everyone, not just the end user. Current generations, future generations, communities across the globe." },
  { letter: "E", word: "Ecology",  body: "The natural world we depend on — ecosystems, biodiversity, water, soil, air, climate. Ecology is the foundation on which everything else stands." },
];

const ORBITAL_STATS: { tag: string; v: string; sub: string }[] = [
  { tag: "We crossed the line",  v: "1.6°C", sub: "2024 became the first year to clearly exceed the Paris Agreement threshold." },
  { tag: "Determined at design", v: "80%",   sub: "Product environmental impact is locked in during the design phase." },
  { tag: "The deadline",         v: "2030",  sub: "Emissions must drop 42% by 2030 to limit warming to 1.5°C." },
];

export function ServicesContent() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="container svc-page">
      <section className="svc-hero">
        <div className="mono rise" style={{ marginBottom: 32 }}>
          <span
            className="dot dot-pulse"
            style={{ background: "var(--ink)", marginRight: 10 }}
          ></span>
          Services · Five disciplines · One partner from start to finish
        </div>
        <h1
          className="h-display rise delay-1"
          style={{ margin: 0, maxWidth: "14ch", fontFamily: "var(--sans)", fontWeight: 700 }}
        >
          What we make,
          <br />
          and how we make it.
        </h1>
        <div className="svc-hero-grid rise delay-2">
          <p className="body-lg" style={{ margin: 0, maxWidth: "46ch" }}>
            Rennie Lab works in five overlapping disciplines: brand, products, advisory,
            environments and research. Most engagements move across two or three at
            once. None of them are sold by the hour.
          </p>
          <div className="svc-hero-meta">
            <div>
              <div className="mono">Engagement</div>
              <div className="svc-meta-v">12 weeks → 5 years</div>
            </div>
            <div>
              <div className="mono">Team</div>
              <div className="svc-meta-v">2 partners minimum</div>
            </div>
            <div>
              <div className="mono">Commitment</div>
              <div className="svc-meta-v">40% impact, 60% commercial</div>
            </div>
            <div>
              <div className="mono">Geography</div>
              <div className="svc-meta-v">Sydney · Los Angeles</div>
            </div>
            <div
              style={{
                gridColumn: "1 / -1",
                marginTop: 16,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <DownloadButton kind="deck">
                Download capabilities deck <span className="arrow">↓</span>
              </DownloadButton>
              <ContactButton className="btn btn-ghost">
                Start a brief <span className="arrow">→</span>
              </ContactButton>
            </div>
          </div>
        </div>
      </section>

      <section className="svc-list">
        <div className="svc-list-head">
          <span className="mono">The disciplines · 05</span>
          <span className="mono">{String(openIdx + 1).padStart(2, "0")} / 05</span>
        </div>

        {SERVICES.map((s, i) => {
          const isOpen = openIdx === i;
          return (
            <article
              key={s.n}
              className="svc-row"
              data-open={isOpen}
              data-tone={s.tone}
            >
              <button
                type="button"
                className="svc-row-head"
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
              >
                <div className="svc-row-l">
                  <span className="mono svc-row-num">{s.n}</span>
                  <span className="svc-row-kicker mono">{s.kicker}</span>
                </div>
                <div className="svc-row-title h-1">{s.title}</div>
                <div className="svc-row-toggle" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                      d="M4 10h12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    {!isOpen && (
                      <path
                        d="M10 4v12"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </div>
              </button>

              <div className="svc-row-body">
                <div className="svc-row-body-inner">
                  <div className="svc-row-grid">
                    <div className="svc-col-l">
                      <p className="svc-lead">{s.lead}</p>
                      <div className="svc-crafts">
                        {s.crafts.map((c) => (
                          <span key={c} className="tag">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="svc-col-m">
                      <div className="mono" style={{ marginBottom: 18 }}>
                        What&apos;s included
                      </div>
                      <ul className="svc-includes">
                        {s.includes.map((x) => (
                          <li key={x}>
                            <span>{x}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="svc-col-r">
                      <div
                        className="ph svc-case-img"
                        data-tone={s.tone}
                        style={{
                          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 55%), url(${s.caseImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <span className="ph-tag">Featured · {s.kicker}</span>
                      </div>
                      <div className="mono" style={{ marginTop: 16 }}>
                        {s.caseClient}
                      </div>
                      <div className="svc-case-title">{s.caseTitle}</div>
                      <Link href="/projects" className="btn btn-ghost svc-case-btn">
                        See the work <span className="arrow">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="svc-process">
        <div className="svc-process-head">
          <span className="mono">Orbital design · 03 pillars · 06 phases · since 2019</span>
        </div>
        <div className="svc-process-grid">
          <div>
            <h2
              className="h-1"
              style={{ margin: 0, maxWidth: "14ch", fontFamily: "var(--sans)", fontWeight: 700 }}
            >
              Orbital
              <br />
              Design.
            </h2>
            <p className="body-lg" style={{ marginTop: 24, maxWidth: "40ch" }}>
              Orbital Design creates a path for meaningful, regenerative impact.
            </p>
            <p className="body" style={{ marginTop: 24, maxWidth: "44ch" }}>
              In 2019, we created Orbital Design to give Mother Nature a seat at the
              table. A framework for designing solutions that work for humanity, not
              just humans. Because humans exist in systems. We exist in ecosystems.
              And when we design without considering that reality, we create problems
              faster than we solve them.
            </p>
          </div>
          <OrbitalDiagram />
        </div>

        {/* SHE — three pillars */}
        <div style={{ marginTop: 96, paddingTop: 56, borderTop: "1px solid var(--line)" }}>
          <div className="mono" style={{ marginBottom: 32 }}>
            What is Orbital Design · 03 pillars
          </div>
          <h3
            className="h-2"
            style={{ margin: "0 0 48px", maxWidth: "28ch", fontFamily: "var(--sans)", fontWeight: 700 }}
          >
            Three pillars that orbit and recalibrate with each other. We call them SHE.
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {PILLARS.map((p, i) => (
              <div
                key={p.letter}
                style={{
                  padding: "32px 28px",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <span
                    style={{
                      fontFamily: "var(--sans)",
                      fontWeight: 700,
                      fontSize: 80,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      color: "var(--accent)",
                    }}
                  >
                    {p.letter}
                  </span>
                  <span className="mono">0{i + 1}</span>
                </div>
                <h4
                  style={{
                    margin: 0,
                    fontFamily: "var(--sans)",
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {p.word}
                </h4>
                <p className="body" style={{ margin: 0 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Six phases */}
        <div style={{ marginTop: 96, paddingTop: 56, borderTop: "1px solid var(--line)" }}>
          <div className="mono" style={{ marginBottom: 32 }}>
            The six phases · you orbit, you don&apos;t march
          </div>
          <h3
            className="h-2"
            style={{ margin: "0 0 16px", maxWidth: "26ch", fontFamily: "var(--sans)", fontWeight: 700 }}
          >
            You don&apos;t go 1 to 6 and call it done. You move between them based on what the work needs.
          </h3>
          <p className="body" style={{ margin: "0 0 56px", maxWidth: "62ch" }}>
            Sometimes you start at Junctions. Sometimes you loop back to Origins after
            Reflections. The framework adapts because reality is complex.
          </p>
          <div className="svc-phases">
            {PROCESS.map((p, i) => (
              <article key={p.n} className="svc-phase" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="svc-phase-meta">
                  <span className="svc-phase-num mono">{p.n}</span>
                  <span className="svc-phase-dot" aria-hidden="true"></span>
                  <span className="svc-phase-of mono">of 06</span>
                </div>
                <h3 className="svc-phase-title">{p.t}</h3>
                <p className="svc-phase-desc">{p.d}</p>
                <span className="svc-phase-loop" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M3 11a8 8 0 1 0 2.4-5.7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 3v4h4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </article>
            ))}
          </div>
        </div>

        {/* Why it matters — stats */}
        <div style={{ marginTop: 96, paddingTop: 56, borderTop: "1px solid var(--line)" }}>
          <div className="mono" style={{ marginBottom: 32 }}>
            Why it matters
          </div>
          <h3
            className="h-2"
            style={{ margin: "0 0 16px", maxWidth: "24ch", fontFamily: "var(--sans)", fontWeight: 700 }}
          >
            80% of environmental impact gets locked in during the design phase.
          </h3>
          <p className="body" style={{ margin: "0 0 64px", maxWidth: "62ch" }}>
            Every decision a designer, creator or builder makes carries weight. Orbital
            Design is a way to use that power responsibly — solutions that support
            people, respect planetary boundaries, and work within the systems we all
            depend on.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {ORBITAL_STATS.map((s) => (
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
                <p className="body" style={{ margin: 0 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Who it's for + How you use it */}
        <div
          style={{
            marginTop: 96,
            paddingTop: 56,
            borderTop: "1px solid var(--line)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
          }}
        >
          <div>
            <div className="mono" style={{ marginBottom: 24 }}>Who it&apos;s for</div>
            <h3
              className="h-3"
              style={{ margin: "0 0 16px", fontFamily: "var(--sans)", fontWeight: 700 }}
            >
              Anyone creating solutions.
            </h3>
            <p className="body" style={{ margin: "0 0 16px", maxWidth: "44ch" }}>
              Designers shaping products, services or experiences. Organisations
              building strategies or solving systemic challenges. Communities working
              on local or global problems.
            </p>
            <p className="body" style={{ margin: 0, maxWidth: "44ch" }}>
              You don&apos;t need a design degree. You need the willingness to think
              beyond the immediate problem in front of you, and the willingness to give
              Systems, Humanity and Ecology equal weight at the table.
            </p>
          </div>
          <div>
            <div className="mono" style={{ marginBottom: 24 }}>How you use it</div>
            <h3
              className="h-3"
              style={{ margin: "0 0 16px", fontFamily: "var(--sans)", fontWeight: 700 }}
            >
              Start with the challenge. Then ask which pillar needs attention first.
            </h3>
            <p className="body" style={{ margin: "0 0 16px", maxWidth: "44ch" }}>
              Infrastructure, supply chains, organisational change → start with
              Systems. Community wellbeing, equity, cultural impact → start with
              Humanity. Climate, biodiversity, resource use → start with Ecology.
            </p>
            <p className="body" style={{ margin: 0, maxWidth: "44ch" }}>
              Move through the six phases, but stay flexible. The framework guides you;
              you drive the orbit. Design with Mother Nature at the table. That&apos;s
              how you use it.
            </p>
          </div>
        </div>
      </section>

      <section className="svc-cta">
        <h2
          className="h-display"
          style={{ margin: 0, maxWidth: "16ch", fontFamily: "var(--sans)", fontWeight: 700 }}
        >
          Have a brief, or just a question?
        </h2>
        <div className="svc-cta-row">
          <p className="body-lg" style={{ margin: 0, maxWidth: "42ch" }}>
            Most engagements start with a thirty-minute conversation, on or off the
            record. Tell us what you&apos;re working on. We&apos;ll tell you whether
            we&apos;re the right studio for it.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <ContactButton>
              Open the brief <span className="arrow">→</span>
            </ContactButton>
            <Link href="/story" className="btn btn-ghost">
              Read the story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
