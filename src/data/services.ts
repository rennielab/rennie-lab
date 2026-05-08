import type { Service, OrbitalPhase } from "./types";

export const SERVICES: Service[] = [
  {
    id: "impact-products",
    pillar: "impact-products",
    name: "Impact Products",
    shortDescription:
      "Product strategy and design for the things that ship — digital, physical and everything in between. We build the products that bring brands and businesses to life.",
    capabilities: [
      "Product Strategy",
      "Digital Product Design",
      "Physical Product Design",
      "UX / UI Design",
      "Service Design",
      "Industrial Design",
      "Packaging Design",
      "Design Systems",
      "Motion Design",
      "Brand Experience Design",
      "Development & Builds",
    ],
  },
  {
    id: "strategic-futures",
    pillar: "strategic-futures",
    name: "Strategic Futures / Advisory",
    shortDescription:
      "Strategy and advisory for boards, founders and operators making decisions with horizon. We work where the brand, the business model and the climate question meet.",
    capabilities: [
      "Innovation Strategy",
      "Brand Strategy",
      "Business Model Design",
      "Climate Strategy",
      "Digital Transformation",
      "Market Positioning",
      "Organizational Design",
      "Research & Insights",
      "Foresight & Trends",
      "ESG Strategy",
    ],
  },
  {
    id: "creative-transformation",
    pillar: "creative-transformation",
    name: "Creative Transformation",
    shortDescription:
      "Workshops, training and team capability — built around our Orbital Design process. The way we work, taught to teams who want to work the same way.",
    capabilities: [
      "Orbital Design Workshops",
      "Orbital Design Training",
      "Team Capability Building",
      "Innovation Culture Design",
      "Creative Leadership Development",
      "Cross-functional Collaboration Design",
      "Internal Communications Strategy",
      "Change Management",
      "Design Sprints",
      "Climate Literacy Programs",
    ],
  },
];

export const ORBITAL_PROCESS: OrbitalPhase[] = [
  {
    num: "01",
    name: "Gravity",
    body: "Find the centre of mass. We listen for the real problem underneath the brief — the constraint, the conviction, the thing that won't go away. The work begins by naming what holds everything else in orbit.",
  },
  {
    num: "02",
    name: "Orbit",
    body: "Map the field. Stakeholders, audiences, competitive moves, climate context, technology. We chart how the forces actually relate before we propose how they should relate.",
  },
  {
    num: "03",
    name: "Atmosphere",
    body: "Shape the conditions. Strategy and design come together here — brand, product, service, system. The aim is a coherent atmosphere, not a list of deliverables.",
  },
  {
    num: "04",
    name: "Re-entry",
    body: "Land the work. Build, ship, train. We stay close through launch — the friction is in the re-entry, and we don't hand off and disappear.",
  },
  {
    num: "05",
    name: "Return",
    body: "Loop. Measure, learn, iterate. The orbit holds because we revisit. The most useful work is the slowest, and it compounds when you treat it as a relationship, not a project.",
  },
];
