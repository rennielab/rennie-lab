"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/* ---------------------------------------------------------------- */
/* Carbon model — Sustainable Web Design v4 (sustainablewebdesign.org)
   Energy intensity per GB transferred (kWh/GB):
     · data center op  0.055   · data center embodied 0.012
     · network op      0.059   · network embodied     0.013
     · device op       0.080   · device embodied      0.081
   Grid intensity: 494 gCO₂e/kWh (global average).
   Green-hosting adjustment: data-center operational emissions removed
   (verified by The Green Web Foundation for rennielab.com).            */

const KWH_PER_GB_GREEN =
  /* DC op skipped (green) */ 0 +
  /* DC embodied */ 0.012 +
  /* Net op */ 0.059 +
  /* Net embodied */ 0.013 +
  /* Device op */ 0.080 +
  /* Device embodied */ 0.081; // = 0.245 kWh/GB
const GRID_G_PER_KWH = 494;
const G_PER_GB_GREEN = KWH_PER_GB_GREEN * GRID_G_PER_KWH; // ≈ 121 g/GB
const G_PER_MB_GREEN = G_PER_GB_GREEN / 1024; // ≈ 0.118 g/MB

/* Independently-measured benchmark for rennielab.com itself. This is a
   property of the SITE (page weight + green hosting), not the user's
   session — it doesn't drift with the user's scroll or click depth.    */
const STATIC_BENCHMARK = 91;

/* sessionStorage keys — survive route changes + hard reloads inside one
   browser tab session, reset when the tab closes.                       */
const SESSION_BYTES_KEY = "rl-session-bytes";
const SESSION_PAGES_KEY = "rl-session-pages";

function bytesToGrams(bytes: number) {
  return (bytes / (1024 * 1024 * 1024)) * G_PER_GB_GREEN;
}

type PageMetrics = { bytes: number; requests: number };

function readPageMetrics(): PageMetrics {
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

/* ---------------------------------------------------------------- */
/* Equivalents — widely-cited 2024 figures, gCO₂e per unit.
   Sources: SWD model (web), EPA / IEA (transport, electricity),
   Mike Berners-Lee "How Bad Are Bananas?" (food, drink). Order of
   magnitude is what matters; precision varies by source.              */

type Equivalent = {
  unit: string;
  gPer: number;
  icon: keyof typeof ICONS;
};

/* Small units that land cleanly for sub-gram sessions */
const SESSION_EQUIVALENTS: Equivalent[] = [
  { unit: "glasses of tap water (energy)", gPer: 0.1, icon: "water" },
  { unit: "seconds of phone charging", gPer: 0.014, icon: "phone" },
  { unit: "Google searches", gPer: 0.2, icon: "search" },
  { unit: "metres in a BYD", gPer: 0.08, icon: "car" },
];

/* Reverse "for context" — show how many visits to match a daily activity */
const PERSPECTIVE_ITEMS: Equivalent[] = [
  { unit: "cup of coffee (lifecycle)", gPer: 50, icon: "coffee" },
  { unit: "minute of TikTok", gPer: 2.5, icon: "play" },
  { unit: "ChatGPT query (avg)", gPer: 4.3, icon: "sparkle" },
  { unit: "kilometre in a BYD", gPer: 80, icon: "car" },
  { unit: "minute of Netflix HD", gPer: 0.6, icon: "play" },
  { unit: "email with attachment", gPer: 50, icon: "mail" },
];

function formatCount(n: number): string {
  if (n < 0.1) return n.toFixed(2);
  if (n < 1) return n.toFixed(1);
  if (n < 100) return Math.round(n).toString();
  return Math.round(n).toLocaleString();
}

/* ---------------------------------------------------------------- */
/* Inline icons — uniform 16px stroke, currentColor, monoline to match
   the studio's type-led aesthetic.                                     */

const ICONS = {
  water: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c-3 4.5-6 7.8-6 11.5a6 6 0 0 0 12 0C18 10.8 15 7.5 12 3z" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m20 20-5-5" />
    </svg>
  ),
  car: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 14h14l-1.5-5H6.5L5 14z" />
      <path d="M3 14h18v4H3z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  ),
  coffee: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9h12v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z" />
      <path d="M17 11h2a2 2 0 0 1 0 4h-2" />
      <path d="M9 4v2M12 4v2" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      <path d="M5.5 5.5l3 3M15.5 15.5l3 3M18.5 5.5l-3 3M8.5 15.5l-3 3" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="m4 8 8 6 8-6" />
    </svg>
  ),
};

/* ---------------------------------------------------------------- */

