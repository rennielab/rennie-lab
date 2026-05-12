'use client';

import Link from 'next/link';

import { AdminShell } from '@/components/AdminShell';
import { clientById, formatHours, matters, seedEntries } from '@/lib/mock';

export default function Matters() {
  return (
    <AdminShell
      title="Matters"
      subtitle="All active client matters at your firm."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg">
          + New Matter
        </button>
      }>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg border-b border-border text-fg-muted">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Matter</th>
              <th className="px-6 py-3 text-left font-semibold">Client</th>
              <th className="px-6 py-3 text-right font-semibold">Rate</th>
              <th className="px-6 py-3 text-right font-semibold">Hours logged</th>
              <th className="px-6 py-3 text-right font-semibold">Last activity</th>
              <th className="px-6 py-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {matters.map((m) => {
              const client = clientById(m.clientId);
              const hours = seedEntries.filter((e) => e.matterId === m.id).reduce((a, e) => a + e.durationSec, 0);
              const lastActivity = Math.max(...seedEntries.filter((e) => e.matterId === m.id).map((e) => e.createdAt), 0);
              return (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-6 py-4">
                    <Link href={`/admin/matters/${m.id}`} className="font-semibold hover:text-accent">
                      {m.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-fg-muted">{client?.name}</td>
                  <td className="px-6 py-4 text-right font-semibold tabular-nums">${m.rate}/hr</td>
                  <td className="px-6 py-4 text-right tabular-nums">{hours ? formatHours(hours) : '—'}</td>
                  <td className="px-6 py-4 text-right text-fg-muted">
                    {lastActivity ? new Date(lastActivity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-accent-soft text-accent-dark font-semibold">
                      Active
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
