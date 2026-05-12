'use client';

import Link from 'next/link';

import { AdminShell } from '@/components/AdminShell';
import { clientById, formatHours, formatMoney, matters, seedEntries } from '@/lib/mock';

const CLIENT_TINTS: Record<string, { bg: string; fg: string }> = {
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  N: { bg: '#DBEAFE', fg: '#1D4ED8' },
  V: { bg: '#DCFCE7', fg: '#166534' },
};

const STAGE_TINTS: Record<string, { bg: string; fg: string; border: string }> = {
  Intake: { bg: '#DBEAFE', fg: '#1D4ED8', border: '#93C5FD' },
  'In Progress': { bg: '#DCFCE7', fg: '#166534', border: '#86EFAC' },
  Discovery: { bg: '#FED7AA', fg: '#9A3412', border: '#FDBA74' },
  Judgement: { bg: '#E9D5FF', fg: '#6D28D9', border: '#C4B5FD' },
  Closed: { bg: '#F3F4F6', fg: '#4B5563', border: '#D1D5DB' },
};

const TEAM_AVATARS = [
  { bg: '#FEE2E2', fg: '#B91C1C', initials: 'JB' },
  { bg: '#DBEAFE', fg: '#1D4ED8', initials: 'SC' },
  { bg: '#FEF3C7', fg: '#92400E', initials: 'MH' },
];

// Synthesize richer rows by mixing the seed matters with stage and financials
const ROWS = matters.map((m, idx) => {
  const stages = [
    ['In Progress'],
    ['Discovery', 'In Progress'],
    ['Intake'],
    ['In Progress'],
    ['Discovery'],
    ['Closed'],
  ][idx % 6];
  const status = stages.includes('Closed') ? 'Closed' : 'In Progress';
  const hours = seedEntries.filter((e) => e.matterId === m.id).reduce((a, e) => a + e.durationSec, 0) || (idx + 2) * 7200;
  const billed = (m.rate * hours) / 3600;
  const paid = billed * (0.45 + (idx * 0.13) % 0.5);
  const outstanding = billed - paid;
  return { matter: m, stages, status, hours, billed, paid, outstanding };
});

export default function Matters() {
  return (
    <AdminShell
      title="Matters"
      subtitle="All active client matters at your firm."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg">
          + New Matter
        </button>
      }>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <button className="w-10 h-10 rounded-lg border border-border bg-card hover:bg-bg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle"
          />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          Status
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          Columns
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1.5fr_80px_110px_110px_110px_100px_120px_120px] gap-4 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>Matter Name</div>
          <div>Client</div>
          <div className="text-right">Hours</div>
          <div className="text-right">Billed</div>
          <div className="text-right">Paid</div>
          <div className="text-right">Outstanding</div>
          <div>Team</div>
          <div>Stage</div>
          <div>Status</div>
        </div>
        {ROWS.map((row, i) => {
          const client = clientById(row.matter.clientId);
          const clientInitial = client?.name[0] ?? 'C';
          const tint = CLIENT_TINTS[clientInitial] ?? { bg: '#F3F4F6', fg: '#4B5563' };
          return (
            <Link
              key={row.matter.id}
              href={`/admin/matters/${row.matter.id}`}
              className="grid grid-cols-[2fr_1.5fr_80px_110px_110px_110px_100px_120px_120px] gap-4 items-center px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/50">
              <div className="text-sm font-semibold truncate">{row.matter.name}</div>
              <div className="flex items-center gap-2 min-w-0">
                <span style={{ background: tint.bg, color: tint.fg }} className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {clientInitial}
                </span>
                <span className="text-sm truncate">{client?.name}</span>
              </div>
              <div className="text-sm font-medium tabular-nums text-right">{formatHours(row.hours)}</div>
              <div className="text-sm font-medium tabular-nums text-right">{formatMoney(row.billed)}</div>
              <div className="text-sm font-medium tabular-nums text-right text-accent">{formatMoney(row.paid)}</div>
              <div className="text-sm font-medium tabular-nums text-right text-warning">{formatMoney(row.outstanding)}</div>
              <div className="flex -space-x-1.5">
                {TEAM_AVATARS.slice(0, 3).map((a, idx) => (
                  <span
                    key={idx}
                    style={{ background: a.bg, color: a.fg }}
                    className="w-6 h-6 rounded-full ring-2 ring-card flex items-center justify-center text-[9px] font-bold">
                    {a.initials}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex flex-wrap gap-1">
                  {row.stages.map((s) => (
                    <StagePill key={s} stage={s} />
                  ))}
                </div>
              </div>
              <div>
                <StatusPill status={row.status} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-fg-muted">
        <div>Show <select className="border border-border rounded px-2 py-1 bg-card mx-1"><option>10</option><option>25</option></select> per page</div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg border border-border hover:bg-card disabled:opacity-50">‹</button>
          <button className="w-8 h-8 rounded-lg bg-accent text-white text-sm">1</button>
          <button className="w-8 h-8 rounded-lg border border-border hover:bg-card">2</button>
          <button className="w-8 h-8 rounded-lg border border-border hover:bg-card">3</button>
          <button className="w-8 h-8 rounded-lg border border-border hover:bg-card">›</button>
        </div>
      </div>
    </AdminShell>
  );
}

function StagePill({ stage }: { stage: string }) {
  const tint = STAGE_TINTS[stage] ?? { bg: '#F3F4F6', fg: '#4B5563', border: '#D1D5DB' };
  return (
    <span
      style={{ background: tint.bg, color: tint.fg, borderColor: tint.border }}
      className="px-2 py-0.5 text-[10px] rounded-md font-semibold border">
      {stage}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const isClosed = status === 'Closed';
  return (
    <span
      className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
        isClosed ? 'bg-gray-100 text-gray-700' : 'bg-accent-soft text-accent-dark'
      }`}>
      {status}
    </span>
  );
}
