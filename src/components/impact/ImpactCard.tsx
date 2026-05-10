"use client";

import type { ImpactCaseStudy } from "@/data/impactProjects";

export function ImpactCard({ caseStudy: c }: { caseStudy: ImpactCaseStudy }) {
  const open = () =>
    window.dispatchEvent(new CustomEvent("open-impact-case", { detail: { caseStudy: c } }));

  return (
    <article className="card" onClick={open} style={{ cursor: "pointer" }}>
      <div
        className="ph"
        data-tone={c.tone}
        style={{
          aspectRatio: "16/10",
          ...(c.hero
            ? {
                backgroundImage: `url(${c.hero})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}),
        }}
      >
        <span className="ph-tag">
          {c.category} · case study
        </span>
      </div>
      <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="mono" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{c.category}</span>
          <span>Read →</span>
        </div>
        <h3 className="h-2" style={{ margin: 0, fontSize: "clamp(24px, 2.6vw, 36px)" }}>
          {c.name}
        </h3>
        <p
          className="body"
          style={{
            margin: 0,
            maxWidth: "44ch",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {c.subtitle}
        </p>
      </div>
    </article>
  );
}
