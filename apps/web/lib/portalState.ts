// In-memory portal state for the demo: notifications, message thread, and paid
// invoices. Mirrors what the real backend will own (messages table, notifications
// feed, invoice.status mutations). useSyncExternalStore so multiple components
// stay in sync without prop-drilling.

import { useSyncExternalStore } from 'react';

export type Notification = {
  id: string;
  kind: 'invoice' | 'note' | 'time' | 'message';
  title: string;
  body: string;
  at: number;
  read: boolean;
  href?: string;
};

export type Message = {
  id: string;
  from: 'client' | 'firm';
  authorName: string;
  authorInitials: string;
  authorRole?: string;
  body: string;
  at: number;
};

export type ChatAuthor = {
  side: 'client' | 'firm';
  name: string;
  initials: string;
  role: string;
};

export type Mention = {
  id: string;
  name: string;
  initials: string;
  role: string;
  side: 'client' | 'firm';
  avatarUrl: string;
};

// Mention candidates — everyone in the campfire room. Avatars are stable
// DiceBear images keyed by seed so refresh-after-deploy stays consistent.
export const MENTIONS: Mention[] = [
  { id: 'marcus', name: 'Marcus Hayes', initials: 'MH', role: 'Managing Partner', side: 'firm', avatarUrl: '/avatars/marcus.jpg' },
  { id: 'sophia', name: 'Sophia Williams', initials: 'SW', role: 'Lawyer', side: 'firm', avatarUrl: '/avatars/sophia.jpg' },
  { id: 'jordan', name: 'Jordan Bennett', initials: 'JB', role: 'Partner', side: 'firm', avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=Jordan&backgroundColor=fee2e2' },
  { id: 'sarah-chen', name: 'Sarah Chen', initials: 'SC', role: 'Senior Associate', side: 'firm', avatarUrl: 'https://api.dicebear.com/7.x/personas/svg?seed=SarahChen&backgroundColor=dbeafe' },
  { id: 'sarah-mitchell', name: 'Sarah Mitchell', initials: 'SM', role: 'Reyes Family Trust', side: 'client', avatarUrl: '/avatars/sarah.jpg' },
];

export function findMention(name: string): Mention | undefined {
  return MENTIONS.find((m) => m.name === name);
}

type State = {
  notifications: Notification[];
  messages: Message[];
  paidInvoiceIds: Set<string>;
  clientLastReadAt: number;
  firmLastReadAt: number;
  // Who's currently typing (transient — auto-cleared after 4s)
  typingNames: Record<string, number>; // name -> timestamp last typed
};

const now = Date.now();
const min = 60_000;
const hr = 60 * min;
const day = 24 * hr;

const initial: State = {
  notifications: [
    { id: 'n1', kind: 'invoice', title: 'New invoice issued', body: 'INV-008 — $700 for Litigation', at: now - 2 * hr, read: false, href: '/portal/invoices' },
    { id: 'n2', kind: 'note', title: 'New note on IP — Patent Filing', body: 'James Donovan posted a case update', at: now - 1 * day, read: false, href: '/portal/matters/m1' },
    { id: 'n3', kind: 'time', title: 'New time entry logged', body: 'Sarah Chen — 1h 15m on Patent Filing', at: now - 2 * day, read: true, href: '/portal/matters/m1' },
  ],
  messages: [
    { id: 'm1', from: 'firm', authorName: 'Marcus Hayes', authorInitials: 'MH', authorRole: 'Managing Partner',
      body: 'Hi @Sarah Mitchell — quick heads up: the USPTO sent back the first office action on the CB-401 application. @Sophia Williams and I will draft a response this week. No action needed from you yet — I\'ll send the response for your review before we file.',
      at: now - 3 * day },
    { id: 'm2', from: 'client', authorName: 'Sarah Mitchell', authorInitials: 'SM', authorRole: 'Reyes Family Trust',
      body: 'Thanks @Marcus Hayes — sounds good. Can you also share the latest cost estimate for the response? Want to make sure we\'re tracking on budget.',
      at: now - 3 * day + 90 * min },
    { id: 'm3', from: 'firm', authorName: 'Sophia Williams', authorInitials: 'SW', authorRole: 'Lawyer',
      body: 'Hi Sarah — I\'m drafting the response. Rough estimate: 6 billable hours. I\'ll send a written quote by Friday so we have it on paper.',
      at: now - 3 * day + 95 * min },
    { id: 'm4', from: 'firm', authorName: 'Sophia Williams', authorInitials: 'SW', authorRole: 'Lawyer',
      body: 'One more thing — I pulled three analogous USPTO decisions to cite. Will share the strongest one with the response draft.',
      at: now - 3 * day + 97 * min },
    { id: 'm5', from: 'client', authorName: 'Sarah Mitchell', authorInitials: 'SM', authorRole: 'Reyes Family Trust',
      body: 'Perfect, thanks both. The board meets next Tuesday so any update before then would help me prep.',
      at: now - 2 * day },
    { id: 'm6', from: 'firm', authorName: 'Jordan Bennett', authorInitials: 'JB', authorRole: 'Partner',
      body: 'Jumping in — I just reviewed the draft. Looks solid. @Sophia Williams nice work on Section II. @Marcus Hayes do you want me to handle the filing?',
      at: now - 1 * day },
    { id: 'm7', from: 'firm', authorName: 'Marcus Hayes', authorInitials: 'MH', authorRole: 'Managing Partner',
      body: 'Yes @Jordan Bennett — please. @Sarah Mitchell we\'re on track to file before your board meeting. Will confirm Monday.',
      at: now - 1 * day + 30 * min },
    { id: 'm8', from: 'client', authorName: 'Sarah Mitchell', authorInitials: 'SM', authorRole: 'Reyes Family Trust',
      body: 'Amazing — really appreciate you all keeping me in the loop.',
      at: now - 4 * hr },
  ],
  // INV-005 was paid via wire (offline) — admin's invoiceOverrides reflects
  // this and so does the portal so all three views agree.
  paidInvoiceIds: new Set<string>(['inv_5']),
  clientLastReadAt: now,
  firmLastReadAt: now - 4 * day,
  typingNames: {},
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

// ---------- Public API ----------

export function useNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).notifications;
}

