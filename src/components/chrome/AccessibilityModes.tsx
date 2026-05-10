"use client";

import { useEffect, useSyncExternalStore } from "react";

function subscribe(key: string) {
  return (cb: () => void) => {
    const handler = () => cb();
    window.addEventListener(`rl-toggle-${key}`, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(`rl-toggle-${key}`, handler);
      window.removeEventListener("storage", handler);
    };
  };
}

function readBool(key: string, def: boolean) {
  try {
    const v = localStorage.getItem(key);
    if (v == null) return def;
    return v === "1";
  } catch {
    return def;
  }
}

export function AccessibilityModes() {
  const reduceMotion = useSyncExternalStore(
    subscribe("rl-rm"),
    () => readBool("rl-rm", false),
    () => false,
  );
  const lowCarbon = useSyncExternalStore(
    subscribe("rl-lc"),
    () => readBool("rl-lc", false),
    () => false,
  );

  useEffect(() => {
    const html = document.documentElement;
    if (reduceMotion) html.setAttribute("data-reduce-motion", "true");
    else html.removeAttribute("data-reduce-motion");
    if (lowCarbon) html.setAttribute("data-low-carbon", "true");
    else html.removeAttribute("data-low-carbon");
  }, [reduceMotion, lowCarbon]);

  if (!reduceMotion && !lowCarbon) return null;

  return (
    <div className="mode-badge-wrap" aria-live="polite">
      {lowCarbon && (
        <div className="mode-badge mode-badge-lc">
          <span className="mode-badge-dot" aria-hidden="true"></span>
          <span>LOW-CARBON · TEXT ONLY</span>
        </div>
      )}
      {reduceMotion && (
        <div className="mode-badge mode-badge-rm">
          <span className="mode-badge-dot" aria-hidden="true"></span>
          <span>REDUCED MOTION</span>
        </div>
      )}
    </div>
  );
}
