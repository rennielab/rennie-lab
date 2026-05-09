"use client";

import { useState } from "react";
import Link from "next/link";
import { ContactButton } from "@/components/chrome/ContactButton";
import { DownloadButton } from "@/components/chrome/DownloadButton";

type Service = {
  n: string;
  kicker: string;
  title: string;
  lead: string;
  includes: string[];
  crafts: string[];
  caseTitle: string;
  caseClient: string;
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
    caseTitle: "A national identity for an ocean policy coalition",
    caseClient: "Ocean Decade Australia",
    tone: "red",
  },
  {
    n: "02",
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
    caseTitle: "Repositioning a regional hotel group around the rhythm of country travel",
    caseClient: "Halfway Hotel Group",
    tone: "cream",
  },
  {
    n: "03",
    kicker: "Product",
    title: "Product Design",
    lead: "The internet uses more electricity than most countries. We design like that matters. Product and service design end to end: research, information architecture, interaction, interface, and shipped code. Pages built to load fast on a five-year-old phone in a regional area, and to stay accessible at the AA threshold without a separate audit. Systems built so the in-house team can keep building. The work we ship tends to be among the lightest in its category. We can show you the page weight.",
    includes: [
      "Product & service design",
      "Information architecture",
      "Interaction & prototyping",
      "Editorial digital experiences",
      "Design systems & component libraries",
      "Carbon-aware web & low-impact UX",
    ],
    crafts: ["Research", "IA", "UI", "Systems", "Prototype", "Carbon"],
    caseTitle: "A public ledger for measuring carbon held in seagrass",
    caseClient: "CSIRO + State Lab",
    tone: "ocean",
  },
  {
    n: "04",
    kicker: "Climate",
    title: "Climate & Impact Design",
    lead: "Forty percent of our capacity, mostly pro-bono and at-cost. Since 2019, over a million dollars invested in Australian climate, community and movement work. Programs and identities for charities, councils, coalitions, governments, and the curious. We design with the planet in the room from the first sketch, and the next seven generations on the wall behind it. Indigenous practice on this continent has run to seven-generation arcs for tens of thousands of years. We are still learning.",
    includes: [
      "Public-facing programs",
      "Movement & coalition identities",
      "Carbon-aware web & product",
      "Behavioural design for adaptation",
      "Editorial & reporting design",
      "Co-design with community",
    ],
    crafts: ["Programs", "Coalition", "Co-design", "Editorial", "Reporting"],
    caseTitle: "A community-led coalition for cool roofs, across eight inner-city councils",
    caseClient: "City of Sydney",
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
    caseTitle: "A year of fieldwork on permanence and the long-now economy",
    caseClient: "Studio research, ongoing",
    tone: "sand",
  },
];

const PROCESS = [
  { n: "01", t: "Gravity", d: "Every engagement starts with the pull. The question, the tension, or the truth the brief is really circling. Forty hours of conversation, on average, before the studio writes a word." },
  { n: "02", t: "Orbit", d: "Three loops, each tighter than the last. Research, strategy, expression. The work passes through every discipline before it lands, so the answer carries the weight of the whole team." },
  { n: "03", t: "Atmosphere", d: "The conditions the work has to live in. Codes, materials, behaviours, partners and the public-facing weather. We design the system before the surface." },
  { n: "04", t: "Re-entry", d: "Launch is the moment the brand meets the world. We stay in the room for the first burn. Rollout, training, governance." },
  { n: "05", t: "Return", d: "Eighteen months in, we come back. A second pass on the work, the metrics and the team. The orbit completes, and the next one begins from a wiser place." },
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
          style={{ margin: 0, maxWidth: "14ch", fontFamily: "var(--sans)", fontWeight: 600 }}
        >
          What we make,
          <br />
          and how we make it.
        </h1>
        <div className="svc-hero-grid rise delay-2">
          <p className="body-lg" style={{ margin: 0, maxWidth: "46ch" }}>
            Rennie Lab works in five overlapping disciplines: brand, advisory, product,
            climate and research. Most engagements move across two or three at once.
            None of them are sold by the hour.
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
                      <div className="ph svc-case-img" data-tone={s.tone}>
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
          <span className="mono">The Orbital design process · 05 phases</span>
        </div>
        <div className="svc-process-grid">
          <div>
            <h2
              className="h-1"
              style={{ margin: 0, maxWidth: "14ch", fontFamily: "var(--sans)", fontWeight: 600 }}
            >
              The Orbital
              <br />
              design
              <br />
              process.
            </h2>
            <p className="body" style={{ marginTop: 24, maxWidth: "36ch" }}>
              Our work doesn&apos;t move in a straight line. It loops around purpose,
              audience and consequence, each pass tighter than the last.
            </p>
          </div>
          <div className="svc-process-steps">
            {PROCESS.map((p) => (
              <div key={p.n} className="svc-step">
                <div className="svc-step-n mono">{p.n}</div>
                <div>
                  <h3
                    className="h-3"
                    style={{
                      margin: "0 0 12px",
                      fontFamily: "var(--sans)",
                      fontWeight: 600,
                    }}
                  >
                    {p.t}
                  </h3>
                  <p className="body" style={{ margin: 0, maxWidth: "52ch" }}>
                    {p.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-cta">
        <h2
          className="h-display"
          style={{ margin: 0, maxWidth: "16ch", fontFamily: "var(--sans)", fontWeight: 600 }}
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
