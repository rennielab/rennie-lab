'use client';

import Link from 'next/link';

import { Logo } from '@/components/Logo';

const PERSONAS = [
  {
    role: 'Firm Admin',
    name: 'Marcus Hayes',
    title: 'Managing Partner · Bennett & Hayes LLP',
    blurb: 'Approve time, issue invoices, chase overdue, manage the team. Marcus runs the firm.',
    initials: 'MH',
    bg: '#FED7AA',
    fg: '#9A3412',
    href: '/admin/login',
    cta: 'Sign in as Marcus →',
    powers: ['Approve / reject time entries', 'Issue invoices', 'Manage team & rates', 'See firm-wide finances'],
  },
  {
    role: 'Firm User',
    name: 'Sophia Williams',
    title: 'Lawyer · Bennett & Hayes LLP',
    blurb: 'Log time, work on matters, submit for partner approval. Sophia bills the hours.',
    initials: 'SW',
    bg: '#FEF3C7',
    fg: '#92400E',
    href: '/firm/login',
    cta: 'Sign in as Sophia →',
    powers: ['Log time entries (manual + call)', 'See her assigned matters', 'Track weekly utilization', 'Submit for approval'],
  },
  {
    role: 'Client',
    name: 'Sarah Mitchell',
    title: 'Representing Reyes Family Trust',
    blurb: 'See case status, pay invoices, message the firm. Sarah is the customer.',
    initials: 'SM',
    bg: '#FFE4E6',
    fg: '#9F1239',
    href: '/portal/login',
    cta: 'Sign in as Sarah →',
    powers: ['Pay invoices', 'View case status + updates', 'Message the firm', 'Download documents'],
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <Logo height={32} />
          <div className="text-xs text-fg-muted">Demo · pick a persona below</div>
        </div>

        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent-dark text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Clockd preview
          </div>
          <h1 className="text-4xl font-semibold tracking-[-0.5px] text-fg mb-3">
            Three views of one law firm.
          </h1>
          <p className="text-fg-muted leading-relaxed">
            Bennett &amp; Hayes LLP is a small SF firm. Marcus runs it. Sophia works there. Sarah is one of their clients.
            Pick a persona to see Clockd from their seat. All three are live — log in as one, open another in a new tab to see the same data from the other side.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PERSONAS.map((p) => (
            <Link
              key={p.role}
              href={p.href}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-accent hover:shadow-[0_20px_40px_-20px_rgba(15,20,25,0.18)] transition flex flex-col">
              <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted mb-4">{p.role}</div>

              <div className="flex items-center gap-3 mb-4">
                <span style={{ background: p.bg, color: p.fg }} className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {p.initials}
                </span>
                <div className="min-w-0">
                  <div className="text-base font-semibold text-fg truncate">{p.name}</div>
                  <div className="text-xs text-fg-muted truncate">{p.title}</div>
                </div>
              </div>

              <p className="text-sm text-fg-muted leading-relaxed mb-5">{p.blurb}</p>

              <div className="space-y-2 mb-6 flex-1">
                {p.powers.map((power) => (
                  <div key={power} className="flex items-start gap-2 text-xs text-fg">
                    <span className="text-accent mt-0.5 shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {power}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm font-semibold text-accent">{p.cta}</span>
                <span className="text-accent group-hover:translate-x-1 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-card border border-border rounded-2xl p-6">
          <div className="text-sm font-semibold text-fg mb-3">How the three views connect</div>
          <div className="text-sm text-fg-muted leading-relaxed space-y-2">
            <p>
              <span className="font-semibold text-fg">Sophia</span> logs a call entry → it shows up on
              <span className="font-semibold text-fg"> Marcus&apos;s</span> approval queue. Marcus approves and issues an invoice →
              it appears on <span className="font-semibold text-fg">Sarah&apos;s</span> portal home with a Pay button. Sarah pays →
              Marcus gets a notification.
            </p>
            <p>
              Same data, three perspectives. State is in-memory for this preview — refresh resets, but actions inside a session
              persist across tabs.
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between text-xs text-fg-subtle">
          <span>© 2026 Clockd</span>
          <span>Preview build · not production data</span>
        </div>
      </div>
    </div>
  );
}
