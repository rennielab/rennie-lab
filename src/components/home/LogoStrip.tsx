"use client";

import { useEffect, useRef, useState } from "react";

type LogoMark = {
  name: string;
  font: string;
  weight: number;
  size: number;
  tracking: string;
  italic?: boolean;
};

const ALL: LogoMark[] = [
  { name: "Patagonia",        font: "Georgia, serif",            weight: 700, size: 26, tracking: "0.02em" },
  { name: "WWF",              font: "var(--sans)",               weight: 800, size: 32, tracking: "-0.04em" },
  { name: "Beyond Blue",      font: "var(--sans)",               weight: 300, size: 20, tracking: "-0.01em" },
  { name: "CSIRO",            font: "var(--sans)",               weight: 700, size: 22, tracking: "0.18em" },
  { name: "Surfrider",        font: "Georgia, serif",            weight: 400, size: 24, tracking: "0",        italic: true },
  { name: "GreatForest",      font: "var(--sans)",               weight: 600, size: 20, tracking: "-0.02em" },
  { name: "Bundanon",         font: "Georgia, serif",            weight: 400, size: 26, tracking: "0.06em" },
  { name: "OFF·CLIMATE",      font: "var(--mono)",               weight: 500, size: 16, tracking: "0.12em" },
  { name: "Slow Goods",       font: "Georgia, serif",            weight: 400, size: 22, tracking: "-0.01em" },
  { name: "UN Habitat",       font: "var(--sans)",               weight: 500, size: 20, tracking: "0.04em" },
  { name: "Halfway Hotel",    font: "Georgia, serif",            weight: 400, size: 20, tracking: "-0.02em", italic: true },
  { name: "Ocean Foundation", font: "var(--sans)",               weight: 600, size: 17, tracking: "-0.01em" },
];

const SLOTS = 6;
const CYCLE_MS = 4000;
const FADE_MS = 700;

type Slot = { logo: LogoMark; phase: 0 | 1; idx: number };

export function LogoStrip() {
  const [slots, setSlots] = useState<Slot[]>(() =>
    ALL.slice(0, SLOTS).map((logo, i) => ({ logo, phase: 1, idx: i })),
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
            const next = ALL[cursor.current % ALL.length]!;
            cursor.current += 1;
            return { logo: next, phase: 1 as const, idx: cursor.current };
          }),
        );
      }, FADE_MS);
      timeouts.push(t);
    };

    for (let i = 0; i < SLOTS; i++) {
      const startDelay = (CYCLE_MS / SLOTS) * i + Math.random() * 400;
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
  }, []);

  return (
    <div className="logo-strip">
      {slots.map((s, i) => (
        <div key={i} className="logo-cell">
          <span
            key={s.idx}
            className="logo-mark"
            style={{
              fontFamily: s.logo.font,
              fontWeight: s.logo.weight,
              fontSize: s.logo.size,
              letterSpacing: s.logo.tracking,
              fontStyle: s.logo.italic ? "italic" : "normal",
              opacity: s.phase,
            }}
          >
            {s.logo.name}
          </span>
        </div>
      ))}
    </div>
  );
}
