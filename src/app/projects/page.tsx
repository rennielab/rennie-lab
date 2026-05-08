import { PROJECTS } from "@/data/projects";
import { ProjectsList } from "@/components/projects/ProjectsList";

export const metadata = {
  title: "Projects — Rennie Lab",
  description:
    "A short list of recent partnerships across brand, UX, climate and impact work.",
};

export default function ProjectsPage() {
  const published = PROJECTS.filter((p) => p.status === "published");

  return (
    <div className="container">
      <section style={{ padding: "40px 0 96px" }}>
        <div className="mono rise" style={{ marginBottom: 32 }}>
          Projects · {published.length} selected · 2022 → 2026
        </div>
        <h1
          className="h-display rise delay-1"
          style={{ margin: 0, maxWidth: "14ch" }}
        >
          Impact Projects
        </h1>
        <p className="body-lg rise delay-2" style={{ marginTop: 24, maxWidth: "48ch" }}>
          A short list of recent partnerships. Most projects run two to five years; we
          share the bits we&apos;re allowed to share.
        </p>
      </section>

      <ProjectsList projects={published} />
    </div>
  );
}
