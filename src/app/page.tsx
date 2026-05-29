import { LogoStrip } from "@/components/home/LogoStrip";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { HomeFeed } from "@/components/home/HomeFeed";

export const metadata = {
  title: "Rennie Lab — Work & Inspiration for a Liveable Planet",
  description:
    "Rennie is a creative design lab producing work and inspiration for a liveable planet. A live feed of projects, events and the studio's thinking.",
};

export default function HomePage() {
  return (
    <div className="container">
      {/* Headline — page lead, uppercase + bold, carrying the Rennie brand */}
      <section style={{ padding: "44px 0 48px", position: "relative" }}>
        <h1
          className="h-display rise"
          style={{
            margin: 0,
            maxWidth: "20ch",
            fontSize: "clamp(30px, 4.6vw, 64px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
          }}
        >
          Rennie is a creative design lab producing work and inspiration for a
          liveable planet.
        </h1>
      </section>

      {/* Rennie Lab, live — the timeline feed (work now, events + places next) */}
      <HomeFeed />

      {/* Clients — quiet trust strip */}
      <section style={{ padding: "72px 0 160px" }}>
        <LogoStrip />
      </section>

      {/* What we do — the five disciplines */}
      <WhatWeDo />
    </div>
  );
}
