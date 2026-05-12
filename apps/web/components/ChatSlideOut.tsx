'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  ChatAuthor,
  clearTyping,
  formatRelative,
  markChatRead,
  MENTIONS,
  Mention,
  sendMessage,
  setTyping,
  useChatUnread,
  useMessages,
  useTypingOthers,
} from '@/lib/portalState';

// Distinct bubble palette per role — ensures messages are always legible
// regardless of which persona is viewing.
function bubbleFor(side: 'client' | 'firm', isMe: boolean) {
  if (isMe) {
    return {
      bubble: 'bg-accent text-white border border-accent',
      meta: 'text-fg-subtle',
    };
  }
  if (side === 'firm') {
    return {
      bubble: 'bg-card text-fg border border-border',
      meta: 'text-fg-subtle',
    };
  }
  // client (their messages)
  return {
    bubble: 'bg-[#FFE4E6] text-fg border border-[#FECDD3]',
    meta: 'text-fg-subtle',
  };
}

export function ChatButton({ me, className = '' }: { me: ChatAuthor; className?: string }) {
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
        title="Open campfire chat"
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

// Date separator label between messages from different days.
function dateLabel(at: number): string {
  const d = new Date(at);
  const now = new Date();
  const days = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
  if (days === 0 && d.getDate() === now.getDate()) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

// Inline mention pills: render "@Marcus Hayes" as a styled chip.
function renderBody(body: string) {
  // Match "@Name Surname" where both parts start uppercase.
  const parts: (string | { mention: Mention })[] = [];
  const regex = /@([A-Z][a-z]+(?: [A-Z][a-z]+)?)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(body)) !== null) {
    const name = m[1];
    const mention = MENTIONS.find((x) => x.name === name);
    if (!mention) continue;
    if (m.index > last) parts.push(body.slice(last, m.index));
    parts.push({ mention });
    last = m.index + m[0].length;
  }
  if (last < body.length) parts.push(body.slice(last));
  if (parts.length === 0) parts.push(body);
  return parts.map((p, i) => {
    if (typeof p === 'string') return <span key={i}>{p}</span>;
    return (
      <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-accent-soft text-accent-dark font-semibold text-[12.5px] mx-0.5">
        @{p.mention.name}
      </span>
    );
  });
}

