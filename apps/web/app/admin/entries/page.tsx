'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import {
  contactById,
  formatDuration,
  heroEntry,
  lawyerById,
  matterById,
  seedEntries,
  TimeEntry,
} from '@/lib/mock';

export default function Entries() {
  const [entries, setEntries] = useState<TimeEntry[]>(seedEntries);
  const [highlight, setHighlight] = useState<string | null>(null);

  // The illusion: after 2.4s, the hero entry "arrives" from the lawyer's mobile submission.
  useEffect(() => {
    const t = setTimeout(() => {
      setEntries((prev) => {
        if (prev.find((e) => e.id === heroEntry.id)) return prev;
        return [heroEntry, ...prev];
      });
      setHighlight(heroEntry.id);
      const drop = setTimeout(() => setHighlight(null), 3500);
      return () => clearTimeout(drop);
    }, 2400);
    return () => clearTimeout(t);
  }, []);

  // Build day view (today). Place entries by call-time, simulated.
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const hours = Array.from({ length: 9 }, (_, i) => 8 + i); // 8 AM → 4 PM

  // Place each entry into a slot. Use createdAt for the y position, and durationSec for height.
  // For demo we'll spread today's entries pseudo-realistically.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayStart = today.getTime();
  const todayEntries = entries.slice(0, 6).map((e, idx) => {
    const startHour = [9, 10, 11, 13, 14, 15][idx] ?? 9;
    return {
      ...e,
      startMs: dayStart + startHour * 3600_000,
      blockHeight: Math.max(40, (e.durationSec / 3600) * 60),
    };
  });

  const pending = entries.filter((e) => e.status === 'pending').length;

  return (
    <AdminShell
      title="Time Entries"
      subtitle="Review and approve time submitted by your team."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition flex items-center gap-2">
          <span>+</span> New Entry
        </button>
      }>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 bg-card border border-border rounded-lg px-3 py-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search entries…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle"
          />
        </div>
        <button className="px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          Filter
        </button>
        <button className="px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          Columns
        </button>
        {pending > 0 && (
          <button className="px-3 py-2 rounded-lg bg-accent text-white text-sm font-semibold flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Confirm All ({pending})
          </button>
        )}
        <div className="flex items-center bg-card border border-border rounded-lg overflow-hidden">
          <button className="px-3 py-2 text-sm font-medium bg-bg">List</button>
          <button className="px-3 py-2 text-sm font-medium bg-card text-accent">Calendar</button>
        </div>
      </div>

      {/* Day calendar */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-border hover:bg-bg flex items-center justify-center">‹</button>
            <button className="w-8 h-8 rounded-lg border border-border hover:bg-bg flex items-center justify-center">›</button>
            <button className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-bg">Today</button>
            <span className="ml-3 font-semibold">{todayLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm">
              <option>All Team</option>
              <option>Jordan Bennett</option>
              <option>Sarah Chen</option>
            </select>
            <div className="flex bg-bg rounded-lg overflow-hidden border border-border">
              <button className="px-3 py-1.5 text-sm font-medium bg-card text-accent">Day</button>
              <button className="px-3 py-1.5 text-sm font-medium">Week</button>
            </div>
          </div>
        </div>

        <div className="flex relative" style={{ minHeight: 540 }}>
          {/* Hour gutter */}
          <div className="w-16 border-r border-border">
            {hours.map((h) => (
              <div key={h} className="h-[60px] px-2 pt-1 text-xs text-fg-muted text-right">
                {h > 12 ? h - 12 : h} {h >= 12 ? 'PM' : 'AM'}
              </div>
            ))}
          </div>
          {/* Day column */}
          <div className="flex-1 relative">
            {hours.map((h, i) => (
              <div key={h} className="h-[60px] border-b border-border/60" style={{ borderTop: i === 0 ? undefined : undefined }} />
            ))}
            {/* "now" indicator */}
            <NowLine startHour={hours[0]} />
            {/* Entry blocks */}
            {todayEntries.map((e) => {
              const m = matterById(e.matterId);
              const c = e.contactId ? contactById(e.contactId) : undefined;
              const law = lawyerById(e.lawyerId);
              const startHour = new Date(e.startMs).getHours();
              const top = (startHour - hours[0]) * 60 + 6;
              const isHero = e.id === heroEntry.id;
              const isHighlight = isHero && highlight === e.id;
              const statusColor =
                e.status === 'approved'
                  ? 'bg-entry-confirmed border-l-4 border-l-accent'
                  : 'bg-entry-pending border-l-4 border-l-warning';
              return (
                <Link
                  key={e.id}
                  href={`/admin/entries/${e.id}`}
                  className={`absolute left-2 right-2 px-3 py-2 rounded-md ${statusColor} hover:shadow-md transition-all ${
                    isHighlight ? 'animate-pulse ring-4 ring-accent/50 scale-[1.02]' : ''
                  }`}
                  style={{ top, height: e.blockHeight }}>
                  <div className="flex items-center gap-2 text-xs font-semibold truncate">
                    {e.source === 'call' && <span>📞</span>}
                    {c ? `${c.firstName} ${c.lastName}` : m?.shortName}
                    {isHero && <span className="ml-1 text-[10px] bg-accent text-white px-1.5 py-0.5 rounded">NEW</span>}
                  </div>
                  <div className="text-xs text-fg-muted truncate mt-0.5">
                    {m?.shortName} · {law?.initials} · {formatDuration(e.durationSec)}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Banner that pulses when hero entry arrives */}
      {highlight && (
        <div className="fixed bottom-6 right-6 bg-card border border-accent rounded-xl shadow-xl px-5 py-4 flex items-center gap-3 animate-[fadein_0.35s_ease-out] z-30">
          <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center">📞</div>
          <div>
            <div className="font-semibold text-sm">New time entry from Jordan</div>
            <div className="text-xs text-fg-muted">Reyes v. Horizon · 8m 4s · awaiting approval</div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function NowLine({ startHour }: { startHour: number }) {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  if (h < startHour) return null;
  const top = (h - startHour) * 60;
  return (
    <>
      <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top }}>
        <div className="h-px bg-danger w-full" />
        <div className="absolute -left-1 -top-1 w-3 h-3 rounded-full bg-danger" />
      </div>
    </>
  );
}
