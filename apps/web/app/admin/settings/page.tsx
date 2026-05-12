'use client';

import { useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import { currentAdmin, firm } from '@/lib/mock';

type Section = 'personal' | 'firm' | 'billing' | 'notifications' | 'security';

const SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'personal', label: 'Personal details', icon: <IUser /> },
  { key: 'firm', label: 'Firm details', icon: <IBuilding /> },
  { key: 'billing', label: 'Billing & subscription', icon: <ICard /> },
  { key: 'notifications', label: 'Notifications', icon: <IBell /> },
  { key: 'security', label: 'Privacy & security', icon: <ILock /> },
];

export default function Settings() {
  const [active, setActive] = useState<Section>('personal');

  return (
    <AdminShell title="Settings" subtitle="Firm and personal preferences.">
      <div className="grid grid-cols-4 gap-4 max-w-5xl">
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
          {active === 'personal' && <PersonalSection />}
          {active === 'firm' && <FirmSection />}
          {active === 'billing' && <BillingSection />}
          {active === 'notifications' && <NotificationsSection />}
          {active === 'security' && <SecuritySection />}
        </div>
      </div>
    </AdminShell>
  );
}

function PersonalSection() {
  return (
    <Card title="Personal details" subtitle="Update how you appear inside Clockd.">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full name" value={currentAdmin.name} />
        <Field label="Role" value={currentAdmin.role} />
        <Field label="Email" value="marcus@bennetthayes.law" />
        <Field label="Phone" value="+1 (415) 555-0190" />
        <Field label="Hourly rate" value="$800/hr" />
        <Field label="Time zone" value="America/Los_Angeles" />
      </div>
      <SaveBar />
    </Card>
  );
}

function FirmSection() {
  return (
    <>
      <Card title="Firm details" subtitle="Information shown on invoices, client portal, and emails.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Firm name" value={firm.name} />
          <Field label="Location" value={firm.location} />
          <Field label="Primary email" value="contact@bennetthayes.law" />
          <Field label="Phone" value="+1 (415) 555-0120" />
          <Field label="Address" value="100 Market Street, Suite 2400, SF CA 94105" full />
          <Field label="EIN / Tax ID" value="••-•••6741" />
          <Field label="Default invoice terms" value="Net 30" />
        </div>
        <SaveBar />
      </Card>

      <Card title="Branding" subtitle="Your logo appears on the client portal and PDF invoices.">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-bg border border-border flex items-center justify-center font-bold text-fg-muted">
            BH
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">bennett-hayes-logo.svg</div>
            <div className="text-xs text-fg-muted">PNG or SVG, max 2 MB</div>
          </div>
          <button className="h-9 px-4 rounded-lg border border-border text-sm font-medium">Replace</button>
        </div>
      </Card>
    </>
  );
}

function BillingSection() {
  return (
    <>
      <Card title="Subscription">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-soft text-accent-dark text-xs font-bold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> ACTIVE
            </div>
            <div className="text-2xl font-semibold tracking-tight">Clockd Firm — Annual</div>
            <div className="text-sm text-fg-muted mt-1">$49/seat/month · 5 seats · renews Jan 15, 2027</div>
          </div>
          <button className="h-10 px-4 rounded-lg border border-border text-sm font-medium">Manage plan</button>
        </div>
      </Card>

      <Card title="Payment method">
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 rounded bg-fg flex items-center justify-center text-white font-bold text-[10px]">VISA</div>
          <div className="flex-1">
            <div className="text-sm font-medium">•••• 4242</div>
            <div className="text-xs text-fg-muted">Expires 09/27</div>
          </div>
          <button className="h-9 px-4 rounded-lg border border-border text-sm font-medium">Update</button>
        </div>
      </Card>
    </>
  );
}

function NotificationsSection() {
  return (
    <Card title="Notifications" subtitle="Choose what gets emailed and what appears in your bell.">
      <div className="space-y-3">
        <Toggle label="New time entry submitted by team" sub="Bell + daily digest email" defaultOn />
        <Toggle label="Invoice paid" sub="Bell + email" defaultOn />
        <Toggle label="Invoice overdue (weekly)" sub="Bell + weekly summary email" defaultOn />
        <Toggle label="Client message received" sub="Bell + email" defaultOn />
        <Toggle label="Matter stage changed" sub="Bell only" />
      </div>
    </Card>
  );
}

function SecuritySection() {
  return (
    <>
      <Card title="Password">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Last changed 3 months ago</div>
            <div className="text-xs text-fg-muted">Use a unique password 12+ characters long.</div>
          </div>
          <button className="h-9 px-4 rounded-lg border border-border text-sm font-medium">Change password</button>
        </div>
      </Card>
      <Card title="Two-factor authentication">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Not enabled</div>
            <div className="text-xs text-fg-muted">Required for admins. Set this up before your next login.</div>
          </div>
          <button className="h-9 px-4 rounded-lg bg-accent text-white text-sm font-semibold">Enable 2FA</button>
        </div>
      </Card>
      <Card title="Sessions">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">1 active session</div>
            <div className="text-xs text-fg-muted">macOS · Chrome · San Francisco, CA</div>
          </div>
          <button className="h-9 px-4 rounded-lg border border-border text-sm font-medium">Sign out all other sessions</button>
        </div>
      </Card>
    </>
  );
}

// ---------- Reusable components ----------

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-4">
      <div className="mb-5">
        <div className="text-base font-semibold text-fg">{title}</div>
        {subtitle && <div className="text-sm text-fg-muted mt-0.5">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <label className={`block ${full ? 'col-span-2' : ''}`}>
      <span className="text-xs text-fg-muted">{label}</span>
      <input
        defaultValue={value}
        className="mt-1.5 w-full h-10 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />
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
      <button
        onClick={(e) => { e.preventDefault(); setOn((o) => !o); }}
        className={`relative w-10 h-6 rounded-full transition ${on ? 'bg-accent' : 'bg-border-strong'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${on ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </label>
  );
}

function IUser() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IBuilding() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ICard() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" /></svg>; }
function IBell() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ILock() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" /></svg>; }
