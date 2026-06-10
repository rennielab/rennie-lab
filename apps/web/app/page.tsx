'use client';

import Link from 'next/link';

import { Avatar } from '@/components/Avatar';
import { Logo } from '@/components/Logo';

const PERSONAS = [
  {
    role: 'Firm Admin',
    side: 'firm' as const,
    name: 'Marcus Hayes',
    title: 'Managing Partner · Bennett & Hayes LLP',
    blurb: 'Approve time, issue invoices, chase overdue, manage the team. Marcus runs the firm.',
    initials: 'MH',
    avatar: '/avatars/marcus.jpg',
    bg: '#FED7AA',
    fg: '#9A3412',
    href: '/admin/login',
    cta: 'Sign in as Marcus →',
    powers: ['Approve / reject time entries', 'Issue invoices', 'Manage team & rates', 'See firm-wide finances'],
  },
  {
    role: 'Firm User',
    side: 'firm' as const,
    name: 'Sophia Williams',
    title: 'Lawyer · Bennett & Hayes LLP',
    blurb: 'Log time, work on matters, submit for partner approval. Sophia bills the hours.',
    initials: 'SW',
    avatar: '/avatars/sophia.jpg',
    bg: '#FEF3C7',
    fg: '#92400E',
    href: '/firm/login',
    cta: 'Sign in as Sophia →',
    powers: ['Log time entries (manual + call)', 'See her assigned matters', 'Track weekly utilization', 'Submit for approval'],
  },
  {
    role: 'Client',
    side: 'client' as const,
    name: 'Sarah Mitchell',
    title: 'Representing Reyes Family Trust',
    blurb: 'See case status, pay invoices, message the firm. Sarah is the customer.',
    initials: 'SM',
    avatar: '/avatars/sarah.jpg',
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

        {/* Group label above the cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 mb-2 text-[10px] font-bold uppercase tracking-wider">
          <div className="md:col-span-2 text-accent-dark">▸ Bennett &amp; Hayes LLP (the firm)</div>
          <div className="text-fg-muted">▸ Their client</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PERSONAS.map((p) => {
            const isFirm = p.side === 'firm';
            return (
              <Link
                key={p.role}
                href={p.href}
                className={`group rounded-2xl p-6 transition flex flex-col border hover:shadow-[0_20px_40px_-20px_rgba(15,20,25,0.18)] ${
                  isFirm
                    ? 'bg-accent-soft/40 border-accent/30 hover:border-accent'
                    : 'bg-card border-border hover:border-accent'
                }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted mb-4">{p.role}</div>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar
                    src={p.avatar}
                    name={p.name}
                    initials={p.initials}
                    size={56}
                    bg={p.bg}
                    fg={p.fg}
                    className="shrink-0 ring-2 ring-white"
                  />
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

                <div className={`flex items-center justify-between pt-4 border-t ${isFirm ? 'border-accent/30' : 'border-border'}`}>
                  <span className="text-sm font-semibold text-accent">{p.cta}</span>
                  <span className="text-accent group-hover:translate-x-1 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Flow diagram */}
        <div className="mt-10 bg-card border border-border rounded-2xl p-8">
          <div className="text-sm font-semibold text-fg mb-1">How the three views connect</div>
          <div className="text-xs text-fg-muted mb-8">One client engagement, three perspectives — same data, different controls.</div>

          <FlowDiagram />

          <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-fg-muted leading-relaxed">
            <div>
              <span className="inline-flex items-center gap-1.5 font-bold text-fg mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" /> THE FIRM
              </span>
              <p>Marcus owns the firm, Sophia works there. They share data — Marcus reviews Sophia&apos;s time and turns it into invoices the client pays.</p>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 font-bold text-fg mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9F1239]" /> THE CLIENT
              </span>
              <p>Sarah is the firm&apos;s client. She sees status updates, invoices, and chats with the firm via the shared Message Center — but never sees firm-internal data.</p>
            </div>
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

function FlowDiagram() {
  return (
    <div className="relative">
      {/* Three persona pills + flow steps between */}
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-center">
        {/* Sophia */}
        <PersonaPill
          name="Sophia"
          role="Lawyer"
          initials="SW"
          avatar="/avatars/sophia.jpg"
          bg="#FEF3C7"
          fg="#92400E"
          tint="accent"
        />

        {/* arrow + label 1 */}
        <FlowArrow steps={['Logs time', 'on Smith v. Acme', 'Submits for approval']} tint="accent" />

        {/* Marcus */}
        <PersonaPill
          name="Marcus"
          role="Managing Partner"
          initials="MH"
          avatar="/avatars/marcus.jpg"
          bg="#FED7AA"
          fg="#9A3412"
          tint="accent"
        />

        {/* arrow + label 2 */}
        <FlowArrow steps={['Approves entry', 'Issues invoice', 'Sends to client']} tint="accent" />

        {/* Sarah */}
        <PersonaPill
          name="Sarah"
          role="Client"
          initials="SM"
          avatar="/avatars/sarah.jpg"
          bg="#FFE4E6"
          fg="#9F1239"
          tint="client"
        />
      </div>

      {/* Bottom: payment loop back */}
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <div className="text-right">
          <div className="text-xs text-fg-muted">When Sarah pays</div>
        </div>
        <svg width="240" height="40" viewBox="0 0 240 40" className="text-fg-muted">
          <path
            d="M 230 20 Q 120 0 10 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
          <path d="M 14 16 L 10 20 L 14 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="text-left">
          <div className="text-xs text-fg-muted">Marcus gets notified · cash collected updates</div>
        </div>
      </div>

      {/* Campfire chat note */}
      <div className="mt-6 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg border border-border text-xs text-fg-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>All three share a <span className="font-semibold text-fg">Message Center</span> — accessible from every screen.</span>
        </div>
      </div>
    </div>
  );
}

function PersonaPill({ name, role, initials, bg, fg, tint, avatar }: { name: string; role: string; initials: string; bg: string; fg: string; tint: 'accent' | 'client'; avatar?: string }) {
  const wrapClass = tint === 'accent' ? 'bg-accent-soft/60 border-accent/40' : 'bg-card border-border';
  return (
    <div className={`rounded-2xl border px-4 py-4 text-center ${wrapClass}`}>
      <span className="block w-12 h-12 mx-auto mb-2">
        <Avatar src={avatar} name={name} initials={initials} size={48} bg={bg} fg={fg} className="ring-2 ring-white" />
      </span>
      <div className="text-sm font-semibold text-fg">{name}</div>
      <div className="text-[11px] text-fg-muted">{role}</div>
    </div>
  );
}

function FlowArrow({ steps, tint }: { steps: string[]; tint: 'accent' | 'muted' }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[160px]">
      <div className="space-y-0.5 text-center">
        {steps.map((s, i) => (
          <div key={i} className="text-[11px] text-fg-muted leading-tight">{s}</div>
        ))}
      </div>
      <svg width="120" height="20" viewBox="0 0 120 20" className={tint === 'accent' ? 'text-accent' : 'text-fg-subtle'}>
        <path d="M 0 10 L 110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M 105 5 L 115 10 L 105 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
