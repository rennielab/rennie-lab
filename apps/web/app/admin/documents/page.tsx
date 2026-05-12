'use client';

import { useMemo, useState } from 'react';

import { AdminShell } from '@/components/AdminShell';
import { UploadDocumentModal } from '@/components/UploadDocumentModal';
import { currentAdmin } from '@/lib/mock';
import { useAllDocuments, useSignedIds } from '@/lib/docsState';
import { formatFileSize } from '@/lib/portalData';

type Kind = 'all' | 'filing' | 'contract' | 'draft' | 'receipt' | 'letter';

const KIND_LABEL: Record<Exclude<Kind, 'all'>, string> = {
  filing: 'Filing', contract: 'Contract', draft: 'Draft', receipt: 'Receipt', letter: 'Letter',
};
const KIND_COLOR: Record<Exclude<Kind, 'all'>, { bg: string; fg: string }> = {
  filing: { bg: '#DBEAFE', fg: '#1D4ED8' },
  contract: { bg: '#DCFCE7', fg: '#166534' },
  draft: { bg: '#F3E8FF', fg: '#7E22CE' },
  receipt: { bg: '#F3F4F6', fg: '#374151' },
  letter: { bg: '#FEF3C7', fg: '#92400E' },
};

export default function AdminDocuments() {
  const docs = useAllDocuments();
  const signedIds = useSignedIds();
  const [kind, setKind] = useState<Kind>('all');
  const [q, setQ] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = docs;
    if (kind !== 'all') list = list.filter((d) => d.kind === kind);
    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(term) || d.matterName.toLowerCase().includes(term));
    }
    return list;
  }, [docs, kind, q]);

  const awaitingSig = docs.filter((d) => d.needsSignature && !signedIds.has(d.id));
  const signedRecently = docs.filter((d) => signedIds.has(d.id));

  return (
    <AdminShell
      title="Documents"
      subtitle="Upload and share documents with clients. Track signatures."
      action={
        <button onClick={() => setUploadOpen(true)} className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> Upload document
        </button>
      }>
      {/* Status strip */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatusCard label="Total documents" value={String(docs.length)} sub="All matters" />
        <StatusCard label="Awaiting signature" value={String(awaitingSig.length)} sub={awaitingSig.length === 0 ? 'All signed' : 'With clients now'} tone={awaitingSig.length > 0 ? 'warn' : 'ok'} />
        <StatusCard label="Signed this period" value={String(signedRecently.length)} sub="Clients have signed" tone={signedRecently.length > 0 ? 'accent' : 'ok'} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <div className="flex items-center gap-1 border border-border bg-card rounded-lg p-1">
          {(['all', 'filing', 'contract', 'draft', 'receipt'] as const).map((k) => (
            <button key={k} onClick={() => setKind(k)} className={`px-3 h-8 rounded-md text-xs font-medium ${kind === k ? 'bg-accent-soft text-accent-dark' : 'text-fg-muted hover:text-fg'}`}>
              {k === 'all' ? 'All' : KIND_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[40px_2fr_1.2fr_120px_140px_120px] gap-3 px-6 py-3 border-b border-border text-xs font-medium text-fg-muted">
          <div></div>
          <div>Name</div>
          <div>Matter</div>
          <div>Size</div>
          <div>Uploaded</div>
          <div>Status</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-fg-muted">No documents match this filter.</div>
        ) : (
          filtered.map((d) => {
            const color = KIND_COLOR[d.kind];
            const signed = signedIds.has(d.id);
            return (
              <div key={d.id} className="grid grid-cols-[40px_2fr_1.2fr_120px_140px_120px] gap-3 items-center px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/40">
                <span style={{ background: color.bg, color: color.fg }} className="w-9 h-9 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{d.name}</span>
                    <span style={{ background: color.bg, color: color.fg }} className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                      {KIND_LABEL[d.kind]}
                    </span>
                  </div>
                  <div className="text-xs text-fg-muted mt-0.5 truncate">Uploaded by {d.uploadedBy}</div>
                </div>
                <div className="text-sm text-fg truncate">{d.matterName}</div>
                <div className="text-sm text-fg-muted tabular-nums">{formatFileSize(d.sizeKb)}</div>
                <div className="text-sm text-fg-muted">{new Date(d.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                <div>
                  {d.needsSignature && !signed && <Pill label="Awaiting signature" tone="warn" />}
                  {d.needsSignature && signed && <Pill label="Signed" tone="ok" />}
                  {!d.needsSignature && <Pill label="Shared" tone="neutral" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      <UploadDocumentModal open={uploadOpen} onClose={() => setUploadOpen(false)} uploadedBy={currentAdmin.name} />
    </AdminShell>
  );
}

function StatusCard({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: 'warn' | 'accent' | 'ok' }) {
  const valueClass = tone === 'warn' ? 'text-warning' : tone === 'accent' ? 'text-accent-dark' : 'text-fg';
  return (
    <div className="bg-card border border-border rounded-2xl px-5 py-4">
      <div className="text-xs text-fg-muted">{label}</div>
      <div className={`text-2xl font-semibold tabular-nums tracking-tight mt-1 ${valueClass}`}>{value}</div>
      <div className="text-[11px] text-fg-subtle mt-0.5">{sub}</div>
    </div>
  );
}

function Pill({ label, tone }: { label: string; tone: 'warn' | 'ok' | 'neutral' }) {
  const cls = tone === 'warn' ? 'bg-warning-soft text-warning' : tone === 'ok' ? 'bg-accent-soft text-accent-dark' : 'bg-bg text-fg-muted';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}
