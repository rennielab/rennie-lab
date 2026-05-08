type StackCard = {
  title: string;
  cat: string;
  tone: "red" | "moss" | "cream" | "sand" | "rust" | "ocean" | "ink";
};

type StackSection = {
  id: string;
  title: string;
  desc: string;
  bg: string;
  fg: string;
  img: string;
  cards: StackCard[];
};

const SECTIONS: StackSection[] = [
  {
    id: "brand",
    title: "brand",
    desc: "A complete brand foundation built to hold its own alongside organisations ten times your size — from positioning and narrative through to identity, voice and rollout. We work with founders, leadership teams and movements to build brands that feel inevitable, not invented; brands designed to last more than a launch.",
    bg: "#E94E4D",
    fg: "#FFFDEC",
    img: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&w=2400&q=70",
    cards: [
      { title: "Reform — ocean policy identity", cat: "Identity", tone: "cream" },
      { title: "Slow Goods — packaging that disappears", cat: "Brand", tone: "sand" },
      { title: "Halfway Hotel — slow travel brand", cat: "Identity", tone: "ink" },
      { title: "Forever Forest — a brand for permanence", cat: "Brand", tone: "moss" },
    ],
  },
  {
    id: "advisory",
    title: "advisory",
    desc: "A bespoke creative, strategic and communications advisory partnership for the bigger projects and bolder ambitions that need senior, dedicated thinking. We sit alongside leadership — quietly, monthly, for as long as it takes — helping the work clarify itself before the world ever sees it.",
    bg: "#151517",
    fg: "#FFFDEC",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2400&q=70",
    cards: [
      { title: "CSIRO — Tidewatch coastal carbon ledger", cat: "Advisory", tone: "ocean" },
      { title: "UN Habitat — climate cities advisory", cat: "Advisory", tone: "rust" },
      { title: "Bundanon — Indigenous-led residencies", cat: "Advisory", tone: "red" },
      { title: "B-Lab AU — movement strategy", cat: "Advisory", tone: "moss" },
    ],
  },
  {
    id: "ux",
    title: "ux design",
    desc: "Editorial-grade product and service design — the kind of digital experience people quietly choose to come back to. We work end-to-end, from research and information architecture through interaction, interface and shipped code, with a bias toward calmer, clearer products that earn their place on the screen.",
    bg: "#2C4A5E",
    fg: "#FFFDEC",
    img: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=2400&q=70",
    cards: [
      { title: "Ocean Foundation — public ledger", cat: "Product", tone: "cream" },
      { title: "Surfrider — Walk the Coast app", cat: "Service", tone: "sand" },
      { title: "GreatForest — donor experience", cat: "Product", tone: "moss" },
      { title: "Beyond Blue — Quiet Hours", cat: "Service", tone: "ink" },
    ],
  },
  {
    id: "research",
    title: "research",
    desc: "On-the-ground and desk research that grounds the work — from climate behaviour studies and category audits through to editorial research for movements that need real evidence behind them. We treat research as craft: a way to find the truer brief hiding underneath the one we were given.",
    bg: "#4F6A4A",
    fg: "#FFFDEC",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=70",
    cards: [
      { title: "Cool Roof Coalition — heat adaptation", cat: "Field", tone: "rust" },
      { title: "Patagonia AU — category audit", cat: "Strategic", tone: "red" },
      { title: "Slow Goods — material study", cat: "Climate", tone: "sand" },
      { title: "OFF.Climate — behaviour report", cat: "Strategic", tone: "cream" },
    ],
  },
];

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
      {SECTIONS.map((s, i) => (
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
              {s.cards.map((c, ci) => (
                <div key={ci} className="stack-card ph" data-tone={c.tone}>
                  <div className="stack-card-label">
                    {c.cat}
                    <span className="stack-card-title">{c.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
