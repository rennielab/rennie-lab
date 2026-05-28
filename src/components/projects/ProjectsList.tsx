"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ImpactTag, Project } from "@/data/types";
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
function aspectFor(slug: string, i: number): string {
  return ASPECTS[i % ASPECTS.length];
}

function openCase(project: Project, index: number) {
  window.dispatchEvent(
    new CustomEvent("open-case", { detail: { project, index } }),
  );
}

function ProjectTile({
  project,
  index,
  isNew,
}: {
  project: Project;
  index: number;
  isNew: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(false);
  const hero = PROJECT_HERO[project.slug];

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

  const cat = (project.categories[0] ?? "design").toLowerCase();

  return (
    <button
      ref={ref}
      type="button"
      className="proj-tile"
      data-shown={shown}
      data-tone={project.tone || "ink"}
      style={{
        aspectRatio: aspectFor(project.slug, index),
        transitionDelay: `${(index % 5) * 60}ms`,
      }}
      onClick={() => openCase(project, index)}
      aria-label={`Open case study — ${project.name}`}
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
          {(project.impactTags?.length
            ? project.impactTags
            : [project.categories[0] ?? "Design"]
          )
            .slice(0, 2)
            .map((t) => (
              <span key={t} className="proj-tile-tag">
                {t}
              </span>
            ))}
        </div>
        <div className="proj-tile-title">
          {project.name}
          <span className="proj-tile-arrow"> ↗</span>
        </div>
      </div>

      {/* Always-visible quiet caption (fades out on hover as overlay rises) */}
      <div className="proj-tile-caption">{cat}</div>
    </button>
  );
}

export function ProjectsList({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ImpactTag | "all">("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.impactTags?.includes(filter)),
    [projects, filter],
  );

  // First three published projects carry the "New" badge.
  const newSlugs = useMemo(
    () => new Set(projects.slice(0, 3).map((p) => p.slug)),
    [projects],
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
          {filtered.length} / {projects.length}
        </span>
      </div>

      {/* Masonry wall */}
      <div className="proj-masonry">
        {filtered.map((p, i) => (
          <ProjectTile
            key={p.slug}
            project={p}
            index={i}
            isNew={newSlugs.has(p.slug)}
          />
        ))}
      </div>
    </section>
  );
}
