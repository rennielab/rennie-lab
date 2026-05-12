'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { PortalShell } from '@/components/PortalShell';
import { formatDate, formatHours, formatMoneyCompact } from '@/lib/mock';
import { markInvoicePaid, usePaidInvoiceIds } from '@/lib/portalState';

type Status = 'paid' | 'issued' | 'overdue' | 'partial';
type Tab = 'all' | 'paid' | 'pending' | 'overdue';

const heroInvoice = {
  id: 'inv_hero',
  number: 'INV-008',
  matter: 'Litigation — Contract Dispute',
  hours: 5.0,
  amount: 700,
  issuedAt: Date.now(),
  paidAt: null as number | null,
  status: 'issued' as Status,
};
const otherInvoices: typeof heroInvoice[] = [
  { id: 'inv_7', number: 'INV-007', matter: 'Corporate — Annual Filing', hours: 4.5, amount: 1200, issuedAt: Date.parse('2026-03-08'), paidAt: null, status: 'overdue' },
  { id: 'inv_6', number: 'INV-006', matter: 'Corporate — M&A Advisory', hours: 4.0, amount: 1300, issuedAt: Date.parse('2026-03-03'), paidAt: Date.parse('2026-03-13'), status: 'paid' },
  { id: 'inv_5', number: 'INV-005', matter: 'IP — Patent Filing', hours: 5.0, amount: 1500, issuedAt: Date.parse('2026-03-05'), paidAt: Date.parse('2026-03-11'), status: 'partial' },
];

