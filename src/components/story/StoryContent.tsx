"use client";

import { ContactButton } from "@/components/chrome/ContactButton";
import { LogoStrip } from "@/components/home/LogoStrip";

type Partner = {
  name: string;
  role: string;
  loc: string;
  image?: string;
  tone: "red" | "cream" | "moss" | "ocean" | "rust" | "sand" | "ink";
};

const PARTNERS: Partner[] = [
  { name: "Ben Rennie",    role: "Co-Founder · Creative Director",        loc: "Sydney", image: "/team/ben.jpg",    tone: "ink" },
  { name: "Nicola Rennie", role: "Co-Founder · Strategy & Operations",    loc: "Sydney", image: "/team/nicola.jpg", tone: "moss" },
  { name: "El Moore",      role: "Studio Director",                       loc: "Sydney",                            tone: "red" },
  { name: "Orkan Silmaz",  role: "Head of Digital",                       loc: "Sydney",                            tone: "rust" },
];

const CREDITS: { role: string; names: string[] }[] = [
  { role: "Design",             names: ["Saoirse Doyle", "Mei-Ling Tan", "Astrid Linde", "Hayato Mori", "Pari Jafari", "Aslı Demir", "Renata Vargas", "Lukas Becker", "Min-Joo Lee"] },
  { role: "Development",        names: ["Dilara Akın", "Min-jun Park", "Cem Yıldız", "Rohan Mehta", "Emil Hoffmann"] },
  { role: "Creative Direction", names: ["Margot Bell", "Jelena Marković", "Aiko Watanabe", "Yara Khalil"] },
  { role: "Production",         names: ["Tilly Ash", "Henriette Aas", "Beau Whittaker"] },
  { role: "Writing & Research", names: ["Sofía Mendoza", "Anjali Banerjee", "Imani Okafor", "Lola Bezerra", "Hudson Reid"] },
];

const TIMELINE = [
  { y: 2009, t: "Founded in Melbourne as 6.2 Innovation Lab." },
  { y: 2011, t: "First Sydney studio opens in Surry Hills." },
  { y: 2014, t: "Launches a digital agency inside the studio." },
  { y: 2017, t: "First clients in the United States." },
  { y: 2019, t: "Shifts from traditional agency to impact model. The forty/sixty split begins." },
  { y: 2020, t: "Starts research into digital carbon and product circularity." },
  { y: 2021, t: "Opens Rennie Lab LA in a WeWork on Santa Monica Boulevard." },
  { y: 2022, t: "Begins the B Corp journey for the second time. Starts working with clients and agencies in New York." },
  { y: 2023, t: "Certified B Corp. One of the first creative agencies in Australia to make it through." },
  { y: 2024, t: "Opens a third studio in Salt Lake City." },
  { y: 2025, t: "Ends partnership with Reny and closes the Salt Lake City studio. Rennie Lab moves to a focused creative and advisory model." },
];

const PRESS: { line: string; tag: string }[] = [
  { line: "Australian New Media Agency of the Year",                          tag: "Award" },
  { line: "Lessons in Creativity — Small Business Book of the Year (Runner Up)", tag: "Recognition" },
  { line: "AWWWARDS Honorable Mentions × 12",                                 tag: "Recognition" },
  { line: "Financial Review Innovation Awards · Finalist",                    tag: "Recognition" },
  { line: "TEDx · Macquarie University",                                      tag: "Talk · Ben Rennie" },
  { line: "SXSW Sydney 2025",                                                  tag: "Talk · Ben Rennie" },
  { line: "Parliament House · Innovation Talk",                                tag: "Talk · Ben Rennie" },
  { line: "World Design Congress · London",                                    tag: "Talk · Ben & Nicola Rennie" },
  { line: "B Corp Conference",                                                 tag: "Talk · Ben & Nicola Rennie" },
  { line: "Australian Design Conference · Brisbane",                           tag: "Talk · Ben Rennie" },
  { line: "Melbourne Design Week",                                             tag: "Talk · Ben Rennie" },
];

