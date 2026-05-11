"use client";

import type { Project } from "@/data/types";
import { PROJECTS } from "@/data/projects";
import { PROJECT_HERO } from "@/data/projectImages";

type StackSection = {
  id: string;
  title: string;
  desc: string;
  bg: string;
  fg: string;
  projectSlugs: string[];
  fallbackTone: "red" | "moss" | "cream" | "sand" | "rust" | "ocean" | "ink";
};

// Neutral-black gradient — Brand starts at the page-bg ink, each subsequent
// section lifts ~3 lightness units so scrolling reads as a slow grey climb
// against the imagery. No warm/cool tint — the cards carry the colour.
const SECTIONS: StackSection[] = [
  {
    id: "brand",
    title: "Brand",
    desc: "We build brands for their second decade. Positioning, narrative, identity, voice, rollout. Systems that get easier to use as the company grows, and sharper as the world changes around them. The work we are proudest of looks newer at year five than it did at launch.",
    bg: "#0e0e10",
    fg: "#fbfbf7",
    projectSlugs: ["marlee", "re-form-projects", "robert-coopers-rare-gin", "renystudio"],
    fallbackTone: "red",
  },
  {
    id: "products",
    title: "Products",
    desc: "Websites, apps and the digital products that bring brands to life. Research, information architecture, interaction, interface, and shipped code. Pages built to load fast on a five-year-old phone in a regional area, and to stay accessible at the AA threshold by default. Systems built so the in-house team can keep building.",
    bg: "#131316",
    fg: "#fbfbf7",
    projectSlugs: ["boody", "electric-california", "heartfoundation", "imf"],
    fallbackTone: "ocean",
  },
  {
    id: "advisory",
    title: "Advisory",
    desc: "Strategy work that doesn't end in a deck. We sit beside founders, boards and leadership teams as a long-form retained partner. Monthly, sometimes for years. The work tends to outlast the brief that started it.",
    bg: "#18181c",
    fg: "#fbfbf7",
    projectSlugs: ["patagonia", "1percentfortheplanet", "johnston-advisory", "packer"],
    fallbackTone: "ink",
  },
  {
    id: "environments",
    title: "Environments",
    desc: "Spaces that work as hard as the people inside them. Retail, training facilities, exhibition design, brand environments — designed end to end with our partners. From the National Snowsports Training Centre in Jindabyne to flagship stores for Buck Mason, Herschel and Mr Simple, the work is the same: read the brief, understand how people will move through the space, design with the operator and the long term in mind.",
    bg: "#1d1d22",
    fg: "#fbfbf7",
    projectSlugs: ["nswis", "buck-mason", "herschel", "mr-simple"],
    fallbackTone: "moss",
  },
  {
    id: "research",
    title: "Research",
    desc: "Most studios fold research into a project. We sell it on its own. Standalone fieldwork, ethnography, archive and synthesis for studios, brands and policy teams who need a second mind in the room. Reports designed to be read, used, and argued with.",
    bg: "#222229",
    fg: "#fbfbf7",
    projectSlugs: ["rozelleinterchange", "benbaker", "in-pieces", "canva"],
    fallbackTone: "rust",
  },
];

function projectsFor(slugs: string[]): Project[] {
  return slugs
    .map((s) => PROJECTS.find((p) => p.slug === s))
    .filter((p): p is Project => Boolean(p))
    .slice(0, 4);
}

export function WhatWeDo() {
  return (
    <section
      className="stack-wrap"
      style={{
        marginLeft: "calc(-1 * var(--gutter))",
        marginRight: "calc(-1 * var(--gutter))",
        marginTop: 32,
        width: "100vw",
      }}
    >
      {SECTIONS.map((s, i) => {
        const projects = projectsFor(s.projectSlugs);
        return (
          <div
            key={s.id}
            className="stack-section"
            style={{ background: s.bg, color: s.fg, zIndex: 10 + i }}
          >
            <div className="stack-head">
              <div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    opacity: 0.6,
                    marginBottom: 24,
                  }}
                >
                  What we do · 0{i + 1} / 0{SECTIONS.length}
                </div>
                <h2 className="stack-title">{s.title}</h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  paddingBottom: "0.18em",
                }}
              >
                <p className="stack-desc">{s.desc}</p>
              </div>
            </div>
            <div className="stack-foot">
              <div className="stack-cards">
                {projects.map((project) => (
                  <ProjectStackCard
                    key={project.slug}
                    project={project}
                    fallbackTone={s.fallbackTone}
                    eyebrow={s.title}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

type ProjectStackCardProps = {
  project: Project;
  fallbackTone: "red" | "moss" | "cream" | "sand" | "rust" | "ocean" | "ink";
  eyebrow: string;
};

function ProjectStackCard({ project, fallbackTone, eyebrow }: ProjectStackCardProps) {
  const onClick = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("open-case", { detail: { project } }));
  };
  const heroSrc = PROJECT_HERO[project.slug];
  return (
    <div
      className="stack-card ph"
      data-tone={project.tone || fallbackTone}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
    >
      {heroSrc && (
        /* Native lazy-load — defers ~20 preview images on home until scroll */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={heroSrc}
          alt=""
          loading="lazy"
          decoding="async"
          width={1200}
          height={880}
          className="stack-card-img"
        />
      )}
      <div className="stack-card-shade" aria-hidden="true" />
      <div className="stack-card-label">
        {eyebrow.toLowerCase()}
        <span className="stack-card-title">{project.name}</span>
      </div>
    </div>
  );
}
