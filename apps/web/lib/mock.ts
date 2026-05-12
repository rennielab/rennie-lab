// Mirror of apps/mobile/lib/mock.ts — kept in sync manually for the prototype.
// Same shape as the future Convex schema so this swaps cleanly later.

export type Firm = { id: string; name: string; location: string };
export type Lawyer = { id: string; firmId: string; name: string; initials: string; role: string; avatarUrl?: string; email?: string; phone?: string; bio?: string };
export type Client = { id: string; firmId: string; name: string };
export type Contact = {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  initials: string;
  phone: string;
  matterId?: string;
};
export type Matter = {
  id: string;
  clientId: string;
  name: string;
  shortName: string;
  rate: number;
};
export type TimeEntry = {
  id: string;
  matterId: string;
  lawyerId: string;
  durationSec: number;
  description: string;
  createdAt: number;
  status: 'draft' | 'pending' | 'approved';
  nonBillable: boolean;
  source: 'manual' | 'call';
  contactId?: string;
};
export type Invoice = {
  id: string;
  number: string;
  clientId: string;
  entryIds: string[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid';
  issuedAt: number;
  dueAt: number;
};

export const firm: Firm = {
  id: 'firm_bh',
  name: 'Bennett & Hayes LLP',
  location: 'San Francisco, CA',
};

const AVATAR_BASE = 'https://api.dicebear.com/7.x/personas/svg?seed=';

// Real-people photos for the 3 hero personas. Drop your photos in
// /apps/web/public/avatars/ as marcus.jpg, sophia.jpg, sarah.jpg.
// Falls back to a small inline placeholder if the file is missing.
const MARCUS_PHOTO = '/avatars/marcus.jpg';
const SOPHIA_PHOTO = '/avatars/sophia.jpg';
const SARAH_PHOTO = '/avatars/sarah.jpg';

export const currentAdmin: Lawyer = {
  id: 'lwy_marc',
  firmId: firm.id,
  name: 'Marcus Hayes',
  initials: 'MH',
  role: 'Managing Partner',
  avatarUrl: MARCUS_PHOTO,
  email: 'marcus@bennetthayes.law',
  phone: '+1 (415) 555-0190',
  bio: 'Managing Partner at Bennett & Hayes LLP. 18 years in commercial litigation. Bar admitted in CA and NY. Caltech BS, Stanford JD.',
};

export const lawyers: Lawyer[] = [
  { id: 'lwy_jord', firmId: firm.id, name: 'Jordan Bennett', initials: 'JB', role: 'Partner', avatarUrl: `${AVATAR_BASE}Jordan&backgroundColor=fee2e2`, email: 'jordan@bennetthayes.law', phone: '+1 (415) 555-0191', bio: 'Partner focused on IP litigation and patent prosecution. Bar admitted in CA. UC Berkeley JD.' },
  { id: 'lwy_sara', firmId: firm.id, name: 'Sarah Chen', initials: 'SC', role: 'Senior Associate', avatarUrl: `${AVATAR_BASE}SarahChen&backgroundColor=dbeafe`, email: 'sarah.chen@bennetthayes.law', phone: '+1 (415) 555-0192', bio: 'Senior Associate in corporate transactions. UCLA JD.' },
  { id: 'lwy_marc', firmId: firm.id, name: 'Marcus Hayes', initials: 'MH', role: 'Managing Partner', avatarUrl: MARCUS_PHOTO, email: 'marcus@bennetthayes.law', phone: '+1 (415) 555-0190', bio: 'Managing Partner at Bennett & Hayes LLP. 18 years in commercial litigation. Bar admitted in CA and NY. Caltech BS, Stanford JD.' },
  { id: 'lwy_soph', firmId: firm.id, name: 'Sophia Williams', initials: 'SW', role: 'Lawyer', avatarUrl: SOPHIA_PHOTO, email: 'sophia.williams@bennetthayes.law', phone: '+1 (415) 555-0199', bio: 'Lawyer focused on patent prosecution and commercial litigation. Bar admitted in CA. NYU JD.' },
];

// The "current firm user" in the /firm/* demo — a regular staff lawyer, NOT
// the admin. Logs into the same firm as Marcus but sees a scoped view.
export const currentFirmUser: Lawyer = lawyers[3];

// The "current client" in the /portal/* demo.
export type ClientUser = { id: string; name: string; initials: string; role: string; clientId: string; email: string; phone: string; bio: string; avatarUrl: string };
export const currentClient: ClientUser = {
  id: 'usr_sarah',
  name: 'Sarah Mitchell',
  initials: 'SM',
  role: 'Trustee',
  clientId: 'cli_reyes',
  email: 'sarah.mitchell@example.com',
  phone: '+1 (415) 555-0142',
  bio: 'Trustee for Reyes Family Trust. Authorized portal user for the trust\'s matters at Bennett & Hayes LLP.',
  avatarUrl: SARAH_PHOTO,
};

// Universal matter stages — work across every practice area.
// Litigation sub-stages (Discovery, Trial etc) can be a sub-status later.
export type MatterStage = 'Intake' | 'Active' | 'On Hold' | 'Closed';

// Stage + originating attorney (the "matter lead" / account manager) per matter.
export const MATTER_STAGE: Record<string, MatterStage> = {
  mat_acme_1: 'Active',
  mat_acme_2: 'Intake',
  mat_reyes_1: 'Intake',
  mat_reyes_2: 'Active',
  mat_north_1: 'Active',
  mat_vert_1: 'Closed',
};

export const MATTER_LEAD: Record<string, string> = {
  mat_acme_1: 'lwy_jord',
  mat_acme_2: 'lwy_jord',
  mat_reyes_1: 'lwy_jord',
  mat_reyes_2: 'lwy_jord',
  mat_north_1: 'lwy_sara',
  mat_vert_1: 'lwy_marc',
};

export const clients: Client[] = [
  { id: 'cli_acme', firmId: firm.id, name: 'Acme Industries Inc.' },
  { id: 'cli_reyes', firmId: firm.id, name: 'Reyes Family Trust' },
  { id: 'cli_north', firmId: firm.id, name: 'Northgate Capital' },
  { id: 'cli_vert', firmId: firm.id, name: 'Vertex Pharmaceuticals' },
];

export const matters: Matter[] = [
  { id: 'mat_acme_1', clientId: 'cli_acme', name: 'Smith v. Acme — Wrongful Termination', shortName: 'Smith v. Acme', rate: 650 },
  { id: 'mat_acme_2', clientId: 'cli_acme', name: 'Acme — General Counsel Retainer', shortName: 'Acme GC', rate: 550 },
  { id: 'mat_reyes_1', clientId: 'cli_reyes', name: 'Reyes Estate Planning', shortName: 'Reyes Estate', rate: 525 },
  { id: 'mat_reyes_2', clientId: 'cli_reyes', name: 'Reyes v. Horizon Corp.', shortName: 'Reyes v. Horizon', rate: 700 },
  { id: 'mat_north_1', clientId: 'cli_north', name: 'Northgate IPO Diligence', shortName: 'Northgate IPO', rate: 850 },
  { id: 'mat_vert_1', clientId: 'cli_vert', name: 'Vertex Patent Litigation', shortName: 'Vertex Patent', rate: 750 },
];

export const contacts: Contact[] = [
  { id: 'ct_smitchell', clientId: 'cli_reyes', firstName: 'Sarah', lastName: 'Mitchell', initials: 'SM', phone: '+1 (415) 555-0142', matterId: 'mat_reyes_2' },
  { id: 'ct_jpark', clientId: 'cli_acme', firstName: 'James', lastName: 'Park', initials: 'JP', phone: '+1 (415) 555-0188', matterId: 'mat_acme_1' },
  { id: 'ct_arodriguez', clientId: 'cli_acme', firstName: 'Ana', lastName: 'Rodriguez', initials: 'AR', phone: '+1 (415) 555-0102', matterId: 'mat_acme_2' },
  { id: 'ct_dchen', clientId: 'cli_north', firstName: 'David', lastName: 'Chen', initials: 'DC', phone: '+1 (650) 555-0211', matterId: 'mat_north_1' },
  { id: 'ct_lkim', clientId: 'cli_vert', firstName: 'Lena', lastName: 'Kim', initials: 'LK', phone: '+1 (650) 555-0177', matterId: 'mat_vert_1' },
  { id: 'ct_mreyes', clientId: 'cli_reyes', firstName: 'Miguel', lastName: 'Reyes', initials: 'MR', phone: '+1 (415) 555-0150', matterId: 'mat_reyes_1' },
];

const dayMs = 24 * 60 * 60 * 1000;
const now = Date.now();

export const seedEntries: TimeEntry[] = [
  { id: 'te_1', matterId: 'mat_acme_1', lawyerId: 'lwy_jord', durationSec: 5400, description: 'Reviewed deposition transcripts for Smith deposition prep. Flagged inconsistencies in opposing counsel\'s timeline.', createdAt: now - 1 * dayMs, status: 'approved', nonBillable: false, source: 'manual' },
  { id: 'te_2', matterId: 'mat_reyes_2', lawyerId: 'lwy_jord', durationSec: 2880, description: 'Call with Sarah Mitchell re: discovery responses and Horizon Corp settlement posture.', createdAt: now - 1 * dayMs + 3600000, status: 'approved', nonBillable: false, source: 'call', contactId: 'ct_smitchell' },
  { id: 'te_3', matterId: 'mat_north_1', lawyerId: 'lwy_sara', durationSec: 7200, description: 'Drafted Section 4 of IPO diligence memo. Cross-referenced 2024 financials.', createdAt: now - 2 * dayMs, status: 'approved', nonBillable: false, source: 'manual' },
  { id: 'te_4', matterId: 'mat_acme_2', lawyerId: 'lwy_jord', durationSec: 1860, description: 'Quick call with Ana Rodriguez on vendor contract renewal terms.', createdAt: now - 2 * dayMs - 1800000, status: 'pending', nonBillable: false, source: 'call', contactId: 'ct_arodriguez' },
  { id: 'te_5', matterId: 'mat_vert_1', lawyerId: 'lwy_marc', durationSec: 9000, description: 'Patent claim chart construction — Vertex \'847 patent.', createdAt: now - 3 * dayMs, status: 'approved', nonBillable: false, source: 'manual' },
  { id: 'te_6', matterId: 'mat_reyes_1', lawyerId: 'lwy_jord', durationSec: 3600, description: 'Trust funding strategy memo for Miguel Reyes.', createdAt: now - 3 * dayMs - 7200000, status: 'pending', nonBillable: false, source: 'manual' },
  { id: 'te_7', matterId: 'mat_acme_1', lawyerId: 'lwy_sara', durationSec: 1200, description: 'Internal call with Marcus re: motion strategy.', createdAt: now - 4 * dayMs, status: 'approved', nonBillable: true, source: 'call' },
  { id: 'te_8', matterId: 'mat_north_1', lawyerId: 'lwy_jord', durationSec: 4200, description: 'Underwriter call — risk factor language for S-1.', createdAt: now - 5 * dayMs, status: 'approved', nonBillable: false, source: 'call', contactId: 'ct_dchen' },
  { id: 'te_9', matterId: 'mat_acme_1', lawyerId: 'lwy_soph', durationSec: 2280, description: 'Drafted opposition to motion to dismiss — Section II argument.', createdAt: now - 4 * 3600000, status: 'pending', nonBillable: false, source: 'manual' },
  { id: 'te_10', matterId: 'mat_north_1', lawyerId: 'lwy_soph', durationSec: 1620, description: 'Call with David Chen re: comfort letter coordination.', createdAt: now - 8 * 3600000, status: 'pending', nonBillable: false, source: 'call', contactId: 'ct_dchen' },
  { id: 'te_11', matterId: 'mat_acme_1', lawyerId: 'lwy_soph', durationSec: 5400, description: 'Researched analogous case law for motion to dismiss — pulled 6 authorities.', createdAt: now - 1 * dayMs - 2 * 3600000, status: 'approved', nonBillable: false, source: 'manual' },
  { id: 'te_12', matterId: 'mat_north_1', lawyerId: 'lwy_soph', durationSec: 3600, description: 'Drafted comfort letter language for Section 11 — circulated for review.', createdAt: now - 2 * dayMs, status: 'approved', nonBillable: false, source: 'manual' },
  { id: 'te_13', matterId: 'mat_acme_1', lawyerId: 'lwy_soph', durationSec: 1800, description: 'Internal strategy call with Jordan on opposition brief.', createdAt: now - 2 * dayMs - 5 * 3600000, status: 'approved', nonBillable: true, source: 'call' },
  { id: 'te_14', matterId: 'mat_vert_1', lawyerId: 'lwy_soph', durationSec: 2700, description: 'Reviewed patent prosecution history for Vertex \'847 — flagged file wrapper estoppel risk.', createdAt: now - 3 * dayMs, status: 'approved', nonBillable: false, source: 'manual' },
  { id: 'te_15', matterId: 'mat_reyes_1', lawyerId: 'lwy_soph', durationSec: 900, description: 'Quick call with Miguel re: section 4 of trust funding memo.', createdAt: now - 4 * dayMs, status: 'approved', nonBillable: false, source: 'call', contactId: 'ct_mreyes' },
];

// The "hero" entry submitted from mobile during the demo. Appears on admin after a delay.
export const heroEntry: TimeEntry = {
  id: 'te_hero',
  matterId: 'mat_reyes_2',
  lawyerId: 'lwy_jord',
  durationSec: 484,
  description: 'Discussed Reyes v. Horizon deposition prep. Confirmed witness availability for the 28th and agreed to draft the motion in limine by Friday.',
  createdAt: now,
  status: 'pending',
  nonBillable: false,
  source: 'call',
  contactId: 'ct_smitchell',
};

export const invoices: Invoice[] = [
  {
    id: 'inv_1',
    number: 'BH-2026-0042',
    clientId: 'cli_acme',
    entryIds: ['te_1', 'te_3'],
    subtotal: 5687.5,
    tax: 0,
    total: 5687.5,
    status: 'sent',
    issuedAt: now - 7 * dayMs,
    dueAt: now + 23 * dayMs,
  },
];

export const matterById = (id: string) => matters.find(m => m.id === id);
export const clientById = (id: string) => clients.find(c => c.id === id);
export const lawyerById = (id: string) => lawyers.find(l => l.id === id);
export const contactById = (id: string) => contacts.find(c => c.id === id);

export const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const formatHours = (seconds: number) => `${(seconds / 3600).toFixed(2)}h`;

// Human-friendly hours: "1h 47m" / "47m" / "30s"
export const formatHoursH = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const formatMoney = (amount: number) =>
  `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Whole-dollar money for compact dashboards. Cents only shown if non-zero.
export const formatMoneyCompact = (amount: number) => {
  if (Number.isInteger(amount) || amount % 1 < 0.005) return `$${Math.round(amount).toLocaleString()}`;
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Compute the billable $ value of a time entry at the matter's rate.
export const entryValue = (entry: TimeEntry) => {
  if (entry.nonBillable) return 0;
  const m = matterById(entry.matterId);
  if (!m) return 0;
  return (m.rate * entry.durationSec) / 3600;
};

export const formatDate = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};
