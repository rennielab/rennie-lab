"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CLIENT_LOGOS } from "@/data/clientLogos";

const COLS = 6;

function pickInitial() {
  return Array.from({ length: COLS }, (_, i) => i % CLIENT_LOGOS.length);
}

export function LogoStrip() {
  const [indexes, setIndexes] = useState<number[]>(pickInitial);

  useEffect(() => {
    const offsets = Array.from({ length: COLS }, (_, i) => i * 700 + Math.random() * 400);
    const timers = offsets.map((delay, col) =>
      setTimeout(() => {
        const cycle = () => {
          setIndexes((prev) => {
            const next = [...prev];
            const used = new Set(next);
            let candidate = (next[col] + 1 + Math.floor(Math.random() * 3)) % CLIENT_LOGOS.length;
            let guard = 0;
            while (used.has(candidate) && guard < 8) {
              candidate = (candidate + 1) % CLIENT_LOGOS.length;
              guard++;
            }
            next[col] = candidate;
            return next;
          });
        };
        cycle();
        const interval = setInterval(cycle, 4000);
        return () => clearInterval(interval);
      }, delay),
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <div className="logo-strip">
      {indexes.map((idx, col) => (
        <div key={col} className="logo-cell">
          <Image
            key={`${col}-${idx}`}
            src={CLIENT_LOGOS[idx]!}
            alt=""
            width={120}
            height={64}
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
              opacity: 0.55,
              mixBlendMode: "multiply",
              animation: "rise 800ms cubic-bezier(0.22,1,0.36,1) both",
            }}
          />
        </div>
      ))}
    </div>
  );
}
