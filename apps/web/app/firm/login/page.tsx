'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/components/Logo';

export default function FirmLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('sophia.williams@acmecorp.law');
  const [password, setPassword] = useState('demopass');
  const [reveal, setReveal] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* LEFT */}
      <div className="relative flex flex-col px-12 py-10">
        <Link href="/" className="self-start">
          <Logo height={36} />
        </Link>

        <div className="flex-1 flex items-center justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push('/firm');
            }}
            className="w-full max-w-[392px]">
            <div className="text-center mb-8">
              <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-fg">Login to your account</h1>
              <p className="text-sm text-fg-muted mt-2">Enter your details to login and get tracking!</p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-fg">Email Address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@firm.com"
                  className="mt-1.5 w-full h-11 px-3.5 rounded-[10px] border border-border bg-card text-sm placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-fg">Password</span>
                <div className="mt-1.5 relative">
                  <input
                    type={reveal ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full h-11 pl-3.5 pr-11 rounded-[10px] border border-border bg-card text-sm placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
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

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-[var(--color-accent)]"
                  />
                  <span className="text-sm text-fg">Keep me logged in</span>
                </label>
                <a className="text-sm font-medium underline underline-offset-2 hover:text-accent cursor-pointer">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-[10px] bg-accent text-white text-sm font-semibold hover:bg-accent-dim transition shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                Login
              </button>
            </div>
          </form>
        </div>

        <div className="text-xs text-fg-subtle">© 2026 Clockd</div>
      </div>

      {/* RIGHT — marketing card (same as admin) */}
      <div className="hidden lg:flex p-6">
        <div className="flex-1 rounded-2xl bg-bg flex flex-col px-16 py-14 relative overflow-hidden">
          <div className="max-w-[640px]">
            <h2 className="text-[28px] font-semibold leading-[1.25] tracking-[-0.5px] text-fg">
              The #1 choice of legal professionals for managing clients, cases, billing, and more.
            </h2>
            <p className="text-sm text-fg-muted mt-4 leading-relaxed max-w-[560px]">
              The most popular free time tracker for attorneys. Track time you spend on legal matters and calculate
              your billable hours based on your hourly rates.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="w-2 h-2 rounded-full bg-border-strong" />
              <div className="w-2 h-2 rounded-full bg-border-strong" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
