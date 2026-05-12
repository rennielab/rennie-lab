'use client';

import { useEffect, useRef, useState } from 'react';

import {
  ChatAuthor,
  formatRelative,
  markChatRead,
  sendMessage,
  useChatUnread,
  useMessages,
} from '@/lib/portalState';

// Color palette for message bubbles based on who sent it.
function paletteFor(side: 'client' | 'firm', isMe: boolean) {
  if (isMe) return { bubble: 'bg-accent text-white', avatar: 'bg-accent-soft-2 text-accent-dark' };
  if (side === 'firm') return { bubble: 'bg-bg text-fg', avatar: 'bg-[#FED7AA] text-[#9A3412]' };
  return { bubble: 'bg-bg text-fg', avatar: 'bg-[#FFE4E6] text-[#9F1239]' };
}

export function ChatButton({
  me,
  className = '',
}: {
  me: ChatAuthor;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const unread = useChatUnread(me.side);

  function handleOpen() {
    setOpen(true);
    markChatRead(me.side);
  }

  return (
    <>
      <button
        onClick={handleOpen}
        title="Chat with the room"
        className={`w-10 h-10 rounded-full border border-border bg-card hover:bg-bg flex items-center justify-center relative ${className}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <ChatSlideOut open={open} onClose={() => setOpen(false)} me={me} />
    </>
  );
}

function ChatSlideOut({ open, onClose, me }: { open: boolean; onClose: () => void; me: ChatAuthor }) {
  const messages = useMessages();
  const [draft, setDraft] = useState('');
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      // Scroll to bottom on open and on new message
      const t = setTimeout(() => {
        const el = scrollerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
      return () => clearTimeout(t);
    }
  }, [open, messages.length]);

  function send() {
    const body = draft.trim();
    if (!body) return;
    sendMessage(me, body);
    setDraft('');
    markChatRead(me.side);
  }

  if (!open) return null;

  const otherSideLabel = me.side === 'firm' ? 'Reyes Family Trust · Sarah Mitchell' : 'Bennett & Hayes LLP';
  const subline = me.side === 'firm' ? 'Shared firm ↔ client channel' : 'Your direct line to the firm';

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
      <div className="fixed top-0 right-0 bottom-0 z-50 w-[440px] bg-card border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-fg truncate">Campfire · {otherSideLabel}</div>
            <div className="text-xs text-fg-muted flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {subline}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-bg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-bg/30">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-fg-muted text-center">
              <div>
                <div className="text-2xl mb-2">💬</div>
                No messages yet. Say hi.
              </div>
            </div>
          ) : messages.map((m) => {
            const isMe = m.authorName === me.name;
            const p = paletteFor(m.from, isMe);
            return (
              <div key={m.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${p.avatar}`}>
                  {m.authorInitials}
                </span>
                <div className={`max-w-[78%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${p.bubble} ${isMe ? 'rounded-tr-md' : 'rounded-tl-md'}`}>
                    {m.body}
                  </div>
                  <div className={`text-[11px] text-fg-subtle mt-1 ${isMe ? 'text-right' : ''}`}>
                    {m.authorName}{m.authorRole ? ` · ${m.authorRole}` : ''} · {formatRelative(m.at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compose */}
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
              placeholder={`Posting as ${me.name}…  ⌘+Enter to send`}
              rows={2}
              className="flex-1 px-3 py-2 rounded-[10px] border border-border bg-card text-sm placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="h-11 w-11 rounded-[10px] bg-accent hover:bg-accent-dim text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
