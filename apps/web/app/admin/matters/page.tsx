'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import {
  clientById,
  entryValue,
  formatHoursH,
  formatMoneyCompact,
  matters,
  seedEntries,
} from '@/lib/mock';
import { useBilledEntryIds, useEntryOverrides } from '@/lib/adminState';

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
  { bg: '#FEE2E2', fg: '#B91C1C', initials: 'JB', name: 'Jordan Bennett' },
  { bg: '#DBEAFE', fg: '#1D4ED8', initials: 'SC', name: 'Sarah Chen' },
  { bg: '#FEF3C7', fg: '#92400E', initials: 'MH', name: 'Marcus Hayes' },
];

// Stage is the lifecycle phase (per-matter). Closed is a stage, not a status.
// "Status" column dropped — Stage carries all the information.
function rowsFor(overrides: Record<string, { status?: string; nonBillable?: boolean }>, billed: Set<string>) {
  return matters.map((m, idx) => {
    const stage = (['In Progress', 'Discovery', 'Intake', 'In Progress', 'Discovery', 'Closed'] as const)[idx % 6];
    const matterEntries = seedEntries
      .filter((e) => e.matterId === m.id)
      .map((e) => ({
        ...e,
        status: (overrides[e.id]?.status as typeof e.status) ?? e.status,
        nonBillable: overrides[e.id]?.nonBillable ?? e.nonBillable,
      }));
    const hoursSec = matterEntries.reduce((a, e) => a + e.durationSec, 0) || (idx + 2) * 3600 * 2;
    const billedAmount = (m.rate * hoursSec) / 3600;
    const paid = billedAmount * (0.45 + (idx * 0.13) % 0.5);
    const outstanding = billedAmount - paid;

    // Unbilled = approved + not nonbillable + not yet in a draft/invoice
    const unbilled = matterEntries
      .filter((e) => e.status === 'approved' && !e.nonBillable && !billed.has(e.id))
      .reduce((a, e) => a + entryValue(e), 0);

    const latest = matterEntries.map((e) => e.createdAt).sort((a, b) => b - a)[0] ?? 0;
    const daysSinceActivity = latest ? Math.floor((Date.now() - latest) / (24 * 60 * 60 * 1000)) : 999;
    const stalled = daysSinceActivity > 14 && stage !== 'Closed';

    return { matter: m, stage, hoursSec, billed: billedAmount, paid, outstanding, unbilled, stalled, daysSinceActivity };
  });
}

type Filter = 'active' | 'stalled' | 'closed' | 'all';

