"use client";

import { useEffect, useState } from "react";

export function CarbonTracker() {
  const [grams, setGrams] = useState(0);
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const y = window.scrollY;
        const pct = h > 0 ? Math.min(100, (y / h) * 100) : 0;
        setScrolled(pct);
        setGrams(parseFloat((0.18 + y / 50000).toFixed(2)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="carbon-tracker"
      title="Estimated CO₂e for this visit · low-carbon hosting on green grid"
    >
      <div className="carbon-leaf"></div>
      <span>CO₂e</span>
      <span className="carbon-num">{grams.toFixed(2)}g</span>
      <div className="carbon-bar">
        <div style={{ width: `${Math.min(100, grams * 40)}%` }}></div>
      </div>
      <span style={{ opacity: 0.6 }}>{scrolled.toFixed(0)}%</span>
    </div>
  );
}
