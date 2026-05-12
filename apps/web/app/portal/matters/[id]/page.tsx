'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { PortalShell } from '@/components/PortalShell';
import { DEADLINES, MATTER_STATUS, formatDueRelative } from '@/lib/portalData';

// ---------- Mock data for this matter ----------

const MATTERS: Record<string, {
  id: string;
  name: string;
  stages: ('Intake' | 'Active' | 'On Hold' | 'Closed')[];
  practiceArea: string;
  originatingAttorney: string;
  opened: string;
  lastActivity: string;
  description: string;
  totalHours: number;
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
  team: { name: string; role: string; rate: number; hours: number; amount: number; addedOn: string; lastActivity: string; initials: string }[];
  contactsCount: number;
  notesCount: number;
  invoicesCount: number;
  timeCount: number;
}> = {
  m1: {
    id: 'm1',
    name: 'IP — Patent Filing',
    stages: ['Active'],
    practiceArea: 'Intellectual Property',
    originatingAttorney: 'Marcus Hayes',
    opened: '15 Oct 2025',
    lastActivity: '21 Feb 2026, 1:12 PM',
    description: 'Advisory on USPTO patent filing for CB-401 compound. Includes prior art research, claims drafting, and prosecution strategy.',
    totalHours: 20 * 3600 + 43 * 60,
    totalBilled: 5572,
    totalPaid: 3000,
    outstanding: 2572,
    team: [
      { name: 'Marcus Hayes', role: 'Managing Partner', rate: 300, hours: 8.5, amount: 2550, addedOn: '12 Feb 2025', lastActivity: '21 Feb 2026, 11:45 AM', initials: 'MH' },
      { name: 'Sarah Chen', role: 'Senior Associate', rate: 250, hours: 5, amount: 1250, addedOn: '15 Feb 2025', lastActivity: '21 Feb 2026, 11:45 AM', initials: 'SC' },
      { name: 'Jordan Bennett', role: 'Partner', rate: 650, hours: 5, amount: 3250, addedOn: '18 Feb 2025', lastActivity: '21 Feb 2026, 11:45 AM', initials: 'JB' },
    ],
    contactsCount: 8,
    notesCount: 2,
    invoicesCount: 2,
    timeCount: 38,
  },
  m2: {
    id: 'm2',
    name: 'Corporate — Contract Review',
    stages: ['Active'],
    practiceArea: 'Corporate',
    originatingAttorney: 'Marcus Hayes',
    opened: '15 Oct 2025',
    lastActivity: '21 Feb 2026, 1:12 PM',
    description: 'Quarterly vendor and SaaS contract review program. Standardize MSAs and flag regulatory risk.',
    totalHours: 12 * 3600 + 15 * 60,
    totalBilled: 3060,
    totalPaid: 1500,
    outstanding: 1560,
    team: [
      { name: 'Marcus Hayes', role: 'Managing Partner', rate: 300, hours: 4.5, amount: 1350, addedOn: '12 Feb 2025', lastActivity: '21 Feb 2026, 11:45 AM', initials: 'MH' },
      { name: 'Sarah Chen', role: 'Senior Associate', rate: 250, hours: 4, amount: 1000, addedOn: '15 Feb 2025', lastActivity: '21 Feb 2026, 11:45 AM', initials: 'SC' },
    ],
    contactsCount: 5,
    notesCount: 1,
    invoicesCount: 1,
    timeCount: 22,
  },
  m3: {
    id: 'm3',
    name: 'Reyes v. Horizon — Wrongful Termination',
    stages: ['Closed'],
    practiceArea: 'Employment Litigation',
    originatingAttorney: 'Marcus Hayes',
    opened: '15 Oct 2025',
    lastActivity: '21 Feb 2026, 1:12 PM',
    description: 'Wrongful termination claim against Horizon Corp. Closed with favorable settlement.',
    totalHours: 20 * 3600 + 43 * 60,
    totalBilled: 5572,
    totalPaid: 5572,
    outstanding: 0,
    team: [
      { name: 'Marcus Hayes', role: 'Managing Partner', rate: 300, hours: 10, amount: 3000, addedOn: '01 Jul 2025', lastActivity: '14 Feb 2026, 9:00 AM', initials: 'MH' },
    ],
    contactsCount: 3,
    notesCount: 3,
    invoicesCount: 3,
    timeCount: 28,
  },
};

