"use client";

import { useMemo, useState } from "react";
import type { ImpactCaseStudy, ImpactCategory } from "@/data/impactProjects";

const CATS: { id: ImpactCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "climate", label: "Climate" },
  { id: "community", label: "Community" },
  { id: "movement", label: "Movement" },
];

export function ImpactGrid({ caseStudies }: { caseStudies: ImpactCaseStudy[] }) {
  const [cat, setCat] = useState<ImpactCategory | "all">("all");

  const filtered = useMemo(
    () => (cat === "all" ? caseStudies : caseStudies.filter((c) => c.category === cat)),
    [caseStudies, cat],
  );

  const open = (caseStudy: ImpactCaseStudy) =>
    window.dispatchEvent(new CustomEvent("open-impact-case", { detail: { caseStudy } }));

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div className="mono">Active programs · {filtered.length}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              className="tag"
              data-active={cat === c.id}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {filtered.map((c) => (
          <article
            key={c.slug}
            className="card"
            onClick={() => open(c)}
            style={{ cursor: "pointer" }}
          >
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
              <span className="ph-tag">{c.category} · case study</span>
            </div>
            <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                className="mono"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{c.category}</span>
                <span>Read →</span>
              </div>
              <h3
                className="h-2"
                style={{ margin: 0, fontSize: "clamp(24px, 2.6vw, 36px)" }}
              >
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
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            padding: "96px 0",
            textAlign: "center",
            color: "var(--ink-3)",
            fontFamily: "var(--mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          No case studies in this category yet.
        </div>
      )}
    </>
  );
}
