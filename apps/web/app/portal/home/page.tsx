'use client';

import Link from 'next/link';
import { useState } from 'react';

import { PortalShell } from '@/components/PortalShell';
import { formatHours, formatMoneyCompact } from '@/lib/mock';
import { DEADLINES, DOCUMENTS, MATTER_STATUS, formatDueRelative } from '@/lib/portalData';
import { markInvoicePaid, useUnreadCount, usePaidInvoiceIds } from '@/lib/portalState';

// ---------- Mock outstanding invoices (kept in sync with /portal/invoices) ----------
const OUTSTANDING = [
  { id: 'inv_hero', number: 'INV-008', amount: 700, matter: 'Litigation' },
  { id: 'inv_7', number: 'INV-007', amount: 1200, matter: 'Corporate — Annual Filing', overdue: true },
  { id: 'inv_5', number: 'INV-005', amount: 1500, matter: 'IP — Patent Filing', partial: true },
];

const ACTIVE_MATTERS = [
  { id: 'm1', name: 'IP — Patent Filing', hours: 20 * 3600 + 43 * 60, billed: 5572, outstanding: 2572 },
  { id: 'm2', name: 'Corporate — Contract Review', hours: 12 * 3600 + 15 * 60, billed: 3060, outstanding: 1560 },
];

