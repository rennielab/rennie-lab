"use client";

import { PROJECTS } from "@/data/projects";
import { IMPACT_CASE_STUDIES } from "@/data/impactProjects";
import { PROJECT_HERO } from "@/data/projectImages";

type Tile = {
  source: "project" | "impact";
  slug: string;
  eyebrow: string;
  tagline: string;
};

const TILES: Tile[] = [
  {
    source: "project",
    slug: "patagonia",
    eyebrow: "Climate · Funding Platform",
    tagline: "Making Generosity Visible",
  },
  {
    source: "project",
    slug: "marlee",
    eyebrow: "Community · Rebrand",
    tagline: "Renaming Mental Strength",
  },
  {
    source: "project",
    slug: "boody",
    eyebrow: "Climate · Conscious Brand",
    tagline: "A Brand for the Conscious",
  },
  {
    source: "project",
    slug: "packer",
    eyebrow: "Community · Brand Refresh",
    tagline: "Re-Positioning an Icon",
  },
];

function open(tile: Tile) {
  if (typeof window === "undefined") return;
  if (tile.source === "project") {
    const project = PROJECTS.find((p) => p.slug === tile.slug);
    if (project) {
      window.dispatchEvent(new CustomEvent("open-case", { detail: { project } }));
    }
  } else {
    const caseStudy = IMPACT_CASE_STUDIES.find((c) => c.slug === tile.slug);
    if (caseStudy) {
      window.dispatchEvent(new CustomEvent("open-impact-case", { detail: { caseStudy } }));
    }
  }
}

function imageFor(tile: Tile): string {
  if (tile.source === "project") {
    return PROJECT_HERO[tile.slug] ?? "";
  }
  const cs = IMPACT_CASE_STUDIES.find((c) => c.slug === tile.slug);
  return cs?.hero ?? "";
}

/* Return a CSS image-set so phones at 1x DPR fetch the small variant
   (~10–50 KB) and retina screens fetch the 1200px version. */
function backgroundFor(tile: Tile): string {
  const large = imageFor(tile);
  if (!large) return "";
  // Convention: file-name.ext → file-name-600.ext for 1x
  const small = large.replace(/(\.[^.]+)$/, "-600$1");
  return `image-set(url("${small}") 1x, url("${large}") 2x)`;
}

function nameFor(tile: Tile): string {
  if (tile.source === "project") {
    return PROJECTS.find((p) => p.slug === tile.slug)?.name ?? "";
  }
  return IMPACT_CASE_STUDIES.find((c) => c.slug === tile.slug)?.name ?? "";
}

export function HeroTiles() {
  return (
    <section className="hero-tiles" aria-label="Featured work">
      {TILES.map((tile, i) => (
        <article
          key={tile.slug}
          className="hero-tile"
          data-lead={i === 0}
          onClick={() => open(tile)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") open(tile);
          }}
        >
          <div
            className="hero-tile-img"
            style={{
              backgroundImage:
                backgroundFor(tile) || `url(${imageFor(tile)})`,
            }}
          />
          <div className="hero-tile-shade" aria-hidden="true" />
          <div className="hero-tile-content">
            <span className="mono hero-tile-eyebrow">{tile.eyebrow}</span>
            <h2 className="hero-tile-title">{nameFor(tile)}</h2>
            <p className="hero-tile-tagline">{tile.tagline}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
