'use client';

import { FirmShell } from '@/components/FirmShell';

type Row = {
  name: string;
  initials: string;
  bg: string;
  fg: string;
  retained: string;
  matters: number;
  hours: string;
  revenue: string;
  lastActivity: string;
  portalAccess: 'Enabled' | 'Disabled';
  status: 'Active' | 'Archived';
};

const ROWS: Row[] = [
  { name: 'Anderson & Cole LLP', initials: 'AC', bg: '#F3F4F6', fg: '#374151', retained: '12 Feb 2025', matters: 3, hours: '42.5h', revenue: '$8,500', lastActivity: '04 Mar 2026, 2:35 PM', portalAccess: 'Enabled', status: 'Active' },
  { name: 'Blackwood Capital', initials: 'BC', bg: '#1F2937', fg: '#FFFFFF', retained: '18 Jul 2025', matters: 2, hours: '31.0h', revenue: '$6,200', lastActivity: '09 Mar 2026, 10:12 AM', portalAccess: 'Enabled', status: 'Active' },
  { name: 'Chen Biotech Ltd', initials: 'C', bg: '#3B82F6', fg: '#FFFFFF', retained: '05 Jan 2026', matters: 4, hours: '12.5h', revenue: '$2,400', lastActivity: '08 Mar 2026, 4:48 PM', portalAccess: 'Disabled', status: 'Archived' },
  { name: 'Delgado Ventures', initials: 'D', bg: '#8B5CF6', fg: '#FFFFFF', retained: '22 Sep 2024', matters: 1, hours: '55.0h', revenue: '$11,300', lastActivity: '15 Jan 2026, 11:05 AM', portalAccess: 'Disabled', status: 'Active' },
  { name: 'William Smith', initials: 'WS', bg: '#FEF3C7', fg: '#92400E', retained: '03 Nov 2025', matters: 1, hours: '27.5h', revenue: '$5,750', lastActivity: '10 Mar 2026, 9:27 AM', portalAccess: 'Enabled', status: 'Active' },
];

export default function FirmClients() {
  return (
    <FirmShell title="Clients" subtitle="Insert page description here.">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <button className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-fg-subtle inline-block" />
          Status
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-white flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          Columns
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1.2fr_0.8fr_0.8fr_1fr_1.6fr_1.1fr_1.1fr] gap-3 px-6 py-3 border-b border-border text-xs font-medium text-fg-muted">
          <div>Name</div>
          <div>Retained Date</div>
          <div>Matters</div>
          <div>Hours</div>
          <div>Revenue</div>
          <div>Last Activity</div>
          <div>Portal Access</div>
          <div>Status</div>
        </div>
        {ROWS.map((r) => (
          <div key={r.name} className="grid grid-cols-[2fr_1.2fr_0.8fr_0.8fr_1fr_1.6fr_1.1fr_1.1fr] gap-3 items-center px-6 py-4 border-b border-border last:border-0 hover:bg-bg/40">
            <div className="flex items-center gap-3">
              <span style={{ background: r.bg, color: r.fg }} className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold">
                {r.initials}
              </span>
              <span className="text-sm font-medium text-fg">{r.name}</span>
            </div>
            <div className="text-sm text-fg">{r.retained}</div>
            <div className="text-sm text-fg tabular-nums">{r.matters}</div>
            <div className="text-sm text-fg tabular-nums">{r.hours}</div>
            <div className="text-sm text-fg tabular-nums">{r.revenue}</div>
            <div className="text-sm text-fg">{r.lastActivity}</div>
            <div>
              <Pill kind={r.portalAccess === 'Enabled' ? 'positive' : 'negative'} label={r.portalAccess} />
            </div>
            <div>
              <Pill kind={r.status === 'Active' ? 'positive' : 'neutral'} label={r.status} />
            </div>
          </div>
        ))}
      </div>
    </FirmShell>
  );
}

function Pill({ kind, label }: { kind: 'positive' | 'negative' | 'neutral'; label: string }) {
  const cls =
    kind === 'positive' ? 'border-accent text-accent-dark bg-accent-soft/30' :
    kind === 'negative' ? 'border-danger text-danger bg-danger-soft/40' :
    'border-border text-fg-muted bg-bg';
  return <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${cls}`}>{label}</span>;
}