function ChatSlideOut({ open, onClose, me }: { open: boolean; onClose: () => void; me: ChatAuthor }) {
  const messages = useMessages();
  const typingOthers = useTypingOthers(me.name);
  const [draft, setDraft] = useState('');
  const [mentionPicker, setMentionPicker] = useState<{ open: boolean; query: string; pos: number }>({ open: false, query: '', pos: 0 });
  const [selectedMentionIdx, setSelectedMentionIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !mentionPicker.open) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, mentionPicker.open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        const el = scrollerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
      return () => clearTimeout(t);
    }
  }, [open, messages.length]);

  // Group consecutive messages by author + minute for tight stacking.
  const groups = useMemo(() => {
    const result: { author: typeof messages[number]; bodies: typeof messages }[] = [];
    for (const m of messages) {
      const last = result[result.length - 1];
      if (last && last.author.authorName === m.authorName && m.at - last.author.at < 5 * 60 * 1000) {
        last.bodies.push(m);
      } else {
        result.push({ author: m, bodies: [m] });
      }
    }
    return result;
  }, [messages]);

  function handleDraftChange(value: string, caret: number) {
    setDraft(value);

    // typing indicator (broadcast)
    setTyping(me.name);

    // @ mention typeahead: look back from caret for "@" with no whitespace after
    const before = value.slice(0, caret);
    const atIndex = before.lastIndexOf('@');
    if (atIndex === -1) {
      setMentionPicker({ open: false, query: '', pos: 0 });
      return;
    }
    const after = value.slice(atIndex + 1, caret);
    if (/\s|\n/.test(after) || after.length > 30) {
      setMentionPicker({ open: false, query: '', pos: 0 });
      return;
    }
    setMentionPicker({ open: true, query: after, pos: atIndex });
    setSelectedMentionIdx(0);
  }

  const filteredMentions = mentionPicker.open
    ? MENTIONS.filter((m) => m.name.toLowerCase().includes(mentionPicker.query.toLowerCase())).slice(0, 5)
    : [];

  function applyMention(mention: Mention) {
    const before = draft.slice(0, mentionPicker.pos);
    const afterStart = mentionPicker.pos + 1 + mentionPicker.query.length;
    const after = draft.slice(afterStart);
    const inserted = `@${mention.name} `;
    const next = before + inserted + after;
    setDraft(next);
    setMentionPicker({ open: false, query: '', pos: 0 });
    // Restore focus + caret
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.focus();
        const newCaret = before.length + inserted.length;
        ta.setSelectionRange(newCaret, newCaret);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (mentionPicker.open && filteredMentions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIdx((i) => Math.min(filteredMentions.length - 1, i + 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIdx((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applyMention(filteredMentions[selectedMentionIdx]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMentionPicker({ open: false, query: '', pos: 0 });
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function send() {
    const body = draft.trim();
    if (!body) return;
    sendMessage(me, body);
    setDraft('');
    clearTyping(me.name);
    markChatRead(me.side);
  }

  if (!open || !mounted) return null;

  const otherSideLabel = me.side === 'firm' ? 'Reyes Family Trust' : 'Bennett & Hayes LLP';
  const onlineMembers = MENTIONS.filter((m) => m.id !== meId(me));
  const typingText = typingOthers.length
    ? `${typingOthers.slice(0, 2).join(', ')}${typingOthers.length > 2 ? ` +${typingOthers.length - 2}` : ''} typing…`
    : '';

  // Render with date separators
  const decoratedGroups: ({ kind: 'date'; label: string } | { kind: 'group'; author: typeof messages[number]; bodies: typeof messages })[] = [];
  let lastDay = '';
  for (const g of groups) {
    const label = dateLabel(g.author.at);
    if (label !== lastDay) {
      decoratedGroups.push({ kind: 'date', label });
      lastDay = label;
    }
    decoratedGroups.push({ kind: 'group', author: g.author, bodies: g.bodies });
  }

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
      <div
        className="fixed top-0 right-0 bottom-0 z-50 bg-card border-l border-border shadow-2xl flex flex-col"
        style={{ width: 'min(50vw, 760px)', minWidth: '480px' }}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-3 bg-card">
          <span className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-base font-semibold text-fg truncate">Campfire</div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent-soft text-accent-dark font-semibold">
                Bennett &amp; Hayes ↔ {otherSideLabel}
              </span>
            </div>
            <div className="text-xs text-fg-muted flex items-center gap-3 mt-1">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {onlineMembers.length + 1} in the room
              </span>
              <span>·</span>
              <span>Posting as <span className="text-fg font-medium">{me.name}</span></span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-bg flex items-center justify-center text-fg-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Room members strip */}
        <div className="px-5 py-2.5 border-b border-border bg-bg/40 flex items-center gap-2 overflow-x-auto">
          {MENTIONS.map((m) => {
            const isMe = m.name === me.name;
            return (
              <div key={m.id} className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${isMe ? 'bg-accent text-white' : 'bg-card border border-border'}`}>
                <span className="relative">
                  <img src={m.avatarUrl} alt="" width={20} height={20} className="w-5 h-5 rounded-full ring-1 ring-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent ring-2 ring-card" />
                </span>
                <span className="font-medium">{m.name.split(' ')[0]}{isMe ? ' (you)' : ''}</span>
              </div>
            );
          })}
        </div>

        {/* Messages */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-2 bg-bg/30">
          {decoratedGroups.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-fg-muted text-center">
              <div>
                <div className="text-3xl mb-2">🔥</div>
                <div className="font-medium text-fg mb-1">Light the campfire</div>
                <div className="text-xs">Say hi to kick off the conversation.</div>
              </div>
            </div>
          ) : (
            decoratedGroups.map((item, gi) => {
              if (item.kind === 'date') {
                return (
                  <div key={`d-${gi}`} className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] font-semibold text-fg-muted uppercase tracking-wide">{item.label}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                );
              }
              const g = item;
              const isMe = g.author.authorName === me.name;
              const p = bubbleFor(g.author.from, isMe);
              const mention = MENTIONS.find((x) => x.name === g.author.authorName);
              return (
                <div key={`g-${gi}`} className={`flex gap-3 mb-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {mention ? (
                    <img src={mention.avatarUrl} alt="" width={36} height={36} className="w-9 h-9 rounded-full shrink-0" />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-bg text-fg-muted flex items-center justify-center text-xs font-bold shrink-0">
                      {g.author.authorInitials}
                    </span>
                  )}
                  <div className={`max-w-[78%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`flex items-baseline gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm font-semibold text-fg">{g.author.authorName}</span>
                      {g.author.authorRole && (
                        <span className="text-xs text-fg-muted">{g.author.authorRole}</span>
                      )}
                      <span className="text-xs text-fg-subtle">· {formatRelative(g.author.at)}</span>
                    </div>
                    {g.bodies.map((m) => (
                      <div key={m.id} className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${p.bubble} ${isMe ? 'rounded-tr-md' : 'rounded-tl-md'}`}>
                        {renderBody(m.body)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
          {typingText && (
            <div className="flex items-center gap-2 px-2 pt-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-fg-subtle animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-fg-subtle animate-pulse [animation-delay:120ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-fg-subtle animate-pulse [animation-delay:240ms]" />
              </div>
              <span className="text-xs text-fg-muted italic">{typingText}</span>
            </div>
          )}
        </div>

        {/* Compose */}
        <div className="border-t border-border bg-card relative">
          {mentionPicker.open && filteredMentions.length > 0 && (
            <div className="absolute left-3 right-3 bottom-full mb-2 bg-card border border-border rounded-xl shadow-[0_-12px_40px_-12px_rgba(15,20,25,0.18)] overflow-hidden z-10">
              <div className="px-3 py-2 border-b border-border text-[10px] font-bold uppercase tracking-wide text-fg-muted">Tag someone</div>
              {filteredMentions.map((m, i) => (
                <button
                  key={m.id}
                  onMouseDown={(e) => { e.preventDefault(); applyMention(m); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left ${i === selectedMentionIdx ? 'bg-accent-soft' : 'hover:bg-bg'}`}>
                  <img src={m.avatarUrl} alt="" width={28} height={28} className="w-7 h-7 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{m.name}</div>
                    <div className="text-xs text-fg-muted truncate">{m.role}</div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${m.side === 'firm' ? 'text-accent-dark' : 'text-[#9F1239]'}`}>
                    {m.side}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="px-3 pt-3 pb-3 flex items-end gap-2">
            <button title="Attach file" className="w-10 h-10 rounded-lg border border-border hover:bg-bg flex items-center justify-center text-fg-muted shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => handleDraftChange(e.target.value, e.target.selectionStart ?? e.target.value.length)}
              onSelect={(e) => {
                const t = e.currentTarget;
                handleDraftChange(t.value, t.selectionStart ?? t.value.length);
              }}
              onBlur={() => clearTyping(me.name)}
              onKeyDown={handleKeyDown}
              placeholder="Write a message…  @ to tag someone · Enter to send"
              rows={2}
              className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="h-11 px-4 rounded-lg bg-accent hover:bg-accent-dim text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5">
              Send
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

function meId(me: ChatAuthor): string {
  return MENTIONS.find((x) => x.name === me.name)?.id ?? '';
}
