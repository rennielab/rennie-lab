'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { FirmShell } from '@/components/FirmShell';
import {
  clients,
  contacts,
  currentFirmUser,
  entryValue,
  formatHoursH,
  formatMoneyCompact,
  matters as allMatters,
  seedEntries,
} from '@/lib/mock';
import { useEntryOverrides } from '@/lib/adminState';

const CLIENT_TINTS: Record<string, { bg: string; fg: string }> = {
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  N: { bg: '#DBEAFE', fg: '#1D4ED8' },
  V: { bg: '#DCFCE7', fg: '#166534' },
};

export default function FirmClients() {
  const overrides = useEntryOverrides();
  const [q, setQ] = useState('');

  // Scope to Sophia's entries
  const myEntries = useMemo(() => seedEntries
    .filter((e) => e.lawyerId === currentFirmUser.id)
    .map((e) => ({
      ...e,
      status: (overrides[e.id]?.status as typeof e.status) ?? e.status,
      nonBillable: overrides[e.id]?.nonBillable ?? e.nonBillable,
    })), [overrides]);

  const myMatterIds = new Set(myEntries.map((e) => e.matterId));
  const myClientIds = new Set(
    Array.from(myMatterIds).map((mid) => allMatters.find((m) => m.id === mid)?.clientId).filter(Boolean) as string[],
  );
  const myClients = clients.filter((c) => myClientIds.has(c.id));

  const rows = myClients.map((c) => {
    const matters = allMatters.filter((m) => m.clientId === c.id && myMatterIds.has(m.id));
    const entries = myEntries.filter((e) => matters.some((m) => m.id === e.matterId));
    const hours = entries.reduce((a, e) => a + e.durationSec, 0);
    const billed = entries.reduce((a, e) => a + entryValue(e), 0);
    const primary = contacts.find((ct) => ct.clientId === c.id);
    const last = entries.map((e) => e.createdAt).sort((a, b) => b - a)[0];
    return { client: c, matters, hours, billed, primary, last };
  });

  const filtered = q ? rows.filter((r) => r.client.name.toLowerCase().includes(q.toLowerCase())) : rows;

  return (
    <FirmShell
      title="Your clients"
      subtitle={`${myClients.length} ${myClients.length === 1 ? 'client' : 'clients'} on your caseload.`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clients..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="text-sm font-semibold text-fg">No clients on your caseload yet</div>
          <div className="text-xs text-fg-muted mt-1">Once Marcus adds you to a matter, the client will appear here.</div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1.6fr_1.4fr_70px_100px_110px_120px_120px] gap-3 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
            <div>Client</div>
            <div>Primary contact</div>
            <div className="text-right">Matters</div>
            <div className="text-right">Your hours</div>
            <div className="text-right">Your billings</div>
            <div>Last activity</div>
            <div>Open matter</div>
          </div>
          {filtered.map((r) => {
            const initial = r.client.name[0];
            const tint = CLIENT_TINTS[initial] ?? { bg: '#F3F4F6', fg: '#4B5563' };
            return (
              <div key={r.client.id} className="grid grid-cols-[1.6fr_1.4fr_70px_100px_110px_120px_120px] gap-3 items-center px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/40">
                <div className="flex items-center gap-3 min-w-0">
                  <span style={{ background: tint.bg, color: tint.fg }} className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{r.client.name}</div>
                    <div className="text-xs text-fg-muted">{r.matters.length} {r.matters.length === 1 ? 'matter' : 'matters'}</div>
                  </div>
                </div>
                <div className="text-sm min-w-0">
                  {r.primary ? (
                    <>
                      <div className="font-medium text-fg truncate">{r.primary.firstName} {r.primary.lastName}</div>
                      <div className="text-xs text-fg-muted truncate">{r.primary.phone}</div>
                    </>
                  ) : <span className="text-fg-subtle">—</span>}
                </div>
                <div className="text-sm tabular-nums text-right">{r.matters.length}</div>
                <div className="text-sm tabular-nums text-right">{formatHoursH(r.hours)}</div>
                <div className="text-sm font-semibold tabular-nums text-right">{formatMoneyCompact(r.billed)}</div>
                <div className="text-sm text-fg-muted">
                  {r.last ? new Date(r.last).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                </div>
                <div className="flex flex-col gap-0.5">
                  {r.matters.map((m) => (
                    <Link key={m.id} href={`/firm/matters/${m.id}`} className="text-xs text-accent hover:underline truncate">
                      {m.shortName} →
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </FirmShell>
  );
}