const TEAM_AVATARS = [
  { bg: '#FEE2E2', fg: '#B91C1C' },
  { bg: '#DBEAFE', fg: '#1D4ED8' },
  { bg: '#FEF3C7', fg: '#92400E' },
];

const TIME_ROWS: { date: string; entries: { person: string; type: string; typeColor: 'green' | 'orange' | 'purple' | 'blue'; title: string; duration: string; amount: string; iconType: 'phone' | 'book' | 'people' | 'mail' }[]; total: string; totalAmount: string }[] = [
  {
    date: 'Saturday, Feb 21',
    entries: [
      { person: 'Sarah Chen', type: 'CALL', typeColor: 'green', title: 'Client call re: patent application scope and prior art search results', duration: '0:38', amount: '$237.50', iconType: 'phone' },
      { person: 'Jordan Bennett', type: 'RESEARCH', typeColor: 'orange', title: 'Prior art search — USPTO database review for competing claims', duration: '1:15', amount: '$250.00', iconType: 'book' },
    ],
    total: '1h 53m',
    totalAmount: '$487.50',
  },
  {
    date: 'Friday, Feb 20',
    entries: [
      { person: 'Sarah Chen', type: 'IN PERSON', typeColor: 'blue', title: 'Draft patent claims 1–12 for compound CB-401', duration: '2:30', amount: '$937.50', iconType: 'people' },
      { person: 'Jordan Bennett', type: 'RESEARCH', typeColor: 'green', title: 'Technical review of bioassay data supporting novelty argument', duration: '1:45', amount: '$350.00', iconType: 'book' },
    ],
    total: '4h 15m',
    totalAmount: '$1,287.50',
  },
  {
    date: 'Thursday, Feb 19',
    entries: [
      { person: 'Sarah Chen', type: 'EMAIL', typeColor: 'purple', title: 'Correspondence with USPTO examiner re: application status', duration: '0:20', amount: '$125.00', iconType: 'mail' },
      { person: 'Sarah Chen', type: 'REVIEW', typeColor: 'purple', title: 'Review and revision of specification sections 3–7', duration: '1:50', amount: '$687.50', iconType: 'mail' },
    ],
    total: '2h 10m',
    totalAmount: '$812.50',
  },
];

const INVOICES_ROWS = [
  { num: 'INV-008', issued: '12 Mar 2026', paidOn: null, hours: '5.0h', amount: '$700', status: 'Issued' as const },
  { num: 'INV-007', issued: '08 Mar 2026', paidOn: null, hours: '4.5h', amount: '$1,200', status: 'Overdue' as const },
  { num: 'INV-006', issued: '03 Mar 2026', paidOn: '13 Mar 2026', hours: '4.0h', amount: '$1,300', status: 'Paid' as const },
  { num: 'INV-005', issued: '05 Mar 2026', paidOn: '11 Mar 2026', hours: '5.0h', amount: '$1,500', status: 'Partially Paid' as const },
];

