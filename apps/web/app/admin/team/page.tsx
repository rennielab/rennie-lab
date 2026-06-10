'use client';

// Team — manage the firm's people. Per Dana 2026-05-26: permission roles are
// exactly "Admin" and "User" (the old "Staff" label is gone), and every row
// gets an Edit action so admins can change rates and details in place.

import { useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import { formatHoursH, formatMoneyCompact, lawyers, matters, seedEntries } from '@/lib/mock';

const TINTS: Record<string, { bg: string; fg: string }> = {
  J: { bg: '#FEE2E2', fg: '#B91C1C' },
  S: { bg: '#DBEAFE', fg: '#1D4ED8' },
  M: { bg: '#FED7AA', fg: '#9A3412' },
  D: { bg: '#E0E7FF', fg: '#4338CA' },
};

type Permission = 'Admin' | 'User';

type Member = {
  id: string;
  name: string;
  initials: string;
  role: string;
  perms: Permission;
  rate: number;
  status: 'Active' | 'Invited' | 'Inactive';
  mattersCount: number;
};

const INITIAL_TEAM: Member[] = [
  ...lawyers.map((l) => ({
    id: l.id,
    name: l.name,
    initials: l.initials,
    role: l.role,
    perms: (l.id === 'lwy_marc' || l.id === 'lwy_jord' ? 'Admin' : 'User') as Permission,
    rate: { lwy_jord: 650, lwy_sara: 275, lwy_marc: 800, lwy_soph: 350 }[l.id] ?? 350,
    status: 'Active' as const,
    mattersCount: { lwy_jord: 5, lwy_sara: 4, lwy_marc: 2, lwy_soph: 3 }[l.id] ?? 0,
  })),
  {
    id: 'lwy_david',
    name: 'David Okafor',
    initials: 'DO',
    role: 'Associate',
    perms: 'User',
    rate: 200,
    status: 'Invited',
    mattersCount: 1,
  },
];

export default function Team() {
  const [team, setTeam] = useState<Member[]>(INITIAL_TEAM);
  const [editing, setEditing] = useState<Member | null>(null);

  function saveMember(updated: Member) {
    setTeam((t) => t.map((m) => (m.id === updated.id ? updated : m)));
    setEditing(null);
  }

  return (
    <AdminShell
      title="Team"
      subtitle="Admins and users at your firm."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> Invite Member
        </button>
      }>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input placeholder="Search team..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_110px_90px_90px_110px_120px_110px_70px] gap-3 px-6 py-3 border-b border-border text-xs font-semibold text-fg-muted uppercase tracking-wide">
          <div>Name</div>
          <div>Permissions</div>
          <div className="text-right">Matters</div>
          <div className="text-right">Rate</div>
          <div className="text-right">Hours MTD</div>
          <div className="text-right">Billed MTD</div>
          <div className="text-center">Status</div>
          <div></div>
        </div>
        {team.map((m) => {
          const tint = TINTS[m.initials[0]] ?? { bg: '#F3F4F6', fg: '#4B5563' };
          const totalSec = seedEntries.filter((e) => e.lawyerId === m.id).reduce((a, e) => a + e.durationSec, 0);
          const billedDollars = seedEntries
            .filter((e) => e.lawyerId === m.id && !e.nonBillable)
            .reduce((a, e) => {
              const mt = matters.find((mm) => mm.id === e.matterId);
              return a + (mt ? (mt.rate * e.durationSec) / 3600 : 0);
            }, 0);
          return (
            <div
              key={m.id}
              className="grid grid-cols-[2fr_110px_90px_90px_110px_120px_110px_70px] gap-3 items-center px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/50">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  style={{ background: tint.bg, color: tint.fg }}
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {m.initials}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{m.name}</div>
                  <div className="text-xs text-fg-muted truncate">{m.role}</div>
                </div>
              </div>
              <div>
                <PermissionPill perms={m.perms} />
              </div>
              <div className="text-sm tabular-nums text-right">{m.mattersCount}</div>
              <div className="text-sm font-semibold tabular-nums text-right">${m.rate}/hr</div>
              <div className="text-sm tabular-nums text-right">
                {totalSec > 0 ? formatHoursH(totalSec) : <span className="text-fg-subtle">—</span>}
              </div>
              <div className="text-sm tabular-nums text-right">
                {billedDollars > 0 ? formatMoneyCompact(billedDollars) : <span className="text-fg-subtle">—</span>}
              </div>
              <div className="flex justify-center">
                <TeamStatus status={m.status} />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setEditing(m)}
                  className="h-8 px-3 rounded-lg border border-border bg-card hover:bg-bg text-xs font-semibold">
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && <EditMemberModal member={editing} onSave={saveMember} onClose={() => setEditing(null)} />}
    </AdminShell>
  );
}

function EditMemberModal({
  member,
  onSave,
  onClose,
}: {
  member: Member;
  onSave: (m: Member) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [rate, setRate] = useState(String(member.rate));
  const [perms, setPerms] = useState<Permission>(member.perms);
  const [status, setStatus] = useState(member.status);

  const canSave = name.trim().length > 0 && Number(rate) > 0;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[440px] bg-card border border-border rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="text-lg font-semibold">Edit user</div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-bg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-fg-muted">Full name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-fg-muted">Title / role at firm</span>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1.5 w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-fg-muted">Hourly rate ($)</span>
              <input
                type="number"
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-border bg-card text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-fg-muted">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Member['status'])}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
                <option>Active</option>
                <option>Invited</option>
                <option>Inactive</option>
              </select>
            </label>
          </div>

          <div>
            <span className="text-xs font-semibold text-fg-muted">Permissions</span>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {(['Admin', 'User'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPerms(p)}
                  className={`h-11 rounded-lg border text-sm font-medium ${
                    perms === p ? 'border-accent bg-accent-soft text-accent-dark' : 'border-border bg-card hover:bg-bg'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
            <p className="text-xs text-fg-muted mt-1.5">
              Admins approve time, issue invoices, and manage the firm. Users log time and work matters.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="h-10 px-4 rounded-lg border border-border text-sm font-semibold">
            Cancel
          </button>
          <button
            onClick={() => canSave && onSave({ ...member, name, role, rate: Number(rate), perms, status })}
            disabled={!canSave}
            className="h-10 px-5 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold disabled:opacity-50">
            Save changes
          </button>
        </div>
      </div>
    </>
  );
}

function PermissionPill({ perms }: { perms: Permission }) {
  return (
    <span
      className={`px-2.5 py-1 text-xs rounded-md font-semibold border ${
        perms === 'Admin' ? 'border-accent text-accent-dark bg-accent-soft/40' : 'border-border text-fg-muted bg-bg'
      }`}>
      {perms}
    </span>
  );
}

function TeamStatus({ status }: { status: 'Active' | 'Invited' | 'Inactive' }) {
  const map = {
    Active: 'bg-accent-soft text-accent-dark',
    Invited: 'bg-warning-soft text-warning',
    Inactive: 'bg-bg text-fg-muted',
  } as const;
  return <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${map[status]}`}>{status}</span>;
}
