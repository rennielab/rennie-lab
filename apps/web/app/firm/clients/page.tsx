'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { FirmShell } from '@/components/FirmShell';
import {
  clientById,
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

  // Sophia's entries
  const myEntries = useMemo(() => seedEntries
    .filter((e) => e.lawyerId === currentFirmUser.id)
    .map((e) => ({
      ...e,
      status: (overrides[e.id]?.status as typeof e.status) ?? e.status,
      nonBillable: overrides[e.id]?.nonBillable ?? e.nonBillable,
    })), [overrides]);

  // Clients she touches = clients of matters she has entries on
  const myMatterIds = new Set(myEntries.map((e) => e.matterId));
  const myClientIds = new Set(
    Array.from(myMatterIds).map((mid) => allMatters.find((m) => m.id === mid)?.clientId).filter(Boolean) as string[],
  );
  const myClients = clients.filter((c) => myClientIds.has(c.id));

  const filtered = q ? myClients.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())) : myClients;

  return (
    <FirmShell
      title="Your clients"
      subtitle={`${myClients.length} ${myClients.length === 1 ? 'client' : 'clients'} you've worked with.`}>
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
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((c) => {
            const ci = c.name[0] ?? 'C';
            const tint = CLIENT_TINTS[ci] ?? { bg: '#F3F4F6', fg: '#4B5563' };
            const myMatters = allMatters.filter((m) => m.clientId === c.id && myMatterIds.has(m.id));
            const myEntriesForClient = myEntries.filter((e) => myMatters.some((m) => m.id === e.matterId));
            const myHours = myEntriesForClient.reduce((a, e) => a + e.durationSec, 0);
            const myBilled = myEntriesForClient.reduce((a, e) => a + entryValue(e), 0);
            const primary = contacts.find((ct) => ct.clientId === c.id);
            const lastActivity = myEntriesForClient.map((e) => e.createdAt).sort((a, b) => b - a)[0];

            return (
              <div key={c.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span style={{ background: tint.bg, color: tint.fg }} className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0">{ci}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold truncate">{c.name}</div>
                    <div className="text-xs text-fg-muted truncate">
                      {myMatters.length} {myMatters.length === 1 ? 'matter' : 'matters'}
                      {primary && ` · ${primary.firstName} ${primary.lastName}`}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <div className="text-xs text-fg-muted">Your hours</div>
                    <div className="text-base font-semibold tabular-nums mt-0.5">{formatHoursH(myHours)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-fg-muted">Your billings</div>
                    <div className="text-base font-semibold tabular-nums mt-0.5">{formatMoneyCompact(myBilled)}</div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-border">
                  {myMatters.map((m) => (
                    <Link
                      key={m.id}
                      href={`/firm/matters/${m.id}`}
                      className="flex items-center justify-between gap-2 text-sm text-fg-muted hover:text-fg group">
                      <span className="truncate">{m.shortName}</span>
                      <span className="text-xs text-fg-subtle group-hover:text-accent">Open →</span>
                    </Link>
                  ))}
                </div>

                {lastActivity && (
                  <div className="text-xs text-fg-subtle mt-3 pt-3 border-t border-border">
                    Last activity {new Date(lastActivity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </FirmShell>
  );
}