// Client-facing timeline: only events the client should see. Excludes firm-internal
// admin events like permissions changes. Stage changes are kept but reworded in
// client-friendly language ("Your case has been escalated") rather than firm-side
// jargon.
const TIMELINE = [
  { date: '12 Mar 2026', events: [
    { chip: 'NOTE', chipColor: 'purple', sub: '9:00 AM', title: 'James posted a case update', body: 'Quarterly compliance review meeting held with client. Next step: review draft response by Friday.', person: 'James Donovan', personInitials: 'JD' },
  ]},
  { date: '10 Mar 2026', events: [
    { chip: 'TIME', chipColor: 'green', sub: '10:00 AM · CALL', title: '15 minutes logged on your matter', body: 'Quick call with Companies House re: filing confirmation receipt.', person: 'Emily Park', personInitials: 'EP' },
  ]},
  { date: '8 Mar 2026', events: [
    { chip: 'INVOICE', chipColor: 'blue', sub: '9:00 AM', title: 'Invoice INV-2026-047 issued', body: 'Amount: $1,038 · 3 line items', person: 'Sarah Chen', personInitials: 'SC' },
  ]},
  { date: '5 Mar 2026', events: [
    { chip: 'TIME', chipColor: 'green', sub: '2:00 PM · RESEARCH', title: '45 minutes logged on your matter', body: 'Reviewing post-filing compliance requirements for next quarter.', person: 'James Donovan', personInitials: 'JD' },
    { chip: 'STATUS', chipColor: 'orange', sub: '11:30 AM', title: 'Case stage updated', body: 'Your case has moved into litigation after settlement talks concluded without agreement.', person: 'Marcus Hayes', personInitials: 'MH', stageFrom: 'Negotiation', stageTo: 'Litigation' },
  ]},
];

const NOTES = [
  { person: 'James Donovan', initials: 'JD', timestamp: '16 Mar, 2026 12:20 AM', body: 'Client attended office to discuss the current status of the case and requested clarification on the next legal steps. Advice was provided regarding documentation and expected timelines.' },
  { person: 'James Donovan', initials: 'JD', timestamp: '16 Mar, 2026 12:20 AM', body: 'A detailed review of the case file and all supporting documentation was conducted to ensure that all materials are properly organised and complete. Particular attention was given to correspondence received from the opposing party and previously submitted evidence. Some documents appear to be missing, and a request will be made to the…' },
];

const CONTACTS = [
  { name: 'James Donovan', role: 'Primary Contact', email: 'james.donovan@horizonholdings.com', phone: '+1 (415) 555-0190', initials: 'JD' },
  { name: 'Emily Park', role: 'CFO', email: 'emily.park@horizonholdings.com', phone: '+1 (415) 555-0191', initials: 'EP' },
  { name: 'William Smith', role: 'General Counsel', email: 'william.smith@horizonholdings.com', phone: '+1 (415) 555-0192', initials: 'WS' },
  { name: 'Sarah Mitchell', role: 'Project Lead', email: 'sarah.mitchell@horizonholdings.com', phone: '+1 (415) 555-0193', initials: 'SM' },
  { name: 'Marcus Rivera', role: 'Technical Advisor', email: 'marcus.rivera@horizonholdings.com', phone: '+1 (415) 555-0194', initials: 'MR' },
  { name: 'Lisa Wong', role: 'Compliance Officer', email: 'lisa.wong@horizonholdings.com', phone: '+1 (415) 555-0195', initials: 'LW' },
  { name: 'Ben Hayes', role: 'Operations', email: 'ben.hayes@horizonholdings.com', phone: '+1 (415) 555-0196', initials: 'BH' },
  { name: 'Rachel Cole', role: 'Board Member', email: 'rachel.cole@horizonholdings.com', phone: '+1 (415) 555-0197', initials: 'RC' },
];

type Tab = 'overview' | 'time' | 'invoices' | 'team' | 'contacts' | 'notes';

