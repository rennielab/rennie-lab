'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import {
  clients,
  contactById,
  formatHours,
  formatMoney,
  lawyerById,
  lawyers,
  matterById,
  matters,
  seedEntries,
} from '@/lib/mock';

// ---------- KPI math (driven by mock so the demo looks lived-in) ----------

function computeKpis() {
  const dayMs = 24 * 60 * 60 * 1000;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const totalSec = seedEntries.reduce((a, e) => a + e.durationSec, 0);
  const todaySec = seedEntries
    .filter((e) => e.createdAt >= startOfToday.getTime())
    .reduce((a, e) => a + e.durationSec, 0);
  const billableSec = seedEntries.filter((e) => !e.nonBillable).reduce((a, e) => a + e.durationSec, 0);
  const nonBillableSec = totalSec - billableSec;
  const unconfirmed = seedEntries.filter((e) => e.status === 'pending' || e.status === 'draft').length;
  const revenue = seedEntries
    .filter((e) => !e.nonBillable && e.status === 'approved')
    .reduce((a, e) => {
      const m = matterById(e.matterId);
      return a + (m ? (m.rate * e.durationSec) / 3600 : 0);
    }, 0);

  // Avg per member uses lawyers excluding admin? Just use all to keep it simple.
  const avgPerMember = totalSec / Math.max(lawyers.length, 1);

  // Time logged per week, last 7 buckets
  const weeks: { label: string; sec: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const end = Date.now() - i * dayMs;
    const start = end - dayMs;
    const sec = seedEntries
      .filter((e) => e.createdAt >= start && e.createdAt < end)
      .reduce((a, e) => a + e.durationSec, 0);
    const d = new Date(end);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    weeks.push({ label: `${mm}-${dd}`, sec });
  }

  return {
    totalSec,
    todaySec,
    billableSec,
    nonBillableSec,
    unconfirmed,
    revenue,
    avgPerMember,
    weeks,
    captured: 0.68,
  };
}

