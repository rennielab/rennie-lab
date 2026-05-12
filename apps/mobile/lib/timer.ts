// Global active timer. Lives outside React so it survives screen unmounts
// and can be displayed in the home Daily Brief, the timer pill, and the
// logged screen as the same source of truth.

import { useSyncExternalStore } from 'react';

import { matterById, type Matter } from '@/lib/mock';

export type ActiveTimer = {
  startedAt: number; // ms
  matterId: string | null;
  contactId?: string;
  source: 'manual' | 'call';
  nonBillable: boolean;
};

let _active: ActiveTimer | null = null;
const _listeners = new Set<() => void>();

function emit() {
  for (const l of _listeners) l();
}

export function startTimer(opts: Partial<ActiveTimer> = {}) {
  _active = {
    startedAt: Date.now(),
    matterId: opts.matterId ?? null,
    contactId: opts.contactId,
    source: opts.source ?? 'manual',
    nonBillable: opts.nonBillable ?? false,
  };
  emit();
}

export function stopTimer(): ActiveTimer | null {
  const t = _active;
  _active = null;
  emit();
  return t;
}

export function updateTimer(patch: Partial<Omit<ActiveTimer, 'startedAt'>>) {
  if (!_active) return;
  _active = { ..._active, ...patch };
  emit();
}

export function getActive(): ActiveTimer | null {
  return _active;
}

function subscribe(cb: () => void) {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

function getSnapshot() {
  return _active;
}

export function useActiveTimer() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function elapsedSec(t: ActiveTimer | null, nowMs = Date.now()) {
  if (!t) return 0;
  return Math.max(0, Math.floor((nowMs - t.startedAt) / 1000));
}

export function timerMatter(t: ActiveTimer | null): Matter | undefined {
  if (!t?.matterId) return undefined;
  return matterById(t.matterId);
}
