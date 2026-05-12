'use client';

import { useEffect, useState } from 'react';

import { AddEntrySlideOut } from '@/components/AddEntrySlideOut';

// Running-timer pill that lives in the firm-user header. Click to start —
// shows live HH:MM:SS counter. Click stop to open the AddEntrySlideOut with
// the duration pre-filled so Sophia can pick a matter and submit.

function format(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function TimerPill() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [addOpen, setAddOpen] = useState(false);
  const [pendingSec, setPendingSec] = useState(0);

  useEffect(() => {
    if (startedAt === null) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  const running = startedAt !== null;
  const elapsedSec = running ? Math.floor((now - startedAt!) / 1000) : 0;

  function start() {
    setStartedAt(Date.now());
    setNow(Date.now());
  }

  function stop() {
    if (startedAt === null) return;
    const sec = Math.max(60, Math.floor((Date.now() - startedAt) / 1000));
    setStartedAt(null);
    setPendingSec(sec);
    setAddOpen(true);
  }

  function cancel() {
    setStartedAt(null);
  }

  if (running) {
    return (
      <div className="flex items-center gap-1.5 h-10 pl-1 pr-1.5 rounded-full bg-danger-soft border border-danger/40">
        <span className="w-7 h-7 rounded-full bg-danger flex items-center justify-center text-white">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </span>
        <span className="text-sm font-semibold text-danger tabular-nums px-1 min-w-[64px] text-center">{format(elapsedSec)}</span>
        <button
          onClick={stop}
          title="Stop timer + log entry"
          className="h-7 px-2.5 rounded-full bg-accent hover:bg-accent-dim text-white text-xs font-semibold inline-flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2" /></svg>
          Stop &amp; log
        </button>
        <button
          onClick={cancel}
          title="Discard timer"
          className="w-7 h-7 rounded-full hover:bg-white/40 text-fg-muted hover:text-danger flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>

        <AddEntrySlideOut
          open={addOpen}
          onClose={() => { setAddOpen(false); setPendingSec(0); }}
          prefillSec={pendingSec}
        />
      </div>
    );
  }

  return (
    <>
      <button
        onClick={start}
        title="Start a timer for your current task"
        className="h-10 px-3.5 rounded-full border border-border bg-card text-sm font-medium text-fg hover:bg-bg inline-flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
        Start timer
      </button>
      <AddEntrySlideOut
        open={addOpen}
        onClose={() => { setAddOpen(false); setPendingSec(0); }}
        prefillSec={pendingSec}
      />
    </>
  );
}
