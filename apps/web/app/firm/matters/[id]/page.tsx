'use client';

import Link from 'next/link';
import { useState } from 'react';

import { FirmShell } from '@/components/FirmShell';

type Tab = 'overview' | 'time' | 'team' | 'contacts' | 'notes';

const TEAM_AVATARS = [
  { bg: '#FEE2E2', fg: '#B91C1C', initials: 'JC' },
  { bg: '#DBEAFE', fg: '#1D4ED8', initials: 'SC' },
  { bg: '#FEF3C7', fg: '#92400E', initials: 'MR' },
];

export default function FirmMatterDetail() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <FirmShell title="" action={
      <button className="h-10 px-4 rounded-full bg-accent hover:bg-accent-dim text-white font-semibold text-sm inline-flex items-center gap-1.5">
        <span className="text-base leading-none">+</span> Add New
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    }>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm -mt-1">
        <Link href="/firm/matters" className="text-fg-muted hover:text-fg inline-flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Matters
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-fg-subtle">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-fg-muted">Matter Details</span>
      </div>

      <h1 className="text-3xl font-semibold tracking-[-0.5px] mb-3 max-w-2xl leading-tight">
        Horizon Holdings Corporate Compliance Review
      </h1>

      <div className="flex items-center gap-3 mb-6">
        <StagePill stage="Intake" />
        <StagePill stage="In Progress" />
        <span className="flex items-center gap-1.5 text-sm text-fg">
          <span className="w-5 h-5 rounded-md bg-[#F3F4F6] flex items-center justify-center text-[8px] font-bold text-fg-muted">AC</span>
          Anderson &amp; Cole LLP
        </span>
        <div className="flex -space-x-2 ml-1">
          {TEAM_AVATARS.map((a, i) => (
            <span
              key={i}
              style={{ background: a.bg, color: a.fg }}
              className="w-7 h-7 rounded-full ring-2 ring-bg flex items-center justify-center text-[10px] font-bold">
              {a.initials}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border mb-6">
        <TabBtn label="Overview" icon={<IconGlobe />} active={tab === 'overview'} onClick={() => setTab('overview')} />
        <TabBtn label="Time" icon={<IconClock />} count={38} active={tab === 'time'} onClick={() => setTab('time')} />
        <TabBtn label="Team" icon={<IconUsers />} count={3} active={tab === 'team'} onClick={() => setTab('team')} />
        <TabBtn label="Contacts" icon={<IconContact />} count={8} active={tab === 'contacts'} onClick={() => setTab('contacts')} />
        <TabBtn label="Notes" icon={<IconNotes />} count={2} active={tab === 'notes'} onClick={() => setTab('notes')} />
      </div>

      {tab === 'overview' && <OverviewTab />}
      {tab !== 'overview' && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-fg-muted text-sm">
          {tab[0].toUpperCase() + tab.slice(1)} tab content lives here in the full build — same patterns as the client portal matter detail.
        </div>
      )}
    </FirmShell>
  );
}

function OverviewTab() {
  return (
    <>
      <button className="text-sm text-fg inline-flex items-center gap-1.5 mb-4">
        Since joining
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-sm font-semibold">Hours Over Time</div>
              <div className="text-xs text-fg-muted mt-0.5">
                Total hours <span className="text-fg font-semibold">0.00</span>
              </div>
            </div>
            <button className="text-sm text-fg-muted inline-flex items-center gap-1.5 border border-border rounded-lg px-3 h-9">
              This Week
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <BarChart values={[3.5, 1.0, 1.5, 4.2, 0.3, 1.2, 0]} labels={['02-02', '02-03', '02-04', '02-05', '02-06', '02-07', '02-08']} />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-sm font-semibold mb-4">Matter Details</div>
          <Row label="Status">
            <StagePill stage="In Progress" />
          </Row>
          <Row label="Case Stage">
            <StagePill stage="Intake" />
          </Row>
          <Row label="Practice Area">Corporate</Row>
          <Row label="Client">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-[#F3F4F6] text-fg-muted flex items-center justify-center text-[8px] font-bold">AC</span>
              Anderson &amp; Cole LLP
            </span>
          </Row>
          <Row label="Originating Solicitor">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-[9px] font-bold">JC</span>
              John Carter
            </span>
          </Row>
          <Row label="Opened">15 Oct 2025</Row>
          <Row label="Last Activity">21 Feb 2026, 1:12 PM</Row>
          <Row label="Matter Permissions">Open — All firm users</Row>
          <div className="mt-4">
            <div className="text-xs text-fg-muted mb-1">Description</div>
            <p className="text-sm text-fg leading-relaxed">
              Advisory on proposed acquisition of TechNova Inc. Including due diligence, term sheet negotiation, and regulatory analysis.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-fg-muted">{label}</span>
      <span className="text-sm font-medium text-fg">{children}</span>
    </div>
  );
}

function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 4);
  return (
    <div>
      <div className="relative h-[220px] pl-9">
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

function StagePill({ stage }: { stage: 'Intake' | 'In Progress' | 'Judgement' | 'Closed' }) {
  const map = {
    Intake: 'border-blue-500 text-blue-700 bg-blue-50',
    'In Progress': 'border-accent text-accent-dark bg-accent-soft',
    Judgement: 'border-purple-500 text-purple-700 bg-purple-50',
    Closed: 'border-gray-400 text-gray-700 bg-gray-100',
  };
  return <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${map[stage]}`}>{stage}</span>;
}

function TabBtn({
  label,
  icon,
  count,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 -mb-px ${
        active ? 'border-accent text-accent' : 'border-transparent text-fg-muted hover:text-fg'
      }`}>
      <span className={active ? 'text-accent' : 'text-fg-muted'}>{icon}</span>
      {label}
      {count !== undefined && (
        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${active ? 'bg-accent text-white' : 'bg-bg text-fg-muted'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function IconGlobe() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconContact() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 19a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconNotes() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
