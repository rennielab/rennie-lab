import Link from "next/link";
import { ContactButton } from "@/components/chrome/ContactButton";
import { LogoStrip } from "@/components/home/LogoStrip";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { FeedCard } from "@/components/home/FeedCard";
import { FEED } from "@/data/feed";

export const metadata = {
  title: "Rennie Lab — A Creative Advisory Studio",
  description:
    "Rennie Lab is a creative advisory studio between Sydney and Los Angeles — clean creative for climate, community and movement.",
};

export default function HomePage() {
  const recent = FEED.slice(0, 4);

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
          Clean creative
          <br />
          for the things that <em style={{ color: "var(--accent)" }}>actually matter</em>.
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
          <p className="body-lg rise delay-2" style={{ maxWidth: "36ch", margin: 0 }}>
            We&apos;re a decentralised studio of strategists, designers and writers — quietly
            partnering with the world&apos;s bolder brands on climate design, user experience
            and the work of moving people.
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

      {/* Recent feed teaser */}
      <section style={{ padding: "32px 0 80px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 32,
          }}
        >
          <h2 className="h-2" style={{ margin: 0 }}>
            Latest from the <em>Journal</em>
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
              Every page carries its <em>weight.</em>
            </h2>
            <p className="body-lg" style={{ marginTop: 24, maxWidth: "42ch" }}>
              The little leaf in the corner is a real-time estimate of the CO₂e your visit
              to this site has produced — measured per scroll, per asset, per request. Most
              pages here come in under <span style={{ color: "var(--ink)" }}>0.4g</span>.
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
              { v: "0.21g", l: "avg CO₂e per page" },
              { v: "94%", l: "cleaner than typical web" },
              { v: "100%", l: "green-grid hosting" },
              { v: "1%", l: "of revenue · planet" },
            ].map((s, i) => (
              <div key={i}>
                <div className="serif" style={{ fontSize: 56, lineHeight: 1 }}>{s.v}</div>
                <div className="mono" style={{ marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ padding: "0 0 64px", display: "flex", gap: 16, flexWrap: "wrap" }}
      >
        <ContactButton>
          Open the brief <span className="arrow">→</span>
        </ContactButton>
      </section>
    </div>
  );
}
