'use client';

import Link from 'next/link';

import { AdminShell } from '@/components/AdminShell';
import { clients, formatDate, formatHours, formatMoney } from '@/lib/mock';

type Status = 'paid' | 'issued' | 'overdue' | 'partial';

const CLIENT_TINTS: Record<string, { bg: string; fg: string }> = {
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  N: { bg: '#DBEAFE', fg: '#1D4ED8' },
  V: { bg: '#DCFCE7', fg: '#166534' },
  B: { bg: '#FEF3C7', fg: '#92400E' },
};

const ROWS = [
  { id: 'inv_8', number: 'INV-008', clientId: 'cli_acme', matter: 'Litigation — Contract Dispute', hours: 5.0, amount: 700, issuedAt: Date.parse('2026-03-12'), paidAt: null, status: 'issued' as Status },
  { id: 'inv_7', number: 'INV-007', clientId: 'cli_acme', matter: 'Corporate — Annual Filing', hours: 4.5, amount: 1200, issuedAt: Date.parse('2026-03-08'), paidAt: null, status: 'overdue' as Status },
  { id: 'inv_6', number: 'INV-006', clientId: 'cli_reyes', matter: 'Corporate — M&A Advisory', hours: 4.0, amount: 1300, issuedAt: Date.parse('2026-03-03'), paidAt: Date.parse('2026-03-13'), status: 'paid' as Status },
  { id: 'inv_5', number: 'INV-005', clientId: 'cli_north', matter: 'IP — Patent Filing', hours: 5.0, amount: 1500, issuedAt: Date.parse('2026-03-05'), paidAt: Date.parse('2026-03-11'), status: 'partial' as Status },
];

export default function AdminInvoicesList() {
  const totalBilled = 8642;
  const totalOutstanding = 4051;
  const overdue30 = 2717;

  return (
    <AdminShell
      title="Invoices"
      subtitle="Send and track invoices to your clients."
      action={
        <Link
          href="/admin/invoices/new"
          className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg">
          + New Invoice
        </Link>
      }>
      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted mb-4">
        Since joining
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="grid grid-cols-5 gap-3 mb-6">
        <Kpi label="Total Billed" value={formatMoney(totalBilled)} />
        <Kpi label="Total Outstanding" value={formatMoney(totalOutstanding)} />
        <Kpi label="30 Days Overdue" value={formatMoney(overdue30)} />
        <Kpi label="60 Days Overdue" value={formatMoney(0)} />
        <Kpi label="90+ Days Overdue" value={formatMoney(0)} />
      </div>

      <div className="flex items-center gap-3 mb-3">
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
          <input placeholder="Search..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          Filter
        </button>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          Columns
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[100px_1.4fr_1.6fr_120px_120px_80px_120px_140px_60px_40px] gap-4 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>Invoice #</div>
          <div>Client</div>
          <div>Matter</div>
          <div>Issue Date</div>
          <div>Paid on</div>
          <div className="text-right">Hours</div>
          <div className="text-right">Amount</div>
          <div className="text-center">Status</div>
          <div></div>
          <div></div>
        </div>
        {ROWS.map((inv) => {
          const client = clients.find((c) => c.id === inv.clientId);
          const initial = client?.name[0] ?? 'C';
          const tint = CLIENT_TINTS[initial] ?? { bg: '#F3F4F6', fg: '#4B5563' };
          return (
            <Link
              key={inv.id}
              href={`/admin/invoices/${inv.id}`}
              className="grid grid-cols-[100px_1.4fr_1.6fr_120px_120px_80px_120px_140px_60px_40px] gap-4 items-center px-6 py-4 border-b border-border last:border-0 hover:bg-bg/50">
              <div className="text-accent font-semibold text-sm">{inv.number}</div>
              <div className="flex items-center gap-2 min-w-0">
                <span style={{ background: tint.bg, color: tint.fg }} className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {initial}
                </span>
                <span className="text-sm truncate">{client?.name}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-fg-muted">
                  <path d="M4 7h16v13H4zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm truncate">{inv.matter}</span>
              </div>
              <div className="text-sm">{formatDate(inv.issuedAt)}</div>
              <div className="text-sm text-fg-muted">{inv.paidAt ? formatDate(inv.paidAt) : '—'}</div>
              <div className="text-sm tabular-nums text-right">{formatHours(inv.hours * 3600)}</div>
              <div className="text-sm font-semibold tabular-nums text-right">{formatMoney(inv.amount)}</div>
              <div className="flex justify-center">
                <InvoiceStatus status={inv.status} />
              </div>
              <button onClick={(e) => e.preventDefault()} className="text-fg-muted hover:text-fg flex justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={(e) => e.preventDefault()} className="text-fg-muted hover:text-fg flex justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            </Link>
          );
        })}
      </div>
    </AdminShell>
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
