'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/components/Logo';

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
        <Logo height={32} />
      </Link>

      {/* Centered card */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push('/portal/matters');
          }}
          className="w-full max-w-[420px] bg-card border border-border rounded-2xl px-10 py-10 shadow-[0_8px_32px_-12px_rgba(15,20,25,0.12)]">
          <h1 className="text-2xl font-semibold text-center tracking-[-0.5px]">Login to your account</h1>
          <p className="text-sm text-fg-muted text-center mt-2 mb-7 leading-relaxed">
            Access your client portal to view cases, track progress, and manage invoices.
          </p>

          <label className="block mb-4">
            <span className="text-sm font-medium text-fg">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="mt-1.5 w-full h-11 px-3.5 rounded-[10px] border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent placeholder:text-fg-subtle"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-fg">Password</span>
            <div className="mt-1.5 relative">
              <input
                type={reveal ? 'text' : 'password'}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="••••••••••"
                className="w-full h-11 pl-3.5 pr-11 rounded-[10px] border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setReveal((r) => !r)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between mt-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepLogged}
                onChange={(ev) => setKeepLogged(ev.target.checked)}
                className="w-4 h-4 rounded border-border accent-[var(--color-accent)]"
              />
              <span className="text-sm text-fg">Keep me logged in</span>
            </label>
            <button type="button" className="text-sm font-medium underline underline-offset-2 hover:text-accent">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-[10px] bg-accent hover:bg-accent-dim text-white text-sm font-semibold transition shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            Login
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 left-8 text-xs text-fg-subtle">© 2026 Clockd</div>
    </div>
  );
}
