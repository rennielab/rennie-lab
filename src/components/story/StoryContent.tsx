"use client";

import { ContactButton } from "@/components/chrome/ContactButton";
import { LogoStrip } from "@/components/home/LogoStrip";

const TEAM = [
  { name: "Ben Rennie",     role: "Founder · Creative Director",  loc: "Sydney",      tone: "red",    yrs: "2017—" },
  { name: "Hana Okafor",    role: "Strategy Partner",             loc: "Los Angeles", tone: "cream",  yrs: "2019—" },
  { name: "Jules Marsden",  role: "Design Director",              loc: "Sydney",      tone: "moss",   yrs: "2020—" },
  { name: "Mateo Ríos",     role: "Climate Lead",                 loc: "Los Angeles", tone: "rust",   yrs: "2021—" },
  { name: "Priya Vance",    role: "Writer-in-Residence",          loc: "Sydney",      tone: "ocean",  yrs: "2022—" },
  { name: "Tomi Aluko",     role: "Movement Producer",            loc: "Los Angeles", tone: "sand",   yrs: "2022—" },
  { name: "Eli Park",       role: "Senior Designer",              loc: "Sydney",      tone: "ink",    yrs: "2023—" },
  { name: "Sara Goldstein", role: "Producer",                     loc: "Los Angeles", tone: "red",    yrs: "2024—" },
];

const TIMELINE = [
  { y: 2017, t: "Reny Studio opens in Surry Hills — five people, one room, one north star." },
  { y: 2019, t: "First climate brief — a coastal carbon program with CSIRO. The lane finds us." },
  { y: 2021, t: "Los Angeles outpost opens; the studio goes decentralised by design." },
  { y: 2023, t: "Reny becomes Rennie Lab. Same north star, sharper instruments." },
  { y: 2025, t: "Joins 1% for the Planet · launches the carbon ledger across the site." },
  { y: 2026, t: "B-Corp pending. Eight years of clean creative — and counting." },
];

const PRESS: [string, string, number][] = [
  ["It’s Nice That", "On Rennie Lab’s climate-first practice", 2025],
  ["Monocle",        "A studio split between Sydney and LA",   2024],
  ["Brand New",      "Reny Studio becomes Rennie Lab",         2023],
  ["Design Week",    "The agency model is broken. Here’s a fix.", 2024],
  ["AGDA Awards",    "Distinction · Identity · Tidewatch",     2024],
  ["D&AD Pencil",    "Wood · Service Design · Quiet Hours",    2025],
];

const NUMBERS: [string, string][] = [
  ["12+", "people across SYD and LA"],
  ["9", "years of work"],
  ["26", "partner brands"],
  ["1,820", "pro-bono hours · 2025"],
  ["0.21g", "avg CO₂e per page"],
  ["100%", "green-grid hosting"],
];

const PRINCIPLES: [string, string][] = [
  ["Slow on purpose", "We take fewer projects and we go deeper. The studio is sized so every piece of work has a partner’s hands on it from end to end."],
  ["Climate-aware by default", "Carbon, hosting, materials and travel are tracked on every project. The leaf in the corner is the visible part of a much longer ledger."],
  ["Decentralised", "Two cities, one team. Time zones are a feature; the work runs day and night, the brief is never quite asleep."],
  ["Quietly bold", "We don’t shout. The work does the talking, and most of it is the kind that takes a few years to be visible in the world."],
  ["Useful, before clever", "Strategy and design are tools, not tricks. The point is that the work works — for the partner, for the audience, for the planet that hosts both."],
  ["Built to be edited", "Every system we make is a starting point for in-house teams to take further. We design for the second decade, not the launch week."],
];

const STUDIOS = [
  { city: "Sydney", country: "Australia", addr: "Surry Hills · Eora · 33°S", body: "The original studio. Sits two blocks from the harbour, runs on flat whites and the occasional ocean swim. Home base for strategy and the climate practice.", tone: "red",   hours: "Mon–Fri · 9am–6pm AEST" },
  { city: "Los Angeles", country: "USA", addr: "Frogtown · Tongva · 34°N",   body: "Opened in 2021. A converted warehouse on the LA River, half studio, half workshop. Home base for design, production and our US partners.", tone: "cream", hours: "Mon–Fri · 9am–6pm PST" },
];

