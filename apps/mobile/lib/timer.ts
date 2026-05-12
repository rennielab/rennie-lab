// Global active timer. Lives outside React so it survives screen unmounts
// and can be displayed in the home Daily Brief, the timer pill, and the
// logged screen as the same source of truth.
//
// Supports running + paused states. Elapsed time = total accumulated runtime
// across all run segments; when paused the counter freezes at the value it
// had at pause time.

import { useSyncExternalStore } from 'react';

import { matterById, type Matter } from '@/lib/mock';

export type ActiveTimer = {
  startedAt: number; // ms — when the current run segment began (or pause-time)
  accumulatedMs: number; // total time accumulated from prior run segments
  paused: boolean;
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
    accumulatedMs: 0,
    paused: false,
    matterId: opts.matterId ?? null,
    contactId: opts.contactId,
    source: opts.source ?? 'manual',
    nonBillable: opts.nonBillable ?? false,
  };
  emit();
}

export function pauseTimer() {
  if (!_active || _active.paused) return;
  const runMs = Date.now() - _active.startedAt;
  _active = {
    ..._active,
    paused: true,
    accumulatedMs: _active.accumulatedMs + runMs,
    startedAt: Date.now(), // stamp so resume math is clean
  };
  emit();
}

export function resumeTimer() {
  if (!_active || !_active.paused) return;
  _active = {
    ..._active,
    paused: false,
    startedAt: Date.now(),
  };
  emit();
}

export function stopTimer(): ActiveTimer | null {
  const t = _active;
  _active = null;
  emit();
  return t;
}

export function updateTimer(patch: Partial<Omit<ActiveTimer, 'startedAt' | 'accumulatedMs'>>) {
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

// Total elapsed seconds: accumulated run segments + the current segment if
// running. If paused, just the accumulated time.
export function elapsedSec(t: ActiveTimer | null, nowMs = Date.now()) {
  if (!t) return 0;
  const live = t.paused ? 0 : Math.max(0, nowMs - t.startedAt);
  return Math.floor((t.accumulatedMs + live) / 1000);
}

export function timerMatter(t: ActiveTimer | null): Matter | undefined {
  if (!t?.matterId) return undefined;
  return matterById(t.matterId);
}
