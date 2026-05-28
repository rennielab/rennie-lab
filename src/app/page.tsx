import Link from "next/link";
import { LogoStrip } from "@/components/home/LogoStrip";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { HeroTiles } from "@/components/home/HeroTiles";

export const metadata = {
  title: "Rennie Lab — A Creative Advisory Studio",
  description:
    "Rennie Lab is a creative advisory studio between Sydney and Los Angeles — clean creative for climate, community and movement.",
};

export default function HomePage() {
  return (
    <div className="container">
      {/* Eyebrow */}
      <section style={{ padding: "32px 0 0", position: "relative" }}>
        <div className="mono rise">
          <span
            className="dot dot-pulse"
            style={{ background: "var(--ink)", marginRight: 10 }}
          ></span>
          A creative advisory studio · Sydney + Los Angeles · est. 2017
        </div>
      </section>

      {/* Headline — page lead, above the work */}
      <section style={{ padding: "40px 0 56px", position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          <h1 className="h-display rise" style={{ margin: 0, maxWidth: "14ch" }}>
            Creative Work
            <br />
            for a Liveable Planet.
          </h1>
          <div
            className="rise delay-1"
            style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "0.4em" }}
          >
            <Link className="btn btn-primary" href="/projects">
              See the work <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured work — image-led fold */}
      <HeroTiles />

      {/* Clients — quiet trust strip, sitting directly on the work */}
      <section style={{ padding: "64px 0 160px" }}>
        <LogoStrip />
      </section>

      {/* What we do — the five disciplines */}
      <WhatWeDo />
    </div>
  );
}
