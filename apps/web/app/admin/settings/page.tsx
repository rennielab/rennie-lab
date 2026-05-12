'use client';

import { AdminShell } from '@/components/AdminShell';
import { currentAdmin, firm } from '@/lib/mock';

export default function Settings() {
  return (
    <AdminShell title="Settings" subtitle="Firm and personal settings.">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-1">
          {['Personal', 'Firm', 'Notifications', 'Billing & Subscription', 'Privacy & Security'].map((t, i) => (
            <button
              key={t}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                i === 0 ? 'bg-card border border-border text-accent' : 'text-fg-muted hover:text-fg'
              }`}>
              {t}
            </button>
          ))}
        </div>
        <div className="col-span-3 bg-card border border-border rounded-2xl p-8">
          <h3 className="font-bold text-lg mb-6">Personal details</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name" value={currentAdmin.name} />
            <Field label="Role" value={currentAdmin.role} />
            <Field label="Firm" value={firm.name} />
            <Field label="Email" value="marcus@bennetthayes.law" />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-fg-muted font-semibold">{label}</span>
      <input
        defaultValue={value}
        className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-sm"
      />
    </label>
  );
}
