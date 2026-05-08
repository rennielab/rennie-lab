import Link from "next/link";
import { ContactButton } from "@/components/chrome/ContactButton";

export default function HomePage() {
  return (
    <div className="container">
      <section style={{ paddingTop: 80, paddingBottom: 96 }}>
        <div className="mono" style={{ marginBottom: 32 }}>
          00 — Rennie Lab · Sydney + Los Angeles
        </div>
        <h1 className="h-display rise">
          Clean creative
          <br />
          for climate, community
          <br />
          and movement.
        </h1>
        <p className="body-lg rise delay-1" style={{ maxWidth: "60ch", marginTop: 48 }}>
          Rennie Lab is a creative advisory studio working with brands, institutions and impact
          partners on the slow, patient work of building things that hold up across cycles —
          not just launches.
        </p>
        <div
          className="rise delay-2"
          style={{ marginTop: 56, display: "flex", gap: 16, flexWrap: "wrap" }}
        >
          <ContactButton>
            Start a brief <span className="arrow">→</span>
          </ContactButton>
          <Link className="btn btn-ghost" href="/services">
            See our services
          </Link>
        </div>
      </section>
    </div>
  );
}
