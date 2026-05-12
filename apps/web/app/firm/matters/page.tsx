'use client';

import Link from 'next/link';
import { useState } from 'react';

import { FirmShell } from '@/components/FirmShell';

type Matter = {
  id: string;
  name: string;
  practice: string;
  opened: string;
  hours: string;
  entries: number;
  billed: string;
  status: 'active' | 'unassigned';
  team: number;
};

const ASSIGNED: Matter[] = [
  { id: 'fm1', name: 'Litigation — Contract Dispute', practice: 'Litigation', opened: '2025-11-05', hours: '13.4h', entries: 14, billed: '$4,051', status: 'active', team: 2 },
  { id: 'fm2', name: 'Corporate — Annual Filing', practice: 'Corporate', opened: '2025-11-05', hours: '0.0h', entries: 0, billed: '$0', status: 'active', team: 3 },
];

const UNASSIGNED: Matter[] = [
  { id: 'fm3', name: 'Litigation — Contract Dispute', practice: 'Litigation', opened: '2025-11-05', hours: '13.4h', entries: 14, billed: '$4,051', status: 'unassigned', team: 2 },
];

const TEAM_COLORS = [
  { bg: '#FEE2E2', fg: '#B91C1C' },
  { bg: '#DBEAFE', fg: '#1D4ED8' },
  { bg: '#FEF3C7', fg: '#92400E' },
];

export default function FirmMatters() {
  return (
    <FirmShell title="Time Entries" subtitle="Insert page description here.">
      {/* Search + Filter */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-white flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Filter
        </button>
      </div>

      <Section title="Assigned to" matters={ASSIGNED} />
      <div className="h-6" />
      <Section title="Unassigned" matters={UNASSIGNED} />
    </FirmShell>
  );
}

function Section({ title, matters }: { title: string; matters: Matter[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 mb-3 text-sm font-medium text-fg">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`text-fg-muted transition-transform ${open ? '' : '-rotate-90'}`}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {title}
      </button>
      {open && (
        <div className="space-y-3">
          {matters.map((m) => (
            <Link key={m.id} href={`/firm/matters/${m.id}`} className="block bg-card border border-border rounded-2xl px-5 py-4 hover:border-accent transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-bg flex items-center justify-center text-fg-muted shrink-0">
                  <IconBriefcase />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-fg mb-1">{m.name}</div>
                  <div className="text-xs text-fg-muted mb-2">
                    {m.practice} · Opened {m.opened}
                  </div>
                  <div className="flex items-center gap-5 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-fg-muted">
                      <IconClockSm />
                      Hours: <span className="font-semibold text-fg">{m.hours}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-fg-muted">
                      <IconDocSm />
                      Entries: <span className="font-semibold text-fg">{m.entries}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-fg-muted">
                      <IconDollarSm />
                      Billed: <span className="font-semibold text-fg">{m.billed}</span>
                    </span>
                  </div>
                </div>
                <div className="flex -space-x-2 mr-2">
                  {Array.from({ length: m.team }).map((_, i) => (
                    <span
                      key={i}
                      style={{ background: TEAM_COLORS[i % 3].bg, color: TEAM_COLORS[i % 3].fg }}
                      className="w-8 h-8 rounded-full ring-2 ring-card flex items-center justify-center text-[10px] font-bold">
                      {['SC', 'JC', 'MR'][i % 3]}
                    </span>
                  ))}
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide uppercase ${
                    m.status === 'active'
                      ? 'bg-accent-soft text-accent-dark'
                      : 'bg-danger-soft text-danger'
                  }`}>
                  {m.status === 'active' ? 'Active' : 'Unassigned'}
                </span>
                <button onClick={(e) => e.preventDefault()} className="text-fg-muted hover:text-fg ml-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function IconBriefcase() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconClockSm() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconDocSm() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconDollarSm() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
