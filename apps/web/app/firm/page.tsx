'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AddEntrySlideOut } from '@/components/AddEntrySlideOut';
import { FirmShell } from '@/components/FirmShell';
import {
  clientById,
  currentFirmUser,
  entryValue,
  formatHoursH,
  formatMoneyCompact,
  matterById,
  matters,
  seedEntries,
} from '@/lib/mock';
import { useEntryOverrides } from '@/lib/adminState';
import {
  submitAllDrafts,
  toggleMatterPin,
  useFirmDrafts,
  usePinnedMatterIds,
} from '@/lib/firmState';

const dayMs = 24 * 60 * 60 * 1000;
const WEEKLY_TARGET_HOURS = 35;

function startOf(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
function startOfWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = (day + 6) % 7; // Monday-start
  return startOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff));
}

export default function FirmDashboard() {
  const overrides = useEntryOverrides();
  const drafts = useFirmDrafts();
  const pinned = usePinnedMatterIds();
  const [addOpen, setAddOpen] = useState(false);
  const [addDefault, setAddDefault] = useState<string | undefined>(undefined);

  // Scope everything to Sophia
  const myEntries = seedEntries
    .filter((e) => e.lawyerId === currentFirmUser.id)
    .map((e) => ({
      ...e,
      status: (overrides[e.id]?.status as typeof e.status) ?? e.status,
      nonBillable: overrides[e.id]?.nonBillable ?? e.nonBillable,
    }));

  const sow = startOfWeek();
  const today = startOf(new Date());
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const som = startOf(thisMonth);

  const todaySec = myEntries.filter((e) => e.createdAt >= today).reduce((a, e) => a + e.durationSec, 0);
  const weekSec = myEntries.filter((e) => e.createdAt >= sow).reduce((a, e) => a + e.durationSec, 0);
  const monthSec = myEntries.filter((e) => e.createdAt >= som).reduce((a, e) => a + e.durationSec, 0);
  const monthBillableSec = myEntries.filter((e) => e.createdAt >= som && !e.nonBillable).reduce((a, e) => a + e.durationSec, 0);
  const monthBilled = myEntries.filter((e) => e.createdAt >= som).reduce((a, e) => a + entryValue(e), 0);
  const pendingCount = myEntries.filter((e) => e.status === 'pending').length;
  const rejectedCount = myEntries.filter((e) => (e.status as string) === 'rejected').length;

  const weekTargetSec = WEEKLY_TARGET_HOURS * 3600;
  const weekProgress = Math.min(1, weekSec / weekTargetSec);

  // My pinned matters (scoped to ones Sophia has entries on too, in case data drifts)
  const myMatterIds = Array.from(new Set(myEntries.map((e) => e.matterId)));
  const pinnedList = matters.filter((m) => pinned.has(m.id) || myMatterIds.includes(m.id));

  // Last 7 days for Sophia
  const days: { label: string; sec: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const end = Date.now() - i * dayMs + dayMs;
    const start = end - dayMs;
    const sec = myEntries.filter((e) => e.createdAt >= start && e.createdAt < end).reduce((a, e) => a + e.durationSec, 0);
    const d = new Date(start);
    days.push({ label: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, sec });
  }

  function openAddFor(matterId?: string) {
    setAddDefault(matterId);
    setAddOpen(true);
  }

  return (
    <FirmShell
      title={`Welcome back, ${currentFirmUser.name.split(' ')[0]}`}
      subtitle="Here's your time at a glance — and what needs logging."
      action={
        <button
          onClick={() => openAddFor()}
          className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> Add Entry
        </button>
      }>
      {/* Hero: this week + utilization */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs text-fg-muted">Today</div>
          <div className="text-3xl font-semibold tabular-nums tracking-tight mt-1">{formatHoursH(todaySec)}</div>
          <div className="text-xs text-fg-muted mt-2">{myEntries.filter((e) => e.createdAt >= today).length} entries logged</div>
        </div>
        <div className="bg-card border border-accent/40 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs text-fg-muted">This week</div>
            <div className="text-xs text-fg-muted">target {WEEKLY_TARGET_HOURS}h</div>
          </div>
          <div className="text-3xl font-semibold tabular-nums tracking-tight mt-1">{formatHoursH(weekSec)}</div>
          <div className="mt-3 h-1.5 bg-bg rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${weekProgress * 100}%` }} />
          </div>
          <div className="text-xs text-fg-muted mt-1.5 flex items-center justify-between">
            <span>{Math.round(weekProgress * 100)}% of weekly target</span>
            <span>{formatHoursH(Math.max(0, weekTargetSec - weekSec))} to go</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs text-fg-muted">This month</div>
          <div className="text-3xl font-semibold tabular-nums tracking-tight mt-1">{formatHoursH(monthSec)}</div>
          <div className="text-xs text-fg-muted mt-2">
            <span className="text-accent-dark font-semibold">{formatMoneyCompact(monthBilled)}</span> billable
            <span className="ml-2">· {formatHoursH(monthBillableSec)}</span>
          </div>
        </div>
      </div>

      {/* Drafts / rejections strip */}
      {(drafts.length > 0 || rejectedCount > 0 || pendingCount > 0) && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <ActionCard
            tone={drafts.length > 0 ? 'accent' : 'ok'}
            count={drafts.length}
            label="Drafts saved"
            sub={drafts.length === 0 ? 'Nothing waiting to submit' : 'Submit so partners can approve'}
            cta={drafts.length > 0 ? 'Submit all →' : undefined}
            onCta={() => submitAllDrafts()}
            href="/firm/time?tab=drafts"
          />
          <ActionCard
            tone={pendingCount > 0 ? 'warn' : 'ok'}
            count={pendingCount}
            label="Awaiting approval"
            sub={pendingCount === 0 ? 'No entries pending review' : `Waiting on Marcus to confirm`}
            href="/firm/time?tab=pending"
          />
          <ActionCard
            tone={rejectedCount > 0 ? 'danger' : 'ok'}
            count={rejectedCount}
            label="Sent back to you"
            sub={rejectedCount === 0 ? 'Nothing to fix' : 'Review comment, edit, resubmit'}
            href="/firm/time?tab=rejected"
            cta={rejectedCount > 0 ? 'Fix →' : undefined}
          />
        </div>
      )}

      {/* My matters quick-log */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold">Your matters</div>
            <div className="text-xs text-fg-muted mt-0.5">One click to log time against any matter you touch.</div>
          </div>
          <Link href="/firm/matters" className="text-xs font-medium text-accent inline-flex items-center gap-1">
            View all
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {pinnedList.slice(0, 4).map((m) => {
            const c = clientById(m.clientId);
            const mySec = myEntries.filter((e) => e.matterId === m.id).reduce((a, e) => a + e.durationSec, 0);
            return (
              <div key={m.id} className="border border-border rounded-xl p-4 hover:border-accent transition flex items-center gap-3">
                <button
                  onClick={() => toggleMatterPin(m.id)}
                  className="text-fg-subtle hover:text-warning"
                  title={pinned.has(m.id) ? 'Unpin' : 'Pin'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={pinned.has(m.id) ? '#F59E0B' : 'none'}>
                    <path d="M12 17v5M5 9.5l7 1.5 7-1.5L17 7l-2-4-3 1-3-1-2 4-2 2.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="flex-1 min-w-0">
                  <Link href={`/firm/matters/${m.id}`} className="text-sm font-semibold truncate block hover:text-accent">{m.shortName}</Link>
                  <div className="text-xs text-fg-muted truncate">{c?.name} · {formatHoursH(mySec)} logged · ${m.rate}/hr</div>
                </div>
                <button
                  onClick={() => openAddFor(m.id)}
                  className="h-8 px-3 rounded-lg bg-accent hover:bg-accent-dim text-white text-xs font-semibold">
                  Log time
                </button>
              </div>
            );
          })}
          {pinnedList.length === 0 && (
            <div className="col-span-2 text-sm text-fg-muted text-center py-6">
              No matters yet — Marcus needs to assign you.
            </div>
          )}
        </div>
      </div>

      {/* Hours chart + recent entries */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-sm font-semibold">Your hours this week</div>
              <div className="text-xs text-fg-muted mt-0.5">Total <span className="text-fg font-semibold">{formatHoursH(days.reduce((a, x) => a + x.sec, 0))}</span></div>
            </div>
          </div>
          <AutoScaleBarChart series={days} />
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-sm font-semibold mb-1">Recent entries</div>
          <div className="text-xs text-fg-muted mb-4">Your latest logged time</div>
          <div className="space-y-3">
            {[...myEntries].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5).map((e) => {
              const m = matterById(e.matterId);
              return (
                <div key={e.id} className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                    e.source === 'call' ? 'bg-accent-soft text-accent-dark' : 'bg-bg text-fg-muted'
                  }`}>
                    {e.source === 'call' ? <Phone /> : <ClockSm />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-fg truncate">{m?.shortName}</div>
                    <div className="text-xs text-fg-muted">{formatHoursH(e.durationSec)} · <StatusInline status={e.status} /></div>
                  </div>
                </div>
              );
            })}
            {myEntries.length === 0 && (
              <div className="text-sm text-fg-muted text-center py-4">No entries yet. Hit + Add Entry.</div>
            )}
          </div>
        </div>
      </div>

      <AddEntrySlideOut open={addOpen} onClose={() => setAddOpen(false)} defaultMatterId={addDefault} />
    </FirmShell>
  );
}

function ActionCard({ tone, count, label, sub, href, cta, onCta }: {
  tone: 'ok' | 'warn' | 'danger' | 'accent';
  count: number;
  label: string;
  sub: string;
  href: string;
  cta?: string;
  onCta?: () => void;
}) {
  const map = {
    ok: { ring: 'border-border', tile: 'bg-bg text-fg-muted' },
    warn: { ring: 'border-warning/40', tile: 'bg-warning-soft text-warning' },
    danger: { ring: 'border-danger/40', tile: 'bg-danger-soft text-danger' },
    accent: { ring: 'border-accent/40', tile: 'bg-accent-soft text-accent-dark' },
  }[tone];
  return (
    <div className={`bg-card border ${map.ring} rounded-2xl p-4`}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-2xl font-semibold tabular-nums tracking-tight">{count}</div>
        {cta && (
          onCta ? (
            <button onClick={onCta} className="text-xs font-semibold text-accent hover:underline">{cta}</button>
          ) : (
            <Link href={href} className="text-xs font-semibold text-accent hover:underline">{cta}</Link>
          )
        )}
      </div>
      <div className="text-sm font-medium text-fg">{label}</div>
      <div className="text-xs text-fg-muted mt-0.5">{sub}</div>
    </div>
  );
}

function AutoScaleBarChart({ series }: { series: { label: string; sec: number }[] }) {
  const hours = series.map((s) => s.sec / 3600);
  const peak = Math.max(...hours, 0.5);
  const niceSteps = [1, 2, 3, 4, 5, 8, 10];
  const max = niceSteps.find((s) => s >= peak * 1.1) ?? Math.ceil(peak * 1.2);
  return (
    <div>
      <div className="relative h-[180px] pl-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="absolute left-10 right-0 border-t border-dashed border-border" style={{ top: `${(i / 4) * 100}%` }} />
        ))}
        {[max, (max * 3) / 4, max / 2, max / 4, 0].map((t, i) => (
          <div key={i} className="absolute left-0 w-9 text-right text-xs text-fg-subtle tabular-nums" style={{ top: `calc(${(i / 4) * 100}% - 7px)` }}>
            {Number.isInteger(t) ? `${t}h` : `${t.toFixed(1)}h`}
          </div>
        ))}
        <div className="absolute left-10 right-0 top-0 bottom-0 flex items-end gap-2 px-2">
          {hours.map((h, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <div className="w-7 bg-accent rounded-md" style={{ height: `${(h / max) * 100}%`, minHeight: h > 0 ? 4 : 0 }} title={`${h.toFixed(2)}h`} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex pl-10 mt-2">
        {series.map((s, i) => (
          <div key={i} className="flex-1 text-center text-xs text-fg-subtle tabular-nums">{s.label}</div>
        ))}
      </div>
    </div>
  );
}

function StatusInline({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    approved: { cls: 'text-accent-dark', label: 'Approved' },
    pending: { cls: 'text-warning', label: 'Pending' },
    draft: { cls: 'text-fg-muted', label: 'Draft' },
    rejected: { cls: 'text-danger', label: 'Sent back' },
  };
  const s = map[status] ?? map.draft;
  return <span className={`font-medium ${s.cls}`}>{s.label}</span>;
}

function Phone() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ClockSm() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
