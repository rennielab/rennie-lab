"use client";

import { useEffect, useState } from "react";

const AVG_WEB_BYTES = 2.3 * 1024 * 1024; // ~2.3MB typical web page (HTTP Archive)
const G_PER_MB = 0.5; // ~0.5g CO₂e per MB transferred (Sustainable Web Design model, mid-range)

function bytesToGrams(bytes: number) {
  return (bytes / (1024 * 1024)) * G_PER_MB;
}

type Metrics = { bytes: number; requests: number };

function readMetrics(): Metrics {
  if (typeof window === "undefined" || !window.performance) {
    return { bytes: 0, requests: 0 };
  }
  const navEntries = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];
  const resources = performance.getEntriesByType(
    "resource",
  ) as PerformanceResourceTiming[];
  const navBytes = navEntries[0]?.transferSize ?? 0;
  const resBytes = resources.reduce((s, r) => s + (r.transferSize || 0), 0);
  return {
    bytes: navBytes + resBytes,
    requests: resources.length + (navBytes ? 1 : 0),
  };
}

export function CarbonTracker() {
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({ bytes: 0, requests: 0 });
  const [scrolled, setScrolled] = useState(0);

  // Live-poll real page metrics (covers lazy-loaded resources)
  useEffect(() => {
    const update = () => setMetrics(readMetrics());
    update();
    const t = setInterval(update, 2000);
    return () => clearInterval(t);
  }, []);

  // Scroll progress
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const y = window.scrollY;
        setScrolled(h > 0 ? Math.min(100, (y / h) * 100) : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Esc to close, lock body scroll on mobile when open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const grams = bytesToGrams(metrics.bytes);
  const avgGrams = bytesToGrams(AVG_WEB_BYTES);
  const pctOfAvg = avgGrams > 0 ? (grams / avgGrams) * 100 : 0;
  const lighterPct = Math.max(0, Math.round(100 - pctOfAvg));

  return (
    <>
      <button
        type="button"
        className="carbon-tracker"
        data-open={open}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open carbon footprint panel"
        aria-expanded={open}
      >
        <div className="carbon-leaf" aria-hidden="true"></div>
        <span>CO₂e</span>
        <span className="carbon-num">{grams.toFixed(2)}g</span>
        <div className="carbon-bar" aria-hidden="true">
          <div style={{ width: `${Math.min(100, pctOfAvg)}%` }}></div>
        </div>
        <span style={{ opacity: 0.6 }}>{scrolled.toFixed(0)}%</span>
      </button>

      <div
        className="carbon-backdrop"
        data-open={open}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        className="carbon-panel"
        data-open={open}
        role="dialog"
        aria-modal="false"
        aria-label="Carbon footprint of this visit"
      >
        <header className="carbon-panel-head">
          <div>
            <div className="mono carbon-panel-eyebrow">Carbon · this visit so far</div>
            <h2 className="carbon-panel-title">
              The footprint of <span style={{ color: "var(--accent)" }}>this page</span>.
            </h2>
          </div>
          <button
            type="button"
            className="carbon-panel-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        {/* Live stats */}
        <div className="carbon-panel-stats">
          <div className="carbon-panel-stat">
            <div className="carbon-panel-num">{grams.toFixed(2)}</div>
            <div className="mono">g CO₂e estimated</div>
          </div>
          <div className="carbon-panel-stat">
            <div className="carbon-panel-num">
              {(metrics.bytes / (1024 * 1024)).toFixed(2)}
            </div>
            <div className="mono">MB transferred</div>
          </div>
          <div className="carbon-panel-stat">
            <div className="carbon-panel-num">{metrics.requests}</div>
            <div className="mono">requests</div>
          </div>
          <div className="carbon-panel-stat">
            <div className="carbon-panel-num">{scrolled.toFixed(0)}%</div>
            <div className="mono">scrolled</div>
          </div>
        </div>

        {/* Comparison bar */}
        <div className="carbon-panel-vs">
          <div className="mono carbon-panel-vs-label">Vs the average web page</div>
          <div className="carbon-panel-vs-num">{lighterPct}% lighter</div>
          <div className="carbon-panel-vs-bar">
            <div
              className="carbon-panel-vs-fill"
              style={{ width: `${Math.min(100, pctOfAvg)}%` }}
            ></div>
          </div>
          <div className="mono carbon-panel-vs-sub">
            {grams.toFixed(2)}g · this page &nbsp;·&nbsp; {avgGrams.toFixed(2)}g ·
            average page (~2.3MB)
          </div>
        </div>

        {/* Education */}
        <section className="carbon-panel-edu">
          <h3>The internet has a footprint.</h3>
          <p>
            The web is responsible for roughly four percent of global electricity
            use — more than the aviation industry. The average web page now weighs
            over two megabytes and makes more than seventy requests every time
            someone visits.
          </p>
          <p>
            Most of that weight is decided in the design phase. Hero videos that
            autoplay. Heavy fonts loaded for one display headline. Tracking
            scripts. Images shipped at desktop size to phones. The decisions a
            studio makes in the first few weeks of a build determine how much
            energy a site burns for the rest of its life.
          </p>
        </section>

        {/* How this site stays light */}
        <section className="carbon-panel-how">
          <div className="mono carbon-panel-section-eyebrow">
            How we keep this site light
          </div>
          <ul>
            <li>Self-hosted images and video — no third-party CDNs for content</li>
            <li>No tracking pixels, no analytics scripts, no autoplay video</li>
            <li>Type subsetting — only the glyphs the page actually needs</li>
            <li>Modern image formats — WebP, responsive sizing per device</li>
            <li>Green-grid hosting, verified by The Green Web Foundation</li>
            <li>Low-carbon mode toggle for the lightest possible experience</li>
          </ul>
        </section>

        {/* CTA */}
        <section className="carbon-panel-cta">
          <h3>Want a site that doesn&apos;t add to it?</h3>
          <p>
            We design carbon-aware sites end to end — research, architecture,
            design, build, and the documentation your in-house team needs to keep
            it light. Pages built to load fast on a five-year-old phone in a
            regional area, accessible by default, measured in grams.
          </p>
          <button
            type="button"
            className="btn btn-primary carbon-panel-cta-btn"
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent("open-contact"));
            }}
          >
            Build a carbon-neutral site <span className="arrow">→</span>
          </button>
        </section>

        <footer className="carbon-panel-foot mono">
          Estimate based on actual bytes transferred (~0.5g CO₂e/MB · Sustainable
          Web Design methodology). Hosting verified by The Green Web Foundation.
        </footer>
      </aside>
    </>
  );
}
