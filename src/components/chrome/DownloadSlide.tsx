"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "./ThemeProvider";
import { FormField } from "./FormField";

const PURPOSES = [
  "Press / editorial",
  "New project enquiry",
  "Internal review",
  "Speaking / event",
  "Just curious",
];

type Kind = "press" | "deck";

type DownloadEvent = CustomEvent<{ kind?: Kind }>;

export function DownloadSlide() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("deck");
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({
    name: "",
    org: "",
    email: "",
    role: "",
    purpose: "",
    consent: false,
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as DownloadEvent).detail;
      setKind(detail?.kind ?? "deck");
      setOpen(true);
      setSent(false);
    };
    window.addEventListener("open-download", handler);
    return () => window.removeEventListener("open-download", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const meta: {
    eyebrow: string;
    title: ReactNode;
    sub: string;
    file: string;
    contents: string[];
    cta: string;
  } =
    kind === "press"
      ? {
          eyebrow: "Press kit",
          title: (
            <>
              The <em>Rennie Lab</em> press kit.
            </>
          ),
          sub: "Logos, founder bios, recent coverage and high-res project imagery — packaged for editors and producers.",
          file: "Rennie Lab — Press Kit · v2026.05 · 24mb",
          contents: [
            "Wordmark and monogram (PNG · SVG · vector)",
            "Founder & studio bios — short and long form",
            "Approved photography (12 images, hi-res)",
            "Recent press coverage (PDF)",
          ],
          cta: "Download press kit",
        }
      : {
          eyebrow: "Capabilities deck",
          title: (
            <>
              The <em>Capabilities</em> deck.
            </>
          ),
          sub: "Forty pages on how Rennie Lab works — the four practices, the Orbital design process, fee bands and a curated set of recent case studies.",
          file: "Rennie Lab — Capabilities · v2026.05 · 18mb",
          contents: [
            "Studio overview, lanes and Orbital process",
            "Five recent case studies — Brand, UX, Impact",
            "Indicative fee bands and engagement shapes",
            "Founder + senior team — backgrounds",
          ],
          cta: "Download deck (PDF)",
        };

  return (
    <>
      <div className="contact-shade" data-open={open} onClick={() => setOpen(false)}></div>
      <aside className="contact-panel" data-open={open} data-theme={theme}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 32px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="dot dot-pulse" style={{ background: "var(--ink)" }}></span>
            <span className="mono">{meta.eyebrow}</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mono"
            style={{
              padding: "8px 14px",
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 999,
            }}
          >
            Close ✕
          </button>
        </div>

        <div
          style={{
            padding: "48px clamp(24px, 6vw, 80px)",
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignContent: "start",
          }}
        >
          <div className="rise">
            <div className="mono" style={{ marginBottom: 12 }}>
              {meta.eyebrow}
            </div>
            <h2 className="h-1" style={{ margin: 0 }}>
              {meta.title}
            </h2>
            <p className="body-lg" style={{ marginTop: 24, maxWidth: 520 }}>
              {meta.sub}
            </p>
            <div
              style={{
                marginTop: 40,
                paddingTop: 24,
                borderTop: "1px solid currentColor",
                maxWidth: 520,
                opacity: 0.95,
              }}
            >
              <div className="mono" style={{ marginBottom: 14 }}>
                What&apos;s inside
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {meta.contents.map((c, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 24,
                      paddingBottom: 10,
                      borderBottom: "1px solid currentColor",
                      opacity: 0.9,
                      fontFamily: "var(--sans)",
                      fontWeight: 500,
                      fontSize: 16,
                    }}
                  >
                    <span>{c}</span>
                    <span className="mono" style={{ opacity: 0.5, flexShrink: 0 }}>
                      0{i + 1}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mono" style={{ marginTop: 18, opacity: 0.6 }}>
                {meta.file}
              </div>
            </div>
          </div>
          <div className="rise" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {!sent ? (
              <>
                <div className="mono">Where should we send it?</div>
                <FormField
                  label="Your name"
                  value={data.name}
                  onChange={(v) => setData((d) => ({ ...d, name: v }))}
                />
                <FormField
                  label="Organisation"
                  value={data.org}
                  onChange={(v) => setData((d) => ({ ...d, org: v }))}
                />
                <FormField
                  label="Email"
                  type="email"
                  value={data.email}
                  onChange={(v) => setData((d) => ({ ...d, email: v }))}
                />
                <FormField
                  label="Role"
                  value={data.role}
                  onChange={(v) => setData((d) => ({ ...d, role: v }))}
                />
                <div>
                  <div className="mono" style={{ marginBottom: 14 }}>
                    What for?
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {PURPOSES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className="tag tag-lg"
                        data-active={data.purpose === p}
                        onClick={() => setData((d) => ({ ...d, purpose: p }))}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <label
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    fontSize: 13,
                    lineHeight: 1.5,
                    opacity: 0.85,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={data.consent}
                    onChange={(e) => setData((d) => ({ ...d, consent: e.target.checked }))}
                    style={{ marginTop: 4 }}
                  />
                  <span>
                    Send me Rennie Lab&apos;s quarterly notes — work, climate, and the studio&apos;s reading
                    list. Unsubscribe anytime.
                  </span>
                </label>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 40 }}>
                <div className="mono">Sent ✓</div>
                <h3 className="h-2" style={{ margin: 0 }}>
                  Check your inbox.
                </h3>
                <p className="body-lg" style={{ maxWidth: 420, opacity: 0.85 }}>
                  We&apos;ve emailed a fresh link to <strong>{data.email || "you"}</strong>. Links expire
                  in 30 days — refresh from this same form anytime.
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "24px 32px",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
            ← Close
          </button>
          {!sent ? (
            <button
              type="button"
              className="btn btn-primary"
              style={{ background: "var(--accent)", color: "var(--cream)", opacity: data.email ? 1 : 0.5 }}
              disabled={!data.email}
              onClick={() => setSent(true)}
            >
              {meta.cta} <span className="arrow">↓</span>
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setOpen(false)}>
              Done <span className="arrow">→</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
