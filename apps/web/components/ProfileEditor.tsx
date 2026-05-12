'use client';

import { useState } from 'react';

export type ProfilePerson = {
  name: string;
  role: string;
  avatarUrl: string;
  email: string;
  phone: string;
  bio: string;
  org: string;
  orgSub?: string;
};

export function ProfileEditor({ person, signOutHref = '/' }: { person: ProfilePerson; signOutHref?: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-3xl">
      {/* Avatar + identity card */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-4">
        <div className="flex items-start gap-5 mb-6">
          <div className="relative">
            <img src={person.avatarUrl} alt={person.name} className="w-24 h-24 rounded-full bg-bg ring-2 ring-border" />
            <button
              title="Change photo"
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent text-white border-2 border-card flex items-center justify-center hover:bg-accent-dim">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <div className="text-xl font-semibold text-fg">{person.name}</div>
            <div className="text-sm text-fg-muted">{person.role}</div>
            <div className="text-xs text-fg-subtle mt-1">{person.org}{person.orgSub ? ` · ${person.orgSub}` : ''}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Full name" defaultValue={person.name} />
          <Field label="Role / title" defaultValue={person.role} />
          <Field label="Email" defaultValue={person.email} />
          <Field label="Phone" defaultValue={person.phone} />
        </div>

        <div className="mt-4">
          <label className="block">
            <span className="text-xs text-fg-muted">Bio</span>
            <textarea
              defaultValue={person.bio}
              rows={4}
              className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-border">
          {saved && <span className="text-sm font-medium text-accent">Saved ✓</span>}
          <button className="h-10 px-4 rounded-lg border border-border text-sm font-medium">Cancel</button>
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }}
            className="h-10 px-4 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold">
            Save changes
          </button>
        </div>
      </div>

      {/* Quick prefs */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-4">
        <div className="text-sm font-semibold mb-4">Preferences</div>
        <Pref label="Notify me by email" sub="Daily digest at 8 AM PT" defaultOn />
        <Pref label="Show me in the campfire room" sub="Other users see your online status" defaultOn />
        <Pref label="Use my photo on invoices" sub="Where applicable" />
      </div>

      {/* Sign out */}
      <div className="flex justify-end">
        <a href={signOutHref} className="text-sm font-medium text-danger hover:underline inline-flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign out
        </a>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-xs text-fg-muted">{label}</span>
      <input
        defaultValue={defaultValue}
        className="mt-1.5 w-full h-10 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />
    </label>
  );
}

function Pref({ label, sub, defaultOn }: { label: string; sub: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer py-2 first:pt-0 last:pb-0">
      <div>
        <div className="text-sm font-medium text-fg">{label}</div>
        <div className="text-xs text-fg-muted">{sub}</div>
      </div>
      <button onClick={(e) => { e.preventDefault(); setOn((o) => !o); }} className={`relative w-10 h-6 rounded-full transition shrink-0 ${on ? 'bg-accent' : 'bg-border-strong'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${on ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </label>
  );
}
