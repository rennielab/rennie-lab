'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/components/Logo';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('marcus@bennetthayes.law');
  const [password, setPassword] = useState('demopass');
  const [reveal, setReveal] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* LEFT — form column */}
      <div className="relative flex flex-col px-12 py-10">
        {/* Top logo */}
        <Link href="/" className="self-start">
          <Logo height={36} />
        </Link>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push('/admin');
            }}
            className="w-full max-w-[392px]">
            <div className="text-center mb-8">
              <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-fg">Login to your account</h1>
              <p className="text-sm text-fg-muted mt-2">Enter your details to login and get tracking!</p>
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-11 rounded-[10px] border border-border bg-card hover:bg-bg transition text-sm font-medium">
              <GoogleG />
              <span>Continue with Google</span>
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-fg-subtle tracking-[2px] font-medium">OR</span>
              <div className="flex-1 h-px bg-border" />
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
                    aria-label={reveal ? 'Hide password' : 'Show password'}
                    onClick={() => setReveal((r) => !r)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg-muted">
                    <EyeIcon open={!reveal} />
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
                <a className="text-sm font-medium text-accent hover:underline cursor-pointer">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-[10px] bg-accent text-white text-sm font-semibold hover:bg-accent-dim transition shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                Login
              </button>
            </div>

            <p className="text-sm text-fg-muted text-center mt-6">
              Don&apos;t have an account?{' '}
              <a className="font-medium text-accent hover:underline cursor-pointer">Register</a>
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="text-xs text-fg-subtle">© 2026 Clockd</div>
      </div>

      {/* RIGHT — marketing card */}
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

          {/* Dashboard preview mockup */}
          <DashboardPreview />
        </div>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </>
      ) : (
        <>
          <path
            d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a19.79 19.79 0 015.06-6.06M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a19.86 19.86 0 01-3.16 4.07M1 1l22 22M14.12 14.12a3 3 0 11-4.24-4.24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function DashboardPreview() {
  // Small, stylized snapshot of the admin dashboard for the marketing column.
  return (
    <div className="mt-10 flex-1 flex items-end">
      <div className="w-full bg-white rounded-xl shadow-[0_20px_60px_-20px_rgba(15,20,25,0.18)] border border-border overflow-hidden">
        <div className="flex h-[280px]">
          {/* Mini sidebar */}
          <div className="w-12 bg-sidebar flex flex-col items-center py-3 gap-3">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white">d</div>
            <div className="w-7 h-7 rounded-md bg-white/10" />
            <div className="w-7 h-7 rounded-md" />
            <div className="w-7 h-7 rounded-md" />
            <div className="w-7 h-7 rounded-md" />
          </div>
          {/* Body */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-semibold text-fg">Dashboard</div>
                <div className="text-[10px] text-fg-muted">Welcome to Clockd</div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-12 h-5 rounded-md border border-border bg-white" />
                <div className="w-16 h-5 rounded-md bg-accent" />
              </div>
            </div>
            {/* Mini KPIs */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[
                { l: 'Total Hours', v: '1h 47m', t: '+12%' },
                { l: 'Hours Today', v: '1h' },
                { l: 'Billable', v: '1h 47m', t: '+12%' },
                { l: 'Non-Billable', v: '0h 0m' },
                { l: 'Unconfirmed', v: '2' },
              ].map((k, i) => (
                <div key={i} className="rounded-md border border-border p-2">
                  <div className="w-3 h-3 rounded-full bg-bg mb-1" />
                  <div className="text-[10px] font-semibold text-fg flex items-center gap-1">
                    {k.v}
                    {k.t && <span className="text-[8px] font-medium text-accent">↑ {k.t}</span>}
                  </div>
                  <div className="text-[8px] text-fg-muted">{k.l}</div>
                </div>
              ))}
            </div>
            {/* Mini chart */}
            <div className="rounded-md border border-border p-2">
              <div className="text-[10px] font-medium text-fg mb-2">Hours Over Time</div>
              <div className="flex items-end gap-2 h-16">
                {[20, 32, 18, 45, 28, 50, 40].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-accent rounded-sm" style={{ height: `${h}%` }} />
                    <div className="text-[7px] text-fg-subtle">02-0{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
