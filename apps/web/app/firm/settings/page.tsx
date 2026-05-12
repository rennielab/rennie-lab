'use client';

import { FirmShell } from '@/components/FirmShell';

const SECTIONS = [
  { title: 'Business Details', desc: 'Firm name, logo, address, tax info' },
  { title: 'Personal Details', desc: 'Your name, photo, contact info' },
  { title: 'Privacy & Security', desc: 'Password, two-factor, sessions' },
  { title: 'Notifications', desc: 'Email and in-app alerts' },
];

export default function FirmSettings() {
  return (
    <FirmShell title="Settings" subtitle="Manage your firm and personal preferences.">
      <div className="grid grid-cols-2 gap-3">
        {SECTIONS.map((s) => (
          <div key={s.title} className="bg-card border border-border rounded-2xl px-6 py-5">
            <div className="text-base font-semibold text-fg mb-1">{s.title}</div>
            <p className="text-sm text-fg-muted">{s.desc}</p>
            <button className="mt-3 text-sm font-medium text-accent hover:underline">Configure →</button>
          </div>
        ))}
      </div>
    </FirmShell>
  );
}
