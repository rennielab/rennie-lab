'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('marcus@bennetthayes.law');
  const [password, setPassword] = useState('demopass');
  const [reveal, setReveal] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex items-center justify-center px-8 py-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push('/admin');
          }}
          className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2 mb-12">
            <div className="w-9 h-9 rounded-full bg-sidebar flex items-center justify-center">
              <span className="text-accent font-bold">C</span>
            </div>
            <span className="font-bold tracking-wider">CLOCKD</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Sign in to your firm</h1>
          <p className="text-fg-muted mb-8">Welcome back. Manage your firm&apos;s time and billing.</p>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full px-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <div className="mt-1.5 relative">
                <input
                  type={reveal ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                <button
                  type="button"
                  onClick={() => setReveal((r) => !r)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted text-sm">
                  {reveal ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
            <a className="text-sm text-warning font-medium cursor-pointer hover:underline">Forgot password?</a>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent-dim transition">
              Sign in
            </button>
          </div>

          <p className="text-sm text-fg-muted text-center mt-8">
            New to Clockd?{' '}
            <a className="text-accent font-medium cursor-pointer hover:underline">Request a demo</a>
          </p>
        </form>
      </div>

      {/* Right: hero panel */}
      <div className="hidden lg:flex bg-sidebar text-sidebar-fg items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at top right, #22C55E 0%, transparent 60%)' }} />
        <div className="relative max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft/15 text-accent text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" /> AI-CAPTURED TIME
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Every call. Every meeting. <span className="text-accent">Billed automatically.</span>
          </h2>
          <p className="text-sidebar-muted mt-6">
            Clockd captures billable time from phone calls and drafts entries with AI-summarized
            descriptions. Your lawyers focus on the work, not the timesheet.
          </p>
          <div className="mt-10 space-y-3">
            <Feature text="Auto-captured calls become draft entries" />
            <Feature text="One-click admin approvals" />
            <Feature text="Generate invoices from approved time" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );
}
