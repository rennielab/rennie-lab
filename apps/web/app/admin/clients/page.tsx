'use client';

import { AdminShell } from '@/components/AdminShell';
import { clients, contacts as allContacts, matters, seedEntries } from '@/lib/mock';

export default function Clients() {
  return (
    <AdminShell
      title="Clients"
      subtitle="All clients across your firm."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg">
          + Add Client
        </button>
      }>
      <div className="grid grid-cols-2 gap-4">
        {clients.map((c) => {
          const cMatters = matters.filter((m) => m.clientId === c.id);
          const cContacts = allContacts.filter((ct) => cMatters.some((m) => m.id === ct.matterId));
          const cHours = seedEntries
            .filter((e) => cMatters.some((m) => m.id === e.matterId))
            .reduce((a, e) => a + e.durationSec, 0);
          return (
            <div key={c.id} className="bg-card border border-border rounded-2xl p-6 hover:border-accent transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center font-bold">
                  {c.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs text-fg-muted mt-1">
                    {cMatters.length} {cMatters.length === 1 ? 'matter' : 'matters'} · {cContacts.length} contacts
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                    <Pill label="Hours" value={`${(cHours / 3600).toFixed(1)}h`} />
                    <Pill label="Status" value="Active" accent />
                    <Pill label="Since" value="2024" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}

function Pill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-bg rounded-lg px-2 py-1.5">
      <div className="text-[10px] text-fg-muted">{label}</div>
      <div className={`text-xs font-semibold ${accent ? 'text-accent' : ''}`}>{value}</div>
    </div>
  );
}
