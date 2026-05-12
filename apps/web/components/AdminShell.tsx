'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { Logo } from '@/components/Logo';
import { currentAdmin, firm } from '@/lib/mock';
import {
  formatRelativeAdmin,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  useAdminNotifications,
  useAdminUnreadCount,
} from '@/lib/adminState';

type NavItem = { href: string; label: string; icon: ReactNode };

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <Icon d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z" /> },
  { href: '/admin/entries', label: 'Time Entries', icon: <Icon d="M12 7v5l3 2M12 22a10 10 0 110-20 10 10 0 010 20z" /> },
  { href: '/admin/matters', label: 'Matters', icon: <Icon d="M4 7h16v13H4zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /> },
  { href: '/admin/clients', label: 'Clients', icon: <Icon d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /> },
  { href: '/admin/invoices', label: 'Invoices', icon: <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6" /> },
  { href: '/admin/team', label: 'Team', icon: <Icon d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" /> },
];

export function AdminShell({
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
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-[260px] bg-sidebar text-sidebar-fg flex flex-col py-5 px-4 sticky top-0 h-screen">
        <Link href="/admin" className="flex items-center gap-3 px-2 mb-3">
          <Logo height={26} />
        </Link>
        <div className="px-2 mb-3">
          <div className="text-xs text-sidebar-muted">{firm.name}</div>
          <div className="text-[11px] text-sidebar-muted/70">{firm.location}</div>
        </div>

        <div className="px-2 my-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-sidebar-muted text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>Search…</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? 'bg-sidebar-active text-accent font-semibold'
                    : 'text-sidebar-muted hover:text-sidebar-fg hover:bg-white/5'
                }`}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 pt-3 border-t border-white/10">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-muted hover:bg-white/5">
            <Icon d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82h0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
            <span>Settings</span>
          </Link>
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 text-left">
            <div className="w-9 h-9 rounded-full bg-accent-soft-2/20 text-accent flex items-center justify-center font-semibold text-sm">
              {currentAdmin.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{currentAdmin.name}</div>
              <div className="text-xs text-sidebar-muted truncate">{currentAdmin.role}</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur border-b border-border px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-sm text-fg-muted mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <NotificationsBell />
            {action}
          </div>
        </header>
        <div className="flex-1 px-8 py-6">{children}</div>
      </main>
    </div>
  );
}

function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useAdminNotifications();
  const unread = useAdminUnreadCount();

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
        className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-bg transition relative">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
        <div className="absolute right-0 mt-2 w-[380px] bg-card border border-border rounded-2xl shadow-[0_20px_60px_-20px_rgba(15,20,25,0.25)] overflow-hidden z-30">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="text-sm font-semibold">Notifications</div>
            <button onClick={() => markAllAdminNotificationsRead()} className="text-xs font-medium text-accent hover:underline">
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
                    markAdminNotificationRead(n.id);
                    setOpen(false);
                  }}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-bg/50 ${
                    n.read ? '' : 'bg-accent-soft/20'
                  }`}>
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      n.kind === 'payment' ? 'bg-accent-soft text-accent-dark' :
                      n.kind === 'overdue' ? 'bg-danger-soft text-danger' :
                      n.kind === 'message' ? 'bg-[#DBEAFE] text-[#1D4ED8]' :
                      'bg-[#F3E8FF] text-[#7E22CE]'
                    }`}>
                    {n.kind === 'payment' && <Sm d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" />}
                    {n.kind === 'overdue' && <Sm d="M12 8v4M12 16h.01" extra={<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />} />}
                    {n.kind === 'submission' && <Sm d="M12 4v16M4 12h16" />}
                    {n.kind === 'message' && <Sm d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-fg truncate">{n.title}</div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />}
                    </div>
                    <div className="text-xs text-fg-muted mt-0.5 line-clamp-2">{n.body}</div>
                    <div className="text-[11px] text-fg-subtle mt-1">{formatRelativeAdmin(n.at)}</div>
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

function Sm({ d, extra }: { d: string; extra?: ReactNode }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      {extra}
      <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
