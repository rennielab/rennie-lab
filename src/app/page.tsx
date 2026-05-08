import Link from "next/link";
import { ContactButton } from "@/components/chrome/ContactButton";
import { LogoStrip } from "@/components/home/LogoStrip";
import { StackedServices } from "@/components/home/StackedServices";
import { SERVICES } from "@/data/services";
import { PROJECTS } from "@/data/projects";
import { JOURNAL_POSTS } from "@/data/journal";

export const metadata = {
  title: "Rennie Lab — A Creative Advisory Studio",
  description:
    "Rennie Lab is a creative advisory studio between Sydney, Salt Lake City and Los Angeles — clean creative for climate, community and movement.",
};

const PROJECTS_BY_PILLAR: Record<string, typeof PROJECTS> = {
  "impact-products": PROJECTS.filter((p) =>
    p.categories.some((c) =>
      ["Digital Products", "Products", "UX", "Websites", "Interactive"].includes(c),
    ),
  ).slice(0, 4),
  "strategic-futures": PROJECTS.filter((p) =>
    p.categories.some((c) => ["Branding Studio", "Business Design", "Expansion"].includes(c)),
  ).slice(0, 4),
  "creative-transformation": PROJECTS.filter((p) =>
    p.categories.some((c) =>
      ["Content", "Places (Wayfinding)", "Branding Studio"].includes(c),
    ),
  )
    .slice(2, 6),
};

export default function HomePage() {
  const recentJournal = JOURNAL_POSTS.slice(0, 4);

  return (
    <>
      <div className="container">
        <section style={{ paddingTop: 64, paddingBottom: 96 }}>
          <div className="mono" style={{ marginBottom: 32 }}>
            00 — Rennie Lab · SYD + SLC + LA · Since 2009
          </div>
          <h1 className="h-display rise" style={{ maxWidth: "14ch" }}>
            Clean creative
            <br />
            for climate, community
            <br />
            and movement.
          </h1>
          <p className="body-lg rise delay-1" style={{ maxWidth: "62ch", marginTop: 48 }}>
            A fiercely independent creative advisory partnering with humans and companies
            in search of something better — from strategy to execution, building products,
            brands and services that design the future.
          </p>
          <div
            className="rise delay-2"
            style={{ marginTop: 56, display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <ContactButton>
              Start a brief <span className="arrow">→</span>
            </ContactButton>
            <Link className="btn btn-ghost" href="/services">
              See our services
            </Link>
          </div>
        </section>

        <section style={{ paddingTop: 32, paddingBottom: 80 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span className="mono">Some of the brands we&apos;ve helped design the future for</span>
            <span className="mono">
              Patagonia · NBA · Nike · Heart Foundation · Snow Australia · 1% For The Planet
            </span>
          </div>
          <LogoStrip />
        </section>
      </div>

      <StackedServices services={SERVICES} projectsByPillar={PROJECTS_BY_PILLAR} />

      <div className="container">
        <section style={{ paddingTop: 96, paddingBottom: 64 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 32,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h2 className="h-2" style={{ margin: 0, maxWidth: "16ch" }}>
              From the journal.
            </h2>
            <Link href="/journal" className="mono">
              All journal entries →
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
            }}
          >
            {recentJournal.map((post) => (
              <Link
                href="/journal"
                key={post.slug}
                className="card"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  className="ph"
                  data-tone={post.tone || "ink"}
                  style={{ aspectRatio: "4/3" }}
                >
                  <span className="ph-tag">{post.type}</span>
                </div>
                <div
                  style={{
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    flex: 1,
                  }}
                >
                  <div className="mono">
                    {post.source === "substack" ? "Substack" : "97%"} ·{" "}
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--sans)",
                      fontWeight: 600,
                      fontSize: 17,
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {post.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: "80px 0",
            borderTop: "1px solid var(--line)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "end",
          }}
        >
          <div>
            <div className="mono" style={{ marginBottom: 16 }}>Low-carbon by design</div>
            <h2 className="h-2" style={{ margin: 0, maxWidth: "18ch" }}>
              Built to the lightest spec we could ship — and we measure it as you scroll.
            </h2>
          </div>
          <p className="body-lg" style={{ margin: 0, maxWidth: "52ch" }}>
            Static-rendered HTML, self-hosted fonts, lazy-loaded images, and a live carbon
            tracker bottom-left — wired to actual page bytes rather than a vanity badge.
          </p>
        </section>
      </div>
    </>
  );
}
