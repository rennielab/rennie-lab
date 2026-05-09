"use client";

import Link from "next/link";
import { AffiliationStrip } from "@/components/affiliations/AffiliationStrip";

export function SiteFooter() {
  const openContact = () => window.dispatchEvent(new CustomEvent("open-contact"));

  return (
    <footer className="site-foot">
      <div className="foot-grid">
        <div className="foot-headline">
          Let&apos;s make
          <br />
          something that
          <br />
          matters.
        </div>
        <div className="foot-contact-card">
          <div className="mono" style={{ color: "rgba(244,241,222,0.5)" }}>
            Start a project
          </div>
          <div
            className="serif"
            style={{ fontSize: 32, lineHeight: 1.1, color: "var(--cream)" }}
          >
            hello@rennielab.com
          </div>
          <div className="hairline" style={{ background: "rgba(244,241,222,0.12)" }}></div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn btn-primary"
              style={{ background: "var(--cream)", color: "var(--carbon)" }}
              onClick={openContact}
              type="button"
            >
              Open the brief <span className="arrow">→</span>
            </button>
            <button
              className="btn btn-ghost"
              style={{ borderColor: "rgba(244,241,222,0.2)", color: "var(--cream)" }}
              type="button"
            >
              Book a call
            </button>
          </div>
        </div>
      </div>

      <div className="foot-ack-row">
        <div className="foot-ack">
          <div className="foot-col-title">Acknowledgement of Country</div>
          <p>
            Rennie Lab works on the lands of the Gadigal people of the Eora
            Nation in Sydney and the Tongva people in Los Angeles. We
            acknowledge the Traditional Owners and Custodians of these lands
            and waters, and pay our respects to Elders past, present and
            emerging. Indigenous peoples have practised seven-generation
            thinking for tens of thousands of years. We are still learning.
            We honour the enduring connection of First Peoples to country,
            and the first storytellers of these places.
          </p>
        </div>
        <div className="foot-cols">
        <div className="foot-col">
          <div className="foot-col-title">Sitemap</div>
          <ul>
            <li>
              <Link href="/story">Story</Link>
            </li>
            <li>
              <Link href="/projects">Projects</Link>
            </li>
            <li>
              <Link href="/impact">Impact</Link>
            </li>
            <li>
              <Link href="/journal">Journal</Link>
            </li>
            <li onClick={openContact}>Contact</li>
          </ul>
        </div>
        <div className="foot-col">
          <div className="foot-col-title">Studios</div>
          <ul>
            <li>
              Sydney
              <br />
              <span className="mono" style={{ color: "rgba(244,241,222,0.5)" }}>
                Eora · 33°S
              </span>
            </li>
            <li style={{ marginTop: 18 }}>
              Los Angeles
              <br />
              <span className="mono" style={{ color: "rgba(244,241,222,0.5)" }}>
                Tongva · 34°N
              </span>
            </li>
          </ul>
        </div>
        <div className="foot-col foot-col-mono">
          <div className="foot-col-title">Channels</div>
          <ul>
            <li>Instagram ↗</li>
            <li>LinkedIn ↗</li>
            <li>Substack ↗</li>
            <li>OFF.Climate ↗</li>
            <li>Vimeo ↗</li>
          </ul>
        </div>
        <div className="foot-col foot-col-mono">
          <div className="foot-col-title">Impact</div>
          <ul>
            <li>1% for the Planet</li>
            <li>B-Corp Certified</li>
            <li>Climate Active</li>
            <li>Green hosting</li>
            <li>Carbon report ↓</li>
          </ul>
        </div>
        </div>
      </div>

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
            style={{ color: "rgba(244, 241, 222, 0.5)" }}
          >
            Accountability · alliances
          </div>
          <AffiliationStrip variant="footer" forceTheme="dark" />
        </div>
      </div>

      <div className="foot-bottom">
        <span>© 2009—2026 · Rennie Lab Pty Ltd</span>
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
