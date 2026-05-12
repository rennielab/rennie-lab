'use client';

import { useState } from 'react';

import { PortalShell } from '@/components/PortalShell';
import { firm } from '@/lib/mock';

export default function PortalContact() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-fg">Contact</h1>
        <p className="text-sm text-fg-muted mt-1">Reach out to your legal team or send a message.</p>
      </div>

      {/* Organization card */}
      <div className="bg-card border border-border rounded-2xl px-6 py-6 mb-4">
        <h2 className="text-base font-semibold text-fg mb-5">Organization</h2>
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          <Row icon={<IconBuilding />} label="Organization" value={firm.name} />
          <Row icon={<IconMail />} label="Email" value="contact@bennetthayes.law" />
          <Row icon={<IconPhone />} label="Phone" value="+1 (415) 555-0120" />
          <Row icon={<IconPin />} label="Address" value="100 Market Street, Suite 2400 San Francisco, CA 94105" />
        </div>
      </div>

      {/* Send a message */}
      <div className="bg-card border border-border rounded-2xl px-6 py-6">
        <h2 className="text-base font-semibold text-fg mb-5">Send a Message</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            setSubject('');
            setMessage('');
            setTimeout(() => setSent(false), 2500);
          }}
          className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-fg">Subject</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this regarding?"
              className="mt-1.5 w-full h-11 px-3.5 rounded-[10px] border border-border bg-card text-sm placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-fg">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="mt-1.5 w-full px-3.5 py-3 rounded-[10px] border border-border bg-card text-sm placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            />
          </label>
          <div className="flex justify-end items-center gap-3">
            {sent && <span className="text-sm font-medium text-accent">Message sent ✓</span>}
            <button
              type="submit"
              disabled={!subject || !message}
              className="h-11 px-6 rounded-[10px] bg-accent hover:bg-accent-dim text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
              Send Message
            </button>
          </div>
        </form>
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

function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
