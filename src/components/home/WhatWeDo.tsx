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
    title: "brand",
    desc: "A full brand foundation, built to hold its own next to organisations ten times your size. Positioning, narrative, identity, voice, rollout. We work with founders, leadership teams and movements who want a brand that feels like it was always there, waiting.",
    bg: "#1a1416",
    fg: "#fbfbf7",
    projectSlugs: ["marlee", "re-form-projects", "robert-coopers-rare-gin", "renystudio"],
    fallbackTone: "red",
  },
  {
    id: "advisory",
    title: "advisory",
    desc: "Some projects are too big to launch and walk away from. We sit beside leadership, monthly, sometimes for years, helping the work find what it's trying to say before the world has a chance to mishear it.",
    bg: "#0c0c0e",
    fg: "#fbfbf7",
    projectSlugs: ["patagonia", "heartfoundation", "johnston-advisory", "packer"],
    fallbackTone: "ink",
  },
  {
    id: "product",
    title: "product",
    desc: "Product and service design for the kind of digital experience people quietly choose to come back to. From research and information architecture through to interaction, interface and shipped code. We don't hand over wireframes and wave.",
    bg: "#0e1418",
    fg: "#fbfbf7",
    projectSlugs: ["buck-mason", "boody", "electric-california", "herschel"],
    fallbackTone: "ocean",
  },
  {
    id: "climate",
    title: "climate",
    desc: "This is where craft gets pointed at the questions that matter beyond a launch. Programs and identities for charities, governments, and the curious. Mostly pro-bono and at-cost. Always built with the planet in the room.",
    bg: "#0e1410",
    fg: "#fbfbf7",
    projectSlugs: ["1percentfortheplanet", "verteyewear", "imf", "in-pieces"],
    fallbackTone: "moss",
  },
  {
    id: "research",
    title: "research",
    desc: "Standalone research for studios, brands and policy teams who need a second mind in the room. Interviews, fieldwork, archive, ethnography. We treat research as craft, and we don't write reports nobody reads.",
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    opacity: 0,
                    marginBottom: 24,
                  }}
                  aria-hidden="true"
                >
                  spacer
                </div>
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
      style={
        heroSrc
          ? {
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05) 60%), url(${heroSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="stack-card-label">
        {(project.categories[0] ?? "case study").toLowerCase()}
        <span className="stack-card-title">{project.name}</span>
      </div>
    </div>
  );
}
