"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import type { Project } from "@/data/types";
import { PROJECT_HERO } from "@/data/projectImages";

type OpenCaseEvent = CustomEvent<{ project: Project; index?: number }>;

export function CaseStudyDrawer() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as OpenCaseEvent).detail;
      setProject(detail.project);
      setIndex(detail.index ?? 0);
      setOpen(true);
    };
    window.addEventListener("open-case", onOpen);
    return () => window.removeEventListener("open-case", onOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!project) {
    return (
      <>
        <div className="contact-shade" data-open={false}></div>
        <aside className="contact-panel" data-open={false} data-theme={theme}></aside>
      </>
    );
  }

  const sectionEntries = Object.entries(project.sections).filter(
    ([, v]) => typeof v === "string" && v.length > 0,
  ) as [string, string][];

  return (
    <>
      <div className="contact-shade" data-open={open} onClick={() => setOpen(false)}></div>
      <aside className="contact-panel" data-open={open} data-theme={theme}>
        <button
          type="button"
          className="drawer-close"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          ✕
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 32px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="dot dot-pulse" style={{ background: "var(--ink)" }}></span>
            <span className="mono">
              {project.source === "reny-studio" ? "Case study" : "Project"} ·{" "}
              {project.categories[0] ?? ""}
            </span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span className="mono">
              {String(index + 1).padStart(2, "0")} · {project.client}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mono"
              style={{
                padding: "8px 14px",
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: 3,
              }}
            >
              Close ✕
            </button>
          </div>
        </div>
        <div style={{ padding: "48px clamp(24px, 6vw, 80px) 96px", flex: 1, overflowY: "auto" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="mono" style={{ marginBottom: 16 }}>
              {project.client}
              {project.year ? ` · ${project.year}` : ""}
            </div>
            <h1 className="h-1" style={{ margin: 0, maxWidth: "18ch" }}>
              {project.name}
            </h1>
            <div
              className="ph"
              data-tone={project.tone || "ink"}
              style={{
                aspectRatio: "16/9",
                marginTop: 48,
                borderRadius: "var(--radius)",
                ...(PROJECT_HERO[project.slug]
                  ? {
                      backgroundImage: `url(${PROJECT_HERO[project.slug]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : {}),
              }}
            >
              <span className="ph-tag">Hero · {project.categories[0] ?? "Case Study"}</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 24,
                padding: "40px 0",
                margin: "48px 0",
                borderTop: "1px solid rgba(0,0,0,0.12)",
                borderBottom: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              <div>
                <div className="mono">Partner</div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 500,
                    fontSize: 22,
                    marginTop: 6,
                  }}
                >
                  {project.client}
                </div>
              </div>
              <div>
                <div className="mono">Discipline</div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 500,
                    fontSize: 22,
                    marginTop: 6,
                  }}
                >
                  {project.categories.join(" · ") || "Strategy"}
                </div>
              </div>
            </div>
            {sectionEntries.map(([key, body], i) => (
              <div
                key={key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 64,
                  padding: "48px 0",
                  borderTop: i ? "1px solid rgba(0,0,0,0.08)" : "0",
                }}
              >
                <div>
                  <div className="mono" style={{ marginBottom: 8 }}>
                    0{i + 1}
                  </div>
                  <h3 className="h-3" style={{ margin: 0, textTransform: "capitalize" }}>
                    {key}
                  </h3>
                </div>
                <p className="body-lg" style={{ margin: 0, maxWidth: "62ch" }}>
                  {body}
                </p>
              </div>
            ))}
            {project.services.length > 0 && (
              <div
                style={{
                  marginTop: 48,
                  paddingTop: 32,
                  borderTop: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                <div className="mono" style={{ marginBottom: 16 }}>Services</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {project.services.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div
              style={{
                marginTop: 96,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "32px 0",
                borderTop: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              <div>
                <div className="mono">Want to start something?</div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 700,
                    fontSize: 28,
                    marginTop: 8,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Open a brief →
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("open-contact"));
                }}
              >
                Talk to the studio <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
