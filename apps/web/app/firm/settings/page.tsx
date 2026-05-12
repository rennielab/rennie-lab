'use client';

import { useState } from 'react';

import { FirmShell } from '@/components/FirmShell';
import { currentFirmUser, firm } from '@/lib/mock';

type Section = 'personal' | 'notifications' | 'security';

const SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'personal', label: 'Personal details', icon: <IUser /> },
  { key: 'notifications', label: 'Notifications', icon: <IBell /> },
  { key: 'security', label: 'Privacy & security', icon: <ILock /> },
];

export default function FirmSettings() {
  const [active, setActive] = useState<Section>('personal');
  return (
    <FirmShell title="Settings" subtitle="Personal preferences. Firm-level settings live with the admin.">
      <div className="grid grid-cols-4 gap-4 max-w-4xl">
        <div className="col-span-1 space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
                active === s.key ? 'bg-card border border-border text-accent' : 'text-fg-muted hover:text-fg hover:bg-card/60'
              }`}>
              <span className={active === s.key ? 'text-accent' : 'text-fg-muted'}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div className="col-span-3">
          {active === 'personal' && (
            <Card title="Personal details" subtitle="Update how you appear inside Clockd and on client-facing invoices.">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full name" value={currentFirmUser.name} />
                <Field label="Role" value={currentFirmUser.role} />
                <Field label="Email" value="sophia.williams@bennetthayes.law" />
                <Field label="Phone" value="+1 (415) 555-0199" />
                <Field label="Default hourly rate" value="$350/hr" sub="Marcus can override per matter" />
                <Field label="Time zone" value="America/Los_Angeles" />
              </div>
              <div className="text-xs text-fg-muted mt-4">
                You belong to <span className="font-semibold text-fg">{firm.name}</span>. Firm-level details (logo, address, billing) are managed by your admin.
              </div>
              <SaveBar />
            </Card>
          )}

          {active === 'notifications' && (
            <Card title="Notifications" subtitle="What pings your bell and what hits your inbox.">
              <div className="space-y-3">
                <Toggle label="Entry sent back for revision" sub="Bell + email — high priority" defaultOn />
                <Toggle label="Entry approved" sub="Bell only" defaultOn />
                <Toggle label="Added to a new matter" sub="Bell + email" defaultOn />
                <Toggle label="Friday reminder to submit time" sub="Email — Fridays at 4 PM" defaultOn />
                <Toggle label="Mentioned in a note" sub="Bell + email" defaultOn />
              </div>
            </Card>
          )}

          {active === 'security' && (
            <>
              <Card title="Password">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Last changed 28 days ago</div>
                    <div className="text-xs text-fg-muted">Use a unique password 12+ characters long.</div>
                  </div>
                  <button className="h-9 px-4 rounded-lg border border-border text-sm font-medium">Change password</button>
                </div>
              </Card>
              <Card title="Two-factor authentication">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Enabled · Authenticator app</div>
                    <div className="text-xs text-fg-muted">Required by firm policy for all staff.</div>
                  </div>
                  <button className="h-9 px-4 rounded-lg border border-border text-sm font-medium">Manage</button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </FirmShell>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-4">
      <div className="mb-5">
        <div className="text-base font-semibold">{title}</div>
        {subtitle && <div className="text-sm text-fg-muted mt-0.5">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-fg-muted">{label}</span>
      <input
        defaultValue={value}
        className="mt-1.5 w-full h-10 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />
      {sub && <span className="text-[11px] text-fg-subtle block mt-1">{sub}</span>}
    </label>
  );
}

function SaveBar() {
  return (
    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
      <button className="h-10 px-4 rounded-lg border border-border text-sm font-medium">Cancel</button>
      <button className="h-10 px-4 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold">Save changes</button>
    </div>
  );
}

function Toggle({ label, sub, defaultOn }: { label: string; sub: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div>
        <div className="text-sm font-medium text-fg">{label}</div>
        <div className="text-xs text-fg-muted">{sub}</div>
      </div>
      <button onClick={(e) => { e.preventDefault(); setOn((o) => !o); }} className={`relative w-10 h-6 rounded-full transition ${on ? 'bg-accent' : 'bg-border-strong'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${on ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </label>
  );
}

function IUser() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IBell() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ILock() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" /></svg>; }
