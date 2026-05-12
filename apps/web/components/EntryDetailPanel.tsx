'use client';

import { useState } from 'react';

import {
  clientById,
  contactById,
  formatDuration,
  formatMoney,
  lawyerById,
  matterById,
  TimeEntry,
} from '@/lib/mock';

const AVATAR_TINTS: Record<string, { bg: string; fg: string }> = {
  // Deterministic color per first-letter
  A: { bg: '#FEE2E2', fg: '#B91C1C' },
  B: { bg: '#FEF3C7', fg: '#92400E' },
  C: { bg: '#FED7AA', fg: '#9A3412' },
  D: { bg: '#DBEAFE', fg: '#1D4ED8' },
  E: { bg: '#E0E7FF', fg: '#4338CA' },
  J: { bg: '#FFE4E6', fg: '#9F1239' },
  L: { bg: '#FFE4E6', fg: '#9F1239' },
  M: { bg: '#FED7AA', fg: '#9A3412' },
  R: { bg: '#E9D5FF', fg: '#6D28D9' },
  S: { bg: '#FEE2E2', fg: '#B91C1C' },
  W: { bg: '#DCFCE7', fg: '#166534' },
};

function Avatar({ initials, size = 28 }: { initials: string; size?: number }) {
  const tint = AVATAR_TINTS[initials[0] ?? 'A'] ?? { bg: '#F3F4F6', fg: '#4B5563' };
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.4, background: tint.bg, color: tint.fg }}
      className="inline-flex items-center justify-center rounded-full font-bold shrink-0">
      {initials}
    </span>
  );
}

