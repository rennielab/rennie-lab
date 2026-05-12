'use client';

import { useEffect, useMemo, useState } from 'react';

import { AddEntrySlideOut } from '@/components/AddEntrySlideOut';
import { FirmShell } from '@/components/FirmShell';
import {
  clientById,
  currentFirmUser,
  entryValue,
  formatHoursH,
  formatMoneyCompact,
  matterById,
  seedEntries,
} from '@/lib/mock';
import { useEntryOverrides } from '@/lib/adminState';
import { deleteDraft, submitDraft, useFirmDrafts } from '@/lib/firmState';

type Tab = 'all' | 'drafts' | 'pending' | 'approved' | 'rejected';

export default function FirmTime() {
  const overrides = useEntryOverrides();
  const drafts = useFirmDrafts();
  const [tab, setTab] = useState<Tab>('all');
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get('tab');
    if (t === 'drafts' || t === 'pending' || t === 'approved' || t === 'rejected' || t === 'all') setTab(t);
  }, []);

  // Sophia-only entries enriched with admin overrides
  const myEntries = useMemo(() => seedEntries
    .filter((e) => e.lawyerId === currentFirmUser.id)
    .map((e) => ({
      ...e,
      status: (overrides[e.id]?.status as typeof e.status) ?? e.status,
      nonBillable: overrides[e.id]?.nonBillable ?? e.nonBillable,
      rejectReason: overrides[e.id]?.rejectReason,
    })), [overrides]);

  const counts = {
    all: myEntries.length + drafts.length,
    drafts: drafts.length,
    pending: myEntries.filter((e) => e.status === 'pending').length,
    approved: myEntries.filter((e) => e.status === 'approved').length,
    rejected: myEntries.filter((e) => (e.status as string) === 'rejected').length,
  };

  // Group submitted entries by date
  const submittedFiltered = myEntries.filter((e) => {
    if (tab === 'all') return true;
    if (tab === 'pending') return e.status === 'pending';
    if (tab === 'approved') return e.status === 'approved';
    if (tab === 'rejected') return (e.status as string) === 'rejected';
    return false;
  });

  const showDrafts = tab === 'all' || tab === 'drafts';
  const showSubmitted = tab !== 'drafts';

  const groups = useMemo(() => {
    const buckets = new Map<string, typeof submittedFiltered>();
    for (const e of submittedFiltered) {
      const d = new Date(e.createdAt);
      const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      if (!buckets.has(label)) buckets.set(label, []);
      buckets.get(label)!.push(e);
    }
    return Array.from(buckets.entries()).map(([label, list]) => ({
      label,
      list: list.sort((a, b) => b.createdAt - a.createdAt),
      total: list.reduce((a, e) => a + e.durationSec, 0),
      value: list.reduce((a, e) => a + entryValue(e), 0),
    }));
  }, [submittedFiltered]);

  return (
    <FirmShell
      title="Your time"
      subtitle="Everything you've logged, submitted, and what's come back for revision."
      action={
        <button
          onClick={() => setAddOpen(true)}
          className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> Add Entry
        </button>
      }>
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-4">
        {(['all', 'drafts', 'pending', 'approved', 'rejected'] as const).map((k) => (
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

      {/* Drafts section */}
      {showDrafts && drafts.length > 0 && (
        <div className="bg-card border border-accent/40 rounded-2xl overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-border bg-accent-soft/30 flex items-center justify-between">
            <div className="text-sm font-semibold">Drafts saved on your device</div>
            <span className="text-xs text-fg-muted">Submit when you're ready — your partner will review.</span>
          </div>
          {drafts.map((d) => {
            const m = matterById(d.matterId);
            const c = m ? clientById(m.clientId) : undefined;
            const val = m && !d.nonBillable ? (m.rate * d.durationSec) / 3600 : 0;
            return (
              <div key={d.id} className="grid grid-cols-[80px_1fr_120px_140px_180px] gap-3 items-center px-5 py-3.5 border-b border-border last:border-0">
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center justify-center ${d.source === 'call' ? 'bg-accent-soft text-accent-dark' : 'bg-bg text-fg-muted'}`}>
                  {d.source === 'call' ? 'CALL' : 'MANUAL'}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{d.description}</div>
                  <div className="text-xs text-fg-muted">{c?.name} · {m?.shortName}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">{formatHoursH(d.durationSec)}</div>
                <div className="text-sm tabular-nums">
                  {d.nonBillable ? <span className="text-fg-subtle">Non-billable</span> : <span className="font-semibold">{formatMoneyCompact(val)}</span>}
                </div>
                <div className="flex justify-end gap-1.5">
                  <button onClick={() => deleteDraft(d.id)} className="h-8 px-3 rounded-lg border border-border text-xs font-semibold text-fg-muted hover:text-danger hover:border-danger">
                    Discard
                  </button>
                  <button onClick={() => submitDraft(d.id)} className="h-8 px-3 rounded-lg bg-accent hover:bg-accent-dim text-white text-xs font-semibold">
                    Submit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submitted entries */}
      {showSubmitted && (
        <>
          {groups.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-sm text-fg-muted">
              {tab === 'rejected' ? 'Nothing has been sent back to you. Nice.' :
                tab === 'pending' ? 'No entries awaiting approval.' :
                tab === 'approved' ? 'No approved entries yet.' :
                'No entries logged yet — hit Add Entry to start.'}
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="mb-4">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="text-sm font-medium text-fg-muted">{group.label}</div>
                  <div className="text-xs text-fg-muted tabular-nums">
                    {formatHoursH(group.total)} · <span className="font-semibold text-fg">{formatMoneyCompact(group.value)}</span>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
                  {group.list.map((e) => {
                    const m = matterById(e.matterId);
                    const c = m ? clientById(m.clientId) : undefined;
                    const val = entryValue(e);
                    const rejected = (e.status as string) === 'rejected';
                    return (
                      <div key={e.id} className={`grid grid-cols-[60px_1fr_110px_110px_120px] gap-3 items-start px-5 py-3 ${rejected ? 'bg-danger-soft/20' : ''}`}>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center justify-center mt-0.5 ${e.source === 'call' ? 'bg-accent-soft text-accent-dark' : 'bg-bg text-fg-muted'}`}>
                          {e.source === 'call' ? 'CALL' : 'MANUAL'}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-fg leading-snug">{e.description}</div>
                          <div className="text-xs text-fg-muted mt-0.5">{c?.name} · {m?.shortName}</div>
                          {rejected && e.rejectReason && (
                            <div className="mt-2 px-3 py-2 bg-danger-soft border border-danger/30 rounded-lg">
                              <div className="text-[10px] font-bold uppercase tracking-wide text-danger mb-1">Marcus's note</div>
                              <div className="text-sm text-fg leading-snug">{e.rejectReason}</div>
                              <button className="mt-2 text-xs font-semibold text-accent hover:underline">Edit and resubmit →</button>
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-semibold tabular-nums">{formatHoursH(e.durationSec)}</div>
                        <div className="text-sm tabular-nums">
                          {e.nonBillable ? <span className="text-fg-subtle">Non-billable</span> : <span className="font-semibold">{formatMoneyCompact(val)}</span>}
                        </div>
                        <div className="flex justify-end">
                          <StatusBadge status={e.status as string} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </>
      )}

      <AddEntrySlideOut open={addOpen} onClose={() => setAddOpen(false)} />
    </FirmShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    approved: { cls: 'bg-accent-soft text-accent-dark', label: 'Confirmed' },
    pending: { cls: 'bg-warning-soft text-warning', label: 'Pending' },
    draft: { cls: 'bg-bg text-fg-muted', label: 'Draft' },
    rejected: { cls: 'bg-danger-soft text-danger', label: 'Needs fix' },
  };
  const s = map[status] ?? map.draft;
  return <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${s.cls}`}>{s.label}</span>;
}
