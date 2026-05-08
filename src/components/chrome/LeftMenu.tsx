"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, routeIdFromPath } from "./navigation";
import { useTheme } from "./ThemeProvider";

const CHANNELS = ["INSTAGRAM", "LINKEDIN", "SUBSTACK", "OFF.CLIMATE"];

export function LeftMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const route = routeIdFromPath(pathname);
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/brand-logo-light.png" : "/brand-logo-dark.png";

  const close = () => setOpen(false);

  return (
    <nav className="chrome left-menu" data-open={open}>
      <div className="left-menu-head">
        <Link href="/" className="brand" onClick={close} style={{ cursor: "pointer" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src={logoSrc} alt="Rennie Lab" />
          <div className="brand-label">{route === "home" ? "Home" : route}</div>
        </Link>
        <button
          className="icon-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label="toggle menu"
          type="button"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M3 9h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                d="M3 5h12M3 9h12M3 13h12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="left-menu-body">
        <div>
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
          <div className="nav-meta">
            <div className="nav-meta-title">Channels</div>
            {CHANNELS.map((c) => (
              <div key={c} className="nav-channel">
                <span>{c}</span>
                <span style={{ opacity: 0.5 }}>↗</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
