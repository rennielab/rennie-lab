'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('sarah.mitchell@example.com');
  const [password, setPassword] = useState('demopass');
  const [reveal, setReveal] = useState(false);
  const [keepLogged, setKeepLogged] = useState(false);

  return (
    <div className="min-h-screen relative bg-bg overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '160px 160px',
        }}
      />

      {/* Logo top-left */}
      <Link href="/" className="absolute top-8 left-8 z-10 flex items-center">
        <Wordmark />
      </Link>

      {/* Centered card */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push('/portal/invoices');
          }}
          className="w-full max-w-md bg-card border border-border rounded-2xl px-10 py-10 shadow-sm">
          <h1 className="text-2xl font-bold text-center">Login to your account</h1>
          <p className="text-sm text-fg-muted text-center mt-2 mb-8">
            Access your client portal to view cases, track progress, and manage invoices.
          </p>

          <label className="block mb-4">
            <span className="text-sm font-semibold">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="mt-1.5 w-full px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-fg-subtle"
              placeholder="iamwaleedshabbir@gmail.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <div className="mt-1.5 relative">
              <input
                type={reveal ? 'text' : 'password'}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg border border-border bg-card text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <button
                type="button"
                onClick={() => setReveal((r) => !r)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between mt-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={keepLogged}
                onChange={(ev) => setKeepLogged(ev.target.checked)}
                className="w-4 h-4 accent-[#22C55E]"
              />
              <span className="text-sm">Keep me logged in</span>
            </label>
            <button type="button" className="text-sm font-medium underline underline-offset-2 hover:text-accent">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-accent hover:bg-accent-dim text-white font-semibold transition">
            Login
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 left-8 text-xs text-fg-subtle">© 2026 Clockd</div>
    </div>
  );
}

function Wordmark() {
  return (
    <svg width="120" height="32" viewBox="0 0 180 32" fill="none">
      <text
        x="0"
        y="24"
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontSize="28"
        fontWeight="900"
        letterSpacing="2"
        fill="#22C55E">
        CLOCKD
      </text>
    </svg>
  );
}
