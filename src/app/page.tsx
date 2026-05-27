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

      {/* Featured work — image-led fold */}
      <HeroTiles />

      {/* Headline + body + one CTA */}
      <section style={{ padding: "32px 0 160px", position: "relative" }}>
        <h1
          className="h-display rise"
          style={{ margin: 0, maxWidth: "14ch" }}
        >
          Creative Work
          <br />
          for a Liveable Planet.
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 64,
            marginTop: 72,
            alignItems: "end",
          }}
        >
          <p className="body-lg rise delay-1" style={{ maxWidth: "44ch", margin: 0 }}>
            A small studio of strategists, designers and writers working out of Sydney
            and Los Angeles. We partner with bolder brands on climate, digital, and the
            work of moving people somewhere worth going.
          </p>
          <div
            className="rise delay-2"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Link className="btn btn-primary" href="/projects">
              See the work <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Clients — quiet trust strip */}
      <section style={{ padding: "0 0 160px" }}>
        <LogoStrip />
      </section>

      {/* What we do — the five disciplines */}
      <WhatWeDo />
    </div>
  );
}