export default function Matters() {
  const overrides = useEntryOverrides();
  const billed = useBilledEntryIds();
  const [filter, setFilter] = useState<Filter>('active');

  // Sync ?filter=stalled
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const f = sp.get('filter');
    if (f === 'stalled' || f === 'closed' || f === 'all') setFilter(f);
  }, []);

  const all = rowsFor(overrides, billed);
  const filtered =
    filter === 'all' ? all :
    filter === 'stalled' ? all.filter((r) => r.stalled) :
    filter === 'closed' ? all.filter((r) => r.stage === 'Closed') :
    all.filter((r) => r.stage !== 'Closed');

  const counts = {
    active: all.filter((r) => r.stage !== 'Closed').length,
    stalled: all.filter((r) => r.stalled).length,
    closed: all.filter((r) => r.stage === 'Closed').length,
    all: all.length,
  };

  return (
    <AdminShell
      title="Matters"
      subtitle="Track every active matter, see what's billable, spot what's stalled."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> New Matter
        </button>
      }>
      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-4">
        {(['active', 'stalled', 'closed', 'all'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px ${
              filter === k ? 'border-accent text-accent' : 'border-transparent text-fg-muted hover:text-fg'
            }`}>
            {k === 'all' ? 'All' : k[0].toUpperCase() + k.slice(1)}
            <span className={`px-1.5 py-0.5 text-xs rounded-full ${filter === k ? 'bg-accent text-white' : 'bg-bg text-fg-muted'}`}>
              {counts[k]}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search matters..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg">Filter</button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1.4fr_80px_110px_120px_120px_100px_130px] gap-4 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>Matter</div>
          <div>Client</div>
          <div className="text-right">Hours</div>
          <div className="text-right">Billed</div>
          <div className="text-right">Unbilled</div>
          <div className="text-right">Outstanding</div>
          <div>Team</div>
          <div>Stage</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-fg-muted">No matters in this view.</div>
        ) : filtered.map((row) => {
          const client = clientById(row.matter.clientId);
          const clientInitial = client?.name[0] ?? 'C';
          const tint = CLIENT_TINTS[clientInitial] ?? { bg: '#F3F4F6', fg: '#4B5563' };
          const dim = row.stage === 'Closed';
          return (
            <Link
              key={row.matter.id}
              href={`/admin/matters/${row.matter.id}`}
              className={`grid grid-cols-[2fr_1.4fr_80px_110px_120px_120px_100px_130px] gap-4 items-center px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/50 ${dim ? 'opacity-70' : ''}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate">{row.matter.name}</span>
                  {row.stalled && (
                    <span title={`No activity in ${row.daysSinceActivity} days`} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-warning-soft text-warning shrink-0">
                      STALLED
                    </span>
                  )}
                </div>
                <div className="text-xs text-fg-muted mt-0.5">Last activity {row.daysSinceActivity}d ago · ${row.matter.rate}/hr</div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span style={{ background: tint.bg, color: tint.fg }} className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {clientInitial}
                </span>
                <span className="text-sm truncate">{client?.name}</span>
              </div>
              <div className="text-sm font-medium tabular-nums text-right">{formatHoursH(row.hoursSec)}</div>
              <div className="text-sm font-medium tabular-nums text-right">{formatMoneyCompact(row.billed)}</div>
              <div className="text-sm tabular-nums text-right">
                {row.unbilled > 0 ? (
                  <span className="font-semibold text-accent-dark">{formatMoneyCompact(row.unbilled)}</span>
                ) : (
                  <span className="text-fg-subtle">—</span>
                )}
              </div>
              <div className={`text-sm font-medium tabular-nums text-right ${row.outstanding > 0 ? 'text-warning' : 'text-fg-muted'}`}>
                {formatMoneyCompact(row.outstanding)}
              </div>
              <div className="flex -space-x-1.5">
                {TEAM_AVATARS.map((a) => (
                  <span
                    key={a.initials}
                    title={a.name}
                    style={{ background: a.bg, color: a.fg }}
                    className="w-6 h-6 rounded-full ring-2 ring-card flex items-center justify-center text-[9px] font-bold">
                    {a.initials}
                  </span>
                ))}
              </div>
              <div>
                <StagePill stage={row.stage} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination — only show when needed */}
      {filtered.length > 10 && (
        <div className="flex items-center justify-between mt-4 text-sm text-fg-muted">
          <div>Showing 1–{Math.min(10, filtered.length)} of {filtered.length}</div>
          <div className="flex items-center gap-1">
            <button disabled className="w-8 h-8 rounded-lg border border-border hover:bg-card disabled:opacity-40">‹</button>
            <button className="w-8 h-8 rounded-lg bg-accent text-white text-sm">1</button>
            <button className="w-8 h-8 rounded-lg border border-border hover:bg-card">›</button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function StagePill({ stage }: { stage: string }) {
  const tint = STAGE_TINTS[stage] ?? { bg: '#F3F4F6', fg: '#4B5563', border: '#D1D5DB' };
  return (
    <span
      style={{ background: tint.bg, color: tint.fg, borderColor: tint.border }}
      className="px-2.5 py-1 text-xs rounded-md font-semibold border">
      {stage}
    </span>
  );
}
