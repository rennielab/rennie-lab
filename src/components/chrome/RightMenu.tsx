"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const NEWS_ITEMS = [
  {
    id: "n1",
    cat: "NEWSLETTERS",
    title: "OFF Climate: Why design must lead the next decade…",
    sub: "Notes on the role of creative practice in climate strategy…",
    tone: "red",
  },
  {
    id: "n2",
    cat: "PRESS",
    title: "“Quiet bold,” Rennie’s Ben on the studio’s new chapter…",
    sub: "How Reny became Rennie Lab — and what changed underneath…",
    tone: "cream",
  },
  {
    id: "n3",
    cat: "NEWSLETTERS",
    title: "OFF Brand: The half-life of a movement, mapped…",
    sub: "Why most movements stall at year three, and how to push past…",
    tone: "moss",
  },
];

const LOCATIONS = [
  { id: "sydney", label: "SYD", tz: "Australia/Sydney" },
  { id: "la", label: "LA", tz: "America/Los_Angeles" },
];

function subscribeToggle(storageKey: string) {
  return (cb: () => void) => {
    const handler = (e: Event) => {
      if ((e as CustomEvent).type === `rl-toggle-${storageKey}`) cb();
      else if ((e as StorageEvent).key === storageKey) cb();
    };
    window.addEventListener("storage", handler);
    window.addEventListener(`rl-toggle-${storageKey}`, handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(`rl-toggle-${storageKey}`, handler);
    };
  };
}

function ToggleSwitch({ storageKey, defaultOn = false }: { storageKey: string; defaultOn?: boolean }) {
  const on = useSyncExternalStore(
    subscribeToggle(storageKey),
    () => {
      try {
        const v = localStorage.getItem(storageKey);
        if (v == null) return defaultOn;
        return v === "1";
      } catch {
        return defaultOn;
      }
    },
    () => defaultOn,
  );

  const set = (next: boolean) => {
    try {
      localStorage.setItem(storageKey, next ? "1" : "0");
    } catch {}
    window.dispatchEvent(new CustomEvent(`rl-toggle-${storageKey}`));
  };

  return (
    <button
      type="button"
      onClick={() => set(!on)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 999,
        background: on ? "var(--ink)" : "var(--line-2)",
        position: "relative",
        transition: "background 200ms",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: on ? "var(--bg)" : "var(--bg-card)",
          transition: "left 220ms cubic-bezier(0.22,1,0.36,1)",
        }}
      ></span>
    </button>
  );
}

export function RightMenu() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("sydney");
  const [now, setNow] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function tzTime(tz: string) {
    if (!now) return "—";
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    }).format(now);
  }

  const goJournal = () => {
    setOpen(false);
    router.push("/journal");
  };

  return (
    <div className="chrome right-menu" ref={ref}>
      <div className="right-pill">
        {LOCATIONS.map((l) => (
          <span
            key={l.id}
            className="loc"
            data-active={location === l.id}
            onClick={() => setLocation(l.id)}
          >
            {l.label} {tzTime(l.tz)}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="dots-btn"
        data-open={open}
        onClick={() => setOpen((v) => !v)}
        aria-label="settings"
      >
        <div className="dots-grid">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <div className="dots-panel" data-open={open}>
        <div className="dots-row">
          <span className="dots-row-label">Theme</span>
          <div className="theme-toggle">
            <button type="button" data-active={theme === "light"} onClick={() => setTheme("light")}>
              Day
            </button>
            <button type="button" data-active={theme === "dark"} onClick={() => setTheme("dark")}>
              Night
            </button>
          </div>
        </div>
        <div className="dots-row">
          <span className="dots-row-label">Reduce motion</span>
          <ToggleSwitch storageKey="rl-rm" />
        </div>
        <div className="dots-row">
          <span className="dots-row-label">Low-carbon mode</span>
          <ToggleSwitch storageKey="rl-lc" defaultOn />
        </div>
        <div className="dots-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
          <span className="dots-row-label">Studios</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            <span>Sydney · {tzTime("Australia/Sydney")} AEST</span>
            <span>Los Angeles · {tzTime("America/Los_Angeles")} PST</span>
          </div>
        </div>
        <div className="dots-row">
          <span className="dots-row-label">Press kit</span>
          <span
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent("open-download", { detail: { kind: "press" } }));
            }}
            style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink)", cursor: "pointer" }}
          >
            Download ↓
          </span>
        </div>
        <div className="dots-row">
          <span className="dots-row-label">Capabilities deck</span>
          <span
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent("open-download", { detail: { kind: "deck" } }));
            }}
            style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink)", cursor: "pointer" }}
          >
            Download ↓
          </span>
        </div>

        <div className="dots-news-head">
          <span className="dots-row-label">Latest news</span>
          <span className="dots-news-all" onClick={goJournal}>
            [ ALL ]
          </span>
        </div>
        <div className="dots-news-list">
          {NEWS_ITEMS.map((n) => (
            <div key={n.id} className="dots-news-item" onClick={goJournal}>
              <div className="dots-news-text">
                <div className="dots-news-title">{n.title}</div>
                <div className="dots-news-sub">{n.sub}</div>
                <div className="dots-news-cat">{n.cat}</div>
              </div>
              <div className="dots-news-thumb ph" data-tone={n.tone}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
