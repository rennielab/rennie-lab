"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/chrome/ThemeProvider";
import { CLIENT_LOGOS_DARK_THEME, CLIENT_LOGOS_LIGHT_THEME } from "@/data/clientLogos";

const SLOTS = 18; // 6 columns × 3 rows
const CYCLE_MS = 11000;
const FADE_MS = 850;

type Slot = { src: string; phase: 0 | 1; idx: number };

export function LogoStrip() {
  const { theme } = useTheme();
  // remount when theme flips so new slots fade in, no cross-palette mid-cycle
  return <LogoStripInner key={theme} theme={theme} />;
}

function LogoStripInner({ theme }: { theme: "light" | "dark" }) {
  const all = theme === "dark" ? CLIENT_LOGOS_DARK_THEME : CLIENT_LOGOS_LIGHT_THEME;
  // Cycle through the logo set so SLOTS can exceed the number of logos
  // (24 slots, ~13 logos) — duplicates land non-adjacently and diverge
  // as the rotation runs.
  const [slots, setSlots] = useState<Slot[]>(() =>
    Array.from({ length: SLOTS }, (_, i) => ({
      src: all[i % all.length]!,
      phase: 1 as const,
      idx: i,
    })),
  );
  const cursor = useRef(SLOTS);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const swap = (i: number) => {
      setSlots((prev) => prev.map((s, j) => (j === i ? { ...s, phase: 0 as const } : s)));
      const t = setTimeout(() => {
        setSlots((prev) =>
          prev.map((s, j) => {
            if (j !== i) return s;
            const next = all[cursor.current % all.length]!;
            cursor.current += 1;
            return { src: next, phase: 1 as const, idx: cursor.current };
          }),
        );
      }, FADE_MS);
      timeouts.push(t);
    };

    for (let i = 0; i < SLOTS; i++) {
      const startDelay = (CYCLE_MS / SLOTS) * i + Math.random() * 250;
      const start = setTimeout(() => {
        swap(i);
        const id = setInterval(() => swap(i), CYCLE_MS);
        intervals.push(id);
      }, startDelay);
      timeouts.push(start);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [all]);

  return (
    <div className="logo-strip">
      {slots.map((s, i) => (
        <div key={i} className="logo-cell">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={s.idx}
            src={s.src}
            alt=""
            width={600}
            height={400}
            className="logo-mark logo-mark-img"
            decoding="async"
            style={{ opacity: s.phase * 0.85 }}
          />
        </div>
      ))}
    </div>
  );
}
