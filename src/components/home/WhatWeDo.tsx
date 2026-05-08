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
  img: string;
  projectSlugs: string[];
  fallbackTone: "red" | "moss" | "cream" | "sand" | "rust" | "ocean" | "ink";
};

const SECTIONS: StackSection[] = [
  {
    id: "brand",
    title: "brand",
    desc: "A complete brand foundation built to hold its own alongside organisations ten times your size — from positioning and narrative through to identity, voice and rollout. We work with founders, leadership teams and movements to build brands that feel inevitable, not invented.",
    bg: "#E94E4D",
    fg: "#FFFDEC",
    img: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&w=2400&q=70",
    projectSlugs: ["marlee", "re-form-projects", "robert-coopers-rare-gin", "renystudio"],
    fallbackTone: "red",
  },
  {
    id: "advisory",
    title: "advisory",
    desc: "A bespoke creative, strategic and communications advisory partnership for the bigger projects and bolder ambitions. We sit alongside leadership — quietly, monthly, for as long as it takes — helping the work clarify itself before the world ever sees it.",
    bg: "#151517",
    fg: "#FFFDEC",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2400&q=70",
    projectSlugs: ["patagonia", "heartfoundation", "johnston-advisory", "packer"],
    fallbackTone: "ink",
  },
  {
    id: "ux",
    title: "ux design",
    desc: "Editorial-grade product and service design — the kind of digital experience people quietly choose to come back to. End-to-end work, from research and information architecture through to interaction, interface and shipped code.",
    bg: "#2C4A5E",
    fg: "#FFFDEC",
    img: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=2400&q=70",
    projectSlugs: ["buck-mason", "boody", "electric-california", "herschel"],
    fallbackTone: "ocean",
  },
  {
    id: "climate",
    title: "climate",
    desc: "Programs and identities for the climate, community and movement work. Built with charities, governments and the curious — the studio's pro-bono and at-cost lane, where craft is pointed at the questions that matter beyond a launch.",
    bg: "#4F6A4A",
    fg: "#FFFDEC",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=70",
    projectSlugs: ["1percentfortheplanet", "verteyewear", "imf", "in-pieces"],
    fallbackTone: "moss",
  },
  {
    id: "research",
    title: "research",
    desc: "Quiet, deep-end research as a standalone engagement — interviews, fieldwork, archive and ethnography for studios, brands and policy teams who need a second mind in the room. We treat research as craft.",
    bg: "#B45E3F",
    fg: "#FFFDEC",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2400&q=70",
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
            <div
              className="stack-bg"
              aria-hidden="true"
              style={{ backgroundImage: `url(${s.img})` }}
            ></div>
            <div className="stack-bg-overlay" aria-hidden="true" style={{ background: s.bg }}></div>
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
    window.dispatchEvent(
      new CustomEvent("open-case", { detail: { project } }),
    );
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
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1)), url(${heroSrc})`,
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
