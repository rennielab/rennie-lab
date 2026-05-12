'use client';

import Link from 'next/link';
import { useState } from 'react';

import { FirmShell } from '@/components/FirmShell';

// ---------- Mock data tailored for Sophia / lawyer view ----------

const MEETINGS = [
  { title: 'Deposition prep meeting with Anderson counsel', time: '9:00 AM · 01:00:00', who: 'Sarah', flag: 'accent' as const },
  { title: 'Due diligence review — Whitmore acquisition', time: '11:00 AM · 00:45:00', who: 'James', flag: 'accent' as const },
];

const RECENT = [
  { type: 'Calls', title: 'Corporate — M&A Advisory', date: '18 Mar, 2026 1:12 PM', dur: '00:42:15', who: 'Whitmore Industries', billable: true, time: '0h 42m', icon: 'phone' as const, tagColor: 'green' as const },
  { type: 'Calls', title: 'Real Estate — Lease Negotiation', date: '18 Mar, 2026 10:20 AM', dur: '00:25:10', who: '+1 (555) 091-4823', billable: true, time: '0h 25m', icon: 'phone' as const, tagColor: 'green' as const },
  { type: 'Meetings', title: 'Due diligence review — Whitmore acqu...', date: '18 Mar, 2026 11:00 AM', dur: '00:45:00', who: 'Whitmore Industries', billable: true, time: '0h 45m', icon: 'cal' as const, tagColor: 'blue' as const },
  { type: 'Calls', title: 'IP — Patent Filing', date: '18 Mar, 2026 11:45 AM', dur: '00:08:30', who: 'Chen Biotech Ltd', billable: true, time: '0h 8m', icon: 'phone' as const, tagColor: 'green' as const },
  { type: 'Meetings', title: 'Patent claims review with Chen Biotech IP team', date: '18 Mar, 2026 2:00 PM', dur: '00:30:00', who: 'Chen Biotech · Marcus', billable: true, time: '0h 30m', icon: 'cal' as const, tagColor: 'blue' as const },
  { type: 'Calls', title: 'Litigation — Contract Dispute', date: '18 Mar, 2026 2:34 PM', dur: '00:18:42', who: 'Anderson & Cole LLP', billable: true, time: '0h 18m', icon: 'phone' as const, tagColor: 'green' as const },
];