export default function Dashboard() {
  const k = computeKpis();
  const [period, setPeriod] = useState<'week' | 'month'>('month');

  const recent = [...seedEntries].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Insert page description here."
      action={
        <div className="flex items-center gap-2">
          <PeriodPicker value={period} onChange={setPeriod} />
          <button className="h-10 px-4 rounded-full bg-accent hover:bg-accent-dim text-white font-semibold text-sm transition inline-flex items-center gap-1.5">
            <span className="text-base leading-none">+</span> Quick Action
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      }>
      {/* Onboarding */}
      <OnboardingCard />

      {/* Two rows of 6 KPIs */}
      <div className="grid grid-cols-6 gap-3 mt-4">
        <Kpi icon={<IconClock />} value={formatHours(k.totalSec)} label="Total Hours" delta="+12%" />
        <Kpi icon={<IconClock />} value={formatHours(k.todaySec)} label="Hours Today" />
        <Kpi icon={<IconTimer />} value={formatHours(k.billableSec)} label="Billable Hours" delta="+12%" />
        <Kpi icon={<IconPause />} value={formatHours(k.nonBillableSec)} label="Non-Billable" />
        <Kpi icon={<IconHelp />} value={String(k.unconfirmed)} label="Unconfirmed" />
        <Kpi icon={<IconDollar />} value={formatMoney(k.revenue)} label="Revenue" delta="+18.2%" />

        <Kpi icon={<IconTrend />} value="+24.3%" label="Revenue Growth %" delta="+12%" />
        <Kpi icon={<IconActivity />} value="$3,304" label="Monthly Recurring" />
        <Kpi icon={<IconUsers />} value={String(clients.length)} label="Active Clients" />
        <Kpi icon={<IconBriefcase />} value={String(matters.length)} label="Active Matters" />
        <Kpi icon={<IconUsers />} value={String(lawyers.length)} label="Active Members" />
        <Kpi icon={<IconTarget />} value={formatHours(k.avgPerMember)} label="Avg hrs/Member" />
      </div>

      {/* Hours Over Time */}
      <div className="mt-4 bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-sm font-semibold text-fg">Hours Over Time</div>
            <div className="text-xs text-fg-muted mt-0.5">
              Total hours <span className="text-fg font-semibold">{formatHours(k.totalSec)}</span>
            </div>
          </div>
          <button className="text-sm text-fg-muted inline-flex items-center gap-1.5 border border-border rounded-lg px-3 h-9 hover:bg-bg">
            Weekly
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <HoursBarChart weeks={k.weeks} />
      </div>

      {/* Events + Manual vs Captured */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6 min-h-[260px]">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-fg">Events</div>
            <Link href="#" className="text-xs font-medium text-accent inline-flex items-center gap-1">
              View All
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <EventsList />
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-sm font-semibold text-fg mb-1">Manual vs Captured</div>
          <div className="text-xs text-fg-muted mb-2">How time made it in</div>
          <CapturedDonut value={k.captured} />
        </div>
      </div>

      {/* Top Performing Members + Time by Activity */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-card border border-border rounded-2xl p-6 min-h-[260px]">
          <div className="text-sm font-semibold text-fg mb-4">Top Performing Members</div>
          <TopMembers />
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 min-h-[260px]">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-fg">Time by Activity</div>
            <Link href="#" className="text-xs font-medium text-accent inline-flex items-center gap-1">
              Full Report
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <ActivityBreakdown />
        </div>
      </div>

      {/* Recent Entries */}
      <div className="mt-4 bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-fg">Recent Entries</div>
          <Link href="/admin/entries" className="text-xs font-medium text-accent inline-flex items-center gap-1">
            View All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recent.map((e) => {
            const m = matterById(e.matterId);
            const law = lawyerById(e.lawyerId);
            const c = e.contactId ? contactById(e.contactId) : undefined;
            return (
              <div key={e.id} className="flex items-center gap-3 py-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    e.source === 'call' ? 'bg-accent-soft text-accent' : 'bg-bg text-fg-muted'
                  }`}>
                  {e.source === 'call' ? <IconPhone /> : <IconClock />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-fg truncate">
                    {c ? `${c.firstName} ${c.lastName}` : m?.shortName}
                  </div>
                  <div className="text-xs text-fg-muted truncate">
                    {m?.shortName} · {law?.name}
                  </div>
                </div>
                <div className="text-sm font-semibold text-fg tabular-nums">{formatHours(e.durationSec)}</div>
                <StatusBadge status={e.status} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Logged per Project + Top Clients */}
      <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
        <div className="bg-card border border-border rounded-2xl p-6 min-h-[260px]">
          <div className="text-sm font-semibold text-fg mb-4">Time Logged per Project</div>
          <TimePerProject />
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 min-h-[260px]">
          <div className="text-sm font-semibold text-fg mb-4">Top Clients by Revenue</div>
          <TopClients />
        </div>
      </div>
    </AdminShell>
  );
}

// ---------- Header bits ----------

function PeriodPicker({ value, onChange }: { value: 'week' | 'month'; onChange: (v: 'week' | 'month') => void }) {
  return (
    <button
      onClick={() => onChange(value === 'month' ? 'week' : 'month')}
      className="h-10 px-3.5 rounded-full border border-border bg-card text-sm text-fg inline-flex items-center gap-2 hover:bg-bg">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="font-medium">{value === 'month' ? 'This month' : 'This week'}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ---------- Onboarding ----------

function OnboardingCard() {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-card border border-border rounded-2xl px-6 py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between text-left">
        <div>
          <div className="text-sm font-semibold text-fg">Unlock your admin overview</div>
          <div className="text-xs text-fg-muted mt-0.5">Finish the steps below to see project and team activity.</div>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className={`text-fg-muted transition-transform ${open ? '' : 'rotate-180'}`}>
          <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ol className="mt-4 space-y-2">
          {[
            'Create a client',
            'Add a matter',
            'Assign teammates to matter',
          ].map((label, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-fg">
              <span className="w-5 h-5 rounded-full bg-bg text-fg-muted text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ---------- KPIs ----------

function Kpi({
  icon,
  value,
  label,
  delta,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  delta?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="w-9 h-9 rounded-lg bg-bg flex items-center justify-center text-fg-muted">{icon}</div>
      <div className="flex items-baseline gap-1.5 mt-3">
        <div className="text-2xl font-semibold text-fg tabular-nums tracking-tight">{value}</div>
        {delta && (
          <span className="text-xs font-medium text-accent inline-flex items-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="mr-0.5">
              <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {delta}
          </span>
        )}
      </div>
      <div className="text-xs text-fg-muted mt-1">{label}</div>
    </div>
  );
}

// ---------- Chart ----------

function HoursBarChart({ weeks }: { weeks: { label: string; sec: number }[] }) {
  const hours = weeks.map((w) => w.sec / 3600);
  const maxH = Math.max(16, Math.ceil(Math.max(...hours, 1) / 4) * 4);
  const ticks = [maxH, maxH * 0.75, maxH * 0.5, maxH * 0.25, 0];

  return (
    <div className="relative">
      {/* Y axis lines */}
      <div className="relative h-[200px] pl-9">
        {ticks.map((t, i) => (
          <div
            key={i}
            className="absolute left-9 right-0 border-t border-dashed border-border"
            style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}
          />
        ))}
        {ticks.map((t, i) => (
          <div
            key={`l-${i}`}
            className="absolute left-0 w-8 text-right text-xs text-fg-subtle tabular-nums"
            style={{ top: `calc(${(i / (ticks.length - 1)) * 100}% - 7px)` }}>
            {Math.round(t)}h
          </div>
        ))}
        <div className="absolute left-9 right-0 top-0 bottom-0 flex items-end gap-2 px-2">
          {hours.map((h, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <div
                className="w-7 bg-accent rounded-md"
                style={{ height: `${(h / maxH) * 100}%`, minHeight: h > 0 ? 4 : 0 }}
                title={`${h.toFixed(2)}h`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex pl-9 mt-2">
        {weeks.map((w, i) => (
          <div key={i} className="flex-1 text-center text-xs text-fg-subtle tabular-nums">
            {w.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Donut ----------

function CapturedDonut({ value }: { value: number }) {
  const C = 2 * Math.PI * 50;
  return (
    <div className="flex items-center justify-center py-2">
      <svg viewBox="0 0 120 120" className="w-44 h-44">
        <circle cx="60" cy="60" r="50" stroke="#E5E7EB" strokeWidth="14" fill="none" />
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#22C55E"
          strokeWidth="14"
          fill="none"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - value)}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F1419">
          {Math.round(value * 100)}%
        </text>
        <text x="60" y="76" textAnchor="middle" fontSize="10" fill="#6B7280">
          Captured
        </text>
      </svg>
    </div>
  );
}

// ---------- Events list ----------

function EventsList() {
  const events = [
    {
      title: 'Deposition prep w/ Anderson counsel',
      time: '9:00 AM · 01:00:00',
      who: 'Sarah',
      flag: 'accent' as const,
    },
    {
      title: 'Northgate IPO diligence sync',
      time: '11:30 AM · 00:45:00',
      who: 'Jordan',
      flag: 'warning' as const,
    },
    {
      title: 'Reyes estate planning review',
      time: '2:00 PM · 00:30:00',
      who: 'Marcus',
      flag: 'accent' as const,
    },
  ];
  return (
    <div className="space-y-3">
      {events.map((e, i) => (
        <div key={i} className="flex items-start gap-3 pl-3 relative">
          <span
            className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${
              e.flag === 'accent' ? 'bg-accent' : 'bg-warning'
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-fg truncate">{e.title}</div>
            <div className="text-xs text-fg-muted mt-0.5">
              {e.time} · {e.who}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-fg-subtle mt-1">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ---------- Top Performing Members ----------

function TopMembers() {
  const data = lawyers
    .map((l) => {
      const sec = seedEntries
        .filter((e) => e.lawyerId === l.id && !e.nonBillable)
        .reduce((a, e) => a + e.durationSec, 0);
      return { l, sec };
    })
    .sort((a, b) => b.sec - a.sec);
  const max = Math.max(...data.map((d) => d.sec), 1);
  return (
    <div className="space-y-4">
      {data.map(({ l, sec }) => (
        <div key={l.id} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-xs font-semibold">
            {l.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-sm font-medium text-fg truncate">{l.name}</div>
              <div className="text-sm font-semibold text-fg tabular-nums">{formatHours(sec)}</div>
            </div>
            <div className="h-1.5 bg-bg rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${(sec / max) * 100}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Activity breakdown ----------

function ActivityBreakdown() {
  const groups = [
    { label: 'Calls', secKey: 'call', color: 'bg-accent' },
    { label: 'Manual entries', secKey: 'manual', color: 'bg-accent-soft-2' },
  ];
  const totals = {
    call: seedEntries.filter((e) => e.source === 'call').reduce((a, e) => a + e.durationSec, 0),
    manual: seedEntries.filter((e) => e.source === 'manual').reduce((a, e) => a + e.durationSec, 0),
  };
  const sum = totals.call + totals.manual || 1;
  return (
    <div className="space-y-4">
      <div className="flex h-3 rounded-full overflow-hidden bg-bg">
        <div className="bg-accent" style={{ width: `${(totals.call / sum) * 100}%` }} />
        <div className="bg-accent-soft-2" style={{ width: `${(totals.manual / sum) * 100}%` }} />
      </div>
      {groups.map((g) => {
        const sec = totals[g.secKey as 'call' | 'manual'];
        return (
          <div key={g.label} className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${g.color}`} />
            <div className="flex-1 text-sm text-fg">{g.label}</div>
            <div className="text-sm font-semibold text-fg tabular-nums">{formatHours(sec)}</div>
            <div className="text-xs text-fg-muted tabular-nums w-12 text-right">
              {Math.round((sec / sum) * 100)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Time per project ----------

function TimePerProject() {
  const data = matters
    .map((m) => {
      const sec = seedEntries.filter((e) => e.matterId === m.id).reduce((a, e) => a + e.durationSec, 0);
      return { m, sec };
    })
    .filter((x) => x.sec > 0)
    .sort((a, b) => b.sec - a.sec)
    .slice(0, 5);
  const max = Math.max(...data.map((d) => d.sec), 1);
  return (
    <div className="space-y-3">
      {data.map(({ m, sec }) => (
        <div key={m.id}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-sm font-medium text-fg truncate mr-3">{m.shortName}</div>
            <div className="text-sm font-semibold text-fg tabular-nums">{formatHours(sec)}</div>
          </div>
          <div className="h-1.5 bg-bg rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: `${(sec / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Top clients ----------

function TopClients() {
  const amounts = [4287, 3120, 2480, 1640];
  return (
    <div className="space-y-3">
      {clients.slice(0, 4).map((c, i) => {
        const max = amounts[0];
        const a = amounts[i];
        return (
          <div key={c.id}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-sm font-medium text-fg truncate mr-3">{c.name}</div>
              <div className="text-sm font-semibold text-fg tabular-nums">${a.toLocaleString()}</div>
            </div>
            <div className="h-1.5 bg-bg rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${(a / max) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Status badge ----------

function StatusBadge({ status }: { status: 'approved' | 'pending' | 'draft' }) {
  const map = {
    approved: 'bg-accent-soft text-accent-dark',
    pending: 'bg-warning-soft text-warning',
    draft: 'bg-bg text-fg-muted',
  } as const;
  return <span className={`px-2.5 py-1 text-[11px] rounded-full font-semibold capitalize ${map[status]}`}>{status}</span>;
}

// ---------- Icons ----------

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconTimer() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M10 2h4M12 14V8M20 14a8 8 0 11-16 0 8 8 0 0116 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconHelp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconDollar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconTrend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 17l6-6 4 4 8-8M14 7h7v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconActivity() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconTarget() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
