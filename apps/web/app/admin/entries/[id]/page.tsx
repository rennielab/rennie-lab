'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import {
  clientById,
  contactById,
  formatDuration,
  formatMoney,
  heroEntry,
  lawyerById,
  matterById,
  seedEntries,
} from '@/lib/mock';

export default function EntryDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const entry = [heroEntry, ...seedEntries].find((e) => e.id === params.id) ?? heroEntry;
  const matter = matterById(entry.matterId)!;
  const client = clientById(matter.clientId)!;
  const law = lawyerById(entry.lawyerId)!;
  const contact = entry.contactId ? contactById(entry.contactId) : undefined;
  const billable = matter.rate * (entry.durationSec / 3600);
  const [approved, setApproved] = useState(entry.status === 'approved');

  return (
    <AdminShell
      title="Time Entry"
      subtitle={`${formatDuration(entry.durationSec)} · ${matter.shortName}`}
      action={
        <div className="flex items-center gap-2">
          <Link href="/admin/entries" className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg">
            Back
          </Link>
          {!approved ? (
            <button
              onClick={() => setApproved(true)}
              className="px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Approve & Confirm
            </button>
          ) : (
            <button
              onClick={() => router.push('/admin/invoices/new')}
              className="px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold">
              Generate Invoice →
            </button>
          )}
        </div>
      }>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-soft text-accent flex items-center justify-center font-bold">
                {contact ? contact.initials : law.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">
                    {contact ? `${contact.firstName} ${contact.lastName}` : matter.shortName}
                  </h2>
                  <span className="px-2 py-0.5 text-xs bg-accent-soft text-accent-dark rounded-full font-semibold flex items-center gap-1">
                    {entry.source === 'call' ? <>📞 From call</> : <>⏱ Manual</>}
                  </span>
                </div>
                <div className="text-sm text-fg-muted mt-1">{client.name}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold tabular-nums">{formatDuration(entry.durationSec)}</div>
                <div className="text-xs text-fg-muted">duration</div>
              </div>
            </div>
          </div>

          <Card title="Matter">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{matter.name}</div>
                <div className="text-sm text-fg-muted">{client.name}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">${matter.rate}/hr</div>
                <div className="text-xs text-fg-muted">billing rate</div>
              </div>
            </div>
          </Card>

          <Card title="Description" badge="AI-summarized from call transcript">
            <p className="text-sm leading-relaxed text-fg">{entry.description}</p>
          </Card>

          {entry.source === 'call' && (
            <Card title="Call recording" badge="Encrypted & retained for 30 days">
              <button className="w-full flex items-center gap-3 bg-bg rounded-xl p-4 hover:bg-bg/70 transition">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center">▶</div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">Call with {contact?.firstName} {contact?.lastName}</div>
                  <div className="text-xs text-fg-muted">{formatDuration(entry.durationSec)} · Today, 10:32 AM</div>
                </div>
                <div className="text-sm text-accent font-medium">Listen</div>
              </button>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card title="Status">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`w-2 h-2 rounded-full ${
                  approved ? 'bg-accent' : 'bg-warning'
                }`}
              />
              <span className="font-semibold capitalize">{approved ? 'Approved' : 'Pending review'}</span>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Submitted by" value={law.name} />
              <Row label="Submitted at" value="10:40 AM today" />
              {approved && <Row label="Approved by" value="Marcus Hayes" />}
              {approved && <Row label="Approved at" value="Just now" />}
            </div>
          </Card>

          <Card title="Billing">
            <Row label="Rate" value={`${formatMoney(matter.rate)}/hr`} />
            <Row label="Duration" value={formatDuration(entry.durationSec)} />
            <div className="border-t border-border my-3" />
            <div className="flex items-center justify-between font-bold">
              <span>Billable amount</span>
              <span className="text-accent text-lg">{formatMoney(billable)}</span>
            </div>
          </Card>

          {approved && (
            <div className="bg-accent-soft border border-accent rounded-2xl p-4">
              <div className="font-semibold text-accent-dark text-sm mb-1">Ready for invoicing</div>
              <p className="text-xs text-fg-muted mb-3">
                This entry can be bundled into a new invoice for {client.name}.
              </p>
              <Link
                href="/admin/invoices/new"
                className="block text-center bg-accent hover:bg-accent-dim text-white font-semibold text-sm py-2 rounded-lg">
                Generate Invoice →
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function Card({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        {badge && (
          <span className="text-[10px] uppercase tracking-wide text-accent font-semibold bg-accent-soft px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-fg-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