const NUMBERS: [string, string][] = [
  ["17", "years"],
  ["1,900+", "projects"],
  ["233", "clients"],
  ["$1.1M", "in impact"],
  ["40%", "impact, by capacity"],
  ["9", "countries worked in"],
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
  {
    city: "Sydney",
    country: "Australia",
    addr: "Surry Hills · Eora · 33°S",
    body: "The original studio. Two blocks from the harbour, runs on flat whites and the occasional ocean swim. Home base for strategy and the climate practice.",
    tone: "red",
    hours: "Mon–Fri · 9am–6pm AEST",
    image: "/studios/sydney.webp",
  },
  {
    city: "Los Angeles",
    country: "USA",
    addr: "Santa Monica · Tongva · 34°N",
    body: "Opened in 2021. A WeWork in Santa Monica, then bigger. Home base for design, production and our US partners.",
    tone: "cream",
    hours: "Mon–Fri · 9am–6pm PST",
    image: "/studios/los-angeles.jpg",
  },
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
            style={{ margin: 0, maxWidth: "60ch" }}
          >
            A small, deliberately decentralised practice of strategists, designers and
            writers across Sydney and Los Angeles. Forty percent of our work is impact:
            climate, community and movement, mostly pro-bono or at-cost. The other
            sixty is the commercial work that funds it. Since we shifted to the impact
            model in 2019, over a million dollars invested in Australian impact work,
            and counting.
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
            The work that earns the right to last.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p className="body-lg" style={{ margin: 0 }}>
              Rennie Lab exists because the world doesn&apos;t need more brands shouting.
              It needs fewer brands doing better. We started in Melbourne in 2009 as
              6.2 Innovation Lab. We opened in Sydney in 2011. The shape of the work and
              the name on the door have changed since. The thesis hasn&apos;t.
            </p>
            <p className="body-lg" style={{ margin: 0 }}>
              We split our work forty/sixty. Forty percent is impact: climate, community
              and movement, mostly pro-bono or at-cost. Since the model shifted in 2019,
              that lane has put over a million dollars back into Australian climate,
              community and movement organisations. The other sixty percent is the
              commercial work that pays for it. Bolder brands, sharper instruments, the
              same standard.
            </p>
            <p className="body-lg" style={{ margin: 0 }}>
              The thread that runs through both is craft pointed at the right thing.
              Indigenous peoples on this continent have practised seven-generation thinking
              for sixty thousand years. We&apos;re trying to learn. We design for the long,
              slow, deliberate work. The kind that takes a few years to be visible and a
              lifetime to forget. The kind that gives the planet a seat at the table from
              the first sketch.
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
          A short history · 2009 → today
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 64 }}>
          <h2 className="h-1" style={{ margin: 0, alignSelf: "start" }}>
            Sixteen years of creativity &amp; impact.
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
              <div
                className="ph"
                data-tone={s.tone}
                style={{
                  aspectRatio: "4/3",
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05) 60%), url(${s.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
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

      {/* TEAM — partners + film-poster credit roll */}
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
              The partners
            </div>
            <h2 className="h-1" style={{ margin: 0, maxWidth: "12ch" }}>
              One team, two cities.
            </h2>
          </div>
          <p className="body-lg" style={{ margin: 0, maxWidth: "52ch" }}>
            We&apos;re small on purpose. Partner-led, generalist by training, specialist
            by instinct. Every project is run end to end by the people who scoped it.
            Two time zones, one set of standards.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {PARTNERS.map((p) => (
            <article key={p.name} className="card">
              <div
                className="ph"
                data-tone={p.tone}
                style={{
                  aspectRatio: "4/5",
                  ...(p.image
                    ? {
                        backgroundImage: `url(${p.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                        filter: "grayscale(1) contrast(1.05)",
                      }
                    : {}),
                }}
              >
                {!p.image && (
                  <span className="ph-tag">{p.loc}</span>
                )}
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
        </div>

        {/* Credit roll — the wider studio */}
        <div style={{ marginTop: 96, paddingTop: 48, borderTop: "1px solid var(--line)" }}>
          <div className="mono" style={{ marginBottom: 12 }}>
            The wider studio · {CREDITS.reduce((n, c) => n + c.names.length, 0)} collaborators
          </div>
          <h3
            className="h-2"
            style={{ margin: "0 0 56px", maxWidth: "22ch" }}
          >
            Designers, developers, directors, writers and producers — across nine countries.
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {CREDITS.map((c) => (
              <div
                key={c.role}
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: 32,
                  alignItems: "baseline",
                  borderTop: "1px solid var(--line)",
                  paddingTop: 24,
                }}
              >
                <div className="mono">{c.role}</div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 500,
                    fontSize: "clamp(20px, 1.8vw, 28px)",
                    lineHeight: 1.35,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {c.names.join("  ·  ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS / RECOGNITION */}
      <section style={{ padding: "96px 0", borderTop: "1px solid var(--line)" }}>
        <div className="mono" style={{ marginBottom: 32 }}>
          Partners &amp; collaborators · selected
        </div>
        <div style={{ marginBottom: 56 }}>
          <LogoStrip />
        </div>
        <div className="mono" style={{ marginBottom: 32 }}>
          Press, recognition &amp; talks · selected
        </div>
        <h2 className="h-2" style={{ margin: "0 0 56px", maxWidth: "22ch" }}>
          The work, occasionally, gets noticed.
        </h2>
        <div>
          {PRESS.map((p, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 240px",
                gap: 32,
                padding: "24px 0",
                borderTop: "1px solid var(--line)",
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 500,
                  fontSize: "clamp(20px, 1.8vw, 28px)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.3,
                }}
              >
                {p.line}
              </div>
              <div className="mono" style={{ textAlign: "right" }}>{p.tag}</div>
            </div>
          ))}
          <div style={{ height: 1, background: "var(--line)" }}></div>
        </div>
      </section>

    </div>
  );
}
