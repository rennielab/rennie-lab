// Impact case studies — verbatim from RennieLab_ImpactCaseStudies.docx
// Categories: climate · community · movement
// Hero images use existing /public/projects assets where the case study
// matches a reny.studio project; otherwise the design's tone-based placeholder.

export type ImpactCategory = "climate" | "community" | "movement";

export type ImpactCaseStudy = {
  slug: string;
  name: string;
  subtitle: string;
  category: ImpactCategory;
  challenge: string;
  solution: string;
  impact: string;
  hero?: string;
  tone: "red" | "moss" | "cream" | "sand" | "rust" | "ocean" | "ink";
};

export const IMPACT_CASE_STUDIES: ImpactCaseStudy[] = [
  {
    slug: "halfcut",
    name: "HalfCut",
    subtitle: "Brand, Strategy and Digital for a World-Changing Reforestation Movement",
    category: "climate",
    challenge:
      "HalfCut is one of the world's most important reforestation projects, but its brand and digital presence weren't matching the scale of its ambition. The organisation needed to reposition for growth, attract corporate partners, and build a movement that could stand alongside the world's leading environmental causes.",
    solution:
      "Rennie Lab led a comprehensive brand, strategy, and digital engagement for HalfCut across halfcut.org. This included repositioning the brand narrative, rebuilding the digital platform, developing campaign assets, and providing ongoing strategic advisory to support scaling and partnership development. The work gave HalfCut the visual and strategic language to operate at a global level.",
    impact:
      "HalfCut now operates as a credible and compelling global reforestation movement with a brand and platform capable of attracting corporate ESG partners, philanthropic investment, and community participation at scale.",
    hero: "/impact/halfcut.jpg",
    tone: "moss",
  },
  {
    slug: "patagonia-1percent",
    name: "Patagonia / 1% For The Planet",
    subtitle: "Designing the Way the World's Most Purposeful Fund Gets Distributed",
    category: "climate",
    challenge:
      "1% for the Planet is a global movement where businesses commit one percent of sales to environmental causes. Working with Patagonia, the challenge was to design and develop the digital and strategic infrastructure that determines how those funds are identified, evaluated, and donated to the right projects around the world.",
    solution:
      "Rennie Lab contributed to the design, development, research, and strategy behind the donation framework, including digital tools and decision-making systems that help direct funding toward the highest-impact environmental projects. The work sat at the intersection of design, systems thinking, and ecological values.",
    impact:
      "The work contributed to a more rigorous and transparent model for directing environmental funding, ensuring that the 1% committed by businesses reaches the projects most capable of creating genuine ecological change.",
    hero: "/projects/patagonia.webp",
    tone: "ocean",
  },
  {
    slug: "heart-foundation-impact",
    name: "Heart Foundation",
    subtitle: "Building the Digital Future of Australia's Leading Heart Health Organisation",
    category: "community",
    challenge:
      "The Heart Foundation needed to rethink its digital presence and internal capability to better serve millions of Australians living with or at risk of heart disease. The existing digital infrastructure wasn't keeping pace with how people were seeking health information and support.",
    solution:
      "Rennie Lab led a digital platform design engagement and facilitated a think tank process to map and design the Heart Foundation's digital future. This included platform architecture, UX strategy, and a roadmap for building digital tools that could meaningfully serve patients, carers, and health professionals at scale.",
    impact:
      "The work gave the Heart Foundation a clear and actionable digital vision, positioning the organisation to better reach and support Australians through its most important digital touchpoints.",
    hero: "/projects/heartfoundation.webp",
    tone: "red",
  },
  {
    slug: "cancer-council",
    name: "Cancer Council",
    subtitle: "National Ad Campaign Concept, Design and Digital Deployment",
    category: "community",
    challenge:
      "Cancer Council needed a campaign that could cut through the noise, reach Australians across digital channels, and drive meaningful engagement with their programs and services. The challenge was to create something that felt human and urgent without being heavy-handed.",
    solution:
      "Rennie Lab developed the ad concept, designed the campaign assets, and managed digital deployment across web channels. The work balanced emotional resonance with clear calls to action, ensuring the campaign worked at every level of the funnel.",
    impact:
      "The campaign delivered meaningful reach and engagement for one of Australia's most important health organisations, connecting Australians with Cancer Council's resources and support services.",
    hero: "/impact/cancer-council.jpg",
    tone: "red",
  },
  {
    slug: "indigenous-marathon-foundation",
    name: "Indigenous Marathon Foundation",
    subtitle: "Brand, Digital Platform and Education Tools for Indigenous Empowerment",
    category: "community",
    challenge:
      "The Indigenous Marathon Foundation needed a brand identity, digital platform, and suite of educational tools that could authentically represent and serve Indigenous communities across Australia. The work required deep cultural sensitivity alongside high quality design and development.",
    solution:
      "Rennie Lab delivered brand concepts and refinement, naming, UX design, and full digital development across platforms built for education and knowledge sharing. The work was developed in genuine partnership, with cultural integrity at the centre of every design decision.",
    impact:
      "The Foundation now operates with a brand and digital infrastructure that authentically reflects its mission and gives Indigenous communities across Australia access to education, storytelling, and knowledge platforms built for them.",
    hero: "/projects/imf.webp",
    tone: "rust",
  },
  {
    slug: "canberra-childrens-hospital",
    name: "Canberra Children's Hospital",
    subtitle: "Brand Identity and Digital Platform for a World-Class Children's Hospital",
    category: "community",
    challenge:
      "Canberra Children's Hospital needed a brand identity and digital presence that could serve patients, families, and staff while reflecting the warmth, care, and world-class expertise of the institution.",
    solution:
      "Rennie Lab designed and developed the hospital's brand identity and digital platforms, creating a visual and digital language that felt approachable for children and families while conveying the professionalism and trust that healthcare demands.",
    impact:
      "The hospital now operates with a brand and digital platform that better serves its community, from the families walking through the doors to the staff working within them.",
    hero: "/impact/canberra-childrens-hospital.jpeg",
    tone: "cream",
  },
  {
    slug: "sydney-childrens-hospital",
    name: "Sydney Children's Hospital",
    subtitle: "Brand Identity and Digital Platform for Sydney's Beloved Children's Hospital",
    category: "community",
    challenge:
      "Sydney Children's Hospital required the same thoughtful approach as its Canberra counterpart, a brand and digital presence that could hold the complexity of a major healthcare institution while remaining warm and accessible for the children and families it serves.",
    solution:
      "Building on the Canberra engagement, Rennie Lab designed and developed the brand identity and digital platforms for Sydney Children's Hospital, maintaining consistency across both institutions while tailoring the work to Sydney's specific community and context.",
    impact:
      "Sydney Children's Hospital gained a brand and digital infrastructure capable of serving one of Australia's most beloved and important healthcare institutions.",
    hero: "/impact/sydney-childrens-hospital.webp",
    tone: "cream",
  },
  {
    slug: "green-our-planet",
    name: "Green Our Planet (USA)",
    subtitle: "Brand, Design and Digital Platforms for a US Environmental Education Movement",
    category: "climate",
    challenge:
      "Green Our Planet is a US-based organisation bringing gardens and environmental education to schools and communities. They needed a brand, design language, and digital platforms capable of scaling their mission across the United States.",
    solution:
      "Rennie Lab delivered brand identity, design, digital platform development, and UX across Green Our Planet's core digital presence. The work gave the organisation the tools to communicate its mission clearly, engage schools and communities, and build the credibility needed to attract funding and partnerships.",
    impact:
      "Green Our Planet now operates with a brand and digital infrastructure that supports their national expansion, connecting schools and communities across the US with environmental education programs.",
    hero: "/impact/green-our-planet.jpg",
    tone: "moss",
  },
  {
    slug: "gro-usa",
    name: "GRO (USA)",
    subtitle: "Brand, Design and Digital Platforms for Environmental Community Building",
    category: "climate",
    challenge:
      "GRO needed a brand identity and digital platform to establish its presence and communicate its environmental mission to communities, partners, and funders across the United States.",
    solution:
      "Rennie Lab delivered a comprehensive brand, design, and digital platform engagement for GRO, creating the visual identity and digital infrastructure needed to grow a community-driven environmental organisation.",
    impact:
      "GRO launched with a clear brand and digital presence capable of supporting community engagement and organisational growth in the US environmental sector.",
    hero: "/impact/gro-usa.jpg",
    tone: "sand",
  },
  {
    slug: "beard-season",
    name: "Beard Season",
    subtitle: "Early Brand, Strategy and Digital for a Melanoma Awareness Movement",
    category: "community",
    challenge:
      "Beard Season was in its early stages, a powerful idea built around growing a beard to start conversations about melanoma and skin checks. The challenge was to give the movement a brand, strategy, and digital presence that could match the energy of its founders and help it scale.",
    solution:
      "Rennie Lab provided early stage brand strategy, visual identity development, and digital platform design and development. The work helped Beard Season find its voice and build the foundations for a movement that would eventually reach a global audience.",
    impact:
      "Beard Season grew into one of Australia's most recognised skin cancer awareness movements, credited with saving lives by encouraging regular skin checks. The early brand and digital work helped establish the credibility and community that made that growth possible.",
    hero: "/impact/beard-season.jpg",
    tone: "rust",
  },
  {
    slug: "skin-check-champions",
    name: "Skin Check Champions",
    subtitle: "UX Design, Strategy and Brand for Australia's Skin Cancer Prevention Platform",
    category: "community",
    challenge:
      "Skin Check Champions needed a UX strategy, brand identity, and advisory support to build a platform capable of encouraging Australians to get regular skin checks. Skin cancer is Australia's most common cancer, and the platform needed to make action feel accessible and urgent.",
    solution:
      "Rennie Lab provided UX design, strategic advisory, and brand development for Skin Check Champions. The work focused on reducing friction in the user journey and building a brand that felt credible, warm, and motivating for everyday Australians.",
    impact:
      "Skin Check Champions launched with a platform and brand designed to drive real behaviour change, contributing to Australia's broader effort to reduce skin cancer mortality through early detection.",
    hero: "/impact/skin-check-champions.jpeg",
    tone: "red",
  },
  {
    slug: "in-pieces-impact",
    name: "In Pieces",
    subtitle: "Brand, Strategy, UX and Website for a Conservation Design Project",
    category: "climate",
    challenge:
      "In Pieces is a celebrated interactive conservation project highlighting endangered species through CSS-based design. The project needed brand strategy, UX design, and a website capable of doing justice to its extraordinary creative and ecological ambition.",
    solution:
      "Rennie Lab delivered strategy, brand design, UX design, and website design for inpieces.com. The work balanced aesthetic excellence with accessibility, ensuring the project's powerful conservation message reached the widest possible audience.",
    impact:
      "In Pieces gained a brand and digital presence that matched the quality and ambition of the project itself, helping it reach a global audience and raise awareness for endangered species through the power of design.",
    hero: "/projects/in-pieces.jpg",
    tone: "moss",
  },
  {
    slug: "chumpy-pullin-foundation",
    name: "Chumpy Pullin Foundation",
    subtitle: "Brand, Strategy, UX and Digital Development for an Australian Sporting Legacy",
    category: "movement",
    challenge:
      "The Chumpy Pullin Foundation was established to honour the legacy of Australian snowboard champion and Olympic gold medallist Chumpy Pullin, who passed away in 2020. The Foundation needed a brand, strategy, and digital platform that could carry the weight of his legacy while building something forward-looking for the community he loved.",
    solution:
      "Rennie Lab delivered brand design, strategic advisory, UX design, and full digital development for the Foundation. The work was done with deep care for Chumpy's story, his family, and the snowboarding and broader sporting community. Every design decision was made in service of honouring his spirit.",
    impact:
      "The Chumpy Pullin Foundation launched with a brand and platform worthy of one of Australia's most beloved athletes, giving his legacy a home and a vehicle for the community work that continues in his name.",
    hero: "/impact/chumpy-pullin-foundation.webp",
    tone: "ocean",
  },
  {
    slug: "winner-foundation",
    name: "Winner Foundation",
    subtitle: "Brand, Strategy and Digital Development for a Life-Saving Health Movement",
    category: "community",
    challenge:
      "The Winner Foundation needed a brand identity, strategic foundation, and digital platform to establish its presence and communicate its mission around health and community impact in Australia.",
    solution:
      "Rennie Lab delivered brand design, advisory, strategy, and digital development for the Winner Foundation, creating the identity and infrastructure needed to launch and grow the organisation's programs.",
    impact:
      "The Winner Foundation launched with a clear brand and digital presence capable of supporting its community health mission and attracting the partners and funding needed to scale its impact.",
    hero: "/impact/winner-foundation.jpg",
    tone: "red",
  },
  {
    slug: "pulse-cpr",
    name: "Pulse CPR App",
    subtitle: "Designing an App to Save One Million Australians",
    category: "community",
    challenge:
      "Cardiac arrest kills tens of thousands of Australians every year. Most people who witness a cardiac arrest don't act because they don't know how or lack the confidence to perform CPR. The Winner Foundation's Pulse CPR app was built to change that, and it needed UX design that could work in the most stressful moments of a person's life.",
    solution:
      "Rennie Lab designed the Pulse CPR app for the Winner Foundation, building a UX experience specifically engineered for high-stress, real-time use. Clear, calm, and instantly navigable, the app was designed to give bystanders the confidence to act when every second counts.",
    impact:
      "The Pulse CPR app was built with a single stated mission: to save one million Australians. The design work gave that mission a tool worthy of its ambition.",
    hero: "/impact/pulse-cpr.jpg",
    tone: "red",
  },
  {
    slug: "blake-johnston",
    name: "Blake Johnston · World Record Surfing",
    subtitle: "Strategy, Brand, Fundraising and Activations for a World Record Attempt",
    category: "movement",
    challenge:
      "Blake Johnston set out to break the world record for the longest surf session, raising funds and awareness for men's mental health along the way. The project needed strategy, brand identity, a digital presence, and a fundraising engine capable of reaching a $500,000 target.",
    solution:
      "Rennie Lab provided strategy, advisory, branding, website design and development, fundraising infrastructure, and event activations across the entire campaign. The work turned a remarkable personal feat into a movement with commercial and community impact.",
    impact:
      "Blake Johnston broke the world record and the campaign raised $500,000 for men's mental health. The brand and digital work gave the story the platform it deserved, reaching a national audience and cementing the project as one of Australia's great sporting and charitable achievements.",
    hero: "/impact/blake-johnston.webp",
    tone: "ocean",
  },
  {
    slug: "packer-family-foundation",
    name: "Packer Family Foundation",
    subtitle: "Digital Museum, Brand Strategy and Event Activations",
    category: "community",
    challenge:
      "The Packer Family Foundation needed a digital museum to document and celebrate their philanthropic legacy, alongside brand strategy and event activations that could bring that story to life for audiences across Australia.",
    solution:
      "Rennie Lab delivered a comprehensive engagement spanning digital museum design and development, brand strategy, platform design and development, and event activations. The work required a careful balance of institutional gravitas and human warmth, honouring the Foundation's history while making it accessible and relevant.",
    impact:
      "The Packer Family Foundation gained a digital and brand presence that properly documents and celebrates one of Australia's most significant philanthropic legacies, ensuring the work of the Foundation is understood and remembered.",
    hero: "/projects/packer.jpg",
    tone: "cream",
  },
  {
    slug: "design-declares-australia",
    name: "Design Declares Australia",
    subtitle: "Founding, Launching and Building Australia's Climate Design Movement",
    category: "climate",
    challenge:
      "Design Declares is a global movement calling on designers to declare a climate and ecological emergency. Launching the Australian chapter required building a platform, strategy, and community from the ground up, in partnership with the UK founders of the movement, while establishing D! Australia as a genuinely independent and locally relevant force.",
    solution:
      "Rennie Lab co-founded, designed, and developed the Design Declares Australia platform and led the strategic and advisory work that has grown the movement to over 1,200 members. The work was done in close partnership with D! UK and has helped establish Australia as one of the leading national chapters of the global movement.",
    impact:
      "Design Declares Australia is now one of the country's most significant climate and design organisations, with over 1,200 members, a national events program, government engagement, and a growing influence on how the Australian design industry thinks about its responsibility to the planet.",
    hero: "/impact/design-declares-australia.jpg",
    tone: "ink",
  },
  {
    slug: "farmers-footprint",
    name: "Farmers Footprint",
    subtitle: "UX Design, Development and Strategy for Regenerative Agriculture",
    category: "climate",
    challenge:
      "Farmers Footprint is a US-based movement documenting the transition from chemical to regenerative agriculture. They needed UX design, development, and strategic support to build platforms capable of sharing their story and growing their community of farmers, advocates, and supporters.",
    solution:
      "Rennie Lab delivered UX design, development, and strategy for Farmers Footprint, building digital tools that communicated the regenerative agriculture message with clarity and emotional resonance. The work supported both the organisation's storytelling mission and its operational needs.",
    impact:
      "Farmers Footprint gained digital platforms and UX that helped bring the regenerative agriculture story to a wider global audience, supporting the movement's mission to transition farming away from chemical dependency.",
    hero: "/impact/farmers-footprint.jpg",
    tone: "sand",
  },
  {
    slug: "invisible-ingredient",
    name: "The Invisible Ingredient",
    subtitle: "Design, Development, Podcast and Strategy for a Glyphosate Documentary Project",
    category: "climate",
    challenge:
      "The Invisible Ingredient is a Farmers Footprint project examining the widespread use of glyphosate in the food system. The project needed design, development, podcast strategy and production support, and advisory to give this critical story the platform and audience it deserved.",
    solution:
      "Rennie Lab delivered design and development for the Invisible Ingredient platform, alongside podcast design, strategy, and advisory. The work was built to make a complex and contested scientific and agricultural topic accessible, engaging, and shareable for a broad audience.",
    impact:
      "The Invisible Ingredient launched as a compelling and well-designed platform for one of the most important conversations in food and agriculture, helping Farmers Footprint bring the glyphosate story to audiences beyond the farming community.",
    hero: "/impact/invisible-ingredient.jpg",
    tone: "rust",
  },
  {
    slug: "house-of-chumpy",
    name: "House of Chumpy",
    subtitle: "Environment Design, Placemaking and Wayfinding for Youth and Community",
    category: "community",
    challenge:
      "House of Chumpy is a space for young, marginalised community members and athletes to learn, develop, and grow. The physical environment needed to reflect the values of the space, feel welcoming and inspiring for young people, and honour the legacy of Chumpy Pullin through thoughtful design.",
    solution:
      "Rennie Lab delivered environment design, placemaking, wayfinding, and spatial design to bring the House of Chumpy to life. The work spanned every touchpoint of the physical experience, from how people move through the space to how the walls and surfaces speak to the community it serves.",
    impact:
      "House of Chumpy opened as a space that genuinely reflects its mission, giving young and marginalised community members an environment designed with care, intention, and deep respect for the person whose name it carries.",
    hero: "/impact/house-of-chumpy.webp",
    tone: "ocean",
  },
  {
    slug: "b-corp-certification",
    name: "B Corp Certification",
    subtitle: "Leading as a Certified B Corp Across Two Chapters of the Business",
    category: "climate",
    challenge:
      "B Corp certification represents the highest standard of verified social and environmental performance, accountability, and transparency. Achieving and maintaining certification requires embedding purpose into every layer of a business, from governance to supply chain to community impact.",
    solution:
      "Reny Studio held B Corp certification from 2008 to 2009, among the earliest design agencies in Australia to do so, and again from 2023 to 2025. In 2025 the decision was made to step back from certification and redirect that investment of time, energy, and resources into building Design Declares Australia and developing our own direct impact programs. We chose to put the B Corp spend into D! and into our own work rather than into a certification process.",
    impact:
      "Two chapters of B Corp certification helped establish Reny Studio and Rennie Lab as purpose-led organisations at a time when that was genuinely rare in Australian design. The decision to exit certification in favour of deeper investment in Design Declares Australia reflects a belief that direct action now outweighs the value of the badge.",
    hero: "/impact/b-corp-certification.jpg",
    tone: "moss",
  },
];
