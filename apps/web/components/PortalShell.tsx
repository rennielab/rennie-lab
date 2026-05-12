'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { Avatar } from '@/components/Avatar';
import { ChatButton } from '@/components/ChatSlideOut';
import { Logo } from '@/components/Logo';
import { currentClient } from '@/lib/mock';
import {
  formatRelative,
  markAllNotificationsRead,
  markNotificationRead,
  useNotifications,
  useUnreadCount,
} from '@/lib/portalState';

const NAV = [
  { href: '/portal/home', label: 'Home', icon: <HomeIcon /> },
  { href: '/portal/matters', label: 'Matters', icon: <BriefcaseIcon /> },
  { href: '/portal/invoices', label: 'Invoices', icon: <InvoiceIcon /> },
  { href: '/portal/documents', label: 'Documents', icon: <FileIcon /> },
  { href: '/portal/messages', label: 'Messages', icon: <MessageIcon /> },
  { href: '/portal/contact', label: 'Contact', icon: <BookIcon /> },
];

export function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="bg-card/95 backdrop-blur border-b border-border sticky top-0 z-20">
        <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/portal/home" className="flex items-center">
            <Logo height={28} />
          </Link>

          <nav className="flex items-center gap-2">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active ? 'text-fg' : 'text-fg-muted hover:text-fg'
                  }`}>
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center ${
                      active ? 'border border-accent text-accent bg-accent-soft/40' : 'text-fg-muted'
                    }`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ChatButton me={{ side: 'client', name: 'Sarah Mitchell', initials: 'SM', role: 'Reyes Family Trust' }} />
            <NotificationsBell />
            <Link
              href="/portal/profile"
              className="flex items-center gap-2 pl-1 pr-3 h-10 rounded-full border border-border hover:bg-bg">
              <Avatar src={currentClient.avatarUrl} name={currentClient.name} initials={currentClient.initials} size={32} bg="#FFE4E6" fg="#9F1239" />
              <span className="text-sm font-medium">{currentClient.name.split(' ')[0]}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-8 py-8">{children}</main>
    </div>
  );
}

// ---------- Bell + Notifications popover ----------

function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useNotifications();
  const unread = useUnreadCount();

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
        className="w-10 h-10 rounded-full border border-border bg-card hover:bg-bg flex items-center justify-center relative">
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
            <button
              onClick={() => markAllNotificationsRead()}
              className="text-xs font-medium text-accent hover:underline">
              Mark all read
            </button>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-fg-muted">You’re all caught up.</div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href ?? '#'}
                  onClick={() => {
                    markNotificationRead(n.id);
                    setOpen(false);
                  }}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-bg/50 ${
                    n.read ? '' : 'bg-accent-soft/20'
                  }`}>
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      n.kind === 'invoice' ? 'bg-accent-soft text-accent-dark' :
                      n.kind === 'note' ? 'bg-[#F3E8FF] text-[#7E22CE]' :
                      n.kind === 'message' ? 'bg-[#DBEAFE] text-[#1D4ED8]' :
                      'bg-bg text-fg-muted'
                    }`}>
                    {n.kind === 'invoice' && <SmDollar />}
                    {n.kind === 'note' && <SmBook />}
                    {n.kind === 'message' && <SmChat />}
                    {n.kind === 'time' && <SmClock />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-fg truncate">{n.title}</div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />}
                    </div>
                    <div className="text-xs text-fg-muted mt-0.5 line-clamp-2">{n.body}</div>
                    <div className="text-[11px] text-fg-subtle mt-1">{formatRelative(n.at)}</div>
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

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16v13H4zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InvoiceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SmDollar() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function SmBook() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function SmChat() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function SmClock() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
