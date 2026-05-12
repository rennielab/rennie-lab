// Admin-side mutable state for the demo. Mirrors what the backend will own
// (timeEntries.status, invoices.status / sentReminderAt, etc).
//
// Surfaces:
//   - Time entry approvals (per-row + bulk)
//   - Draft → issued invoices (the "issue from approved time" wizard)
//   - Offline payments + reminder log on invoices
//   - Admin notifications feed

import { useSyncExternalStore } from 'react';

export type AdminNotification = {
  id: string;
  kind: 'submission' | 'payment' | 'overdue' | 'message';
  title: string;
  body: string;
  at: number;
  read: boolean;
  href?: string;
};

type EntryOverride = {
  status?: 'approved' | 'pending' | 'rejected';
  description?: string;
  nonBillable?: boolean;
  rejectReason?: string;
};

type InvoiceOverride = {
  status?: 'paid' | 'sent' | 'overdue' | 'draft' | 'partial';
  paidAt?: number;
  paidMethod?: 'card' | 'wire' | 'check' | 'cash';
  paidNote?: string;
  lastReminderAt?: number;
};

export type DraftInvoice = {
  id: string;
  clientId: string;
  matterId: string;
  entryIds: string[];
  subtotal: number;
  createdAt: number;
  number: string;
};

type State = {
  notifications: AdminNotification[];
  entryOverrides: Record<string, EntryOverride>;
  invoiceOverrides: Record<string, InvoiceOverride>;
  drafts: DraftInvoice[];
  // marks entries that have been billed (added to a draft or issued invoice)
  billedEntryIds: Set<string>;
};

const now = Date.now();
const min = 60_000;
const hr = 60 * min;
const day = 24 * hr;

const initial: State = {
  notifications: [
    { id: 'an1', kind: 'submission', title: 'Sophia submitted 2 entries', body: '38m on Smith v. Acme · 27m call with David Chen', at: now - 1 * hr, read: false, href: '/admin/entries' },
    { id: 'an2', kind: 'overdue', title: 'INV-007 is 7 days overdue', body: 'Acme Industries — $1,200', at: now - 3 * hr, read: false, href: '/admin/invoices' },
    { id: 'an3', kind: 'payment', title: 'Reyes Family Trust paid INV-006', body: '$1,300 received via Stripe', at: now - 1 * day, read: true, href: '/admin/invoices' },
    { id: 'an4', kind: 'submission', title: 'Jordan submitted 1 entry', body: '31m call with Ana Rodriguez', at: now - 2 * day, read: true, href: '/admin/entries' },
  ],
  entryOverrides: {},
  // Northgate is archived + portal disabled. The seed has INV-005 as "Partially
  // Paid" via the portal which is contradictory. Override to fully Paid via wire
  // so the cross-page story is consistent.
  invoiceOverrides: {
    inv_5: { status: 'paid', paidAt: now - 5 * day, paidMethod: 'wire', paidNote: 'Wire ref 8842219' },
  },
  drafts: [],
  billedEntryIds: new Set(),
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
function getSnapshot() { return state; }

// ---------- Notifications ----------

export function useAdminNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).notifications;
}
export function useAdminUnreadCount() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).notifications.filter((n) => !n.read).length;
}
export function markAllAdminNotificationsRead() {
  state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
  emit();
}
export function markAdminNotificationRead(id: string) {
  state.notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  emit();
}
function pushNotification(n: Omit<AdminNotification, 'id' | 'at' | 'read'>) {
  state.notifications = [
    { ...n, id: `an_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, at: Date.now(), read: false },
    ...state.notifications,
  ];
  emit();
}

// ---------- Entry overrides (approval) ----------

export function useEntryOverrides() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).entryOverrides;
}
export function approveEntry(id: string, descriptionEdit?: string, nonBillable?: boolean) {
  state.entryOverrides = {
    ...state.entryOverrides,
    [id]: {
      ...state.entryOverrides[id],
      status: 'approved',
      ...(descriptionEdit !== undefined ? { description: descriptionEdit } : {}),
      ...(nonBillable !== undefined ? { nonBillable } : {}),
    },
  };
  emit();
}
export function rejectEntry(id: string, reason: string) {
  state.entryOverrides = {
    ...state.entryOverrides,
    [id]: { ...state.entryOverrides[id], status: 'rejected', rejectReason: reason },
  };
  emit();
}
export function approveAllPending(ids: string[]) {
  const next = { ...state.entryOverrides };
  ids.forEach((id) => {
    next[id] = { ...next[id], status: 'approved' };
  });
  state.entryOverrides = next;
  emit();
}

// ---------- Invoice overrides + drafts ----------

export function useInvoiceOverrides() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).invoiceOverrides;
}
export function useDrafts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).drafts;
}
export function useBilledEntryIds() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).billedEntryIds;
}

export function markPaidOffline(
  id: string,
  method: 'wire' | 'check' | 'cash',
  note: string,
) {
  state.invoiceOverrides = {
    ...state.invoiceOverrides,
    [id]: { ...state.invoiceOverrides[id], status: 'paid', paidAt: Date.now(), paidMethod: method, paidNote: note },
  };
  pushNotification({
    kind: 'payment',
    title: `Marked ${id} paid (${method})`,
    body: note || 'Offline payment recorded',
    href: '/admin/invoices',
  });
  emit();
}

export function sendInvoiceReminder(id: string) {
  state.invoiceOverrides = {
    ...state.invoiceOverrides,
    [id]: { ...state.invoiceOverrides[id], lastReminderAt: Date.now() },
  };
  pushNotification({
    kind: 'overdue',
    title: `Reminder sent for ${id}`,
    body: 'Email + portal notification delivered',
    href: '/admin/invoices',
  });
  emit();
}

export function createDraftInvoice(d: Omit<DraftInvoice, 'id' | 'createdAt' | 'number'>) {
  const number = `BH-DRAFT-${state.drafts.length + 1}`;
  const draft: DraftInvoice = { ...d, id: `draft_${Date.now()}`, createdAt: Date.now(), number };
  state.drafts = [...state.drafts, draft];
  const billed = new Set(state.billedEntryIds);
  d.entryIds.forEach((id) => billed.add(id));
  state.billedEntryIds = billed;
  pushNotification({
    kind: 'submission',
    title: `Draft invoice ${number} created`,
    body: `${d.entryIds.length} entries · ${d.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
    href: '/admin/invoices',
  });
  emit();
  return draft;
}

export function issueDraftInvoice(draftId: string) {
  const draft = state.drafts.find((d) => d.id === draftId);
  if (!draft) return;
  state.drafts = state.drafts.filter((d) => d.id !== draftId);
  pushNotification({
    kind: 'submission',
    title: `Invoice ${draft.number.replace('DRAFT', 'ISSUED')} sent to client`,
    body: 'Email delivered. Client portal updated.',
    href: '/admin/invoices',
  });
  emit();
}

// ---------- Formatting helpers ----------

export function formatRelativeAdmin(at: number): string {
  const delta = Date.now() - at;
  if (delta < min) return 'just now';
  if (delta < hr) return `${Math.floor(delta / min)}m ago`;
  if (delta < day) return `${Math.floor(delta / hr)}h ago`;
  if (delta < 7 * day) return `${Math.floor(delta / day)}d ago`;
  return new Date(at).toLocaleDateString();
}
