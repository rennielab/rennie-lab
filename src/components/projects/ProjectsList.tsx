"use client";

import type { Project } from "@/data/types";

export function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map((project, i) => {
        const reverse = i % 2 === 1;
        const summary =
          project.sections.challenge ??
          project.sections.background ??
          project.sections.description ??
          project.sections.solution ??
          "";

        return (
          <article
            key={project.slug}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("open-case", { detail: { project, index: i } }),
              )
            }
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              padding: "80px 0",
              borderTop: "1px solid var(--line)",
              cursor: "pointer",
              alignItems: "center",
            }}
          >
            <div style={{ order: reverse ? 2 : 1 }}>
              <div className="mono" style={{ marginBottom: 16 }}>
                {String(i + 1).padStart(2, "0")} · {project.client}
                {project.year ? ` · ${project.year}` : ""}
              </div>
              <h2 className="h-2" style={{ margin: 0 }}>
                {project.name}
              </h2>
              <p className="body-lg" style={{ marginTop: 24, maxWidth: "52ch" }}>
                {summary.slice(0, 280)}
                {summary.length > 280 ? "…" : ""}
              </p>
              <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {project.categories.slice(0, 4).map((c) => (
                  <span key={c} className="tag">
                    {c}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 32, display: "flex", gap: 24, alignItems: "center" }}>
                <span className="mono">Read case study →</span>
                <span
                  className="mono"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent("open-contact"));
                  }}
                  style={{ cursor: "pointer", color: "var(--accent)" }}
                >
                  Start a project →
                </span>
              </div>
            </div>
            <div style={{ order: reverse ? 1 : 2 }}>
              <div
                className="ph"
                data-tone={project.tone || "ink"}
                style={{ aspectRatio: "4/3", borderRadius: "var(--radius)" }}
              >
                <span className="ph-tag">
                  {project.categories.slice(0, 2).join(" · ") || "Case Study"}
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