export function EntryDetailPanel({
  entry,
  onClose,
  onApprove,
  onReject,
  onSaveEdits,
  onGenerateInvoice,
}: {
  entry: TimeEntry;
  onClose: () => void;
  onApprove: () => void;
  onReject?: (reason: string) => void;
  onSaveEdits?: (description: string, nonBillable: boolean) => void;
  onGenerateInvoice: () => void;
}) {
  const matter = matterById(entry.matterId)!;
  const client = clientById(matter.clientId)!;
  const lawyer = lawyerById(entry.lawyerId)!;
  const contact = entry.contactId ? contactById(entry.contactId) : undefined;
  const billable = (matter.rate * entry.durationSec) / 3600;
  const isConfirmed = entry.status === 'approved';
  const isRejected = (entry.status as string) === 'rejected';

  const [editing, setEditing] = useState(false);
  const [draftDesc, setDraftDesc] = useState(entry.description);
  const [draftNonBillable, setDraftNonBillable] = useState(entry.nonBillable);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const startTime = new Date(entry.createdAt);
  const endTime = new Date(entry.createdAt + entry.durationSec * 1000);
  const fmtTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Time Entry</h2>
          <StatusPill status={entry.status} />
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-bg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-border">
        <div className="flex gap-6">
          <TabButton active>Details</TabButton>
          <TabButton>Activity</TabButton>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Big timer */}
        <div className="text-4xl font-bold tabular-nums tracking-tight mb-6">
          {formatDuration(entry.durationSec)}
        </div>

        <div className="space-y-3">
          <Row label="Date" value={fmtDate(startTime)} />
          <Row label="Time" value={`${fmtTime(startTime)} - ${fmtTime(endTime)}`} />
          <Row
            label="Lawyer"
            value={
              <div className="flex items-center gap-2">
                <Avatar initials={lawyer.initials} />
                <span className="font-medium">{lawyer.name}</span>
              </div>
            }
          />
          <Row
            label="Client"
            value={
              <div className="flex items-center gap-2">
                <Avatar initials={client.name[0] ?? 'C'} />
                <span className="font-medium">{client.name}</span>
              </div>
            }
          />
          <Row
            label="Matter"
            value={
              <div className="flex items-center gap-2">
                <BriefcaseIcon />
                <span className="font-medium">{matter.shortName}</span>
              </div>
            }
          />
          <Row
            label="Activity"
            value={
              <div className="flex items-center gap-2">
                {entry.source === 'call' ? <CallIcon /> : <TimerIcon />}
                <span className="font-medium capitalize">{entry.source}</span>
              </div>
            }
          />
          <Row
            label="Billable"
            value={
              entry.nonBillable ? (
                <span className="text-warning font-medium">No · Non-billable</span>
              ) : (
                <span>
                  <span className="text-accent font-semibold">Yes</span> · ${matter.rate}/hr · {formatMoney(billable)} total
                </span>
              )
            }
          />
          {isConfirmed && (
            <Row
              label="Approved by"
              value={
                <div className="flex items-center gap-2">
                  <Avatar initials="MH" />
                  <span className="font-medium">Marcus Hayes</span>
                </div>
              }
            />
          )}
        </div>

        {/* Description */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-fg-muted">
              {entry.source === 'call' ? 'AI-summarized notes' : 'Notes'}
            </div>
            {!editing && onSaveEdits && !isRejected && (
              <button onClick={() => setEditing(true)} className="text-xs font-medium text-accent hover:underline">
                Edit
              </button>
            )}
          </div>
          {editing ? (
            <div className="space-y-3">
              <textarea
                value={draftDesc}
                onChange={(e) => setDraftDesc(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
              />
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={draftNonBillable}
                  onChange={(e) => setDraftNonBillable(e.target.checked)}
                  className="w-4 h-4 accent-[#22C55E]"
                />
                <span className="text-sm">Mark as non-billable</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onSaveEdits?.(draftDesc, draftNonBillable);
                    setEditing(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold">
                  Save &amp; approve
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setDraftDesc(entry.description);
                    setDraftNonBillable(entry.nonBillable);
                  }}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{entry.description}</p>
          )}
        </div>

        {/* Reject form */}
        {rejecting && (
          <div className="mt-6 bg-danger-soft border border-danger/30 rounded-xl p-4">
            <div className="text-sm font-semibold text-danger mb-2">Reject this entry</div>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason — sent to the lawyer so they can fix and resubmit."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  if (!rejectReason.trim()) return;
                  onReject?.(rejectReason);
                  setRejecting(false);
                  setRejectReason('');
                }}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 rounded-lg bg-danger text-white text-sm font-semibold disabled:opacity-50">
                Send back to lawyer
              </button>
              <button
                onClick={() => { setRejecting(false); setRejectReason(''); }}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Call recording */}
        {entry.source === 'call' && contact && (
          <div className="mt-6 bg-bg border border-border rounded-xl p-4 flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-dim transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">
                Call with {contact.firstName} {contact.lastName}
              </div>
              <div className="text-xs text-fg-muted">
                {formatDuration(entry.durationSec)} · Encrypted · Auto-transcribed
              </div>
            </div>
          </div>
        )}

        {/* Confirmed banner */}
        {isConfirmed && (
          <div className="mt-6 bg-warning-soft border border-warning/30 rounded-xl px-4 py-3 flex gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-warning">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="text-xs text-fg">
              This entry has been approved. Partners and admins may still edit or override approved entries.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4 flex items-center gap-2">
        {!isConfirmed && !isRejected ? (
          <>
            <button
              onClick={onApprove}
              className="flex-1 bg-accent hover:bg-accent-dim text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Approve entry
            </button>
            {onReject && (
              <button
                onClick={() => setRejecting(true)}
                className="px-4 py-3 rounded-lg border border-danger/30 bg-card hover:bg-danger-soft text-danger text-sm font-semibold">
                Reject
              </button>
            )}
          </>
        ) : isRejected ? (
          <div className="flex-1 text-sm text-danger font-semibold text-center py-3">Sent back to lawyer for revision</div>
        ) : (
          <button
            onClick={onGenerateInvoice}
            className="flex-1 bg-accent hover:bg-accent-dim text-white font-semibold text-sm py-3 rounded-lg">
            Generate Invoice →
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

function TabButton({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`flex items-center gap-2 py-3 text-sm font-semibold border-b-2 -mb-px transition ${
        active ? 'border-accent text-accent' : 'border-transparent text-fg-muted hover:text-fg'
      }`}>
      {children === 'Details' ? <DetailsIcon /> : <ActivityIcon />}
      {children}
    </button>
  );
}

function StatusPill({ status }: { status: 'approved' | 'pending' | 'draft' }) {
  if (status === 'approved')
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-accent-soft text-accent-dark">Approved</span>;
  if (status === 'pending')
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-soft text-warning">Pending</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-bg text-fg-muted">Draft</span>;
}

function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-fg-muted">
      <path d="M4 7h16v13H4zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent">
      <path d="M22 16.92V20a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3.09a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TimerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-fg-muted">
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 9v4l2 2M9 2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function DetailsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
