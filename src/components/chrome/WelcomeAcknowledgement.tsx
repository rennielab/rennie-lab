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
  const [videoOk, setVideoOk] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

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
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (target && panelRef.current && !panelRef.current.contains(target)) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    // delay 1 tick so the click that opened the panel doesn't immediately close it
    const t = setTimeout(() => document.addEventListener("click", onDocClick), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.removeEventListener("click", onDocClick);
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
    <>
      <div
        className="aoc-backdrop"
        data-open={open}
        aria-hidden="true"
      />
      <div className="aoc-overlay" data-open={open} aria-hidden={!open}>
      <div
        ref={panelRef}
        className="aoc-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="aoc-title"
      >
        <div className="aoc-grid">
          <div className="aoc-video">
            {videoOk ? (
              /* eslint-disable-next-line jsx-a11y/media-has-caption */
              <video
                src="/video/welcome-to-country.mp4"
                autoPlay
                muted
                playsInline
                loop
                onError={() => setVideoOk(false)}
              />
            ) : (
              <div className="aoc-video-fallback" aria-hidden="true" />
            )}
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
    </>
  );
}
