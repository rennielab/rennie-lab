'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { PortalShell } from '@/components/PortalShell';
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

export default function PortalInvoiceDetail() {
  const params = useParams<{ id: string }>();
  const isHero = params.id === 'inv_hero';
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

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

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaid(true);
      setPaying(false);
    }, 1500);
  };

  return (
    <PortalShell title={invoice.number} subtitle={`From ${firm.name}`}>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-card border border-border rounded-2xl p-10">
            <div className="flex items-start justify-between mb-10">
              <div>
                <div className="w-12 h-12 rounded-lg bg-sidebar flex items-center justify-center mb-3">
                  <span className="text-accent font-bold text-lg">C</span>
                </div>
                <div className="font-bold">{firm.name}</div>
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
              </div>
              <div>
                <div className="text-xs uppercase text-fg-muted font-semibold mb-2">Total due</div>
                <div className="text-3xl font-bold text-accent tabular-nums">{formatMoney(invoice.total)}</div>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="border-b border-border text-fg-muted">
                <tr>
                  <th className="text-left py-3 font-semibold">Matter</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                  <th className="text-right py-3 font-semibold">Hours</th>
                  <th className="text-right py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineEntries.map((e) => {
                  const m = matterById(e.matterId)!;
                  return (
                    <tr key={e.id} className="border-b border-border">
                      <td className="py-3 font-medium">{m.shortName}</td>
                      <td className="py-3 text-fg-muted">{e.description}</td>
                      <td className="py-3 text-right tabular-nums">{formatDuration(e.durationSec)}</td>
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
                <div className="flex justify-between font-bold text-xl border-t border-border pt-3">
                  <span>Total</span>
                  <span className="text-accent tabular-nums">{formatMoney(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            {paid ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-accent rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="font-bold text-lg">Payment received</div>
                <div className="text-sm text-fg-muted mt-1">
                  Your payment of {formatMoney(invoice.total)} has been processed.
                </div>
                <div className="text-xs text-fg-subtle mt-3">Receipt sent to your email.</div>
              </div>
            ) : (
              <>
                <div className="text-xs uppercase tracking-wide text-fg-muted font-semibold mb-1">Amount due</div>
                <div className="text-3xl font-bold tabular-nums mb-1">{formatMoney(invoice.total)}</div>
                <div className="text-xs text-fg-muted mb-6">Due {formatDate(invoice.dueAt)}</div>

                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="w-full py-3 rounded-lg bg-accent hover:bg-accent-dim disabled:opacity-60 text-white font-semibold transition">
                  {paying ? 'Processing payment…' : 'Pay now'}
                </button>
                <button className="w-full py-2.5 mt-2 rounded-lg border border-border bg-card hover:bg-bg text-sm font-semibold">
                  Download PDF
                </button>

                <div className="border-t border-border my-5" />

                <div className="space-y-3 text-sm">
                  <div className="text-xs uppercase tracking-wide text-fg-muted font-semibold">Payment methods</div>
                  <PayMethod icon="💳" label="Card ending in 4242" subtext="Visa · Default" />
                  <PayMethod icon="🏦" label="ACH transfer" subtext="Northgate Capital ····2387" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

function PayMethod({ icon, label, subtext }: { icon: string; label: string; subtext: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
      <span className="text-xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{label}</div>
        <div className="text-xs text-fg-muted truncate">{subtext}</div>
      </div>
    </div>
  );
}
