'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AdminShell } from '@/components/AdminShell';
import { EntryDetailPanel } from '@/components/EntryDetailPanel';
import { SidePanel } from '@/components/SidePanel';
import {
  clientById,
  contactById,
  formatDuration,
  heroEntry,
  matterById,
  seedEntries,
  type TimeEntry,
} from '@/lib/mock';

const AVATAR_TINTS: Record<string, { bg: string; fg: string }> = {
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  B: { bg: '#FEF3C7', fg: '#92400E' },
  C: { bg: '#FED7AA', fg: '#9A3412' },
  D: { bg: '#DBEAFE', fg: '#1D4ED8' },
  N: { bg: '#E0E7FF', fg: '#4338CA' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  V: { bg: '#DCFCE7', fg: '#166534' },
};

function ClientAvatar({ initial }: { initial: string }) {
  const tint = AVATAR_TINTS[initial] ?? { bg: '#F3F4F6', fg: '#4B5563' };
  return (
    <span
      style={{ background: tint.bg, color: tint.fg }}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs shrink-0">
      {initial}
    </span>
  );
}

export default function Entries() {
  const router = useRouter();
  const [entries, setEntries] = useState<TimeEntry[]>(seedEntries);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  // Hero entry "arrives" 2.4s after mount
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

  // Group entries by date label
  const groups = useMemo(() => {
    const buckets = new Map<string, TimeEntry[]>();
    for (const e of entries) {
      const d = new Date(e.createdAt);
      const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      if (!buckets.has(label)) buckets.set(label, []);
      buckets.get(label)!.push(e);
    }
    return Array.from(buckets.entries()).map(([label, list]) => ({
      label,
      list: list.sort((a, b) => a.createdAt - b.createdAt),
    }));
  }, [entries]);

  const selected = entries.find((e) => e.id === selectedId);
  const pendingCount = entries.filter((e) => e.status === 'pending').length;

  const fmtTime = (ms: number) =>
    new Date(ms).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <AdminShell
      title="Time Entries"
      subtitle="Review and approve time submitted by your team."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2">
          <span className="text-base">+</span> New Entry
        </button>
      }>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <button className="w-10 h-10 rounded-lg border border-border bg-card hover:bg-bg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1 bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search entries…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle"
          />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Filter
        </button>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="18" stroke="currentColor" strokeWidth="1.8" />
            <rect x="14" y="3" width="7" height="18" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          Columns
        </button>
        {pendingCount > 0 && (
          <button className="px-3 h-10 rounded-lg bg-accent text-white text-sm font-semibold flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Confirm All ({pendingCount})
          </button>
        )}
        <div className="flex bg-card border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setView('list')}
            className={`px-3 h-10 text-sm font-medium flex items-center gap-1.5 ${
              view === 'list' ? 'bg-bg text-accent' : 'text-fg-muted'
            }`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-3 h-10 text-sm font-medium flex items-center gap-1.5 ${
              view === 'calendar' ? 'bg-bg text-accent' : 'text-fg-muted'
            }`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Calendar
          </button>
        </div>
      </div>

      {/* Column headers (list view) */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[40px_120px_1fr_1fr_1fr_120px_140px] gap-4 px-5 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div></div>
          <div>Time</div>
          <div>Client</div>
          <div>Matter</div>
          <div>Activity</div>
          <div className="text-right">Duration</div>
          <div className="text-right">Status</div>
        </div>

        {/* Groups */}
        {groups.map((group) => (
          <div key={group.label}>
            <div className="bg-bg px-5 py-2.5 text-sm font-semibold text-fg-muted border-b border-border">
              {group.label}
            </div>
            {group.list.map((e) => {
              const m = matterById(e.matterId);
              const client = m ? clientById(m.clientId) : undefined;
              const c = e.contactId ? contactById(e.contactId) : undefined;
              const isNew = e.id === heroEntry.id && highlight === e.id;

              return (
                <button
                  key={e.id}
                  onClick={() => setSelectedId(e.id)}
                  className={`w-full grid grid-cols-[40px_120px_1fr_1fr_1fr_120px_140px] gap-4 items-center px-5 py-3 border-b border-border text-left transition hover:bg-bg/60 ${
                    isNew ? 'bg-accent-soft animate-pulse' : ''
                  } ${selectedId === e.id ? 'bg-accent-soft/50' : ''}`}>
                  <input type="checkbox" className="w-4 h-4 accent-[#22C55E]" onClick={(ev) => ev.stopPropagation()} />
                  <div className="text-sm font-medium tabular-nums">{fmtTime(e.createdAt)}</div>
                  <div className="flex items-center gap-2 min-w-0">
                    <ClientAvatar initial={client?.name[0] ?? 'C'} />
                    <span className="text-sm font-medium truncate">{client?.name ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-fg-muted">
                      <path d="M4 7h16v13H4zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    <span className="text-sm truncate">{m?.shortName ?? '—'}</span>
                    {isNew && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-accent text-white rounded font-bold">NEW</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {e.source === 'call' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent">
                        <path d="M22 16.92V20a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3.09a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-fg-muted">
                        <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M12 9v4l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    )}
                    <span className="text-sm capitalize">{e.source}{c ? ` · ${c.firstName}` : ''}</span>
                  </div>
                  <div className="text-sm font-semibold tabular-nums text-right">
                    {formatDuration(e.durationSec)}
                  </div>
                  <div className="text-right">
                    <StatusBadge status={e.status} />
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hero toast */}
      {highlight && (
        <div className="fixed bottom-6 right-6 bg-card border border-accent rounded-xl shadow-xl px-5 py-4 flex items-center gap-3 z-20">
          <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent text-lg">
            📞
          </div>
          <div>
            <div className="font-semibold text-sm">New time entry from Jordan</div>
            <div className="text-xs text-fg-muted">Reyes v. Horizon · 8m 4s · awaiting approval</div>
          </div>
        </div>
      )}

      <SidePanel open={!!selected} onClose={() => setSelectedId(null)} width={520}>
        {selected && (
          <EntryDetailPanel
            entry={selected}
            onClose={() => setSelectedId(null)}
            onApprove={() => {
              setEntries((prev) =>
                prev.map((e) => (e.id === selected.id ? { ...e, status: 'approved' as const } : e))
              );
            }}
            onGenerateInvoice={() => router.push('/admin/invoices/new')}
          />
        )}
      </SidePanel>
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: 'approved' | 'pending' | 'draft' }) {
  if (status === 'approved')
    return <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-semibold bg-accent-soft text-accent-dark">Confirmed</span>;
  if (status === 'pending')
    return <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-semibold bg-warning-soft text-warning">Pending</span>;
  return <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-semibold bg-bg text-fg-muted">Draft</span>;
}
