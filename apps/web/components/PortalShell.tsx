'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const NAV = [
  { href: '/portal/matters', label: 'Matters', icon: <BriefcaseIcon /> },
  { href: '/portal/invoices', label: 'Invoices', icon: <InvoiceIcon /> },
  { href: '/portal/contact', label: 'Contact', icon: <BookIcon /> },
];

export function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="bg-card/95 backdrop-blur border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/portal" className="flex items-center">
            <Wordmark />
          </Link>

          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    active ? 'bg-accent-soft text-accent-dark' : 'text-fg hover:bg-bg'
                  }`}>
                  <span className={active ? 'text-accent' : 'text-fg-muted'}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full border border-border bg-card hover:bg-bg flex items-center justify-center relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </button>
            <button onClick={() => router.push('/')} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border hover:bg-bg">
              <span style={{ background: '#FFE4E6', color: '#9F1239' }} className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">
                SM
              </span>
              <span className="text-sm font-medium">Sarah</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-8">{children}</main>
    </div>
  );
}

function Wordmark() {
  return (
    <svg width="110" height="28" viewBox="0 0 180 32" fill="none">
      <text x="0" y="24" fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif" fontSize="26" fontWeight="900" letterSpacing="2" fill="#22C55E">CLOCKD</text>
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16v13H4zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InvoiceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
