'use client';

import { FirmShell } from '@/components/FirmShell';

const ENTRIES = [
  { date: '18 Mar 2026', items: [
    { type: 'Calls', tagColor: 'green', title: 'Corporate — M&A Advisory', sub: '1:12 PM · 00:42:15 · Whitmore Industries', dur: '0h 42m', billable: true },
    { type: 'Calls', tagColor: 'green', title: 'Real Estate — Lease Negotiation', sub: '10:20 AM · 00:25:10 · +1 (555) 091-4823', dur: '0h 25m', billable: true },
    { type: 'Meetings', tagColor: 'blue', title: 'Due diligence review — Whitmore acquisition', sub: '11:00 AM · 00:45:00 · Whitmore Industries', dur: '0h 45m', billable: true },
    { type: 'Calls', tagColor: 'green', title: 'IP — Patent Filing', sub: '11:45 AM · 00:08:30 · Chen Biotech Ltd', dur: '0h 8m', billable: true },
  ] },
  { date: '17 Mar 2026', items: [
    { type: 'Meetings', tagColor: 'blue', title: 'Patent claims review with Chen Biotech IP team', sub: '2:00 PM · 00:30:00 · Chen Biotech · Marcus', dur: '0h 30m', billable: true },
    { type: 'Calls', tagColor: 'green', title: 'Litigation — Contract Dispute', sub: '2:34 PM · 00:18:42 · Anderson & Cole LLP', dur: '0h 18m', billable: true },
    { type: 'Manual', tagColor: 'gray', title: 'Drafting brief for Anderson & Cole motion', sub: '4:00 PM · 01:30:00', dur: '1h 30m', billable: true },
  ] },
];

export default function FirmTime() {
  return (
    <FirmShell title="Time Entries" subtitle="All your captured and logged time across matters." action={
      <button className="h-10 px-4 rounded-full bg-accent hover:bg-accent-dim text-white font-semibold text-sm inline-flex items-center gap-1.5">
        <span className="text-base leading-none">+</span> Add Entry
      </button>
    }>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-white">Filter</button>
      </div>

      {ENTRIES.map((g) => (
        <div key={g.date} className="mb-4">
          <div className="text-sm font-medium text-fg-muted mb-2 pl-1">{g.date}</div>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {g.items.map((e, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  e.tagColor === 'green' ? 'bg-accent-soft text-accent' :
                  e.tagColor === 'blue' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-bg text-fg-muted'
                }`}>
                  {e.tagColor === 'green' ? <IconPhone /> : e.tagColor === 'blue' ? <IconCal /> : <IconEdit />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-fg truncate">{e.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      e.tagColor === 'green' ? 'bg-accent-soft text-accent-dark' :
                      e.tagColor === 'blue' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-bg text-fg-muted'
                    }`}>{e.type}</span>
                  </div>
                  <div className="text-xs text-fg-muted mt-0.5">{e.sub}</div>
                </div>
                {e.billable && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent-soft text-accent-dark">Billable</span>
                )}
                <div className="text-sm font-semibold text-fg tabular-nums w-16 text-right">{e.dur}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </FirmShell>
  );
}

function IconPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCal() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
