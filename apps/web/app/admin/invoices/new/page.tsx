'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import {
  clientById,
  clients,
  formatDate,
  formatDuration,
  formatMoney,
  heroEntry,
  matterById,
  matters,
  seedEntries,
  TimeEntry,
} from '@/lib/mock';

export default function NewInvoice() {
  const router = useRouter();
  const [clientId, setClientId] = useState('cli_reyes');
  const allEntries: TimeEntry[] = [heroEntry, ...seedEntries];
  const eligibleMatters = matters.filter((m) => m.clientId === clientId);
  const eligibleEntries = allEntries.filter(
    (e) => eligibleMatters.some((m) => m.id === e.matterId) && !e.nonBillable
  );
  const [selected, setSelected] = useState<Set<string>>(new Set(eligibleEntries.map((e) => e.id)));
  const [issuing, setIssuing] = useState(false);

  const selectedEntries = eligibleEntries.filter((e) => selected.has(e.id));
  const subtotal = selectedEntries.reduce((a, e) => {
    const m = matterById(e.matterId)!;
    return a + (m.rate * e.durationSec) / 3600;
  }, 0);
  const tax = 0;
  const total = subtotal + tax;
  const client = clientById(clientId)!;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <AdminShell
      title="New Invoice"
      subtitle={`Generate an invoice for ${client?.name}`}
      action={
        <button
          disabled={issuing || selectedEntries.length === 0}
          onClick={() => {
            setIssuing(true);
            setTimeout(() => router.push('/admin/invoices/inv_hero'), 900);
          }}
          className="bg-accent hover:bg-accent-dim disabled:opacity-50 text-white font-semibold text-sm px-4 py-2.5 rounded-lg">
          {issuing ? 'Generating…' : 'Issue Invoice →'}
        </button>
      }>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Client</h3>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setSelected(new Set());
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg text-sm font-medium">
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="font-semibold">Eligible entries</h3>
                <p className="text-xs text-fg-muted mt-0.5">Approved, billable entries for this client</p>
              </div>
              <button
                onClick={() => setSelected(new Set(eligibleEntries.map((e) => e.id)))}
                className="text-xs font-semibold text-accent hover:underline">
                Select all
              </button>
            </div>
            <div className="divide-y divide-border">
              {eligibleEntries.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-fg-muted">
                  No eligible entries — approve some first.
                </div>
              )}
              {eligibleEntries.map((e) => {
                const m = matterById(e.matterId)!;
                const amount = (m.rate * e.durationSec) / 3600;
                return (
                  <label key={e.id} className="flex items-center gap-4 px-5 py-3 hover:bg-bg/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.has(e.id)}
                      onChange={() => toggle(e.id)}
                      className="w-4 h-4 accent-[#22C55E]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{m.shortName}</div>
                      <div className="text-xs text-fg-muted truncate">{e.description}</div>
                    </div>
                    <div className="text-sm text-fg-muted tabular-nums">{formatDuration(e.durationSec)}</div>
                    <div className="text-sm font-bold w-24 text-right tabular-nums">{formatMoney(amount)}</div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <Row label="Selected entries" value={String(selectedEntries.length)} />
              <Row label="Subtotal" value={formatMoney(subtotal)} />
              <Row label="Tax" value={formatMoney(tax)} />
              <div className="border-t border-border my-3" />
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-accent">{formatMoney(total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Dates</h3>
            <div className="space-y-3 text-sm">
              <Row label="Issue date" value={formatDate(Date.now())} />
              <Row label="Due date" value={formatDate(Date.now() + 30 * 24 * 3600 * 1000)} />
              <Row label="Terms" value="Net 30" />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-fg-muted">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
