'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { AddEntrySlideOut } from '@/components/AddEntrySlideOut';
import { FirmShell } from '@/components/FirmShell';
import {
  clientById,
  currentFirmUser,
  entryValue,
  formatHoursH,
  formatMoneyCompact,
  MATTER_STAGE,
  matters as allMatters,
  seedEntries,
} from '@/lib/mock';
import { useEntryOverrides } from '@/lib/adminState';
import { toggleMatterPin, usePinnedMatterIds } from '@/lib/firmState';

const STAGE_TINTS: Record<string, { bg: string; fg: string; border: string }> = {
  Intake: { bg: '#DBEAFE', fg: '#1D4ED8', border: '#93C5FD' },
  Active: { bg: '#DCFCE7', fg: '#166534', border: '#86EFAC' },
  'On Hold': { bg: '#FED7AA', fg: '#9A3412', border: '#FDBA74' },
  Closed: { bg: '#F3F4F6', fg: '#4B5563', border: '#D1D5DB' },
};

const CLIENT_TINTS: Record<string, { bg: string; fg: string }> = {
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  N: { bg: '#DBEAFE', fg: '#1D4ED8' },
  V: { bg: '#DCFCE7', fg: '#166534' },
};


export default function FirmMatters() {
  const overrides = useEntryOverrides();
  const pinned = usePinnedMatterIds();
  const [q, setQ] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [addDefault, setAddDefault] = useState<string | undefined>(undefined);

  // Sophia's assigned matters — derived from where she's logged time (plus pinned).
  // Treat that as "matters I'm on".
  const sophiaEntries = useMemo(() => seedEntries
    .filter((e) => e.lawyerId === currentFirmUser.id)
    .map((e) => ({
      ...e,
      status: (overrides[e.id]?.status as typeof e.status) ?? e.status,
    })), [overrides]);

  const myMatterIds = new Set([
    ...Array.from(new Set(sophiaEntries.map((e) => e.matterId))),
    ...Array.from(pinned),
  ]);

  const myMatters = allMatters.filter((m) => myMatterIds.has(m.id));

  // Compute per-matter stats for Sophia
  const rows = myMatters.map((m) => {
    const myEntries = sophiaEntries.filter((e) => e.matterId === m.id);
    const myHours = myEntries.reduce((a, e) => a + e.durationSec, 0);
    const myBilled = myEntries.reduce((a, e) => a + entryValue(e), 0);
    const pendingCount = myEntries.filter((e) => e.status === 'pending').length;
    const rejectedCount = myEntries.filter((e) => (e.status as string) === 'rejected').length;
    const stage = MATTER_STAGE[m.id] ?? 'In Progress';
    return { matter: m, myHours, myBilled, pendingCount, rejectedCount, stage, isPinned: pinned.has(m.id) };
  });

  const filtered = q
    ? rows.filter((r) => r.matter.name.toLowerCase().includes(q.toLowerCase()) || r.matter.shortName.toLowerCase().includes(q.toLowerCase()))
    : rows;

  // Pinned first
  const sortedRows = [...filtered].sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

  function openAddFor(matterId: string) {
    setAddDefault(matterId);
    setAddOpen(true);
  }

  return (
    <FirmShell
      title="Your matters"
      subtitle={`${rows.length} ${rows.length === 1 ? 'matter' : 'matters'} on your caseload.`}
      action={
        <button
          onClick={() => setAddOpen(true)}
          className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> Add Entry
        </button>
      }>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your matters..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sortedRows.length === 0 ? (
          <div className="col-span-2 bg-card border border-border rounded-2xl p-12 text-center">
            <div className="text-sm font-semibold text-fg">No matters yet</div>
            <div className="text-xs text-fg-muted mt-1">Marcus needs to add you to a matter. Ping him.</div>
          </div>
        ) : sortedRows.map((row) => {
          const m = row.matter;
          const c = clientById(m.clientId);
          const ci = c?.name[0] ?? 'C';
          const tint = CLIENT_TINTS[ci] ?? { bg: '#F3F4F6', fg: '#4B5563' };
          return (
            <div key={m.id} className={`bg-card border ${row.isPinned ? 'border-warning/40' : 'border-border'} rounded-2xl p-5 hover:border-accent transition`}>
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => toggleMatterPin(m.id)}
                      className={`shrink-0 ${row.isPinned ? 'text-warning' : 'text-fg-subtle hover:text-warning'}`}
                      title={row.isPinned ? 'Unpin' : 'Pin to top'}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={row.isPinned ? 'currentColor' : 'none'}>
                        <path d="M12 17v5M5 9.5l7 1.5 7-1.5L17 7l-2-4-3 1-3-1-2 4-2 2.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <Link href={`/firm/matters/${m.id}`} className="text-base font-semibold hover:text-accent truncate">{m.name}</Link>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-fg-muted">
                    <span style={{ background: tint.bg, color: tint.fg }} className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px]">{ci}</span>
                    {c?.name}
                  </div>
                </div>
                <StagePill stage={row.stage} />
              </div>

              {/* Alert row for rejections */}
              {row.rejectedCount > 0 && (
                <div className="mb-3 px-3 py-2 bg-danger-soft border border-danger/30 rounded-lg flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-danger">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <div className="text-xs text-danger font-medium">{row.rejectedCount} entry sent back · review and resubmit</div>
                </div>
              )}

              <div className="flex items-center gap-5 text-xs mb-4">
                <div>
                  <div className="text-fg-muted">Your hours</div>
                  <div className="text-base font-semibold tabular-nums mt-0.5">{formatHoursH(row.myHours)}</div>
                </div>
                <div>
                  <div className="text-fg-muted">Billed</div>
                  <div className="text-base font-semibold tabular-nums mt-0.5">{formatMoneyCompact(row.myBilled)}</div>
                </div>
                <div>
                  <div className="text-fg-muted">Rate</div>
                  <div className="text-base font-semibold tabular-nums mt-0.5">${m.rate}/hr</div>
                </div>
                {row.pendingCount > 0 && (
                  <div className="ml-auto" title="Your entries awaiting partner approval">
                    <div className="text-fg-muted">Pending approval</div>
                    <div className="text-base font-semibold tabular-nums mt-0.5 text-warning">{row.pendingCount}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Link
                  href={`/firm/matters/${m.id}`}
                  className="flex-1 h-9 px-3 rounded-lg border border-border text-center text-sm font-medium hover:bg-bg flex items-center justify-center">
                  Open matter
                </Link>
                {row.stage === 'Closed' ? (
                  <button
                    disabled
                    title="This matter is closed — log time isn't available."
                    className="h-9 px-4 rounded-lg border border-border text-fg-subtle text-sm font-semibold inline-flex items-center gap-1.5 cursor-not-allowed">
                    Closed
                  </button>
                ) : (
                  <button
                    onClick={() => openAddFor(m.id)}
                    className="h-9 px-4 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold inline-flex items-center gap-1.5">
                    <span className="text-base leading-none">+</span> Log time
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddEntrySlideOut open={addOpen} onClose={() => setAddOpen(false)} defaultMatterId={addDefault} />
    </FirmShell>
  );
}

function StagePill({ stage }: { stage: string }) {
  const tint = STAGE_TINTS[stage] ?? { bg: '#F3F4F6', fg: '#4B5563', border: '#D1D5DB' };
  return (
    <span style={{ background: tint.bg, color: tint.fg, borderColor: tint.border }} className="px-2.5 py-1 text-xs rounded-md font-semibold border shrink-0">
      {stage}
    </span>
  );
}
