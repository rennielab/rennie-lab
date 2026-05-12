'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { AdminShell } from '@/components/AdminShell';
import {
  clientById,
  contactById,
  contacts as allContacts,
  formatDuration,
  formatHours,
  formatMoney,
  lawyerById,
  matterById,
  seedEntries,
} from '@/lib/mock';

export default function MatterDetail() {
  const params = useParams<{ id: string }>();
  const matter = matterById(params.id);
  if (!matter) {
    return (
      <AdminShell title="Matter">
        <p>Not found</p>
      </AdminShell>
    );
  }
  const client = clientById(matter.clientId)!;
  const entries = seedEntries.filter((e) => e.matterId === matter.id);
  const hours = entries.reduce((a, e) => a + e.durationSec, 0);
  const billable = entries.filter((e) => !e.nonBillable).reduce((a, e) => a + (matter.rate * e.durationSec) / 3600, 0);
  const matterContacts = allContacts.filter((c) => c.matterId === matter.id);

  return (
    <AdminShell
      title={matter.shortName}
      subtitle={`${client.name} · $${matter.rate}/hr`}
      action={
        <Link
          href="/admin/invoices/new"
          className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg">
          Generate Invoice
        </Link>
      }>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Stat label="Hours logged" value={formatHours(hours)} />
        <Stat label="Billable amount" value={formatMoney(billable)} accent />
        <Stat label="Entries" value={String(entries.length)} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-card border border-border rounded-2xl">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold">Time entries</h3>
          </div>
          <div className="divide-y divide-border">
            {entries.map((e) => {
              const law = lawyerById(e.lawyerId)!;
              const c = e.contactId ? contactById(e.contactId) : undefined;
              return (
                <Link key={e.id} href={`/admin/entries/${e.id}`} className="flex items-center gap-4 px-6 py-3 hover:bg-bg/50">
                  <div className="w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center text-accent text-xs font-bold">
                    {law.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {c ? `${c.firstName} ${c.lastName}` : e.description.slice(0, 60)}
                    </div>
                    <div className="text-xs text-fg-muted">{law.name} · {new Date(e.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatDuration(e.durationSec)}</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      e.status === 'approved' ? 'bg-accent-soft text-accent-dark' : 'bg-warning-soft text-warning'
                    }`}>
                    {e.status}
                  </span>
                </Link>
              );
            })}
            {entries.length === 0 && (
              <div className="px-6 py-10 text-center text-fg-muted text-sm">No entries yet</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Client</h3>
            <div className="text-sm font-semibold">{client.name}</div>
            <div className="text-xs text-fg-muted">{matterContacts.length} contacts</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Contacts</h3>
            <div className="space-y-2">
              {matterContacts.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-soft text-accent text-xs flex items-center justify-center font-semibold">
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.firstName} {c.lastName}</div>
                    <div className="text-xs text-fg-muted truncate">{c.phone}</div>
                  </div>
                </div>
              ))}
              {matterContacts.length === 0 && <div className="text-xs text-fg-muted">No contacts</div>}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="text-xs text-fg-muted">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ? 'text-accent' : ''}`}>{value}</div>
    </div>
  );
}
