// Firm-user (staff lawyer) mutable state. Mirrors what Convex will own —
// the staff lawyer creates draft entries, submits them for approval, and sees
// rejection feedback from the admin. Pinned matters are personal preferences.

import { useSyncExternalStore } from 'react';

import type { TimeEntry } from '@/lib/mock';
import { useEntryOverrides } from '@/lib/adminState';

export type FirmNotification = {
  id: string;
  kind: 'rejected' | 'assigned' | 'message' | 'reminder';
  title: string;
  body: string;
  at: number;
  read: boolean;
  href?: string;
};

export type DraftEntry = {
  id: string;
  matterId: string;
  durationSec: number;
  description: string;
  nonBillable: boolean;
  source: 'manual' | 'call';
  createdAt: number;
};

type State = {
  notifications: FirmNotification[];
  drafts: DraftEntry[];
  pinnedMatterIds: Set<string>;
};

const now = Date.now();
const min = 60_000;
const hr = 60 * min;
const day = 24 * hr;

const initial: State = {
  notifications: [
    {
      id: 'fn1',
      kind: 'reminder',
      title: 'Don\'t forget to submit time',
      body: 'You have 2 entries pending review. Submit by EOD Friday.',
      at: now - 30 * min,
      read: false,
      href: '/firm/time',
    },
    {
      id: 'fn2',
      kind: 'assigned',
      title: 'Marcus added you to Vertex Patent',
      body: 'You\'re now on the Vertex Pharmaceuticals patent team',
      at: now - 4 * hr,
      read: false,
      href: '/firm/matters',
    },
  ],
  drafts: [
    {
      id: 'fd1',
      matterId: 'mat_reyes_1',
      durationSec: 1860,
      description: 'Reviewed trust funding memo. Need to clarify Section 4 with Miguel.',
      nonBillable: false,
      source: 'manual',
      createdAt: now - 2 * hr,
    },
  ],
  pinnedMatterIds: new Set(['mat_acme_1', 'mat_north_1']),
};

let state: State = initial;
const listeners = new Set<() => void>();

function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot() {
  return state;
}

// ---------- Notifications ----------

export function useFirmNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).notifications;
}
export function useFirmUnreadCount() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).notifications.filter((n) => !n.read).length;
}
export function markAllFirmNotificationsRead() {
  state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
  emit();
}
export function markFirmNotificationRead(id: string) {
  state.notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  emit();
}

// ---------- Drafts ----------

export function useFirmDrafts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).drafts;
}

export function addDraft(d: Omit<DraftEntry, 'id' | 'createdAt'>): string {
  const id = `fd_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  state.drafts = [...state.drafts, { ...d, id, createdAt: Date.now() }];
  emit();
  return id;
}

export function deleteDraft(id: string) {
  state.drafts = state.drafts.filter((d) => d.id !== id);
  emit();
}

export function submitDraft(id: string) {
  // In production this would POST to /timeEntries with status: 'pending'.
  // For the demo we just remove it from drafts and pretend.
  state.drafts = state.drafts.filter((d) => d.id !== id);
  state.notifications = [
    {
      id: `fn_${Date.now()}`,
      kind: 'reminder',
      title: 'Entry submitted for approval',
      body: 'Marcus will review and confirm shortly.',
      at: Date.now(),
      read: false,
      href: '/firm/time',
    },
    ...state.notifications,
  ];
  emit();
}

export function submitAllDrafts() {
  const n = state.drafts.length;
  state.drafts = [];
  state.notifications = [
    {
      id: `fn_${Date.now()}`,
      kind: 'reminder',
      title: `${n} ${n === 1 ? 'entry' : 'entries'} submitted for approval`,
      body: 'Marcus will review and confirm shortly.',
      at: Date.now(),
      read: false,
      href: '/firm/time',
    },
    ...state.notifications,
  ];
  emit();
}

// ---------- Pinned matters ----------

export function usePinnedMatterIds() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).pinnedMatterIds;
}

export function toggleMatterPin(id: string) {
  const next = new Set(state.pinnedMatterIds);
  if (next.has(id)) next.delete(id); else next.add(id);
  state.pinnedMatterIds = next;
  emit();
}

// ---------- Helpers ----------

// Look at admin-side rejection overrides for Sophia's entries.
// Push them into the notification feed.
export function useRejectedFeedback(entries: TimeEntry[]) {
  const overrides = useEntryOverrides();
  return entries
    .filter((e) => (overrides[e.id]?.status as string) === 'rejected')
    .map((e) => ({ entry: e, reason: overrides[e.id]?.rejectReason ?? '' }));
}

export function formatRelativeFirm(at: number): string {
  const delta = Date.now() - at;
  if (delta < min) return 'just now';
  if (delta < hr) return `${Math.floor(delta / min)}m ago`;
  if (delta < day) return `${Math.floor(delta / hr)}h ago`;
  if (delta < 7 * day) return `${Math.floor(delta / day)}d ago`;
  return new Date(at).toLocaleDateString();
}
