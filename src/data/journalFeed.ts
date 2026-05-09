import { JOURNAL_POSTS } from "./journal";
import { PROJECTS } from "./projects";
import { IMPACT_CASE_STUDIES, type ImpactCaseStudy } from "./impactProjects";
import { PROJECT_HERO } from "./projectImages";
import type { JournalPost, Project } from "./types";

export type FeedItemCategory =
  | "climate"
  | "movement"
  | "community"
  | "design"
  | "impact";

export type FeedItemKind =
  | "newsletter"
  | "field-guide"
  | "podcast"
  | "reading"
  | "event"
  | "project"
  | "impact";

export type FeedItemOrigin = "journal" | "project" | "impact";

export type UnifiedFeedItem = {
  id: string;
  origin: FeedItemOrigin;
  title: string;
  excerpt: string;
  category: FeedItemCategory;
  kind: FeedItemKind;
  image?: string;
  tone: string;
  source: string;
  publishedAt?: string;
  bodyLength: number;
  journalPost?: JournalPost;
  project?: Project;
  caseStudy?: ImpactCaseStudy;
};

function fromJournalPost(p: JournalPost): UnifiedFeedItem {
  return {
    id: `journal-${p.slug}`,
    origin: "journal",
    title: p.title,
    excerpt: p.excerpt,
    category: p.category ?? "design",
    kind: p.type as FeedItemKind,
    image: p.image,
    tone: p.tone ?? "ink",
    source: p.source === "substack" ? "Ben Rennie · Substack" : "97% · Field",
    publishedAt: p.publishedAt,
    bodyLength: p.body.length,
    journalPost: p,
  };
}

function fromProject(p: Project): UnifiedFeedItem | null {
  if (p.status !== "published") return null;
  const firstTag = p.impactTags?.[0];
  const category: FeedItemCategory =
    firstTag === "Movement"
      ? "movement"
      : firstTag === "Climate"
        ? "climate"
        : firstTag === "Community"
          ? "community"
          : "design";
  return {
    id: `project-${p.slug}`,
    origin: "project",
    title: p.tagline ?? p.name,
    excerpt:
      p.sections.challenge ??
      p.sections.background ??
      p.sections.description ??
      p.sections.solution ??
      "",
    category,
    kind: "project",
    image: PROJECT_HERO[p.slug],
    tone: p.tone ?? "ink",
    source: `Project · ${p.client}`,
    bodyLength: 1200,
    project: p,
  };
}

function fromCaseStudy(c: ImpactCaseStudy): UnifiedFeedItem {
  return {
    id: `impact-${c.slug}`,
    origin: "impact",
    title: c.name,
    excerpt: c.subtitle,
    category: c.category,
    kind: "impact",
    image: c.hero,
    tone: c.tone,
    source: "Impact · pro-bono + at-cost",
    bodyLength: 1500,
    caseStudy: c,
  };
}

const journalItems: UnifiedFeedItem[] = JOURNAL_POSTS.map(fromJournalPost);
const projectItems: UnifiedFeedItem[] = PROJECTS.map(fromProject).filter(
  (x): x is UnifiedFeedItem => x !== null,
);
const impactItems: UnifiedFeedItem[] = IMPACT_CASE_STUDIES.map(fromCaseStudy);

// Interleave so projects and impact studies surface throughout the feed
// rather than dumping at the end.
function interleave(...lists: UnifiedFeedItem[][]): UnifiedFeedItem[] {
  const out: UnifiedFeedItem[] = [];
  const max = Math.max(...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) {
    for (const list of lists) {
      if (list[i]) out.push(list[i]!);
    }
  }
  return out;
}

export const FEED_ITEMS: UnifiedFeedItem[] = interleave(
  journalItems,
  projectItems,
  impactItems,
);
