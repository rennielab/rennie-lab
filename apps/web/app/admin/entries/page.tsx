'use client';

import { useEffect, useMemo, useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import { EntryDetailPanel } from '@/components/EntryDetailPanel';
import { SidePanel } from '@/components/SidePanel';
import {
  clientById,
  contactById,
  entryValue,
  formatHoursH,
  formatMoneyCompact,
  heroEntry,
  lawyerById,
  matterById,
  seedEntries,
  type TimeEntry,
} from '@/lib/mock';
import {
  approveAllPending,
  approveEntry,
  rejectEntry,
  useBilledEntryIds,
  useEntryOverrides,
} from '@/lib/adminState';

type Tab = 'all' | 'pending' | 'approved' | 'rejected';

const AVATAR_TINTS: Record<string, { bg: string; fg: string }> = {
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  N: { bg: '#E0E7FF', fg: '#4338CA' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  V: { bg: '#DCFCE7', fg: '#166534' },
};

function ClientAvatar({ initial }: { initial: string }) {
  const tint = AVATAR_TINTS[initial] ?? { bg: '#F3F4F6', fg: '#4B5563' };
  return (
    <span style={{ background: tint.bg, color: tint.fg }} className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs shrink-0">
      {initial}
    </span>
  );
}

function LawyerAvatar({ initials }: { initials: string }) {
  const letter = initials[0] ?? 'X';
  const palette: Record<string, { bg: string; fg: string }> = {
    J: { bg: '#FFE4E6', fg: '#9F1239' }, // Jordan
    M: { bg: '#FED7AA', fg: '#9A3412' }, // Marcus
    S: { bg: '#DBEAFE', fg: '#1D4ED8' }, // Sarah/Sophia
  };
  const t = palette[letter] ?? { bg: '#F3F4F6', fg: '#4B5563' };
  return (
    <span style={{ background: t.bg, color: t.fg }} className="inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-[10px] shrink-0">
      {initials}
    </span>
  );
}

export default function Entries() {
  const overrides = useEntryOverrides();
  const billed = useBilledEntryIds();
  const [entries, setEntries] = useState<TimeEntry[]>(seedEntries);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => {
      setEntries((prev) => {
        if (prev.find((e) => e.id === heroEntry.id)) return prev;
        return [heroEntry, ...prev];
      });
      setHighlight(heroEntry.id);
      const drop = setTimeout(() => setHighlight(null), 4500);
      return () => clearTimeout(drop);
    }, 2400);
    return () => clearTimeout(t);
  }, []);

  // Apply admin overrides on top of seed data
  const enriched = useMemo(
    () =>
      entries.map((e) => ({
        ...e,
        status: (overrides[e.id]?.status as TimeEntry['status']) ?? e.status,
        description: overrides[e.id]?.description ?? e.description,
        nonBillable: overrides[e.id]?.nonBillable ?? e.nonBillable,
      })),
    [entries, overrides],
  );

  const counts = {
    all: enriched.length,
    pending: enriched.filter((e) => e.status === 'pending').length,
    approved: enriched.filter((e) => e.status === 'approved').length,
    rejected: enriched.filter((e) => (e.status as string) === 'rejected').length,
  };

  const filtered = enriched.filter((e) => {
    if (tab === 'all') return true;
    if (tab === 'pending') return e.status === 'pending';
    if (tab === 'approved') return e.status === 'approved';
    if (tab === 'rejected') return (e.status as string) === 'rejected';
    return true;
  });

  const groups = useMemo(() => {
    const buckets = new Map<string, typeof filtered>();
    for (const e of filtered) {
      const d = new Date(e.createdAt);
      const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      if (!buckets.has(label)) buckets.set(label, []);
      buckets.get(label)!.push(e);
    }
    return Array.from(buckets.entries()).map(([label, list]) => ({
      label,
      list: list.sort((a, b) => b.createdAt - a.createdAt),
    }));
  }, [filtered]);

  const selectedEntry = enriched.find((e) => e.id === selectedId);
  const pendingIdsVisible = filtered.filter((e) => e.status === 'pending').map((e) => e.id);
  const selectedIds = Array.from(selected).filter((id) => filtered.some((f) => f.id === id));
  const selectedPendingIds = selectedIds.filter((id) => enriched.find((e) => e.id === id)?.status === 'pending');

  function toggleAll() {
    if (selected.size === filtered.length && filtered.length > 0) setSelected(new Set());
    else setSelected(new Set(filtered.map((e) => e.id)));
  }

  function approveSelected() {
    approveAllPending(selectedPendingIds);
    setSelected(new Set());
  }

  function approveAllVisiblePending() {
    approveAllPending(pendingIdsVisible);
  }

  return (
    <AdminShell
      title="Time Entries"
      subtitle="Review and approve time submitted by your team."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg flex items-center gap-2">
          <span className="text-base leading-none">+</span> New Entry
        </button>
      }>
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-4">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((k) => (
          <button
            key={k}
            onClick={() => { setTab(k); setSelected(new Set()); }}
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
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search entries…" className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Filter
        </button>

        {/* Bulk action when items selected */}
        {selectedIds.length > 0 ? (
          <>
            <span className="text-sm text-fg-muted">{selectedIds.length} selected</span>
            {selectedPendingIds.length > 0 && (
              <button
                onClick={approveSelected}
                className="px-3 h-10 rounded-lg bg-accent text-white text-sm font-semibold inline-flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Approve {selectedPendingIds.length}
              </button>
            )}
          </>
        ) : (
          tab !== 'rejected' && pendingIdsVisible.length > 0 && (
            <button
              onClick={approveAllVisiblePending}
              className="px-3 h-10 rounded-lg bg-accent text-white text-sm font-semibold inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Approve all pending ({pendingIdsVisible.length})
            </button>
          )
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[36px_140px_160px_1.4fr_140px_100px_110px_120px] gap-3 px-5 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#22C55E]"
              checked={selected.size === filtered.length && filtered.length > 0}
              onChange={toggleAll}
            />
          </div>
          <div>Client</div>
          <div>Matter</div>
          <div>Description</div>
          <div>Lawyer</div>
          <div className="text-right">Duration</div>
          <div className="text-right">Value</div>
          <div className="text-right">Status</div>
        </div>

        {groups.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-fg-muted">No entries in this view.</div>
        )}

        {groups.map((group) => (
          <div key={group.label}>
            <div className="bg-bg px-5 py-2 text-xs font-semibold text-fg-muted border-b border-border">
              {group.label}
            </div>
            {group.list.map((e) => {
              const m = matterById(e.matterId);
              const client = m ? clientById(m.clientId) : undefined;
              const law = lawyerById(e.lawyerId);
              const c = e.contactId ? contactById(e.contactId) : undefined;
              const isNew = e.id === heroEntry.id && highlight === e.id;
              const isBilled = billed.has(e.id);
              const isSelected = selected.has(e.id);
              const val = entryValue(e);

              return (
                <div
                  key={e.id}
                  className={`grid grid-cols-[36px_140px_160px_1.4fr_140px_100px_110px_120px] gap-3 items-center px-5 py-3 border-b border-border last:border-0 transition ${
                    isNew ? 'bg-accent-soft animate-pulse' : isSelected ? 'bg-accent-soft/30' : 'hover:bg-bg/40'
                  }`}>
                  <div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#22C55E]"
                      checked={isSelected}
                      onChange={() => {
                        const next = new Set(selected);
                        if (next.has(e.id)) next.delete(e.id); else next.add(e.id);
                        setSelected(next);
                      }}
                    />
                  </div>
                  <button onClick={() => setSelectedId(e.id)} className="flex items-center gap-2 min-w-0 text-left">
                    <ClientAvatar initial={client?.name[0] ?? 'C'} />
                    <span className="text-sm font-medium truncate">{client?.name ?? '—'}</span>
                  </button>
                  <button onClick={() => setSelectedId(e.id)} className="text-left flex items-center gap-1.5 min-w-0">
                    <span className="text-sm truncate">{m?.shortName ?? '—'}</span>
                    {isNew && <span className="px-1.5 py-0.5 text-[10px] bg-accent text-white rounded font-bold">NEW</span>}
                  </button>
                  <button onClick={() => setSelectedId(e.id)} className="text-left min-w-0">
                    <div className="flex items-center gap-2">
                      {e.source === 'call' ? (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-accent-soft text-accent-dark shrink-0">CALL</span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-bg text-fg-muted shrink-0">MANUAL</span>
                      )}
                      <span className="text-sm text-fg truncate">
                        {c ? `${c.firstName} · ` : ''}{e.description}
                      </span>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 min-w-0">
                    {law && <LawyerAvatar initials={law.initials} />}
                    <span className="text-sm truncate" title={law?.name}>{law?.name.split(' ')[0]}</span>
                  </div>
                  <div className="text-sm font-semibold tabular-nums text-right">{formatHoursH(e.durationSec)}</div>
                  <div className="text-sm tabular-nums text-right">
                    {e.nonBillable ? (
                      <span className="text-fg-subtle">—</span>
                    ) : (
                      <span className="font-semibold text-fg">{formatMoneyCompact(val)}</span>
                    )}
                  </div>
                  <div className="text-right flex justify-end items-center gap-1.5">
                    <StatusBadge status={e.status as 'approved' | 'pending' | 'rejected' | 'draft'} />
                    {isBilled && <span className="text-[10px] font-bold text-fg-muted">·BILLED</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hero toast */}
      {highlight && (
        <div className="fixed bottom-6 right-6 bg-card border border-accent rounded-xl shadow-xl px-5 py-4 flex items-center gap-3 z-20">
          <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92V20a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3.09a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm">New time entry from Jordan</div>
            <div className="text-xs text-fg-muted">Reyes v. Horizon · 8m 4s · awaiting approval</div>
          </div>
        </div>
      )}

      <SidePanel open={!!selectedEntry} onClose={() => setSelectedId(null)} width={560}>
        {selectedEntry && (
          <EntryDetailPanel
            entry={selectedEntry}
            onClose={() => setSelectedId(null)}
            onApprove={() => approveEntry(selectedEntry.id)}
            onReject={(reason: string) => {
              rejectEntry(selectedEntry.id, reason);
              setSelectedId(null);
            }}
            onSaveEdits={(description: string, nonBillable: boolean) => {
              approveEntry(selectedEntry.id, description, nonBillable);
            }}
            onGenerateInvoice={() => { /* invoiced flow lives on invoices page */ }}
          />
        )}
      </SidePanel>
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: 'approved' | 'pending' | 'draft' | 'rejected' }) {
  const map: Record<string, { cls: string; label: string }> = {
    approved: { cls: 'bg-accent-soft text-accent-dark', label: 'Approved' },
    pending: { cls: 'bg-warning-soft text-warning', label: 'Pending' },
    draft: { cls: 'bg-bg text-fg-muted', label: 'Draft' },
    rejected: { cls: 'bg-danger-soft text-danger', label: 'Rejected' },
  };
  const s = map[status] ?? map.draft;
  return <span className={`inline-flex px-2.5 py-0.5 text-xs rounded-full font-semibold ${s.cls}`}>{s.label}</span>;
}
