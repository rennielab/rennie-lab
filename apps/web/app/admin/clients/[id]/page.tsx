'use client';

// Client detail — the deeper client history Dana asked for (2026-05-26).
// One page per client: relationship summary, matters, contacts, recent
// time entries, and invoice history.

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { AdminShell } from '@/components/AdminShell';
import {
  clientById,
  contacts,
  entryValue,
  formatHoursH,
  formatMoneyCompact,
  lawyerById,
  MATTER_LEAD,
  MATTER_STAGE,
  matters,
  seedEntries,
} from '@/lib/mock';

const CLIENT_TINTS: Record<string, { bg: string; fg: string }> = {
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  N: { bg: '#DBEAFE', fg: '#1D4ED8' },
  V: { bg: '#DCFCE7', fg: '#166534' },
};

// Same per-client demo metadata used on the index page.
const CLIENT_META: Record<string, { retainedDate: string; portalEnabled: boolean; status: 'Active' | 'Archived'; outstanding: number }> = {
  cli_acme: { retainedDate: '12 Feb 2025', portalEnabled: true, status: 'Active', outstanding: 1900 },
  cli_reyes: { retainedDate: '18 Jul 2025', portalEnabled: true, status: 'Active', outstanding: 0 },
  cli_north: { retainedDate: '05 Jan 2026', portalEnabled: false, status: 'Archived', outstanding: 0 },
  cli_vert: { retainedDate: '22 Sep 2024', portalEnabled: false, status: 'Active', outstanding: 0 },
};

// Invoice history scoped per client (mirrors /admin/invoices mock data).
const CLIENT_INVOICES: Record<string, { number: string; amount: number; status: 'paid' | 'sent' | 'overdue' | 'partial'; issued: string }[]> = {
  cli_acme: [
    { number: 'INV-008', amount: 700, status: 'sent', issued: 'Mar 2026' },
    { number: 'INV-007', amount: 1200, status: 'overdue', issued: 'Mar 2026' },
  ],
  cli_reyes: [{ number: 'INV-006', amount: 1300, status: 'paid', issued: 'Mar 2026' }],
  cli_north: [{ number: 'INV-005', amount: 1500, status: 'partial', issued: 'Mar 2026' }],
  cli_vert: [],
};

