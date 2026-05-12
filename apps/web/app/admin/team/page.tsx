'use client';

import { AdminShell } from '@/components/AdminShell';
import { formatHours, lawyers, seedEntries } from '@/lib/mock';

const TINTS: Record<string, { bg: string; fg: string }> = {
  J: { bg: '#FEE2E2', fg: '#B91C1C' },
  S: { bg: '#DBEAFE', fg: '#1D4ED8' },
  M: { bg: '#FED7AA', fg: '#9A3412' },
};

// Add 4th member as Invited, 5th as Inactive for status variety
const EXTENDED_TEAM = [
  ...lawyers,
  { id: 'lwy_david', firmId: 'firm_bh', name: 'David Okafor', initials: 'DO', role: 'Associate' },
];

const STATUS_OVERRIDES: Record<string, 'Active' | 'Invited' | 'Inactive'> = {
  lwy_david: 'Invited',
};

const RATES: Record<string, number> = {
  lwy_jord: 650,
  lwy_sara: 275,
  lwy_marc: 800,
  lwy_david: 200,
};

export default function Team() {
  return (
    <AdminShell
      title="Team"
      subtitle="Lawyers and staff at your firm."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg">
          + Add New Member
        </button>
      }>
      <div className="flex items-center gap-3 mb-4">
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
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[100px_2fr_80px_100px_120px_180px_120px_40px] gap-4 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>ID #</div>
          <div>Name</div>
          <div className="text-right">Matters</div>
          <div className="text-right">Rate</div>
          <div className="text-right">Total Hours</div>
          <div>Last Activity</div>
          <div className="text-center">Status</div>
          <div></div>
        </div>
        {EXTENDED_TEAM.map((l, idx) => {
          const tint = TINTS[l.initials[0]] ?? { bg: '#F3F4F6', fg: '#4B5563' };
          const matters = [5, 4, 2, 1][idx];
          const totalHours = seedEntries.filter((e) => e.lawyerId === l.id).reduce((a, e) => a + e.durationSec, 0) || (idx + 2) * 7200;
          const status = STATUS_OVERRIDES[l.id] ?? 'Active';
          return (
            <div key={l.id} className="grid grid-cols-[100px_2fr_80px_100px_120px_180px_120px_40px] gap-4 items-center px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/50">
              <div className="text-accent font-semibold text-sm">TM-{String(idx + 1).padStart(3, '0')}</div>
              <div className="flex items-center gap-3 min-w-0">
                <span style={{ background: tint.bg, color: tint.fg }} className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {l.initials}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{l.name}</div>
                  <div className="text-xs text-fg-muted truncate">{l.role}</div>
                </div>
              </div>
              <div className="text-sm tabular-nums text-right">{matters}</div>
              <div className="text-sm font-semibold tabular-nums text-right">${RATES[l.id] ?? 350}/hr</div>
              <div className="text-sm tabular-nums text-right">{formatHours(totalHours)}</div>
              <div className="text-sm text-fg-muted">12 Mar 2026 10:30 AM</div>
              <div className="flex justify-center">
                <TeamStatus status={status} />
              </div>
              <button className="text-fg-muted hover:text-fg flex justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}

function TeamStatus({ status }: { status: 'Active' | 'Invited' | 'Inactive' }) {
  const map = {
    Active: 'bg-accent-soft text-accent-dark',
    Invited: 'bg-warning-soft text-warning',
    Inactive: 'bg-danger-soft text-danger',
  } as const;
  return <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${map[status]}`}>{status}</span>;
}
