'use client';

import { PortalShell } from '@/components/PortalShell';
import { formatHours, formatMoney } from '@/lib/mock';

type Stage = 'Intake' | 'In Progress' | 'Judgement' | 'Closed';

const myMatters: { id: string; name: string; stages: Stage[]; hours: number; billed: number; paid: number; outstanding: number; createdAt: string; lastActivity: string }[] = [
  { id: 'm1', name: 'IP — Patent Filing', stages: ['Intake', 'In Progress'], hours: 20 * 3600 + 43 * 60, billed: 5572, paid: 3000, outstanding: 2572, createdAt: '15 Oct 2025', lastActivity: '21 Feb 2026, 2:34 PM' },
  { id: 'm2', name: 'Corporate — Contract Review', stages: ['Intake', 'In Progress'], hours: 12 * 3600 + 15 * 60, billed: 3060, paid: 1500, outstanding: 1560, createdAt: '15 Oct 2025', lastActivity: '21 Feb 2026, 2:34 PM' },
  { id: 'm3', name: 'Reyes v. Horizon — Wrongful Termination', stages: ['Judgement', 'Closed'], hours: 20 * 3600 + 43 * 60, billed: 5572, paid: 5572, outstanding: 0, createdAt: '15 Oct 2025', lastActivity: '21 Feb 2026, 2:34 PM' },
];

const TEAM_AVATARS = [
  { bg: '#FEE2E2', fg: '#B91C1C', initials: 'JB' },
  { bg: '#DBEAFE', fg: '#1D4ED8', initials: 'SC' },
  { bg: '#FEF3C7', fg: '#92400E', initials: 'MH' },
];

export default function PortalMatters() {
  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Matters</h1>
        <p className="text-sm text-fg-muted mt-1">Reyes Family Trust — Bennett &amp; Hayes LLP</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {myMatters.map((m) => (
          <div key={m.id} className="bg-card border border-border rounded-2xl p-6 hover:border-accent transition cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold flex-1 mr-2">{m.name}</h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-fg-muted shrink-0">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex items-center gap-2 mb-5">
              {m.stages.map((s, i) => (
                <StagePill key={i} stage={s} />
              ))}
            </div>

            <div className="flex items-end gap-6 mb-4">
              <div>
                <div className="text-xs text-fg-muted mb-0.5">Hours</div>
                <div className="text-xl font-bold tabular-nums">{formatHours(m.hours)}</div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-fg-muted mb-0.5">Billed</div>
                <div className="text-xl font-bold tabular-nums">{formatMoney(m.billed)}</div>
              </div>
              <div>
                <div className="text-xs text-fg-muted mb-1">Team</div>
                <div className="flex -space-x-2">
                  {TEAM_AVATARS.map((a, i) => (
                    <span
                      key={i}
                      style={{ background: a.bg, color: a.fg }}
                      className="w-7 h-7 rounded-full ring-2 ring-card flex items-center justify-center text-[10px] font-bold">
                      {a.initials}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-sm pt-4 border-t border-border">
              <Row label="Paid" value={formatMoney(m.paid)} valueClass="text-accent" />
              <Row label="Outstanding" value={formatMoney(m.outstanding)} valueClass={m.outstanding > 0 ? 'text-warning' : ''} />
              <Row label="Created" value={m.createdAt} />
              <Row label="Last Activity" value={m.lastActivity} />
            </div>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}

function Row({ label, value, valueClass = '' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-fg-muted">{label}</span>
      <span className={`font-semibold tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}

function StagePill({ stage }: { stage: Stage }) {
  const map: Record<Stage, string> = {
    Intake: 'border-blue-500 text-blue-700 bg-blue-50',
    'In Progress': 'border-accent text-accent-dark bg-accent-soft',
    Judgement: 'border-purple-500 text-purple-700 bg-purple-50',
    Closed: 'border-gray-400 text-gray-700 bg-gray-100',
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${map[stage]}`}>{stage}</span>
  );
}
