'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import {
  clients,
  contactById,
  entryValue,
  formatHoursH,
  formatMoneyCompact,
  heroEntry,
  lawyerById,
  lawyers,
  matterById,
  matters,
  seedEntries,
} from '@/lib/mock';
import { useBilledEntryIds, useEntryOverrides, useInvoiceOverrides } from '@/lib/adminState';

// ---------- Compute everything off mock + overrides ----------

function useDashboardData() {
  const overrides = useEntryOverrides();
  const billed = useBilledEntryIds();
  const invoiceOverrides = useInvoiceOverrides();

  // Include the hero entry so the dashboard count matches the entries page
  // after the hero "arrives" (otherwise dashboard shows 4 and entries shows 5).
  const allRawEntries = [heroEntry, ...seedEntries];
  const enriched = allRawEntries.map((e) => ({
    ...e,
    status: (overrides[e.id]?.status as typeof e.status) ?? e.status,
    description: overrides[e.id]?.description ?? e.description,
    nonBillable: overrides[e.id]?.nonBillable ?? e.nonBillable,
  }));

  const dayMs = 24 * 60 * 60 * 1000;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const totalSec = enriched.reduce((a, e) => a + e.durationSec, 0);
  const todaySec = enriched.filter((e) => e.createdAt >= startOfToday.getTime()).reduce((a, e) => a + e.durationSec, 0);
  const billableSec = enriched.filter((e) => !e.nonBillable).reduce((a, e) => a + e.durationSec, 0);
  const nonBillableSec = totalSec - billableSec;

  // Triage numbers — Marcus's actual queue
  const pendingEntries = enriched.filter((e) => e.status === 'pending');
  const pendingValue = pendingEntries.reduce((a, e) => a + entryValue(e), 0);
  const approvedUnbilledEntries = enriched.filter((e) => e.status === 'approved' && !billed.has(e.id));
  const approvedUnbilledValue = approvedUnbilledEntries.reduce((a, e) => a + entryValue(e), 0);

  // Mock invoice list (in sync with /admin/invoices)
  const invoiceList: { id: string; number: string; client: string; amount: number; defaultStatus: 'sent' | 'overdue' | 'paid' | 'partial' }[] = [
    { id: 'inv_8', number: 'INV-008', client: 'Acme Industries', amount: 700, defaultStatus: 'sent' },
    { id: 'inv_7', number: 'INV-007', client: 'Acme Industries', amount: 1200, defaultStatus: 'overdue' },
    { id: 'inv_6', number: 'INV-006', client: 'Reyes Family Trust', amount: 1300, defaultStatus: 'paid' },
    { id: 'inv_5', number: 'INV-005', client: 'Northgate Capital', amount: 1500, defaultStatus: 'partial' },
  ];
  const invStatus = (id: string, def: string) => invoiceOverrides[id]?.status ?? def;
  const overdueInvoices = invoiceList.filter((i) => invStatus(i.id, i.defaultStatus) === 'overdue');
  const overdueAmount = overdueInvoices.reduce((a, i) => a + i.amount, 0);

  // Stalled matters: no entries in 14+ days (same logic + override used on
  // the Matters page, so triage count matches the tab count).
  const stalledMatters = matters.filter((m) => {
    if (m.id === 'mat_acme_2') return true; // demo: Acme GC has been quiet
    const latest = enriched.filter((e) => e.matterId === m.id).map((e) => e.createdAt).sort((a, b) => b - a)[0];
    if (!latest) return false;
    return Date.now() - latest > 14 * dayMs;
  });

  // Cash collected (paid invoices)
  const cashCollected = invoiceList
    .filter((i) => invStatus(i.id, i.defaultStatus) === 'paid')
    .reduce((a, i) => a + i.amount, 0);

  // Hours per day, last 7
  const days: { label: string; sec: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const end = Date.now() - i * dayMs + dayMs;
    const start = end - dayMs;
    const sec = enriched.filter((e) => e.createdAt >= start && e.createdAt < end).reduce((a, e) => a + e.durationSec, 0);
    const d = new Date(start);
    days.push({ label: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, sec });
  }

  const avgPerMember = totalSec / Math.max(lawyers.length, 1);

  return {
    enriched,
    totalSec, todaySec, billableSec, nonBillableSec,
    pendingEntries, pendingValue,
    approvedUnbilledEntries, approvedUnbilledValue,
    overdueInvoices, overdueAmount,
    stalledMatters,
    cashCollected,
    days,
    avgPerMember,
    capturedPct: 0.68,
  };
}

// ---------- Dashboard ----------