export default function MatterDetail() {
  const { id } = useParams<{ id: string }>();
  const matter = MATTERS[id] ?? MATTERS.m1;
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <PortalShell>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Link href="/portal/matters" className="text-fg-muted hover:text-fg inline-flex items-center gap-1.5">
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

      {/* Title + stage pills + avatars */}
      <h1 className="text-3xl font-semibold tracking-[-0.5px] mb-3 max-w-2xl leading-tight">{matter.name}</h1>
      <div className="flex items-center gap-3 mb-4">
        {matter.stages.map((s, i) => (
          <StagePill key={i} stage={s} />
        ))}
        <div className="flex -space-x-2 ml-1">
          {TEAM_AVATARS.map((a, i) => (
            <span
              key={i}
              title={matter.team[i % matter.team.length]?.name}
              style={{ background: a.bg, color: a.fg }}
              className="w-7 h-7 rounded-full ring-2 ring-bg flex items-center justify-center text-[10px] font-bold">
              {matter.team[i % matter.team.length]?.initials ?? 'JC'}
            </span>
          ))}
        </div>
      </div>

      {/* Status line + next deadline */}
      <MatterStatusAndDeadline id={matter.id} />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-6">
        <TabBtn label="Overview" icon={<IconGlobe />} active={tab === 'overview'} onClick={() => setTab('overview')} />
        <TabBtn label="Time" icon={<IconClock />} count={matter.timeCount} active={tab === 'time'} onClick={() => setTab('time')} />
        <TabBtn label="Invoices" icon={<IconInvoice />} count={matter.invoicesCount} active={tab === 'invoices'} onClick={() => setTab('invoices')} />
        <TabBtn label="Team" icon={<IconUsers />} count={matter.team.length} active={tab === 'team'} onClick={() => setTab('team')} />
        <TabBtn label="Contacts" icon={<IconContact />} count={matter.contactsCount} active={tab === 'contacts'} onClick={() => setTab('contacts')} />
        <TabBtn label="Notes" icon={<IconNotes />} count={matter.notesCount} active={tab === 'notes'} onClick={() => setTab('notes')} />
      </div>

      {tab === 'overview' && <OverviewTab matter={matter} />}
      {tab === 'time' && <TimeTab />}
      {tab === 'team' && <TeamTab team={matter.team} />}
      {tab === 'contacts' && <ContactsTab />}
      {tab === 'notes' && <NotesTab />}
      {tab === 'invoices' && <InvoicesTab />}
    </PortalShell>
  );
}

// ---------- Tabs ----------

