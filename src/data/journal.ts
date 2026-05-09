import type { JournalPost } from "./types";

const REMOVED_TITLES = new Set<string>([
  "Serialisation Chapter 4: The Digital Drift",
  "Serialisation Chapter 3: The Places That Shaped Us",
  "Serialisation Chapter 2: Bored to Death!",
  "Serialisation Chapter 1: The Body Knew First",
  "Be Kind, Rewind Serialisation: The Introduction",
  "Make Culture Creative Again",
  "The Invisible Ingredient",
  "Time After Time After Time, After!",
  "7 Websites Dedicated to Saving the World",
]);

const RAW_POSTS: JournalPost[] = [
  {
    slug: "rl-designing-for-permanence",
    title: "Designing for permanence in a transient economy",
    publishedAt: "2026-05-09T10:00:00.000Z",
    source: "rennie-lab",
    sourceUrl: "/journal/rl-designing-for-permanence",
    tags: ["Rennie Lab", "Journal"],
    excerpt: "On building brands and products that earn the right to last, and what that asks of a studio practice.",
    body: `The economy we are working in has the attention span of a startup pitch deck. Products are launched in a quarter, refreshed in a year, and forgotten by the time the next one ships. Brands chase a fortnightly trend cycle. Websites are built to be replaced, not maintained. The whole apparatus has been optimised for speed, novelty, and the next round.

We are not interested in that economy.

What we are trying to design for is permanence. Not the false permanence of monuments and mission statements that get walked back the moment the market shifts. The permanence of work that earns the right to last because it was built on the right thing in the first place.

The Indigenous peoples of this continent have practised seven-generation thinking for sixty thousand years. The idea is simple. The decisions you make today should still hold up for the people seven generations from now. Most of what we touch in studio life could not survive a single board reshuffle, let alone two centuries. We are trying to learn.

A few things this asks of a studio practice.

First, it asks us to slow down. We take fewer projects. We work in partner-led teams that stay with the work end to end. The studio is sized so nothing gets handed off to someone who was not in the room when the question was first asked. Slow is not a luxury. It is the only way to make something that does not need replacing in eighteen months.

Second, it asks us to design for the second decade of a brand, not the launch week. Most identity systems are built to look great on a press release and start to crack the moment they touch a real product, an internal team, a partner ecosystem. We design systems that get easier to use as the brand grows, not harder. We hand over things that in-house teams can take further without coming back to us for permission.

Third, it asks us to count what most studios do not. Carbon, hosting, materials, travel, attention. The leaf in the corner of this site is the visible part of a much longer ledger. We measure pages in grams. We design with the planet in the room from the first sketch. A brand that is built to last in any honest sense has to be built on a planet that can sustain the lasting.

Fourth, it asks us to stay. We come back at eighteen months. We do a second pass on the work, the metrics, the team, and the climate the work is now living in. Most agencies disappear at handover. The work does not end at handover. The work begins there.

Permanence in a transient economy is not nostalgia. It is a way of treating attention, money, materials and time as if they actually matter.

Because they do, and because the next seven generations are paying for the ones who pretend otherwise.

That is the practice we are trying to build.`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "impact",
    tone: "moss",
    image: "/journal/orbital-design.png",
  },
  {
    slug: "rl-expertise-studio-and-ai",
    title: "The expertise studio and the AI question",
    publishedAt: "2026-05-08T10:00:00.000Z",
    source: "rennie-lab",
    sourceUrl: "/journal/rl-expertise-studio-and-ai",
    tags: ["Rennie Lab", "Journal"],
    excerpt: "What changes, what does not, and where senior judgment still earns its keep.",
    body: `In Managing the Professional Service Firm, David Maister sorts professional firms into three types based on what their clients are actually buying.

Efficiency firms compete on price and process. They have productised a known solution, so the work is more or less the same every time, and the win comes from doing it faster than the competition.

Experience firms charge more because they have seen the problem before. Clients pay for the muscle memory that comes from having solved this exact thing fifty times.

Expertise firms are different. Clients come to them because the problem is hard, the answer is not obvious, and they need someone who can think through it from first principles in real time, alongside them.

Rennie Lab has always sat in the third category. Sixteen years of work with founders, leadership teams, governments and movements, and the throughline has been the same. Clients hire us when the brief is unclear, the stakes are high, and a faster, cheaper answer is the wrong answer. That is what we sell. It is not something you can outsource to a chatbot.

For our designers and strategists, that has meant fluency across more than one specialism. Brand thinking that translates into product thinking. Research that informs strategy without being filed away. Code shipped with carbon and accessibility considered from the first sketch.

AI enters the picture

The last two years have been loud. LinkedIn has become a graveyard of premature obituaries for entire disciplines, and a strange number of senior creatives are now spending their days promoting the very tools designed to replace them.

The noise is overstated. The shift is not.

Studios built around repeating the same process are at real risk. So are designers who have leaned on templates, mood boards, and a tasteful imitation of the work already winning awards. The efficiency lane has been quietly priced down to nothing, and the experience lane is heading the same way.

The expertise lane looks different. The knowledge required to range across disciplines was always there. The constraint was always time. AI tooling changes the maths on what one senior person can credibly take on inside a single engagement. Research synthesis that used to take a fortnight now takes an afternoon. A copy pass that used to require a writer for a week now requires a writer for a day. Code that used to need three developers now needs two and a careful set of eyes.

What does not change

Design judgment. Strategic instinct. The ability to read what a client is actually asking for, behind what they have written into the brief. The thing that makes the Orbital Process work is not the deliverables. It is the forty hours of conversation before the studio writes a word. None of that is automating itself.

What changes is what we can take on inside one engagement. What changes is the speed at which we can move from research to a position. What changes is how much of the work can be carbon-light by default, because the tooling can now do the boring parts of the optimisation work without a junior developer staying late.

We are rolling AI-augmented capability into engagements over the next two quarters. Carefully. Because we have seen what happens when AI is pointed at a brief without an expert behind the wheel. The output is generic, confidently wrong, and indistinguishable from a hundred other studios doing the same thing. With context, judgment, and a senior partner driving, the same tooling produces work that is sharper and faster than anything we could have shipped two years ago.

More on the specifics soon.`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "design",
    tone: "ink",
    image: "/journal/clae-design-studio.webp",
  },
  {
    slug: "rl-how-to-know-better",
    title: "How to know better",
    publishedAt: "2026-05-07T10:00:00.000Z",
    source: "rennie-lab",
    sourceUrl: "/journal/rl-how-to-know-better",
    tags: ["Rennie Lab", "Journal"],
    excerpt: "The five phases of the Orbital Design Process, and why we trust loops over lines.",
    body: `Every client conversation starts the same way. They tell us what they need. Sometimes that is a new website. Sometimes it is a rebrand. Sometimes it is a programme of work for a coalition of councils trying to cool an inner-city heat island. The need is real and the timeline is rarely generous.

The honest reply is always the same. We do not know yet.

We do not know yet what the work needs to be. We do not know yet what the question really is. We do not know yet whether what they have asked for is what they actually need. The most useful thing we can do is to sit in that not-knowing with the client for as long as it takes to get to a better answer.

Most studios skip this part. The brief lands, the deliverables get scoped, and the work begins. The output is on time and on budget and looks right at launch. Eighteen months later, the in-house team is rebuilding most of it because the brief was answering the wrong question.

We do not know yet. That is the honest place to start. Knowing better is the place we are trying to get to.

The Orbital Process is how we avoid that. Five phases, in a loop, not a line.

Gravity

Every engagement begins with the pull. The question, the tension, or the truth the brief is really circling. Forty hours of conversation, on average, before we write a word. We are not stalling. We are looking for the thing the brief is too polite to say out loud.

Orbit

Three loops, each tighter than the last. Research. Strategy. Expression. The work passes through every discipline before it lands, so the answer carries the weight of the whole team. The first loop tends to be wide and a bit loose. By the third, the work knows what it wants to be.

Atmosphere

The conditions the work has to live in. Codes, materials, behaviours, partners and the public-facing weather. We design the system before the surface. A beautiful brand inside a hostile rollout environment will lose every time. Most launches that fail, fail here.

Re-entry

Launch is the moment the brand meets the world. We stay in the room for the first burn. Rollout, training, governance, the first time the in-house team has to defend the work to a sceptical board. The deliverable is not the file. The deliverable is the first six weeks of a working system.

Return

Eighteen months in, we come back. A second pass on the work, the metrics and the team. The world has shifted. The audience has shifted. The work has to shift, or it stops being useful. The orbit completes, and the next one begins from a wiser place.

Why a loop

Brands and products are not built once. They are tended. Anyone who has ever planted a tree knows this. The first decade is the hardest. The second is when it starts to do the work it was planted for.

We do not know yet. That is the honest place to start. Knowing better is the place we are trying to get to, with the client, every time.`,
    bodyAvailable: "full",
    type: "field-guide",
    category: "design",
    tone: "ocean",
    image: "/journal/orbital-design.png",
  },
  {
    slug: "rl-cost-of-a-website",
    title: "What actually determines the cost of a website",
    publishedAt: "2026-05-06T10:00:00.000Z",
    source: "rennie-lab",
    sourceUrl: "/journal/rl-cost-of-a-website",
    tags: ["Rennie Lab", "Journal"],
    excerpt: "Five factors that explain why one quote is eight thousand, and another is a quarter of a million.",
    body: `You are choosing a studio for your next site. The quotes you have back are wildly different. One outfit will do it for $8K. Another quoted $250K. A friend of a friend offered to do it on the weekend for a slab of beer. They are all building, in some technical sense, the same thing. So why is the spread so absurd?

The spread is not the spread. The spread tells you you are pricing five different products that all happen to be called a website.

There are five things that determine what a serious site actually costs. Knowing which of them you care about is most of the job.

1.  Ambition

A landing page with three sections is a different product from a publishing platform with a content engine, integrations, and a design system that has to outlive its first creative director. The ambition decides almost everything else. Before you ask for a quote, decide how much of the company's story this thing has to carry. If it is the front door of the business and you want it to win awards, you are at one end of the spectrum. If it is a holding page until the real one is ready, you are at the other.

2.  Return

A website is a business decision. The honest question is what return it has to produce, and over what period. A site that has to convert a fifty-thousand-dollar enterprise sale will look and read very differently from a site selling thirty-five-dollar t-shirts. The bigger the return, the more sense it makes to invest in the elements that drive it. Strategy. Custom design. Performance. Real writing instead of generic copy.

3.  The team

Everyone in the industry has access to roughly the same tools. The difference is who is at the keyboard. A senior partner who has spent fifteen years building publishing systems will think about your site differently from a freelancer fresh out of a bootcamp. Both can be the right call, depending on the ambition. Just know which you are buying. Most studios that sell themselves as senior actually deliver junior work, because the senior person is on six other projects. Ask who is doing the work, every day, and how often they are in the room.

4.  The service around it

A site is not just the file that ships. It is the discovery, the strategy, the user research, the project management, the editorial pass, the rollout support, the training, the documentation, and the relationship that exists when something breaks at 11pm three months after launch. Cheap quotes usually omit most of this. The work of building the website is maybe sixty percent of the total cost of having a website. The rest is the practice around it.

5.  The carbon and longevity cost

Most studios do not put this on the invoice, so most clients do not pay for it. We do, because we think you should know. A bloated site with eight tracking scripts, ten-megabyte hero videos and a CMS the in-house team cannot maintain has a real cost. Carbon, money, attention, and the cost of replacing it in two years when it stops working. We design for ten years, not two. That costs a little more upfront and saves a great deal later. Ask any studio you are talking to what their average page weight is, what their carbon footprint per visit is, and what their site looks like two years after launch. Most cannot answer. The answer matters.

The spread, explained

If you are clear on those five, the spread in the quotes will start to make sense. The quotes are not unreasonable. The studios are quoting different products. Your job is to know which product you actually want.`,
    bodyAvailable: "full",
    type: "field-guide",
    category: "design",
    tone: "rust",
    image: "/journal/atmospheric-1.jpeg",
  },
  {
    slug: "rl-thinking-about-hiring-us",
    title: "Thinking about hiring us",
    publishedAt: "2026-05-05T10:00:00.000Z",
    source: "rennie-lab",
    sourceUrl: "/journal/rl-thinking-about-hiring-us",
    tags: ["Rennie Lab", "Journal"],
    excerpt: "How we approach proposals, pitches, and the first conversation.",
    body: `If you are thinking about hiring Rennie Lab, this is what to expect when you reach out.

We will reply within two business days.

Usually faster. There is no sales team between you and the partners. The first email lands with one of us.

The first conversation is thirty minutes. No charge, no strings.

On or off the record. We listen. You tell us what you are trying to move. We will tell you whether we are the right studio for it, and if we are not, we will tell you who we think is.

Our proposal is short.

Most studios send fifty-page documents stuffed with stock photography and a strategic framework presented as if it were carved in stone. Ours is twelve to fifteen pages. It says who from the studio will be on the work, what the engagement looks like, what we charge, and what we expect from you. It does not pretend to have solved your problem. We have not done the work yet.

We do not pitch.

Specifically, we do not respond to RFPs that ask us to develop strategy, design directions or creative work as part of the selection process. We have done it. It does not produce better outcomes for the client and it produces a lot of unpaid work for the studio. The selection process should tell you whether the people in the room are the right people for the work. The work begins after the contract is signed.

We have three reasons.

The first is economic.

Strategy and creative thinking are what we sell. If we give them away during the selection process, we are devaluing the thing the next paying client is buying. That is unfair to the next client. It is also unfair to the studios competing for the same brief who do charge for their thinking, because it sets the market rate at zero.

The second is practical.

A pitch deck made in two weeks without access to your data, your team, your customers, your suppliers or your internal politics is a guess. A confident, attractive guess. We have made a lot of them, and they do not survive contact with reality. The recommendation we would make six weeks into a real engagement bears almost no resemblance to the recommendation we would make in a pitch. The pitch deck would set false expectations and we would spend the first month of the engagement walking them back. Better to start clean.

The third is the work.

We are committed to forty percent of our capacity for climate, community and movement work, mostly pro-bono and at-cost. Time spent making pitch decks for commercial briefs we have not won is time not spent on a coastal carbon programme, a coalition of councils trying to cool a heat island, or a community organisation building its first national identity. The opportunity cost is real and we are not willing to pay it.

What we will do, gladly

Meet with you for as long as it takes for both of us to know if this is a fit. We will introduce you to the partners and the team who would be on your work. We will walk you through engagements that look like yours. We will share our process, our prices, and the names of clients we have worked with who will tell you the truth about what we are like to work with. We will ask you sharper questions than you are used to.

If after that we both think this is the right partnership, we will send a contract. If not, we will part company on good terms and probably introduce you to a studio we think is a better fit.

This is not a performance. It is a partnership. We would rather start it that way.`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "design",
    tone: "sand",
    image: "/journal/ben-rennie-portrait.webp",
  },
  {
    slug: "sub-higher-ground",
    title: "Higher Ground",
    publishedAt: "2026-05-07",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/higher-ground",
    tags: [],
    excerpt: "Creativity is older than the industry that claims it, and more yours than you have been told.",
    body: `There is a 40-metre waterfall north of Cape Tribulation called Bloomfield Falls. The Kuku Yalanji people call the country Wujal Wujal (Many falls). I stood at its base last week with my daughters, Miff and Pip, and listened to Traditional Owner and Elder, Aunty Kathleen Walker, share her story of Wujal Wujal and her people.

Aunty Kathleen reminded me of my mum when I was small. The same way of watching over you, the same instinct to give you fair warning before you walked into something you couldn’t see coming. My mum did it for our family. Aunty Kathleen does it for country, pointing at the trees and the river and the mountain, the way my mum used to point at the world for me when I was a boy.

She told us how the country feeds itself. The clouds gather over the mountain, the rains come, the rains feed the river, the river feeds the country, and the country feeds the people. Sixty thousand years of the same conversation, repeated every wet season, in language that does not need a slide deck.

- -

Jimmy Halfcut and me

Then, in December 2023, a different cloud came over the mountain.

Aunty Kathleen pointed at it as she told the story. A black cloud, she said, that brought angry rain. They thought it was the season being heavy because they had never seen this kind of danger before. The hawk was circling and giving a warning, but the warning was for something the country did not yet have a language for.

The river burst its banks. Cyclone Jasper, the most destructive storm the Daintree had ever seen, took people from their homes and places from the map. People were stranded on rooftops and evacuated by helicopter. The water rose to a height nobody had recorded in living memory.

The wounds are still evident when you walk through Wujal Wujal today. The town is still rebuilding.

Now, Aunty Kathleen says, when the black cloud comes over the hill, we take higher ground.

“Because the country is angry”, she said.

What Aunty Katheleen is doing, when she tells you that, is the same thing a climate scientist does when they read a satellite image. She is reading the data she has access to, drawn from a record longer than any university has ever held. Sixty thousand years of observation deserve a better word than folklore. It is the longest continuous environmental dataset on this continent, kept on country, in story, by people whose entire knowledge system was built to notice change at this scale. The science we are now scrambling to publish in journals is, in many cases, catching up to what was already known.

I was there last week with Halfcut, the Australian charity buying back rainforest acre by acre and returning it to Kuku Yalanji country. They have already protected over 50 hectares of one of the oldest living ecosystems on Earth, without designing a single thing. They have done so by paying for what was taken and returning it.

I kept thinking about the conference rooms I had found myself in over the past 20 years, discussing this Country.

For most of my career, I have watched the global design industry sell innovation. Sticky notes on glass walls, five-day sprints, frameworks named after diamonds and circles, confident creatives in expensive sneakers explaining to a room of executives that creativity is a process you can install. I have been the man in the sneakers, and I know how the slide deck ends.

And the entire time, sitting just north of where most of those decks are written, is a 180 million-year-old design system that has been running uninterrupted, quietly noticing everything, and now warning us through Aunty Kathleen, through the hawk, through the black cloud over the hill, that the weather is changing.

Here is what I have been turning over since I came home.

The design industry I have worked in for twenty years was built on a particular story about creativity. The story goes that creativity is a problem-solving tool, something you apply to a brief, something that produces an outcome a client can sign off on. We have spent decades industrialising it, writing books about it, developing methodologies for it, and selling it to corporations as a productivity asset. It has made many of us comfortable lives.

But that story is too small.

What Aunty Kathleen was sharing with us in Wujal Wujal is creativity. It is the original version of creativity, the long act of attention paid to a place by people who built their entire knowledge system around the question of what country needs in order to keep being country. That is design at its most serious, creative practice at the largest scale humans have ever attempted, and it has been working without interruption for longer than every civilisation on earth has existed.

When I look at it that way, modern design thinking starts to feel less like an advance and more like an abridgement.

Seven-generation thinking is the phrase often used to describe this older creative discipline. It gets sold on keynote stages as a planning horizon, which sells it short. The real practice is a relationship. The basic idea is that any decision you make today should be weighed against the well-being of your seventh great-grandchild, and against the wisdom of your seventh great-grandparent. It is a creative discipline that holds you accountable in two directions at once, backwards and forwards through time, with country and ancestors as your collaborators.

- -

While we were up there, Trinity, a local Kuku Yalanji woman, was speaking with us on country when the rain started early. She paused, stepped away, and spoke quietly to the place around us, asking for the rain to hold off until we had finished talking. The rain stopped. When we sat down again, I asked her who she had been speaking to. She told me her ancestors, her aunties and uncles, were the earth, the land, the plants, the trees, and the ground itself. When a Kuku Yalanji person is buried on country, they become country. So when Trinity speaks to country, she is talking to family.

This is the same logic underneath a smoking ceremony. The plants are burned, you are being introduced to country through the kin who have become it. The welcome is literal, a handshake with a place that has memory. Smoking ceremonies serve several purposes, including cleansing of bad spirits, healing, welcoming visitors, and connecting with country by speaking to and acknowledging the ancestors.

Once you understand this, seven generations move from a concept to a relationship. The ancestors you are accountable to are present in the ground beneath your feet, in the trees you walk under, in the rain that does or does not arrive. The grandchildren you are designing for are already on the way to becoming country themselves. When we sit with that for a minute, most modern briefs about quarterly growth and product-market fit feel exactly as small as they are. Sure, important, but small.

I am not arguing that designing a smartphone is the same thing as caring for country. The two operate on different scales and serve different masters, with quarters on one side and millennia on the other. But the underlying lesson is the same. Anything we put into the world has the chance to outlive us, and we should design as if it would. Most of what we make today will not. Some of it ends up in the ocean, most of it ends up in landfill, and almost none of it ends up as something a child two hundred years from now will thank us for.

- -

The lesson from Wujal Wujal is that thinking can scale. That we can apply seven-generation logic to a product, a policy, a campaign, a contract, or a brand (Circularity is critical here when things simply can’t last, can they be reborn?). The questions don’t change, only the patience required to ask them properly.

Run any modern brief through that filter, and most of them collapse on contact. Single-use packaging collapses, quarterly thinking collapses, and a surprising amount of what the industry calls innovation collapses. What survives is the work that was always going to matter, the work that contributes to a future somebody will actually want to live in.

This is the part I want you to hear, because I think the industry has hidden it from you.

You already have access to this kind of thinking, and you don’t need a workshop, a framework, or a five-step process to find your way to it. You don’t have to be Indigenous to practise it, though you should be honest about where it comes from. What you need is the willingness to ask a different question. The brief becomes a smaller question inside a bigger one: what does this place need from me, and what would my great-grandchildren say about the answer?

That second question is harder. It is also the question that produces work nobody has to apologise for in twenty years.

I don’t know what you make for a living. Whatever it is, it is creative work and a chance to listen better.

Products, policy, decisions about what gets bought and what gets thrown away in your house, all of it counts.

For my own part, coming back from country with Halfcut and my girls, I am going back to the drawing board. I am going to rewrite my values, take real time to understand country and the language that shaped this place before any of us got here, and continue my creative research on a deeper level. That research is about how creativity was industrialised in the first place, and how institutions, agencies, schools, and markets quietly took something that belonged to all of us and rebranded it as the talent of a few.

The work is about returning it. About restoring the belief that the systems you are working in, living in, breathing in, are yours to shape, and that creative agency was never the property of the industry that claimed it.

There is a good chance I may never get to meet Aunty Kathleen again. If I do, I will tell her how her story shaped me and what I learned from her in 30 minutes that no innovation lab or design school has ever come close to teaching me. I will thank her for her wisdom. Her words changed me, and that is worth honouring.

In the meantime, Aunty Kathleen will keep doing what her people have been doing for 60,000 years: watching the sky, telling the story, pointing at the trees. The hawk will keep circling. The black clouds will keep coming, more often now, with less warning each time. The country will keep speaking in the only language it has.

Our job is to learn how to hear it.

The most important creative practice of our time is not innovation, disruption, or the next sprint. It is the older and harder discipline of paying attention to a place long enough to deserve it.

We can start tomorrow.

- -

Dad & Pip`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "climate",
    tone: "ocean",
  },
  {
    slug: "sub-serialisation-chapter-4-the-digital",
    title: "Serialisation Chapter 4: The Digital Drift",
    publishedAt: "2026-04-11",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/serialisation-chapter-4-the-digital",
    tags: [],
    excerpt: "“Easy in, impossible out.”",
    body: `This chapter is part of my new book, Be Kind Rewind, which I’m releasing chapter by chapter to paid subscribers here on Substack. If you’re new here, and there are hundreds of you this week, thank you. You can go back to the introduction and start from the beginning. Or you can start right here on Chapter 4, because that’s a perfectly reasonable way to read a book.

Either way, I’m grateful for the support. It means so much to share this with you.

Enjoy.
Ben

Introduction: Be Kind Rewind Introduction
Chapter One: What the Body Knew First
Chapter Two: Bored to Death!
Chapter Three: The Places That Shaped Us

Wednesdays by Ben Rennie is a reader-supported publication.

---

Part 2, Chapter 4, The Digital Drift, starts now…

---

It is June 1, 2004, and I am standing on the roof of a hotel on Lexington Avenue at five in the morning, holding my ten-month-old daughter Miffy, who has decided that New York City is no place for sleep.

She is wide awake. Jet lag has abolished any sense of night for her, and therefore for us. Nicola and I have been taking turns, and this one is mine. I decided to carry her up to the hotel roof while the city was still dark, to watch Manhattan do what Manhattan does before the rest of the world catches up.

Looking back on all the excitement of that trip to New York twenty-two years ago, the thing I remember most clearly is the company.

We were not the only ones up on the rooftop. Other parents from different floors and different countries had reached the same conclusion by the same exhausted logic. By the second morning, we were exchanging the kind of exhausted nods that silently communicated our shared reality: these little shits are keeping us all awake. By the third morning, the nods turned into shared war stories. By the end of the week, we were saving spots at the railing, sharing coffee, and swapping the particular brand of dark humour that only people running on zero sleep fully understand. From memory, I was the only man on the balcony. I don’t remember the names of the mums I hung with, yet I still remember their stories twenty years later.

- -

My Nokia 1100 was useless in New York. Our Australian plan didn’t work in the US, so for 7 days, no one could reach us. No calls, no messages. Nothing found its way through from the other side of the world. We were alone in the modern sense of the word. Unreachable.

Standing on that roof in the early June darkness, I felt a quality of presence I didn’t have a name for yet, because I hadn’t experienced its absence.

We were there for Nicola’s 30th birthday. New York in early summer felt like the right answer to the “what shall we do for your 30th” question. We had a ten-month-old bubba who treated sleep as a philosophical position, and no one on earth could get hold of us.

Looking back, it was the perfect holiday.

We caught the news on the hotel TV in between feeds and nappy changes, absorbing information the way you do when you have a baby: in bits and without much context. And David Bowie kept showing up.

That week, Bowie was everywhere in New York. He had just played two shows nearby: Jones Beach Theatre on June 4 and PNC Bank Arts Centre in New Jersey on June 5. These were the final North American dates of his longest tour, and the city still felt charged with his energy. I loved Bowie the way most people did, completely and for reasons I couldn’t really explain.

There were only three weeks left in Bowie’s Reality Tour before it would end on a stage in Germany, where he would collapse backstage after playing through a heart attack and never perform a headline show again.

On the day before we left, Miffy made her most significant contribution to the city.

We were in a cab somewhere in Midtown when she issued a warning just a fraction too late. What followed was the kind of incident that permanently resets the mood of any enclosed space, especially an NYC cab. The driver pulled over, turned, surveyed us with the calm of someone who’d seen Manhattan’s absolute worst, and said simply, “Out, please, out, out now, oouuuut.”

He didn’t charge us. He just sped off, leaving us standing on the sidewalk in absolute shock.

A New York bystander paused, assessed the scene, and, channelling a sports commentator, loudly announced, “Oh my god, that woman has thrown up all over her baby.”

Just to clarify, it was absolutely the other way around. But on a Manhattan curb, doused in baby sick, no one’s sticking around for your version of events. We pulled ourselves together, flagged another cab with the swagger of the utterly defeated, and retreated to the hotel.

The following morning, Nicola’s birthday, we checked out and went to JFK to catch our flight to London.

At the check-in desk, Miffy delivered an encore performance.

The scale of it was far more impressive than the previous day. The desk, the computer, the woman behind the counter, all of it. There was a pause in our check-in line that felt entirely cinematic.

Then the woman looked at Miffy, then at us, and did something I have never forgotten. She called a doctor, brought out cold towels and peppermint tea, and personally walked us to the first-class lounge to take care of her. She told us to rest and promised we would be the last family called to board. We sat in deep chairs with Miffy draped in a cold towel, pale and small and entirely unbothered by the chaos she had caused. We drank coffee and took a breath.

True to her word, the announcement was made personally over the loudspeaker. Could the Rennie family please make their way to the gate?

We gathered our things and walked down the gangway toward the plane, tired, grateful, and ready to see our family in London.

Boarding the flight, it was just another small group of three and us. I noticed them, but it was the voice I heard first. A British accent, warm and unhurried, directed down at Miffy as Nicola nursed her on her hip.

“Oh, darling. She’s not well, is she?”

Nicola looked up. “No, she’s had a terrible couple of days, actually. She threw up all over the check-in desk.”

“Oh, the poor thing. What’s her name?”

“Miffy.”

“Hello, Miffy. She is so gorgeous.”

I was deep in thought about the long flight ahead with a sick baby. Nicola and her new buddy chatted next to me. Half-listening, I noticed the man stroking Miff’s face. I saw his hand with the rings first. He had a cool voice and treated Miffy with such gentle kindness. That made me look up properly for the first time to say g’day and join in.

What came out of my mouth was not cool. It was far from composed, and a million miles from the measured response of a man who had spent a week absorbing the cultural richness of one of the world’s great cities. It was simply this:

“Fuck. David Bowie! Fuck. Bowie? Jeezus, Bowie!”

He looked at me, then looked at Nicola with considerably more warmth. He looked back at me, shook his head with a slightly disapproving nod, stroked Miffy’s head once more, and quietly said, “Get better, little darling.” He looked at Nicola, said, “Safe travels love” and turned left onto the flight. We turned right to the cattle class. Nicola, cool as fuck, hung with Bowie like old uni mates.  Me, on the other hand… well, not so great!

Yep, Miff and David Bowie are connected for life; she has been touched by my version of god, patted by one of the world’s greatest creative artists. And I, in a single moment of unregulated fuckwittedness, ruined it in one second.

Three weeks later, David Bowie walked offstage at a German festival, collapsed, and was flown to emergency surgery for a blocked artery. He performed through a heart attack twice that night. He never headlined a tour again. The man who stroked my daughter’s face at JFK was, unknowingly, in the final weeks of his major performance life. He was heading to Europe to finish his last big performance, and in the midst, stopped to greet a sick baby in a corridor. He was an absolute legend.

I have thought about that gangway a lot over the years. Not just about Bowie, though I think of him too, but about what made that moment possible. That morning, the physical world was all we had. No feed to check. No notification pulled my attention away. The phone in my pocket was a useless plastic rectangle. As a result, I was present (obviously not as present as Nicola). When David Bowie appeared, I felt the full force of his presence, even the part where I ruined the moment by swearing at him.

That is what presence gives us.

In December 2025, I was on a flight from Los Angeles to New York. Staring at my phone, doing nothing in particular, just the low-grade scroll that passes for rest on long flights. The woman next to me gave me a nudge and tilted her head toward the aisle.

I looked up. Alicia Keys walked past.

Here is the thing about that moment. New York Empire State of Mind is the song that made me believe I could one day work in that city. I used to dream about it from a distance, to actually build something there. I heard that song, and something shifted. Years later, I went, found clients and found work. That city became part of my life because a song told me it could.

And there I was, flying into New York with the woman who wrote it, and I was staring at a screen.

Thankfully, there was no dumbfuckery this time. Just a casual nod, to which she responded with a completely justified frown. Although in hindsight, nodding at a stranger on a plane is its own category of strange, so perhaps an ounce of dumb.

I sometimes wonder how many moments like that happen around us. How many extraordinary things occur just three feet away while we stare at glass rectangles? How many Bowies stroke our children’s faces while we manage inboxes? How often does the city try to hand us something, only for us to be too absorbed to notice?

I wonder how we ended up here, craving a rebirth of the nineties. I recently read a string of online reviews for the Love Story series about JFK Jr., and the commentary was overwhelmingly nostalgic for a city with no phones, baggy jeans, and cigarettes. The nineties were genuinely fun. I needed to explore the inventions, choices, and small changes that took us from the rooftop, where strangers became friends in the early morning where connection was human (not a screen), and presence felt normal, to the flight, where someone has to nudge you because you are lost in your own devices (and I do not mean that as a metaphor).

It started with a small blue-and-silver device and a man in Tokyo who was afraid of what he had built.

The First Bubble

It is the summer of 1979, and fifty journalists are sitting on a bus in Tokyo, holding something they have never seen before and cannot quite explain.

Sony’s PR team has driven them to Yoyogi Park, a wide sweep of green near the company’s headquarters. Each journalist has been handed a small, blue-and-silver device, roughly the size of a paperback novel, with a pair of foam-padded headphones trailing from it. The thing has no speaker. It cannot record. It cannot do the one thing that every portable audio device in human history had been designed to do up to that point.

The journalists turn it over in their hands. Some try it as Sony staff members demonstrate around them, skateboarding through the park, riding tandem bicycles, and grinning in a way that feels slightly rehearsed. The scene is, by most accounts, baffling.

The press conference got almost no positive coverage. In the first month, the Walkman only sold 3,000 units, though Sony had expected 5,000. The marketing team went into a state of controlled panic. Akio Morita, Sony’s chairman, was worried about something specific. He tested the device himself, walking through Tokyo with it, and feared that a product built for private listening would come across as rude or antisocial. He cared enough to add a second headphone jack and a small orange button that turned on a microphone, so two people could listen to and talk to each other at the exact same time. He didn’t want his company to be known for making something that kept people apart.

The second headphone jack was quietly removed in later models.

Nobody asked for it back. Nobody noticed it was gone. Morita hadn’t realised that, for most Walkman users, being alone was the main appeal. In eighteen months, Sony sold two million units. The journalists who couldn’t explain the device that day missed what it really was: the first gadget ever made to let you step out of the shared world while physically still standing in it.

Michael Bull, a sociologist at the University of Sussex, spent years interviewing Walkman users to understand what they were actually doing when they put on headphones. What he found was more complicated than liberation. Bull argued that personal stereos let users build private soundscapes, reframe their daily lives, and quietly deny the messy, uncontrollable contingency of the world around them. One of his subjects, asked to describe the feeling, offered three words.

“I just disappear.”

In 2025, disappearing is something we pay for. We book the retreat, roll out the mat, drive to the mountain, and do anything we can to get a few hours away from the noise. We have built an entire wellness industry around the desperate need to be unreachable for a little while.

But in 1979, the device was the escape. The headphones were the retreat. Disappearing felt like freedom because, for the first time, you could choose your own world over the one you were standing in.

The question is what happens when you can’t find your way back.

We Are All Jack Burton

There is a scene in the 1986 John Carpenter film Big Trouble in Little China. I’ll be honest with you: this is not a film for everyone. My wife, an academic with obviously more considerable taste than my own, absolutely refuses to engage with my obsession with it. She groups it with the broader category of films I love, quietly filed under “Ben’s problem”: Stripes, Top Gun, Gremlins, Caddyshack, The Blues Brothers. She is not wrong about any of them. I am not sorry.

Kurt Russell plays Jack Burton, a long-haul trucker who rolls into San Francisco’s Chinatown and finds himself in the middle of a centuries-old supernatural battle between ancient sorcerers, warrior gangs, and forces entirely beyond his comprehension. Throughout the film, Jack narrates his own experience on his CB radio with absolute confidence. He believes he is the hero of his own story. The one steering events. The one in charge.

He isn’t. Jack is, in fact, the comic sidekick. Carpenter and Russell explicitly stated in the DVD commentary that this is a film about a man who thinks he’s the action hero when he’s really just along for the ride. At one point, surrounded by things that make no sense, Jack looks at the camera and delivers a line with complete sincerity.

“I’m a reasonable guy, but I’ve just experienced some very unreasonable things.”

We are all Jack Burton now.

We tell our own stories with confidence. We think we’re in control. We check our phones, scroll through feeds, manage our inboxes, and keep up with messages. It feels like we’re present and connected. But real life is happening on the edges while we stare at our screens. We are reasonable humans, but we are experiencing some very unreasonable things.

The drift is silent. That is what makes it so hard to see.

Before the BlackBerry and before the iPhone, there was a room.

If you were online in the late nineties, you know exactly which room in your house you called the computer room, the spare room, or the study. Whatever your family called it, the ritual was the same. You walked in, sat down, and listened to the modem negotiate its way onto the network, that screech and crackle and rising digital hum, the sound of two machines deciding whether to trust each other over a dial-up connection. And then you were in.

When you were done, you clicked Disconnect. You stood up, walked out, and closed the door. The internet stayed in the room. The kitchen was the kitchen. The bedroom was the bedroom.

You were, in a very real sense, unreachable, and it did not feel like a problem. It just felt like any given Tuesday.

It didn’t happen all at once. Over time, the internet stopped being a place you visited and started being something that followed you home.

Brain Drain

The first sign of what was coming was the BlackBerry. It did not take long for users to become addicted to BlackBerry’s nearly instantaneous email delivery. The nickname CrackBerry was meant to be funny. It wasn’t actually a joke.

The legal system began to notice what was happening before most people did. In Chicago, a police sergeant named Jeffrey Allen sued the city for violations of the Fair Labour Standards Act. Allen claimed that the City did not pay him overtime for the time he spent checking his email while off-duty. More than fifty current and former members of the Chicago Police Department’s Bureau of Organised Crime claimed they were expected to monitor and respond to calls and messages on their department-issued BlackBerrys while off-duty and without pay. They had crossed the line so many times, in both directions, that they could no longer tell where work ended and the rest of their lives began.

Neither could anyone else.

Nobody told the officers to check messages at midnight, any more than anyone explicitly told me to reply to emails at 10 PM. The expectation just appeared, like fog, slowly and without warning, until one day you look up and can’t see the road.

Around 2010, I found myself in a room with a senior BlackBerry executive. We were talking strategy, discussing how they had built such ferocious loyalty in the enterprise market, and how entire organisations had become structurally dependent on their infrastructure. He described their approach with a phrase I have never forgotten.

We call it “Easy in, impossible out.”

He said it like it was just good business. Make it easy to start using, and then make leaving feel as hard as surgery without painkillers. Once a company built BlackBerry into its email, security, and always-on culture, leaving was almost unthinkable.

I nodded, paused, and thought: Wait, that is a clinical description of addiction.

What makes that conversation extraordinary in retrospect is not that BlackBerry did it. It is that every platform that came after them took that philosophy and applied it to the whole of human life. Easy in, impossible out stopped being a model for enterprise software. It became the architecture of the internet itself.

Then came the iPhone, and the architecture went global.

In June 2007, Steve Jobs walked on stage and described it as three things in one. The crowd cheered. Steve Jobs made the internet the default state of being. There is a  reason he never let his own kids have an iPhone.

Sociologist Linda Stone, who worked at Apple and Microsoft and witnessed this change, gave it a name. She called it continuous partial attention. It is not multitasking. Multitasking means doing two things at once well, which I think is fucking rad. I wish I could do two things at once well, but as my kids will attest, I absolutely cannot. Not even once.

Continuous partial attention is a constant state of being almost here and almost somewhere else. You are present enough to get by, but too distracted to ever fully arrive. (This was also known as my default state on any given Friday night in the nineties: continuous partial immaturity).

In 2017, a researcher at the University of Texas named Adrian Ward gave 800 people cognitive tests, varying only one thing: where their phone was. Some had it in another room. Some had it in their pocket. Some had it face down on the desk in front of them, switched off, silent, and untouched. The people whose phones were in another room significantly outperformed everyone else. Ward had a name for what was happening to the rest of the group: brain drain. The subconscious process of stopping yourself from thinking about your phone actively uses up the cognitive resources you need for everything else.

The phone doesn’t even need to be in your hand. It just needs to be in the room.

The science behind this is an uncomfortable read. Every time your phone buzzes, it triggers the release of cortisol, the main stress hormone. Notifications keep your brain on high alert by repeatedly triggering the stress response. Your phone eases stress for a fleeting moment, but raises it consistently over time. You feel anxious, so you check your phone. That makes you feel better for a bit. But checking trains your brain to expect more notifications, raising your baseline stress and making you reach for your phone again.

There is a name for what happened to us, and it did not happen all at once.

It started the way most significant changes do: with something genuinely useful. The Walkman gave you music on the train. The BlackBerry kept you up to date with your email. The iPhone put the world in your pocket. Each one arrived as a tool, something you picked up and put down, something that served you. At the moment you first held it, it was exactly that.

The drift began in the space between those moments. It did not happen in a single decision, but through the slow accumulation of small ones. You checked the email at dinner once because it was urgent. Then, because it might be urgent. Then, because you were just in the habit. The phone moved from the desk to the pocket to the bedside table so gradually that there was never a morning when you woke up and thought: Today I am going to let this machine become part of me. It just got closer and closer until the distance between you and it effectively disappeared.

Call it Digital Drift. It is the slow, unnoticed migration from a person who uses a device to a person who feels incomplete without one. It is not addiction in the clinical sense, though the architecture is deliberately designed to rhyme with it. It is something quieter and more universal. It is what happens when a tool becomes an atmosphere. It happens when the thing you picked up to serve you becomes the thing you reach for before you are fully awake, and when being without it for an hour feels not like freedom, but like a phantom limb.

The reason it matters is not the phone itself. It is what the phone displayed. Every moment of continuous partial attention is a moment taken directly from something else. The dinner table. The school play. The rooftop at five in the morning above a city is doing something extraordinary, if only you are willing to look at it.

Easy in, impossible out. Fuck BlackBerry.

Easy in, impossible out is a biological feedback loop designed by people who knew exactly what they were building.

The Empty Walls

Pip was six or seven when she had her first major breakdown in the house. She was usually incredibly chill, though as she grew up, it turns out that wasn’t always the case. She was a force of nature in a small body, competitive, curious, extremely sure of her opinions, and prone to eruptions of feeling that arrived without warning and took time to decode. On one particular afternoon, something broke loose in her that none of us could immediately explain.

It started with an irritability as she walked through the house, then tears, then a full retreat to her bedroom, back pressed hard against the door so we couldn’t get in. Nicola and I stood in the hallway deploying our most sophisticated parenting techniques, which at that moment amounted to talking gently at a closed door and exchanging looks of total helplessness. I was, and remain to this day, entirely useless at negotiating with anyone I love, especially my own babies. They just win every time. The manosphere would eat me alive in thirty seconds if I ever opened the portal.

After close to an hour, the door opened.

Pip was calm as she looked at me with completely clear eyes and said, very simply: “There are no photos of me on the walls. Only Miff and Kai. This family hates me; my love for you all has gone!”

As I said, she won. I had no answer.

She was right.

Together, shocked and a little defensive, we walked slowly through the house and looked at the walls the way she had looked at them. Framed photographs on the sideboard. Prints from beach holidays. The kids at various ages, Miffy grinning with a missing tooth, Kai as a toddler at the water’s edge. Miff and Kai were everywhere. We found exactly one tiny photo of Pip as a brand new baby in Miffy’s arms, and that was it.

Sure, there were photos of Pip, too. Of course, there were. Thousands of them. Tens of thousands. But none of them was on the walls.

Because Pip was a digital baby.

Miffy and Kai were born when photos were printed, held, argued over, picked, framed, and hung on the wall. By the time Pip was born, we were taking pictures with BlackBerrys and iPhones. We had more photos of Pip than the other two combined. We captured every moment but showed almost none, because the photos stayed on our phones, and phones don’t hang on walls.

Pip was not grieving a shortage of love. She was grieving a shortage of evidence. She had been thoroughly documented and completely invisible. She had been captured at infinite resolution and left out of the story on the wall.

That’s what the drift does to what matters most. It doesn’t erase these things. It just moves them somewhere harder to find. (And yes, we have plenty of photos of Pip on the wall now. She made absolutely sure of that.)

The antidote to this drift is not complicated, which is almost the most annoying thing about it.

You already know what it feels like. You have felt it, probably more recently than you think, during a long meal where the conversation ran past midnight, or on a walk where you left the phone at home by accident and noticed twenty minutes in that you were actually looking at things. The state the brain drain study measured, the cognitive capacity that returns when the phone leaves the room, is not a specialised, high-performance condition. It is just what your mind feels like when it is fully yours.

Digital Drift reverses the exact same way it began. Not in a single dramatic gesture, but in small, deliberate ones. An hour in the morning before the phone comes off the bedside table. A meal that stays zipped in your bag. A walk where you go the long way and refuse to document it. The rooftop, in whatever form your life offers it, is chosen on purpose and fiercely protected.

You are not trying to build a time machine back to 2004. You are just trying to remember that the person you were on that rooftop, present, unhurried, and available to whatever the city was about to hand you, is still in there.

There is a moment near the end of Big Trouble in Little China that I keep coming back to. Jack Burton has just survived an ancient supernatural war beneath the streets of San Francisco. He has watched sorcerers battle, buildings collapse, and demons dissolve into dust. He climbs into his truck, pulls out into the night, and picks up his CB radio.

“This is Jack Burton in the Pork Chop Express,” he says, “and I’m talking to whoever’s out there.”

Whoever’s out there. That’s the thing about a CB radio. It was a form of connection that was also, frequently, a form of talking into nothing. You broadcast on a channel, hoping someone was listening. Sometimes they were. Often they weren’t. It was communication as an act of faith, transmission without guarantee of receipt. A voice going out into the dark and not always coming back.

Jack drives off alone, narrating himself back into the story, completely unaware that he barely participated in the events he just lived through. His lights dissolve into the dark as the CB crackles, and nobody answers.

It was played for laughs, but I think of it more as a metaphor for what was to come.

- -

We all know that feeling. We have all sat at a table full of people and been somewhere else entirely. We have all watched something happen in real time and thought about how we would describe it later. We have all been at a concert, a sunset, a birth, and felt the reflex to reach for the device before we felt the moment itself. We have all been Jack Burton, narrating our own lives into a CB radio, talking to whoever’s out there, hoping someone is listening, completely missing the battle happening right in front of us.

The phone is a tool. But tools reshape the hands that hold them, and we have been holding this one long enough that the shape has changed.

The computer room had a door. We could walk through it in both directions. The door is gone now, and most of us have forgotten that walking out was ever an option.

It still is.

The rooftop was twenty-two years ago. The friends I made up there, whose names I never wrote down, whose stories I still remember, they existed because there was nothing else to do at five in the morning above Lexington Avenue except be there. The city below us was doing what cities do. We were present for it completely, unreachable and unhurried, and the week handed us things we could not have planned for.

A kind woman at a check-in desk. David Bowie on the gangway.

You cannot engineer moments like that. You can only be available for them.

The rooftop is still up there. The city is still doing what it does at five in the morning. The only thing that has changed is that we now have to choose to leave the phone downstairs before we go up.

Think of it like the moment we collectively realised the Marlboro man was cool as fuck but probably killing us, so we quietly put down the cigarettes and picked up the peppermint tea (or a can of Coke). That was never going to be an easy trade. But we made it (well, most of  us) because humanity has always found its way back to what actually matters. That is what we do. We drift, and then we find our way back.

Adam Duritz from Counting Crows, who I consider a genuine god of lyrics (right behind Bowie), wrote something that has stayed with me for thirty years.

I am covered in this skin, no one gets to come in. Pull me out from inside. I am folded and unfolded and unfolding. I am ready. I am fine.

There is a version of us that stands at the railing and lets the city arrive before reaching for something else. That saves a spot for a stranger and remembers their story twenty years later. That looks up from the screen in time to see what the world is offering.

That version of humanity is not lost. It’s found.

And maybe it is ok to be unreachable for a little while.

---

A note on this chapter
and my moral tension in writing this:

I write in three ways. I tell my stories into a dictaphone on long drives. Never on walks. The car is where the stories come out. I transcribe these into a Google Doc and draft from there. I then edit without AI. I use Grammarly to tighten the writing and resist its AI suggestions, because every time I accept them, the prose starts to sound like someone else. I am slowly learning to trust my own voice more than the tool, trying to improve it.

I do use AI, and I choose to use Claude rather than ChatGPT, which I deleted. I use it for ideas, structure, flow, and as a sounding board, but I do not fully trust it. It generalises in ways that water down exactly what I am trying to say, and I struggle to see real value in it beyond efficiency, which is precisely what this book argues against. There is a genuine moral tension in writing about the cost of convenience while using convenient tools to write it. I am conscious of that.

For research, particularly the psychology and neuroscience that runs through this book, I lean on Google NotebookLM to help me navigate academic papers I would not otherwise know how to read. I am not an academic, so I take care with how I present ideas that I am still learning to understand, and I have come to see that as part of the process. Writing about things you do not fully understand is the best way for me to begin understanding them.

Chapter 5 will be written without any of this. Just me, the dictaphone, and Google Docs.

For now, the struggle is real.

Has writing this chapter made me stop staring at my phone? Not entirely. But something has shifted. I leave my phone in the car at sports. I go into café meetings without it. I have changed the screen to muted greens and greys to make it less appealing, and I have turned off every notification for the first time in my life. My watch now tells me about important meetings. When it pings for 3 pm meetings, I check it and prepare. I don’t find Instagram waiting for me on the watch, so whether that is the same problem on a different device, I genuinely do not know. But there is less temptation, and that feels like a start.

I hope this chapter landed for you (hmmm, landed, a word I never used prior to AI, so again, an example of how my writing, how I think about writing, and the words I use shift because of the technology). Great fucking word though!

Thank you for being here.

Ben

---

Wednesdays by Ben Rennie is a reader-supported publication. To receive new posts and support my work, consider becoming a free or paid subscriber.`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "movement",
    series: "Be Kind Rewind",
    seriesOrder: 4,
    tone: "red",
  },
  {
    slug: "sub-serialisation-chapter-3-the-places",
    title: "Serialisation Chapter 3: The Places That Shaped Us",
    publishedAt: "2026-03-23",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/serialisation-chapter-3-the-places",
    tags: [],
    excerpt: "“I never had any friends later on like the ones I had when I was twelve. Jesus, does anyone?”",
    body: `[No public body content available — this post is fully paywalled.]`,
    bodyAvailable: "preview-only",
    type: "newsletter",
    category: "movement",
    series: "Be Kind Rewind",
    seriesOrder: 3,
    tone: "rust",
  },
  {
    slug: "97p-7-websites-dedicated-to-saving-the-world",
    title: "7 Websites Dedicated to Saving the World",
    publishedAt: "2026-03-20",
    source: "97percent",
    sourceUrl: "https://97percent.co/7-websites-dedicated-to-saving-the-world/",
    tags: ["journal"],
    excerpt: "Here's the thing about climate and environmental impact: it's easy to feel like a passenger. These sites help you become something else.",
    body: `Here's the thing about climate and environmental impact: it's easy to feel like a passenger. These sites help you become something else.`,
    bodyAvailable: "preview-only",
    type: "reading",
    category: "design",
    tone: "dark",
  },
  {
    slug: "97p-7-websites-for-creative-inspiration",
    title: "7 Websites for Creative Inspiration",
    publishedAt: "2026-03-20",
    source: "97percent",
    sourceUrl: "https://97percent.co/7-websites-for-creative-inspiration/",
    tags: ["journal"],
    excerpt: "Creative work depletes you. That's not a weakness, it's physics. The work goes out, and something has to come back in. These sites are the incoming.",
    body: `Creative work depletes you. That's not a weakness, it's physics. The work goes out, and something has to come back in. These sites are the incoming.`,
    bodyAvailable: "preview-only",
    type: "reading",
    category: "design",
    tone: "ink",
  },
  {
    slug: "97p-7-websites-every-first-time-author-needs-to-know",
    title: "7 Websites Every First-Time Author Needs to Know",
    publishedAt: "2026-03-20",
    source: "97percent",
    sourceUrl: "https://97percent.co/7-websites-every-first-time-author-needs-to-know/",
    tags: [],
    excerpt: "Writing a book is hard. Publishing one is a different kind of hard. These sites cut through the noise and give you the real picture.",
    body: `Writing a book is hard. Publishing one is a different kind of hard. These sites cut through the noise and give you the real picture.`,
    bodyAvailable: "preview-only",
    type: "reading",
    category: "design",
    tone: "dark",
  },
  {
    slug: "97p-7-websites-that-take-creativity-seriously",
    title: "7 Websites That Take Creativity Seriously",
    publishedAt: "2026-03-20",
    source: "97percent",
    sourceUrl: "https://97percent.co/7-websites-that-take-creativity-seriously/",
    tags: ["journal"],
    excerpt: "These aren't listicles about thinking outside the box. They're resources built by people who have thought hard about what creativity actually is.",
    body: `These aren't listicles about thinking outside the box. They're resources built by people who have thought hard about what creativity actually is.`,
    bodyAvailable: "preview-only",
    type: "reading",
    category: "design",
    tone: "ink",
  },
  {
    slug: "97p-97-recommends-9-books-on-creative-resiliance",
    title: "97% Recommends: 9 Books on Creative Resiliance",
    publishedAt: "2026-03-15",
    source: "97percent",
    sourceUrl: "https://97percent.co/97-recommends-9-books-on-creative-resiliance/",
    tags: ["creatorlab", "reading"],
    excerpt: "The books that help you get back up, keep going, and make things anyway.",
    body: `The books that help you get back up, keep going, and make things anyway.

Resilience gets talked about like it's a personality trait. Either you have it or you don't. Either you're the kind of person who bounces back or you're the kind who stays down.

That's not how it works.

Resilience is a skill. It's built through practice, through the right thinking, and sometimes through reading the right book at the right moment. For creative people specifically, resilience is the non-negotiable ingredient. Because creative work involves rejection, failure, and the daily experience of the gap between what you imagined and what came out. The people who keep making things aren't the ones who feel that less. They're the ones who learned how to move through it.

These nine books are the ones we keep coming back to. Not because they make the hard parts easier, but because they make them make sense.

1. Grit

Angela Duckworth

Duckworth spent years studying what separates people who achieve long-term goals from those who don't. The answer isn't talent. It's grit: the combination of passion and perseverance applied over time. She makes the case with research, stories, and enough rigour to make you believe it. For creative people who have been told their whole lives that success comes down to natural ability, this book is a quiet demolition of that idea. What you have matters less than what you keep doing with it.

Take from it: Passion without perseverance is just a good idea. Perseverance without passion is just suffering. You need both.

2. Man's Search for Meaning

Viktor Frankl

The foundation of any honest reading list about resilience. Frankl was a psychiatrist who survived four Nazi concentration camps and wrote this book about what kept people alive when everything else had been taken. His central argument: meaning is not found in circumstances. It is chosen. People who endured were not always the strongest or the healthiest. They were the ones who found a reason. For creative people, this is the deepest possible case for making things that matter. Purpose is not a luxury. It is survival.

Take from it: Between stimulus and response there is a space. In that space is your power. In that choice is your growth.

3. Bird by Bird

Anne Lamott

Lamott wrote this as a book about writing. It is actually a book about what it feels like to make anything. The terror of the blank page, the paralysis of perfectionism, the deeply human experience of producing work that falls short of what you had in mind. Her answer to all of it is the same: one bird at a time. One small, specific, imperfect step forward. Bird by Bird is the most honest book we know about the emotional reality of creative practice. It doesn't make the hard parts go away. It makes you feel less alone in them.

Take from it: You don't write the whole book. You write the next paragraph. That's the whole method.

4. The Dip

Seth Godin

Godin's shortest book and one of his sharpest. The Dip is the long stretch between starting something and mastery, where the initial excitement has worn off and the results haven't arrived yet. Most people quit here. The counterintuitive argument Godin makes is that strategic quitting is smart and resilience isn't about never quitting. It's about knowing when you're in a Dip worth pushing through and when you're in a dead end that deserves to be abandoned. For creatives who've been told that quitting is failure, this reframing is genuinely liberating.

Take from it: Quitting the wrong thing is not weakness. It's how you free yourself to push through the right one.

5. Mindset

Carol Dweck

Dweck's research on fixed versus growth mindsets has changed how we think about learning, failure, and potential. People with a fixed mindset believe their abilities are set. When they fail, it confirms what they already feared about themselves. People with a growth mindset believe abilities develop through effort. The same failure becomes data instead of verdict. For creative people who carry the weight of identity in their work, this distinction is enormous. Resilience isn't about feeling invincible. It's about having a framework that lets you learn instead of collapse.

Take from it: The moment you treat failure as information rather than identity, everything changes.

6. Turning Pro

Steven Pressfield

The follow-up to The War of Art, and in some ways the more useful book. Where War of Art names Resistance, Turning Pro describes the shift that happens when you decide to stop letting it win. The professional doesn't wait for motivation. The professional doesn't negotiate with fear. The professional shows up anyway, treats the work as a commitment, and keeps going when the amateur would stop. It's a small book that reads in two hours and tends to stay with you for years. Particularly useful in the long middle of a creative project when the initial energy has gone and the finish line isn't visible yet.

Take from it: Going pro is a decision. Not a credential, not an income level, not a title. A decision you make once and then keep making every day.

7. Rising Strong

Brené Brown

Brown's most underrated book and the one most directly about what happens after failure. The reckoning, the rumble, and the revolution. Her argument is that the people who are most resilient aren't the ones who fall less often. They're the ones who have learned a process for getting back up. For creative people, who put work into the world and watch it get ignored, misunderstood, or rejected, this book is a practical and honest guide to what that experience actually feels like and what to do with it.

Take from it: Rising strong after failure is not a natural reflex. It's a practised skill.

8. On Writing

Stephen King

Half memoir, half craft manual, entirely remarkable. King wrote this book while recovering from being hit by a van, which tells you something about the kind of resilience he's drawing on. The memoir half covers years of rejection, poverty, and self-doubt before Carrie changed everything. The craft half is the most useful book on writing practice we know of. Together, they make an argument that is simple and undeniable: you persist because the work matters to you, and the only way to get better is to keep doing it regardless of what the world does with it.

Take from it: The work is the point. The response to the work is someone else's business.

9. Option B

Sheryl Sandberg & Adam Grant

Sandberg wrote this after the sudden death of her husband. It's not a creative book in the traditional sense. It's a book about how human beings rebuild meaning after loss. Grant brings the research. Sandberg brings the lived experience. Together they make the case that option A is sometimes gone, and the work of resilience is learning to find joy and purpose in option B. For creative people who have lost a project, a direction, a collaborator, or a version of themselves they thought they were, this book speaks directly to the experience of starting again from somewhere you didn't choose.

Take from it: Option B is still an option. And sometimes, given time, it becomes its own kind of option A.

Creative resilience doesn't mean you stop feeling the hard parts. It means you build a relationship with them that doesn't end in paralysis.

Every maker, writer, designer, and creative practitioner we admire has a version of this story: the years of rejection, the project that collapsed, the work that never found its audience, the moment they seriously considered stopping. What separated them from the people who did stop wasn't talent or luck or perfect circumstances. It was the decision to keep going. Made once, and then made again.

Start with Bird by Bird if you're in the thick of a hard creative stretch. Start with Grit if you need the research to believe it's worth pushing through. Start with Man's Search for Meaning if you need to remember why any of it matters at all.

97% Creative. Because you already are.`,
    bodyAvailable: "full",
    type: "field-guide",
    category: "design",
    tone: "dark",
  },
  {
    slug: "97p-97-recommends-10-books-on-creative-culture",
    title: "97% Recommends: 12 Books on Creative Culture",
    publishedAt: "2026-03-15",
    source: "97percent",
    sourceUrl: "https://97percent.co/97-recommends-10-books-on-creative-culture/",
    tags: ["creatorlab", "reading"],
    excerpt: "The books that taught us what creative culture actually is, and how fragile it can be.",
    body: `The books that taught us what creative culture actually is, and how fragile it can be.

Culture is one of those words that gets used as a shortcut for something much harder to explain. A ping-pong table isn't culture. A set of values printed on a wall isn't culture. A Friday afternoon beer cart isn't culture.

Culture is what happens when nobody's watching. It's the unwritten agreement a group of people makes about what matters, what's acceptable, and what gets rewarded. In creative organisations, it's the difference between work that's alive and work that's just adequate. Between people who bring their best ideas in on Monday morning and people who stopped doing that eighteen months ago.

These twelve books have most shaped how we think about what culture is and what it takes to build one worth staying in.

1. The Fearless Organization

Amy Edmondson

Edmondson spent years researching what separates high-performing teams from average ones and the answer surprised her. The biggest predictor wasn't talent or resources or even strategy. It was psychological safety. The degree to which people felt it was safe to speak up, ask questions, admit mistakes, and challenge the status quo without fear of humiliation or punishment. For anyone running a creative team, this book reframes the entire job. Your primary responsibility is to make the room safe enough for honest thinking.

Take from it: People can't do creative work inside a culture of fear. Full stop.

2. Rework

Jason Fried & David Heinemeier Hansson

Jason Fried has been running Basecamp the same way for over twenty years: small team, no investors, no growth-at-all-costs, no performance theatre. This book is the philosophy behind that. Sharp, fast, and deliberately unconventional. It argues that most of what we think of as necessary business culture, the long hours, the big meetings, the constant availability, is actually just noise that kills good work. Building a creative culture means protecting people's time and attention, not filling every available hour with activity.

Take from it: A calm company is a creative company. Chaos is not a sign of ambition. It's a sign of poor design.

3. I'm Still Here

Austin Channing Brown

Brown writes about the daily reality of working inside organisations that claim to value diversity and inclusion but resist the actual cost of it. This is the most honest book on this list about the gap between cultural aspiration and cultural reality. For anyone building or advising creative organisations, it's an essential challenge to the comfortable version of culture we tend to design for. Real creative culture includes everyone's full humanity. Brown makes clear what it takes to actually mean that.

Take from it: Saying you value inclusion and building a culture that proves it are two very different things.

4. Where Good Ideas Come From

Steven Johnson

Johnson makes the case that breakthrough ideas rarely come from a single genius in a quiet room. They come from networks. From environments where half-formed ideas can collide with other half-formed ideas over time. He calls it the adjacent possible, the idea that creativity expands through connection, not isolation. Stop designing spaces and processes that separate people and ideas. Start designing ones that let them flow together.

Take from it: Innovation is an ecosystem problem, not a talent problem.

5. Writing My Wrongs

Shaka Senghor

Senghor spent nineteen years in prison, seven of them in solitary confinement, and used that time to rebuild himself through writing. This memoir is about what it takes to transform culture from the inside out, starting with yourself. It's the most extreme and most honest account on this list of how creative culture gets built under constraints most of us will never face. Ben Horowitz cites Senghor in What You Do Is Who You Are as one of his case studies in culture-building. We think Senghor's own voice, in his own book, deserves the place on this list, not just a mention in someone else's.

Take from it: Culture can be rebuilt from any starting point. The work begins with a single honest act.

6. What You Do Is Who You Are

Ben Horowitz

Horowitz builds his argument on an unusual set of case studies: Genghis Khan, the Haitian slave revolution, a samurai code written in the 18th century. The point is that culture isn't what you say it is. It's what you do when things are hard. It's the decision you make at 11pm when nobody's watching. For creative leaders, the question isn't what culture do you want. It's what does your actual behaviour tell people your culture is.

Take from it: Culture is the accumulation of your decisions, not your declarations.

7. Reinventing Organizations

Frederic Laloux

The most radical book on this list. Laloux spent years studying organisations that had abandoned traditional hierarchy in favour of something closer to the way living systems organise themselves. Self-management. Wholeness. Evolutionary purpose. It sounds abstract until you read the case studies, and then it starts to sound inevitable. What could a truly creative, truly humane organisation look like if we stopped designing it like a machine and started designing it like a forest?

Take from it: The next form of organisation won't look like the last one. Nature already figured this out.

8. The Art of Gathering

Priya Parker

Parker is a professional facilitator who has spent her career in rooms where things need to change. Her book is about what happens when people come together and why most gatherings fail to do what they're supposed to do. Culture is built in shared moments: workshops, offsites, weekly standups, team dinners. Most are run on autopilot. Parker's argument is that every gathering is a design problem, and the way you design it sends a direct signal about what you value.

Take from it: The meetings you run are a direct expression of the culture you've built.

9. Orbiting the Giant Hairball

Gordon MacKenzie

MacKenzie spent thirty years at Hallmark Cards, which sounds unremarkable until you realise he spent most of that time deliberately resisting the organisation's gravity. The Giant Hairball is his metaphor for the accumulated mass of rules, procedures, and corporate inertia that builds up in every institution. Creativity requires orbit: close enough to stay connected, far enough to move freely. A cult classic in design circles and one of the most honest books ever written about surviving inside a large organisation without losing your creative soul.

Take from it: Every organisation eventually becomes its own obstacle. The creative job is to keep moving anyway.

10. The Practice

Seth Godin

Godin's most direct book about what it means to show up creatively every day. The Practice is built on a single argument: shipping creative work is a professional discipline, not a waiting game. You don't wait for inspiration. You don't wait until the conditions are right. You show up, you do the work, and you ship it. A culture of practice is a culture of output. And a culture of output is the only culture that actually makes things.

Take from it: Creativity without commitment is just a hobby. The practice is the culture.

11. Deep Work

Cal Newport

Newport's argument is uncomfortable for anyone who runs an open-plan office with Slack notifications on by default. The ability to focus without distraction on cognitively demanding work is one of the most valuable skills a person can have, and most modern workplaces are specifically designed to destroy it. A team that can't think deeply can't make anything that matters. Newport makes the case for redesigning work around focused time, and it's one of the most important culture arguments of the last decade.

Take from it: The environment you create either protects people's best thinking or constantly interrupts it. There's no neutral.

12. Sprint

Jake Knapp, John Zeratsky & Braden Kowitz

The Google Ventures five-day sprint process for answering critical questions through design and testing. What matters about this book isn't the specific method. It's the cultural premise underneath it: a small group of people, given clear constraints, a hard deadline, and permission to move fast, can solve problems that months of meetings haven't. Sprint is about creative culture through structure. The right container, not a freer one, actually liberates people to do their best thinking.

Take from it: Constraints don't limit creative culture. They're what makes it work.

Creative culture isn't built with a single decision. It's built in the accumulation of small ones. The way a meeting is run. Whether someone's bad idea gets laughed at or listened to. Whether the best thinker in the room is the loudest or the quietest. Whether people feel safe enough to say what they actually think.

Most organisations talk about culture constantly and invest in it almost never. The ones that get it right treat it the way a good designer treats a brief: with intention, with rigour, and with a genuine understanding that how you do the work is inseparable from what the work becomes.

Start with The Fearless Organisation. Then read I'm Still Here. Between those two, you'll have both the foundation and the honest challenge that most culture-building conversations avoid.

97% Creative. Because you already are.Organisation`,
    bodyAvailable: "full",
    type: "field-guide",
    category: "community",
    tone: "cream",
  },
  {
    slug: "97p-97-recommends-10-books-on-creative-leadership",
    title: "97% Recommends: 10 Books on Creative Leadership",
    publishedAt: "2026-03-15",
    source: "97percent",
    sourceUrl: "https://97percent.co/97-recommends-10-books-on-creative-leadership/",
    tags: ["creatorlab", "reading"],
    excerpt: "The books that changed how we lead and how we think about the people around us.",
    body: `The books that changed how we lead and how we think about the people around us.

Leadership is one of those words that gets used so much it stops meaning anything. Everyone's a leader. Everything is leadership. The airport bookshelf is full of it.

But creative leadership is something different. It's the specific, difficult, often uncomfortable work of building environments where people do their best thinking. Where ideas survive contact with reality. Where the person with the quietest voice in the room gets heard before the loudest one shuts it down.

I've spent two decades in rooms like that, and these are the nine books that have shaped how I show up in them. Not all of them are about leadership in the traditional sense. Some are about culture, some are about trust, one is about surfing and clothing and the planet. All of them are about what it actually takes to lead people toward something worth making.

1. Creativity, Inc.

Ed Catmull

The best book ever written about running a creative organisation. Full stop. Ed Catmull built Pixar from nothing, made Toy Story, and then spent the next three decades figuring out how to protect the creative culture that made it possible. This book is honest about failure in a way most business books aren't. It doesn't give you a framework. It gives you a philosophy. The Braintrust model alone, where feedback is separated from authority, is worth the price of entry.

Take from it: A great team will fix a mediocre idea. A mediocre team will ruin a great one.

2. The Creative Act: A Way of Being

Rick Rubin

Rick Rubin has produced some of the most important music of the last forty years. This book is his attempt to explain how. It's not about music. It's about how to pay attention, how to receive ideas, how to lead from a place of deep listening rather than loud instruction. For anyone who leads creative people, this one reframes the whole job. Your role isn't to have the best ideas. It's to create the conditions where the best ideas can exist.

Take from it: The most important thing a leader can do is tune in before they speak.

3. Drive

Daniel Pink

Pink makes one argument and makes it well: the carrot-and-stick model of motivation is broken, and most organisations are still using it. What actually drives people, especially creative people, is autonomy, mastery, and purpose. The research behind this is solid, and the implications for how you structure a team, set goals, and measure performance are significant. If you're wondering why your best people keep leaving, start here.

Take from it: People don't need to be managed toward great work. They need to be trusted into it.

4. Multipliers

Liz Wiseman

Wiseman spent years studying leaders who make the people around them smarter and more capable, and leaders who do the opposite, the Diminishers who, often without realising it, drain the intelligence out of every room they enter. The distinction isn't about personality or intention. It's about behaviour. This book is a useful, sometimes uncomfortable mirror. Most of us have been both, and knowing which one you're being in a given moment is genuinely useful.

Take from it: The smartest leader in the room is rarely the one doing the most talking.

5. The Culture Code

Daniel Coyle

Coyle spent years inside some of the world's highest-performing groups, from Navy SEALs to Pixar to the San Antonio Spurs, trying to understand what they have in common. The answer isn't talent. It's culture, and culture isn't a values poster on the wall. It's a series of small, consistent signals that tell people whether it's safe to be honest, take risks, and admit they don't know. For anyone building a creative team, this is the operating manual.

Take from it: Culture is built in the moments between the work, not in the work itself.

6. Dare to Lead

Brené Brown

Brown's most practical book, and arguably her most important. It takes the ideas from Daring Greatly and brings them into the specific context of leadership, with tools, frameworks, and real examples. The chapter on armour, the behaviours leaders adopt to avoid vulnerability, is one of the most useful pieces of professional self-diagnosis I've read. Creative leadership requires showing up without knowing the outcome. This book is about how to do that without losing your mind.

Take from it: Courage is a skill. It can be taught, practised, and built over time.

7. No Rules Rules

Reed Hastings & Erin Meyer

The Netflix story told from the inside. Hastings built one of the most unconventional creative cultures in corporate history: no vacation policy, no expense approvals, radical transparency, and the expectation that adults will behave like adults. Some of it is genuinely transferable. Some of it is only possible at Netflix scale. All of it will make you question the policies your organisation inherited from someone who left five years ago. Meyer's cross-cultural lens adds a useful layer of rigour to what could otherwise read as Silicon Valley mythology.

Take from it: Most company rules exist to manage the worst 5% of people. The cost is the other 95%.

8. Leaders Eat Last

Simon Sinek

Sinek's deeper, more serious book and the one I return to more than Start With Why. The central argument is biological: humans are wired to feel safe within a circle of trust, and the leader's job is to maintain and expand that circle. When they don't, when the environment is full of internal threat, people stop taking risks. Creativity collapses. The insight that great leadership is fundamentally about protecting people from the outside so they can do the work inside is simple and profound.

Take from it: People don't give their best to organisations. They give it to people they trust.

9. Let My People Go Surfing

Yvon Chouinard

The most unusual book on this list, and in some ways the one that matters most to me. Yvon Chouinard founded Patagonia not as a business strategy but as an extension of his values. The company exists to make great products, cause no unnecessary harm, and use business as a tool for environmental action. What he built, almost accidentally, is one of the most creatively alive and values-driven organisations on earth. This book is proof that you can lead with conscience and still build something remarkable. In fact, it suggests you can't build something truly remarkable without it.

Take from it: The most creative and durable organisations are built on values, not metrics.

Each of these books tackles a different dimension of creative leadership: culture, trust, autonomy, courage, and purpose. Read them individually and they each shift something. Read them together and a bigger picture emerges.

Creative leadership isn't a style or a title. It's a daily practice of creating the conditions where people can do their best work, and then getting out of the way. The leaders I've admired most, across design, business, and culture, all understood this. Their job was to make the room better, not louder.

If you're starting with one, make it Creativity, Inc. Then go to Let My People Go Surfing. Between those two books, you'll have most of what you need.

97% Creative. Because you already are.`,
    bodyAvailable: "full",
    type: "field-guide",
    category: "design",
    tone: "ink",
  },
  {
    slug: "97p-97-recommends-7-books-on-creative-thinking",
    title: "97% Recommends: 10 Books on Creative Thinking",
    publishedAt: "2026-03-15",
    source: "97percent",
    sourceUrl: "https://97percent.co/97-recommends-7-books-on-creative-thinking/",
    tags: ["creatorlab", "reading", "journal", "Creativity"],
    excerpt: "The books that will rewire how you see problems, connect ideas, and think beyond the obvious.",
    body: `The books that will rewire how you see problems, connect ideas, and think beyond the obvious.

Everyone talks about thinking outside the box. Almost nobody explains what the box actually is.

The box is pattern recognition. The mental shortcuts your brain builds over years of education, experience, and cultural conditioning. These shortcuts are useful. They help you navigate the world efficiently. But they're also the reason most people, when faced with a problem, reach for the same solutions everyone else reaches for. The box isn't a lack of intelligence. It's an excess of familiarity.

Creative thinking is the deliberate practice of breaking those patterns. Learning to see connections where others see separation, to reframe questions before rushing to answers, and to hold multiple contradictory ideas in your head long enough for something new to emerge. It's a skill. And like any skill, it can be developed, sharpened, and taught.

These ten books won't give you a formula for having better ideas. They'll change the way you think about thinking itself. That's where the real leverage is.

1. Lessons in Creativity

Ben Rennie

The book that started this platform. Rennie draws on decades of working with brands like Nike, Patagonia, and Chanel alongside his experience as a designer and B Corp founder to build a practical framework for creative thinking that goes beyond brainstorming techniques. The Orbital Design methodology sits at the heart of it: creativity as a system of interconnected forces rather than a linear process. Grounded in real projects, honest about failure, and refreshingly free of the "just be more creative" platitudes that fill most books in this space.

Take from it: Creativity isn't a moment of inspiration. It's a way of seeing that can be designed, practised, and scaled.

2. A Technique for Producing Ideas

James Webb Young

Written in 1939 and still the most concise book on creative thinking ever published. Young, a legendary advertising executive, lays out a five-step process for generating ideas that takes forty minutes to read and a lifetime to master. The core insight is deceptively simple: an idea is nothing more than a new combination of old elements, and the ability to make those combinations depends on your ability to see relationships. That's the whole method. And it works.

Take from it: The capacity to bring old elements into new combinations depends entirely on your ability to see relationships others have missed.

3. Lateral Thinking

Edward de Bono

De Bono coined the term in 1967 and this book remains the definitive guide to what it means. Where vertical thinking digs deeper into the same hole, lateral thinking digs a new hole entirely. He provides structured techniques — random entry, provocation, reversal — for deliberately disrupting established thought patterns. More textbook than page-turner, but the tools are genuinely useful for anyone who needs to think differently on demand, not just when inspiration strikes.

Take from it: You cannot dig a hole in a different place by digging the same hole deeper. Creative thinking requires changing direction, not increasing effort.

4. inGenius

Tina Seelig

Seelig has spent years teaching creativity at Stanford and this book is the distillation of that work. Where most creativity books focus on the individual, Seelig zooms out to the ecosystem: knowledge, imagination, attitude, resources, environment, culture. She maps how these six elements interact to either ignite or suppress creative thinking, and gives practical tools for shifting each one. It's one of the most structured books on this list and one of the most immediately applicable. The chapter on reframing questions alone is worth the read.

Take from it: Creativity isn't just about individual talent. It's about the ecosystem you build around your thinking.

5. The Runaway Species

Anthony Brandt & David Eagleman

A neuroscientist and a composer team up to explain how the human brain generates new ideas. Their answer: three cognitive strategies, bending, breaking, and blending. We take what exists and warp it, fracture it, or fuse it with something else. Every creative act in human history from Picasso to the iPhone can be traced back to one of these three operations. The most scientifically grounded book on this list, and the one that makes the clearest case that creativity is a fundamental feature of how all brains work, not a special gift reserved for a few.

Take from it: The human brain doesn't create from nothing. It takes what exists and transforms it.

6. Creative Quest

Questlove

Questlove, musician, producer, filmmaker, and one of the most creatively restless minds working today, wrote this as a genuine exploration of how creative thinking actually functions in a life lived making things. It's personal, wide-ranging, and grounded in real experience across music, film, food, and culture. He writes about curation as creativity, about influence and originality, about the tension between paying homage and finding your own voice. For anyone who thinks deeply about where ideas come from and how culture shapes thinking, this one shifts something.

Take from it: Your influences don't limit your originality. They're the raw material it's built from.

7. Emergent Strategy

adrienne maree brown

The most unusual book on this list and one of the most important. Brown draws on the principles of living systems, how mycelium networks, how flocks of starlings move, how ecosystems adapt and self-organise, to build a framework for creative thinking and social change. The argument is that the most resilient, adaptive, and creative systems in nature share specific patterns: they're decentralised, they respond to feedback, they prioritise relationships over hierarchy. Brown applies these principles directly to how humans think, organise, and make things together. It connects directly to the Orbital Design philosophy that sits at the heart of 97% Creative.

Take from it: Nature has been solving hard problems for 3.8 billion years. Creative thinking gets sharper when you learn to think like a living system.

8. Range

David Epstein

The counterargument to the 10,000-hours myth. Epstein's research shows that in most fields, especially those that are complex and unpredictable, generalists outperform specialists. The people who think most creatively are those with broad experience across multiple domains. Range makes the case for sampling widely, learning slowly, and connecting ideas across disciplines. Essential reading for anyone who's ever felt guilty about having too many interests. Your breadth isn't a distraction from your work. It's the source of it.

Take from it: The most creative thinkers draw connections across domains. Breadth isn't a liability. It's the whole point.

9. Where Good Ideas Come From

Steven Johnson

Johnson studies the environments that produce innovation, from coral reefs to Renaissance Florence to the modern internet, and identifies seven patterns that recur across all of them. The eureka moment is largely a myth. Most good ideas emerge slowly through what Johnson calls the slow hunch: a half-formed thought that collides with another half-formed thought over time. A compelling argument for creating the conditions where ideas can connect, rather than trying to force breakthroughs on demand.

Take from it: Good ideas don't come from isolation. They come from connection between people, disciplines, and half-formed hunches that finally find their match.

10. Thinking, Fast and Slow

Daniel Kahneman

The book that explains why your brain works against you. Nobel laureate Kahneman maps the two systems of thought, System 1 (fast, intuitive, automatic) and System 2 (slow, deliberate, analytical), and shows how cognitive biases distort our judgement in predictable ways. It's not a creativity book in the traditional sense, but understanding how your brain defaults to shortcuts is essential for anyone who wants to think more originally. You can't break patterns you can't see.

Take from it: To think creatively, you first need to understand how your brain thinks automatically, and where those automatic thoughts lead you astray.

Read as a set, these ten books reveal something important: creative thinking isn't about having a "creative brain." It's about understanding how all brains work, the shortcuts, the biases, the pattern-matching, and then deliberately building habits and environments that disrupt those defaults.

Young gives you the method. De Bono gives you the techniques. Brandt and Eagleman give you the neuroscience. Seelig gives you the ecosystem design. Questlove gives you the cultural lens. Brown gives you the living systems framework. Epstein gives you permission to be broad. Johnson gives you the environmental conditions. Kahneman gives you the self-awareness. And Rennie gives you the applied framework: creativity as a designable system, not a mystical gift.

The common thread is that creative thinking is learnable. It starts with how you think about thinking.

97% Creative. Because you already are.

97% Creative. Because you already are.`,
    bodyAvailable: "full",
    type: "field-guide",
    category: "design",
    tone: "dark",
  },
  {
    slug: "97p-97-recommends-10-books-on-creative-practice",
    title: "97% Recommends: 10 Books on Creative Practice",
    publishedAt: "2026-03-15",
    source: "97percent",
    sourceUrl: "https://97percent.co/97-recommends-10-books-on-creative-practice/",
    tags: ["creatorlab", "reading"],
    excerpt: "The books that will help you show up every day and do the work.",
    body: `The books that will help you show up every day and do the work.

Why Creative Practice Matters

Inspiration is a terrible business model. It shows up when it feels like it, disappears without warning, and has no respect for deadlines. If you wait for inspiration to strike before you create, you'll spend most of your life waiting.

Creative practice is the antidote. It's the decision to show up regularly — daily, if possible — and make something, regardless of how you feel about it. Not because discipline is more romantic than inspiration, but because the act of showing up is what generates the ideas in the first place. The muse visits the working, not the waiting.

What separates prolific creators from everyone else isn't talent or luck. It's systems. Rituals. Habits. The unglamorous infrastructure that makes creative output sustainable over years, not just bursts. The ten books below are about building that infrastructure — turning creativity from something that happens to you into something you do.

The Books

1. The Practice

Seth Godin

Godin strips creativity down to its most essential act: shipping. The Practice argues that creative work isn't about finding your voice or waiting for a breakthrough — it's about making a commitment to produce work for other people, consistently, and trusting the process even when it feels pointless. It's short, punchy, and deliberately repetitive. Every chapter reinforces the same idea from a different angle: do the work, share the work, repeat.

The Takeaway: Creative work is a practice, not a performance. Ship it and move on.

2. Daily Rituals

Mason Currey

A fascinating catalogue of how 161 great minds — writers, composers, artists, scientists, philosophers — structured their working days. Some woke at dawn, others worked through the night. Some needed silence, others craved noise. The revelation isn't that there's one right way to work — it's that every single one of them had a routine. The specifics varied wildly. The consistency didn't.

The Takeaway: There is no perfect creative routine. But there must be a routine.

3. Atomic Habits

James Clear

Not a creativity book per se, but arguably the most useful book on this list for anyone trying to build a creative practice. Clear's framework — make it obvious, attractive, easy, and satisfying — applies directly to creative habits. Want to write every morning? Make the notebook visible, the coffee ready, the first step tiny. The compound effect of small, consistent actions is the engine behind every sustained creative career.

The Takeaway: You don't rise to the level of your goals. You fall to the level of your systems.

4. Steal Like an Artist

Austin Kleon

Kleon's manifesto for the modern creative is built on a liberating premise: nothing is original, and that's fine. Every artist is a collector of influences, and the creative act is about combining, transforming, and remixing what you've absorbed. It's a short, illustrated book that reads in an hour and stays with you for years. Particularly powerful for anyone paralysed by the pressure to be "original."

The Takeaway: Don't wait until you know who you are to get started. Start copying what you love, and your own voice will emerge.

5. The Creative Habit

Twyla Tharp

Legendary choreographer Twyla Tharp has been creating professionally for over fifty years, and this book is her manual for how she does it. The Creative Habit is practical to its core — full of exercises, rituals, and strategies for generating ideas, overcoming blocks, and sustaining a creative life over decades. Her concept of the "creative DNA" and the ritual of the morning taxi to the gym are now part of the creative canon.

The Takeaway: Creativity is not a gift from the gods. It's the product of preparation and effort, and it's within reach of everyone who commits to the work.

6. Keep Going

Austin Kleon

The third in Kleon's trilogy, and the one that matters most when the initial excitement fades. Keep Going is about sustaining a creative life when the world is chaotic, attention is fractured, and motivation has evaporated. It's ten principles for staying creative in good times and bad — from "every day is Groundhog Day" to "the ordinary + extra attention = extraordinary." A book you'll return to repeatedly.

The Takeaway: The creative life is not a linear journey. It's a daily practice of paying attention and making things.

7. Bird by Bird

Anne Lamott

Lamott's classic on writing — and by extension, on any creative practice — is funny, honest, and deeply human. The title comes from her father's advice to her brother, overwhelmed by a school report on birds: just take it bird by bird. That's the method. Small assignments. Terrible first drafts. One step at a time. It's the most comforting book on this list, and the most truthful about how messy creative work actually is.

The Takeaway: Almost all good writing begins with terrible first efforts. You need to start somewhere, so start by getting something — anything — down on paper.

8. Deep Work

Cal Newport

Newport makes the case that the ability to focus without distraction is becoming both increasingly rare and increasingly valuable. Deep Work provides a framework for structuring your time to protect the kind of concentrated, cognitively demanding work that creative practice requires. In an age of notifications, open offices, and shallow busyness, this book is a survival guide for anyone who needs to think deeply to do their best work.

The Takeaway: The ability to perform deep work is becoming increasingly rare at exactly the same time it's becoming increasingly valuable. Protect it.

9. Flow

Mihaly Csikszentmihalyi

The book that named the state every creative person chases — that feeling of complete absorption where time disappears and the work seems to do itself. Csikszentmihalyi spent decades studying optimal experience, and Flow explains the conditions that make it possible: clear goals, immediate feedback, and a balance between challenge and skill. Understanding flow doesn't guarantee you'll find it, but it dramatically increases the odds.

The Takeaway: The best moments in our lives are not passive. They occur when a person's body or mind is stretched to its limits in a voluntary effort to accomplish something difficult and worthwhile.

10. Manage Your Day-to-Day

Edited by Jocelyn K. Glei

An anthology of short essays from the 99U conference, featuring contributions from Seth Godin, Stefan Sagmeister, Gretchen Rubin, Tiffany Shlain, and others. Each essay tackles a specific aspect of building a sustainable creative routine — managing energy, taming tools, finding focus, sharpening your creative mind. It's the most practical book on this list, designed to be dipped into whenever you need a reset.

The Takeaway: Building a sustainable creative practice isn't about willpower. It's about designing your days so the important work happens first.

What These Books Teach You Together

Individually, these books offer tactics — morning routines, habit loops, focus strategies, permission to write badly. Together, they make a more profound argument: creative practice is not about waiting for the right moment. It's about building a life where the right moment happens every day, by design.

The pattern across all ten is remarkably consistent. Show up. Start before you're ready. Make the work small enough to begin. Protect the time. Trust the process. Ship it. Repeat. None of this is glamorous. None of it makes for a good Instagram story. But it's how every sustained creative career in history has actually worked.

If you're reading this and thinking "I know I should create more but I just can't find the time" — start with Atomic Habits and build from there. If you already have a practice but it's fragile, read Keep Going. And if you want the single most honest account of what creative work actually feels like day to day, read Bird by Bird.

The practice is the point. Everything else follows.

97% Creative. Because you already are.`,
    bodyAvailable: "full",
    type: "field-guide",
    category: "design",
    tone: "ink",
  },
  {
    slug: "97p-97-recommends-10-books-on-creative-confidence",
    title: "97% Recommends: 12 Books on Creative Confidence",
    publishedAt: "2026-03-15",
    source: "97percent",
    sourceUrl: "https://97percent.co/97-recommends-10-books-on-creative-confidence/",
    tags: ["creatorlab", "reading"],
    excerpt: "The books that helped us stop second-guessing and start making.",
    body: `The books that helped us stop second-guessing and start making.

Most people don't lack creativity. They lack the confidence to use it.

Somewhere between childhood and adulthood, the willingness to try things, fail publicly, and keep going got quietly trained out of us. We learned to wait for permission, to polish before sharing, to hand the floor to the "creative people" in the room. The result is a world full of capable, imaginative humans who've talked themselves out of their own potential.

These twelve books approach that problem from different angles. Some are practical, some are philosophical, some are deeply personal. All of them are worth your time.

1. Creative Confidence

Tom Kelley & David Kelley

The book that named this whole conversation. Tom and David Kelley, founders of IDEO and Stanford's d.school, make a straightforward case: creativity belongs to everyone, and the thing stopping most people from accessing it is fear, not talent. Decades of design thinking work sit behind this book and it shows. Practical, generous, and genuinely persuasive.

Take from it: Creativity is about having the confidence to act on your ideas, not just having them.

2. The War of Art

Steven Pressfield

Pressfield names the enemy and calls it Resistance. The invisible internal force that stops you from sitting down and doing the work. This book is short, fierce, and deliberately repetitive. It reads like someone grabbing you by the collar. If you've ever procrastinated on a creative project, talked yourself out of starting, or waited for inspiration to arrive like a bus, this one's for you.

Take from it: The professional shows up every day and does the work. The amateur waits for perfect conditions.

3. Big Magic

Elizabeth Gilbert

Gilbert's argument is simple and she's right: creativity is curiosity followed by action, and it should be enjoyable. Big Magic dismantles the myth of the tortured genius and replaces it with something more honest. You don't need to be special or qualified. You just need to be willing. Warm, direct, and a genuine permission slip.

Take from it: You don't need permission to create. Curiosity is enough to start.

4. Art & Fear

David Bayles & Ted Orland

A quiet classic that's been passed between artists, designers, and writers for decades. This book looks honestly at the internal obstacles that stop people from making work: perfectionism, comparison, the gap between what you imagined and what came out. The ceramics class story alone, quantity over quality, has changed the way thousands of people think about practice. Honest about how hard creative work is, but never defeatist.

Take from it: Most of your work exists to teach you how to make the small fraction that soars.

5. The Artist's Way

Julia Cameron

The original creative recovery programme. Cameron's 12-week course, built around morning pages and artist dates, has helped more people reconnect with their creative selves than almost any other book we know. It's structured, slightly spiritual, and remarkably effective. Whether you're blocked, burnt out, or just a bit rusty, this one gives you a framework for rebuilding from the ground up.

Take from it: Creativity is a natural function of life. Clear the blocks and it returns.

6. Daring Greatly

Brené Brown

Brown's research on vulnerability changed the conversation about courage in work and in life. The willingness to show up without knowing the outcome is the foundation of creativity and meaningful connection. If you've ever held back an idea because you were afraid of being judged, this book explains exactly why that happens and what to do about it.

Take from it: Vulnerability is the birthplace of creativity, innovation, and change.

7. The Misadventures of Awkward Black Girl

Issa Rae

Before Insecure, before HBO, before any of it, Issa Rae made a web series in her bedroom because she wanted to see a version of herself on screen that didn't exist yet. This book is the story of how she got there. Funny, honest, and deeply specific about what it actually feels like to create something personal and put it out before anyone asked you to. It's a book about creative confidence in the most practical sense: deciding your perspective is worth sharing and doing it anyway, without waiting for a green light that may never come.

Take from it: You don't need the industry to validate your idea. You need a camera and the nerve to start.

8. Feel the Fear and Do It Anyway

Susan Jeffers

The central insight here is deceptively simple: the fear never goes away. No matter what you're doing, launching something, sharing your writing, stepping on stage, the fear shows up. Jeffers gives you practical tools for treating fear as a companion rather than a stop sign, and for building the habit of acting anyway.

Take from it: Fear grows with you. So you might as well get comfortable with it.

9. Show Your Work!

Austin Kleon

The follow-up to Steal Like an Artist, and in some ways the more useful book. Kleon tackles the part most creative people dread: sharing. You don't need to be a genius or a self-promoter. You need to be generous, consistent, and willing to show the process, not just the polished result. A confidence-builder disguised as a book about being findable.

Take from it: Share the process. That's where the real work lives.

10. Heavy

Kiese Laymon

One of the most honest books about creative courage we've ever read. Laymon wrote this memoir as a letter to his mother, telling the truths about his body, his family, and his life that he'd spent years either avoiding or disguising in fiction. The act of writing it was itself an act of extraordinary creative confidence. For anyone who creates from personal experience but keeps softening the edges, keeps protecting people who don't deserve protecting, keeps making the work safer than the truth, this book is the most direct challenge you'll find to do otherwise.

Take from it: The work that costs you the most to make is usually the work that matters most to someone else.

11. Originals

Adam Grant

Grant spent years studying people who champion new ideas and found they're not who you'd expect. The most creative people aren't fearless. They're often cautious, doubtful, and prone to procrastination. What separates them is that they act anyway. Packed with research and stories that reframe what originality actually looks like, and deeply reassuring if you've ever thought you weren't bold enough.

Take from it: Doubt doesn't disqualify you. Most originals were full of it.

12. The Courage to Create

Rollo May

The oldest book on this list and probably the most profound. Existential psychologist Rollo May explores creativity and anxiety together, arguing that the creative act requires genuine courage. The willingness to encounter the unknown and bring something new into the world. Philosophical, dense in places, and completely worth it. If you want to understand why creativity feels risky at a deep level, start here.

Take from it: Creativity requires the courage to let go of certainty.

Read these individually and each one solves a specific problem: procrastination, perfectionism, fear of judgment, imposter syndrome. Read them together and a bigger pattern emerges. Creative confidence is a practice. Something you build through repeated acts of showing up before you feel ready.

The barrier to creativity is almost never skill. It's belief.

If you're starting with one, make it Creative Confidence by the Kelley brothers. Then read Issa Rae. Between those two books, you'll have the theory and the lived proof that showing up as exactly who you are is the only creative strategy that actually works long term.

97% Creative. Because you already are.`,
    bodyAvailable: "full",
    type: "field-guide",
    category: "design",
    tone: "dark",
  },
  {
    slug: "97p-test-post-1",
    title: "97% Creative Sessions: The Creative March",
    publishedAt: "2026-03-11",
    source: "97percent",
    sourceUrl: "https://97percent.co/test-post-1/",
    tags: ["event", "upcoming"],
    excerpt: "97% CREATIVE is an ongoing series of 97 live sessions built around one core belief: everyone is creative.",
    body: `97% CREATIVE is an ongoing series of 97 live sessions built around one core belief: everyone is creative.

96% of kids believe they are creative. Only 26% of adults agree. This series exists to close that gap.

That's the question behind 97% Creative, a live online session series hosted by Ben Rennie, founder of Rennie Creative Lab, author of Lessons in Creativity published by Wiley, and creator of the Orbital Design framework.

This session is called The Creative March. It runs across six parts, each built around a single question about your creative life that most of us have never properly sat down to answer. There are reflection exercises and live interaction throughout, and we close with an open Q&A. By the end of the hour, you'll have a clearer picture of where your creativity actually lives and how to protect it.

This is for students, creative professionals, and anyone whose work demands original thinking. You don't need a creative job title. You just need to show up.

After the success of Lessons in Creativity and the continued engagement of Ben's 7,000 Substack readers and 23,000 email subscribers, this series is dedicated to addressing the rising challenge of creative confidence. It is research-based, driven by ongoing work for Ben's new book exploring creative confidence and its connection to analog and digital environments.

Ben has spent 19 years working with some of the world's most recognised brands, including Nike, the NBA, Patagonia, Ray-Ban, Chanel, the US Government, Tourism Australia and Adidas. He brings that same depth of thinking to this session without the corporate price tag.

Tickets are limited. The book bundle includes a signed copy of Lessons in Creativity delivered to your door.

GET TICKETS

97% of the profits of this series is donated to Design Declare

Wednesday 25 March 2026. 7pm AEDT. One hour. Online and live.`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "design",
    tone: "ink",
  },
  {
    slug: "sub-serialisation-chapter-2-bored-to",
    title: "Serialisation Chapter 2: Bored to Death!",
    publishedAt: "2026-03-04",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/serialisation-chapter-2-bored-to",
    tags: [],
    excerpt: "To understand the second great trade we made with the modern world, I need you to hold something in your mind for a second. Picture the cool, translucent edge of a CD jewel case from September 1991.",
    body: `---

If you are reading this, it means you are a paid supporter of this project & my Substack, and I want to say a massive thank you. We are well over 2500 supporters now, and your support is what makes the public writing process work. As a reminder, jump into the comments when you finish reading. If a story sparks a memory for you, share it or challenge the ideas here. The comments will help shape the final manuscript, and you will get a Co-Author credit in the back of the book.

Note at the bottom of this article is a link to the 97% Creative Series. Paid subscribers or people who have purchased the book get free access. Check the bottom after Chapter 2.

Let's get into Chapter 2, Bored to Death!
- Ben

Introduction: Be Kind Rewind Introduction
Chapter One: What the Body Knew First
Chapter Two Now: Bored to Death!

---

If you were a music fan in the early nineties, you remember the exact feel of this object. It had a specific, satisfying weight. It had a brittle plastic hinge that always felt on the verge of snapping. Unlike a vinyl record or cassette tape, where you navigated a song with a needle or the thickness of a tape spool, the CD introduced a new type of feedback: the glowing LCD timer on the stereo.

- -

For the first time in audio history, we didn’t have to guess. We had cold, hard, digital exactness. We knew precisely how many minutes and seconds a song had left. We had quantified the magic.

This break in the expected flow signals a shift. What happened on September 24, 1991, felt like a glitch in the system.

On that day, a punk trio from Seattle called Nirvana released their second album, Nevermind. You already know the cultural crater this record left behind. It shifted pop culture almost overnight. Millions of us took it home, tore off the stubborn plastic wrapper, dropped the disc into the tray, and pressed play.

I was a teenager in quiet Australian suburbs, as far from the Pacific Northwest as you could get. Still, I sat there sweating in an oversized flannel shirt, taking myself too seriously. I was desperate to be part of the revolution.

We listened to those furious, generation-defining anthems. We let the album wash over us all the way to the final listed track on the back cover: Track 12, a slow, haunting acoustic dirge called “Something in the Way.”

At exactly three minutes and fifty seconds, Kurt Cobain’s voice drops away. The cello fades out. The song is unequivocally over.

But the CD player did not stop spinning.

If you were sitting on your bedroom floor watching the digital display on your stereo, you saw something that broke the established rules of the medium. The song was over, but the little red timer kept ticking upward.

4:00. 5:00. 6:00. The speaker’s output was absolutely nothing. It was pure, dead air.

Today, if our audio cuts out for three seconds, we instinctively reach into our pockets. We tap the glass, toggle the Bluetooth, and force-quit the app. We immediately assume the technology has failed us because the algorithm would never intentionally leave us alone.

But in 1991, there was no internet to consult. There was no Reddit thread to crowdsource an explanation for the anomaly. There was just you, a spinning plastic disc, and the four walls of your bedroom.

Think about what ten minutes of silence feels like to a restless sixteen-year-old vibrating with teenage angst. Ten minutes is a geological era. It is agonising. It is the purest, heaviest form of boredom.

If you were impatient, you did what most people did: you leaned over, hit the heavy plastic EJECT button, and swapped the CD for something else. You refused the friction of the space. You moved on to the next hit.

But if you didn’t hit the eject button, you waited. Maybe you were too deep into a math worksheet. Maybe you were paralysed by the inertia of being sixteen, so you let the clock run.

And eventually, the digital timer hit 13 minutes and 51 seconds.

Without warning, the speakers detonated. The silence was shattered with a violent, heart-stopping roar.

- -

A secret, unlisted track called “Endless, Nameless” tore through the silence. It was a screaming, chaotic, six-minute wall of feedback and smashed guitars. I remember jumping off the floor, heart hammering in my chest, convinced I had somehow blown the cones on my dad’s hand-me-down stereo. But once the panic subsided, it was thrilling. It felt like stumbling into a secret room in your own house.

Nirvana wasn’t the only band doing this. In the nineties, the “hidden track” became a phenomenon. Alanis Morissette left an a cappella song on Jagged Little Pill. Lauryn Hill, Green Day, Nine Inch Nails, and Pearl Jam did it too. It was an analog secret society, passed around schoolyards by word of mouth.

To a modern consumer or a modern product manager, this makes absolutely no sense.

Why would an artist at their creative peak put ten minutes of dead air on a disc? CD space was expensive. Attention was precious. In today’s metric-driven world, ten minutes of silence means user abandonment. It is a fatal flaw in the funnel. Why risk having the listener turn it off?

This wasn’t a manufacturing error; it was a test.

These artists were building a toll booth into their art. They understood a truth about human psychology we have since engineered away: the reward is sweeter when preceded by anticipation. And anticipation requires space.

The long stretch of silence was a barrier you had to cross. It was the price paid, in patience, for the reward on the other side. The point was clear: the best, rawest stuff lies beyond the gap.

If you want the secret, you have to earn it. You had to be willing to be bored.

Jumping ahead to our current moment, that gap has been entirely eradicated.

If you play Nevermind on Spotify, the moment “Something in the Way” ends, the system panics. To a tech platform, silence is user churn. Silicon Valley is terrified of dead air. Within milliseconds, Autoplay crossfades you into an Alice in Chains song so your brain never falls into under-stimulation.

There is no ten-minute wait. There is no hidden track. The space has been aggressively paved over.

In Chapter One, we talked about eliminating physical friction from life. We traded heavy Jenga blocks and video stores for frictionless glass screens. But there’s another trade, far more insidious. We didn’t just design away physical friction. We also erased temporal friction. We erased waiting. We declared total war on boredom, and we won.

We treated boredom like a bug in the human system. We thought of it as wasted time. A gap we needed to fix. So, when tech companies promised devices that ended boredom for good, we handed over our attention without hesitation.

This is the second Invisible Trade. We traded the uncomfortable friction of empty time for the frictionless relief of constant stimulation. And in doing so, we traded the quiet intimacy of our own minds for the loud compliance of an algorithm.

In 1654, French philosopher and mathematician Blaise Pascal wrote a line that perfectly diagnoses the modern condition, nearly four hundred years before the iPhone. He wrote: “All of humanity’s problems stem from man’s inability to sit quietly in a room alone.”

Pascal understood the terrifying math of being human. Sitting alone in a room feels unbearable; it drags you into a confrontation with yourself. Strip away the distractions, chores, entertainment, and noise, and you are left with nothing but the roaring monologue in your head. Suddenly, your anxieties claw at you, your grief resurfaces, your unresolved arguments replay, and those nagging questions about your life echo louder than ever.

This is the tragedy of our constant connectivity. We are the most networked generation ever. We can communicate globally in a second. Yet, we are becoming strangers to ourselves. You cannot build a relationship with someone you never spend time with. That includes yourself.

To further understand this trade, we need to examine what happens biologically when we do absolutely nothing.

For a long time, scientists assumed that when you were bored, your brain powered down. They thought it was like a car idling in a driveway, burning fuel, but going nowhere.

- -

In 2001, Washington University neurologist Dr Marcus Raichle made a discovery that changed neuroscience. He compared fMRI brain scans of people doing complex cognitive tasks with scans of people lying still, staring at the ceiling.

Dr Raichle discovered something astonishing: the human brain consumes roughly 20 per cent of the body’s total energy to maintain itself in a resting state. When you ask the brain to do a focused, difficult task like reading a spreadsheet or playing a fast-paced video game, the energy consumption only increases by a measly 5 per cent.

The brain is never idling. Doing “nothing” activates a massive, interconnected web, the Default Mode Network (DMN). Dr Raichle gave it this name.

If your focused, task-oriented brain is the driver, the DMN is the brilliant, slightly eccentric passenger riding shotgun.

When you focus intensely on a screen, the passenger is quiet. The moment you get bored, the passenger starts talking. The DMN connects data points, links old memories to today’s conversations, quietly processes emotion and considers future scenarios. It synthesises your world.

The Default Mode Network is the biological birthplace of the “shower thought.” It is the reason your best ideas never happen while you are staring aggressively at a blank Word document with a blinking cursor, but instead arrive perfectly formed while you are washing your hair, walking the dog, or staring out a window.

We used to have dozens of natural triggers for the Default Mode Network built into our daily routines. We couldn’t avoid them even if we tried.

Think about your Dad heading to the toilet, or as my Dad used to call it, the Khazi. You could always guarantee that when the newspaper vanished from the kitchen table, someone was off to the Khazi for twenty minutes. It’s a crude example, but it’s true: it was a crucial block of unfiltered, analog time. You just sat there, stared at the bathroom tiles, and your brain synthesised the day.

Or think about the ultimate, inescapable incubator for the Default Mode Network: the backseat of a family car on a long Australian road trip.

If you grew up here, you know the exact feeling. You are strapped into the back of a sweltering Holden Commodore, the vinyl seats sticking to the back of your legs. You are driving for hours down a shimmering highway that looks the same in every direction. There were no iPads mounted to the headrests. There were no dual-screen DVD players. There was no algorithmic Spotify playlist perfectly curated to your exact mood.

There was just the window, the heat, and crushing, inescapable boredom.

So, what did we do? Our brains, desperate for stimulation, turned the passenger seat into a laboratory. We invented games out of thin air.

We played Car Cricket.

It was a brilliant, mathematically robust game born entirely out of having nothing else to do. You stared out the window at the oncoming traffic, waiting for the mirage on the horizon to solidify into a vehicle. A standard car was 1 run. A van, ute, or 4WD was a boundary for 4. A motorbike was a massive 6. And if a semi-trailer drove past, you were out.

It sounds so ridiculously simple now, but look at what that game actually required. It forced us to look out. It forced us to observe the physical world, track patterns, and interact deeply with our environment. We were co-creating an experience with the landscape. I know it still works because my kids, who are 16, 19, and 22, and have grown up with infinite digital entertainment in their pockets, still ask me to play Car Cricket on long family drives.

Why? Because human beings actually crave the Default Mode Network. We crave the space just to be, to let our minds wander, and to find magic in the mundane.

When we give our brains that space, they don’t just invent games to pass the time. Sometimes, they invent a future that saves our lives.

Just ask Dave Grohl.

In April 1994, after Kurt Cobain died, Grohl was entirely unmoored. Nirvana was over. His best friend was gone. He was so depressed and lost that he couldn’t even listen to the radio because the sound of music physically hurt. Desperate to escape his own life, he flew across the world and drove to the Ring of Kerry in Ireland, one of the most remote, quiet, and isolated places he could find.

He was driving around in a rental car, completely alone, surrounded by nothing but empty country roads and grey skies. He was living in the ultimate, painful state of the Default Mode Network. He wasn’t trying to be productive. He wasn’t trying to write a song. He had stripped away all distractions and was sitting in the heavy, uncomfortable void of his own grief.

And then, he saw a hitchhiker.

Grohl slowed the car down, debating whether to pick up the kid. As he got closer, he looked at the hitchhiker’s chest. The kid, standing in the middle of nowhere on a remote Irish dirt road, was wearing a Kurt Cobain t-shirt.

In that moment of quiet observation, Grohl’s Default Mode Network synthesised everything. The grief, the geography, the sheer impossibility of the coincidence. He later said that seeing Kurt’s face staring back at him in the middle of nowhere was a sign. “I realised, I can’t outrun this. I need to go home and fucking get back to work.”

He flew back to America, booked a studio, and recorded the first Foo Fighters album entirely on his own.

Now apply the modern attention trade to that story.

Imagine Dave Grohl taking that trip today. He is sad, so he puts on noise-cancelling AirPods to drown out the car's silence. He is lonely, so he listens to a comedy podcast on 1.5x speed to keep the dark thoughts at bay. He gets lost on the country road, pulls over to check Google Maps, gets distracted by a text message, and starts scrolling through Instagram.

He never looks out the window. He never sees the hitchhiker. He never sits in the room with his own grief.

The Foo Fighters were never born.

Now, I realise the stakes of our daily boredom are rarely this cinematic. You and I are probably not going to write “Everlong” just because we decided to leave our phones in our pockets while waiting for a flat white. But the mechanism is the same.

When we refuse to be bored, we refuse to let the world speak to us. We fill the car with frictionless digital noise, and we drive right past the exact signs we need to figure out who we are supposed to become.

But the great erasure of boredom didn’t just steal our empty time; it stole our empty objects, too.

To understand how we outsourced our imagination, I want you to think about the best toy you ever owned. Think back to the absolute peak of your childhood joy.

If you grew up before the internet, there is a very good chance this toy did not come in a shrink-wrapped box. It did not require four AA batteries. It did not have a backlit screen, a volume button, or an instruction manual.

For me, it was a stick.

I know exactly how tragic that sounds to a modern child, but humour me, we all had a stick. I remember finding the perfect one in the bush behind our house. It was long, slightly curved, heavy at the base, and stripped of its bark. In my hands, that piece of dead wood was a masterpiece of limitless potential.

On Monday, it was Excalibur, and I was a knight defending the backyard from an invisible dragon. On Tuesday, it was a sniper rifle, and I was a soldier crawling through the damp, itchy kikuyu grass. On Wednesday, it was a lightsaber, and the deep, vibrating humming sound it made came entirely from the back of my own throat (and probably involved a fair amount of accidental spitting).

Because the object itself was low-fidelity, my brain had to work in high-fidelity to make it real.

My mind had to supply the dragon. My mind had to supply the laser sound. My mind had to turn the clothesline into a medieval fortress or, more accurately, a swing, which inevitably led to bending the aluminium arms of the Hills Hoist and waiting in sheer terror for Mum to notice.

This is the definition of true play. It is an act of projection. It requires you to take the raw, boring, unresponsive materials of the physical world and overlay a rich, complex layer of imagination on top of them. You are not just inhabiting a world built by someone else. You are building it yourself in real time.

And how did that incredible process begin? It began with the same friction that made Dave Grohl look out the car window. It began with boredom.

In the analogue world, there were long stretches of time on Sunday afternoons where absolutely nothing was happening. There was no iPad to swipe. The TV had only four channels, and they usually showed golf, parliamentary debates, or lawn bowls, which, to an eight-year-old, is a viewing experience almost indistinguishable from a coma. You were forced to sit by yourself.

I would sit on the back step for twenty minutes doing nothing, feeling the agonising itch of boredom, until finally, I couldn’t take it anymore. I would walk into the yard and pick up the stick.

The game did not start because I was entertained. It started because I was desperate. Boredom was the pressure chamber that forced my creativity to emerge.

Today, if a child feels even a microsecond of that pressure, the algorithm is waiting to relieve it. There is a video, a game, and a feed. The external stimulation is constant, infinite, and incredibly high-fidelity. Because we have removed the boredom, we have removed the catalyst. We have removed the uncomfortable silence that asks the brain to speak up and invent the dragon.

There is another, deeper element of analogue play that vanished along with the boredom. We traded negotiation for compliance.

My mate, the brilliant Aussie broadcaster Tim Ross, has a great observation about how incredibly compliant we’ve become as a society. He asks you to imagine approaching an Australian Dad in the 1980s a bloke in Stubbies and thongs, hosing down the driveway on a Sunday morning and telling him that in the future, it will be mandated by law that he must carry little plastic bags with him on walks, so he can bend over, pick up his dog’s warm shit with his hand, and carry it around the neighbourhood.

That 1980s Dad would have laughed you right off the driveway. It would have been unfathomable. But today? We buy the little scented rolls from the supermarket, clip them to the leash, and do exactly as we’re told. We have become highly trained, highly compliant citizens.

That same quiet surrender happened to the way we play.

When I was running around in the backyard with my friends, we had to constantly agree on the reality we were building.

“I shot you!” I would yell across the yard.

“No, you didn’t,” my friend would argue, refusing to fall. “I’m wearing a bulletproof vest!”

“You didn’t say you had a vest!”

“I’m saying it now!”

To a parent watching from the kitchen window, this sounds like irritating, pointless bickering. But developmental psychologists tell us this is actually a highly sophisticated social negotiation.

- -

In unstructured, analog play, the children are the game designers. But more importantly, they are the referees. They have to build the rules, agree on them, and then police them among themselves. If the game feels unfair, they have to pause the narrative and renegotiate the terms. They are learning diplomacy. They are learning empathy. They are learning conflict resolution. They are learning an incredibly vital human lesson: reality is something we co-create with the people around us.

Now, let me be very clear: I am not pretending that imagination died in 1999. Kids today still do this. They still pick up sticks, they still build forts, and they still argue over who shot whom in the backyard.

But the environment in which they are doing it has fundamentally changed.

When we were negotiating the rules of the backyard, we were a captive audience to the physical world. Our biggest alternative was the bulky cathode-ray tube TV in the lounge room, and unless it was exactly the right time of day, the programming was terrible. We didn’t have a choice but to push through the friction of the game, because the alternative was staring at a wall.

Today, that TV has shrunk, crawled into our pockets, and brought a terrifying amount of reinforcements.

The alternative to the stick is no longer a boring parliamentary debate on the ABC. The alternative is quite literally infinite. It’s a glowing pane of glass offering a bottomless feed of TikToks, sprawling Roblox servers, YouTube Shorts, group chats, and a frictionless, perfectly rendered universe engineered by behavioural psychologists to ensure you never have to be bored or frustrated ever again.

When a modern kid hits a moment of friction in the physical world—an argument over a magic bulletproof vest, a lull in the game, the sudden onset of a quiet Sunday afternoon—they don’t have to stay in the room and negotiate. They don’t have to push through the boredom. They have an immediate, frictionless escape hatch sitting in their pocket.

Now, look at a modern video game.

The graphics are breathtaking. The world is immersive. If you swing a sword in a game like Elden Ring or shoot a blaster in Fortnite, the lighting effects are perfect. You do not need to use your Default Mode Network to imagine the dragon; the dragon is rendered for you in 4K resolution at sixty frames per second.

But notice what happens to the rules.

In a video game, the computer is the referee. If you shoot a character and the game’s code says you missed, you missed. You cannot argue with the algorithm. You cannot turn to the machine and negotiate, “But I’m wearing a magic vest.”

The machine dictates the reality. The player complies.

We traded our own imagination for someone else’s immersion. We traded messy, human, social negotiation for cold algorithmic rules. We moved from a form of play where we had to fill in the gaps with our minds and our friendships, to one where every pixel, every rule, and every outcome is provided for us by a corporation in Silicon Valley.

People always point to Minecraft as the counterargument. And fair enough. My own kids have built cathedrals in there that are genuinely beautiful. But building in a simulation and building in reality are fundamentally different. In Minecraft, the blocks always stack. The digital roof defies physics. There is no splintered wood, no unexpected weather, no friend dropping the ladder because you stopped communicating.

When you try to build a treehouse out of actual scrap wood and rusted nails in the backyard, you learn about leverage. You learn about the weakness of materials. You learn that if you do not communicate clearly with your friend holding the ladder, the ladder will fall and you will actually get hurt.

The physical world does not care if you are having fun. It demands that you respect its laws. It forces you to be intimately engaged with reality. That is where the actual learning lives.

We are raising a generation that is incredibly good at navigating systems built by others. They are expert users. They can optimise their digital avatars, maximise their scores, and traverse complex, frictionless interfaces at terrifying speed.

But are they learning to build the system itself? Are they learning how to sit in an empty room and generate their own weather?

When we take away the stick and replace it with the controller, we save them the hard work of imagination. We are saving them from the agonising boredom of a Sunday afternoon. We are saving them from the messy argument about who shot whom in the backyard.

But that hard, messy, boring work is what makes us human.

The ability to look at a piece of dead wood and see Excalibur is the same cognitive muscle that allows an adult to look at an unremarkable Tuesday morning and see a gift. It is the ability to see what is not explicitly rendered for us.

If we fill every quiet moment with high-definition content, we risk checking the muscle of imagination into early retirement. But worse than that, we stop spending time with ourselves. We outsource our inner monologue to a feed, and we forget what our own unaccompanied minds actually sound like. We scroll past our own lives, looking for a distraction from the beautiful, heavy reality of being alive.

But I don’t believe that muscle is permanently gone. I think it is just waiting for a reason to wake up.

In the 90s, around the same time that kid was lying on the floor waiting for the hidden Nirvana track, I went to see Oasis play at the Leadmill in Sheffield. If you know anything about 90s Britpop, you know the Leadmill. It was small, gritty, and loud. There wasn’t a mobile phone in the building. We just stood in the dark, bathed in sweat and feedback, entirely surrendered to the music’s physical experience.

In 2026, I saw them play again. This time it was in Sydney, in front of 80,000 people.

When the band walked out on stage, the generational shift was blindingly obvious. Instantly, 40,000 glowing glass rectangles shot into the air. It was the modern twitch in full effect. We were standing in front of one of the greatest rock bands on earth, and our collective instinct was not to experience the moment, but to document it. To compress a massive, thumping reality into a flat, frictionless file.

For the first few songs, it seemed the attention trade had won.

But then, Oasis did what Oasis does. The bangers kept flowing. The guitars got louder. The bass vibrated up through the floor and into our chests. The physical friction of the environment began to overpower the algorithmic conditioning.

I was standing on the dance floor, about thirty metres back from the stage. Sometime during the middle of the set, I looked around.

The sea of lit screens had disappeared.

Every single person around me was singing at the top of their lungs. Strangers were hugging. The crowd was swaying as one massive, messy, analog organism. We hadn’t just consciously decided to put our phones away.

We had completely forgotten them.

The physical world had demanded our presence, and our bodies remembered exactly how to respond. At that moment, surrounded by 80,000 people, the mental static vanished. We weren’t consuming content. We were co-creating a reality.

That is the ultimate proof that we can reverse the trade. We haven’t lost our capacity for deep, unstructured connection; we have just stopped giving ourselves the environment to practice it.

To fall back in love with your own life, you don’t need to throw your phone into the ocean. You have to be willing to return to the quiet room, and you have to be willing to stand in the loud ones. You have to be brave enough to let the boredom in, to leave the gaps empty, and to let the CD spin in silence until the hidden track finally hits.

We need to trust that if we stop staring at the screen and surrender to the friction of the real world, the child will eventually pick up the stick.

And the dragon will return.

---

- -

---

Thanks for reading Chapter 2.

Scroll down to the first comment. I’ve broken this chapter into five Analogic cards, each one a takeaway you can sit with, share, or stick on your wall. They’re designed to work without the chapter, but they hit harder with it.

---

One more thing before you go.

As part of the ongoing work to tackle the creativity crisis, we are launching 97% Creative, a series of 97 live sessions built for the 97% of us who started out believing we were creative and somewhere along the way, quietly stopped.

The first session, The Creative March, is happening on Wednesday, 26 March 2026. 7 pm AEDT. Online and live. One hour. Six questions. The kind you’ve probably never sat down long enough to properly answer.

This is a test run before the full series kicks off in June with in-person events across Sydney, Brisbane and Melbourne, plus the online series.

97% of the profits go directly to Design Declares Australia.

Tickets are at events.humanitix.com/97percentcreative

If you’ve already bought the book, or you’re a paid subscriber here on Substack, you’re in for free. Just message me, and I’ll send you a code.

Thanks for being here. See you in March.
- Ben`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "movement",
    series: "Be Kind Rewind",
    seriesOrder: 2,
    tone: "red",
  },
  {
    slug: "sub-serialisation-chapter-1-the-body",
    title: "Serialisation Chapter 1: The Body Knew First",
    publishedAt: "2026-02-21",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/serialisation-chapter-1-the-body",
    tags: [],
    excerpt: "Welcome to Chapter One, the second installment of my book serialisation for my second book, Be Kind Rewind.",
    body: `- -

If you are reading this, it means you are a paid supporter of this project & my Substack, and I want to say a massive thank you. Your support is what makes the public writing process work. As a reminder, jump into the comments when you finish reading. If a story sparks a memory for you, share it or challenge the ideas here. The comments will help shape the final manuscript, and you will get a Co-Author credit in the back of the book. Let's get into Chapter 1.
- Ben

Serialisation One (Start here if you missed the intro): Be Kind Rewind Introduction

Chapter One: The Body Knew First

To understand what we traded, we have to go back further than the video store. Further than the Walkman. Further than the modem in the spare room. The roots of human agency do not begin with technology. They begin in the body, long before we had any idea what agency even was.

It begins in a high chair.

I want you to think of a specific moment. It might be a memory of your own child, a younger sibling, or perhaps just a scene you witnessed in a local café.

Picture a six-month-old child strapped in. The parents are trying to feed them, but the child is interested in something else. They are holding a spoon. They look at it. They feel the cold metal. And then, with great deliberation, they open their fingers and let it drop.

Clang.

The spoon hits the floor. The parent sighs, picks it up, wipes it off, and gives it back. The child grabs it, pauses, and drops it again.

Clang.

To a tired parent, this looks like mischief or just a mess. But to the child, it is the scientific method in action. They are testing gravity, gathering data, and learning how the physical world actually works.

A hands-on experiment like that requires a properly tactile laboratory. And for my family, that laboratory usually smelled like sizzling Mongolian lamb and deep-fried ice cream.

I am talking about the unapologetically old-school Australian-Chinese restaurant. The places with heavy red carpets that have absorbed decades of spilled soy sauce. The squeaky wooden lazy Susans. The sweet and sour pork that glows with a radioactive, neon hue. I love these places because they are deeply, undeniably physical (and yummy). They are loud and sticky, and irrespective of how the food tastes, they demand my presence. I just love a good Chinese meal in a classic Australian establishment.

Which is exactly how we ended up in a busy, noisy dining room in Kiama, a few hours south of Sydney, with our daughter Miffy.

Miffy is twenty-two now, but back then, she was an eleven-month-old force of nature often covered in Vegemite, always competitive (yes, even as an eleven-month-old baby), and forever inquisitive. On this particular night, she was strapped into a wooden high chair, faced with a mound of special fried rice.

But she was not interested in eating. She had discovered a game.

She reached out and pinched a single, bright green pea between her thumb and forefinger. She looked at it intensely, feeling the squishy texture. She locked eyes with a diner sitting at the neighbouring table. And then, with the surprising accuracy of a major league pitcher, she launched it across the room.

The pea sailed through the heavy restaurant air. Smack. It hit the stranger in the neck. He swatted it away like a fly as Nicola and I lifted our heads to the ceiling, admiring the decor, whispering a quiet “what the actual fuck just happened” under our breath.

But Miff didn’t stop there. The special fried rice was an ammunition depot. Next came the squares of fake, Devon-like ham. Then came the prawns. She would pick up a prawn, gauge its weight, and fire it into the crowd.

She watched them fly. She watched them land. Then she leaned forward to observe the reaction of the people she had just assaulted with the fried rice buffet.

To my wife Nicola and me, this was a diplomatic incident waiting to happen. We were genuinely freaking out. We did the only thing we could think of. We took the bowl away.

We waited for her to calm down. Once she seemed ready to behave, we cautiously slid the fried rice back onto her high chair tray. Instantly, she picked up another prawn and fired it at a completely different table.

This standoff lasted forty minutes. It was a relentless cycle of confiscation, parental negotiation, and incoming artillery fire. It only ended when she finally realised she was actually hungry and decided to eat her remaining ammunition.

To be honest, I was torn between proud dad (what an arm!), supportive husband (I don’t know what’s gotten into her!), and disciplined father (now this is your final warning, Miff!).

But looking at Miffy’s face, I realised she was not trying to be naughty. She was learning science.

She was asking fundamental questions about the universe. How much force do I need to reach that table (or do Prawns fly)? Does the pea make a sound when it hits the back of a stranger’s head? Does a prawn fly differently than a square of spam? Does the feeling of letting go always result in the object disappearing from my hand? Why does my Dad lose his mind at the sight of a pea flying?

When a prawn hit the stranger, Miffy was not just making a mess; she was mapping reality. She was learning that distance is real, that objects have mass, and that she was a separate entity from the world around her.

This is the beginning of agency. It is the first moment a human being realises a profound truth. I do X, and Y happens. We tend to think of learning as something that happens entirely in our heads. We imagine the brain as a computer that processes information, and the body as a mere vehicle that carries the computer around. But that is not how we were built.

We do not think and then move. We move to think.

The Hand Built the Brain

If you want to understand how humans actually learn, you have to look at a map of the brain. But not a standard medical diagram. You need to look at the Cortical Homunculus.

This is a visual representation of the human body, but it is distorted. It is drawn based on how much brainpower is dedicated to processing sensation and movement for each body part. If you physically built a human being based on this neurological map, they would look terrifying.

They would have a tiny torso and thin, spindly legs. But they would have a gigantic mouth and enormous, oversized hands.

The hands are massive because the connection between the hand and the brain is the superhighway of human intelligence. For millions of years, our survival depended on our ability to manipulate the physical world. We had to grasp, throw, dig, and weave. We had to feel the difference between a ripe fruit and a rotten one. We had to feel the tension in a bowstring before we let the arrow fly.

The hand did not just execute the brain’s commands. The hand taught the brain how to understand the world.

If you don’t believe me, think about the old push-in cigarette lighters that used to come standard in every family car. It feels like half the kids in Australia share a generational trauma from those things. You know the ones, they left a perfect, permanent spiral burn on the skin, usually right on the pad of a thumb.

Your parents warned you a hundred times not to touch it. They explained the danger perfectly. But the temptation of pulling out that glowing orange metal was too great. Your brain heard the warning, but your thumb still reached out, thinking, Hmmm, I wonder exactly how hot this is? A parent’s lecture couldn’t encode the lesson, but the blister certainly did. Like I said: the hand taught the brain how to understand the world.

Psychologists call this embodied cognition.

---

Below the paywall: Why Mr Miyagi was a better neuroscientist than modern tech developers (and the tech bros), what a giant Jenga tower in a Nebraska diner taught me about consequences, and the biological reason you feel so exhausted after staring at a screen all day and what to actually do about it.

---`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "movement",
    series: "Be Kind Rewind",
    seriesOrder: 1,
    tone: "rust",
  },
  {
    slug: "sub-be-kind-rewind-serialisation-the",
    title: "Be Kind, Rewind Serialisation: The Introduction",
    publishedAt: "2026-02-14",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/be-kind-rewind-serialisation-the",
    tags: [],
    excerpt: "Serialisation Part 1: On Utah, video stores, and the Invisible Trade of modern life.",
    body: `A Note Before We Begin:

The response to last week’s announcement to write this book in the open was overwhelming. Thank you. It confirmed that I am not the only one who feels the world has become faster but thinner, and that we all need to be a little braver.

So, let’s get to work.

- -

Below is the Introduction to Be Kind, Rewind.

This is not Chapter 1 (that comes next month), this is the book’s introduction after the index, to set the scene.

This piece of writing attempts to name the feeling we have all been carrying, the sense that, in our rush to make everything seamless, we accidentally smoothed away the things that made life stick.

I call it “The Invisible Trade.”

As you read this, think about your own “friction” moments. The things you hated doing then, but strangely miss now. The waiting, boredom and the silence.

Read it slowly, and if you see yourself in the Utah car or the video store aisle, let me know in the comments.

We start here. Remember, you are writing this with me, let’s get it!

---

Introduction: The Invisible Trade

Book: Be Kind Rewind
Author: Ben Rennie
WordCount: 2,265
Version: 2
Read Time: 9 Minutes
Serialisation: Email 1 The Introduction

It is January 2023. I am in the car with the family, driving through Utah, cutting through the long, white silence between Salt Lake City and the Colorado border. The mountains are endless, the reception is patchy, and the world outside feels vast and untouchable.

Inside the car, it is warm. We are doing what families do to survive a ten-hour drive on the interstate: we are having a sing-along.

A song spills out of the speakers. It starts with a folk strum, building into something anthemic. It sounds familiar; it feels like something we have owned for years, so we join in. The rhythm catches us. My daughter, Pip, is in the back seat, belting it out, hitting the high notes with her eyes closed. We all know the chorus. We know exactly where the drop is coming.

The song fades out, and the cabin settles back into the hum of the tyres. I realise that while I know the melody, and I know the hook, I cannot picture the face of the man who just sang to us.

“Who is that?” I ask Pip. “Who’s singing?”

She looks up, pauses, and gives a small shrug. “I’m not actually sure,” she says. “Let me check.”

She leans forward, tapping the iPhone screen. “It’s a guy called Noah Kahan, Dad, I love him.”

We look at each other. The name means nothing to us (at the time). We shrug again. I decide right then that I love it. We add him to the favourites. We drive on, and Noah Kahan stays in the rotation all the way to Denver.

In one sense, this is a magic trick.

The system worked exactly as it was designed to. Somewhere in a server farm, a recommendation engine analysed the spectral data of our listening history. It noticed our heavy rotation of Zach Bryan. It triangulated that with millions of other users who fit our demographic profile, dads who like Americana, and teenagers who like indie-folk, and it calculated a high-probability match.

It didn’t just guess; it predicted.

It served up the song at the exact moment our attention might have drifted. It was seamless and efficient. It was a zero-friction transaction where we consumed the art without ever needing to introduce ourselves to the artist.

But looking back, that shrug haunts me.

We knew the song, but we didn’t know the story. We had the content, but we lacked the context. The algorithm had solved the problem of discovery, but in doing so, it had removed the necessity of curiosity.

It wasn’t always like this.

I remember a time when knowing a band required more than just hearing them. It required a kind of courtship.

I remember growing up and discovering Michael Hutchence and INXS. My best friend, Jason Stone, once told me, with absolute authority, that INXS was for “older teenagers” and that we were not ready for them yet. I remember looking at the cover and wondering what exactly we weren’t ready for.

I spent hours poring over album covers, decoding the symbols. I unfolded the paper sleeves to discover the lyrics, reading them like they were scripture. I thought about the photographer, the designer, the person who had painstakingly chosen the font.

I knew the artists because I held their work. I knew their words from the printed sheet before I had ever heard them sung.

Before the internet, buying a record or a tape was a pilgrimage. You had to travel to the store. You had to make a choice with the limited money you had earned. You had to judge the album by its cover or by a friend's word.

The friction was the value.

In the car in Utah, the music was effortless and flowed like water. But because there was no cost to acquire it, there was no investment in keeping it. We had traded the friction of discovery for the convenience of the stream. We had the song, but we had lost the story.

The same shift happened in how we watched stories.

I want you to picture a Friday night in the mid-nineties. You are walking into a Video Ezy or a Blockbuster. It is late, perhaps 7:30 PM, and the air smells like a mix of cheap industrial carpet and sweet popcorn. The fluorescent lights hum overhead. You are there for one reason: to choose the two or three films that will define your weekend.

The aisles are lined with shelves, and on those shelves are physical boxes. You walk past the cardboard cutouts of action stars and romantic leads, standing like silent sentinels in the centre of the store.

You pick up a case. It is plastic and slightly padded. You flip it over to read the synopsis on the back. You check the rating. You look at the grainy stills.

If the movie is popular, the shelf might be empty, save for a little plastic tag behind the box that says “Out on Rent.”

Remember the specific pang of disappointment that tag created? It was a physical feeling. You had to pivot. You had to negotiate. You stood in the aisle with your friends or your parents and debated the merits of an action movie versus a comedy. You asked the person behind the counter for a recommendation.

When you finally made a choice, you took the empty display case to the counter, and they swapped it for a heavy cassette in a hard plastic shell. You paid your money. You committed.

This process was full of friction. It took time. It required travel. It involved the risk of a bad choice. But that friction served a function we did not understand until it was gone.

I remember this vividly with a movie called The Crying Game.

It was 1992. The entire world seemed to be whispering about this film. The marketing campaign was brilliant and infuriating. It was built entirely around a secret. The posters literally asked the audience not to spoil the ending.

Naturally, the playground rumour mill was in overdrive.

My best friend, Jason Stone, was the unofficial Associated Press of our high school. One day, he leaned in and whispered the secret code. “She is a he.”

That was it, that was the rumour. “She is a he.”

At sixteen, I didn’t know what that meant. My understanding of gender (at the time) was binary and mostly theoretical. The world hadn’t given me language for anything more nuanced than that. Was it a disguise? Was it a joke?

I had to know. But in 1992, curiosity had a price tag.

I rode my bike to the video store. I paid my five dollars, which was a significant percentage of my net worth. I rented the tape. I rode home. I waited for my parents to go out, and I put the cassette in the machine.

Now, here is the thing about The Crying Game that the internet generation will never experience. It is not a ten-second TikTok reveal.

The first hour of that movie is a slow, character-driven British drama about the IRA, kidnapping, and guilt. It requires patience. In the age of streaming, I would have been bored after fifteen minutes. I would have paused it, opened Wikipedia, read the “Plot” section to find the twist, watched the ten-second clip on YouTube, and moved on.

I would have turned the art into information.

But I had paid my five dollars. I had skin in the game. So I sat there. I watched the protagonist, Fergus, fall in love with Dil. And because the movie was good and I was trapped in the room with it, I started to fall for Dil, too. She was charming, enigmatic, and beautiful.

Then came the scene.

I won’t tell you exactly what happens. If you haven’t seen it, you deserve the same experience I had. But the secret was revealed. The rumour was true.

My fifteen-year-old brain did a somersault. It was a genuine “WTF” moment.

But here is the miracle that friction provided. I didn't turn it off, and nor was I offended; I was curious.

Because I had spent an hour getting to know this person, I couldn’t dismiss her as a punchline or merely a curiosity. I was already invested. I had to sit there and reconcile what I was seeing with who I had come to know.

It was a quiet, internal collision. I sat there in the dark and realised that my understanding of attraction, and of gender itself, was more complicated than I’d been taught. That “woman” was a category bigger and more complex than the narrow definition I’d carried into that room.

It didn’t break my compass. It just widened the map.

If I had Googled the twist, I would have seen the image, but I would have missed the humanity. I would have judged the visual without knowing the person.

The friction of the format and the fact that I had to sit through the slow parts forced me to feel empathy. It forced me to understand the context before I judged the content.

We traded that friction for efficiency. We can now find out “the twist” in three seconds. We can categorise people instantly. But we have lost the long, slow arc of getting to know them first.

We traded the surprise for the spoiler. And in doing so, we made it much harder to be surprised by our own capacity for empathy.

This is what friction does. It creates Skin in the Game.

The “Be Kind, Rewind” sticker on the tape was not just an instruction; it was a reminder that this object belonged to a community. You were a steward of the story for a night, and then you passed it on.

Today, the friction is gone. We have infinite libraries in our pockets and living rooms. We can start a movie, watch for three minutes, get bored, and switch to another. We can scroll through titles for forty-five minutes and watch nothing at all.

This is the trade.

We traded the friction of the video store for the convenience of the stream. In doing so, we traded the depth of our attention for the breadth of our access.

When the cost of entry is zero, the value of the experience often falls to zero. When we can have everything instantly, we stop cherishing anything specifically. Life feels faster, but it also feels thinner. We consume more content than any generation in history, yet we often feel less satisfied by it.

This book is about that trade. It is not just about music or movies. It is about how we learn, connect, pay attention, and build confidence.

We did not lose these human capacities. We simply traded away the environments that sustained them. We accepted the promise of easier lives without reading the terms and conditions.

The good news is that these trades are reversible. Once we see them clearly, once we understand what we gave up to get here, we can begin to make different choices. We can choose to put the friction back in. We can choose to be deliberate.

We can choose to rewind.

We tend to believe that we lost our creativity because we grew up. We think we lost our ability to focus because we became busy. We assume our confidence faded because the world became more complex. We treat these losses as inevitable symptoms of aging or the natural wear and tear of adult life.

That is not true.

We do not grow out of creativity. We are designed out of it.

We do not lose our capacity for attention. We place ourselves in environments that systematically fracture it.

The human brain has not changed significantly in the last twenty years. Our biology is the same. Our fundamental needs are the same. What has changed is the container we live in. We have surrounded ourselves with tools that offer speed and convenience, but we failed to ask what they would ask in return.

There is an old German legend that speaks to this. It is the story of the Faustian Bargain.

In the legend, a scholar named Faust makes a deal with a demon. He is offered unlimited knowledge and worldly pleasures. He is promised that he can transcend the limits of human experience. In exchange, he must give up his soul. He accepts the deal because the immediate gain is tangible and the cost feels abstract and distant. He gets exactly what he asked for, but he loses the part of himself that allowed him to enjoy it. (We will talk more about the Faustian Bargain throughout this book.

We have made a similar bargain in the twenty-first century.

We accepted the smartphone, the algorithm, and the infinite feed. We accepted them because they offered us something miraculous. They gave us the ability to know anything, to reach anyone, and to be entertained anywhere. They solved the problem of boredom. They solved the problem of isolation. They solved the problem of waiting.

But technology is not additive. It is ecological.

When you introduce a new technology into a culture, you do not get the old culture plus the new technology. You get a completely new culture. The technology gives, but it also takes.

We thought we were getting tools that would serve us. We did not realise that in an economy based on attention, we were not the users of the tools. We were the fuel. We were the currency.

For every moment of connection we gained, we traded a moment of solitude. For every ounce of efficiency we gained, we traded the slow, messy process of discovery. For every seamless recommendation we accepted, we traded the agency of choosing for ourselves.

This is the core human cost I explore in this book. It is the loss of agency.

Agency is not just the ability to do what you want. Agency is the lived sense that you are the author of your own experience. It is the confidence that you can shape your environment rather than just reacting to it. It is the difference between driving the car and being a passenger in an autonomous vehicle.

In an accelerated system, we are increasingly becoming passengers. The algorithm chooses the song. The feed chooses the news. The platform chooses the pace. We are moving faster than ever, but we are steering less.

I started writing this book because I began to notice a specific kind of exhaustion in the people around me and in myself.

It wasn’t just that we were busy. It was that we were brittle.

I saw creative directors who had lost the confidence to start a project without first opening Pinterest. I saw friends who could not sit through a dinner without checking a notification. I saw parents, myself included, handing over screens to quiet our children, only to wonder later what muscle we were allowing to atrophy.

I realised we were trying to run ancient biology on modern software, and the system was crashing. We were trying to stay human in an environment designed to make us mechanical.

I wrote this book to find out if there was another way. I wanted to know if it was possible to live in the digital world without losing our analog soul.

The question is not how we destroy these systems. We cannot uninvent the internet, nor should we want to. The question is how we stay human within them.

How do we maintain our ability to think deeply when the world demands we skim? How do we build creative confidence when the tools do the work for us? How do we reclaim our attention when the smartest minds in the world are paid to steal it?

We do it by noticing the trade.

We do it by recognising that friction, effort, and slowness are not inefficiencies to be eliminated. They are the essential conditions for human growth.

When we walked into that video store in 1995, the “Be Kind, Rewind” sticker was a request for courtesy. Today, it is a philosophy for living.

To rewind is not to retreat. We are not trying to build a time machine. We cannot go back to 1995, nor should we want to. The medicine has improved. The access to knowledge is miraculous. We do not want to live in the past. We want to carry the wisdom of the past into the future.

When you press the rewind button, the world outside does not stop. Time continues to move forward. The tape spins backward, but the clock ticks on.

The act of rewinding is simply a choice to pause the rush. It is a decision to go back and retrieve something we left behind. We go back to recover the context, the patience, and the friction that made the story meaningful in the first place.

We rewind so that we can be ready to play the movie again, properly this time.

It is a deliberate choice to take the slower, harder way because that is where the meaning lives. We stay human in accelerated systems by refusing to be passive. We stay human by remembering that we still have the power to choose.

We stay kind. And we rewind.

END INTRO

---

NEXT CHAPTER: PART ONE, CHAPTER ONE: What the Body Knew All Along

---

The Margins Are Open

This is where the ink dries, and the conversation begins.

This Introduction is free for everyone because I believe we all need to understand the ‘Invisible Trade.’

However, Chapter 1 (What the Body Knew All Along) will be available shortly and will be for Paid Subscribers only.

Furthermore, only Paid Subscribers can comment below to share their stories and earn a ‘Co-Author’ credit in the final book. If you want to be in the margins with me, upgrade today.

As I mentioned in the launch, I am not writing this book in a vacuum. I am writing it with you.`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "community",
    series: "Be Kind Rewind",
    seriesOrder: 0,
    tone: "sand",
  },
  {
    slug: "97p-im-writing-my-next-book-in-public",
    title: "I’m Writing My Next Book in Public (And I Want You in the Margins)",
    publishedAt: "2026-02-10",
    source: "97percent",
    sourceUrl: "https://97percent.co/im-writing-my-next-book-in-public/",
    tags: ["Creativity", "Culture", "Design", "Writing", "Books", "Newsletter", "journal"],
    excerpt: "I am writing my next book out in the open. Also known as Book Serialisation. Chapter by chapter, month by month, with all of you watching (and hopefully, contributing).",
    body: `I am writing my next book out in the open. Also known as Book Serialisation. Chapter by chapter, month by month, with all of you watching (and hopefully, contributing).

There is no safety net here. There is no finished manuscript hiding in a drawer waiting for a launch date. There is just the raw work, the research, and the inevitable moments where I realise I have taken a wrong turn and need to start again.

Subscribe

This is an experiment in creative bravery, and I am inviting you to be part of it.

From Analogic to Be Kind, Rewind

When I started this project in mid 2025, the working title was Analogic.

It felt smart. It felt like a book about creative systems and technical shifts. But the more I wrote, the more I realised that the title was too cold. It didn’t capture the heart of what we have actually lost.

Sure, of course, we are dealing with a shift in technology, but we are, in reality, dealing with a shift in humanity.

So, the book feels different; it has a new name: Be Kind, Rewind (and there's a good chance that could change, too).

It is named after the sticker on the VHS tapes we used to rent on Friday nights. That sticker was more than an instruction to a machine. It was a request for courtesy. It was a reminder that we were stewards of a story and had a responsibility to the next person in line.

This is a book about “The Invisible Trade”

Be Kind, Rewind is a book about the Invisible Trades we made when we moved from the physical world to the digital one.

It explores the quiet exchange we make when technology gives us speed, access, and convenience while taking things we didn’t realise were currency. A few examples that spring to mind are:

 * We traded friction for convenience. We forgot that the effort of going to the video store or the record shop was what created the value of the experience.
 * We traded boredom for stimulation. We filled every gap in our day with content, designing out the very conditions that allow creativity to happen.
 * We traded agency for algorithms. We stopped exploring the territory and started following the blue line on the screen.

I am working with universities to conduct research on what is actually happening to our brains during these shifts. We are looking at the trade so we can negotiate a better deal.

Why I Need You (The Co-Author Promise)

Writing a book about the loss of community, only to lock myself away in isolation to write it, felt like a contradiction.

The medium is the message.

This book needs to be written slowly. It needs to be written in public. And it needs to be written with you.

This is not a rhetorical trick. I am looking for actual collaborators.

 * If you share a story in the comments that perfectly illustrates a point, I want to include it.
 * If you push back on a theory and change my mind, I want to give you credit.
 * I may even interview you to explore your experiences with these shifts in more depth.

Every contributor who helps shape the final manuscript will be acknowledged in the book. We are building this village together.

The Schedule

This is for paid subscribers and anyone who has purchased the Creator Kit book bundle. If you are already supporting the work here, you are automatically in.

Here is the rhythm we will follow:

 * First Sunday of the Month: A full, new Chapter. This is the deep work.
 * Third Sunday of the Month: Field Notes. This is the raw research. It might be a study I’m reading, a paradox I can’t solve, or a question I need you to answer.

You read it, you respond, and the book shifts based on the conversation.

Eventually, I will take this collaborative manuscript, refine it, and work with my publisher to make it into something beautiful, a physical object with the tactile goodness this book is actually about.

But right now, it lives here. With you in progress.

What I Need From You

Read the chapters and feel free to tell me what lands and what drifts, and of course, challenge the logic.

We are exploring what happens when we trade depth for speed, and I am choosing to go a little slower on this one.

Chapter 1: What The Body Knew First drops this Sunday for all paid subscribers.

Let’s rewind.

Subscribe`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "community",
    tone: "cream",
  },
  {
    slug: "sub-im-writing-my-next-book-in-public",
    title: "I’m Writing My Next Book in Public (And I Want You in the Margins)",
    publishedAt: "2026-02-09",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/im-writing-my-next-book-in-public",
    tags: [],
    excerpt: "I am doing something I have never done before. Honestly, it scares me a little.",
    body: `I am writing my next book out in the open. Also known as Book Serialisation. Chapter by chapter, month by month, with all of you watching (and hopefully, contributing).

There is no safety net here. There is no finished manuscript hiding in a drawer waiting for a launch date. There is just the raw work, the research, and the inevitable moments where I rea…`,
    bodyAvailable: "preview-only",
    type: "newsletter",
    category: "design",
    tone: "dark",
  },
  {
    slug: "sub-make-culture-creative-again",
    title: "Make Culture Creative Again",
    publishedAt: "2026-01-28",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/make-culture-creative-again",
    tags: [],
    excerpt: "Even failures and broken starts will be more interesting than the boring stuff.",
    body: `- -

It started in my living room with a question that made me feel a thousand years old.

My youngest daughter, Pip, had some friends over. They were standing there, looking cool and detached, wearing the uniform of the modern teenager: vintage band T-shirts. One was wearing a Def Leppard shirt, a band I love, mostly because slow-dancing to “Hysteria” at scho…`,
    bodyAvailable: "preview-only",
    type: "newsletter",
    category: "community",
    tone: "sand",
  },
  {
    slug: "97p-make-culture-creative-again",
    title: "Make Culture Creative Again",
    publishedAt: "2026-01-28",
    source: "97percent",
    sourceUrl: "https://97percent.co/make-culture-creative-again/",
    tags: ["Creativity", "Culture", "Design", "Newsletter", "Migrated-1773129112991", "Import 2026-03-10 18:55"],
    excerpt: "It started in my living room with a question that made me feel a thousand years old.",
    body: `It started in my living room with a question that made me feel a thousand years old.

My youngest daughter, Pip, had some friends over. They were standing there, looking cool and detached, wearing the uniform of the modern teenager: vintage band T-shirts. One was wearing a Def Leppard shirt, a band I love, mostly because slow-dancing to “Hysteria” at school discos is a core memory I can’t scrub from my brain. The other was wearing Nirvana.

“The one-armed drummer,” I said, pointing at the Leppard shirt. “So good.”

She looked at me blankly. “Um, what?”

“Def Leppard,” I said. “The drummer has one arm.”

She blinked. “What the hell is a Deaf Leopard?”

I shifted my attention to the other friend, hoping for a win on home soil. “Smells Like Teen Spirit,” I said confidently.

Her reply was instant. “Um, what?”

“All Apologies,” I tried.

They both looked at Pip, silently begging for an exit strategy from her strange, weird dad. As they left the room, I looked at my wife, Nicola. She saw the look in my eye, the dad about to launch into a lecture on grunge history, and immediately said, “Do not quote ‘Rape Me’.”

“Come As You Are,” I whispered to the empty room.

It is a funny moment, but it points to something deeper, something W. David Marx wrote about recently in The Atlantic. He noted that “Kurt Cobain would have wanted the next generation’s musicians and listeners to kill their idols, including him. Instead, they wear his face on T-shirts.” It raises the question of why Cobain’s image endures while his spirit of rebellion fades. Perhaps it’s easier to commercialise a face than embody a challenging ethos. This invites us not just to wear symbols of the past, but also to question the culture of consumption behind their popularity.

We have turned revolution into aesthetics. We have turned the raw, dangerous energy of creativity into a costume we can buy at the mall. Marx argues that “everyday life has never contained more stuff than an endless reel of words, ideas, games, songs, videos”. We are drowning in content, yet we are starving for something that feels new.

Why? Because to make something new requires “the imagination to reject kitsch” and pursue “complexity, ambiguity, and formal experimentation”. That pursuit is terrifying. It is safer to wear the T-shirt than to risk what it represents. It is safer to scroll than to create.

We stop chasing curiosity because we hit the wall of fear. But there is a specific, electric tension between the safety of what we know and the pull of what we don’t. This tension isn’t a barrier; it’s the spark that ignites our creativity. Instead of freezing at the wall, we can choose to lean into the tension and let it fuel our journey forward.

There is a story about Dave Grohl that haunts me. After Kurt died in 1994, Dave vanished. He couldn’t listen to music. He couldn’t play. He ran as far away as he could, eventually finding himself driving a rental car through the Ring of Kerry in Ireland. He was trying to disappear into the landscape. One afternoon, driving down a country lane in the middle of nowhere, he saw a hitchhiker. As he got closer, he realised the kid was wearing a Kurt Cobain T-shirt.

That was the moment. Grohl realised he couldn’t outrun it. The past always catches up to us. The only way through it was to make something new. He went home and started the Foo Fighters. He let the curiosity of “what’s next” win over the fear of “what was.”

I know that tension intimately. My first official date with my wife, Nicola, was supposed to be at the Foo Fighters concert. But that night never happened. My best friend, Corey Doyle, had chosen to end his own life. His wake fell on the same night.

I ended up taking Nicola to Corey’s wake as our first date.

It was a heavy, surreal way to start a relationship. We were skipping a band whose lead singer had chosen to end his life, because my friend had chosen the same. But in the middle of that tragedy, something shifted. At the wake, Nicola met Corey’s dad, Peter. It turned out that my wife (who is from London) knew a bunch of Corey’s friends, and Peter had gone to school with my now father-in-law.

It was all by chance. It was the connection that drew us together. Through the cracks of a massive tragedy, a new future began to blossom.

I have a tattoo on my wrist in memory of Corey. I think of him all the time. But that experience taught me that life isn’t happening to us; it is happening for us. Even the hard parts. Especially the hard parts. When we lean into that belief, we find abundance in our relationships and in our communities.

Fast-forward to yesterday, I was sitting at a lunch with a client, Katie, eating Japanese King Prawns. We were talking about this exact thing, the struggle to move forward when the path isn’t clear.

“Creativity is a new path to a known destination,” I said.

Katie paused. She looked at me over her chopsticks, holding a very large sweet-and-sour King Prawn. “Who said that?”

“Who said what?” I asked.

“Creativity is a new path to a known destination,” she repeated. “Who said it?”

I smiled. “That was me. I said that. It’s in my book.”

“Nice,” she said. “Very nice.”

I didn’t say it to be clever. I said it because I believe it is the only way to navigate the tension. We usually know the destination we want to connect, we want impact, we want to feel alive. But the old paths are blocked by fear or paved over with kitsch. Creativity is the courage to bushwhack a new trail. Imagine a moment where you have an idea, a rough, unpolished thought, and you consider sharing it with a friend. It’s a small step, but for most, it’s a giant leap over fear. This simple act of sending it out into the world, unsure of the reception, is what I mean by creating a new path. It’s the first step towards exploring the unknown and igniting a spark of creativity.

Steven Johnson calls this the ‘Adjacent Possible.’ He argues that at any given moment, the world is capable of extraordinary change, but only certain changes can happen. We can only open the doors that are right next to us. Imagine it like levelling up in a video game; you can’t jump ahead to the end without first unlocking and exploring the adjacent, interconnected rooms. You can’t teleport from the cave to the skyscraper; you have to invent the mud brick, then the arch, then the steel beam.

Fear tells us to stay in the room we are in. Fear tells us the next door is locked, or dangerous, or that we aren’t smart enough to open it. Curiosity is just the willingness to turn the handle.

When we exist in that middle ground that messy, uncomfortable space between the fear of failure and the curiosity of the adjacent possible, we find Creative Confidence.

And let’s be clear about what that means. Creative Confidence isn’t about being an “artist” in the gallery sense. It isn’t about painting a masterpiece or writing a symphony. It is simply the belief that we have the right to create in the first place. It is the audacity to stop consuming the endless reel of other people’s ideas and contribute one of our own.

When we find that confidence, the fear dissipates. We realise that the scroll is just noise. We realise that the “one-armed drummer” isn’t just a piece of trivia, but a testament to keeping the beat going when everything falls apart. We stop wearing the T-shirt as a costume, and we start living the life it represents.`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "community",
    tone: "cream",
  },
  {
    slug: "sub-be-kind-rewind",
    title: "Be Kind Rewind",
    publishedAt: "2026-01-14",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/be-kind-rewind",
    tags: [],
    excerpt: "- -",
    body: `- -

It’s 1993. The carpet is rough under my elbows. The CRT television's heavy warmth is radiating into the room.

I can still hear the specific, high-pitched whine of the VCR motor straining against the plastic gears. That sound didn’t just mean the movie was over; it was the audible death of Saturday night. It dragged me back from the neon streets of Jurass…`,
    bodyAvailable: "preview-only",
    type: "newsletter",
    category: "community",
    tone: "sand",
  },
  {
    slug: "97p-be-kind-rewind",
    title: "Be Kind Rewind",
    publishedAt: "2026-01-14",
    source: "97percent",
    sourceUrl: "https://97percent.co/be-kind-rewind/",
    tags: ["Creativity", "Design", "Newsletter", "Migrated-1773129112991", "Import 2026-03-10 18:55"],
    excerpt: "It’s 1993. The carpet is rough under my elbows. The CRT television's heavy warmth is radiating into the room.",
    body: `It’s 1993. The carpet is rough under my elbows. The CRT television's heavy warmth is radiating into the room.

I can still hear the specific, high-pitched whine of the VCR motor straining against the plastic gears. That sound didn’t just mean the movie was over; it was the audible death of Saturday night. It dragged me back from the neon streets of Jurassic Park to the beige reality of my living room.

Even after the film ended and the credits rolled, the ritual wasn’t done. I had to sit there for three dead minutes, watching the mechanical counter tick backward to zero while the tracking lines danced on the screen. The blue-and-white sticker on the cassette case frayed at the edges and smelled faintly of stale plastic, staring back with a simple command:

Be Kind Rewind.

We didn’t do it just because we feared the fifty-cent surcharge or the stern look from the staff. We did it because it was part of an unspoken social contract, a small act of civic maintenance that kept the system running for everyone else. You knew that if you returned a tape halfway through the third act, you were stealing time from the next person and passing on a burden that wasn’t theirs to carry. Rewinding was an act of invisible service for a stranger you would likely never meet, a way of saying that you valued their experience as much as your own.

My final memory of the video store era isn’t a warm, fuzzy montage of popcorn and laughter. It was a stand-off.

It was 2018. I was standing at the counter of our local store, wallet out, with Miffy, Kai, and Pippy lined up behind me like a phalanx of hopeful soldiers. They had their pick: Ready Player One (a great film, an ironic choice). We were ready for the ritual. But the gatekeeper, a girl no older than fifteen, stopped us cold.

“Sorry, mister,” she said, delivering the fatal blow. “But you are now banned. Too many late fines.”

We had left a few rentals at home during a trip away, and the late fees had metastasised into a precise and devastating sum: sixty-six dollars. It was my third warning. The ban was absolute. (Or maybe it was just a jagged Post-it note the manager left on the monitor that said DO NOT RENT TO THIS GUY).

In a digital world, that would be the end of the story. Game Over. Your account is locked, the screen goes black, and no one hears your side. But this was the analog world, and I was standing before a human being.

I didn’t walk out. I stayed. I looked around, genuinely awkward, feet glued to the linoleum. I really didn’t want to leave. The kids’ faces (aged 14, 11, and 8) just stared up at me in total horror.

“Banned?” Pippy whispered in a tone usually reserved for natural disasters. “From a video store? What on earth will we do now, Dad?”

I looked at the girl behind the counter. She looked at the kids. I thought, That’s it. This isn’t the end. It can’t be.

So we entered into a negotiation. I paid the sixty-six dollars, a painful penance. I offered a sincere apology. I explained the mistake, acknowledged the rules, and promised to have this film back on time, this time tomorrow, or else.

The ban was lifted. We walked out with our movie, clutching the plastic case like a trophy. My kids learned that day that sometimes an apology is a form of rewinding. It is a way to go back, fix the track, and prepare the ground for what comes next.

That friction is entirely gone now. We have traded the awkward human encounter for the seamless, lonely drift of the scroll. The digital world does not want you to rewind because it does not want you to pause. The algorithm is built on a philosophy of infinite forward motion, where the next video plays before you have processed the last one, and the feed refreshes before you can decide to leave. We traded the mechanical inconvenience of the rewind button for the seamless convenience of the slipstream, but we lost something vital in the exchange. We lost the moment of pause that allows empathy to breathe.

I have spent a lifetime hacking my own brain with this kind of voluntary friction because I realised early on that if I wanted to learn something real, I had to make it harder for myself, not easier. When I learned to touch type, I didn’t use a gamified app with rewards and badges. I put tape over the keys of my computer. I forced myself to stare at the screen, trusting my fingers to find the geography of the board without the visual crutch. I can still write on a Mac today without looking down because I spent weeks looking at nothing but masking tape. When I needed to fix my tennis serve, I didn’t just play more games where the score mattered. I hired a ball machine and hit three hundred serves to no one. Just the toss, the swing, and the thwack, over and over again.

Researchers have a name for this. They call it desirable difficulty. Robert Bjork at UCLA spent decades studying how people learn and found that when we remove all the friction from the learning process, we actually retain less. The struggle is not a bug in the system. It is the system. The tape on the keys, the three hundred serves to an empty court, the three minutes watching the VCR counter tick backward, these moments of productive friction are what encode the lesson into muscle memory and mental habit.

These are analog ways of teaching yourself that the result depends entirely on the preparation. You have to put the tape on the keys and hit the balls into an empty court. You have to rewind the tape so the movie is ready for the next viewing. It is about understanding that we have agency in how we learn and how we interact. We built the house we live in.

I saw this play out vividly when I was coaching a design program a few years ago. My cohort consisted of brilliant visual thinkers, people who could solve complex problems with shape and colour, but when it came to writing, they froze. They arrived with the same defensive shield: “I am not a writer.” They treated writing as a foreign country they had no passport for. But the program wasn’t about grammar; it was about thinking.

I watched these designers struggle with blank pages in a way they never did with a canvas. They’d write a sentence, dislike it, and delete it. They were afraid of looking foolish and of the awkwardness that comes before clarity. But over time, they saw that “bad” writing was the path to “good” thinking. They had to be willing to be wrong on the page before they could get it right. They learned that the “rewind” (the pause to think, organise, and care about the message) wasn’t wasted time. It was the real work.

We live in a moment when looking dumb is the ultimate sin, and we have built tools to ensure we never have to experience it. I am writing this right now with tools that check my spelling and smooth out my grammar. Sure, I use AI as a coach to bounce ideas off. These are incredible utilities. But there is a dangerous line we are flirting with. We are beginning to outsource both the thinking and the typing.

When we let an algorithm predict our next word, write our emails, or shape our whole worldview, we skip the hard parts. We skip the “garbage paragraph” I always write at the start of an article, the one I delete once I find my flow. That messy paragraph matters because it’s where I figure out what I really think. If a machine writes it for me, the result might look better, but I lose the chance to discover my own ideas.

Early research is backing this up. Studies from places like MIT and Stanford are showing what many of us already suspect: when we outsource word prediction and sentence completion, we are, sure, saving time. But we are offloading some of the cognitive work that makes thinking ours. The act of searching for the right word, of hitting a dead end and backtracking, of rewriting the same sentence five times until it sounds like you: that is not inefficiency. That is how we figure out what we actually mean.

We need to ask ourselves a hard question: Do you still know what you are about?

In a synthetic world, the most radical thing you can be is human, and being human means being occasionally clumsy. It means stumbling and having a thought that isn’t fully formed, and taking the time to wrestle with it. It means being willing to sound a little dumb in the first draft so you can sound like yourself in the final one. We need to be okay with making mistakes because mistakes are the friction that proves we are actually here.

We often talk about social media companies and AI models as if they are weather systems, forces of nature we just have to endure. We forget that they are businesses and we are the customers. We are the ones who decide how we engage. The algorithm might reward outrage and speed, but we possess the agency to choose kindness and slowness. We can choose to be the friction in the system.

“Rewinding” in 2026 means reading the post that made you angry and then waiting. It means letting the tape spin back to the start before you type. It means realising that the person on the other end is not a username to be defeated, but a neighbour in a digital community that is rapidly running out of good soil. It means checking in on a friend without an agenda, not with a “like” on their photo, but with a text that asks how they really are.

We don’t have the stickers on the cassette cases anymore, and we don’t have the fifteen-year-old at the counter to enforce the rules. We have to build the guardrails ourselves. The world is moving at infinite speed, and the bravest, most creative thing you can do is refuse to keep up. We have the power to enrich the soil of our communities, but only if we take the time to prepare the ground.

Be kind. Pause. Rewind.`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "community",
    tone: "cream",
  },
  {
    slug: "97p-creative-2026-reset",
    title: "Creative 2026 Reset",
    publishedAt: "2026-01-05",
    source: "97percent",
    sourceUrl: "https://97percent.co/creative-2026-reset/",
    tags: ["event", "past"],
    excerpt: "THE CREATIVE RESET 2026",
    body: `THE CREATIVE RESET 2026

Welcome to the Rennie Creative Lab 2026 Reset

Since 2014, we've helped companies see in the new year with a plan of attack. Sometimes that means removing things, sometimes it means adding stuff in. Either way, every successful company starts with a plan, and this is our night to create our own strategy, for anyone interested in creating something bigger, smarter, more creative, more important or just someone looking for some practical inspiration on setting the year up right. Rennie Lab (Reny) has worked strategically with companies across Sydney, New York, London, Milan, San Francisco, Salt Lake City, Los Angeles, and Copenhagen, we got good at establishing creative goals that actually stick. So we opened it up.

This is a group of 24 people committed to one night and three check-ins throughout the year. Essentially, 12 months of planning and review. We meet in person on February 5 over good food, then quarterly throughout the year to share stories, problem-solve, and create impact. 24 people. First in, first served.

For less than the price of a standard consulting hour, you get a full day of strategy, catering, and materials.

WHY THIS EVENT MATTERS

Most people start the year with vague intentions and no structure. By March, those intentions are gone. This evening gives you the space, the tools, and the accountability to actually design your year instead of reacting to it.

Then we stay connected. The Class of '26 checks in together every quarter. You're not doing this alone.

If you showed up last year, you know. If you didn't, trust the people who did.

Last year sold out in 2 days. Don't wait.

WHAT IS THIS EVENT?

A structured, intimate evening where 24 people do the hard work of figuring out what 2026 should actually look like. You'll work through your goals, build a creative manifesto that means something (to you), and leave with clarity on where you're going and why.

We're using the same framework we use with our advisory clients: Horizons, Directions, Reflections, Connections, and Junctions. This is the work.

Then you're joining the Class of '26. We check in together on Zoom at the end of each quarter throughout the year. Accountability, progress, real connection. This is your cohort for the year ahead.

A 1-Page 2026 Roadmap: A documented plan for you, or your team/business.

The "Creative Reset" Framework: The exact tool I use to diagnose creative blocks.

Peer Validation: Your strategy will be stress-tested by 23 other high-level leaders, so you know it works before you implement it.

WHO IS SPEAKING?

Ben Rennie — Founder and author of Lessons In Creativity, and Chair of Design Declares Australia. He's worked with Nike, Patagonia, Chanel, and some of the world's most important companies across five continents. He's spent two decades figuring out how creativity, business, and climate action can work together. Now he's sharing that framework with you.

Lucy Rouse — Former Vice President at Nike Global, based in New York City. Lucy spent years leading innovation and strategy at one of the most iconic brands on the planet. She'll share stories, insights, and honest answers during dinner.

Secret Guest — Announced soon.

WHAT WE ARE EATING

Sit-down dinner. This is about conversation, connection, and the work. We'll use the time to write, challenge, and inspire as we eat, including a Q&A with Lucy Rouse from Nike.

When Do We Meet After?

Every three months. Four meetings total throughout 2026.

What You're Taking Home

 * A signed copy of Lessons in Creativity by Ben Rennie
 * Rennie Lab Notebook
 * Rennie Lab Wrist Band (Creative 26)
 * The "CREATIVE DIRECTOR" T-Shirt (order after the evening)
 * Goodies from our friends and partners

These are tools you'll actually use.

THE DETAILS

When: Thursday, February 5, 2026
Time: 6:00pm – 9:30pm
Where: Ace Hotel, Sydney
Seats: 24 only
Price: $495 (For less than the price of a standard consulting hour, you get a full day of strategy, catering, and materials).

This includes the full workshop program, two guest speakers, dinner, drinks, everything you're taking home, and quarterly check-ins throughout 2026.`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "design",
    tone: "ink",
  },
  {
    slug: "sub-the-invisible-ingredient",
    title: "The Invisible Ingredient",
    publishedAt: "2025-12-18",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/the-invisible-ingredient",
    tags: [],
    excerpt: "- -",
    body: `- -

I was planning on writing about the “perfect practice makes perfect” myth this week.

You know the one. Some mediocre coach with the nerve to tell kids, or amateur athletes, or anyone really, that it’s not just practice that matters, but perfect practice. I remember hearing that phrase for the first time, and I was frozen to the spot. It was a sentence th…`,
    bodyAvailable: "preview-only",
    type: "newsletter",
    category: "design",
    tone: "dark",
  },
  {
    slug: "97p-the-invisible-ingredient",
    title: "The Invisible Ingredient",
    publishedAt: "2025-12-18",
    source: "97percent",
    sourceUrl: "https://97percent.co/the-invisible-ingredient/",
    tags: ["Creativity", "Humanity", "Newsletter", "Migrated-1773129112991", "Import 2026-03-10 18:55"],
    excerpt: "I was planning on writing about the “perfect practice makes perfect” myth this week.",
    body: `I was planning on writing about the “perfect practice makes perfect” myth this week.

You know the one. Some mediocre coach with the nerve to tell kids, or amateur athletes, or anyone really, that it’s not just practice that matters, but perfect practice. I remember hearing that phrase for the first time, and I was frozen to the spot. It was a sentence that almost made me want to quit sports altogether.

What about fun practice? What about gamified practice? What about just doing it because some people can’t even get out of bed in the morning? The whole thing reeked of someone who’d never really struggled, never really failed, standing there demanding perfection from people just trying to figure things out.

But then my writing stopped.

Somewhere between New York City, where I was absolutely losing my mind in one of the most community-minded, beautiful, chaotic human cities on earth, and Nebraska, where I landed to see my boy and watch him play basketball.

I don’t need to relive or retell what happened back home in Bondi Beach while I was sleeping on the other side of the world. But I can tell you this: my fingers stopped typing, my heart started beating faster, and all I wanted to do was find my son and hug him.

So instead of writing about perfect practice, I started writing this (below).

Take two: I spent this week in New York with one of my clients and her team. We’ve been professional colleagues and friends for over two years now, and she flew me to NYC to help her tech company plan 2026. Our relationship is built on mutual trust, connection, and a shared purpose. We’re aligned on creativity and making something meaningful together. That’s the foundation. Everything else is just context.

She’s Jewish. I’m an atheist. We see the world through different lenses, and that’s never been a problem. My lack of religious faith doesn’t diminish hers, and her Judaism doesn’t challenge mine. We are who we are, and we respect each other completely.

I take a deep interest in all my friends’ faith. Our LDS friends in Salt Lake City, whom we love dearly; our Jewish friends in Sydney and New York; our Muslim friends in Sydney, Lebanon, London, and LA; and our Christian and Catholic friends all over the world, among others.

I’m interested in you. I’m interested in your faith. I’m interested in your passions and what makes you who you are. That’s what connection looks like to me.

In 2025, we started working with Farmers Footprint. The introduction came through one of my favourite humans, Dave Murphy from ReWild Projects. Zach Bush, the founder of Farmers Footprint, in turn, introduced me to new ways to imagine our gut health, and his comparison of the gut to the earth, and in particular the soil, was life-changing for me.

It forever altered the way I consume food. Without good soil, we don’t really have a good anything. Zach talks about the microbiome in our gut the same way he talks about the microbiome in the earth. When we poison one, we poison the other. When we heal one, we create conditions for the other to heal too.

My work with Farmers Footprint led to the creation of a new series for them, a podcast called The Invisible Ingredient, which talks about Glyphosate and how glyphosate, basically Roundup, is killing us slowly. The science is hard to argue with. It’s in our food and in our bodies, and people downstream from farms are dying from this.

We don’t see it. We can’t pronounce it. So people don’t really see it as a threat. But it is killing us daily and harming our children every single day.

Glyphosate kills.

So does violence. Men with guns. White men, brown men, black men. Sometimes women, too. When that harm is visible, when we can see the source of the pain, we name it for what it is. We call it terror and murder. We grieve and seek accountability.

But the invisible threats, the ones we can’t see or pronounce or fully understand, slip past us. They become normalised, acceptable losses, until one day we wake up and realise what we’ve done to ourselves and to our kids.

Since Bondi, I’ve been thinking about another invisible ingredient. Kindness. Basic human decency and the willingness to see each other as people instead of problems.

I’m sitting in LAX writing this, fresh from Nebraska. I look around this airport, and I can’t help but think about that opening scene from Love Actually. The one at the arrivals gate at Heathrow. Love is all around. People greeting each other, holding each other, coming home to someone who matters.

As men, we need to be more vulnerable. We need to share pain instead of burying it. We need to be kinder, not just to our neighbours but to ourselves, too. While some world leaders lead with division and hate, with borders and walls and us-versus-them, we can choose something different.

I am learning, at the tender age of 50, that the soil is everything.

Without healthy soil, nothing grows. You can’t force food to grow in poisoned ground. You can’t manufacture health in dead earth. The soil needs to be rich, alive, teeming with the kind of invisible life that makes everything else possible.

We are the soil of our communities. We’re either enriching the ground we stand on, or we’re poisoning it.

Every time we show up for our youth, our sporting teams, our schools, our arts, our neighbours, we’re adding something vital to the earth beneath all of us. Every time we choose connection over isolation, vulnerability over performance, kindness over indifference, we’re feeding the microbiome that holds everything together.

You can’t grow healthy kids in dead communities. You can’t grow culture, safety, or belonging in places where people have stopped caring about each other. Just like glyphosate, hate, division, and neglect poison the soil. They kill the invisible networks that keep us alive.

The invisible ingredient is connection. The willingness to be part of the ecosystem rather than stand apart from it. The recognition that we’re not separate from each other, that what happens to you happens to me, that we’re all downstream from someone and upstream from someone else.

We are the soil. We hold each other up. We create the conditions for what grows or dies in our communities. And right now, we need to decide what we’re adding to the ground beneath us.

I’m choosing connection. I’m choosing kindness.

To my friends, loved ones, and the neighbours I haven’t met yet in Bondi and greater Sydney of all races and religions. I stand beside you in solidarity. And I will be better tomorrow for you, because of you, right beside you.`,
    bodyAvailable: "full",
    type: "newsletter",
    category: "design",
    tone: "ink",
  },
  {
    slug: "sub-time-after-time-after-time-after",
    title: "Time After Time After Time, After!",
    publishedAt: "2025-12-11",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/time-after-time-after-time-after",
    tags: [],
    excerpt: "Creativity is the audacity to believe you should do it in the first place.",
    body: `- -

Here is what a song can do, or more specifically, the profound importance of a single moment in time.

It’s 10 pm on a Friday in Penrith. The school dance is in full swing under a cloud of smoke machines and dim lights. In his infinite wisdom, the DJ calls out for the “Men in the room to grab their girls.”

(Sidebar here: My kids’ disgust for sexism and cha…`,
    bodyAvailable: "preview-only",
    type: "newsletter",
    category: "design",
    tone: "dark",
  },
  {
    slug: "97p-time-after-time-after-time-after",
    title: "Time After Time After Time, After!",
    publishedAt: "2025-12-11",
    source: "97percent",
    sourceUrl: "https://97percent.co/time-after-time-after-time-after/",
    tags: ["Creativity", "Humanity", "Newsletter", "Migrated-1773129112991", "Import 2026-03-10 18:55"],
    excerpt: "Creativity is the audacity to believe you should do it in the first place.",
    body: `Creativity is the audacity to believe you should do it in the first place.`,
    bodyAvailable: "preview-only",
    type: "newsletter",
    category: "design",
    tone: "ink",
  },
  {
    slug: "sub-humping-elvis-and-the-right-to-be",
    title: "Humping Elvis & The Right to Be Wrong",
    publishedAt: "2025-12-03",
    source: "substack",
    sourceUrl: "https://benrennie.substack.com/p/humping-elvis-and-the-right-to-be",
    tags: [],
    excerpt: "We trust the work because we trust the struggle.",
    body: `- -

In 1993, I was sporting a hairstyle reminiscent of Jason Donovan from Neighbours, a spiked blonde mullet that I was convinced was the source of my power. My form on the dating scene was solid (I’d had two dates in a month), so naturally I took my chiselled jawline and bad streaked hair to a modelling agency. I walked in expecting to be the next face of …`,
    bodyAvailable: "preview-only",
    type: "newsletter",
    category: "design",
    tone: "dark",
  },
  {
    slug: "97p-humping-elvis-and-the-right-to-be",
    title: "Humping Elvis & The Right to Be Wrong",
    publishedAt: "2025-12-03",
    source: "97percent",
    sourceUrl: "https://97percent.co/humping-elvis-and-the-right-to-be/",
    tags: ["Creativity", "Artificial Intelligence", "Design", "Systems", "Newsletter", "Migrated-1773129112991", "Import 2026-03-10 18:55"],
    excerpt: "We trust the work because we trust the struggle.",
    body: `We trust the work because we trust the struggle.`,
    bodyAvailable: "preview-only",
    type: "newsletter",
    category: "design",
    tone: "ink",
  },
];