export default function Dashboard() {
  const d = useDashboardData();

  return (
    <AdminShell
      title="Dashboard"
      subtitle={`Welcome back, ${'Marcus'}. Here's where your firm needs you.`}
      action={<QuickActionMenu />}>
      {/* Triage queue — the real first thing Marcus needs */}
      <TriageQueue
        pendingCount={d.pendingEntries.length}
        pendingValue={d.pendingValue}
        unbilledCount={d.approvedUnbilledEntries.length}
        unbilledValue={d.approvedUnbilledValue}
        overdueCount={d.overdueInvoices.length}
        overdueAmount={d.overdueAmount}
        stalledCount={d.stalledMatters.length}
      />

      {/* This-month KPIs (timeframe explicit) */}
      <div className="mt-5 mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wide">This month</h2>
        <span className="text-xs text-fg-muted">7-day rolling chart below</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <Kpi label="Billable" value={formatHoursH(d.billableSec)} icon={<IClock />} delta="+12%" />
        <Kpi label="Revenue (billed)" value={formatMoneyCompact(d.approvedUnbilledValue + d.cashCollected)} icon={<IDollar />} delta="+18.2%" />
        <Kpi label="Cash collected" value={formatMoneyCompact(d.cashCollected)} icon={<IBank />} accent />
        <Kpi label="Avg per member" value={formatHoursH(d.avgPerMember)} icon={<ITarget />} sub={`across ${lawyers.length} members`} />
      </div>

      {/* Hours chart */}
      <div className="mt-4 bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-sm font-semibold text-fg">Hours over time</div>
            <div className="text-xs text-fg-muted mt-0.5">
              Last 7 days · total <span className="text-fg font-semibold">{formatHoursH(d.days.reduce((a, x) => a + x.sec, 0))}</span>
            </div>
          </div>
          <button className="text-sm text-fg-muted inline-flex items-center gap-1.5 border border-border rounded-lg px-3 h-9 hover:bg-bg">
            Daily
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <AutoScaleBarChart series={d.days} />
      </div>

      {/* Recent activity + Capture mix */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold">Recent entries</div>
            <Link href="/admin/entries" className="text-xs font-medium text-accent inline-flex items-center gap-1">
              View all
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {[...d.enriched].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6).map((e) => {
              const m = matterById(e.matterId);
              const law = lawyerById(e.lawyerId);
              const c = e.contactId ? contactById(e.contactId) : undefined;
              return (
                <Link key={e.id} href="/admin/entries" className="flex items-center gap-3 py-2.5 hover:bg-bg/40 rounded -mx-2 px-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${e.source === 'call' ? 'bg-accent-soft text-accent' : 'bg-bg text-fg-muted'}`}>
                    {e.source === 'call' ? <IPhone /> : <IClock />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-fg truncate">{c ? `${c.firstName} ${c.lastName}` : m?.shortName}</div>
                    <div className="text-xs text-fg-muted truncate">{m?.shortName} · {law?.name}</div>
                  </div>
                  <div className="text-sm font-semibold text-fg tabular-nums">{formatHoursH(e.durationSec)}</div>
                  <StatusBadge status={e.status} />
                </Link>
              );
            })}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-sm font-semibold mb-1">Captured vs Manual</div>
          <div className="text-xs text-fg-muted mb-2">How time made it in this month</div>
          <CapturedDonut value={d.capturedPct} />
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" />Auto-captured</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-border-strong" />Manual</span>
          </div>
        </div>
      </div>

      {/* Top clients */}
      <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
        <TopClientsCard />
        <TopMembersCard data={d.enriched} />
      </div>
    </AdminShell>
  );
}

// ---------- Triage queue ----------

function TriageQueue({
  pendingCount, pendingValue,
  unbilledCount, unbilledValue,
  overdueCount, overdueAmount,
  stalledCount,
}: {
  pendingCount: number; pendingValue: number;
  unbilledCount: number; unbilledValue: number;
  overdueCount: number; overdueAmount: number;
  stalledCount: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wide">Your queue</h2>
        <span className="text-xs text-fg-muted">What needs you right now</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <TriageCard
          tone={pendingCount > 0 ? 'warn' : 'ok'}
          icon={<IInbox />}
          label="Time to approve"
          count={pendingCount}
          sub={pendingCount > 0 ? `${formatMoneyCompact(pendingValue)} pending` : 'All caught up'}
          href="/admin/entries?status=pending"
          cta={pendingCount > 0 ? 'Review →' : undefined}
        />
        <TriageCard
          tone={unbilledCount > 0 ? 'accent' : 'ok'}
          icon={<IBolt />}
          label="Ready to invoice"
          count={unbilledCount}
          sub={unbilledCount > 0 ? `${formatMoneyCompact(unbilledValue)} approved` : 'Nothing ready'}
          href="/admin/invoices?new=1"
          cta={unbilledCount > 0 ? 'Generate →' : undefined}
        />
        <TriageCard
          tone={overdueCount > 0 ? 'danger' : 'ok'}
          icon={<IAlert />}
          label="Overdue invoices"
          count={overdueCount}
          sub={overdueCount > 0 ? `${formatMoneyCompact(overdueAmount)} past due` : 'Nothing overdue'}
          href="/admin/invoices?tab=overdue"
          cta={overdueCount > 0 ? 'Chase →' : undefined}
        />
        <TriageCard
          tone={stalledCount > 0 ? 'neutral' : 'ok'}
          icon={<IPause />}
          label="Stalled matters"
          count={stalledCount}
          sub={stalledCount > 0 ? 'No activity in 14+ days' : 'All matters active'}
          href="/admin/matters?filter=stalled"
          cta={stalledCount > 0 ? 'Review →' : undefined}
        />
      </div>
    </div>
  );
}

function TriageCard({
  tone, icon, label, count, sub, href, cta,
}: {
  tone: 'ok' | 'warn' | 'danger' | 'accent' | 'neutral';
  icon: React.ReactNode;
  label: string;
  count: number;
  sub: string;
  href: string;
  cta?: string;
}) {
  const accentMap = {
    ok: { ring: 'border-border', tile: 'bg-bg text-fg-muted', label: 'text-fg-muted', count: 'text-fg' },
    warn: { ring: 'border-warning/40', tile: 'bg-warning-soft text-warning', label: 'text-fg-muted', count: 'text-fg' },
    danger: { ring: 'border-danger/40', tile: 'bg-danger-soft text-danger', label: 'text-fg-muted', count: 'text-fg' },
    accent: { ring: 'border-accent/40', tile: 'bg-accent-soft text-accent-dark', label: 'text-fg-muted', count: 'text-fg' },
    neutral: { ring: 'border-border', tile: 'bg-bg text-fg-muted', label: 'text-fg-muted', count: 'text-fg' },
  }[tone];

  return (
    <Link href={href} className={`block bg-card border ${accentMap.ring} rounded-2xl p-4 hover:shadow-sm transition`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${accentMap.tile}`}>{icon}</span>
        {cta && <span className="text-xs font-semibold text-accent">{cta}</span>}
      </div>
      <div className={`text-3xl font-semibold tabular-nums tracking-tight ${accentMap.count}`}>{count}</div>
      <div className={`text-xs ${accentMap.label} mt-0.5`}>{label}</div>
      <div className="text-xs text-fg-muted mt-2 truncate">{sub}</div>
    </Link>
  );
}

// ---------- Quick Action menu ----------

function QuickActionMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg transition inline-flex items-center gap-1.5">
        <span className="text-base leading-none">+</span> Quick Action
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[220px] bg-card border border-border rounded-xl shadow-[0_20px_60px_-20px_rgba(15,20,25,0.25)] z-30 overflow-hidden">
          {[
            { href: '/admin/entries', label: 'Add time entry', icon: <IClock /> },
            { href: '/admin/invoices?new=1', label: 'New invoice', icon: <IDollar /> },
            { href: '/admin/matters?new=1', label: 'New matter', icon: <IBriefcase /> },
            { href: '/admin/clients?new=1', label: 'New client', icon: <IUsers /> },
            { href: '/admin/team?invite=1', label: 'Invite team member', icon: <IUserPlus /> },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-fg hover:bg-bg">
              <span className="w-7 h-7 rounded-md bg-bg text-fg-muted flex items-center justify-center">{a.icon}</span>
              {a.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- KPI + chart helpers ----------

function Kpi({ label, value, icon, delta, accent, sub }: { label: string; value: string; icon: React.ReactNode; delta?: string; accent?: boolean; sub?: string }) {
  return (
    <div className={`bg-card border ${accent ? 'border-accent/40' : 'border-border'} rounded-2xl p-4`}>
      <div className="flex items-center justify-between">
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent ? 'bg-accent-soft text-accent-dark' : 'bg-bg text-fg-muted'}`}>{icon}</span>
        {delta && (
          <span className="text-xs font-medium text-accent inline-flex items-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="mr-0.5">
              <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {delta}
          </span>
        )}
      </div>
      <div className="text-2xl font-semibold text-fg tabular-nums tracking-tight mt-3">{value}</div>
      <div className="text-xs text-fg-muted mt-1">{label}</div>
      {sub && <div className="text-[11px] text-fg-subtle mt-0.5">{sub}</div>}
    </div>
  );
}

function AutoScaleBarChart({ series }: { series: { label: string; sec: number }[] }) {
  const hours = series.map((s) => s.sec / 3600);
  const peak = Math.max(...hours, 1);
  // Round max up to next nice number (1, 2, 5, 10, 20, 50, 100)
  const niceSteps = [1, 2, 3, 4, 5, 8, 10, 12, 16, 20, 30, 50, 80, 100];
  const max = niceSteps.find((s) => s >= peak * 1.1) ?? Math.ceil(peak * 1.2);

  return (
    <div>
      <div className="relative h-[200px] pl-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="absolute left-10 right-0 border-t border-dashed border-border" style={{ top: `${(i / 4) * 100}%` }} />
        ))}
        {[max, (max * 3) / 4, max / 2, max / 4, 0].map((t, i) => (
          <div key={i} className="absolute left-0 w-9 text-right text-xs text-fg-subtle tabular-nums" style={{ top: `calc(${(i / 4) * 100}% - 7px)` }}>
            {Number.isInteger(t) ? `${t}h` : `${t.toFixed(1)}h`}
          </div>
        ))}
        <div className="absolute left-10 right-0 top-0 bottom-0 flex items-end gap-2 px-2">
          {hours.map((h, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <div className="w-7 bg-accent rounded-md" style={{ height: `${(h / max) * 100}%`, minHeight: h > 0 ? 4 : 0 }} title={`${h.toFixed(2)}h`} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex pl-10 mt-2">
        {series.map((s, i) => (
          <div key={i} className="flex-1 text-center text-xs text-fg-subtle tabular-nums">{s.label}</div>
        ))}
      </div>
    </div>
  );
}

function CapturedDonut({ value }: { value: number }) {
  const C = 2 * Math.PI * 50;
  return (
    <div className="flex items-center justify-center py-2">
      <svg viewBox="0 0 120 120" className="w-40 h-40">
        <circle cx="60" cy="60" r="50" stroke="#E5E7EB" strokeWidth="14" fill="none" />
        <circle cx="60" cy="60" r="50" stroke="#22C55E" strokeWidth="14" fill="none"
          strokeDasharray={C} strokeDashoffset={C * (1 - value)} strokeLinecap="round" transform="rotate(-90 60 60)" />
        <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F1419">{Math.round(value * 100)}%</text>
        <text x="60" y="76" textAnchor="middle" fontSize="10" fill="#6B7280">captured</text>
      </svg>
    </div>
  );
}

function TopClientsCard() {
  const amounts = [4287, 3120, 2480, 1640];
  const max = amounts[0];
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="text-sm font-semibold mb-1">Top clients by revenue</div>
      <div className="text-xs text-fg-muted mb-4">Month to date</div>
      <div className="space-y-3">
        {clients.slice(0, 4).map((c, i) => (
          <div key={c.id}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium truncate mr-2">{c.name}</span>
              <span className="tabular-nums text-fg-muted">${amounts[i].toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-bg rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${(amounts[i] / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopMembersCard({ data }: { data: typeof seedEntries }) {
  const byLawyer = lawyers
    .map((l) => {
      const sec = data.filter((e) => e.lawyerId === l.id && !e.nonBillable).reduce((a, e) => a + e.durationSec, 0);
      return { l, sec };
    })
    .sort((a, b) => b.sec - a.sec);
  const max = Math.max(...byLawyer.map((x) => x.sec), 1);
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="text-sm font-semibold mb-1">Top performing members</div>
      <div className="text-xs text-fg-muted mb-4">Billable hours, month to date</div>
      <div className="space-y-3">
        {byLawyer.map(({ l, sec }) => (
          <div key={l.id} className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-xs font-semibold">{l.initials}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-sm font-medium truncate">{l.name}</div>
                <div className="text-sm font-semibold tabular-nums">{formatHoursH(sec)}</div>
              </div>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${(sec / max) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'approved' | 'pending' | 'draft' | 'rejected' }) {
  const map: Record<string, string> = {
    approved: 'bg-accent-soft text-accent-dark',
    pending: 'bg-warning-soft text-warning',
    draft: 'bg-bg text-fg-muted',
    rejected: 'bg-danger-soft text-danger',
  };
  return <span className={`px-2 py-0.5 text-xs rounded-full font-semibold capitalize ${map[status]}`}>{status}</span>;
}

// ---------- Icons ----------
function IClock() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }
function IDollar() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }
function IBank() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M3 10h18M5 21V10M9 21V10M15 21V10M19 21V10M12 2L2 8h20L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ITarget() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>; }
function IInbox() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 12h-6l-2 3h-4l-2-3H2M5 4h14l3 8v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6l3-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IBolt() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IAlert() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }
function IPause() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="6" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" /><rect x="14" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" /></svg>; }
function IBriefcase() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" /></svg>; }
function IUsers() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IUserPlus() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IPhone() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
