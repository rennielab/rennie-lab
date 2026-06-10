'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import {
  clients,
  entryValue,
  formatDate,
  formatHoursH,
  formatMoneyCompact,
  matters,
  seedEntries,
} from '@/lib/mock';
import {
  createDraftInvoice,
  formatRelativeAdmin,
  issueDraftInvoice,
  markPaidOffline,
  sendInvoiceReminder,
  useBilledEntryIds,
  useDrafts,
  useEntryOverrides,
  useInvoiceOverrides,
} from '@/lib/adminState';

type Status = 'paid' | 'issued' | 'overdue' | 'partial' | 'draft';
type Tab = 'all' | 'overdue' | 'open' | 'paid' | 'drafts';

const CLIENT_TINTS: Record<string, { bg: string; fg: string }> = {
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  N: { bg: '#DBEAFE', fg: '#1D4ED8' },
  V: { bg: '#DCFCE7', fg: '#166534' },
};

const BASE_ROWS = [
  { id: 'inv_8', number: 'INV-008', clientId: 'cli_acme', matter: 'Litigation — Contract Dispute', hours: 5.0, amount: 700, issuedAt: Date.parse('2026-03-12'), paidAt: null as number | null, status: 'issued' as Status },
  { id: 'inv_7', number: 'INV-007', clientId: 'cli_acme', matter: 'Corporate — Annual Filing', hours: 4.5, amount: 1200, issuedAt: Date.parse('2026-03-08'), paidAt: null, status: 'overdue' as Status },
  { id: 'inv_6', number: 'INV-006', clientId: 'cli_reyes', matter: 'Corporate — M&A Advisory', hours: 4.0, amount: 1300, issuedAt: Date.parse('2026-03-03'), paidAt: Date.parse('2026-03-13'), status: 'paid' as Status },
  { id: 'inv_5', number: 'INV-005', clientId: 'cli_north', matter: 'IP — Patent Filing', hours: 5.0, amount: 1500, issuedAt: Date.parse('2026-03-05'), paidAt: Date.parse('2026-03-11'), status: 'partial' as Status },
];

