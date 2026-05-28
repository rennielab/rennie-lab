"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ImpactTag, Project } from "@/data/types";
import type { ImpactCaseStudy, ImpactCategory } from "@/data/impactProjects";
import { PROJECT_HERO } from "@/data/projectImages";

const FILTERS: { id: ImpactTag | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Movement", label: "Movement" },
  { id: "Climate", label: "Climate" },
  { id: "Community", label: "Community" },
];

/* Deterministic aspect-ratio rhythm so the masonry packs with variety
   instead of a flat uniform grid. Portrait-leaning with the odd square
   and tall tile for cadence — same density feel as the reference. */
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

/* Per-tile initial drop distance — tiles start scattered at varied
   heights and settle into the grid as they reveal on scroll, so the
   wall "falls together" rather than fading in flat. */
const RISE = [120, 64, 168, 88, 200, 110, 56, 144, 96, 176];
function riseFor(i: number): number {
  return RISE[i % RISE.length];
}

function catToTag(c: ImpactCategory): ImpactTag {
  return c === "climate" ? "Climate" : c === "community" ? "Community" : "Movement";
}

function openProjectCase(project: Project, index: number) {
  window.dispatchEvent(
    new CustomEvent("open-case", { detail: { project, index } }),
  );
}

function openImpactCase(caseStudy: ImpactCaseStudy) {
  window.dispatchEvent(
    new CustomEvent("open-impact-case", { detail: { caseStudy } }),
  );
}

/* One unified work item — a studio project or an impact case study.
   Both render as identical tiles; only the click target differs. */
type WallItem =
  | { kind: "project"; key: string; project: Project; tags: ImpactTag[]; isNew: boolean }
  | { kind: "impact"; key: string; caseStudy: ImpactCaseStudy; tags: ImpactTag[] };

function WallTile({ item, index }: { item: WallItem; index: number }) {
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

  // Resolve display fields from whichever kind of work this is.
  let hero: string | undefined;
  let name: string;
  let sub: string | undefined;
  let tone: string;
  let caption: string;
  let overlayTags: string[];
  let isNew = false;
  let onOpen: () => void;
  let ariaLabel: string;

  if (item.kind === "project") {
    const p = item.project;
    hero = PROJECT_HERO[p.slug];
    name = p.name;
    sub = p.tagline;
    tone = p.tone || "ink";
    caption = (p.categories[0] ?? "design").toLowerCase();
    overlayTags = (p.impactTags?.length
      ? p.impactTags
      : [p.categories[0] ?? "Design"]
    ).slice(0, 2);
    isNew = item.isNew;
    onOpen = () => openProjectCase(p, index);
    ariaLabel = `Open case study — ${p.name}`;
  } else {
    const c = item.caseStudy;
    hero = c.hero;
    name = c.name;
    sub = undefined;
    tone = c.tone || "ink";
    caption = c.category;
    overlayTags = [c.category];
    onOpen = () => openImpactCase(c);
    ariaLabel = `Open case study — ${c.name}`;
  }

  return (
    <button
      ref={ref}
      type="button"
      className="proj-tile"
      data-shown={shown}
      data-tone={tone}
      style={
        {
          aspectRatio: aspectFor(index),
          transitionDelay: `${(index % 5) * 50}ms`,
          "--rise": `${riseFor(index)}px`,
        } as React.CSSProperties
      }
      onClick={onOpen}
      aria-label={ariaLabel}
    >
      {hero && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={hero}
          alt=""
          loading="lazy"
          decoding="async"
          width={1200}
          height={880}
          className="proj-tile-img"
        />
      )}

      {isNew && <span className="proj-tile-new">✷ New</span>}

      <div className="proj-tile-overlay">
        <div className="proj-tile-tags">
          {overlayTags.map((t) => (
            <span key={t} className="proj-tile-tag">
              {t}
            </span>
          ))}
        </div>
        <div className="proj-tile-title">
          <span className="proj-tile-name">{name}</span>
          {sub ? (
            <span className="proj-tile-sub"> → {sub}</span>
          ) : (
            <span className="proj-tile-arrow"> ↗</span>
          )}
        </div>
      </div>

      {/* Always-visible quiet caption (fades out on hover as overlay rises) */}
      <div className="proj-tile-caption">{caption}</div>
    </button>
  );
}

export function ProjectsList({
  projects,
  impact = [],
}: {
  projects: Project[];
  impact?: ImpactCaseStudy[];
}) {
  const [filter, setFilter] = useState<ImpactTag | "all">("all");

  // Merge studio projects and impact case studies into one wall, interleaved
  // round-robin so the two bodies of work mix instead of sitting in blocks.
  const items = useMemo<WallItem[]>(() => {
    const newSlugs = new Set(projects.slice(0, 3).map((p) => p.slug));
    const proj: WallItem[] = projects.map((p) => ({
      kind: "project",
      key: `p-${p.slug}`,
      project: p,
      tags: p.impactTags ?? [],
      isNew: newSlugs.has(p.slug),
    }));
    const imp: WallItem[] = impact.map((c) => ({
      kind: "impact",
      key: `i-${c.slug}`,
      caseStudy: c,
      tags: [catToTag(c.category)],
    }));
    const merged: WallItem[] = [];
    const max = Math.max(proj.length, imp.length);
    for (let i = 0; i < max; i++) {
      if (proj[i]) merged.push(proj[i]);
      if (imp[i]) merged.push(imp[i]);
    }
    return merged;
  }, [projects, impact]);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((it) => it.tags.includes(filter))),
    [items, filter],
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
          {filtered.length} / {items.length}
        </span>
      </div>

      {/* Masonry wall */}
      <div className="proj-masonry">
        {filtered.map((it, i) => (
          <WallTile key={it.key} item={it} index={i} />
        ))}
      </div>
    </section>
  );
}
