"use client";

import type { Service } from "@/data/types";
import type { Project } from "@/data/types";

const SERVICE_TONES: Record<string, { bg: string; ink: string; tone: string }> = {
  "impact-products": { bg: "#2c4a5e", ink: "#fffdec", tone: "ocean" },
  "strategic-futures": { bg: "#b45e3f", ink: "#fffdec", tone: "rust" },
  "creative-transformation": { bg: "#4f6a4a", ink: "#fffdec", tone: "moss" },
};

type Props = {
  services: Service[];
  projectsByPillar: Record<string, Project[]>;
};

export function StackedServices({ services, projectsByPillar }: Props) {
  const open = (project: Project, index: number) =>
    window.dispatchEvent(new CustomEvent("open-case", { detail: { project, index } }));

  return (
    <div className="stack-wrap bleed">
      {services.map((service) => {
        const palette = SERVICE_TONES[service.pillar] ?? SERVICE_TONES["impact-products"]!;
        const projects = (projectsByPillar[service.pillar] ?? []).slice(0, 4);

        return (
          <section
            key={service.id}
            className="stack-section"
            style={{ background: palette.bg, color: palette.ink }}
          >
            <div className="stack-bg-overlay" style={{ color: palette.bg }}></div>
            <div className="stack-head">
              <div>
                <h2 className="stack-title" style={{ color: palette.ink }}>
                  {service.name.toLowerCase()}
                </h2>
              </div>
              <div>
                <p className="stack-desc" style={{ color: palette.ink }}>
                  {service.shortDescription}
                </p>
                <div className="stack-meta">
                  <span className="stack-meta-label">Capabilities</span>
                  <span className="stack-meta-value">{service.capabilities.length}</span>
                </div>
              </div>
            </div>
            <div className="stack-foot">
              <div className="stack-cards">
                {projects.length > 0
                  ? projects.map((project, i) => (
                      <div
                        key={project.slug}
                        className="stack-card ph"
                        data-tone={project.tone || palette.tone}
                        onClick={() => open(project, i)}
                      >
                        <span className="stack-card-label">
                          {project.client}
                          <span className="stack-card-title">{project.name}</span>
                        </span>
                      </div>
                    ))
                  : Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="stack-card ph"
                        data-tone={palette.tone}
                      ></div>
                    ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
