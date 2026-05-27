"use client";

import { useEffect, useRef, useState } from "react";

const COPY =
  "Rennie Lab acknowledge the Traditional Owners of Country throughout Australia and pay our respects to Elders past, present and emerging. We honour their enduring connection to land, waters, skies and culture. As the first storytellers of these lands, we give thanks for their care and share our respect and friendship with all First Nations peoples.";

export function WelcomeAcknowledgement() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mount-only effect: mark mounted so the overlay can render. We deliberately
  // DO NOT auto-open the modal — interrupting every visit with a modal feels
  // loud. The Acknowledgement of Country band at the bottom of the footer is
  // always visible, and the footer's ↑ link triggers this modal on demand.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // External trigger — footer "Acknowledgement of Country ↑" link opens it.
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
