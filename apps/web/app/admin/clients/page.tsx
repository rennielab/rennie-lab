'use client';

import { AdminShell } from '@/components/AdminShell';
import { clients, formatHours, formatMoney, matters, seedEntries } from '@/lib/mock';

const CLIENT_TINTS: Record<string, { bg: string; fg: string }> = {
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  N: { bg: '#DBEAFE', fg: '#1D4ED8' },
  V: { bg: '#DCFCE7', fg: '#166534' },
};

const ROWS = clients.map((c, idx) => {
  const cMatters = matters.filter((m) => m.clientId === c.id);
  const hours = seedEntries.filter((e) => cMatters.some((m) => m.id === e.matterId)).reduce((a, e) => a + e.durationSec, 0) || (idx + 3) * 9000;
  const revenue = cMatters.reduce((a, m) => a + (m.rate * hours) / 3600, 0) / cMatters.length || (idx + 1) * 2100;
  const retainedDate = ['12 Feb 2025', '18 Jul 2025', '05 Jan 2026', '22 Sep 2024'][idx % 4];
  const lastActivity = ['04 Mar 2026, 2:35 PM', '09 Mar 2026, 10:12 AM', '08 Mar 2026, 4:48 PM', '15 Jan 2026, 11:05 AM'][idx % 4];
  const portalEnabled = idx % 3 !== 1;
  const status = idx === 2 ? 'Archived' : 'Active';
  return { client: c, matters: cMatters, hours, revenue, retainedDate, lastActivity, portalEnabled, status };
});

export default function Clients() {
  return (
    <AdminShell
      title="Clients"
      subtitle="All clients across your firm."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg">
          + New Client
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

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_120px_80px_80px_110px_180px_120px_100px_40px] gap-4 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>Name</div>
          <div>Retained Date</div>
          <div className="text-right">Matters</div>
          <div className="text-right">Hours</div>
          <div className="text-right">Revenue</div>
          <div>Last Activity</div>
          <div className="text-center">Portal Access</div>
          <div className="text-center">Status</div>
          <div></div>
        </div>
        {ROWS.map((r) => {
          const initial = r.client.name[0];
          const tint = CLIENT_TINTS[initial] ?? { bg: '#F3F4F6', fg: '#4B5563' };
          return (
            <div key={r.client.id} className="grid grid-cols-[2fr_120px_80px_80px_110px_180px_120px_100px_40px] gap-4 items-center px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/50">
              <div className="flex items-center gap-3 min-w-0">
                <span style={{ background: tint.bg, color: tint.fg }} className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {initial}
                </span>
                <span className="text-sm font-semibold truncate">{r.client.name}</span>
              </div>
              <div className="text-sm">{r.retainedDate}</div>
              <div className="text-sm tabular-nums text-right">{r.matters.length}</div>
              <div className="text-sm tabular-nums text-right">{formatHours(r.hours)}</div>
              <div className="text-sm font-semibold tabular-nums text-right">{formatMoney(r.revenue)}</div>
              <div className="text-sm text-fg-muted">{r.lastActivity}</div>
              <div className="flex justify-center">
                <span
                  className={`px-2 py-0.5 text-xs rounded-md border font-semibold ${
                    r.portalEnabled
                      ? 'border-accent text-accent-dark bg-accent-soft/50'
                      : 'border-danger/40 text-danger bg-danger-soft/50'
                  }`}>
                  {r.portalEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-center">
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    r.status === 'Active' ? 'bg-accent-soft text-accent-dark' : 'bg-danger-soft text-danger'
                  }`}>
                  {r.status}
                </span>
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
