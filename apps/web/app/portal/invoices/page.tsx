'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { PortalShell } from '@/components/PortalShell';
import { formatDate, formatHours, formatMoney, invoices as seedInvoices } from '@/lib/mock';

type Status = 'paid' | 'issued' | 'overdue' | 'partial';
type Tab = 'all' | 'paid' | 'pending' | 'overdue';

// Build a realistic portfolio of invoices for the portal demo.
const heroInvoice = {
  id: 'inv_hero',
  number: 'INV-008',
  clientId: 'cli_reyes',
  matter: 'Litigation — Contract Dispute',
  hours: 5.0,
  amount: 700,
  issuedAt: Date.now() - 0,
  paidAt: null as number | null,
  status: 'issued' as Status,
};
const otherInvoices: typeof heroInvoice[] = [
  { id: 'inv_7', number: 'INV-007', clientId: 'cli_reyes', matter: 'Corporate — Annual Filing', hours: 4.5, amount: 1200, issuedAt: Date.parse('2026-03-08'), paidAt: null, status: 'overdue' },
  { id: 'inv_6', number: 'INV-006', clientId: 'cli_reyes', matter: 'Corporate — M&A Advisory', hours: 4.0, amount: 1300, issuedAt: Date.parse('2026-03-03'), paidAt: Date.parse('2026-03-13'), status: 'paid' },
  { id: 'inv_5', number: 'INV-005', clientId: 'cli_reyes', matter: 'IP — Patent Filing', hours: 5.0, amount: 1500, issuedAt: Date.parse('2026-03-05'), paidAt: Date.parse('2026-03-11'), status: 'partial' },
];

export default function PortalInvoices() {
  const [tab, setTab] = useState<Tab>('all');
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHero(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const all = showHero ? [heroInvoice, ...otherInvoices] : otherInvoices;

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
  const overdue30 = all.filter((i) => i.status === 'overdue').reduce((a, i) => a + i.amount, 0);

  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="text-sm text-fg-muted mt-1">All invoices across your matters.</p>
      </div>

      {/* Tabs underline */}
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

      {/* Filter pill */}
      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted mb-4">
        Since joining
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <Kpi label="Total Billed" value={formatMoney(totalBilled)} />
        <Kpi label="Total Outstanding" value={formatMoney(totalOutstanding)} />
        <Kpi label="30 Days Overdue" value={formatMoney(overdue30)} />
        <Kpi label="60 Days Overdue" value={formatMoney(0)} />
        <Kpi label="90+ Days Overdue" value={formatMoney(0)} />
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-3">
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[120px_140px_140px_120px_100px_140px_140px_60px] gap-4 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>Invoice #</div>
          <div>Issue Date</div>
          <div>Issue Date</div>
          <div>Paid on</div>
          <div className="text-right">Hours</div>
          <div className="text-right">Amount</div>
          <div className="text-center">Status</div>
          <div></div>
        </div>
        {filtered.map((inv, i) => (
          <Link
            key={inv.id}
            href={`/portal/invoices/${inv.id}`}
            className={`grid grid-cols-[120px_140px_140px_120px_100px_140px_140px_60px] gap-4 items-center px-6 py-4 border-b border-border last:border-0 hover:bg-bg/50 ${
              showHero && i === 0 ? 'bg-accent-soft/30' : ''
            }`}>
            <span className="text-accent font-semibold">{inv.number}</span>
            <span className="flex items-center gap-2 text-sm">
              <BriefcaseSm />
              <span className="truncate">{inv.matter.split(' — ')[0]} — {inv.matter.split(' — ')[1]}</span>
            </span>
            <span className="text-sm">{formatDate(inv.issuedAt)}</span>
            <span className="text-sm">{inv.paidAt ? formatDate(inv.paidAt) : '—'}</span>
            <span className="text-sm tabular-nums text-right">{formatHours(inv.hours * 3600)}</span>
            <span className="text-sm font-semibold tabular-nums text-right">{formatMoney(inv.amount)}</span>
            <span className="flex justify-center">
              <InvoiceStatus status={inv.status} />
            </span>
            <button onClick={(e) => e.preventDefault()} className="text-fg-muted hover:text-fg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl px-5 py-4">
      <div className="text-xs text-fg-muted">{label}</div>
      <div className="text-2xl font-bold mt-1 tabular-nums">{value}</div>
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
    <span style={{ background: s.bg, color: s.fg }} className="px-2 py-0.5 text-xs rounded-full font-semibold">
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
