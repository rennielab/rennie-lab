// Static portal demo data: per-matter status lines, deadlines, documents.
// Lives alongside portalState (which holds mutable state) — this is the
// read-only seed that maps to the Convex schema later.

export type MatterStatusLine = {
  matterId: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
};

export const MATTER_STATUS: Record<string, MatterStatusLine> = {
  m1: {
    matterId: 'm1',
    status: 'Filed application — awaiting USPTO first office action, est. 6 weeks.',
    updatedAt: '21 Feb 2026',
    updatedBy: 'Marcus Hayes',
  },
  m2: {
    matterId: 'm2',
    status: 'Reviewing Q1 vendor contracts — 4 of 12 redlined, on track for end-of-week.',
    updatedAt: '20 Feb 2026',
    updatedBy: 'Sarah Chen',
  },
  m3: {
    matterId: 'm3',
    status: 'Closed — settlement paid in full Dec 2025.',
    updatedAt: '15 Dec 2025',
    updatedBy: 'Marcus Hayes',
  },
};

export type Deadline = {
  id: string;
  matterId: string;
  matterName: string;
  title: string;
  dueAt: number;
  kind: 'court' | 'response' | 'filing' | 'meeting' | 'payment';
  ownedBy: 'firm' | 'client';
};

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

export const DEADLINES: Deadline[] = [
  { id: 'd1', matterId: 'm1', matterName: 'IP — Patent Filing', title: 'USPTO office action response due', dueAt: now + 12 * day, kind: 'response', ownedBy: 'firm' },
  { id: 'd2', matterId: 'm2', matterName: 'Corporate — Contract Review', title: 'Sign updated MSA — review attached draft', dueAt: now + 4 * day, kind: 'filing', ownedBy: 'client' },
  { id: 'd3', matterId: 'm2', matterName: 'Corporate — Contract Review', title: 'Quarterly compliance review meeting', dueAt: now + 18 * day, kind: 'meeting', ownedBy: 'client' },
  { id: 'd4', matterId: 'm1', matterName: 'IP — Patent Filing', title: 'Pay INV-007 — Annual Filing fees', dueAt: now - 3 * day, kind: 'payment', ownedBy: 'client' },
];

export type Document = {
  id: string;
  matterId: string;
  matterName: string;
  name: string;
  kind: 'filing' | 'contract' | 'draft' | 'receipt' | 'letter';
  sizeKb: number;
  uploadedAt: number;
  uploadedBy: string;
  needsSignature?: boolean;
};

export const DOCUMENTS: Document[] = [
  { id: 'doc1', matterId: 'm1', matterName: 'IP — Patent Filing', name: 'USPTO Application — CB-401.pdf', kind: 'filing', sizeKb: 2840, uploadedAt: now - 8 * day, uploadedBy: 'Marcus Hayes' },
  { id: 'doc2', matterId: 'm1', matterName: 'IP — Patent Filing', name: 'Prior Art Search Results.pdf', kind: 'draft', sizeKb: 1240, uploadedAt: now - 10 * day, uploadedBy: 'Jordan Bennett' },
  { id: 'doc3', matterId: 'm1', matterName: 'IP — Patent Filing', name: 'Engagement Letter — signed.pdf', kind: 'contract', sizeKb: 420, uploadedAt: now - 95 * day, uploadedBy: 'Marcus Hayes' },
  { id: 'doc4', matterId: 'm2', matterName: 'Corporate — Contract Review', name: 'Updated MSA — for signature.pdf', kind: 'contract', sizeKb: 680, uploadedAt: now - 1 * day, uploadedBy: 'Sarah Chen', needsSignature: true },
  { id: 'doc5', matterId: 'm2', matterName: 'Corporate — Contract Review', name: 'Vendor Risk Memo.pdf', kind: 'draft', sizeKb: 920, uploadedAt: now - 6 * day, uploadedBy: 'Sarah Chen' },
  { id: 'doc6', matterId: 'm1', matterName: 'IP — Patent Filing', name: 'Receipt INV-006.pdf', kind: 'receipt', sizeKb: 180, uploadedAt: now - 14 * day, uploadedBy: 'Billing' },
  { id: 'doc7', matterId: 'm3', matterName: 'Reyes v. Horizon', name: 'Settlement Agreement — executed.pdf', kind: 'contract', sizeKb: 1180, uploadedAt: now - 55 * day, uploadedBy: 'Marcus Hayes' },
  { id: 'doc8', matterId: 'm3', matterName: 'Reyes v. Horizon', name: 'Final Statement of Account.pdf', kind: 'receipt', sizeKb: 220, uploadedAt: now - 52 * day, uploadedBy: 'Billing' },
];

export function formatDueRelative(at: number): { label: string; tone: 'overdue' | 'urgent' | 'soon' | 'later' } {
  const delta = at - Date.now();
  const days = Math.round(delta / (24 * 60 * 60 * 1000));
  if (days < 0) return { label: `${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'} overdue`, tone: 'overdue' };
  if (days === 0) return { label: 'Due today', tone: 'urgent' };
  if (days === 1) return { label: 'Due tomorrow', tone: 'urgent' };
  if (days <= 7) return { label: `Due in ${days} days`, tone: 'soon' };
  if (days <= 30) return { label: `Due in ${days} days`, tone: 'later' };
  return { label: `Due ${new Date(at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, tone: 'later' };
}

export function formatFileSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
