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
            <a
              className="btn btn-ghost"
              style={{ borderColor: "rgba(244,241,222,0.2)", color: "var(--cream)" }}
              href="https://cal.com/benrennie/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call
            </a>
          </div>
        </div>
      </div>

      <div className="foot-ack-row">
        <div className="foot-ack">
          <button
            type="button"
            className="foot-col-title foot-ack-title-button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-acknowledgement"))}
          >
            Acknowledgement of Country ↑
          </button>
          <p>
            Rennie Lab acknowledge the Traditional Owners of Country
            throughout Australia and pay our respects to Elders past,
            present and emerging. We honour their enduring connection to
            land, waters, skies and culture. As the first storytellers of
            these lands, we give thanks for their care and share our
            respect and friendship with all First Nations peoples.
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
              <Link href="/journal">Off Climate</Link>
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
            <li>
              <a href="https://instagram.com/benrennie" target="_blank" rel="noopener noreferrer">
                Instagram ↗
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/in/benrennie" target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </li>
            <li>
              <a href="https://benrennie.substack.com" target="_blank" rel="noopener noreferrer">
                Substack ↗
              </a>
            </li>
            <li>
              <Link href="/journal">Off Climate ↗</Link>
            </li>
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
