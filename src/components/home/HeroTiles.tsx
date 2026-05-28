"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { IMPACT_CASE_STUDIES } from "@/data/impactProjects";
import { PROJECT_HERO } from "@/data/projectImages";

type Tile = {
  source: "project" | "impact";
  slug: string;
  eyebrow: string;
  tagline: string;
  tags: string[];
};

const TILES: Tile[] = [
  {
    source: "project",
    slug: "patagonia",
    eyebrow: "Climate · Funding Platform",
    tagline: "Making Generosity Visible",
    tags: ["Climate", "Advisory"],
  },
  {
    source: "project",
    slug: "marlee",
    eyebrow: "Community · Rebrand",
    tagline: "Renaming Mental Strength",
    tags: ["Community", "Brand"],
  },
  {
    source: "project",
    slug: "nswis",
    eyebrow: "Environments · Training Centre",
    tagline: "Designing for Olympic Performance",
    tags: ["Environments", "Movement"],
  },
  {
    source: "project",
    slug: "boody",
    eyebrow: "Climate · Conscious Brand",
    tagline: "A Brand for the Conscious",
    tags: ["Climate", "Products"],
  },
  {
    source: "project",
    slug: "packer",
    eyebrow: "Community · Brand Refresh",
    tagline: "Re-Positioning an Icon",
    tags: ["Community", "Brand"],
  },
];

function imageFor(tile: Tile): string {
  if (tile.source === "project") {
    return PROJECT_HERO[tile.slug] ?? "";
  }
  const cs = IMPACT_CASE_STUDIES.find((c) => c.slug === tile.slug);
  return cs?.hero ?? "";
}

/* image-set so phones at 1x DPR fetch the small variant, retina the 1200px. */
function backgroundFor(tile: Tile): string {
  const large = imageFor(tile);
  if (!large) return "";
  const small = large.replace(/(\.[^.]+)$/, "-600$1");
  return `image-set(url("${small}") 1x, url("${large}") 2x)`;
}

function nameFor(tile: Tile): string {
  if (tile.source === "project") {
    return PROJECTS.find((p) => p.slug === tile.slug)?.name ?? "";
  }
  return IMPACT_CASE_STUDIES.find((c) => c.slug === tile.slug)?.name ?? "";
}

/* Per-tile parallax depth — alternating so adjacent tiles drift at
   different rates, giving the landing fold a layered perspective. */
const DEPTH = [0.10, -0.06, 0.14, -0.05, 0.09];

export function HeroTiles() {
  const router = useRouter();
  const go = () => router.push("/projects");
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll parallax — drift each tile's image within its frame as the
  // hero moves through the viewport. rAF-throttled, single listener,
  // disabled under prefers-reduced-motion / low-carbon mode.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.getAttribute("data-reduce-motion") === "true" ||
      document.documentElement.getAttribute("data-low-carbon") === "true";
    if (reduceMotion) return;

    const imgs = Array.from(
      section.querySelectorAll<HTMLElement>(".hero-tile-img"),
    );
    let raf = 0;

    const update = () => {
      const vh = window.innerHeight;
      for (let i = 0; i < imgs.length; i++) {
        const tile = imgs[i].parentElement;
        if (!tile) continue;
        const rect = tile.getBoundingClientRect();
        // progress: -1 (tile below viewport) → 1 (above). 0 at centre.
        const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        const depth = DEPTH[i % DEPTH.length];
        imgs[i].style.transform = `translate3d(0, ${(progress * depth * rect.height).toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-tiles" aria-label="Featured work">
      {TILES.map((tile, i) => (
        <article
          key={tile.slug}
          className="hero-tile"
          data-lead={i === 0}
          onClick={go}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") go();
          }}
        >
          <div
            className="hero-tile-img"
            style={{
              backgroundImage: backgroundFor(tile) || `url(${imageFor(tile)})`,
            }}
          />
          <div className="hero-tile-shade" aria-hidden="true" />

          {/* Quiet caption at rest (matches projects wall) */}
          <div className="hero-tile-caption">{tile.eyebrow.split("·")[0].trim()}</div>

          {/* Hover overlay — tags + name → tagline (matches projects wall) */}
          <div className="hero-tile-overlay">
            <div className="hero-tile-tags">
              {tile.tags.slice(0, 2).map((t) => (
                <span key={t} className="hero-tile-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="hero-tile-title">
              <span className="hero-tile-name">{nameFor(tile)}</span>
              <span className="hero-tile-sub"> → {tile.tagline}</span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
