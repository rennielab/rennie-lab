"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { IMPACT_CASE_STUDIES } from "@/data/impactProjects";
import { PROJECT_HERO } from "@/data/projectImages";
import type { Project } from "@/data/types";

/* ── Rennie Lab, live ──────────────────────────────────────────────
   A this.design-style timeline feed: a staggered masonry of tall
   portrait tiles, each labelled with small glass pills (type · category
   · new). Today it streams the studio's work; Events and Places drop in
   as their own FeedItems once the 1080×1920 artwork lands.            */

type FeedType = "Project" | "Event" | "Places";

type FeedItem = {
  key: string;
  hero: string;
  name: string;
  type: FeedType;
  category: string;
  isNew: boolean;
};

// Tall-leaning aspect rhythm — portrait first, with the odd square so the
// masonry packs with cadence rather than a flat grid. Switches to a single
// 1080×1920 (9:16) ratio once the Instagram-spec artwork arrives.
const ASPECTS = [
  "3 / 4",
  "4 / 5",
  "9 / 16",
  "3 / 4",
  "9 / 16",
  "4 / 5",
  "3 / 4",
  "1 / 1",
  "4 / 5",
  "9 / 16",
];
function aspectFor(i: number): string {
  return ASPECTS[i % ASPECTS.length];
}

// Per-tile drop distance so the wall "falls together" as it reveals.
const RISE = [120, 64, 168, 88, 200, 110, 56, 144, 96, 176];
function riseFor(i: number): number {
  return RISE[i % RISE.length];
}

function categoryForProject(p: Project): string {
  return p.impactTags?.[0] ?? p.categories?.[0] ?? "Design";
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function FeedTile({ item, index }: { item: FeedItem; index: number }) {
  const router = useRouter();
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
      className="feed-tile"
      data-shown={shown}
      style={
        {
          aspectRatio: aspectFor(index),
          "--rise": `${riseFor(index)}px`,
          transitionDelay: `${(index % 6) * 45}ms`,
        } as React.CSSProperties
      }
      onClick={() => router.push("/projects")}
      aria-label={`${item.name} — see the work`}
    >
      {item.hero && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={item.hero}
          alt=""
          loading="lazy"
          decoding="async"
          width={1080}
          height={1920}
          className="feed-tile-img"
        />
      )}

      {/* Glass pills — top-left. Type shows only for Events/Places so the
          feed isn't 18× "PROJECT"; category + new always read. */}
      <div className="feed-pills">
        {item.type !== "Project" && (
          <span className="feed-pill feed-pill-type">{item.type}</span>
        )}
        <span className="feed-pill">{item.category}</span>
        {item.isNew && <span className="feed-pill feed-pill-new">✷ New</span>}
      </div>

      <div className="feed-tile-cap">
        <span className="feed-tile-name">{item.name}</span>
        <span className="feed-tile-go">See the work →</span>
      </div>
    </button>
  );
}

export function HomeFeed({ limit }: { limit?: number } = {}) {
  const items = useMemo<FeedItem[]>(() => {
    const published = PROJECTS.filter((p) => p.status === "published");
    const usedHeroes = new Set(
      published.map((p) => PROJECT_HERO[p.slug]).filter(Boolean),
    );
    const newSlugs = new Set(published.slice(0, 3).map((p) => p.slug));

    const projects: FeedItem[] = published.map((p) => ({
      key: `p-${p.slug}`,
      hero: PROJECT_HERO[p.slug] ?? "",
      name: p.name,
      type: "Project",
      category: categoryForProject(p),
      isNew: newSlugs.has(p.slug),
    }));

    const impact: FeedItem[] = IMPACT_CASE_STUDIES.filter(
      (c) => !c.hero || !usedHeroes.has(c.hero),
    ).map((c) => ({
      key: `i-${c.slug}`,
      hero: c.hero ?? "",
      name: c.name,
      type: "Project",
      category: cap(c.category),
      isNew: false,
    }));

    // Interleave so work mixes instead of sitting in blocks.
    const merged: FeedItem[] = [];
    const max = Math.max(projects.length, impact.length);
    for (let i = 0; i < max; i++) {
      if (projects[i]) merged.push(projects[i]);
      if (impact[i]) merged.push(impact[i]);
    }
    return limit ? merged.slice(0, limit) : merged;
  }, [limit]);

  return (
    <section className="home-feed" aria-label="Rennie Lab — recent work and events">
      {items.map((it, i) => (
        <FeedTile key={it.key} item={it} index={i} />
      ))}
    </section>
  );
}
