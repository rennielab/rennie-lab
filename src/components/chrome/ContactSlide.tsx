"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { FormField } from "./FormField";

const CATEGORIES = ["Brand", "Products", "Advisory", "Environments", "Research"];
const SERVICES = [
  "Brand Strategy",
  "Website / App",
  "Retail / Space",
  "Identity System",
  "Creative Direction",
  "Advisory Retainer",
  "Research",
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

type Status = "idle" | "submitting" | "sent" | "error";

export function ContactSlide() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setStep(0);
      setStatus("idle");
      setErrorMessage(null);
    };
    window.addEventListener("open-contact", handler);
    return () => window.removeEventListener("open-contact", handler);
  }, []);

  async function submit() {
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setStatus("sent");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMessage(msg);
      setStatus("error");
    }
  }

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
            <div className="contact-step rise">
              <div>
                <div className="mono" style={{ marginBottom: 12 }}>
                  01 — Tell us about it
                </div>
                <h2 className="h-2" style={{ margin: 0 }}>
                  What kind of change are you trying to make?
                </h2>
                <p className="body-lg" style={{ marginTop: 24, maxWidth: 520 }}>
                  We work across five disciplines — brand, digital products, advisory,
                  environments and research. Most engagements move between two or three at
                  once. Tell us where you&apos;re trying to get to and we&apos;ll come back
                  with the right shape.
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
                    <a href="mailto:press@rennielab.com" className="contact-mail">
                      <span className="contact-mail-addr">press@rennielab.com</span>
                      <span className="mono contact-mail-label">Press →</span>
                    </a>
                    <a href="mailto:eli@rennielab.com" className="contact-mail">
                      <span className="contact-mail-addr">eli@rennielab.com</span>
                      <span className="mono contact-mail-label">Direct →</span>
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
            <div className="contact-step rise">
              <div>
                <div className="mono" style={{ marginBottom: 12 }}>
                  02 — Who&apos;s saying hello
                </div>
                <h2 className="h-2" style={{ margin: 0 }}>
                  Tell us who you are.
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
          {step === 2 && status === "sent" && (
            <div className="contact-step rise">
              <div>
                <div className="mono" style={{ marginBottom: 12 }}>
                  Sent ✓
                </div>
                <h2 className="h-2" style={{ margin: 0 }}>
                  Thanks. We&apos;ll be in touch.
                </h2>
                <p className="body-lg" style={{ marginTop: 24, maxWidth: 480 }}>
                  Your brief is on its way to the studio. We read every one and reply within
                  2 working days — usually from {data.email || "the address you provided"}.
                </p>
              </div>
              <div></div>
            </div>
          )}
          {step === 2 && status !== "sent" && (
            <div className="contact-step rise">
              <div>
                <div className="mono" style={{ marginBottom: 12 }}>
                  03 — The detail
                </div>
                <h2 className="h-2" style={{ margin: 0 }}>
                  What should we know?
                </h2>
                <p className="body-lg" style={{ marginTop: 24, maxWidth: 480 }}>
                  Pop the brief, audience, references — anything you&apos;ve got. We read every one and
                  reply within 2 working days.
                </p>
                {status === "error" && errorMessage && (
                  <div
                    className="mono"
                    style={{
                      marginTop: 24,
                      padding: 12,
                      border: "1px solid var(--red)",
                      borderRadius: 4,
                      color: "var(--red)",
                      maxWidth: 420,
                    }}
                  >
                    Couldn&apos;t send · {errorMessage}
                  </div>
                )}
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
          {status === "sent" ? (
            <button type="button" className="btn btn-primary" onClick={() => setOpen(false)}>
              Done <span className="arrow">→</span>
            </button>
          ) : step < 2 ? (
            <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>
              Continue <span className="arrow">→</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              style={{
                background: "var(--accent)",
                color: "var(--cream)",
                opacity: status === "submitting" ? 0.6 : 1,
              }}
              disabled={status === "submitting"}
              onClick={submit}
            >
              {status === "submitting" ? "Sending…" : "Send brief"}{" "}
              <span className="arrow">→</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