export default function PortalHome() {
  const paidIds = usePaidInvoiceIds();
  const unread = useUnreadCount();
  const [payingAll, setPayingAll] = useState(false);

  const outstandingInvoices = OUTSTANDING.filter((i) => !paidIds.has(i.id));
  const totalOutstanding = outstandingInvoices.reduce((a, i) => a + i.amount, 0);
  const overdueAmount = outstandingInvoices.filter((i) => i.overdue).reduce((a, i) => a + i.amount, 0);
  const overdueCount = outstandingInvoices.filter((i) => i.overdue).length;

  const clientDeadlines = DEADLINES.filter((d) => d.ownedBy === 'client').sort((a, b) => a.dueAt - b.dueAt);
  const allUpcoming = [...DEADLINES].sort((a, b) => a.dueAt - b.dueAt);
  const nextDeadline = allUpcoming.find((d) => d.dueAt - Date.now() > -7 * 24 * 60 * 60 * 1000);

  const needsSig = DOCUMENTS.filter((d) => d.needsSignature);

  function handlePayAll() {
    setPayingAll(true);
    setTimeout(() => {
      outstandingInvoices.forEach((i) => markInvoicePaid(i.id));
      setPayingAll(false);
    }, 1100);
  }

  return (
    <PortalShell>
      {/* Hero greeting */}
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.5px]">Welcome back, Sarah</h1>
          <p className="text-sm text-fg-muted mt-1">Here&apos;s what&apos;s happening with your matters at Bennett &amp; Hayes LLP.</p>
        </div>
        {unread > 0 && (
          <Link
            href="/portal/messages"
            className="text-sm text-accent font-medium hover:underline inline-flex items-center gap-1.5">
            {unread} new {unread === 1 ? 'update' : 'updates'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>

      {/* Top action strip — outstanding + pay all */}
      <div className="bg-card border border-border rounded-2xl px-6 py-5 mb-4 flex items-center gap-6">
        <div className="flex-1">
          <div className="text-xs text-fg-muted">Total outstanding</div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className={`text-3xl font-semibold tabular-nums tracking-tight ${totalOutstanding > 0 ? 'text-fg' : 'text-fg-muted'}`}>
              {formatMoneyCompact(totalOutstanding)}
            </span>
            <span className="text-sm text-fg-muted">
              across {outstandingInvoices.length} {outstandingInvoices.length === 1 ? 'invoice' : 'invoices'}
            </span>
          </div>
          {overdueAmount > 0 && (
            <div className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-danger">
              <span className="w-1.5 h-1.5 rounded-full bg-danger" />
              {formatMoneyCompact(overdueAmount)} overdue · {overdueCount} {overdueCount === 1 ? 'invoice' : 'invoices'}
            </div>
          )}
        </div>
        {totalOutstanding > 0 ? (
          <button
            onClick={handlePayAll}
            disabled={payingAll}
            className="h-11 px-5 rounded-[10px] bg-accent hover:bg-accent-dim text-white text-sm font-semibold transition inline-flex items-center gap-2 disabled:opacity-60">
            {payingAll ? 'Processing…' : (
              <>
                Pay all · {formatMoneyCompact(totalOutstanding)}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        ) : (
          <div className="text-sm font-medium text-accent inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Nothing due — you&apos;re all paid up.
          </div>
        )}
      </div>

      {/* 2-column main grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* LEFT — your matters + needs signature */}
        <div className="col-span-2 space-y-4">
          {/* Your matters with status lines */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold">Your matters</div>
                <div className="text-xs text-fg-muted mt-0.5">In plain English — what your firm is working on.</div>
              </div>
              <Link href="/portal/matters" className="text-xs font-medium text-accent hover:underline inline-flex items-center gap-1">
                View all
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="space-y-3">
              {ACTIVE_MATTERS.map((m) => {
                const status = MATTER_STATUS[m.id];
                return (
                  <Link
                    key={m.id}
                    href={`/portal/matters/${m.id}`}
                    className="block border border-border rounded-xl p-4 hover:border-accent transition">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="text-sm font-semibold text-fg">{m.name}</div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-fg-subtle mt-1 shrink-0">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {status && (
                      <div className="text-sm text-fg-muted leading-relaxed mb-3">
                        <span className="text-fg">{status.status}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-5 text-xs">
                      <span className="text-fg-muted">
                        Hours <span className="text-fg font-semibold tabular-nums ml-1">{formatHours(m.hours)}</span>
                      </span>
                      <span className="text-fg-muted">
                        Billed <span className="text-fg font-semibold tabular-nums ml-1">{formatMoneyCompact(m.billed)}</span>
                      </span>
                      {m.outstanding > 0 && (
                        <span className="text-fg-muted">
                          Outstanding <span className="text-warning font-semibold tabular-nums ml-1">{formatMoneyCompact(m.outstanding)}</span>
                        </span>
                      )}
                      {status && (
                        <span className="ml-auto text-fg-subtle">Updated {status.updatedAt} · {status.updatedBy}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Needs your signature */}
          {needsSig.length > 0 && (
            <div className="bg-warning-soft/40 border border-warning/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-lg bg-warning text-white flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <div className="text-sm font-semibold text-fg">Needs your signature</div>
                  <div className="text-xs text-fg-muted">{needsSig.length} {needsSig.length === 1 ? 'document' : 'documents'} waiting for you</div>
                </div>
              </div>
              <div className="space-y-2">
                {needsSig.map((d) => (
                  <Link
                    key={d.id}
                    href="/portal/documents"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-card border border-border hover:border-warning">
                    <span className="w-8 h-8 rounded-md bg-warning-soft text-warning flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-fg truncate">{d.name}</div>
                      <div className="text-xs text-fg-muted">{d.matterName} · uploaded by {d.uploadedBy}</div>
                    </div>
                    <span className="text-sm font-semibold text-warning">Review &amp; sign →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — what's coming up */}
        <div className="space-y-4">
          {/* Next deadline hero */}
          {nextDeadline && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="text-xs text-fg-muted mb-2">Next deadline</div>
              <DeadlineCard d={nextDeadline} prominent />
            </div>
          )}

          {/* What's on your plate */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">On your plate</div>
              <span className="text-xs text-fg-muted">{clientDeadlines.length}</span>
            </div>
            <div className="space-y-3">
              {clientDeadlines.map((d) => (
                <DeadlineCard key={d.id} d={d} />
              ))}
              {clientDeadlines.length === 0 && (
                <div className="text-xs text-fg-muted py-2">Nothing requires your action right now.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </PortalShell>
  );
}

function DeadlineCard({ d, prominent = false }: { d: typeof DEADLINES[number]; prominent?: boolean }) {
  const due = formatDueRelative(d.dueAt);
  const toneCls =
    due.tone === 'overdue' ? 'text-danger' :
    due.tone === 'urgent' ? 'text-warning' :
    due.tone === 'soon' ? 'text-accent-dark' :
    'text-fg-muted';
  const dotCls =
    due.tone === 'overdue' ? 'bg-danger' :
    due.tone === 'urgent' ? 'bg-warning' :
    due.tone === 'soon' ? 'bg-accent' :
    'bg-border-strong';

  return (
    <Link href={`/portal/matters/${d.matterId}`} className="block">
      <div className="flex items-start gap-3">
        <span className={`w-2 h-2 rounded-full mt-2 ${dotCls}`} />
        <div className="flex-1 min-w-0">
          <div className={`text-${prominent ? 'sm' : 'sm'} font-semibold text-fg leading-snug`}>{d.title}</div>
          <div className="flex items-center gap-2 text-xs text-fg-muted mt-1">
            <span className={`font-medium ${toneCls}`}>{due.label}</span>
            <span>·</span>
            <span className="truncate">{d.matterName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

