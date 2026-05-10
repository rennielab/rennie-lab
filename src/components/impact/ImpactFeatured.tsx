"use client";

import type { ImpactCaseStudy } from "@/data/impactProjects";

export function ImpactFeatured({ caseStudy: c }: { caseStudy: ImpactCaseStudy }) {
  const open = () =>
    window.dispatchEvent(new CustomEvent("open-impact-case", { detail: { caseStudy: c } }));

  // Pull the most punchy outcome line from the impact text — first sentence
  const pullQuote = c.impact.split(/(?<=[.!?])\s+/)[0] ?? c.impact;

  return (
    <section className="impact-featured" onClick={open}>
      <div
        className="impact-featured-hero"
        data-tone={c.tone}
        style={
          c.hero
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.65) 100%), url(${c.hero})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="impact-featured-meta">
          <span className="mono">Featured · {c.category}</span>
          <span className="impact-featured-meta-sep" aria-hidden="true">·</span>
          <span className="mono">Long-read</span>
        </div>
        <div className="impact-featured-foot">
          <h2 className="impact-featured-title">{c.name}</h2>
          <p className="impact-featured-sub">{c.subtitle}</p>
        </div>
      </div>

      <div className="impact-featured-body">
        <div className="impact-featured-quote">
          <span className="impact-featured-quote-mark" aria-hidden="true">&ldquo;</span>
          <p>{pullQuote}</p>
        </div>
        <div className="impact-featured-cta">
          <span className="mono">Read the full case study</span>
          <span className="impact-featured-arrow" aria-hidden="true">→</span>
        </div>
      </div>
    </section>
  );
}
