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

// Five tinted-black backdrops — almost imperceptible warm/cool shifts that give
// each section its discipline cue without competing with the hero card images.
const SECTIONS: StackSection[] = [
  {
    id: "brand",
    title: "Brand",
    desc: "We build brands for their second decade. Positioning, narrative, identity, voice, rollout. Systems that get easier to use as the company grows, and sharper as the world changes around them. The work we are proudest of looks newer at year five than it did at launch.",
    bg: "#1a1416",
    fg: "#fbfbf7",
    projectSlugs: ["marlee", "re-form-projects", "robert-coopers-rare-gin", "renystudio"],
    fallbackTone: "red",
  },
  {
    id: "advisory",
    title: "Advisory",
    desc: "Strategy work that doesn't end in a deck. We sit beside founders, boards and leadership teams as a long-form retained partner. Monthly, sometimes for years. The work tends to outlast the brief that started it.",
    bg: "#0c0c0e",
    fg: "#fbfbf7",
    projectSlugs: ["patagonia", "heartfoundation", "johnston-advisory", "packer"],
    fallbackTone: "ink",
  },
  {
    id: "product",
    title: "Product",
    desc: "The internet uses more electricity than most countries. We design like that matters. Product and service design across research, architecture, interaction, interface, and shipped code. Pages built to load fast on a five-year-old phone in a regional area. Systems built so the in-house team can keep building.",
    bg: "#0e1418",
    fg: "#fbfbf7",
    projectSlugs: ["buck-mason", "boody", "electric-california", "herschel"],
    fallbackTone: "ocean",
  },
  {
    id: "climate",
    title: "Climate",
    desc: "Forty percent of the studio's capacity, mostly pro-bono and at-cost. Programs and identities for charities, councils, coalitions and the curious. The lane where craft gets pointed at the questions that outlast a launch.",
    bg: "#0e1410",
    fg: "#fbfbf7",
    projectSlugs: ["1percentfortheplanet", "verteyewear", "imf", "in-pieces"],
    fallbackTone: "moss",
  },
  {
    id: "research",
    title: "Research",
    desc: "Most studios fold research into a project. We sell it on its own. Standalone fieldwork, ethnography, archive and synthesis for studios, brands and policy teams who need a second mind in the room. Reports designed to be read, used, and argued with.",
    bg: "#1a140e",
    fg: "#fbfbf7",
    projectSlugs: ["rozelleinterchange", "mr-simple", "benbaker", "nswis"],
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
};

function ProjectStackCard({ project, fallbackTone }: ProjectStackCardProps) {
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
          className="stack-card-img"
        />
      )}
      <div className="stack-card-shade" aria-hidden="true" />
      <div className="stack-card-label">
        {(project.categories[0] ?? "case study").toLowerCase()}
        <span className="stack-card-title">{project.name}</span>
      </div>
    </div>
  );
}