export default function AdminInvoicesList() {
  const overrides = useInvoiceOverrides();
  const drafts = useDrafts();
  const [tab, setTab] = useState<Tab>('all');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Auto-open wizard if ?new=1
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('new') === '1') setWizardOpen(true);
    if (sp.get('tab') === 'overdue') setTab('overdue');
  }, []);

  const rows = BASE_ROWS.map((r) => ({
    ...r,
    status: (overrides[r.id]?.status as Status) ?? r.status,
    paidAt: overrides[r.id]?.paidAt ?? r.paidAt,
    lastReminderAt: overrides[r.id]?.lastReminderAt,
  }));

  const counts = {
    all: rows.length + drafts.length,
    overdue: rows.filter((r) => r.status === 'overdue').length,
    open: rows.filter((r) => r.status === 'issued' || r.status === 'partial').length,
    paid: rows.filter((r) => r.status === 'paid').length,
    drafts: drafts.length,
  };

  const filtered = rows.filter((r) => {
    if (tab === 'all') return true;
    if (tab === 'overdue') return r.status === 'overdue';
    if (tab === 'open') return r.status === 'issued' || r.status === 'partial';
    if (tab === 'paid') return r.status === 'paid';
    return false;
  });

  const totalBilled = rows.reduce((a, r) => a + r.amount, 0);
  const totalOutstanding = rows.filter((r) => r.status !== 'paid').reduce((a, r) => a + r.amount, 0);
  const overdueAmount = rows.filter((r) => r.status === 'overdue').reduce((a, r) => a + r.amount, 0);
  const cashCollected = rows.filter((r) => r.status === 'paid').reduce((a, r) => a + r.amount, 0);

  return (
    <AdminShell
      title="Invoices"
      subtitle="Send invoices, chase overdue balances, and reconcile payments."
      action={
        <div className="flex items-center gap-2">
          {/* Dana 2026-05-26: outstanding / unpaid status as loud pills */}
          {totalOutstanding > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-warning-soft border border-warning/40 text-warning text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
              {formatMoneyCompact(totalOutstanding)} outstanding · {counts.open + counts.overdue} unpaid
            </span>
          )}
          {overdueAmount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-danger-soft border border-danger/40 text-danger text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-danger" />
              {formatMoneyCompact(overdueAmount)} overdue
            </span>
          )}
          <button
            onClick={() => setWizardOpen(true)}
            className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
            <span className="text-base leading-none">+</span> New Invoice
          </button>
        </div>
      }>
      {/* KPIs — only show buckets that have value */}
      <div className={`grid gap-3 mb-4 ${overdueAmount > 0 ? 'grid-cols-4' : 'grid-cols-3'}`}>
        <Kpi label="Invoiced this month" value={formatMoneyCompact(totalBilled)} sub={`${rows.length} invoices · all matters`} />
        <Kpi label="Total outstanding" value={formatMoneyCompact(totalOutstanding)} sub={`${counts.open + counts.overdue} unpaid`} tone={totalOutstanding > 0 ? 'warn' : 'ok'} />
        {overdueAmount > 0 && (
          <Kpi label="Overdue" value={formatMoneyCompact(overdueAmount)} sub={`${counts.overdue} ${counts.overdue === 1 ? 'invoice' : 'invoices'}`} tone="danger" />
        )}
        <Kpi label="Cash collected" value={formatMoneyCompact(cashCollected)} sub="This month" tone="ok" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-4">
        {(['all', 'overdue', 'open', 'paid', 'drafts'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px ${
              tab === k ? 'border-accent text-accent' : 'border-transparent text-fg-muted hover:text-fg'
            }`}>
            {k === 'all' ? 'All' : k[0].toUpperCase() + k.slice(1)}
            <span className={`px-1.5 py-0.5 text-xs rounded-full ${tab === k ? 'bg-accent text-white' : 'bg-bg text-fg-muted'}`}>
              {counts[k]}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10 transition ${searchOpen ? 'ring-2 ring-accent/30' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input onFocus={() => setSearchOpen(true)} onBlur={() => setSearchOpen(false)} placeholder="Search invoices..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg">Filter</button>
      </div>

      {/* Drafts (when on All or Drafts tab) */}
      {(tab === 'all' || tab === 'drafts') && drafts.length > 0 && (
        <div className="bg-card border border-accent/40 rounded-2xl overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-border bg-accent-soft/40 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold text-fg">Drafts ({drafts.length})</span>
          </div>
          {drafts.map((d) => {
            const client = clients.find((c) => c.id === d.clientId);
            const matter = matters.find((m) => m.id === d.matterId);
            return (
              <div key={d.id} className="grid grid-cols-[120px_1fr_140px_120px_180px] gap-3 items-center px-5 py-3 border-b border-border last:border-0">
                <div className="text-sm font-semibold text-accent">{d.number}</div>
                <div className="text-sm truncate">
                  <span className="font-medium">{client?.name}</span>
                  <span className="text-fg-muted"> · {matter?.shortName}</span>
                </div>
                <div className="text-sm text-fg-muted">{d.entryIds.length} entries</div>
                <div className="text-sm font-semibold tabular-nums text-right">{formatMoneyCompact(d.subtotal)}</div>
                <div className="flex justify-end">
                  <button
                    onClick={() => issueDraftInvoice(d.id)}
                    className="h-8 px-3 rounded-lg bg-accent hover:bg-accent-dim text-white text-xs font-semibold">
                    Issue invoice →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      {tab !== 'drafts' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[100px_1.4fr_1.6fr_120px_120px_120px_140px_140px] gap-3 px-5 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
            <div>Invoice #</div>
            <div>Client</div>
            <div>Matter</div>
            <div>Issued</div>
            <div>Paid on</div>
            <div className="text-right">Amount</div>
            <div className="text-center">Status</div>
            <div className="text-right">Actions</div>
          </div>
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-fg-muted">No invoices in this view.</div>
          ) : (
            filtered.map((inv) => {
              const client = clients.find((c) => c.id === inv.clientId);
              const initial = client?.name[0] ?? 'C';
              const tint = CLIENT_TINTS[initial] ?? { bg: '#F3F4F6', fg: '#4B5563' };
              return (
                <div key={inv.id} className="grid grid-cols-[100px_1.4fr_1.6fr_120px_120px_120px_140px_140px] gap-3 items-center px-5 py-3 border-b border-border last:border-0 hover:bg-bg/40">
                  <div className="text-sm font-semibold text-accent">{inv.number}</div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span style={{ background: tint.bg, color: tint.fg }} className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                      {initial}
                    </span>
                    <span className="text-sm truncate">{client?.name}</span>
                  </div>
                  <div className="text-sm truncate">{inv.matter}</div>
                  <div className="text-sm text-fg-muted">{formatDate(inv.issuedAt)}</div>
                  <div className="text-sm text-fg-muted">{inv.paidAt ? formatDate(inv.paidAt) : '—'}</div>
                  <div className="text-sm font-semibold tabular-nums text-right">{formatMoneyCompact(inv.amount)}</div>
                  <div className="flex justify-center">
                    <InvoiceStatus status={inv.status} />
                  </div>
                  <div className="flex justify-end items-center gap-1">
                    <RowMenu inv={inv} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {wizardOpen && <IssueInvoiceWizard onClose={() => setWizardOpen(false)} />}
    </AdminShell>
  );
}

// ---------- Row actions menu (Send Reminder, Mark Paid, Download, etc) ----------

function RowMenu({ inv }: { inv: { id: string; status: Status; number: string; lastReminderAt?: number } }) {
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open && !paying) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        if (!paying) return;
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open, paying]);

  const isUnpaid = inv.status !== 'paid' && inv.status !== 'draft';

  return (
    <div className="relative flex items-center gap-1" ref={ref}>
      {inv.status === 'overdue' && (
        <button
          onClick={() => sendInvoiceReminder(inv.id)}
          title={inv.lastReminderAt ? `Last reminder ${formatRelativeAdmin(inv.lastReminderAt)}` : 'Send overdue reminder'}
          className="h-8 px-2.5 rounded-lg bg-danger hover:bg-danger/90 text-white text-xs font-semibold">
          {inv.lastReminderAt ? 'Remind again' : 'Send reminder'}
        </button>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-lg border border-border bg-card hover:bg-bg text-fg-muted flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-[200px] bg-card border border-border rounded-xl shadow-[0_20px_60px_-20px_rgba(15,20,25,0.25)] z-30 overflow-hidden">
          <MenuItem onClick={() => { setOpen(false); }} icon={<IDownload />}>Download PDF</MenuItem>
          <MenuItem onClick={() => { setOpen(false); }} icon={<IEye />}>View invoice</MenuItem>
          {isUnpaid && (
            <>
              <MenuItem onClick={() => { sendInvoiceReminder(inv.id); setOpen(false); }} icon={<IMail />}>
                {inv.lastReminderAt ? 'Send another reminder' : 'Send reminder'}
              </MenuItem>
              <MenuItem onClick={() => { setOpen(false); setPaying(true); }} icon={<ICheck />}>Mark as paid (offline)</MenuItem>
            </>
          )}
          <div className="border-t border-border" />
          <MenuItem onClick={() => { setOpen(false); }} icon={<ITrash />} danger>Void invoice</MenuItem>
        </div>
      )}
      {paying && <MarkPaidDialog invoiceId={inv.id} number={inv.number} onClose={() => setPaying(false)} />}
    </div>
  );
}

function MenuItem({ icon, children, onClick, danger }: { icon: React.ReactNode; children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-bg ${danger ? 'text-danger' : 'text-fg'}`}>
      <span className={danger ? 'text-danger' : 'text-fg-muted'}>{icon}</span>
      {children}
    </button>
  );
}

