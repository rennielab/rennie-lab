'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { currentFirmUser, firm } from '@/lib/mock';
import {
  formatRelativeFirm,
  markAllFirmNotificationsRead,
  markFirmNotificationRead,
  useFirmNotifications,
  useFirmUnreadCount,
} from '@/lib/firmState';

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
            <FirmNotificationsBell />
            {action}
          </div>
        </header>
        <div className="flex-1 px-8 pb-8">{children}</div>
      </main>
    </div>
  );
}

// ---------- Bell ----------

function FirmNotificationsBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useFirmNotifications();
  const unread = useFirmUnreadCount();

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-white relative">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] bg-card border border-border rounded-2xl shadow-[0_20px_60px_-20px_rgba(15,20,25,0.25)] overflow-hidden z-30">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="text-sm font-semibold">Notifications</div>
            <button onClick={() => markAllFirmNotificationsRead()} className="text-xs font-medium text-accent hover:underline">
              Mark all read
            </button>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-fg-muted">All caught up.</div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href ?? '#'}
                  onClick={() => {
                    markFirmNotificationRead(n.id);
                    setOpen(false);
                  }}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-bg/50 ${n.read ? '' : 'bg-accent-soft/20'}`}>
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      n.kind === 'rejected' ? 'bg-danger-soft text-danger' :
                      n.kind === 'assigned' ? 'bg-accent-soft text-accent-dark' :
                      n.kind === 'message' ? 'bg-[#DBEAFE] text-[#1D4ED8]' :
                      'bg-[#F3E8FF] text-[#7E22CE]'
                    }`}>
                    {n.kind === 'rejected' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                    {n.kind === 'assigned' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                    {n.kind === 'message' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    {n.kind === 'reminder' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-fg truncate">{n.title}</div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />}
                    </div>
                    <div className="text-xs text-fg-muted mt-0.5 line-clamp-2">{n.body}</div>
                    <div className="text-[11px] text-fg-subtle mt-1">{formatRelativeFirm(n.at)}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
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
