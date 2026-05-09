"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "rl-aoc-shown";

const COPY =
  "Rennie Lab acknowledge the Traditional Owners of Country throughout Australia and pay our respects to Elders past, present and emerging. We honour their enduring connection to land, waters, skies and culture. As the first storytellers of these lands, we give thanks for their care and share our respect and friendship with all First Nations peoples.";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function WelcomeAcknowledgement() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const lastShown = localStorage.getItem(STORAGE_KEY);
      if (lastShown !== todayKey()) {
        const t = setTimeout(() => setOpen(true), 700);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-acknowledgement", handler);
    return () => window.removeEventListener("open-acknowledgement", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    try {
      localStorage.setItem(STORAGE_KEY, todayKey());
    } catch {}
    setOpen(false);
  }

  if (!mounted) return null;

  return (
    <div className="aoc-overlay" data-open={open} aria-hidden={!open}>
      <div
        className="aoc-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="aoc-title"
      >
        <div className="aoc-grid">
          <div className="aoc-video">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src="/welcome-to-country.mp4"
              poster="/welcome-to-country-poster.jpg"
              autoPlay
              muted
              playsInline
              loop
            />
          </div>
          <div className="aoc-text">
            <div className="mono" id="aoc-title">
              Acknowledgement of Country
            </div>
            <p className="aoc-body">{COPY}</p>
            <div>
              <button type="button" className="btn btn-primary" onClick={close}>
                Continue <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