export function useUnreadCount() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).notifications.filter((n) => !n.read).length;
}

export function markAllNotificationsRead() {
  state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
  emit();
}

export function markNotificationRead(id: string) {
  state.notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  emit();
}

export function useMessages() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).messages;
}

// Per-side unread counts — firm and client each track when they last opened
// chat. Counts messages from the other side after that timestamp.
export function useChatUnread(side: 'client' | 'firm') {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const lastRead = side === 'client' ? s.clientLastReadAt : s.firmLastReadAt;
  const otherSide = side === 'client' ? 'firm' : 'client';
  return s.messages.filter((m) => m.from === otherSide && m.at > lastRead).length;
}

export function markChatRead(side: 'client' | 'firm') {
  if (side === 'client') state.clientLastReadAt = Date.now();
  else state.firmLastReadAt = Date.now();
  emit();
}

// Typing presence — call when the textarea is active. Auto-clears after 4s.
export function setTyping(name: string) {
  state.typingNames = { ...state.typingNames, [name]: Date.now() };
  emit();
}

export function clearTyping(name: string) {
  if (!(name in state.typingNames)) return;
  const next = { ...state.typingNames };
  delete next[name];
  state.typingNames = next;
  emit();
}

export function useTypingOthers(myName: string): string[] {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const cutoff = Date.now() - 4000;
  return Object.entries(s.typingNames)
    .filter(([n, ts]) => n !== myName && ts > cutoff)
    .map(([n]) => n);
}

// Generic send — any persona can post.
export function sendMessage(author: ChatAuthor, body: string) {
  const id = `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  state.messages = [
    ...state.messages,
    {
      id,
      from: author.side,
      authorName: author.name,
      authorInitials: author.initials,
      authorRole: author.role,
      body,
      at: Date.now(),
    },
  ];
  emit();
}

// Legacy wrapper — kept so existing /portal/messages page still works.
// Also triggers a faked firm reply for the demo when the client posts.
export function sendClientMessage(body: string) {
  sendMessage({ side: 'client', name: 'Sarah Mitchell', initials: 'SM', role: 'Reyes Family Trust' }, body);

  const replies = [
    'Got it — thanks Sarah. Looping in the team and following up shortly.',
    'Noted. We’ll have an update for you by end of day tomorrow.',
    'Appreciate the heads-up. I’ll pull the file and respond within the hour.',
  ];
  const reply = replies[Math.floor(Math.random() * replies.length)];
  setTimeout(() => {
    sendMessage({ side: 'firm', name: 'Marcus Hayes', initials: 'MH', role: 'Managing Partner' }, reply);
    state.notifications = [
      {
        id: `n_${Date.now()}`,
        kind: 'message',
        title: 'Marcus replied',
        body: reply.slice(0, 60) + (reply.length > 60 ? '…' : ''),
        at: Date.now(),
        read: false,
        href: '/portal/messages',
      },
      ...state.notifications,
    ];
    emit();
  }, 3500);
}

export function usePaidInvoiceIds() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).paidInvoiceIds;
}

export function markInvoicePaid(id: string) {
  const next = new Set(state.paidInvoiceIds);
  next.add(id);
  state.paidInvoiceIds = next;
  state.notifications = [
    {
      id: `n_${Date.now()}`,
      kind: 'invoice',
      title: 'Payment confirmed',
      body: `${id} marked paid · receipt emailed`,
      at: Date.now(),
      read: false,
      href: '/portal/invoices',
    },
    ...state.notifications,
  ];
  emit();
}

export function formatRelative(at: number): string {
  const delta = Date.now() - at;
  if (delta < min) return 'just now';
  if (delta < hr) return `${Math.floor(delta / min)}m ago`;
  if (delta < day) return `${Math.floor(delta / hr)}h ago`;
  if (delta < 7 * day) return `${Math.floor(delta / day)}d ago`;
  return new Date(at).toLocaleDateString();
}
