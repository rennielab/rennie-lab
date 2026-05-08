import { IMPACT_PILLARS } from "@/data/impact";
import { PROJECTS } from "@/data/projects";
import { ContactButton } from "@/components/chrome/ContactButton";

export const metadata = {
  title: "Impact — Rennie Lab",
  description:
    "Rennie Lab works across five impact pillars: Oceans, Health, Community, Mountains, and Climate. Pro-bono and partnership work for the issues that matter.",
};

export default function ImpactPage() {
  return (
    <div className="container">
      <section style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div className="mono" style={{ marginBottom: 32 }}>04 — Impact</div>
        <h1 className="h-display rise" style={{ maxWidth: "12ch" }}>
          Design as a pro-social discipline.
        </h1>
        <p className="body-lg rise delay-1" style={{ maxWidth: "60ch", marginTop: 48 }}>
          Five pillars where the work earns its keep — Oceans, Health, Community,
          Mountains, and Climate. Some of it is pro-bono, some of it is paid, all of it is
          chosen.
        </p>
      </section>

      {IMPACT_PILLARS.map((pillar, i) => {
        const linked = PROJECTS.filter((p) => pillar.exampleProjectSlugs.includes(p.slug));
        return (
          <section
            key={pillar.slug}
            style={{
              padding: "80px 0",
              borderTop: "1px solid var(--line)",
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr",
              gap: 64,
            }}
          >
            <div>
              <div className="mono" style={{ marginBottom: 16 }}>0{i + 1}</div>
              <h2 className="h-1" style={{ margin: 0 }}>{pillar.title}</h2>
            </div>
            <div>
              <p className="body-lg" style={{ margin: 0, maxWidth: "62ch" }}>{pillar.body}</p>
              {linked.length > 0 && (
                <div
                  style={{
                    marginTop: 40,
                    display: "grid",
                    gridTemplateColumns: `repeat(${Math.min(linked.length, 3)}, 1fr)`,
                    gap: 16,
                  }}
                >
                  {linked.slice(0, 3).map((project) => (
                    <div key={project.slug}>
                      <div
                        className="ph"
                        data-tone={project.tone || pillar.tone}
                        style={{ aspectRatio: "4/3", borderRadius: "var(--radius)" }}
                      />
                      <div className="mono" style={{ marginTop: 12 }}>{project.client}</div>
                      <div
                        style={{
                          fontFamily: "var(--sans)",
                          fontWeight: 600,
                          fontSize: 18,
                          marginTop: 4,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {project.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      <section
        style={{
          padding: "96px 0 0",
          borderTop: "1px solid var(--line)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "end",
        }}
      >
        <h2 className="h-1" style={{ margin: 0, maxWidth: "16ch" }}>
          Have a brief that needs to <em>matter?</em>
        </h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <ContactButton>
            Open the brief <span className="arrow">→</span>
          </ContactButton>
        </div>
      </section>
    </div>
  );
}
