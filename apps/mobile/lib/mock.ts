// Mock data for the Clockd prototype. Bennett & Hayes LLP, demo firm.
// Same shape as the future Convex schema so this swaps cleanly later.

export type Firm = { id: string; name: string; location: string };
export type Lawyer = { id: string; firmId: string; name: string; initials: string; role: string; avatarKey?: string };
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
  rate: number; // hourly rate in USD
};
export type TimeEntry = {
  id: string;
  matterId: string;
  lawyerId: string;
  durationSec: number;
  description: string;
  createdAt: number; // ms
  status: 'draft' | 'pending' | 'approved';
  nonBillable: boolean;
  source: 'manual' | 'call';
  // Dana 2026-05-26: manual entries are categorized by activity type
  activity?: 'call' | 'email' | 'document' | 'text';
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

export const currentLawyer: Lawyer = {
  id: 'lwy_soph',
  firmId: firm.id,
  name: 'Sophia Williams',
  initials: 'SW',
  role: 'Lawyer',
  avatarKey: 'sophia',
};

export const lawyers: Lawyer[] = [
  currentLawyer,
  { id: 'lwy_jord', firmId: firm.id, name: 'Jordan Bennett', initials: 'JB', role: 'Partner' },
  { id: 'lwy_sara', firmId: firm.id, name: 'Sarah Chen', initials: 'SC', role: 'Senior Associate' },
  { id: 'lwy_marc', firmId: firm.id, name: 'Marcus Hayes', initials: 'MH', role: 'Partner', avatarKey: 'marcus' },
];

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
const hrMs = 60 * 60 * 1000;
const now = Date.now();

// Sophia's day so far — two entries logged this morning. Mix of approved
// (yesterday) and pending so the "needs review" counters tell a story.
export const seedEntries: TimeEntry[] = [
  // Today (Sophia)
  { id: 'te_1', matterId: 'mat_vert_1', lawyerId: 'lwy_soph', durationSec: 3120, description: 'Reviewed Vertex \'847 office action response. Drafted notes on claim 12 amendments.', createdAt: now - 3 * hrMs, status: 'approved', nonBillable: false, source: 'manual' },
  { id: 'te_2', matterId: 'mat_reyes_2', lawyerId: 'lwy_soph', durationSec: 1740, description: 'Call with Sarah Mitchell re: discovery responses and Horizon Corp settlement posture.', createdAt: now - 1.5 * hrMs, status: 'approved', nonBillable: false, source: 'call', contactId: 'ct_smitchell' },

  // Yesterday
  { id: 'te_3', matterId: 'mat_vert_1', lawyerId: 'lwy_soph', durationSec: 7200, description: 'Drafted claim chart for Vertex \'847 — cross-referenced prior art.', createdAt: now - 1 * dayMs, status: 'approved', nonBillable: false, source: 'manual' },
  { id: 'te_4', matterId: 'mat_acme_1', lawyerId: 'lwy_soph', durationSec: 2880, description: 'Reviewed deposition transcripts for Smith deposition prep. Flagged inconsistencies in opposing counsel\'s timeline.', createdAt: now - 1 * dayMs - 2 * hrMs, status: 'pending', nonBillable: false, source: 'manual' },

  // Earlier this week
  { id: 'te_5', matterId: 'mat_acme_2', lawyerId: 'lwy_soph', durationSec: 1860, description: 'Quick call with Ana Rodriguez on vendor contract renewal terms.', createdAt: now - 2 * dayMs, status: 'pending', nonBillable: false, source: 'call', contactId: 'ct_arodriguez' },
  { id: 'te_6', matterId: 'mat_reyes_1', lawyerId: 'lwy_soph', durationSec: 3600, description: 'Trust funding strategy memo for Miguel Reyes.', createdAt: now - 3 * dayMs, status: 'approved', nonBillable: false, source: 'manual' },
  { id: 'te_7', matterId: 'mat_vert_1', lawyerId: 'lwy_soph', durationSec: 1200, description: 'Internal call with Marcus re: claim strategy.', createdAt: now - 3 * dayMs - 2 * hrMs, status: 'approved', nonBillable: true, source: 'call' },
  { id: 'te_8', matterId: 'mat_north_1', lawyerId: 'lwy_soph', durationSec: 4200, description: 'Underwriter call — risk factor language for S-1.', createdAt: now - 4 * dayMs, status: 'approved', nonBillable: false, source: 'call', contactId: 'ct_dchen' },
];

// The "hero" entry that will appear on the admin during the demo, after the lawyer
// hits Submit on mobile. Pre-built so the demo is identical every time.
export const heroEntry: TimeEntry = {
  id: 'te_hero',
  matterId: 'mat_reyes_2',
  lawyerId: currentLawyer.id,
  durationSec: 484, // 00:08:04 — matches the Figma
  description: 'Discussed Reyes v. Horizon deposition prep. Confirmed witness availability for the 28th and agreed to draft the motion in limine by Friday.',
  createdAt: now,
  status: 'pending',
  nonBillable: false,
  source: 'call',
  contactId: 'ct_smitchell',
};

// Upcoming on Sophia's calendar — drives the "Up next" card on home.
export type Upcoming =
  | { kind: 'call'; id: string; contactId: string; matterId: string; at: number; durationMin: number }
  | { kind: 'deadline'; id: string; matterId: string; at: number; title: string; severity: 'soon' | 'today' | 'overdue' }
  | { kind: 'meeting'; id: string; matterId: string; at: number; title: string; with: string };

export const upcoming: Upcoming[] = [
  // In ~45 minutes — the call card on home
  { kind: 'call', id: 'up_1', contactId: 'ct_dchen', matterId: 'mat_north_1', at: now + 45 * 60 * 1000, durationMin: 30 },
  // Later today
  { kind: 'deadline', id: 'up_2', matterId: 'mat_reyes_2', at: now + 6 * hrMs, title: 'Motion in limine due', severity: 'today' },
  { kind: 'meeting', id: 'up_3', matterId: 'mat_acme_1', at: now + 8 * hrMs, title: 'Smith depo prep', with: 'James Park' },
  // This week
  { kind: 'deadline', id: 'up_4', matterId: 'mat_vert_1', at: now + 2 * dayMs, title: 'Office action response filing', severity: 'soon' },
  { kind: 'call', id: 'up_5', contactId: 'ct_lkim', matterId: 'mat_vert_1', at: now + 1.5 * dayMs, durationMin: 45 },
];

// Recent calls — used by the Calls screen, also feeds "this week's calls" stat.
export type RecentCall = {
  id: string;
  contactId: string;
  matterId?: string;
  direction: 'in' | 'out' | 'missed';
  at: number;
  durationSec: number;
  logged: boolean; // did Sophia accept the auto-log?
};

export const recentCalls: RecentCall[] = [
  { id: 'cl_1', contactId: 'ct_smitchell', matterId: 'mat_reyes_2', direction: 'out', at: now - 1.5 * hrMs, durationSec: 1740, logged: true },
  { id: 'cl_2', contactId: 'ct_arodriguez', matterId: 'mat_acme_2', direction: 'in', at: now - 2 * dayMs, durationSec: 1860, logged: true },
  { id: 'cl_3', contactId: 'ct_dchen', matterId: 'mat_north_1', direction: 'out', at: now - 4 * dayMs, durationSec: 4200, logged: true },
  { id: 'cl_4', contactId: 'ct_jpark', direction: 'missed', at: now - 5 * hrMs, durationSec: 0, logged: false },
  { id: 'cl_5', contactId: 'ct_lkim', matterId: 'mat_vert_1', direction: 'in', at: now - 6 * dayMs, durationSec: 920, logged: true },
];

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

// Utility helpers
export const matterById = (id: string) => matters.find(m => m.id === id);
export const clientById = (id: string) => clients.find(c => c.id === id);
export const lawyerById = (id: string) => lawyers.find(l => l.id === id);
export const contactById = (id: string) => contacts.find(c => c.id === id);

export const matterDisplay = (id: string) => {
  const m = matterById(id);
  if (!m) return 'Unknown matter';
  const c = clientById(m.clientId);
  return `${m.shortName} · ${c?.name ?? ''}`;
};

export const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`;
};

export const formatHours = (seconds: number) => {
  const hours = seconds / 3600;
  return `${hours.toFixed(2)}h`;
};

export const formatMoney = (cents: number) =>
  `$${(cents).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatMoneyShort = (n: number) => {
  if (n >= 1000) {
    const k = n / 1000;
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return `$${Math.round(n).toLocaleString()}`;
};

// Today's $ billable so far for the current lawyer — drives the home hero number.
export const entryValue = (e: TimeEntry) => {
  if (e.nonBillable) return 0;
  const m = matterById(e.matterId);
  return ((e.durationSec / 3600) * (m?.rate ?? 0));
};

// Friendly "in X" / "today" / "now" formatter for upcoming items.
export const formatRelative = (atMs: number) => {
  const diff = atMs - Date.now();
  const min = Math.round(diff / 60000);
  if (min < -60) return `${Math.round(-diff / (60 * 60 * 1000))}h ago`;
  if (min < 0) return `${-min}m ago`;
  if (min < 1) return 'now';
  if (min < 60) return `in ${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `in ${hr}h`;
  const d = Math.round(hr / 24);
  return d === 1 ? 'tomorrow' : `in ${d}d`;
};

// Avatar URI for a lawyer (or initials fallback). Bundled images for known
// lawyers; everyone else gets a colored disc with initials in the UI layer.
export const avatarSource: Record<string, any> = {
  sophia: require('@/assets/avatars/sophia.jpg'),
  marcus: require('@/assets/avatars/marcus.jpg'),
  sarah: require('@/assets/avatars/sarah.jpg'),
};

export const greetingFor = (date = new Date()) => {
  const h = date.getHours();
  if (h < 5) return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 22) return 'Good evening';
  return 'Working late';
};
