import { PROJECTS } from "@/data/projects";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { ContactButton } from "@/components/chrome/ContactButton";

export const metadata = {
  title: "Projects — Rennie Lab",
  description:
    "Selected case studies from Rennie Lab and Reny Studio — brand, UX, climate, and impact projects across Sydney, LA, SLC and beyond.",
};

export default function ProjectsPage() {
  const published = PROJECTS.filter((p) => p.status === "published");
  const upcoming = PROJECTS.filter((p) => p.status === "placeholder");

  return (
    <div className="container">
      <section style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="mono" style={{ marginBottom: 32 }}>03 — Projects</div>
        <h1 className="h-display rise" style={{ maxWidth: "12ch" }}>
          Impact projects.
        </h1>
        <p className="body-lg rise delay-1" style={{ maxWidth: "60ch", marginTop: 48 }}>
          A selection of {published.length} published case studies plus {upcoming.length} upcoming
          projects in production. Click any row to read the full study, or start a new
          brief alongside us.
        </p>
      </section>

      <ProjectsList projects={published} />

      {upcoming.length > 0 && (
        <section style={{ paddingTop: 96, paddingBottom: 32 }}>
          <div className="mono" style={{ marginBottom: 32 }}>In production</div>
          <h2 className="h-2" style={{ margin: 0, maxWidth: "16ch" }}>
            Newer Rennie Lab work — case studies coming soon.
          </h2>
          <div
            style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {upcoming.map((p) => (
              <div key={p.slug}>
                <div
                  className="ph"
                  data-tone={p.tone || "ink"}
                  style={{ aspectRatio: "4/3", borderRadius: "var(--radius)" }}
                />
                <div className="mono" style={{ marginTop: 12 }}>{p.client}</div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 600,
                    fontSize: 18,
                    marginTop: 4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
          Want to be the next case study?
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
