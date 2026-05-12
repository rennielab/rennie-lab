'use client';

import Link from 'next/link';

import { PortalShell } from '@/components/PortalShell';
import { firm } from '@/lib/mock';

const PEOPLE = [
  { name: 'Marcus Hayes', role: 'Managing Partner · Your attorney', email: 'marcus.hayes@bennetthayes.law', phone: '+1 (415) 555-0190', initials: 'MH', bg: '#DCFCE7', fg: '#166534' },
  { name: 'Sarah Chen', role: 'Senior Associate', email: 'sarah.chen@bennetthayes.law', phone: '+1 (415) 555-0191', initials: 'SC', bg: '#DBEAFE', fg: '#1D4ED8' },
  { name: 'Jordan Bennett', role: 'Partner', email: 'jordan@bennetthayes.law', phone: '+1 (415) 555-0192', initials: 'JB', bg: '#FEE2E2', fg: '#B91C1C' },
];

export default function PortalContact() {
  return (
    <PortalShell>
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.5px]">Contact</h1>
          <p className="text-sm text-fg-muted mt-1">Reach your legal team by phone or email — or send a message for in-portal reply.</p>
        </div>
        <Link
          href="/portal/messages"
          className="h-11 px-5 rounded-[10px] bg-accent hover:bg-accent-dim text-white text-sm font-semibold transition inline-flex items-center gap-2">
          Open messages
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Firm card */}
      <div className="bg-card border border-border rounded-2xl px-6 py-6 mb-4">
        <h2 className="text-base font-semibold text-fg mb-5">{firm.name}</h2>
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          <Row icon={<IconMail />} label="General email" value="contact@bennetthayes.law" />
          <Row icon={<IconPhone />} label="Main line" value="+1 (415) 555-0120" />
          <Row icon={<IconPin />} label="Office" value="100 Market Street, Suite 2400, San Francisco, CA 94105" />
          <Row icon={<IconClock />} label="Hours" value="Mon–Fri, 8 AM – 6 PM PT" />
        </div>
      </div>

      {/* People */}
      <div className="bg-card border border-border rounded-2xl px-6 py-6">
        <h2 className="text-base font-semibold text-fg mb-5">Your team</h2>
        <div className="grid grid-cols-3 gap-4">
          {PEOPLE.map((p) => (
            <div key={p.email} className="border border-border rounded-xl p-5 flex flex-col items-center text-center">
              <span style={{ background: p.bg, color: p.fg }} className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold mb-3">
                {p.initials}
              </span>
              <div className="text-sm font-semibold text-fg">{p.name}</div>
              <div className="text-xs text-fg-muted mb-3">{p.role}</div>
              <div className="text-xs text-fg-muted truncate w-full">{p.email}</div>
              <div className="text-xs text-fg-muted">{p.phone}</div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-bg flex items-center justify-center text-fg-muted shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-fg-muted">{label}</div>
        <div className="text-sm font-medium text-fg mt-0.5 leading-snug">{value}</div>
      </div>
    </div>
  );
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
