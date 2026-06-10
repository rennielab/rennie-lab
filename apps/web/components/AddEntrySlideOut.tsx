'use client';

import { useEffect, useState } from 'react';

import { matters, clients } from '@/lib/mock';
import { addDraft, submitDraft } from '@/lib/firmState';

export function AddEntrySlideOut({
  open,
  onClose,
  defaultMatterId,
  prefillSec,
}: {
  open: boolean;
  onClose: () => void;
  defaultMatterId?: string;
  prefillSec?: number;
}) {
  const [matterId, setMatterId] = useState(defaultMatterId ?? matters[0]?.id ?? '');
  const [hours, setHours] = useState('0');
  const [mins, setMins] = useState('30');
  const [description, setDescription] = useState('');
  const [nonBillable, setNonBillable] = useState(false);
  const [activity, setActivity] = useState<'call' | 'email' | 'document' | 'text'>('call');

  useEffect(() => {
    if (open) {
      setMatterId(defaultMatterId ?? matters[0]?.id ?? '');
      if (prefillSec && prefillSec > 0) {
        setHours(String(Math.floor(prefillSec / 3600)));
        setMins(String(Math.floor((prefillSec % 3600) / 60)));
      } else {
        setHours('0');
        setMins('30');
      }
      setDescription('');
      setNonBillable(false);
      setActivity('call');
    }
  }, [open, defaultMatterId, prefillSec]);

  if (!open) return null;

  const durationSec = (Number(hours) || 0) * 3600 + (Number(mins) || 0) * 60;
  const matter = matters.find((m) => m.id === matterId);
  const client = matter ? clients.find((c) => c.id === matter.clientId) : undefined;
  const value = matter && !nonBillable ? (matter.rate * durationSec) / 3600 : 0;
  const canSave = !!matterId && durationSec > 0 && description.trim().length > 0;

  function commit(action: 'save' | 'submit') {
    if (!canSave) return;
    const id = addDraft({
      matterId,
      durationSec,
      description,
      nonBillable,
      source: activity === 'call' ? 'call' : 'manual',
      activity,
    });
    if (action === 'submit') submitDraft(id);
    onClose();
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
      <div className="fixed top-0 right-0 bottom-0 z-50 w-[480px] bg-card border-l border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <div className="text-lg font-semibold">Manual time entry</div>
            <div className="text-xs text-fg-muted mt-0.5">Log time you&apos;ve already worked — save as draft or submit for approval.</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-bg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Activity — Dana 2026-05-26: categorize as Call / Email / Document / Text */}
          <div>
            <div className="text-xs font-semibold text-fg-muted mb-2">Activity</div>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  ['call', 'Call'],
                  ['email', 'Email'],
                  ['document', 'Document'],
                  ['text', 'Text'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActivity(key)}
                  className={`h-11 rounded-lg border text-sm font-medium inline-flex items-center justify-center gap-1.5 ${
                    activity === key ? 'border-accent bg-accent-soft text-accent-dark' : 'border-border bg-card hover:bg-bg'
                  }`}>
                  <ActivityIcon kind={key} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Matter */}
          <label className="block">
            <span className="text-xs font-semibold text-fg-muted">Matter</span>
            <select
              value={matterId}
              onChange={(e) => setMatterId(e.target.value)}
              className="mt-1.5 w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
              {matters.map((m) => {
                const c = clients.find((cl) => cl.id === m.clientId);
                return <option key={m.id} value={m.id}>{c?.name} · {m.shortName} · ${m.rate}/hr</option>;
              })}
            </select>
          </label>

          {/* Duration */}
          <div>
            <div className="text-xs font-semibold text-fg-muted mb-1.5">Duration</div>
            <div className="flex items-center gap-3">
              <label className="flex-1">
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  placeholder="0"
                />
                <span className="text-xs text-fg-muted block mt-1">hours</span>
              </label>
              <span className="text-fg-muted text-xl">:</span>
              <label className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={mins}
                  onChange={(e) => setMins(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  placeholder="0"
                />
                <span className="text-xs text-fg-muted block mt-1">minutes</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <label className="block">
            <span className="text-xs font-semibold text-fg-muted">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What did you work on? Be specific — this appears on the client invoice."
              className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            />
          </label>

          {/* Billable */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={nonBillable}
              onChange={(e) => setNonBillable(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-[var(--color-accent)]"
            />
            <span className="text-sm">Mark as non-billable</span>
          </label>

          {/* Preview */}
          <div className="bg-bg/60 border border-border rounded-xl p-4 mt-2">
            <div className="text-xs text-fg-muted mb-2">Preview</div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                {client?.name ?? '—'} <span className="text-fg-muted">·</span> {matter?.shortName ?? '—'}
              </div>
              <div className="text-sm font-semibold tabular-nums">
                {Math.floor(durationSec / 3600)}h {Math.floor((durationSec % 3600) / 60)}m
              </div>
            </div>
            {!nonBillable && value > 0 && (
              <div className="text-xs text-accent-dark mt-1">
                Billable: ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} at ${matter?.rate}/hr
              </div>
            )}
          </div>
        </div>

        <Footer
          canSave={canSave}
          onSave={() => commit('save')}
          onSubmit={() => commit('submit')}
        />
      </div>
    </>
  );
}

function ActivityIcon({ kind }: { kind: 'call' | 'email' | 'document' | 'text' }) {
  if (kind === 'call')
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (kind === 'email')
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M22 7l-10 6L2 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (kind === 'document')
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Footer({
  canSave,
  onSave,
  onSubmit,
}: {
  canSave: boolean;
  onSave: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
      <button
        onClick={onSave}
        disabled={!canSave}
        className="h-11 px-4 rounded-lg border border-border text-sm font-semibold disabled:opacity-50">
        Save as draft
      </button>
      <button
        onClick={onSubmit}
        disabled={!canSave}
        className="h-11 px-5 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold disabled:opacity-50">
        Submit for approval
      </button>
    </div>
  );
}
