import { PROJECTS } from "@/data/projects";
import { ProjectsList } from "@/components/projects/ProjectsList";

export const metadata = {
  title: "Projects",
  description:
    "A short list of recent partnerships across brand, UX, climate and impact work.",
};

export default function ProjectsPage() {
  const published = PROJECTS.filter((p) => p.status === "published");

  return (
    <div className="container">
      <section className="proj-statement">
        <div className="mono rise" style={{ marginBottom: 28 }}>
          Projects · {published.length} selected · 2022 → 2026
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

      <ProjectsList projects={published} />
    </div>
  );
}
