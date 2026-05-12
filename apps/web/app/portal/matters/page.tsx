'use client';

import { PortalShell } from '@/components/PortalShell';
import { formatHours, matters, seedEntries } from '@/lib/mock';

export default function PortalMatters() {
  // Show only matters for "Reyes Family Trust" (the client we're impersonating)
  const myMatters = matters.filter((m) => m.clientId === 'cli_reyes');

  return (
    <PortalShell title="Your matters" subtitle="Active matters at Bennett & Hayes LLP.">
      <div className="grid grid-cols-2 gap-4">
        {myMatters.map((m) => {
          const hours = seedEntries.filter((e) => e.matterId === m.id).reduce((a, e) => a + e.durationSec, 0);
          return (
            <div key={m.id} className="bg-card border border-border rounded-2xl p-6 hover:border-accent transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs text-fg-muted">Matter</div>
                  <h3 className="font-bold text-lg mt-1">{m.name}</h3>
                </div>
                <span className="px-2 py-0.5 text-xs rounded-full bg-accent-soft text-accent-dark font-semibold">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-fg-muted">Hours billed</div>
                  <div className="font-bold mt-0.5">{formatHours(hours)}</div>
                </div>
                <div>
                  <div className="text-xs text-fg-muted">Rate</div>
                  <div className="font-bold mt-0.5">${m.rate}/hr</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PortalShell>
  );
}