export default function ClientDetail() {
  const params = useParams<{ id: string }>();
  const client = clientById(params.id);

  if (!client) {
    return (
      <AdminShell title="Client not found" subtitle="">
        <Link href="/admin/clients" className="text-accent text-sm font-medium hover:underline">
          ← Back to clients
        </Link>
      </AdminShell>
    );
  }

  const meta = CLIENT_META[client.id] ?? { retainedDate: '—', portalEnabled: false, status: 'Active' as const, outstanding: 0 };
  const tint = CLIENT_TINTS[client.name[0]] ?? { bg: '#F3F4F6', fg: '#4B5563' };
  const clientMatters = matters.filter((m) => m.clientId === client.id);
  const clientContacts = contacts.filter((c) => c.clientId === client.id);
  const clientEntries = seedEntries
    .filter((e) => clientMatters.some((m) => m.id === e.matterId))
    .sort((a, b) => b.createdAt - a.createdAt);
  const totalSec = clientEntries.reduce((a, e) => a + e.durationSec, 0);
  const totalValue = clientEntries.reduce((a, e) => a + entryValue(e), 0);
  const invoices = CLIENT_INVOICES[client.id] ?? [];

  return (
    <AdminShell
      title={client.name}
      subtitle={`Client since ${meta.retainedDate} · ${clientMatters.length} ${clientMatters.length === 1 ? 'matter' : 'matters'}`}
      action={
        <Link
          href="/admin/clients"
          className="h-10 px-4 rounded-lg border border-border text-sm font-medium inline-flex items-center hover:bg-bg">
          ← All clients
        </Link>
      }>
      {/* Identity strip */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-4 flex items-center gap-4">
        <span
          style={{ background: tint.bg, color: tint.fg }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0">
          {client.name[0]}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-semibold">{client.name}</div>
          <div className="text-sm text-fg-muted flex items-center gap-3 mt-0.5">
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                meta.status === 'Active' ? 'bg-accent-soft text-accent-dark' : 'bg-bg text-fg-muted'
              }`}>
              {meta.status}
            </span>
            <span
              className={`px-2 py-0.5 text-xs rounded-md border font-semibold ${
                meta.portalEnabled ? 'border-accent text-accent-dark bg-accent-soft/50' : 'border-border text-fg-muted bg-bg'
              }`}>
              Portal {meta.portalEnabled ? 'enabled' : 'disabled'}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Stat label="Lifetime hours" value={formatHoursH(totalSec)} />
          <Stat label="Lifetime billed" value={formatMoneyCompact(totalValue)} />
          <Stat
            label="Outstanding"
            value={meta.outstanding > 0 ? formatMoneyCompact(meta.outstanding) : '—'}
            tone={meta.outstanding > 0 ? 'warn' : undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Matters */}
        <div className="col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-3 border-b border-border text-sm font-semibold">Matters</div>
          {clientMatters.map((m) => {
            const lead = lawyerById(MATTER_LEAD[m.id] ?? '');
            const mSec = clientEntries.filter((e) => e.matterId === m.id).reduce((a, e) => a + e.durationSec, 0);
            const stage = MATTER_STAGE[m.id] ?? 'Active';
            return (
              <Link
                key={m.id}
                href="/admin/matters"
                className="flex items-center gap-3 px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/50">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{m.name}</div>
                  <div className="text-xs text-fg-muted mt-0.5">
                    {lead ? `Lead: ${lead.name}` : '—'} · ${m.rate}/hr
                  </div>
                </div>
                <div className="text-sm tabular-nums text-fg-muted">{formatHoursH(mSec)}</div>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    stage === 'Active'
                      ? 'bg-accent-soft text-accent-dark'
                      : stage === 'On Hold'
                        ? 'bg-warning-soft text-warning'
                        : stage === 'Closed'
                          ? 'bg-bg text-fg-muted'
                          : 'bg-accent-soft/50 text-accent-dark'
                  }`}>
                  {stage}
                </span>
              </Link>
            );
          })}
          {clientMatters.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-fg-muted">No matters yet.</div>
          )}
        </div>

        {/* Contacts */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-3 border-b border-border text-sm font-semibold">Contacts</div>
          {clientContacts.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-6 py-3 border-b border-border last:border-0">
              <span className="w-8 h-8 rounded-full bg-bg flex items-center justify-center text-xs font-bold text-fg-muted shrink-0">
                {c.initials}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {c.firstName} {c.lastName}
                </div>
                <div className="text-xs text-fg-muted truncate">{c.phone}</div>
              </div>
            </div>
          ))}
          {clientContacts.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-fg-muted">No contacts.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
        {/* Recent time */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-semibold">Recent time</span>
            <Link href="/admin/entries" className="text-xs font-medium text-accent hover:underline">
              All entries →
            </Link>
          </div>
          {clientEntries.slice(0, 5).map((e) => {
            const law = lawyerById(e.lawyerId);
            return (
              <div key={e.id} className="px-6 py-3 border-b border-border last:border-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm truncate flex-1">{e.description}</div>
                  <div className="text-sm font-semibold tabular-nums shrink-0">{formatHoursH(e.durationSec)}</div>
                </div>
                <div className="text-xs text-fg-muted mt-0.5">{law?.name}</div>
              </div>
            );
          })}
          {clientEntries.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-fg-muted">No time logged yet.</div>
          )}
        </div>

        {/* Invoices */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-semibold">Invoices</span>
            <Link href="/admin/invoices" className="text-xs font-medium text-accent hover:underline">
              All invoices →
            </Link>
          </div>
          {invoices.map((inv) => (
            <div key={inv.number} className="flex items-center gap-3 px-6 py-3 border-b border-border last:border-0">
              <div className="flex-1">
                <div className="text-sm font-semibold">{inv.number}</div>
                <div className="text-xs text-fg-muted">{inv.issued}</div>
              </div>
              <div className="text-sm font-semibold tabular-nums">${inv.amount.toLocaleString()}</div>
              <InvoicePill status={inv.status} />
            </div>
          ))}
          {invoices.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-fg-muted">No invoices yet.</div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'warn' }) {
  return (
    <div className="text-right">
      <div className="text-xs text-fg-muted">{label}</div>
      <div className={`text-xl font-semibold tabular-nums tracking-tight ${tone === 'warn' ? 'text-warning' : ''}`}>{value}</div>
    </div>
  );
}

function InvoicePill({ status }: { status: 'paid' | 'sent' | 'overdue' | 'partial' }) {
  const map = {
    paid: { bg: '#DCFCE7', fg: '#166534', label: 'Paid' },
    sent: { bg: '#FED7AA', fg: '#9A3412', label: 'Sent' },
    overdue: { bg: '#FEE2E2', fg: '#B91C1C', label: 'Overdue' },
    partial: { bg: '#DBEAFE', fg: '#1D4ED8', label: 'Partial' },
  } as const;
  const s = map[status];
  return (
    <span style={{ background: s.bg, color: s.fg }} className="px-2 py-0.5 text-xs rounded-full font-semibold">
      {s.label}
    </span>
  );
}
