"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/chrome/ThemeProvider";
import type { ImpactCaseStudy } from "@/data/impactProjects";

type OpenEvent = CustomEvent<{ caseStudy: ImpactCaseStudy }>;

export function ImpactCaseStudyDrawer() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ImpactCaseStudy | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as OpenEvent).detail;
      setData(detail.caseStudy);
      setOpen(true);
    };
    window.addEventListener("open-impact-case", onOpen);
    return () => window.removeEventListener("open-impact-case", onOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="contact-shade" data-open={open} onClick={() => setOpen(false)}></div>
      <aside className="contact-panel" data-open={open} data-theme={theme}>
        <button
          type="button"
          className="drawer-close"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          ✕
        </button>
        {data && (
          <>
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
                <span className="mono">Impact case study · {data.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mono"
                style={{
                  padding: "8px 14px",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 3,
                }}
              >
                Close ✕
              </button>
            </div>
            <div style={{ padding: "48px clamp(24px, 6vw, 80px) 96px", flex: 1, overflowY: "auto" }}>
              <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div className="mono" style={{ marginBottom: 16 }}>{data.category}</div>
                <h1 className="h-1" style={{ margin: 0, maxWidth: "20ch" }}>
                  {data.name}
                </h1>
                <p className="body-lg" style={{ marginTop: 16, maxWidth: "52ch" }}>
                  {data.subtitle}
                </p>
                <div
                  className="ph"
                  data-tone={data.tone}
                  style={{
                    aspectRatio: "16/9",
                    marginTop: 48,
                    borderRadius: "var(--radius)",
                    ...(data.hero
                      ? {
                          backgroundImage: `url(${data.hero})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {}),
                  }}
                ></div>

                {(["challenge", "solution", "impact"] as const).map((key, i) => (
                  <div
                    key={key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 2fr",
                      gap: 64,
                      padding: "48px 0",
                      borderTop: i ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(0,0,0,0.12)",
                      marginTop: i ? 0 : 48,
                    }}
                  >
                    <div>
                      <div className="mono" style={{ marginBottom: 8 }}>0{i + 1}</div>
                      <h3 className="h-3" style={{ margin: 0, textTransform: "capitalize" }}>
                        {key}
                      </h3>
                    </div>
                    <p className="body-lg" style={{ margin: 0, maxWidth: "62ch" }}>
                      {data[key]}
                    </p>
                  </div>
                ))}

                <div
                  style={{
                    marginTop: 80,
                    paddingTop: 32,
                    borderTop: "1px solid rgba(0,0,0,0.12)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div className="mono">Working on something similar?</div>
                    <div
                      style={{
                        fontFamily: "var(--sans)",
                        fontWeight: 900,
                        fontSize: 28,
                        marginTop: 8,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Open the brief →
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setOpen(false);
                      window.dispatchEvent(new CustomEvent("open-contact"));
                    }}
                  >
                    Talk to the studio <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
