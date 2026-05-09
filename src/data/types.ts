export type ProjectCategory =
  | "Branding Studio"
  | "Business Design"
  | "Content"
  | "Digital Products"
  | "Expansion"
  | "Interactive"
  | "Places (Wayfinding)"
  | "Products"
  | "UX"
  | "Websites";

export type ImpactTag = "Movement" | "Climate" | "Community";

export type ProjectImage = { src: string; alt?: string };

export type Project = {
  slug: string;
  name: string;
  /** Short, aspirational project headline. Falls back to `name` when absent. */
  tagline?: string;
  client: string;
  year?: number;
  industry?: string;
  services: string[];
  hero?: ProjectImage;
  gallery: ProjectImage[];
  categories: ProjectCategory[];
  /** Movement / Climate / Community — surfaced as tags on project cards. */
  impactTags?: ImpactTag[];
  source: "reny-studio" | "rennie-lab";
  sections: {
    challenge?: string;
    solution?: string;
    execution?: string;
    impact?: string;
    background?: string;
    description?: string;
    fundraising?: string;
  };
  pullQuote?: { text: string; attribution: string };
  status: "published" | "placeholder";
  tone?: "red" | "cream" | "moss" | "ocean" | "rust" | "sand" | "ink" | "dark";
};

export type JournalCategory = "climate" | "movement" | "community" | "design" | "impact";
export type JournalKind = "newsletter" | "podcast" | "field-guide" | "reading" | "event";
export type JournalSource = "substack" | "97percent";

export type JournalPost = {
  slug: string;
  title: string;
  publishedAt: string;
  source: JournalSource;
  sourceUrl: string;
  tags: string[];
  excerpt: string;
  body: string;
  bodyAvailable: "full" | "preview-only" | "none";
  type: JournalKind;
  category?: JournalCategory;
  series?: string;
  seriesOrder?: number;
  tone?: "red" | "cream" | "moss" | "ocean" | "rust" | "sand" | "ink" | "dark";
};

export type ServicePillar = "impact-products" | "strategic-futures" | "creative-transformation";

export type Service = {
  id: string;
  pillar: ServicePillar;
  name: string;
  shortDescription: string;
  capabilities: string[];
};

export type StoryBlockKind =
  | "hero"
  | "mission"
  | "founder-quote"
  | "manifesto"
  | "acknowledgement"
  | "inclusivity"
  | "founded"
  | "studios"
  | "affiliations";

export type StoryBlock = {
  id: string;
  kind: StoryBlockKind;
  heading?: string;
  body: string;
  attribution?: string;
};

export type ImpactPillarSlug = "oceans" | "health" | "community" | "mountains" | "climate";

export type ImpactPillar = {
  slug: ImpactPillarSlug;
  title: string;
  body: string;
  exampleProjectSlugs: string[];
  tone: "red" | "cream" | "moss" | "ocean" | "rust" | "sand" | "ink" | "dark";
};

export type OrbitalPhase = {
  num: string;
  name: string;
  body: string;
};
