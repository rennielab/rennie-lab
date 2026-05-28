"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ImpactCaseStudy, ImpactCategory } from "@/data/impactProjects";

const FILTERS: { id: ImpactCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "climate", label: "Climate" },
  { id: "community", label: "Community" },
  { id: "movement", label: "Movement" },
];

/* Same aspect-ratio rhythm as the Projects wall so the two pages read as
   one system — portrait-leaning with the odd square and tall tile. */
const ASPECTS = [
  "3 / 4",
  "4 / 5",
  "9 / 16",
  "3 / 4",
  "1 / 1",
  "4 / 5",
  "3 / 4",
  "9 / 16",
  "4 / 5",
  "3 / 4",
];
function aspectFor(i: number): string {
  return ASPECTS[i % ASPECTS.length];
}

/* Per-tile initial drop distance — tiles start scattered and settle into
   the grid as they reveal on scroll, so the wall "falls together". */
const RISE = [120, 64, 168, 88, 200, 110, 56, 144, 96, 176];
function riseFor(i: number): number {
  return RISE[i % RISE.length];
}

function openCase(caseStudy: ImpactCaseStudy) {
  window.dispatchEvent(
    new CustomEvent("open-impact-case", { detail: { caseStudy } }),
  );
}

function ImpactTile({
  caseStudy: c,
  index,
}: {
  caseStudy: ImpactCaseStudy;
  index: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className="proj-tile"
      data-shown={shown}
      data-tone={c.tone || "ink"}
      style={
        {
          aspectRatio: aspectFor(index),
          transitionDelay: `${(index % 5) * 50}ms`,
          "--rise": `${riseFor(index)}px`,
        } as React.CSSProperties
      }
      onClick={() => openCase(c)}
      aria-label={`Open case study — ${c.name}`}
    >
      {c.hero && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={c.hero}
          alt=""
          loading="lazy"
          decoding="async"
          width={1200}
          height={880}
          className="proj-tile-img"
        />
      )}

      <div className="proj-tile-overlay">
        <div className="proj-tile-tags">
          <span className="proj-tile-tag">{c.category}</span>
        </div>
        <div className="proj-tile-title">
          <span className="proj-tile-name">{c.name}</span>
          <span className="proj-tile-arrow"> ↗</span>
        </div>
      </div>

      {/* Always-visible quiet caption (fades out on hover as overlay rises) */}
      <div className="proj-tile-caption">{c.category}</div>
    </button>
  );
}

export function ImpactWall({ caseStudies }: { caseStudies: ImpactCaseStudy[] }) {
  const [filter, setFilter] = useState<ImpactCategory | "all">("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? caseStudies
        : caseStudies.filter((c) => c.category === filter),
    [caseStudies, filter],
  );

  return (
    <section style={{ padding: "0 0 96px" }}>
      {/* Quiet filter row */}
      <div className="proj-filter">
        <div className="proj-filter-chips">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="proj-filter-chip"
              data-active={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="mono" style={{ color: "var(--ink-3)" }}>
          {filtered.length} / {caseStudies.length}
        </span>
      </div>

      {/* Masonry wall */}
      <div className="proj-masonry">
        {filtered.map((c, i) => (
          <ImpactTile key={c.slug} caseStudy={c} index={i} />
        ))}
      </div>
    </section>
  );
}
