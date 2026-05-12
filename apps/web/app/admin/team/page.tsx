'use client';

import { AdminShell } from '@/components/AdminShell';
import { formatHoursH, formatMoneyCompact, lawyers, matters, seedEntries } from '@/lib/mock';

const TINTS: Record<string, { bg: string; fg: string }> = {
  J: { bg: '#FEE2E2', fg: '#B91C1C' },
  S: { bg: '#DBEAFE', fg: '#1D4ED8' },
  M: { bg: '#FED7AA', fg: '#9A3412' },
  D: { bg: '#E0E7FF', fg: '#4338CA' },
};

// Add an invited member for status variety
const EXTENDED_TEAM = [
  ...lawyers,
  { id: 'lwy_david', firmId: 'firm_bh', name: 'David Okafor', initials: 'DO', role: 'Associate' },
];

const PERMISSIONS: Record<string, 'Admin' | 'Staff'> = {
  lwy_marc: 'Admin',
  lwy_jord: 'Admin',
  lwy_sara: 'Staff',
  lwy_soph: 'Staff',
  lwy_david: 'Staff',
};

const STATUS_OVERRIDES: Record<string, 'Active' | 'Invited' | 'Inactive'> = {
  lwy_david: 'Invited',
};

const RATES: Record<string, number> = {
  lwy_jord: 650,
  lwy_sara: 275,
  lwy_marc: 800,
  lwy_soph: 350,
  lwy_david: 200,
};

const ASSIGNED_MATTER_COUNT: Record<string, number> = {
  lwy_jord: 5,
  lwy_sara: 4,
  lwy_marc: 2,
  lwy_soph: 3,
  lwy_david: 1,
};

export default function Team() {
  return (
    <AdminShell
      title="Team"
      subtitle="Lawyers and staff at your firm."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> Invite Member
        </button>
      }>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search team..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_120px_100px_90px_110px_120px_120px] gap-3 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>Name</div>
          <div>Permissions</div>
          <div className="text-right">Matters</div>
          <div className="text-right">Rate</div>
          <div className="text-right">Hours MTD</div>
          <div className="text-right">Billed MTD</div>
          <div className="text-center">Status</div>
        </div>
        {EXTENDED_TEAM.map((l) => {
          const tint = TINTS[l.initials[0]] ?? { bg: '#F3F4F6', fg: '#4B5563' };
          const mattersCount = ASSIGNED_MATTER_COUNT[l.id] ?? 0;
          const totalSec = seedEntries.filter((e) => e.lawyerId === l.id).reduce((a, e) => a + e.durationSec, 0);
          const billedDollars = seedEntries
            .filter((e) => e.lawyerId === l.id && !e.nonBillable)
            .reduce((a, e) => {
              const m = matters.find((mm) => mm.id === e.matterId);
              return a + (m ? (m.rate * e.durationSec) / 3600 : 0);
            }, 0);
          const status = STATUS_OVERRIDES[l.id] ?? 'Active';
          const perms = PERMISSIONS[l.id] ?? 'Staff';
          return (
            <div key={l.id} className="grid grid-cols-[2fr_120px_100px_90px_110px_120px_120px] gap-3 items-center px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/50">
              <div className="flex items-center gap-3 min-w-0">
                <span style={{ background: tint.bg, color: tint.fg }} className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {l.initials}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{l.name}</div>
                  <div className="text-xs text-fg-muted truncate">{l.role}</div>
                </div>
              </div>
              <div>
                <PermissionPill perms={perms} />
              </div>
              <div className="text-sm tabular-nums text-right">{mattersCount}</div>
              <div className="text-sm font-semibold tabular-nums text-right">${RATES[l.id] ?? 350}/hr</div>
              <div className="text-sm tabular-nums text-right">{totalSec > 0 ? formatHoursH(totalSec) : <span className="text-fg-subtle">—</span>}</div>
              <div className="text-sm tabular-nums text-right">{billedDollars > 0 ? formatMoneyCompact(billedDollars) : <span className="text-fg-subtle">—</span>}</div>
              <div className="flex justify-center">
                <TeamStatus status={status} />
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}

function PermissionPill({ perms }: { perms: 'Admin' | 'Staff' }) {
  return (
    <span className={`px-2.5 py-1 text-xs rounded-md font-semibold border ${
      perms === 'Admin' ? 'border-accent text-accent-dark bg-accent-soft/40' : 'border-border text-fg-muted bg-bg'
    }`}>
      {perms}
    </span>
  );
}

function TeamStatus({ status }: { status: 'Active' | 'Invited' | 'Inactive' }) {
  const map = {
    Active: 'bg-accent-soft text-accent-dark',
    Invited: 'bg-warning-soft text-warning',
    Inactive: 'bg-bg text-fg-muted',
  } as const;
  return <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${map[status]}`}>{status}</span>;
}
