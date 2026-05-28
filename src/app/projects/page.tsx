import { PROJECTS } from "@/data/projects";
import { IMPACT_CASE_STUDIES } from "@/data/impactProjects";
import { PROJECT_HERO } from "@/data/projectImages";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { LogoStrip } from "@/components/home/LogoStrip";

export const metadata = {
  title: "Projects",
  description:
    "Recent partnerships across brand, UX, environments and impact — studio work and pro-bono case studies in one wall.",
};

export default function ProjectsPage() {
  const published = PROJECTS.filter((p) => p.status === "published");

  // Impact case studies flow into the wall too — it's all the work. Drop the
  // few that reuse a published project's hero image so we never show the same
  // picture twice (those clients are already represented by their project tile).
  const usedHeroes = new Set(
    published.map((p) => PROJECT_HERO[p.slug]).filter(Boolean),
  );
  const impactWork = IMPACT_CASE_STUDIES.filter(
    (c) => !c.hero || !usedHeroes.has(c.hero),
  );
  const totalWork = published.length + impactWork.length;

  return (
    <div className="container">
      <section className="proj-statement">
        <div className="mono rise" style={{ marginBottom: 28 }}>
          Projects · {totalWork} selected · 2022 → 2026
        </div>
        <div className="proj-statement-text rise delay-1">
          <p>
            <span className="proj-statement-name">
              Rennie<sup className="proj-statement-reg">®</sup>
            </span>{" "}
            is an independent design studio with two decades of experience providing
            brand strategy, design systems, placemaking and user experience design for
            the world&apos;s most important companies.
          </p>
          <p>
            Our clients are visionary brands and charities who protect access to
            nature, humanity + human potential. We call this impact.
          </p>
        </div>
      </section>

      <ProjectsList projects={published} impact={impactWork} />

      {/* Client roster — rotating logo wall */}
      <section style={{ padding: "96px 0 32px" }}>
        <div className="mono" style={{ marginBottom: 28, color: "var(--ink-3)" }}>
          Selected clients · partners · alliances
        </div>
        <LogoStrip />
      </section>
    </div>
  );
}