export function StoryContent() {
  return (
    <div className="container">
      {/* HERO */}
      <section style={{ padding: "40px 0 64px" }}>
        <div className="mono rise" style={{ marginBottom: 32 }}>
          Story · about the studio · est. 2017
        </div>
        <h1
          className="h-display rise delay-1"
          style={{ margin: 0, maxWidth: "16ch" }}
        >
          We are a creative advisory studio built for the long now.
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: 64,
            marginTop: 64,
            alignItems: "end",
          }}
        >
          <p
            className="body-lg rise delay-2"
            style={{ margin: 0, maxWidth: "52ch" }}
          >
            A small, deliberately decentralised group of strategists, designers and writers
            between Sydney and Los Angeles — quietly partnering with bold brands, governments
            and movements on the work that earns the right to last.
          </p>
          <div
            className="rise delay-3"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <ContactButton>
              Start a project <span className="arrow">→</span>
            </ContactButton>
            <button type="button" className="btn btn-ghost">
              Download capability deck ↓
            </button>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section
        style={{
          padding: "96px 0 96px",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          margin: "32px 0 64px",
        }}
      >
        <div className="mono" style={{ marginBottom: 40 }}>Manifesto · 01</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <h2 className="h-1" style={{ margin: 0, maxWidth: "14ch" }}>
            Most creative work was built for a faster, hungrier century.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p className="body-lg" style={{ margin: 0 }}>
              Rennie Lab exists because the world doesn’t need more brands shouting; it needs
              fewer doing better. We came out of <strong>Reny Studio</strong>, which opened in
              2017 with five people in one room in Surry Hills. The name changed in 2023 — the
              practice didn’t.
            </p>
            <p className="body-lg" style={{ margin: 0 }}>
              Most of our work is strategy and advisory: helping bold brands clarify what
              they’re actually for, then shaping the experiences and movements that follow.
              The thread that runs through it all is impact — across climate, community and
              movement — and the conviction that craft, when it’s pointed at the right thing,
              is still one of the few tools that can move people.
            </p>
            <p className="body-lg" style={{ margin: 0 }}>
              We’re here for the long, slow, deliberate work. The kind that takes a few years
              to be visible — and a lifetime to forget.
            </p>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section style={{ padding: "64px 0 96px" }}>
        <div className="mono" style={{ marginBottom: 32 }}>Lab · in numbers</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {NUMBERS.map(([v, l], i) => (
            <div
              key={i}
              style={{
                padding: "32px 24px",
                borderTop: "1px solid var(--line)",
                borderRight: i % 3 !== 2 ? "1px solid var(--line)" : "none",
                borderBottom: i >= 3 ? "1px solid var(--line)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 700,
                  fontSize: "clamp(56px, 7vw, 112px)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {v}
              </div>
              <div className="mono" style={{ marginTop: 16 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRINCIPLES */}
      <section style={{ padding: "96px 0", borderTop: "1px solid var(--line)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 64,
            marginBottom: 56,
          }}
        >
          <div>
            <div className="mono" style={{ marginBottom: 24 }}>What we believe · 02</div>
            <h2 className="h-1" style={{ margin: 0, maxWidth: "12ch" }}>
              Six things we keep coming back to.
            </h2>
          </div>
          <p
            className="body-lg"
            style={{ margin: 0, alignSelf: "end", maxWidth: "46ch" }}
          >
            None of this is rules. It’s the shape of how we keep choosing to work — pinned up
            in both studios, edited often, taken seriously.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            borderTop: "1px solid var(--line)",
          }}
        >
          {PRINCIPLES.map(([h, p], i) => (
            <div
              key={i}
              style={{
                padding: "40px 32px",
                borderRight: i % 3 !== 2 ? "1px solid var(--line)" : "none",
                borderBottom: i < 3 ? "1px solid var(--line)" : "none",
              }}
            >
              <div className="mono" style={{ marginBottom: 24 }}>0{i + 1}</div>
              <h3 className="h-3" style={{ margin: "0 0 16px" }}>{h}</h3>
              <p className="body" style={{ margin: 0, maxWidth: "36ch" }}>{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ padding: "96px 0", borderTop: "1px solid var(--line)" }}>
        <div className="mono" style={{ marginBottom: 32 }}>
          A short history · Reny → Rennie Lab
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 64 }}>
          <h2 className="h-1" style={{ margin: 0, alignSelf: "start" }}>
            Nine years of clean creative.
          </h2>
          <div>
            {TIMELINE.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: 32,
                  padding: "32px 0",
                  borderTop: "1px solid var(--line)",
                  alignItems: "baseline",
                }}
              >
                <div className="mono" style={{ fontSize: 14 }}>{t.y}</div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 500,
                    fontSize: "clamp(20px, 2vw, 28px)",
                    lineHeight: 1.3,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {t.t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TWO STUDIOS */}
      <section style={{ padding: "96px 0", borderTop: "1px solid var(--line)" }}>
        <div className="mono" style={{ marginBottom: 32 }}>Two studios · one weather front</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {STUDIOS.map((s, i) => (
            <article key={i} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div className="ph" data-tone={s.tone} style={{ aspectRatio: "4/3" }}>
                <span className="ph-tag">
                  {s.city.toUpperCase()} · {s.country}
                </span>
              </div>
              <div style={{ padding: 32 }}>
                <h3
                  className="h-2"
                  style={{ margin: "0 0 8px", fontSize: "clamp(28px, 3vw, 44px)" }}
                >
                  {s.city}
                </h3>
                <div className="mono" style={{ marginBottom: 20 }}>{s.addr}</div>
                <p className="body" style={{ margin: 0 }}>{s.body}</p>
                <div className="mono" style={{ marginTop: 24, color: "var(--ink-3)" }}>
                  {s.hours}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section style={{ padding: "96px 0", borderTop: "1px solid var(--line)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 64,
            marginBottom: 48,
            alignItems: "end",
          }}
        >
          <div>
            <div className="mono" style={{ marginBottom: 24 }}>
              The lab · {TEAM.length} + collaborators
            </div>
            <h2 className="h-1" style={{ margin: 0, maxWidth: "12ch" }}>
              One team, two cities.
            </h2>
          </div>
          <p className="body-lg" style={{ margin: 0, maxWidth: "52ch" }}>
            We’re small on purpose — partner-led, generalist by training, specialist by
            instinct. Every project is run end to end by the people who scoped it.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {TEAM.map((p) => (
            <article key={p.name} className="card">
              <div className="ph" data-tone={p.tone} style={{ aspectRatio: "4/5" }}>
                <span className="ph-tag">
                  {p.loc} · {p.yrs}
                </span>
              </div>
              <div style={{ padding: 18 }}>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 600,
                    fontSize: 18,
                    lineHeight: 1.2,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {p.name}
                </div>
                <div className="mono" style={{ marginTop: 6 }}>{p.role}</div>
              </div>
            </article>
          ))}
          <article className="card" style={{ display: "flex", flexDirection: "column" }}>
            <div
              className="ph"
              data-tone="ink"
              style={{ aspectRatio: "4/5", display: "grid", placeItems: "center" }}
            >
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 700,
                  fontSize: "clamp(40px, 4vw, 64px)",
                  color: "var(--cream)",
                  letterSpacing: "-0.03em",
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                You?
              </div>
            </div>
            <div style={{ padding: 18 }}>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: "-0.015em",
                }}
              >
                We’re hiring
              </div>
              <div className="mono" style={{ marginTop: 6 }}>2 open roles · SYD + LA</div>
            </div>
          </article>
        </div>
      </section>

      {/* PRESS */}
      <section style={{ padding: "96px 0", borderTop: "1px solid var(--line)" }}>
        <div className="mono" style={{ marginBottom: 32 }}>
          Partners &amp; collaborators · selected
        </div>
        <div style={{ marginBottom: 56 }}>
          <LogoStrip />
        </div>
        <div className="mono" style={{ marginBottom: 32 }}>Press &amp; recognition · selected</div>
        <h2 className="h-2" style={{ margin: "0 0 56px", maxWidth: "20ch" }}>
          The work, occasionally, gets noticed.
        </h2>
        <div>
          {PRESS.map(([pub, line, yr], i) => (
            <a
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 120px 60px",
                gap: 32,
                padding: "28px 0",
                borderTop: "1px solid var(--line)",
                alignItems: "baseline",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 600,
                  fontSize: "clamp(20px, 1.8vw, 28px)",
                  letterSpacing: "-0.02em",
                }}
              >
                {pub}
              </div>
              <div className="body" style={{ margin: 0 }}>{line}</div>
              <div className="mono">{yr}</div>
              <div className="mono" style={{ textAlign: "right" }}>↗</div>
            </a>
          ))}
          <div style={{ height: 1, background: "var(--line)" }}></div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section
        style={{ padding: "120px 0 96px", borderTop: "1px solid var(--line)" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 80,
            alignItems: "end",
          }}
        >
          <h2 className="h-display" style={{ margin: 0, maxWidth: "12ch" }}>
            Working on something quietly important?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="body-lg" style={{ margin: 0, maxWidth: "36ch" }}>
              We open one or two new partnerships a quarter. Tell us what you’re building —
              we read every brief.
            </p>
            <ContactButton style={{ alignSelf: "flex-start" }}>
              Open the brief <span className="arrow">→</span>
            </ContactButton>
          </div>
        </div>
      </section>
    </div>
  );
}