// Hero images scraped from each post's og:image meta tag.
// Hot-linked from substackcdn.com / storage.ghost.io for now — swap to
// self-hosted /public/journal/{slug}.jpg if the carbon claim tightens.
const IMAGES_BY_SLUG: Record<string, string> = {
  "sub-higher-ground": "https://substackcdn.com/image/fetch/$s_!PzJl!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc30dac0a-0a73-477f-8003-cce9a38d6062_1500x800.png",
  "97p-7-websites-for-creative-inspiration": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/2026/03/ewrqrwg.jpg",
  "97p-7-websites-every-first-time-author-needs-to-know": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/size/w1200/2026/03/authors-network.jpg",
  "97p-7-websites-that-take-creativity-seriously": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/size/w1200/2026/03/Creativeb8923.jpg",
  "97p-97-recommends-9-books-on-creative-resiliance": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/2026/03/4024.webp",
  "97p-97-recommends-10-books-on-creative-culture": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/size/w1200/2026/03/jdnhbwydgfwe.webp",
  "97p-97-recommends-10-books-on-creative-leadership": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/size/w1200/2026/03/DSC04187.webp",
  "97p-97-recommends-7-books-on-creative-thinking": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/size/w1200/2026/03/qlbook.jpg",
  "97p-97-recommends-10-books-on-creative-practice": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/2026/03/download--1-.jpeg",
  "97p-97-recommends-10-books-on-creative-confidence": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/size/w1200/2026/03/isaren38828348.webp",
  "97p-test-post-1": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/size/w1200/2026/03/BR_DSC06157_W1-1.jpg",
  "97p-im-writing-my-next-book-in-public": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/2026/03/https-3a-2f-2fsubstack-post-media-s3-amazonaws-com-2fpublic-2fimages-2fbaeefb71-fe42-40cd-b488-7c06e74bcf7e_1920x1080-jpeg.jpg",
  "sub-im-writing-my-next-book-in-public": "https://substackcdn.com/image/fetch/$s_!Bf4B!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbaeefb71-fe42-40cd-b488-7c06e74bcf7e_1920x1080.jpeg",
  "sub-be-kind-rewind": "https://substackcdn.com/image/fetch/$s_!I9KD!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7d20d99f-f5fc-4c3e-b046-c15dbfafe329_2000x1200.png",
  "97p-be-kind-rewind": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/2026/03/https-3a-2f-2fsubstack-post-media-s3-amazonaws-com-2fpublic-2fimages-2f7d20d99f-f5fc-4c3e-b046-c15dbfafe329_2000x1200-png.jpg",
  "97p-creative-2026-reset": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/2026/03/Design-Decalres-Ben-Rennie-and-Australia-At-the-Greenhouse-Climate-Tech-Hub-Sydney.png",
  "sub-humping-elvis-and-the-right-to-be": "https://substackcdn.com/image/fetch/$s_!3WRe!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb1382f30-fa6b-42f8-9299-b6b9ccc27179_1172x660.jpeg",
  "97p-humping-elvis-and-the-right-to-be": "https://storage.ghost.io/c/05/7e/057e2877-d826-480b-8c19-52ba2ac08384/content/images/2026/03/https-3a-2f-2fsubstack-post-media-s3-amazonaws-com-2fpublic-2fimages-2fb1382f30-fa6b-42f8-9299-b6b9ccc27179_1172x660-jpeg.jpg",
};

export const JOURNAL_POSTS: JournalPost[] = RAW_POSTS
  .filter((p) => !REMOVED_TITLES.has(p.title))
  .map((p) => ({ ...p, image: p.image ?? IMAGES_BY_SLUG[p.slug] }));
