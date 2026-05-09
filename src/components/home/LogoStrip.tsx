"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/chrome/ThemeProvider";
import { CLIENT_LOGOS_DARK_THEME, CLIENT_LOGOS_LIGHT_THEME } from "@/data/clientLogos";

const SLOTS = 6;
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
  const [slots, setSlots] = useState<Slot[]>(() =>
    all.slice(0, SLOTS).map((src, i) => ({ src, phase: 1, idx: i })),
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
            className="logo-mark logo-mark-img"
            style={{ opacity: s.phase * 0.85 }}
          />
        </div>
      ))}
    </div>
  );
}
