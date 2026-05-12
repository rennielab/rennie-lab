'use client';

import { AdminShell } from '@/components/AdminShell';
import { clients, contacts, formatHoursH, formatMoneyCompact, matters, seedEntries } from '@/lib/mock';

const CLIENT_TINTS: Record<string, { bg: string; fg: string }> = {
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  N: { bg: '#DBEAFE', fg: '#1D4ED8' },
  V: { bg: '#DCFCE7', fg: '#166534' },
};

// Per-client metadata. Reyes Family Trust portal MUST be enabled — Sarah Mitchell
// is using it as the client portal demo persona.
const CLIENT_META: Record<string, {
  retainedDate: string;
  lastActivity: string;
  portalEnabled: boolean;
  status: 'Active' | 'Archived';
  outstanding: number;
}> = {
  cli_acme: { retainedDate: '12 Feb 2025', lastActivity: '04 Mar 2026, 2:35 PM', portalEnabled: true, status: 'Active', outstanding: 1900 },
  cli_reyes: { retainedDate: '18 Jul 2025', lastActivity: '09 Mar 2026, 10:12 AM', portalEnabled: true, status: 'Active', outstanding: 0 },
  cli_north: { retainedDate: '05 Jan 2026', lastActivity: '08 Mar 2026, 4:48 PM', portalEnabled: false, status: 'Archived', outstanding: 0 },
  cli_vert: { retainedDate: '22 Sep 2024', lastActivity: '15 Jan 2026, 11:05 AM', portalEnabled: false, status: 'Active', outstanding: 0 },
};

const ROWS = clients.map((c, idx) => {
  const cMatters = matters.filter((m) => m.clientId === c.id);
  const hours = seedEntries.filter((e) => cMatters.some((m) => m.id === e.matterId)).reduce((a, e) => a + e.durationSec, 0) || (idx + 3) * 9000;
  const revenue = cMatters.reduce((a, m) => a + (m.rate * hours) / 3600, 0) / Math.max(cMatters.length, 1) || (idx + 1) * 2100;
  const meta = CLIENT_META[c.id];
  const primary = contacts.find((ct) => ct.clientId === c.id);
  return { client: c, matters: cMatters, hours, revenue, primary, ...meta };
});

export default function Clients() {
  return (
    <AdminShell
      title="Clients"
      subtitle="Every client your firm represents — billings, contacts, portal status."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> New Client
        </button>
      }>
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search clients..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg">Filter</button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1.4fr_110px_60px_70px_110px_110px_120px_110px] gap-3 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>Client</div>
          <div>Primary contact</div>
          <div>Retained</div>
          <div className="text-right">Matters</div>
          <div className="text-right">Hours</div>
          <div className="text-right">Revenue</div>
          <div className="text-right">Outstanding</div>
          <div className="text-center">Portal access</div>
          <div className="text-center">Status</div>
        </div>
        {ROWS.map((r) => {
          const initial = r.client.name[0];
          const tint = CLIENT_TINTS[initial] ?? { bg: '#F3F4F6', fg: '#4B5563' };
          return (
            <div key={r.client.id} className="grid grid-cols-[1.6fr_1.4fr_110px_60px_70px_110px_110px_120px_110px] gap-3 items-center px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/50">
              <div className="flex items-center gap-3 min-w-0">
                <span style={{ background: tint.bg, color: tint.fg }} className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {initial}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{r.client.name}</div>
                  <div className="text-xs text-fg-muted">{r.matters.length} {r.matters.length === 1 ? 'matter' : 'matters'}</div>
                </div>
              </div>
              <div className="text-sm min-w-0">
                {r.primary ? (
                  <>
                    <div className="font-medium text-fg truncate">{r.primary.firstName} {r.primary.lastName}</div>
                    <div className="text-xs text-fg-muted truncate">{r.primary.phone}</div>
                  </>
                ) : <span className="text-fg-subtle">—</span>}
              </div>
              <div className="text-sm">{r.retainedDate}</div>
              <div className="text-sm tabular-nums text-right">{r.matters.length}</div>
              <div className="text-sm tabular-nums text-right">{formatHoursH(r.hours)}</div>
              <div className="text-sm font-semibold tabular-nums text-right">{formatMoneyCompact(r.revenue)}</div>
              <div className={`text-sm tabular-nums text-right ${r.outstanding > 0 ? 'text-warning font-semibold' : 'text-fg-muted'}`}>
                {r.outstanding > 0 ? formatMoneyCompact(r.outstanding) : '—'}
              </div>
              <div className="flex justify-center">
                <span
                  className={`px-2.5 py-1 text-xs rounded-md border font-semibold ${
                    r.portalEnabled
                      ? 'border-accent text-accent-dark bg-accent-soft/50'
                      : 'border-border text-fg-muted bg-bg'
                  }`}>
                  {r.portalEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-center">
                <span
                  className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                    r.status === 'Active' ? 'bg-accent-soft text-accent-dark' : 'bg-bg text-fg-muted'
                  }`}>
                  {r.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
