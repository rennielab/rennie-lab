import Image from "next/image";
import { STORY_BLOCKS } from "@/data/story";
import { AFFILIATION_LOGOS, CLIENT_LOGOS } from "@/data/clientLogos";
import { ContactButton } from "@/components/chrome/ContactButton";

export const metadata = {
  title: "Story — Rennie Lab",
  description:
    "Rennie Lab is a fiercely independent creative advisory studio between Sydney, Salt Lake City and Los Angeles. Founded as Reny Studio in 2009.",
};

const find = (id: string) => STORY_BLOCKS.find((b) => b.id === id)!;

export default function StoryPage() {
  const hero = find("hero");
  const mission = find("mission");
  const founder = find("founder-quote");
  const manifesto = find("manifesto");
  const founded = find("founded");
  const studios = find("studios");
  const affiliations = find("affiliations");
  const acknowledgement = find("acknowledgement");
  const inclusivity = find("inclusivity");

  return (
    <div className="container">
      <section style={{ paddingTop: 64, paddingBottom: 96 }}>
        <div className="mono" style={{ marginBottom: 32 }}>01 — Story</div>
        <h1 className="h-display rise" style={{ maxWidth: "16ch" }}>
          {hero.heading}
        </h1>
        <p
          className="body-lg rise delay-1"
          style={{ maxWidth: "60ch", marginTop: 48 }}
        >
          {hero.body}
        </p>
      </section>

      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid var(--line)",
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 64,
        }}
      >
        <div>
          <div className="mono" style={{ marginBottom: 16 }}>What we do</div>
          <h2 className="h-2" style={{ margin: 0 }}>{mission.heading}</h2>
        </div>
        <p className="body-lg" style={{ margin: 0, maxWidth: "62ch" }}>{mission.body}</p>
      </section>

      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div className="mono" style={{ marginBottom: 24 }}>Founder</div>
        <blockquote
          className="h-2"
          style={{ margin: 0, maxWidth: "26ch", fontWeight: 600 }}
        >
          “{founder.body}”
        </blockquote>
        <div className="mono" style={{ marginTop: 24 }}>{founder.attribution}</div>
      </section>

      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid var(--line)",
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 64,
        }}
      >
        <div>
          <div className="mono" style={{ marginBottom: 16 }}>Manifesto</div>
          <h2 className="h-2" style={{ margin: 0 }}>{manifesto.heading}</h2>
        </div>
        <p className="body-lg" style={{ margin: 0, maxWidth: "62ch" }}>{manifesto.body}</p>
      </section>

      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid var(--line)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 48,
        }}
      >
        <div>
          <div className="mono" style={{ marginBottom: 16 }}>{founded.heading}</div>
          <p className="body" style={{ margin: 0 }}>{founded.body}</p>
        </div>
        <div>
          <div className="mono" style={{ marginBottom: 16 }}>{studios.heading}</div>
          <p className="body" style={{ margin: 0 }}>{studios.body}</p>
        </div>
        <div>
          <div className="mono" style={{ marginBottom: 16 }}>{affiliations.heading}</div>
          <p className="body" style={{ margin: 0 }}>{affiliations.body}</p>
        </div>
      </section>

      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div className="mono" style={{ marginBottom: 24 }}>Partners & collaborators</div>
        <div className="logo-strip">
          {CLIENT_LOGOS.slice(0, 6).map((src) => (
            <div key={src} className="logo-cell">
              <Image
                src={src}
                alt=""
                width={120}
                height={64}
                style={{ maxWidth: "100%", height: "auto", objectFit: "contain", opacity: 0.55, mixBlendMode: "multiply" }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, display: "flex", gap: 32, alignItems: "center" }}>
          {AFFILIATION_LOGOS.map((src) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={64}
              height={64}
              style={{ height: 56, width: "auto", objectFit: "contain", opacity: 0.7 }}
            />
          ))}
          <span className="mono" style={{ marginLeft: "auto" }}>
            B Corp · Design Declares · 1% for the Planet
          </span>
        </div>
      </section>

      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid var(--line)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
        }}
      >
        <div>
          <div className="mono" style={{ marginBottom: 16 }}>{acknowledgement.heading}</div>
          <p className="body" style={{ margin: 0, maxWidth: "52ch" }}>{acknowledgement.body}</p>
        </div>
        <div>
          <div className="mono" style={{ marginBottom: 16 }}>{inclusivity.heading}</div>
          <p className="body" style={{ margin: 0, maxWidth: "52ch" }}>{inclusivity.body}</p>
        </div>
      </section>

      <section
        style={{
          padding: "96px 0 0",
          borderTop: "1px solid var(--line)",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <ContactButton>
          Start a project <span className="arrow">→</span>
        </ContactButton>
      </section>
    </div>
  );
}
