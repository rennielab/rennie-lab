"use client";

import { useState } from "react";
import type { Service } from "@/data/types";

const TONE: Record<string, string> = {
  "impact-products": "ocean",
  "strategic-futures": "rust",
  "creative-transformation": "moss",
};

export function ServicesAccordion({ services }: { services: Service[] }) {
  const [openId, setOpenId] = useState<string | null>(services[0]?.id ?? null);

  return (
    <div className="svc-list">
      <div className="svc-list-head">
        <span className="mono">What we do</span>
        <span className="mono">{services.length} pillars</span>
      </div>
      {services.map((s, i) => {
        const open = openId === s.id;
        return (
          <div
            key={s.id}
            className="svc-row"
            data-open={open}
            data-tone={TONE[s.pillar] ?? "ink"}
          >
            <button
              type="button"
              className="svc-row-head"
              onClick={() => setOpenId(open ? null : s.id)}
              aria-expanded={open}
            >
              <div className="svc-row-l">
                <span className="mono svc-row-num">0{i + 1}</span>
                <span className="mono svc-row-kicker">{s.pillar.replace(/-/g, " · ")}</span>
              </div>
              <h3 className="svc-row-title">{s.name}</h3>
              <span className="svc-row-toggle" aria-hidden>
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
            </button>
            <div className="svc-row-body">
              <div className="svc-row-body-inner">
                <div className="svc-row-grid">
                  <p className="svc-lead">{s.shortDescription}</p>
                  <div>
                    <div className="mono" style={{ marginBottom: 12 }}>Capabilities</div>
                    <ul className="svc-includes">
                      {s.capabilities.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="ph svc-case-img" data-tone={TONE[s.pillar] ?? "ink"}></div>
                    <div className="svc-case-title">Case studies in this lane.</div>
                    <div className="mono" style={{ marginTop: 8 }}>
                      See projects below
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