export default function FirmDashboard() {
  const [period, setPeriod] = useState<'week' | 'month'>('month');

  return (
    <FirmShell
      title="Dashboard"
      subtitle="Welcome to Clockd"
      action={
        <div className="flex items-center gap-2">
          <PeriodPicker value={period} onChange={setPeriod} />
          <button className="h-10 px-4 rounded-full bg-accent hover:bg-accent-dim text-white font-semibold text-sm transition inline-flex items-center gap-1.5">
            <span className="text-base leading-none">+</span> Add Entry
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      }>
      {/* 6 KPI cards */}
      <div className="grid grid-cols-6 gap-3">
        <Kpi icon={<IconClock />} value="1h 47m" label="Total Hours" delta="+12%" />
        <Kpi icon={<IconClock />} value="1h" label="Hours Today" />
        <Kpi icon={<IconTimer />} value="1h 47m" label="Billable Hours" delta="+12%" />
        <Kpi icon={<IconPause />} value="0h 0m" label="Non-Billable" />
        <Kpi icon={<IconHelp />} value="2" label="Unconfirmed" />
        <Kpi icon={<IconBriefcase />} value="4" label="Active Matters" />
      </div>

      {/* Hours Over Time */}
      <div className="mt-4 bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="text-sm font-semibold text-fg">Hours Over Time</div>
          <button className="text-sm text-fg-muted inline-flex items-center gap-1.5 border border-border rounded-lg px-3 h-9 hover:bg-bg">
            Weekly
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <BarChart values={[3.5, 0.8, 1.4, 3.7, 0.6, 1.5, 0]} labels={['02-02', '02-03', '02-04', '02-05', '02-06', '02-07', '02-08']} />
      </div>

      {/* Meetings + Captured */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6 min-h-[260px]">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-fg">Meetings</div>
            <Link href="#" className="text-xs font-medium text-accent inline-flex items-center gap-1">
              View All
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="space-y-3">
            {MEETINGS.map((m, i) => (
              <div key={i} className="flex items-start gap-3 pl-3 relative bg-bg/50 rounded-lg py-3 pr-4">
                <span className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-accent" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-fg truncate">{m.title}</div>
                  <div className="text-xs text-fg-muted mt-0.5">{m.time} · {m.who}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-fg-subtle mt-1">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-sm font-semibold text-fg mb-3">Manual vs Captured</div>
          <ManualCapturedDonut manual={21.5} captured={9} />
          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
              Manual <span className="font-semibold text-fg ml-1">21.5h</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Auto-Captured <span className="font-semibold text-fg ml-1">9.0h</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="mt-4 bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-fg">Recent Entries</div>
          <Link href="/firm/time" className="text-xs font-medium text-accent inline-flex items-center gap-1">
            View All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
        <div className="divide-y divide-border">
          {RECENT.map((e, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                e.icon === 'phone' ? 'bg-accent-soft text-accent' : 'bg-[#DBEAFE] text-[#1D4ED8]'
              }`}>
                {e.icon === 'phone' ? <IconPhone /> : <IconCalendar />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-fg truncate">{e.title}</div>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    e.tagColor === 'green' ? 'bg-accent-soft text-accent-dark' : 'bg-[#DBEAFE] text-[#1D4ED8]'
                  }`}>{e.type}</span>
                </div>
                <div className="text-xs text-fg-muted mt-0.5">{e.date} · {e.dur} · {e.who}</div>
              </div>
              {e.billable && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent-soft text-accent-dark">Billable</span>
              )}
              <div className="text-sm font-semibold text-fg tabular-nums w-16 text-right">{e.time}</div>
            </div>
          ))}
        </div>
      </div>
    </FirmShell>
  );
}

// ---------- Components ----------

function PeriodPicker({ value, onChange }: { value: 'week' | 'month'; onChange: (v: 'week' | 'month') => void }) {
  return (
    <button
      onClick={() => onChange(value === 'month' ? 'week' : 'month')}
      className="h-10 px-3.5 rounded-full border border-border bg-card text-sm text-fg inline-flex items-center gap-2 hover:bg-white">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="font-medium">{value === 'month' ? 'This month' : 'This week'}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function Kpi({ icon, value, label, delta }: { icon: React.ReactNode; value: string; label: string; delta?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="w-9 h-9 rounded-lg bg-bg flex items-center justify-center text-fg-muted">{icon}</div>
      <div className="flex items-baseline gap-1.5 mt-3">
        <div className="text-2xl font-semibold text-fg tabular-nums tracking-tight">{value}</div>
        {delta && (
          <span className="text-xs font-medium text-accent inline-flex items-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="mr-0.5">
              <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {delta}
          </span>
        )}
      </div>
      <div className="text-xs text-fg-muted mt-1">{label}</div>
    </div>
  );
}

function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 4);
  return (
    <div>
      <div className="relative h-[200px] pl-9">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="absolute left-9 right-0 border-t border-dashed border-border" style={{ top: `${(i / 4) * 100}%` }} />
        ))}
        {[16, 12, 8, 4, 0].map((t, i) => (
          <div key={i} className="absolute left-0 w-8 text-right text-xs text-fg-subtle tabular-nums" style={{ top: `calc(${(i / 4) * 100}% - 7px)` }}>{t}h</div>
        ))}
        <div className="absolute left-9 right-0 top-0 bottom-0 flex items-end gap-2 px-2">
          {values.map((v, i) => (
            <div key={i} className="flex-1 flex justify-center">
              <div className="w-7 bg-accent rounded-md" style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? 4 : 0 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex pl-9 mt-2">
        {labels.map((l, i) => (
          <div key={i} className="flex-1 text-center text-xs text-fg-subtle tabular-nums">{l}</div>
        ))}
      </div>
    </div>
  );
}

function ManualCapturedDonut({ manual, captured }: { manual: number; captured: number }) {
  const total = manual + captured;
  const capturedPct = captured / total;
  const manualPct = manual / total;
  const C = 2 * Math.PI * 50;
  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="w-44 h-44">
        <circle cx="60" cy="60" r="50" stroke="#1D4ED8" strokeWidth="14" fill="none" strokeDasharray={`${C * manualPct} ${C}`} transform="rotate(-90 60 60)" strokeLinecap="butt" />
        <circle cx="60" cy="60" r="50" stroke="#22C55E" strokeWidth="14" fill="none" strokeDasharray={`${C * capturedPct} ${C}`} strokeDashoffset={`-${C * manualPct}`} transform="rotate(-90 60 60)" strokeLinecap="butt" />
        <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F1419">
          {Math.round(capturedPct * 100)}%
        </text>
        <text x="60" y="76" textAnchor="middle" fontSize="10" fill="#6B7280">
          Captured
        </text>
      </svg>
    </div>
  );
}

// ---------- Icons ----------

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconTimer() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M10 2h4M12 14V8M20 14a8 8 0 11-16 0 8 8 0 0116 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconHelp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
