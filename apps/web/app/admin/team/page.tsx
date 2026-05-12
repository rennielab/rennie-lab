'use client';

import { AdminShell } from '@/components/AdminShell';
import { formatHours, lawyers, seedEntries } from '@/lib/mock';

export default function Team() {
  return (
    <AdminShell
      title="Team"
      subtitle="Lawyers and staff at your firm."
      action={
        <button className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 py-2.5 rounded-lg">
          + Invite Team Member
        </button>
      }>
      <div className="grid grid-cols-3 gap-4">
        {lawyers.map((l) => {
          const hours = seedEntries.filter((e) => e.lawyerId === l.id).reduce((a, e) => a + e.durationSec, 0);
          return (
            <div key={l.id} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent-soft text-accent flex items-center justify-center font-bold">
                  {l.initials}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{l.name}</div>
                  <div className="text-sm text-fg-muted">{l.role}</div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-bg rounded-lg px-2 py-1.5">
                      <div className="text-fg-muted">Hours (30d)</div>
                      <div className="font-bold">{formatHours(hours)}</div>
                    </div>
                    <div className="bg-bg rounded-lg px-2 py-1.5">
                      <div className="text-fg-muted">Status</div>
                      <div className="font-bold text-accent">Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
