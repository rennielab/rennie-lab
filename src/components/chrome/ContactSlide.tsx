"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { FormField } from "./FormField";

const CATEGORIES = ["Brand", "Advisory", "UX Design", "Impact Project"];
const SERVICES = [
  "Brand Strategy",
  "User Experience",
  "Climate Design",
  "Impact Programs",
  "Creative Direction",
  "Advisory",
];
const BUDGETS = ["< $20k", "$20–50k", "$50–100k", "$100–250k", "$250k+", "Let’s talk"];
const TIMELINES = ["ASAP", "This quarter", "Next 6 months", "Just exploring"];

type Data = {
  category: string;
  services: string[];
  budget: string;
  timeline: string;
  name: string;
  org: string;
  email: string;
  message: string;
  heard: string;
};

const EMPTY: Data = {
  category: "",
  services: [],
  budget: "",
  timeline: "",
  name: "",
  org: "",
  email: "",
  message: "",
  heard: "",
};

export function ContactSlide() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(EMPTY);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setStep(0);
    };
    window.addEventListener("open-contact", handler);
    return () => window.removeEventListener("open-contact", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function toggleService(s: string) {
    setData((d) => ({
      ...d,
      services: d.services.includes(s) ? d.services.filter((x) => x !== s) : [...d.services, s],
    }));
  }

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
            <span className="mono">New project enquiry</span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span className="mono">Step {step + 1} / 3</span>
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
        </div>

        <div
          style={{
            padding: "48px clamp(24px, 6vw, 80px)",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 48,
          }}
        >
          {step === 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="rise">
              <div>
                <div className="mono" style={{ marginBottom: 12 }}>
                  01 — Tell us about it
                </div>
                <h2 className="h-1" style={{ margin: 0 }}>
                  What kind of <em>change</em> are you trying to make?
                </h2>
                <p className="body-lg" style={{ marginTop: 24, maxWidth: 520 }}>
                  We work in three lanes — brand and strategic advisory, user experience design, and
                  impact programs across climate, community and movement.
                </p>
                <div
                  style={{
                    marginTop: 40,
                    paddingTop: 24,
                    borderTop: "1px solid currentColor",
                    maxWidth: 520,
                    opacity: 0.85,
                  }}
                >
                  <div className="mono" style={{ marginBottom: 14 }}>
                    Direct contact
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <a
                      href="mailto:press@rennielab.com"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        textDecoration: "none",
                        color: "inherit",
                        fontFamily: "var(--sans)",
                        fontWeight: 500,
                        fontSize: 18,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      <span>press@rennielab.com</span>
                      <span className="mono" style={{ opacity: 0.6 }}>
                        Press →
                      </span>
                    </a>
                    <a
                      href="mailto:eli@rennielab.com"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        textDecoration: "none",
                        color: "inherit",
                        fontFamily: "var(--sans)",
                        fontWeight: 500,
                        fontSize: 18,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      <span>eli@rennielab.com</span>
                      <span className="mono" style={{ opacity: 0.6 }}>
                        Direct →
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <div className="mono" style={{ marginBottom: 14 }}>
                    Category
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className="tag tag-lg"
                        data-active={data.category === c}
                        onClick={() => setData((d) => ({ ...d, category: c }))}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mono" style={{ marginBottom: 14 }}>
                    What you need · pick any
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SERVICES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="tag tag-lg"
                        data-active={data.services.includes(s)}
                        onClick={() => toggleService(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mono" style={{ marginBottom: 14 }}>
                    Budget
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        className="tag tag-lg"
                        data-active={data.budget === b}
                        onClick={() => setData((d) => ({ ...d, budget: b }))}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mono" style={{ marginBottom: 14 }}>
                    Timeline
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TIMELINES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className="tag tag-lg"
                        data-active={data.timeline === t}
                        onClick={() => setData((d) => ({ ...d, timeline: t }))}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="rise">
              <div>
                <div className="mono" style={{ marginBottom: 12 }}>
                  02 — Who&apos;s saying hello
                </div>
                <h2 className="h-1" style={{ margin: 0 }}>
                  Tell us who <em>you are.</em>
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
                  value={data.email}
                  type="email"
                  onChange={(v) => setData((d) => ({ ...d, email: v }))}
                />
                <FormField
                  label="How did you hear about us?"
                  value={data.heard}
                  onChange={(v) => setData((d) => ({ ...d, heard: v }))}
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="rise">
              <div>
                <div className="mono" style={{ marginBottom: 12 }}>
                  03 — The detail
                </div>
                <h2 className="h-1" style={{ margin: 0 }}>
                  What should we <em>know?</em>
                </h2>
                <p className="body-lg" style={{ marginTop: 24, maxWidth: 480 }}>
                  Pop the brief, audience, references — anything you&apos;ve got. We read every one and
                  reply within 2 working days.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <div className="mono" style={{ marginBottom: 8 }}>
                    Tell us more
                  </div>
                  <textarea
                    value={data.message}
                    onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))}
                    rows={10}
                    placeholder="The challenge, audience, scope, references…"
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "var(--radius)",
                      border: "1px solid rgba(0,0,0,0.15)",
                      fontFamily: "var(--sans)",
                      fontSize: 16,
                      lineHeight: 1.5,
                      background: "transparent",
                      color: "inherit",
                      resize: "vertical",
                    }}
                  />
                </div>
                <div className="body-sm" style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ marginTop: 4 }}>↳</span>
                  <span>
                    By submitting, you agree to our privacy practices. We never share your details.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "24px 32px",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => (step > 0 ? setStep(step - 1) : setOpen(false))}
          >
            ← {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < 2 ? (
            <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
              Continue <span className="arrow">→</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              style={{ background: "var(--accent)", color: "var(--cream)" }}
              onClick={() => {
                alert("Thanks — sent.");
                setOpen(false);
              }}
            >
              Send brief <span className="arrow">→</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
