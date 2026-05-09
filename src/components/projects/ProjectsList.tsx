"use client";

import { ContactButton } from "@/components/chrome/ContactButton";
import type { Project } from "@/data/types";
import { PROJECT_HERO } from "@/data/projectImages";

function summary(p: Project): string {
  return (
    p.sections.challenge ??
    p.sections.background ??
    p.sections.description ??
    p.sections.solution ??
    ""
  );
}

export function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <section style={{ padding: "0 0 96px" }}>
      {projects.map((p, i) => (
        <article
          key={p.slug}
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-case", { detail: { project: p, index: i } }),
            )
          }
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 56,
            padding: "48px 0",
            borderTop: "1px solid var(--line)",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <div>
            <div className="mono" style={{ marginBottom: 18 }}>
              {p.source === "reny-studio" ? "case study" : "project"} ·{" "}
              {(p.categories[0] ?? "design").toLowerCase()}
            </div>
            <h2
              className="h-1"
              style={{ margin: "0 0 24px", fontSize: "clamp(32px, 4.5vw, 64px)" }}
            >
              {p.tagline ?? p.name}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                padding: "20px 0",
                borderTop: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div>
                <div className="mono">Partner</div>
                <div className="serif" style={{ fontSize: 22, marginTop: 6 }}>
                  {p.client}
                </div>
              </div>
              <div>
                <div className="mono">Tags</div>
                {p.impactTags && p.impactTags.length > 0 ? (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {p.impactTags.map((t) => (
                      <span
                        key={t}
                        className="mono"
                        style={{
                          padding: "4px 10px",
                          border: "1px solid var(--line)",
                          borderRadius: 999,
                          fontSize: 11,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="serif" style={{ fontSize: 22, marginTop: 6 }}>
                    —
                  </div>
                )}
              </div>
            </div>
            <p
              className="body"
              style={{ marginTop: 24, maxWidth: "46ch" }}
            >
              {summary(p).slice(0, 320)}
              {summary(p).length > 320 ? "…" : ""}
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button type="button" className="btn btn-primary">
                Open case study <span className="arrow">→</span>
              </button>
              <span onClick={(e) => e.stopPropagation()}>
                <ContactButton className="btn btn-ghost">
                  Start a project <span className="arrow">→</span>
                </ContactButton>
              </span>
            </div>
          </div>
          <div
            className="ph"
            data-tone={p.tone || "ink"}
            style={{
              aspectRatio: "4/3",
              borderRadius: "var(--radius)",
              ...(PROJECT_HERO[p.slug]
                ? {
                    backgroundImage: `url(${PROJECT_HERO[p.slug]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}),
            }}
          >
            <span className="ph-tag">
              {String(i + 1).padStart(2, "0")} · {(p.categories[0] ?? "design").toLowerCase()}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}
