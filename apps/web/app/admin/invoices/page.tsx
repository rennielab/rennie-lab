'use client';

import Link from 'next/link';

import { AdminShell } from '@/components/AdminShell';
import { clientById, formatDate, formatMoney, invoices } from '@/lib/mock';

export default function InvoicesList() {
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
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Stat label="Outstanding" value={formatMoney(5687.5)} />
        <Stat label="Paid (30d)" value={formatMoney(12450)} />
        <Stat label="Overdue" value={formatMoney(0)} />
        <Stat label="Draft" value={formatMoney(0)} />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg border-b border-border text-fg-muted">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Invoice</th>
              <th className="px-6 py-3 text-left font-semibold">Client</th>
              <th className="px-6 py-3 text-left font-semibold">Issued</th>
              <th className="px-6 py-3 text-left font-semibold">Due</th>
              <th className="px-6 py-3 text-right font-semibold">Amount</th>
              <th className="px-6 py-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const client = clientById(inv.clientId);
              return (
                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-6 py-4">
                    <Link href={`/admin/invoices/${inv.id}`} className="font-semibold hover:text-accent">
                      {inv.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-fg-muted">{client?.name}</td>
                  <td className="px-6 py-4 text-fg-muted">{formatDate(inv.issuedAt)}</td>
                  <td className="px-6 py-4 text-fg-muted">{formatDate(inv.dueAt)}</td>
                  <td className="px-6 py-4 text-right font-bold tabular-nums">{formatMoney(inv.total)}</td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                        inv.status === 'paid'
                          ? 'bg-accent-soft text-accent-dark'
                          : inv.status === 'sent'
                          ? 'bg-warning-soft text-warning'
                          : 'bg-bg text-fg-muted'
                      }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="text-xs text-fg-muted">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
