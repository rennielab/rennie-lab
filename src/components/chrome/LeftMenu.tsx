"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, routeIdFromPath } from "./navigation";
import { useTheme } from "./ThemeProvider";

type Channel = { label: string; href: string; external: boolean };
const CHANNELS: Channel[] = [
  { label: "97 PERCENT",  href: "https://97percent.co",                external: true  },
  { label: "INSTAGRAM",   href: "https://instagram.com/benrennie",     external: true  },
  { label: "LINKEDIN",    href: "https://linkedin.com/in/benrennie",   external: true  },
  { label: "SUBSTACK",    href: "https://benrennie.substack.com",      external: true  },
  { label: "OFF CLIMATE", href: "/journal",                            external: false },
];

/* ── Subscribe to a localStorage toggle with cross-tab + same-tab sync.
   Same pattern the old RightMenu used; lifted here so the toggles can
   live inside the LeftMenu after the right pill was retired.            */
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

function ToggleSwitch({
  storageKey,
  defaultOn = false,
}: {
  storageKey: string;
  defaultOn?: boolean;
}) {
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
      className="lm-toggle"
      data-on={on}
      aria-pressed={on}
    >
      <span className="lm-toggle-dot" />
    </button>
  );
}

export function LeftMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const route = routeIdFromPath(pathname);
  const { theme, setTheme } = useTheme();
  const logoSrc = theme === "dark" ? "/brand-logo-light.png" : "/brand-logo-dark.png";

  const close = () => setOpen(false);

  return (
    <nav className="chrome left-menu" data-open={open}>
      <div className="left-menu-head">
        <Link href="/" className="brand" onClick={close} style={{ cursor: "pointer" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="brand-logo logo-asset"
            src={logoSrc}
            alt="Rennie Lab"
            width={1378}
            height={157}
          />
          <div className="brand-label">{route === "home" ? "Home" : route}</div>
        </Link>
        <button
          className="icon-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label="toggle menu"
          type="button"
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="left-menu-body">
        <div>
          {/* Primary nav */}
          <div className="nav-list">
            {NAV_ITEMS.map((it) => (
              <Link
                key={it.id}
                href={it.href}
                className="nav-item"
                data-active={route === it.id}
                onClick={close}
              >
                <span>{it.label}</span>
                <span className="nav-num">{it.num}</span>
              </Link>
            ))}
            <div
              className="nav-item"
              data-active={false}
              onClick={() => {
                close();
                window.dispatchEvent(new CustomEvent("open-contact"));
              }}
            >
              <span>Contact</span>
              <span className="nav-num">06</span>
            </div>
          </div>

          <div className="nav-divider"></div>

          {/* Channels */}
          <div className="nav-meta">
            <div className="nav-meta-title">Channels</div>
            {CHANNELS.map((c) =>
              c.external ? (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-channel"
                  onClick={close}
                >
                  <span>{c.label}</span>
                  <span style={{ opacity: 0.5 }}>↗</span>
                </a>
              ) : (
                <Link
                  key={c.label}
                  href={c.href}
                  className="nav-channel"
                  onClick={close}
                >
                  <span>{c.label}</span>
                  <span style={{ opacity: 0.5 }}>→</span>
                </Link>
              ),
            )}
          </div>

          <div className="nav-divider"></div>

          {/* Settings — moved here from the old right dot-panel */}
          <div className="nav-meta">
            <div className="nav-meta-title">Settings</div>

            <div className="nav-setting-row">
              <span className="nav-setting-label">Theme</span>
              <div className="lm-theme-toggle">
                <button
                  type="button"
                  data-active={theme === "light"}
                  onClick={() => setTheme("light")}
                >
                  Day
                </button>
                <button
                  type="button"
                  data-active={theme === "dark"}
                  onClick={() => setTheme("dark")}
                >
                  Night
                </button>
              </div>
            </div>

            <div className="nav-setting-row">
              <span className="nav-setting-label">Reduce motion</span>
              <ToggleSwitch storageKey="rl-rm" />
            </div>

            <div className="nav-setting-row">
              <span className="nav-setting-label">Low-carbon mode</span>
              <ToggleSwitch storageKey="rl-lc" />
            </div>
          </div>

          <div className="nav-divider"></div>

          {/* Downloads — press kit + capabilities deck */}
          <div className="nav-meta">
            <div className="nav-meta-title">Download</div>
            <button
              type="button"
              className="nav-channel nav-channel-action"
              onClick={() => {
                close();
                window.dispatchEvent(
                  new CustomEvent("open-download", { detail: { kind: "press" } }),
                );
              }}
            >
              <span>PRESS KIT</span>
              <span style={{ opacity: 0.5 }}>↓</span>
            </button>
            <button
              type="button"
              className="nav-channel nav-channel-action"
              onClick={() => {
                close();
                window.dispatchEvent(
                  new CustomEvent("open-download", { detail: { kind: "deck" } }),
                );
              }}
            >
              <span>CAPABILITIES DECK</span>
              <span style={{ opacity: 0.5 }}>↓</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
