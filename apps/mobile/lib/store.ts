// Tiny store for entries submitted from the device during the demo.
// We don't have a real backend, so this in-memory module is the source of
// truth for "what the lawyer just submitted." Activities reads from here,
// and useSyncExternalStore gives us automatic re-renders on subscribe.

import { useSyncExternalStore } from 'react';

import type { TimeEntry } from '@/lib/mock';

let _submitted: TimeEntry[] = [];
const _listeners = new Set<() => void>();

function emit() {
  for (const l of _listeners) l();
}

export function submitEntry(entry: TimeEntry) {
  _submitted = [entry, ..._submitted];
  emit();
}

export function clearSubmitted() {
  _submitted = [];
  emit();
}

export function recentlySubmittedIds(withinMs = 8000): Set<string> {
  const cutoff = Date.now() - withinMs;
  return new Set(_submitted.filter((e) => e.createdAt >= cutoff).map((e) => e.id));
}

function subscribe(cb: () => void) {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

function getSnapshot() {
  return _submitted;
}

export function useSubmittedEntries() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