export default function PortalInvoices() {
  const [tab, setTab] = useState<Tab>('all');
  const [showHero, setShowHero] = useState(false);
  const paidIds = usePaidInvoiceIds();
  const [payingAll, setPayingAll] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHero(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const all = (showHero ? [heroInvoice, ...otherInvoices] : otherInvoices).map((i) =>
    paidIds.has(i.id) && i.status !== 'paid' ? { ...i, status: 'paid' as Status, paidAt: Date.now() } : i,
  );

  const counts = {
    all: all.length,
    paid: all.filter((i) => i.status === 'paid').length,
    pending: all.filter((i) => i.status === 'issued' || i.status === 'partial').length,
    overdue: all.filter((i) => i.status === 'overdue').length,
  };

  const filtered = all.filter((i) => {
    if (tab === 'all') return true;
    if (tab === 'paid') return i.status === 'paid';
    if (tab === 'pending') return i.status === 'issued' || i.status === 'partial';
    if (tab === 'overdue') return i.status === 'overdue';
    return true;
  });

  const totalBilled = all.reduce((a, i) => a + i.amount, 0);
  const totalOutstanding = all.filter((i) => i.status !== 'paid').reduce((a, i) => a + i.amount, 0);
  const overdueAmount = all.filter((i) => i.status === 'overdue').reduce((a, i) => a + i.amount, 0);
  const outstandingInvoices = all.filter((i) => i.status !== 'paid');

  function handlePayAll() {
    setPayingAll(true);
    setTimeout(() => {
      outstandingInvoices.forEach((i) => markInvoicePaid(i.id));
      setPayingAll(false);
    }, 1100);
  }

  return (
    <PortalShell>
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.5px]">Invoices</h1>
          <p className="text-sm text-fg-muted mt-1">All invoices across your matters.</p>
        </div>
        {totalOutstanding > 0 && (
          <button
            onClick={handlePayAll}
            disabled={payingAll}
            className="h-11 px-5 rounded-[10px] bg-accent hover:bg-accent-dim text-white text-sm font-semibold transition inline-flex items-center gap-2 disabled:opacity-60">
            {payingAll ? (
              <>
                <Spinner />
                Processing…
              </>
            ) : (
              <>
                Pay all outstanding · {formatMoneyCompact(totalOutstanding)}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>

      {/* Overdue banner */}
      {overdueAmount > 0 && (
        <div className="mb-4 bg-danger-soft border border-danger/40 rounded-2xl px-5 py-3 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <div className="flex-1 text-sm">
            <span className="font-semibold text-danger">{formatMoneyCompact(overdueAmount)} overdue</span>
            <span className="text-fg-muted"> · {counts.overdue} {counts.overdue === 1 ? 'invoice' : 'invoices'} past due. Pay now to avoid late fees.</span>
          </div>
          <button onClick={() => setTab('overdue')} className="text-sm font-semibold text-danger hover:underline">
            View overdue →
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-6">
        {(
          [
            ['all', 'All', counts.all],
            ['paid', 'Paid', counts.paid],
            ['pending', 'Pending', counts.pending],
            ['overdue', 'Overdue', counts.overdue],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px ${
              tab === key ? 'border-accent text-accent' : 'border-transparent text-fg-muted hover:text-fg'
            }`}>
            {label}
            <span className={`px-1.5 py-0.5 text-xs rounded-full ${tab === key ? 'bg-accent text-white' : 'bg-bg text-fg-muted'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* KPIs — collapsed: hide $0 buckets so we don't show empty cards */}
      <div className={`grid gap-3 mb-6 ${overdueAmount > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <Kpi label="Total Billed" value={formatMoneyCompact(totalBilled)} />
        <Kpi label="Total Outstanding" value={formatMoneyCompact(totalOutstanding)} tone={totalOutstanding > 0 ? 'warn' : 'ok'} />
        {overdueAmount > 0 && <Kpi label="Overdue" value={formatMoneyCompact(overdueAmount)} tone="danger" />}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[110px_1fr_120px_120px_90px_130px_140px_120px] gap-4 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>Invoice #</div>
          <div>Matter</div>
          <div>Issued</div>
          <div>Paid On</div>
          <div className="text-right">Hours</div>
          <div className="text-right">Amount</div>
          <div className="text-center">Status</div>
          <div></div>
        </div>
        {filtered.map((inv, i) => {
          const justPaid = paidIds.has(inv.id);
          return (
            <div
              key={inv.id}
              className={`grid grid-cols-[110px_1fr_120px_120px_90px_130px_140px_120px] gap-4 items-center px-6 py-3.5 border-b border-border last:border-0 transition ${
                showHero && i === 0 && inv.id === heroInvoice.id ? 'bg-accent-soft/30' : justPaid ? 'bg-accent-soft/20' : 'hover:bg-bg/50'
              }`}>
              <Link href={`/portal/invoices/${inv.id}`} className="text-accent font-semibold hover:underline">
                {inv.number}
              </Link>
              <span className="flex items-center gap-2 text-sm min-w-0">
                <BriefcaseSm />
                <span className="truncate">{inv.matter}</span>
              </span>
              <span className="text-sm text-fg-muted">{formatDate(inv.issuedAt)}</span>
              <span className="text-sm text-fg-muted">{inv.paidAt ? formatDate(inv.paidAt) : '—'}</span>
              <span className="text-sm tabular-nums text-right">{formatHours(inv.hours * 3600)}</span>
              <span className="text-sm font-semibold tabular-nums text-right">${Math.round(inv.amount).toLocaleString()}</span>
              <span className="flex justify-center">
                <InvoiceStatus status={inv.status} />
              </span>
              <span className="flex justify-end gap-1">
                {(inv.status === 'issued' || inv.status === 'overdue' || inv.status === 'partial') && (
                  <button
                    onClick={() => markInvoicePaid(inv.id)}
                    className="h-8 px-3 rounded-lg bg-accent hover:bg-accent-dim text-white text-xs font-semibold transition">
                    Pay
                  </button>
                )}
                <button title="Download PDF" className="w-8 h-8 rounded-lg text-fg-muted hover:text-fg hover:bg-bg flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </PortalShell>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: 'warn' | 'danger' | 'ok' }) {
  const valueClass =
    tone === 'danger' ? 'text-danger' :
    tone === 'warn' ? 'text-warning' :
    'text-fg';
  return (
    <div className="bg-card border border-border rounded-2xl px-5 py-4">
      <div className="text-xs text-fg-muted">{label}</div>
      <div className={`text-2xl font-semibold mt-1 tabular-nums tracking-tight ${valueClass}`}>{value}</div>
    </div>
  );
}

function InvoiceStatus({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; fg: string; label: string }> = {
    paid: { bg: '#DCFCE7', fg: '#166534', label: 'Paid' },
    issued: { bg: '#FED7AA', fg: '#9A3412', label: 'Issued' },
    overdue: { bg: '#FEE2E2', fg: '#B91C1C', label: 'Overdue' },
    partial: { bg: '#DBEAFE', fg: '#1D4ED8', label: 'Partially Paid' },
  };
  const s = map[status];
  return (
    <span style={{ background: s.bg, color: s.fg }} className="px-2.5 py-1 text-xs rounded-full font-semibold">
      {s.label}
    </span>
  );
}

function BriefcaseSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-fg-muted">
      <path d="M4 7h16v13H4zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