function MarkPaidDialog({ invoiceId, number, onClose }: { invoiceId: string; number: string; onClose: () => void }) {
  const [method, setMethod] = useState<'wire' | 'check' | 'cash'>('wire');
  const [note, setNote] = useState('');
  return (
    <div onClick={(e) => e.stopPropagation()} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="text-lg font-semibold mb-1">Mark {number} as paid</div>
        <p className="text-sm text-fg-muted mb-5">Use this when a client pays outside of Stripe (wire transfer, check, etc).</p>
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-fg-muted mb-2">Payment method</div>
            <div className="grid grid-cols-3 gap-2">
              {(['wire', 'check', 'cash'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`h-10 rounded-lg border text-sm font-medium capitalize ${
                    method === m ? 'border-accent bg-accent-soft text-accent-dark' : 'border-border bg-card hover:bg-bg'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="text-xs font-semibold text-fg-muted">Reference / note</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Wire ref 8842219"
              className="mt-1.5 w-full h-10 px-3 rounded-lg border border-border bg-card text-sm placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 h-10 rounded-lg border border-border text-sm font-medium">
            Cancel
          </button>
          <button
            onClick={() => {
              markPaidOffline(invoiceId, method, note);
              onClose();
            }}
            className="px-4 h-10 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold">
            Mark as paid
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Issue Invoice Wizard ----------

function IssueInvoiceWizard({ onClose }: { onClose: () => void }) {
  const overrides = useEntryOverrides();
  const billed = useBilledEntryIds();

  // Available unbilled approved entries grouped by client → matter
  const candidateEntries = seedEntries
    .map((e) => ({ ...e, status: (overrides[e.id]?.status as typeof e.status) ?? e.status, nonBillable: overrides[e.id]?.nonBillable ?? e.nonBillable }))
    .filter((e) => e.status === 'approved' && !e.nonBillable && !billed.has(e.id));

  const byMatter = useMemo(() => {
    const groups: Record<string, typeof candidateEntries> = {};
    candidateEntries.forEach((e) => {
      groups[e.matterId] = groups[e.matterId] ?? [];
      groups[e.matterId].push(e);
    });
    return groups;
  }, [candidateEntries]);

  const matterIds = Object.keys(byMatter);
  const [matterId, setMatterId] = useState<string>(matterIds[0] ?? '');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // When matter changes, select all its entries by default
  useEffect(() => {
    if (matterId && byMatter[matterId]) {
      setSelectedIds(new Set(byMatter[matterId].map((e) => e.id)));
    }
  }, [matterId]); // eslint-disable-line react-hooks/exhaustive-deps

  const matter = matters.find((m) => m.id === matterId);
  const client = matter ? clients.find((c) => c.id === matter.clientId) : undefined;
  const entries = matterId ? byMatter[matterId] ?? [] : [];
  const selectedEntries = entries.filter((e) => selectedIds.has(e.id));
  const subtotal = selectedEntries.reduce((a, e) => a + entryValue(e), 0);

  function createDraft() {
    if (!matter || selectedEntries.length === 0) return;
    createDraftInvoice({
      clientId: matter.clientId,
      matterId: matter.id,
      entryIds: Array.from(selectedIds),
      subtotal,
    });
    onClose();
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center px-6">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">New invoice from approved time</div>
            <div className="text-xs text-fg-muted mt-0.5">Pick a matter, review the entries, generate a draft.</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-bg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {matterIds.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-fg-muted">
            No approved unbilled time across any matter. Approve some entries first.
          </div>
        ) : (
          <>
            <div className="px-6 pt-5">
              <label className="block">
                <span className="text-xs font-semibold text-fg-muted">Matter</span>
                <select
                  value={matterId}
                  onChange={(e) => setMatterId(e.target.value)}
                  className="mt-1.5 w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
                  {matterIds.map((id) => {
                    const m = matters.find((x) => x.id === id);
                    const c = m ? clients.find((x) => x.id === m.clientId) : undefined;
                    return (
                      <option key={id} value={id}>
                        {c?.name} · {m?.shortName} · {byMatter[id].length} entries
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="text-xs font-semibold text-fg-muted mb-2 uppercase tracking-wide">Approved unbilled entries</div>
              <div className="border border-border rounded-xl overflow-hidden">
                {entries.map((e) => (
                  <label key={e.id} className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-bg/40 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 accent-[#22C55E]"
                      checked={selectedIds.has(e.id)}
                      onChange={() => {
                        const next = new Set(selectedIds);
                        if (next.has(e.id)) next.delete(e.id); else next.add(e.id);
                        setSelectedIds(next);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-fg leading-snug">{e.description}</div>
                      <div className="text-xs text-fg-muted mt-0.5">
                        {new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·
                        {' '}{formatHoursH(e.durationSec)} · ${matter?.rate}/hr
                      </div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums text-fg">{formatMoneyCompact(entryValue(e))}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs text-fg-muted">
                  Client: <span className="text-fg font-medium">{client?.name}</span>
                </div>
                <div className="text-xs text-fg-muted">
                  {selectedEntries.length} of {entries.length} entries selected
                </div>
              </div>
              <div className="flex items-baseline justify-between mb-4">
                <div className="text-sm text-fg-muted">Invoice subtotal</div>
                <div className="text-2xl font-semibold tabular-nums">{formatMoneyCompact(subtotal)}</div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={onClose} className="px-4 h-10 rounded-lg border border-border text-sm font-medium">
                  Cancel
                </button>
                <button
                  onClick={createDraft}
                  disabled={selectedEntries.length === 0}
                  className="px-5 h-10 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold disabled:opacity-50">
                  Create draft invoice
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- KPI + status ----------

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'warn' | 'danger' | 'ok' }) {
  const valueClass =
    tone === 'danger' ? 'text-danger' :
    tone === 'warn' ? 'text-warning' :
    'text-fg';
  return (
    <div className="bg-card border border-border rounded-2xl px-5 py-4">
      <div className="text-xs text-fg-muted">{label}</div>
      <div className={`text-2xl font-semibold mt-1 tabular-nums tracking-tight ${valueClass}`}>{value}</div>
      {sub && <div className="text-[11px] text-fg-subtle mt-0.5">{sub}</div>}
    </div>
  );
}

function InvoiceStatus({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; fg: string; label: string }> = {
    paid: { bg: '#DCFCE7', fg: '#166534', label: 'Paid' },
    issued: { bg: '#FED7AA', fg: '#9A3412', label: 'Issued' },
    overdue: { bg: '#FEE2E2', fg: '#B91C1C', label: 'Overdue' },
    partial: { bg: '#DBEAFE', fg: '#1D4ED8', label: 'Partially Paid' },
    draft: { bg: '#F3F4F6', fg: '#4B5563', label: 'Draft' },
  };
  const s = map[status];
  return <span style={{ background: s.bg, color: s.fg }} className="px-2.5 py-1 text-xs rounded-full font-semibold">{s.label}</span>;
}

// ---------- Icons ----------
function IDownload() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IEye() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>; }
function IMail() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ICheck() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ITrash() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
