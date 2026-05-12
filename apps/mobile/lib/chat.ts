// Mobile Campfire chat store. Single firm-wide thread, the same shape as
// the web Campfire (one channel, @mentions of firm users + the client).
// For the prototype it's seeded with a recent-looking conversation; new
// messages append in-memory so demos feel live.

import { useSyncExternalStore } from 'react';

export type ChatSide = 'firm' | 'client';

export type ChatMessage = {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorAvatarKey?: string;
  side: ChatSide;
  body: string;
  at: number; // ms
  mentions?: string[];
};

export type Mention = {
  id: string;
  name: string;
  role: string;
  side: ChatSide;
  avatarKey?: string;
};

export const MENTIONS: Mention[] = [
  { id: 'sophia', name: 'Sophia Williams', role: 'Lawyer · B&H', side: 'firm', avatarKey: 'sophia' },
  { id: 'marcus', name: 'Marcus Hayes', role: 'Partner · B&H', side: 'firm', avatarKey: 'marcus' },
  { id: 'jordan', name: 'Jordan Bennett', role: 'Partner · B&H', side: 'firm' },
  { id: 'sarah-c', name: 'Sarah Chen', role: 'Senior Associate · B&H', side: 'firm' },
  { id: 'sarah-m', name: 'Sarah Mitchell', role: 'Client · Reyes Family Trust', side: 'client', avatarKey: 'sarah' },
];

const hour = 60 * 60 * 1000;
const now = Date.now();

let _messages: ChatMessage[] = [
  {
    id: 'm0',
    authorId: 'sarah-m',
    authorName: 'Sarah Mitchell',
    authorInitials: 'SM',
    authorAvatarKey: 'sarah',
    side: 'client',
    body: 'Hi team — any update on the motion in limine? My CFO is asking when we can expect a draft.',
    at: now - 26 * hour,
  },
  {
    id: 'm1',
    authorId: 'marcus',
    authorName: 'Marcus Hayes',
    authorInitials: 'MH',
    authorAvatarKey: 'marcus',
    side: 'firm',
    body: 'Hi @Sarah Mitchell — @Sophia Williams is finalizing the draft. We\'ll have it to you by Friday for review before we file.',
    at: now - 22 * hour,
    mentions: ['sarah-m', 'sophia'],
  },
  {
    id: 'm2',
    authorId: 'sophia',
    authorName: 'Sophia Williams',
    authorInitials: 'SW',
    authorAvatarKey: 'sophia',
    side: 'firm',
    body: 'Just finished section II. Reviewing precedent on Horizon\'s likely objections. Will circulate by EOD Thursday.',
    at: now - 4 * hour,
  },
  {
    id: 'm3',
    authorId: 'sarah-m',
    authorName: 'Sarah Mitchell',
    authorInitials: 'SM',
    authorAvatarKey: 'sarah',
    side: 'client',
    body: 'Thank you both — that timing works. @Sophia Williams let me know if you need anything from us.',
    at: now - 90 * 60 * 1000,
    mentions: ['sophia'],
  },
];

let _lastReadAt = now - 2 * hour; // Sophia has seen up through 2h ago

const _listeners = new Set<() => void>();
function emit() {
  for (const l of _listeners) l();
}

function subscribe(cb: () => void) {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

function getSnapshot() {
  return _messages;
}

export function useChatMessages() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function sendMessage(body: string, mentions: string[] = []) {
  _messages = [
    ..._messages,
    {
      id: `m_${Date.now()}`,
      authorId: 'sophia',
      authorName: 'Sophia Williams',
      authorInitials: 'SW',
      authorAvatarKey: 'sophia',
      side: 'firm',
      body,
      at: Date.now(),
      mentions,
    },
  ];
  _lastReadAt = Date.now();
  emit();
}

export function markRead() {
  _lastReadAt = Date.now();
  emit();
}

function getUnreadSnapshot() {
  return _messages.filter((m) => m.authorId !== 'sophia' && m.at > _lastReadAt).length;
}

export function useUnreadCount() {
  return useSyncExternalStore(subscribe, getUnreadSnapshot, getUnreadSnapshot);
}

// Find the in-progress @mention in a draft string (text up to the caret).
// Returns the partial token after the most recent unbalanced "@", or null
// if the user isn't currently mentioning.
export function activeMentionToken(text: string, caret: number): string | null {
  const before = text.slice(0, caret);
  const at = before.lastIndexOf('@');
  if (at < 0) return null;
  // Make sure there isn't a space between @ and caret (would mean past).
  const token = before.slice(at + 1);
  if (/\s/.test(token)) return null;
  return token;
}
