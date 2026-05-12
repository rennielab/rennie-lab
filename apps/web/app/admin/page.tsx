'use client';

import Link from 'next/link';

import { AdminShell } from '@/components/AdminShell';
import { clients, contactById, formatHours, formatMoney, lawyerById, matterById, matters, seedEntries } from '@/lib/mock';

export default function Dashboard() {
  const totalSec = seedEntries.reduce((a, e) => a + e.durationSec, 0);
  const billableSec = seedEntries.filter(e => !e.nonBillable).reduce((a, e) => a + e.durationSec, 0);
  const revenue = seedEntries
    .filter(e => !e.nonBillable && e.status === 'approved')
    .reduce((a, e) => {
      const m = matterById(e.matterId);
      return a + (m ? (m.rate * e.durationSec) / 3600 : 0);
    }, 0);
  const pending = seedEntries.filter(e => e.status === 'pending').length;

  return (
    <AdminShell
      title="Dashboard"
      subtitle={`Welcome back, ${'Marcus'}. Here's what's happening at Bennett & Hayes.`}
      action={<PrimaryBtn>+ Quick Action</PrimaryBtn>}>
      <div className="grid grid-cols-6 gap-4">
        <Kpi label="Total Hours" value={formatHours(totalSec)} />
        <Kpi label="Billable" value={formatHours(billableSec)} />
        <Kpi label="Revenue (MTD)" value={formatMoney(revenue)} trend="+18.2%" />
        <Kpi label="Active Clients" value={String(clients.length)} />
        <Kpi label="Active Matters" value={String(matters.length)} />
        <Kpi label="Pending" value={String(pending)} accent />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold">Hours over time</h2>
              <p className="text-sm text-fg-muted">Last 7 days</p>
            </div>
            <select className="text-sm border border-border rounded-lg px-3 py-1.5 bg-bg">
              <option>This week</option>
              <option>This month</option>
            </select>
          </div>
          <SparkChart />
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-1">Manual vs Captured</h2>
          <p className="text-sm text-fg-muted mb-6">How time made it in</p>
          <CapturedDonut />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent entries</h2>
            <Link href="/admin/entries" className="text-sm text-accent font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {[...seedEntries].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5).map((e) => {
              const m = matterById(e.matterId);
              const law = lawyerById(e.lawyerId);
              const c = e.contactId ? contactById(e.contactId) : undefined;
              return (
                <div key={e.id} className="flex items-center gap-3 py-2.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${
                    e.source === 'call' ? 'bg-accent-soft text-accent' : 'bg-bg text-fg-muted'
                  }`}>
                    {e.source === 'call' ? '📞' : '⏱'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c ? `${c.firstName} ${c.lastName}` : m?.shortName}</div>
                    <div className="text-xs text-fg-muted truncate">{m?.shortName} · {law?.name}</div>
                  </div>
                  <div className="text-sm font-semibold tabular-nums">{formatHours(e.durationSec)}</div>
                  <StatusBadge status={e.status} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-1">Top clients by revenue</h2>
          <p className="text-sm text-fg-muted mb-4">Month to date</p>
          <div className="space-y-3">
            {clients.slice(0, 4).map((c, i) => {
              const amount = [4287, 3120, 2480, 1640][i];
              const pct = [78, 56, 44, 30][i];
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium truncate mr-2">{c.name}</span>
                    <span className="tabular-nums text-fg-muted">${amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Kpi({ label, value, trend, accent }: { label: string; value: string; trend?: string; accent?: boolean }) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-4 ${accent ? 'ring-1 ring-warning/30' : ''}`}>
      <div className="text-xs text-fg-muted">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ? 'text-warning' : ''}`}>{value}</div>
      {trend && <div className="text-xs text-accent mt-1 font-medium">{trend}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: 'approved' | 'pending' | 'draft' }) {
  const map = {
    approved: 'bg-accent-soft text-accent-dark',
    pending: 'bg-warning-soft text-warning',
    draft: 'bg-bg text-fg-muted',
  } as const;
  return <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${map[status]}`}>{status}</span>;
}

function PrimaryBtn({ children }: { children: React.ReactNode }) {
  return <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition">{children}</button>;
}

function SparkChart() {
  // Simple SVG line chart, mock data
  const pts = [3.2, 5.1, 4.6, 7.8, 6.4, 9.1, 6.8];
  const max = Math.max(...pts);
  const w = 600;
  const h = 180;
  const stepX = w / (pts.length - 1);
  const path = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX} ${h - (v / max) * (h - 20)}`).join(' ');
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#grad)" />
      <path d={path} stroke="#22C55E" strokeWidth="2.5" fill="none" />
      {pts.map((v, i) => (
        <circle key={i} cx={i * stepX} cy={h - (v / max) * (h - 20)} r="4" fill="#22C55E" />
      ))}
    </svg>
  );
}

function CapturedDonut() {
  const captured = 0.68;
  const C = 2 * Math.PI * 50;
  return (
    <div className="flex items-center justify-center py-2">
      <svg viewBox="0 0 120 120" className="w-40 h-40">
        <circle cx="60" cy="60" r="50" stroke="#E5E7EB" strokeWidth="14" fill="none" />
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#22C55E"
          strokeWidth="14"
          fill="none"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - captured)}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F1419">
          {Math.round(captured * 100)}%
        </text>
        <text x="60" y="76" textAnchor="middle" fontSize="10" fill="#6B7280">
          captured
        </text>
      </svg>
    </div>
  );
}
