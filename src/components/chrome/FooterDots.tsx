"use client";

import { useEffect, useRef } from "react";

/* Footer dot matrix — pixel-for-pixel copy of fourmula.ai's bottom field.
   Grid is 52 cols × 14 rows of small circles, all sitting at a faint base
   opacity (0.15). On mousemove anywhere on the page we update each dot's
   opacity based on its distance from the cursor — within RADIUS cells the
   dot brightens linearly to 1.0 at the cursor centre. The "shape" you see
   in any given screenshot is just where the cursor happened to be.

   Implementation note: 728 dots updated on every mousemove would thrash
   React. We mount the grid once with no opacity state, then mutate each
   dot's inline opacity imperatively via refs inside a requestAnimationFrame.
   Zero React renders post-mount.                                         */

const COLS = 52;
const ROWS = 14;
const CELL = 18.6875; // dot diameter (also the grid cell size)
const GAP = 18.7013;
const STEP = CELL + GAP; // ~37.39px between dot centres
const RADIUS_CELLS = 6; // mouse spotlight reach, in cell units
const BASE_OPACITY = 0.15;

export function FooterDots() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const dots = Array.from(container.querySelectorAll<HTMLDivElement>(".footer-dot"));
    if (dots.length === 0) return;

    let raf = 0;
    let mouseX = -99999;
    let mouseY = -99999;
    let active = false;

    const update = () => {
      const rect = container.getBoundingClientRect();
      // Cursor position in cell units, relative to the grid origin.
      const cx = (mouseX - rect.left) / STEP;
      const cy = (mouseY - rect.top) / STEP;

      for (let i = 0; i < dots.length; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const dx = col - cx;
        const dy = row - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let opacity = BASE_OPACITY;
        if (active && dist < RADIUS_CELLS) {
          // Linear falloff. Slight ease via squaring smooths the falloff edge.
          const t = 1 - dist / RADIUS_CELLS;
          opacity = Math.max(BASE_OPACITY, t * t * (1 - BASE_OPACITY) + BASE_OPACITY);
        }
        dots[i].style.opacity = opacity.toFixed(3);
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      active = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    const onLeave = () => {
      active = false;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="footer-dots-grid"
      aria-hidden="true"
      style={{
        gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
        gap: `${GAP}px`,
      }}
    >
      {Array.from({ length: ROWS * COLS }).map((_, i) => (
        <div key={i} className="footer-dot" />
      ))}
    </div>
  );
}
