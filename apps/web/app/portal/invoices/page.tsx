'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { PortalShell } from '@/components/PortalShell';
import { formatDate, formatMoney, invoices as seedInvoices } from '@/lib/mock';

// The hero invoice (matches /admin/invoices/inv_hero)
const heroInvoice = {
  id: 'inv_hero',
  number: 'BH-2026-0043',
  clientId: 'cli_reyes',
  total: 2961.67,
  status: 'sent' as const,
  issuedAt: Date.now(),
  dueAt: Date.now() + 30 * 24 * 3600 * 1000,
};

export default function PortalInvoices() {
  // Auto-show the hero invoice when client arrives (the lawyer just sent it)
  const [showHero, setShowHero] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowHero(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const list = showHero ? [heroInvoice, ...seedInvoices] : seedInvoices;

  return (
    <PortalShell
      title="Your invoices"
      subtitle="View and pay invoices from your firm.">
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg border-b border-border text-fg-muted">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Invoice</th>
              <th className="px-6 py-3 text-left font-semibold">Issued</th>
              <th className="px-6 py-3 text-left font-semibold">Due</th>
              <th className="px-6 py-3 text-right font-semibold">Amount</th>
              <th className="px-6 py-3 text-right font-semibold">Status</th>
              <th className="px-6 py-3 text-right font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((inv, i) => (
              <tr
                key={inv.id}
                className={`border-b border-border last:border-0 hover:bg-bg/50 ${
                  showHero && i === 0 ? 'bg-accent-soft/30' : ''
                }`}>
                <td className="px-6 py-4">
                  <Link href={`/portal/invoices/${inv.id}`} className="font-semibold hover:text-accent">
                    {inv.number}
                  </Link>
                  {showHero && i === 0 && (
                    <span className="ml-2 px-2 py-0.5 text-[10px] bg-accent text-white rounded-full font-semibold uppercase">
                      New
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-fg-muted">{formatDate(inv.issuedAt)}</td>
                <td className="px-6 py-4 text-fg-muted">{formatDate(inv.dueAt)}</td>
                <td className="px-6 py-4 text-right font-bold tabular-nums">{formatMoney(inv.total)}</td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      inv.status === 'paid'
                        ? 'bg-accent-soft text-accent-dark'
                        : 'bg-warning-soft text-warning'
                    }`}>
                    {inv.status === 'paid' ? 'Paid' : 'Awaiting payment'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {inv.status !== 'paid' && (
                    <Link
                      href={`/portal/invoices/${inv.id}`}
                      className="text-sm font-semibold text-accent hover:underline">
                      Pay →
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}
