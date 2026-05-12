'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { currentFirmUser, firm } from '@/lib/mock';

type NavItem = { href: string; label: string; icon: ReactNode };

const NAV: NavItem[] = [
  { href: '/firm', label: 'Dashboard', icon: <IconGrid /> },
  { href: '/firm/time', label: 'Time Entries', icon: <IconClock /> },
  { href: '/firm/matters', label: 'Matters', icon: <IconBriefcase /> },
  { href: '/firm/clients', label: 'Clients', icon: <IconUsers /> },
];

export function FirmShell({
  children,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-[260px] bg-sidebar text-sidebar-fg flex flex-col py-5 sticky top-0 h-screen shrink-0">
        {/* Firm header */}
        <div className="flex items-center gap-3 px-4 mb-5">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
            d
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm truncate">{firm.name}</div>
            <div className="text-xs text-sidebar-muted truncate">{firm.location}</div>
          </div>
          <button className="text-sidebar-muted hover:text-sidebar-fg" aria-label="Collapse sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9 4v16" stroke="currentColor" strokeWidth="1.8" />
              <path d="M14 8l3 4-3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-white/5 text-sidebar-muted text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>Search…</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/firm' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 h-10 rounded-lg text-sm transition ${
                  active
                    ? 'bg-accent text-white font-semibold'
                    : 'text-sidebar-muted hover:text-sidebar-fg hover:bg-white/5'
                }`}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pt-3 border-t border-white/10 space-y-1">
          <Link
            href="/firm/settings"
            className="flex items-center gap-3 px-3 h-10 rounded-lg text-sm text-sidebar-muted hover:bg-white/5">
            <IconGear />
            <span>Settings</span>
          </Link>
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left">
            <div className="w-9 h-9 rounded-full bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold text-xs">
              {currentFirmUser.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{currentFirmUser.name}</div>
              <div className="text-xs text-sidebar-muted truncate">{currentFirmUser.role}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-sidebar-muted">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="px-8 py-5 flex items-center justify-between bg-bg sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-semibold text-fg tracking-[-0.5px]">{title}</h1>
            {subtitle && <p className="text-sm text-fg-muted mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-white relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-danger" />
            </button>
            {action}
          </div>
        </header>
        <div className="flex-1 px-8 pb-8">{children}</div>
      </main>
    </div>
  );
}

// ---------- Icons ----------

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconGear() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82h0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