export function CarbonTracker() {
  const [open, setOpen] = useState(false);
  const [sessionBytes, setSessionBytes] = useState(0);
  const [pageRequests, setPageRequests] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [scrolled, setScrolled] = useState(0);
  const pathname = usePathname();

  /* Bump resource buffer so deep sessions don't lose entries */
  useEffect(() => {
    if (typeof performance !== "undefined" && performance.setResourceTimingBufferSize) {
      performance.setResourceTimingBufferSize(2000);
    }
  }, []);

  /* Restore carry-in from prior pages and start polling. Reads sessionStorage
     on mount and seeds the counter from there — synchronous setState is the
     point: we don't want a flash-of-zero before the carry-in lands. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const carryIn = parseInt(sessionStorage.getItem(SESSION_BYTES_KEY) || "0", 10) || 0;
    const carryPages = parseInt(sessionStorage.getItem(SESSION_PAGES_KEY) || "0", 10) || 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageCount(Math.max(1, carryPages + 1));
    sessionStorage.setItem(SESSION_PAGES_KEY, String(Math.max(1, carryPages + 1)));

    const update = () => {
      const m = readPageMetrics();
      setPageRequests(m.requests);
      const total = carryIn + m.bytes;
      setSessionBytes(total);
      sessionStorage.setItem(SESSION_BYTES_KEY, String(total));
    };
    update();
    const t = setInterval(update, 2000);
    return () => clearInterval(t);
  }, []);

  /* App Router soft-nav: pathname changes without remount. Increment page
     count once per route change. Resource entries keep accumulating in the
     same performance buffer, so sessionBytes naturally tracks them.        */
  const lastPathname = useRef(pathname);
  useEffect(() => {
    if (pathname === lastPathname.current) return;
    lastPathname.current = pathname;
    setPageCount((prev) => {
      const next = prev + 1;
      sessionStorage.setItem(SESSION_PAGES_KEY, String(next));
      return next;
    });
  }, [pathname]);

  /* Scroll progress for the pill */
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

  /* Esc to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const grams = bytesToGrams(sessionBytes);
  const sessionMb = sessionBytes / (1024 * 1024);

  /* For the pill: show the session bar against an average web page (2.3MB) */
  const AVG_PAGE_GRAMS = bytesToGrams(2.3 * 1024 * 1024);
  const pctOfAvg = AVG_PAGE_GRAMS > 0 ? (grams / AVG_PAGE_GRAMS) * 100 : 0;

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
        aria-label="Carbon footprint of this session"
      >
        <header className="carbon-panel-head">
          <div>
            <div className="mono carbon-panel-eyebrow">Carbon · your session</div>
            <h2 className="carbon-panel-title">
              The footprint of your visit.
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

        {/* Static benchmark — site rating, independent of session */}
        <div className="carbon-panel-vs">
          <div className="mono carbon-panel-vs-label">
            Independently rated · this site
          </div>
          <div className="carbon-panel-vs-num">
            Lighter than {STATIC_BENCHMARK}%
          </div>
          <div className="carbon-panel-vs-bar">
            <div
              className="carbon-panel-vs-fill"
              style={{ width: `${STATIC_BENCHMARK}%` }}
            ></div>
          </div>
          <div className="mono carbon-panel-vs-sub">
            Of pages measured by HTTP Archive (median 2.3MB · this site &lt; 0.4MB
            per page · green-hosted, verified by The Green Web Foundation)
          </div>
        </div>

        {/* Live session stats — 4-up */}
        <div className="carbon-panel-stats">
          <div className="carbon-panel-stat">
            <div className="carbon-panel-num">{grams.toFixed(2)}</div>
            <div className="mono">g CO₂e session</div>
          </div>
          <div className="carbon-panel-stat">
            <div className="carbon-panel-num">{sessionMb.toFixed(2)}</div>
            <div className="mono">MB transferred</div>
          </div>
          <div className="carbon-panel-stat">
            <div className="carbon-panel-num">{pageCount}</div>
            <div className="mono">pages visited</div>
          </div>
          <div className="carbon-panel-stat">
            <div className="carbon-panel-num">{scrolled.toFixed(0)}%</div>
            <div className="mono">scrolled</div>
          </div>
        </div>

        {/* Equivalents — your session ≈ */}
        <section className="carbon-panel-equiv">
          <div className="mono carbon-panel-section-eyebrow">
            Your session so far ≈
          </div>
          <ul className="equiv-grid">
            {SESSION_EQUIVALENTS.map((eq) => (
              <li key={eq.unit} className="equiv-item">
                <div className="equiv-icon">{ICONS[eq.icon]}</div>
                <div className="equiv-num">{formatCount(grams / eq.gPer)}</div>
                <div className="equiv-unit">{eq.unit}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Reverse comparisons — for perspective */}
        <section className="carbon-panel-perspective">
          <div className="mono carbon-panel-section-eyebrow">
            For perspective · how many visits this site = one of:
          </div>
          <ul className="persp-list">
            {PERSPECTIVE_ITEMS.map((eq) => {
              const visits = grams > 0 ? eq.gPer / grams : 0;
              return (
                <li key={eq.unit} className="persp-item">
                  <div className="persp-icon">{ICONS[eq.icon]}</div>
                  <div className="persp-text">
                    <span className="persp-num">{formatCount(visits)}</span>
                    <span className="persp-unit">visits = 1 {eq.unit}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

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
          Session live-counted from actual bytes across {pageCount} page
          {pageCount === 1 ? "" : "s"} ({pageRequests} requests on this page).
          Sustainable Web Design v4 model · 494 gCO₂e/kWh global grid · green-hosting
          adjustment applied · ~{G_PER_MB_GREEN.toFixed(3)}g per MB. Comparison
          figures from IEA, EPA, and Mike Berners-Lee (How Bad Are Bananas?, 2020 ed.)
          — order-of-magnitude estimates, not lab measurements.
        </footer>
      </aside>
    </>
  );
}
