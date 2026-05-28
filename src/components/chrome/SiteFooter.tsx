"use client";

import { AffiliationStrip } from "@/components/affiliations/AffiliationStrip";
import { FooterDots } from "./FooterDots";

export function SiteFooter() {
  const openContact = () => window.dispatchEvent(new CustomEvent("open-contact"));

  return (
    <footer className="site-foot">
      {/* Top — closer + contact card. The big "let's make something" moment */}
      <div className="foot-grid">
        <div className="foot-headline">
          Let&apos;s make
          <br />
          something that
          <br />
          matters.
        </div>
        <div className="foot-contact-card">
          <div className="mono" style={{ color: "rgba(255,255,255,0.5)" }}>
            Start a project
          </div>
          <div
            className="serif"
            style={{ fontSize: 32, lineHeight: 1.1, color: "var(--cream)" }}
          >
            hello@rennielab.com
          </div>
          <div className="hairline" style={{ background: "rgba(255,255,255,0.12)" }}></div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn btn-primary"
              style={{ background: "var(--cream)", color: "var(--carbon)" }}
              onClick={openContact}
              type="button"
            >
              Open the brief <span className="arrow">→</span>
            </button>
            <a
              className="btn btn-ghost"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "var(--cream)" }}
              href="https://cal.com/benrennie/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call
            </a>
          </div>
        </div>
      </div>

      {/* Dot-matrix display — full-width, centerpiece block */}
      <div className="foot-dots">
        <FooterDots />
      </div>

      {/* Wordmark + accountability badges */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 48,
          flexWrap: "wrap",
        }}
      >
        <div className="wordmark" style={{ marginTop: 64, flex: "0 0 auto" }}>
          Rennie Lab.
        </div>
        <div
          style={{
            flex: "1 1 480px",
            maxWidth: 720,
            paddingBottom: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            className="mono"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            Accountability · alliances
          </div>
          <AffiliationStrip variant="footer" forceTheme="dark" />
        </div>
      </div>

      {/* Acknowledgement of Country — full-width band at the bottom */}
      <div className="foot-ack-band">
        <button
          type="button"
          className="foot-col-title foot-ack-title-button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-acknowledgement"))}
        >
          Acknowledgement of Country ↑
        </button>
        <p className="foot-ack-band-body">
          Rennie Lab acknowledge the Traditional Owners of Country throughout
          Australia and pay our respects to Elders past, present and emerging.
          We honour their enduring connection to land, waters, skies and
          culture. As the first storytellers of these lands, we give thanks for
          their care and share our respect and friendship with all First
          Nations peoples.
        </p>
      </div>

      {/* Bottom strip — copyright + sister-project link + trust statements */}
      <div className="foot-bottom">
        <span>
          © 2009—2026 · Rennie Lab Pty Ltd ·{" "}
          <a
            href="https://97percent.co"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Sister: 97 Percent ↗
          </a>
        </span>
        <span style={{ display: "flex", gap: 24 }}>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Cookies</span>
          <span>Carbon</span>
        </span>
      </div>
    </footer>
  );
}
