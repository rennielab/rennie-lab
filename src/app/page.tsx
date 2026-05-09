import Link from "next/link";
import { ContactButton } from "@/components/chrome/ContactButton";
import { LogoStrip } from "@/components/home/LogoStrip";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { FeedCard } from "@/components/home/FeedCard";
import { FEED_ITEMS } from "@/data/journalFeed";

export const metadata = {
  title: "Rennie Lab — A Creative Advisory Studio",
  description:
    "Rennie Lab is a creative advisory studio between Sydney and Los Angeles — clean creative for climate, community and movement.",
};

export default function HomePage() {
  const recent = FEED_ITEMS.slice(0, 3);

  return (
    <div className="container">
      {/* Hero */}
      <section style={{ padding: "24px 0 48px", position: "relative" }}>
        <div className="mono rise" style={{ marginBottom: 32 }}>
          <span
            className="dot dot-pulse"
            style={{ background: "var(--ink)", marginRight: 10 }}
          ></span>
          A creative advisory studio · Sydney + Los Angeles · est. 2017
        </div>
        <h1
          className="h-display rise delay-1"
          style={{ margin: 0, maxWidth: "14ch", fontFamily: "var(--sans)", fontWeight: 600 }}
        >
          Creative Work
          <br />
          for a <span style={{ color: "var(--accent)" }}>Liveable Planet</span>.
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 48,
            marginTop: 56,
            alignItems: "end",
          }}
        >
          <p className="body-lg rise delay-2" style={{ maxWidth: "44ch", margin: 0 }}>
            A small studio of strategists, designers and writers working out of Sydney
            and Los Angeles. We partner with bolder brands on climate, digital, and the
            work of moving people somewhere worth going.
          </p>
          <div
            className="rise delay-3"
            style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
          >
            <Link className="btn btn-primary" href="/projects">
              See the work <span className="arrow">→</span>
            </Link>
            <Link className="btn btn-ghost" href="/story">
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* Logo strip — single row, rotating */}
      <section style={{ padding: "24px 0 64px" }}>
        <LogoStrip />
      </section>

      {/* What we do — Driftime-style stacked sections */}
      <WhatWeDo />

      {/* Climate strip */}
      <section style={{ padding: "56px 0 80px", borderTop: "1px solid var(--line)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <div className="mono" style={{ marginBottom: 24 }}>Carbon · Always on</div>
            <h2 className="h-2" style={{ margin: 0, maxWidth: "18ch" }}>
              Every page carries its weight.
            </h2>
            <p className="body-lg" style={{ marginTop: 24, maxWidth: "44ch" }}>
              The little leaf in the corner is a live count of the CO₂e your visit has
              produced. Measured per scroll, per asset, per request. Most pages on this
              site come in under <span style={{ color: "var(--ink)" }}>0.4 grams</span>.
              The internet is a heavier place than people realise. We try not to add to
              it.
            </p>
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              padding: 32,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
            }}
          >
            {[
              { v: "0.21g", l: "per page load" },
              { v: "100%", l: "green-hosted" },
              { v: "94%", l: "cleaner than the average web page" },
              { v: "40%", l: "impact, 60% rad" },
            ].map((s, i) => (
              <div key={i}>
                <div className="serif" style={{ fontSize: 56, lineHeight: 1 }}>{s.v}</div>
                <div className="mono" style={{ marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closer */}
      <section style={{ padding: "64px 0 80px", borderTop: "1px solid var(--line)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <h2 className="h-1" style={{ margin: 0, maxWidth: "14ch" }}>
            Tell us what you&apos;re trying to move.
          </h2>
          <div>
            <p className="body-lg" style={{ margin: "0 0 24px", maxWidth: "44ch" }}>
              Climate work, brand work, the project that&apos;s been on the whiteboard
              for two years. Start anywhere.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <ContactButton>
                Open the brief <span className="arrow">→</span>
              </ContactButton>
              <button type="button" className="btn btn-ghost">
                Book a call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent feed teaser */}
      <section style={{ padding: "32px 0 80px", borderTop: "1px solid var(--line)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 32,
            marginTop: 32,
          }}
        >
          <h2 className="h-2" style={{ margin: 0 }}>
            Latest from Off Climate
          </h2>
          <Link className="btn btn-ghost" href="/journal">
            All entries →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 24 }}>
          {recent.slice(0, 3).map((it, i) => (
            <FeedCard item={it} key={it.id} large={i === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
