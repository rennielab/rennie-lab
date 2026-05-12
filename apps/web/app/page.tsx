'use client';

import Link from 'next/link';

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card rounded-2xl border border-border p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-sidebar flex items-center justify-center">
            <span className="text-accent font-bold text-lg">C</span>
          </div>
          <div>
            <div className="text-fg font-bold tracking-wider text-lg">CLOCKD</div>
            <div className="text-xs text-fg-muted">Time tracking for lawyers</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-fg-muted text-sm mb-8">Choose how you&apos;d like to sign in.</p>

        <div className="space-y-3">
          <Link
            href="/admin/login"
            className="flex items-center justify-between w-full px-5 py-4 rounded-xl border border-border hover:border-accent hover:bg-accent-soft/30 transition group">
            <div>
              <div className="font-semibold">Firm Admin</div>
              <div className="text-xs text-fg-muted">Manage matters, time entries, invoices</div>
            </div>
            <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/portal/login"
            className="flex items-center justify-between w-full px-5 py-4 rounded-xl border border-border hover:border-accent hover:bg-accent-soft/30 transition group">
            <div>
              <div className="font-semibold">Client Portal</div>
              <div className="text-xs text-fg-muted">View matters and pay invoices</div>
            </div>
            <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <p className="text-xs text-fg-subtle text-center mt-8">Prototype · Bennett &amp; Hayes LLP demo data</p>
      </div>
    </div>
  );
}
