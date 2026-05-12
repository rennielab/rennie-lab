'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { AddEntrySlideOut } from '@/components/AddEntrySlideOut';
import { FirmShell } from '@/components/FirmShell';
import {
  clientById,
  contactById,
  contacts,
  currentFirmUser,
  entryValue,
  formatHoursH,
  formatMoneyCompact,
  lawyerById,
  lawyers,
  matterById,
  matters as allMatters,
  seedEntries,
} from '@/lib/mock';
import { useEntryOverrides } from '@/lib/adminState';

const STAGE_TINTS: Record<string, { bg: string; fg: string; border: string }> = {
  Intake: { bg: '#DBEAFE', fg: '#1D4ED8', border: '#93C5FD' },
  'In Progress': { bg: '#DCFCE7', fg: '#166534', border: '#86EFAC' },
  Discovery: { bg: '#FED7AA', fg: '#9A3412', border: '#FDBA74' },
  Closed: { bg: '#F3F4F6', fg: '#4B5563', border: '#D1D5DB' },
};

const MATTER_STAGE: Record<string, 'In Progress' | 'Intake' | 'Discovery' | 'Closed'> = {
  mat_acme_1: 'In Progress',
  mat_acme_2: 'Discovery',
  mat_reyes_1: 'Intake',
  mat_reyes_2: 'In Progress',
  mat_north_1: 'Discovery',
  mat_vert_1: 'Closed',
};

const MATTER_NOTES: Record<string, { person: string; initials: string; timestamp: string; body: string }[]> = {
  mat_acme_1: [
    { person: 'Jordan Bennett', initials: 'JB', timestamp: '2 days ago', body: 'Opposing counsel filed Motion to Dismiss on May 8. Strongest argument is Rule 12(b)(6). Sophia drafting opposition — target circulation Thursday.' },
    { person: 'Sophia Williams', initials: 'SW', timestamp: '4 hours ago', body: 'Section II — argument for plausibility standard. Will need a 6-page response. James Park (client) wants conservative posture — no settlement signaling.' },
  ],
  mat_north_1: [
    { person: 'Sarah Chen', initials: 'SC', timestamp: '1 day ago', body: 'Comfort letter coordination with David Chen at Northgate. Underwriters pushed back on Section 11 language — Sophia drafting alternative.' },
  ],
};

type Tab = 'overview' | 'time' | 'team' | 'contacts' | 'notes';

