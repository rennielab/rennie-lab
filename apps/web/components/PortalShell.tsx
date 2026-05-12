'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { firm } from '@/lib/mock';

export function PortalShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b border-border sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/portal" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sidebar flex items-center justify-center">
              <span className="text-accent font-bold">C</span>
            </div>
            <div>
              <div className="text-xs text-fg-muted">Client Portal</div>
              <div className="font-bold text-sm">{firm.name}</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/portal/matters" className="px-3 py-2 text-sm font-medium hover:text-accent">
              Matters
            </Link>
            <Link href="/portal/invoices" className="px-3 py-2 text-sm font-medium hover:text-accent">
              Invoices
            </Link>
            <Link href="/portal/contact" className="px-3 py-2 text-sm font-medium hover:text-accent">
              Contact
            </Link>
            <button
              onClick={() => router.push('/')}
              className="ml-3 px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg">
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-fg-muted mt-1">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
