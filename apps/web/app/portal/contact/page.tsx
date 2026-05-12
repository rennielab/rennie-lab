'use client';

import { PortalShell } from '@/components/PortalShell';
import { firm, lawyers } from '@/lib/mock';

export default function PortalContact() {
  return (
    <PortalShell title="Contact your firm" subtitle={firm.name}>
      <div className="grid grid-cols-3 gap-4">
        {lawyers.map((l) => (
          <div key={l.id} className="bg-card border border-border rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center font-bold text-lg mx-auto mb-3">
              {l.initials}
            </div>
            <div className="font-bold">{l.name}</div>
            <div className="text-sm text-fg-muted">{l.role}</div>
            <div className="mt-4 space-y-1 text-sm">
              <div className="text-fg-muted">{l.name.split(' ')[0].toLowerCase()}@bennetthayes.law</div>
              <div className="text-fg-muted">+1 (415) 555-0100</div>
            </div>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}
