export type FeedKind = "project" | "journal" | "impact" | "news";

export type FeedItem = {
  id: number;
  kind: FeedKind;
  cat: "design" | "climate" | "community" | "movement" | "impact";
  tone: "red" | "moss" | "cream" | "sand" | "rust" | "ocean" | "ink";
  title: string;
  client: string;
  year: number;
  read: string;
  desc: string;
};

export const FEED: FeedItem[] = [
  { id: 1, kind: "project", cat: "design", tone: "red", title: "A new identity for an ocean policy coalition", client: "Ocean Decade Australia", year: 2026, read: "4 min", desc: "A coordinated visual language for fifteen marine NGOs working under one national policy banner — built to outlast a political cycle and read clearly from a press release to a coastline." },
  { id: 2, kind: "journal", cat: "climate", tone: "moss", title: "Designing for permanence in a transient economy", client: "Essay · Ben Rennie", year: 2026, read: "7 min", desc: "On building brands and products that earn the right to last — and what that asks of a studio practice." },
  { id: 3, kind: "impact", cat: "community", tone: "cream", title: "A Sunday hour for the people who carry weight", client: "Beyond Blue · pro bono", year: 2026, read: "3 min", desc: "A small, quiet program for first responders and frontline workers — produced over twelve months with the Beyond Blue clinical team." },
  { id: 4, kind: "project", cat: "design", tone: "sand", title: "A pack system designed to disappear on purpose", client: "Slow Goods Co.", year: 2025, read: "5 min", desc: "End-to-end identity, packaging architecture and material strategy for an Australian skincare house built on closed-loop refills." },
  { id: 5, kind: "news", cat: "movement", tone: "rust", title: "The studio joins 1% for the Planet", client: "Studio note", year: 2025, read: "2 min", desc: "A short note on the membership, the math behind the commitment, and the partner charities we are routing the first year of contributions to." },
  { id: 6, kind: "journal", cat: "design", tone: "ocean", title: "On the colour of climate — why red, why now", client: "Notes · Studio", year: 2025, read: "6 min", desc: "Why we picked the colour the studio wears — and what it asks of the work that runs underneath it." },
  { id: 7, kind: "project", cat: "movement", tone: "red", title: "A 1,200km relay walked along the eastern coast", client: "Surfrider Foundation Australia", year: 2025, read: "8 min", desc: "Concept, identity and on-the-ground production for a year-long art relay walked from Byron to Bermagui — a brief that began as a conversation about plastic and ended as a movement." },
  { id: 8, kind: "impact", cat: "climate", tone: "moss", title: "A community-led coalition for cool roofs", client: "City of Sydney", year: 2024, read: "5 min", desc: "A heat-adaptation program built with eight inner-city councils — the strategy, the visual system, and the door-to-door playbook used by the volunteer crew." },
  { id: 9, kind: "journal", cat: "community", tone: "ink", title: "The smallest gesture is still a strategy", client: "Essay · Studio", year: 2024, read: "4 min", desc: "What a community organiser taught us about the difference between a campaign and a real change in behaviour." },
  { id: 10, kind: "project", cat: "impact", tone: "cream", title: "A long-horizon brand for a forest fund", client: "GreatForest Trust", year: 2024, read: "6 min", desc: "Strategy and identity for a 100-year reforestation fund — designed so the brand still works when none of the founders are in the room." },
  { id: 11, kind: "news", cat: "design", tone: "rust", title: "Reny Studio is now Rennie Lab", client: "Studio note · 2023", year: 2023, read: "3 min", desc: "After six years and a quietly different practice, the studio takes a new name. The team is the same; the work has just become a lab." },
  { id: 12, kind: "journal", cat: "movement", tone: "sand", title: "When the community is the brief", client: "Notes · Studio", year: 2023, read: "5 min", desc: "On co-design, slowness, and the briefs that should never be written before the first conversation." },
  { id: 13, kind: "project", cat: "climate", tone: "ocean", title: "A public ledger for coastal carbon", client: "CSIRO + State Lab", year: 2023, read: "9 min", desc: "A research-led identity, data system and public-facing dashboard for measuring the carbon held in Australia’s coastal seagrass meadows." },
  { id: 14, kind: "impact", cat: "community", tone: "red", title: "A residency program for First Nations designers", client: "Bundanon Trust", year: 2023, read: "4 min", desc: "Co-designed with the Trust and three Country-led collectives — a program structure, identity and editorial framework for a multi-year residency." },
  { id: 15, kind: "journal", cat: "climate", tone: "moss", title: "Why we measure carbon on the page you're reading", client: "Essay · Studio", year: 2023, read: "5 min", desc: "A short piece on the leaf in the corner of this site, the assumptions behind it, and what we would like the rest of our industry to do next." },
  { id: 16, kind: "project", cat: "design", tone: "ink", title: "A new brand for a regional hotel group", client: "Halfway Hotel Group", year: 2022, read: "6 min", desc: "Naming, identity and digital experience for a network of five regional hotels in NSW — a brand quietly built around the rhythm of country travel." },
  { id: 17, kind: "news", cat: "impact", tone: "cream", title: "Studio joins UN Habitat creative advisory", client: "Press", year: 2022, read: "2 min", desc: "Ben Rennie joins the UN Habitat creative advisory panel for the World Cities Report editorial program." },
  { id: 18, kind: "journal", cat: "movement", tone: "rust", title: "Eight years of clean creative — what's actually changed", client: "Anniversary essay", year: 2025, read: "10 min", desc: "Stocktake on the studio’s practice, the wins, the misses, and the bets we are making for the next decade." },
];
