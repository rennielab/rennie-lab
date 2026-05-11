"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "rl-aoc-shown";

const COPY =
  "Rennie Lab acknowledge the Traditional Owners of Country throughout Australia and pay our respects to Elders past, present and emerging. We honour their enduring connection to land, waters, skies and culture. As the first storytellers of these lands, we give thanks for their care and share our respect and friendship with all First Nations peoples.";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function WelcomeAcknowledgement() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mount-only effect: gate the modal on a localStorage flag (per-day).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const lastShown = localStorage.getItem(STORAGE_KEY);
      if (lastShown !== todayKey()) {
        const t = setTimeout(() => setOpen(true), 700);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  // External trigger — footer "Acknowledgement of Country ↑" link reopens it.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-acknowledgement", handler);
    return () => window.removeEventListener("open-acknowledgement", handler);
  }, []);

  // Escape to close. Body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
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
      <button
        type="button"
        className="aoc-close"
        onClick={close}
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        ref={panelRef}
        className="aoc-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aoc-title"
      >
        <div className="mono aoc-eyebrow" id="aoc-title">
          Acknowledgement of Country
        </div>
        <p className="aoc-body">{COPY}</p>
        <button
          type="button"
          className="aoc-continue"
          onClick={close}
        >
          Continue <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}
