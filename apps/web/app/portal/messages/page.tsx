'use client';

import { useEffect, useRef, useState } from 'react';

import { PortalShell } from '@/components/PortalShell';
import { formatRelative, sendClientMessage, useMessages } from '@/lib/portalState';

export default function PortalMessages() {
  const messages = useMessages();
  const [draft, setDraft] = useState('');
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function send() {
    const body = draft.trim();
    if (!body) return;
    sendClientMessage(body);
    setDraft('');
  }

  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-[-0.5px]">Messages</h1>
        <p className="text-sm text-fg-muted mt-1">Direct conversation with Bennett &amp; Hayes LLP.</p>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-4">
        {/* Thread */}
        <div className="bg-card border border-border rounded-2xl flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <span style={{ background: '#DCFCE7', color: '#166534' }} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold">
              JC
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">John Carter</div>
              <div className="text-xs text-fg-muted">Managing Partner · usually replies within 1 hour</div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-accent-soft text-accent-dark font-semibold">Online</span>
          </div>

          <div ref={scrollerRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {messages.map((m) => {
              const mine = m.from === 'client';
              return (
                <div key={m.id} className={`flex gap-3 ${mine ? 'flex-row-reverse' : ''}`}>
                  <span
                    style={{
                      background: mine ? '#FFE4E6' : '#DCFCE7',
                      color: mine ? '#9F1239' : '#166534',
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                    {m.authorInitials}
                  </span>
                  <div className={`max-w-[70%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        mine ? 'bg-accent text-white rounded-tr-md' : 'bg-bg text-fg rounded-tl-md'
                      }`}>
                      {m.body}
                    </div>
                    <div className={`text-[11px] text-fg-subtle mt-1 ${mine ? 'text-right' : ''}`}>
                      {m.authorName} · {formatRelative(m.at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Type your message…  (⌘+Enter to send)"
                rows={2}
                className="flex-1 px-3.5 py-2.5 rounded-[10px] border border-border bg-card text-sm placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
              />
              <button
                onClick={send}
                disabled={!draft.trim()}
                className="h-11 px-5 rounded-[10px] bg-accent hover:bg-accent-dim text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2">
                Send
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar — who you're talking to */}
        <aside className="space-y-3">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="text-xs text-fg-muted mb-3">Your attorney</div>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ background: '#DCFCE7', color: '#166534' }} className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold">
                JC
              </span>
              <div>
                <div className="text-sm font-semibold">John Carter</div>
                <div className="text-xs text-fg-muted">Managing Partner</div>
              </div>
            </div>
            <div className="text-xs text-fg-muted space-y-1.5">
              <div className="truncate">john.carter@bennetthayes.law</div>
              <div>+1 (415) 555-0190</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="text-xs text-fg-muted mb-2">Response time</div>
            <div className="text-sm font-semibold text-fg">Usually within 1 hour</div>
            <div className="text-xs text-fg-muted mt-1">Mon–Fri, 8 AM – 6 PM PT</div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="text-xs text-fg-muted mb-2">After hours?</div>
            <div className="text-sm text-fg leading-relaxed">
              For urgent matters call the main line at <span className="font-semibold">+1 (415) 555-0120</span>.
            </div>
          </div>
        </aside>
      </div>
    </PortalShell>
  );
}
