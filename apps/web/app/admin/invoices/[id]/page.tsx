'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { AdminShell } from '@/components/AdminShell';
import {
  clientById,
  firm,
  formatDate,
  formatDuration,
  formatMoney,
  heroEntry,
  invoices as seedInvoices,
  matterById,
  seedEntries,
} from '@/lib/mock';

export default function InvoiceDetail() {
  const params = useParams<{ id: string }>();
  const isHero = params.id === 'inv_hero';

  const invoice = isHero
    ? {
        id: 'inv_hero',
        number: 'BH-2026-0043',
        clientId: 'cli_reyes',
        entryIds: [heroEntry.id, 'te_2', 'te_6'],
        subtotal: 2961.67,
        tax: 0,
        total: 2961.67,
        status: 'sent' as const,
        issuedAt: Date.now(),
        dueAt: Date.now() + 30 * 24 * 3600 * 1000,
      }
    : seedInvoices.find((i) => i.id === params.id) ?? seedInvoices[0];

  const client = clientById(invoice.clientId)!;
  const allEntries = [heroEntry, ...seedEntries];
  const lineEntries = invoice.entryIds
    .map((id) => allEntries.find((e) => e.id === id))
    .filter(Boolean) as typeof seedEntries;

  return (
    <AdminShell
      title={invoice.number}
      subtitle={`To ${client.name}`}
      action={
        <div className="flex items-center gap-2">
          <button className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg">
            Download PDF
          </button>
          <button className="px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold">
            Send to Client →
          </button>
        </div>
      }>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="bg-card border border-border rounded-2xl p-10">
            {isHero && (
              <div className="mb-6 bg-accent-soft border border-accent rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-full text-white flex items-center justify-center">✓</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">Invoice generated</div>
                  <div className="text-xs text-fg-muted">Ready to send to {client.name}.</div>
                </div>
              </div>
            )}

            <div className="flex items-start justify-between mb-10">
              <div>
                <div className="w-12 h-12 rounded-lg bg-sidebar flex items-center justify-center mb-3">
                  <span className="text-accent font-bold text-lg">C</span>
                </div>
                <div className="font-bold text-lg">{firm.name}</div>
                <div className="text-sm text-fg-muted">{firm.location}</div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-fg-muted">Invoice</div>
                <div className="text-2xl font-bold">{invoice.number}</div>
                <div className="text-sm text-fg-muted mt-2">
                  Issued {formatDate(invoice.issuedAt)}
                  <br />
                  Due {formatDate(invoice.dueAt)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <div className="text-xs uppercase text-fg-muted font-semibold mb-2">Bill to</div>
                <div className="font-bold">{client.name}</div>
                <div className="text-sm text-fg-muted">c/o Accounts Payable</div>
              </div>
              <div>
                <div className="text-xs uppercase text-fg-muted font-semibold mb-2">Status</div>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${
                    invoice.status === 'paid'
                      ? 'bg-accent-soft text-accent-dark'
                      : 'bg-warning-soft text-warning'
                  }`}>
                  {invoice.status === 'paid' ? 'Paid' : 'Sent · Awaiting payment'}
                </span>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="border-b border-border text-fg-muted">
                <tr>
                  <th className="text-left py-3 font-semibold">Matter</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                  <th className="text-right py-3 font-semibold">Hours</th>
                  <th className="text-right py-3 font-semibold">Rate</th>
                  <th className="text-right py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineEntries.map((e) => {
                  const m = matterById(e.matterId)!;
                  return (
                    <tr key={e.id} className="border-b border-border">
                      <td className="py-3 font-medium">{m.shortName}</td>
                      <td className="py-3 text-fg-muted max-w-md truncate">{e.description}</td>
                      <td className="py-3 text-right tabular-nums">{formatDuration(e.durationSec)}</td>
                      <td className="py-3 text-right tabular-nums">{formatMoney(m.rate)}</td>
                      <td className="py-3 text-right tabular-nums font-semibold">
                        {formatMoney((m.rate * e.durationSec) / 3600)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-end mt-6">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-fg-muted">Subtotal</span>
                  <span className="tabular-nums">{formatMoney(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fg-muted">Tax</span>
                  <span className="tabular-nums">{formatMoney(invoice.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl border-t border-border pt-3">
                  <span>Total</span>
                  <span className="text-accent tabular-nums">{formatMoney(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Activity</h3>
            <div className="space-y-3 text-sm">
              <ActivityRow time="Just now" event={isHero ? 'Invoice generated' : 'Sent to client'} />
              <ActivityRow time="2 min ago" event="Approved by Marcus Hayes" />
              <ActivityRow time="10 min ago" event="Time entry captured from call" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Client portal</h3>
            <p className="text-sm text-fg-muted mb-3">
              {client.name} can view and pay this invoice from their portal.
            </p>
            <Link
              href="/portal/login"
              className="block text-center bg-bg hover:bg-border text-fg font-semibold text-sm py-2 rounded-lg border border-border">
              Preview client view →
            </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function ActivityRow({ time, event }: { time: string; event: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
      <div>
        <div className="font-medium">{event}</div>
        <div className="text-xs text-fg-muted">{time}</div>
      </div>
    </div>
  );
}