function OverviewTab({ matter }: { matter: typeof MATTERS[string] }) {
  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <KpiCard label="Total Hours" value={formatHoursShort(matter.totalHours)} />
        <KpiCard label="Total Billed" value={formatMoney(matter.totalBilled)} />
        <KpiCard label="Total Paid" value={formatMoney(matter.totalPaid)} valueClass="text-accent-dark" />
        <KpiCard label="Outstanding" value={formatMoney(matter.outstanding)} valueClass={matter.outstanding > 0 ? 'text-danger' : ''} />
      </div>

      {/* Chart + details */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-sm font-semibold">Hours Over Time</div>
              <div className="text-xs text-fg-muted mt-0.5">
                Total hours <span className="text-fg font-semibold">{(matter.totalHours / 3600).toFixed(2)}</span>
              </div>
            </div>
            <button className="text-sm text-fg-muted inline-flex items-center gap-1.5 border border-border rounded-lg px-3 h-9">
              This Week
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <MiniBarChart values={[3.5, 1.0, 1.5, 4.2, 0.3, 1.2, 0]} labels={['02-02', '02-03', '02-04', '02-05', '02-06', '02-07', '02-08']} />
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-sm font-semibold mb-4">Matter Details</div>
          <DetailRow label="Practice Area" value={matter.practiceArea} />
          <DetailRow label="Originating Attorney" value={matter.originatingAttorney} avatar="JC" />
          <DetailRow label="Opened" value={matter.opened} />
          <DetailRow label="Last Activity" value={matter.lastActivity} />
          <div className="mt-4">
            <div className="text-xs text-fg-muted mb-1">Description</div>
            <p className="text-sm text-fg leading-relaxed">{matter.description}</p>
          </div>
        </div>
      </div>

      {/* Activity timeline */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold">Recent Updates</div>
            <div className="text-xs text-fg-muted mt-0.5">What your firm has been doing on this matter.</div>
          </div>
          <div className="text-xs text-fg-muted">{TIMELINE.reduce((a, g) => a + g.events.length, 0)} updates</div>
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          {['All', 'Time', 'Invoices', 'Notes', 'Status'].map((f, i) => (
            <button
              key={f}
              className={`px-3 h-8 rounded-full border text-xs font-medium ${
                i === 0 ? 'border-accent text-accent-dark bg-accent-soft' : 'border-border text-fg-muted hover:bg-bg'
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {TIMELINE.map((g) => (
            <div key={g.date}>
              <div className="text-xs font-medium text-fg-muted mb-3">{g.date}</div>
              <div className="space-y-4 border-l border-border pl-6 relative">
                {g.events.map((ev, i) => (
                  <div key={i} className="relative">
                    <span
                      className={`absolute -left-[33px] top-0 w-7 h-7 rounded-md flex items-center justify-center ${
                        ev.chipColor === 'green' ? 'bg-accent-soft text-accent' :
                        ev.chipColor === 'purple' ? 'bg-[#F3E8FF] text-[#7E22CE]' :
                        ev.chipColor === 'blue' ? 'bg-[#DBEAFE] text-[#1D4ED8]' :
                        ev.chipColor === 'orange' ? 'bg-warning-soft text-warning' :
                        ev.chipColor === 'red' ? 'bg-danger-soft text-danger' : 'bg-bg text-fg-muted'
                      }`}>
                      <IconClock />
                    </span>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wide rounded uppercase ${
                          ev.chipColor === 'green' ? 'bg-accent-soft text-accent-dark' :
                          ev.chipColor === 'purple' ? 'bg-[#F3E8FF] text-[#7E22CE]' :
                          ev.chipColor === 'blue' ? 'bg-[#DBEAFE] text-[#1D4ED8]' :
                          ev.chipColor === 'orange' ? 'bg-warning-soft text-warning' :
                          ev.chipColor === 'red' ? 'bg-danger-soft text-danger' : 'bg-bg text-fg-muted'
                        }`}>
                        {ev.chip}
                      </span>
                      <span className="text-[10px] font-semibold text-fg-muted tracking-wide uppercase">{ev.sub}</span>
                    </div>
                    <div className="text-sm font-semibold text-fg">{ev.title}</div>
                    <div className="text-xs text-fg-muted mt-0.5">{ev.body}</div>
                    {ev.stageFrom && ev.stageTo && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-warning-soft text-warning">{ev.stageFrom}</span>
                        <span className="text-fg-subtle">→</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-danger-soft text-danger">{ev.stageTo}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-5 h-5 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-[9px] font-bold">{ev.personInitials}</span>
                      <span className="text-xs text-fg">{ev.person}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

function TimeTab() {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-bg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Filter
        </button>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9 3v18M15 3v18" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          Columns
        </button>
      </div>

      {TIME_ROWS.map((g) => (
        <div key={g.date} className="mb-4">
          <div className="text-sm font-medium text-fg-muted mb-2 pl-1">{g.date}</div>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {g.entries.map((e, i) => (
              <div key={i} className="grid grid-cols-[40px_1fr_80px_100px] items-center gap-3 px-4 py-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  e.iconType === 'phone' ? 'bg-accent-soft text-accent' :
                  e.iconType === 'book' ? 'bg-warning-soft text-warning' :
                  e.iconType === 'people' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-[#F3E8FF] text-[#7E22CE]'
                }`}>
                  {e.iconType === 'phone' && <IconPhone />}
                  {e.iconType === 'book' && <IconNotes />}
                  {e.iconType === 'people' && <IconUsers />}
                  {e.iconType === 'mail' && <IconMail />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-fg">{e.person}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                      e.typeColor === 'green' ? 'bg-accent-soft text-accent-dark' :
                      e.typeColor === 'orange' ? 'bg-warning-soft text-warning' :
                      e.typeColor === 'blue' ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-[#F3E8FF] text-[#7E22CE]'
                    }`}>{e.type}</span>
                  </div>
                  <div className="text-sm text-fg-muted">{e.title}</div>
                </div>
                <div className="text-sm text-fg tabular-nums text-right">{e.duration}</div>
                <div className="text-sm font-semibold text-fg tabular-nums text-right">{e.amount}</div>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_80px_100px] items-center gap-3 px-4 py-3 bg-bg/50">
              <div className="text-[10px] font-bold tracking-wide uppercase text-fg-muted">Day Total</div>
              <div className="text-sm font-semibold text-fg tabular-nums text-right">{g.total}</div>
              <div className="text-sm font-semibold text-fg tabular-nums text-right">{g.totalAmount}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function TeamTab({ team }: { team: typeof MATTERS[string]['team'] }) {
  return (
    <>
      <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10 mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input placeholder="Search..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_1.4fr] gap-3 px-6 py-3 border-b border-border text-xs font-medium text-fg-muted">
          <div>Name</div>
          <div>Rate</div>
          <div>Hours</div>
          <div>Amount</div>
          <div>Added on</div>
          <div>Last Activity</div>
        </div>
        {team.map((m, i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_1.4fr] gap-3 items-center px-6 py-4 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <span style={{ background: TEAM_AVATARS[i % 3].bg, color: TEAM_AVATARS[i % 3].fg }} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold">{m.initials}</span>
              <div>
                <div className="text-sm font-semibold text-fg">{m.name}</div>
                <div className="text-xs text-fg-muted">{m.role}</div>
              </div>
            </div>
            <div className="text-sm text-fg tabular-nums">${m.rate}/hr</div>
            <div className="text-sm text-fg tabular-nums">{m.hours}h</div>
            <div className="text-sm text-fg tabular-nums">${m.amount.toLocaleString()}</div>
            <div className="text-sm text-fg">{m.addedOn}</div>
            <div className="text-sm text-fg">{m.lastActivity}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function ContactsTab() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CONTACTS.map((c, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <span style={{ background: TEAM_AVATARS[i % 3].bg, color: TEAM_AVATARS[i % 3].fg }} className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
            {c.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-fg">{c.name}</div>
            <div className="text-xs text-fg-muted mb-1.5">{c.role}</div>
            <div className="text-xs text-fg-muted truncate">{c.email}</div>
            <div className="text-xs text-fg-muted">{c.phone}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesTab() {
  return (
    <div className="space-y-3">
      {NOTES.map((n, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span style={{ background: TEAM_AVATARS[i % 3].bg, color: TEAM_AVATARS[i % 3].fg }} className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold">
              {n.initials}
            </span>
            <div>
              <div className="text-sm font-semibold text-fg">{n.person}</div>
              <div className="text-xs text-fg-muted">{n.timestamp}</div>
            </div>
          </div>
          <p className="text-sm text-fg leading-relaxed">{n.body}</p>
        </div>
      ))}
    </div>
  );
}

function InvoicesTab() {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <button className="px-3 h-10 rounded-lg border border-border bg-card text-sm font-medium hover:bg-bg flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Filter
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1.4fr_1.4fr_1fr_1fr_1.2fr_60px] gap-3 px-6 py-3 border-b border-border text-xs font-medium text-fg-muted">
          <div>Invoice #</div>
          <div>Issue Date</div>
          <div>Paid on</div>
          <div>Hours</div>
          <div>Amount</div>
          <div>Status</div>
          <div></div>
        </div>
        {INVOICES_ROWS.map((inv) => (
          <div key={inv.num} className="grid grid-cols-[1.2fr_1.4fr_1.4fr_1fr_1fr_1.2fr_60px] gap-3 items-center px-6 py-4 border-b border-border last:border-0">
            <div className="text-sm font-semibold text-accent">{inv.num}</div>
            <div className="text-sm text-fg">{inv.issued}</div>
            <div className="text-sm text-fg">{inv.paidOn ?? '—'}</div>
            <div className="text-sm text-fg tabular-nums">{inv.hours}</div>
            <div className="text-sm text-fg tabular-nums">{inv.amount}</div>
            <div>
              <InvoiceStatusBadge status={inv.status} />
            </div>
            <button className="text-fg-muted hover:text-fg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------- Helpers ----------

function MatterStatusAndDeadline({ id }: { id: string }) {
  const status = MATTER_STATUS[id];
  const nextDeadline = DEADLINES
    .filter((d) => d.matterId === id)
    .sort((a, b) => a.dueAt - b.dueAt)[0];

  if (!status && !nextDeadline) return null;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {status && (
        <div className="col-span-2 bg-card border border-border rounded-2xl px-5 py-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-accent-dark bg-accent-soft px-1.5 py-0.5 rounded">Status</span>
            <span className="text-xs text-fg-muted">Updated {status.updatedAt} by {status.updatedBy}</span>
          </div>
          <p className="text-sm text-fg leading-relaxed">{status.status}</p>
        </div>
      )}
      {nextDeadline && (
        <div className="bg-card border border-border rounded-2xl px-5 py-4">
          <div className="text-[10px] font-bold uppercase tracking-wide text-fg-muted mb-1.5">Next deadline</div>
          <div className="text-sm font-semibold text-fg leading-snug">{nextDeadline.title}</div>
          {(() => {
            const due = formatDueRelative(nextDeadline.dueAt);
            const toneCls =
              due.tone === 'overdue' ? 'text-danger' :
              due.tone === 'urgent' ? 'text-warning' :
              due.tone === 'soon' ? 'text-accent-dark' :
              'text-fg-muted';
            return <div className={`text-xs font-medium mt-1 ${toneCls}`}>{due.label}</div>;
          })()}
        </div>
      )}
    </div>
  );
}

function StagePill({ stage }: { stage: 'Intake' | 'Active' | 'On Hold' | 'Closed' }) {
  const map = {
    Intake: 'border-blue-500 text-blue-700 bg-blue-50',
    Active: 'border-accent text-accent-dark bg-accent-soft',
    'On Hold': 'border-orange-400 text-orange-700 bg-orange-50',
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
        <span
          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
            active ? 'bg-accent text-white' : 'bg-bg text-fg-muted'
          }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function KpiCard({ label, value, valueClass = '' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl px-5 py-4">
      <div className="text-xs text-fg-muted">{label}</div>
      <div className={`text-2xl font-semibold mt-1 tabular-nums ${valueClass}`}>{value}</div>
    </div>
  );
}

function DetailRow({ label, value, avatar }: { label: string; value: string; avatar?: string }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-fg-muted">{label}</span>
      <span className="text-sm font-medium text-fg flex items-center gap-1.5">
        {avatar && <span className="w-5 h-5 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-[9px] font-bold">{avatar}</span>}
        {value}
      </span>
    </div>
  );
}

function MiniBarChart({ values, labels }: { values: number[]; labels: string[] }) {
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

function InvoiceStatusBadge({ status }: { status: 'Issued' | 'Overdue' | 'Paid' | 'Partially Paid' }) {
  const map = {
    Issued: 'bg-warning-soft text-warning',
    Overdue: 'bg-danger-soft text-danger',
    Paid: 'bg-accent-soft text-accent-dark',
    'Partially Paid': 'bg-[#DBEAFE] text-[#1D4ED8]',
  } as const;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status]}`}>{status}</span>;
}

function formatHoursShort(sec: number) {
  const h = sec / 3600;
  return `${h.toFixed(1)}h`;
}
function formatMoney(n: number) {
  // Whole dollars unless cents matter — matches admin + portal home + invoices.
  if (Number.isInteger(n) || n % 1 < 0.005) return `$${Math.round(n).toLocaleString()}`;
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ---------- Icons ----------
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
function IconInvoice() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
function IconPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
function IconMail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
