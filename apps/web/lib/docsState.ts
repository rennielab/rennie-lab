// Mutable layer on top of the static DOCUMENTS seed.
// Admin and Firm can upload new docs (with optional needs-signature flag).
// Client can sign docs that need it — marks them signed and notifies the firm.

import { useSyncExternalStore } from 'react';

import { DOCUMENTS, Document } from '@/lib/portalData';

type State = {
  uploaded: Document[];
  signedIds: Set<string>;
};

const initial: State = {
  uploaded: [],
  signedIds: new Set(),
};

let state: State = initial;
const listeners = new Set<() => void>();

function emit() { state = { ...state }; listeners.forEach((l) => l()); }
function subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); }
function getSnapshot() { return state; }

export function useAllDocuments(): Document[] {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  // Merge seed + uploaded, newest first
  return [...s.uploaded, ...DOCUMENTS].sort((a, b) => b.uploadedAt - a.uploadedAt);
}

export function useSignedIds() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).signedIds;
}

export function uploadDocument(d: Omit<Document, 'id' | 'uploadedAt'>): string {
  const id = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  state.uploaded = [{ ...d, id, uploadedAt: Date.now() }, ...state.uploaded];
  emit();
  return id;
}

export function signDocument(id: string) {
  const next = new Set(state.signedIds);
  next.add(id);
  state.signedIds = next;
  emit();
}

export function isSigned(id: string, signedIds: Set<string>) {
  return signedIds.has(id);
}