export default function FirmMatterDetail() {
  const { id } = useParams<{ id: string }>();
  const overrides = useEntryOverrides();
  const [tab, setTab] = useState<Tab>('overview');
  const [addOpen, setAddOpen] = useState(false);

  const matter = matterById(id);
  if (!matter) {
    return (
      <FirmShell title="Matter not found">
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="text-sm text-fg-muted">This matter doesn't exist or you don't have access.</div>
          <Link href="/firm/matters" className="inline-block mt-3 text-sm font-medium text-accent hover:underline">← Back to matters</Link>
        </div>
      </FirmShell>
    );
  }

  const client = clientById(matter.clientId);
  const stage = MATTER_STAGE[matter.id] ?? 'In Progress';

  // All entries on this matter (across the team) — Sophia sees them, she doesn't approve them.
  const allEntries = useMemo(() => seedEntries
    .filter((e) => e.matterId === matter.id)
    .map((e) => ({
      ...e,
      status: (overrides[e.id]?.status as typeof e.status) ?? e.status,
      nonBillable: overrides[e.id]?.nonBillable ?? e.nonBillable,
    })), [matter.id, overrides]);

  const myEntries = allEntries.filter((e) => e.lawyerId === currentFirmUser.id);

  // Matter team — anyone who has logged time + the originating partner (Jordan or Marcus depending on matter)
  const teamIds = Array.from(new Set([...allEntries.map((e) => e.lawyerId)]));
  const team = teamIds.map((tid) => lawyerById(tid)).filter(Boolean) as { id: string; name: string; initials: string; role: string }[];

  const matterContacts = contacts.filter((c) => c.matterId === matter.id || c.clientId === matter.clientId);
  const notes = MATTER_NOTES[matter.id] ?? [];

  const totalHoursSec = allEntries.reduce((a, e) => a + e.durationSec, 0);
  const myHoursSec = myEntries.reduce((a, e) => a + e.durationSec, 0);
  const totalBilled = allEntries.reduce((a, e) => a + entryValue(e), 0);
  const myBilled = myEntries.reduce((a, e) => a + entryValue(e), 0);

  return (
    <FirmShell title=" " action={
      <button
        onClick={() => setAddOpen(true)}
        className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
        <span className="text-base leading-none">+</span> Log time on this matter
      </button>
    }>
      <div className="-mt-2">
        <div className="flex items-center gap-2 mb-3 text-sm">
          <Link href="/firm/matters" className="text-fg-muted hover:text-fg inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Matters
          </Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-fg-subtle">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-fg-muted truncate">{matter.shortName}</span>
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.5px] mb-3 max-w-2xl leading-tight">{matter.name}</h1>
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <StagePill stage={stage} />
          <span className="text-sm text-fg flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-bg flex items-center justify-center text-[10px] font-bold text-fg-muted">{client?.name[0]}</span>
            {client?.name}
          </span>
          <span className="text-sm text-fg-muted">${matter.rate}/hr</span>
          <div className="flex -space-x-2 ml-1">
            {team.slice(0, 4).map((t) => (
              <span key={t.id} title={`${t.name} · ${t.role}`} className="w-7 h-7 rounded-full ring-2 ring-bg flex items-center justify-center text-[10px] font-bold bg-accent-soft text-accent-dark">
                {t.initials}
              </span>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <Stat label="Total hours" value={formatHoursH(totalHoursSec)} sub="Whole team" />
          <Stat label="Your hours" value={formatHoursH(myHoursSec)} sub={`${myEntries.length} entries`} accent />
          <Stat label="Total billed" value={formatMoneyCompact(totalBilled)} sub="Whole team" />
          <Stat label="Your billings" value={formatMoneyCompact(myBilled)} sub="At matter rate" accent />
        </div>

        <div className="flex items-center gap-1 border-b border-border mb-5">
          <TabBtn label="Overview" icon={<IGlobe />} active={tab === 'overview'} onClick={() => setTab('overview')} />
          <TabBtn label="Time" icon={<IClock />} count={allEntries.length} active={tab === 'time'} onClick={() => setTab('time')} />
          <TabBtn label="Team" icon={<IUsers />} count={team.length} active={tab === 'team'} onClick={() => setTab('team')} />
          <TabBtn label="Contacts" icon={<IContact />} count={matterContacts.length} active={tab === 'contacts'} onClick={() => setTab('contacts')} />
          <TabBtn label="Notes" icon={<INotes />} count={notes.length} active={tab === 'notes'} onClick={() => setTab('notes')} />
        </div>

        {tab === 'overview' && (
          <OverviewTab matter={matter} client={client?.name ?? ''} stage={stage} notes={notes} />
        )}
        {tab === 'time' && (
          <TimeTab entries={allEntries} />
        )}
        {tab === 'team' && (
          <TeamTab team={team} entries={allEntries} matterRate={matter.rate} />
        )}
        {tab === 'contacts' && (
          <ContactsTab contactsForMatter={matterContacts} />
        )}
        {tab === 'notes' && (
          <NotesTab notes={notes} />
        )}
      </div>

      <AddEntrySlideOut open={addOpen} onClose={() => setAddOpen(false)} defaultMatterId={matter.id} />
    </FirmShell>
  );
}

// ---------- Tabs ----------

function OverviewTab({ matter, client, stage, notes }: { matter: ReturnType<typeof matterById> & {}; client: string; stage: string; notes: { person: string; initials: string; timestamp: string; body: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-2 space-y-3">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-sm font-semibold mb-3">Matter description</div>
          <p className="text-sm text-fg leading-relaxed">
            {client} — {matter.name}. Active since recent quarter. Stage: {stage}. Billing at standard rate. Sophia is on the team — talk to Jordan on strategy decisions.
          </p>
        </div>

        {/* Latest note preview */}
        {notes.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Latest note</div>
              <span className="text-xs text-fg-muted">{notes.length} total</span>
            </div>
            <NoteCard note={notes[notes.length - 1]} />
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 h-fit">
        <div className="text-sm font-semibold mb-4">Matter details</div>
        <DetailRow label="Stage" value={<StagePill stage={stage} />} />
        <DetailRow label="Client" value={client} />
        <DetailRow label="Rate" value={`$${matter.rate}/hr`} />
        <DetailRow label="Originating partner" value={
          <span className="inline-flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-[9px] font-bold">JB</span>
            Jordan Bennett
          </span>
        } />
        <DetailRow label="Opened" value="15 Oct 2025" />
        <DetailRow label="Last activity" value="21 Feb 2026, 1:12 PM" />
        <DetailRow label="Permissions" value="Team-only" />
      </div>
    </div>
  );
}

function TimeTab({ entries }: { entries: ReturnType<typeof Array.prototype.map> & any[] }) {
  if (entries.length === 0) {
    return <div className="bg-card border border-border rounded-2xl p-12 text-center text-sm text-fg-muted">No time logged on this matter yet.</div>;
  }
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
      {sorted.map((e) => {
        const law = lawyerById(e.lawyerId);
        const c = e.contactId ? contactById(e.contactId) : undefined;
        return (
          <div key={e.id} className="grid grid-cols-[60px_1fr_140px_110px_110px] gap-3 items-start px-5 py-3">
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center justify-center mt-0.5 ${e.source === 'call' ? 'bg-accent-soft text-accent-dark' : 'bg-bg text-fg-muted'}`}>
              {e.source === 'call' ? 'CALL' : 'MANUAL'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-fg leading-snug">{c ? `${c.firstName} · ` : ''}{e.description}</div>
              <div className="text-xs text-fg-muted mt-0.5">{new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-[10px] font-bold">{law?.initials}</span>
              <span className="text-sm">{law?.name.split(' ')[0]}</span>
            </div>
            <div className="text-sm font-semibold tabular-nums text-right">{formatHoursH(e.durationSec)}</div>
            <div className="text-sm tabular-nums text-right">
              {e.nonBillable ? <span className="text-fg-subtle">—</span> : <span className="font-semibold">{formatMoneyCompact(entryValue(e))}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TeamTab({ team, entries, matterRate }: { team: { id: string; name: string; initials: string; role: string }[]; entries: any[]; matterRate: number }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="grid grid-cols-[2fr_1fr_110px_120px_120px] gap-3 px-6 py-3 border-b border-border text-xs font-medium text-fg-muted">
        <div>Name</div>
        <div>Role</div>
        <div className="text-right">Hours</div>
        <div className="text-right">Billable</div>
        <div className="text-right">Last activity</div>
      </div>
      {team.map((t) => {
        const teamEntries = entries.filter((e) => e.lawyerId === t.id);
        const hours = teamEntries.reduce((a, e) => a + e.durationSec, 0);
        const billable = teamEntries.reduce((a, e) => a + entryValue(e), 0);
        const last = teamEntries.map((e) => e.createdAt).sort((a, b) => b - a)[0];
        return (
          <div key={t.id} className="grid grid-cols-[2fr_1fr_110px_120px_120px] gap-3 items-center px-6 py-3.5 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-xs font-bold">{t.initials}</span>
              <span className="text-sm font-semibold">{t.name}</span>
            </div>
            <div className="text-sm text-fg-muted">{t.role}</div>
            <div className="text-sm font-medium tabular-nums text-right">{formatHoursH(hours)}</div>
            <div className="text-sm font-medium tabular-nums text-right">{formatMoneyCompact(billable)}</div>
            <div className="text-sm tabular-nums text-right text-fg-muted">{last ? new Date(last).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</div>
          </div>
        );
      })}
    </div>
  );
}

function ContactsTab({ contactsForMatter }: { contactsForMatter: typeof contacts }) {
  if (contactsForMatter.length === 0) {
    return <div className="bg-card border border-border rounded-2xl p-12 text-center text-sm text-fg-muted">No contacts associated yet.</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      {contactsForMatter.map((c) => (
        <div key={c.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <span className="w-12 h-12 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-sm font-bold shrink-0">{c.initials}</span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-fg">{c.firstName} {c.lastName}</div>
            <div className="text-xs text-fg-muted">{c.phone}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesTab({ notes }: { notes: { person: string; initials: string; timestamp: string; body: string }[] }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button className="h-10 px-4 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> Add note
        </button>
      </div>
      {notes.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-sm text-fg-muted">No notes yet.</div>
      ) : (
        notes.map((n, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6">
            <NoteCard note={n} />
          </div>
        ))
      )}
    </div>
  );
}

function NoteCard({ note }: { note: { person: string; initials: string; timestamp: string; body: string } }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-9 h-9 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-xs font-bold">{note.initials}</span>
        <div>
          <div className="text-sm font-semibold text-fg">{note.person}</div>
          <div className="text-xs text-fg-muted">{note.timestamp}</div>
        </div>
      </div>
      <p className="text-sm text-fg leading-relaxed">{note.body}</p>
    </>
  );
}

// ---------- Helpers ----------

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`bg-card border ${accent ? 'border-accent/40' : 'border-border'} rounded-2xl px-5 py-4`}>
      <div className="text-xs text-fg-muted">{label}</div>
      <div className={`text-2xl font-semibold mt-1 tabular-nums tracking-tight ${accent ? 'text-accent-dark' : ''}`}>{value}</div>
      {sub && <div className="text-[11px] text-fg-subtle mt-0.5">{sub}</div>}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-fg-muted">{label}</span>
      <span className="text-sm font-medium text-fg">{value}</span>
    </div>
  );
}

function StagePill({ stage }: { stage: string }) {
  const tint = STAGE_TINTS[stage] ?? { bg: '#F3F4F6', fg: '#4B5563', border: '#D1D5DB' };
  return (
    <span style={{ background: tint.bg, color: tint.fg, borderColor: tint.border }} className="px-2.5 py-1 text-xs rounded-md font-semibold border">
      {stage}
    </span>
  );
}

function TabBtn({ label, icon, count, active, onClick }: { label: string; icon: React.ReactNode; count?: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 -mb-px ${active ? 'border-accent text-accent' : 'border-transparent text-fg-muted hover:text-fg'}`}>
      <span className={active ? 'text-accent' : 'text-fg-muted'}>{icon}</span>
      {label}
      {count !== undefined && (
        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${active ? 'bg-accent text-white' : 'bg-bg text-fg-muted'}`}>{count}</span>
      )}
    </button>
  );
}

function IGlobe() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke="currentColor" strokeWidth="1.8" /></svg>; }
function IClock() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }
function IUsers() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IContact() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M6 19a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.8" /></svg>; }
function INotes() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
