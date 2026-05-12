'use client';

import { useMemo, useState } from 'react';

import { PortalShell } from '@/components/PortalShell';
import { SignDocumentModal } from '@/components/SignDocumentModal';
import { useAllDocuments, useSignedIds } from '@/lib/docsState';
import { Document, formatFileSize, formatDueRelative } from '@/lib/portalData';

type Kind = 'all' | 'filing' | 'contract' | 'draft' | 'receipt' | 'letter';

const KIND_LABEL: Record<Exclude<Kind, 'all'>, string> = {
  filing: 'Filing',
  contract: 'Contract',
  draft: 'Draft',
  receipt: 'Receipt',
  letter: 'Letter',
};

const KIND_COLOR: Record<Exclude<Kind, 'all'>, { bg: string; fg: string }> = {
  filing: { bg: '#DBEAFE', fg: '#1D4ED8' },
  contract: { bg: '#DCFCE7', fg: '#166534' },
  draft: { bg: '#F3E8FF', fg: '#7E22CE' },
  receipt: { bg: '#F3F4F6', fg: '#374151' },
  letter: { bg: '#FEF3C7', fg: '#92400E' },
};

export default function PortalDocuments() {
  const allDocs = useAllDocuments();
  const signedIds = useSignedIds();
  const [kind, setKind] = useState<Kind>('all');
  const [q, setQ] = useState('');
  const [signing, setSigning] = useState<Document | null>(null);

  const filtered = useMemo(() => {
    // Drop internal-only docs (drafts are firm work product; clients see
    // filings, signed contracts, and receipts).
    let docs = allDocs.filter((d) => d.kind !== 'draft');
    if (kind !== 'all') docs = docs.filter((d) => d.kind === kind);
    if (q.trim()) {
      const term = q.toLowerCase();
      docs = docs.filter((d) => d.name.toLowerCase().includes(term) || d.matterName.toLowerCase().includes(term));
    }
    return [...docs].sort((a, b) => b.uploadedAt - a.uploadedAt);
  }, [allDocs, kind, q]);

  const byMatter = useMemo(() => {
    const groups: Record<string, { matterName: string; docs: Document[] }> = {};
    filtered.forEach((d) => {
      groups[d.matterId] = groups[d.matterId] ?? { matterName: d.matterName, docs: [] };
      groups[d.matterId].docs.push(d);
    });
    return Object.entries(groups);
  }, [filtered]);

  const needsSig = allDocs.filter((d) => d.needsSignature && !signedIds.has(d.id));

  return (
    <PortalShell>
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.5px]">Documents</h1>
          <p className="text-sm text-fg-muted mt-1">Court filings, contracts, drafts, and receipts across your matters.</p>
        </div>
        {/* Upload from the client side is intentionally out of scope for v1 —
            adding it would need a "send to firm" flow distinct from the admin
            upload modal (no share-with-client toggle etc). */}
      </div>

      {/* Needs signature banner */}
      {needsSig.length > 0 && (
        <div className="mb-4 bg-warning-soft/40 border border-warning/40 rounded-2xl px-5 py-3 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-warning text-white flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="flex-1 text-sm">
            <span className="font-semibold text-warning">
              {needsSig.length} {needsSig.length === 1 ? 'document needs' : 'documents need'} your signature.
            </span>
            <span className="text-fg-muted"> Review and sign so your firm can move forward.</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documents..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle"
          />
        </div>
        <div className="flex items-center gap-1 border border-border bg-card rounded-lg p-1">
          {(['all', 'filing', 'contract', 'receipt'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`px-3 h-8 rounded-md text-xs font-medium ${
                kind === k ? 'bg-accent-soft text-accent-dark' : 'text-fg-muted hover:text-fg'
              }`}>
              {k === 'all' ? 'All' : KIND_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      {byMatter.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="text-sm text-fg-muted">No documents match your filter.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {byMatter.map(([matterId, group]) => (
            <div key={matterId} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-6 py-3 border-b border-border bg-bg/40">
                <div className="text-sm font-semibold text-fg">{group.matterName}</div>
                <div className="text-xs text-fg-muted">{group.docs.length} {group.docs.length === 1 ? 'document' : 'documents'}</div>
              </div>
              {group.docs.map((d) => (
                <DocRow key={d.id} d={d} signed={signedIds.has(d.id)} onSign={() => setSigning(d)} />
              ))}
            </div>
          ))}
        </div>
      )}

      {signing && <SignDocumentModal doc={signing} onClose={() => setSigning(null)} />}
    </PortalShell>
  );
}

function DocRow({ d, signed, onSign }: { d: Document; signed: boolean; onSign: () => void }) {
  const color = KIND_COLOR[d.kind];
  const date = new Date(d.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const showSign = d.needsSignature && !signed;
  return (
    <div className="grid grid-cols-[40px_1fr_140px_140px_180px] gap-3 items-center px-6 py-3.5 border-b border-border last:border-0 hover:bg-bg/40">
      <span style={{ background: color.bg, color: color.fg }} className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-fg truncate">{d.name}</span>
          <span style={{ background: color.bg, color: color.fg }} className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
            {KIND_LABEL[d.kind]}
          </span>
          {showSign && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-warning text-white">SIGN</span>}
          {d.needsSignature && signed && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent text-white">SIGNED</span>}
        </div>
        <div className="text-xs text-fg-muted mt-0.5">
          Uploaded {date} by {d.uploadedBy}
        </div>
      </div>
      <div className="text-xs text-fg-muted tabular-nums">{formatFileSize(d.sizeKb)}</div>
      <div className="text-xs text-fg-muted">{formatDueRelative(d.uploadedAt).label.replace('overdue', 'ago')}</div>
      <div className="flex justify-end gap-1">
        {showSign && (
          <button onClick={onSign} className="h-8 px-3 rounded-lg bg-warning hover:bg-warning/90 text-white text-xs font-semibold">
            Review &amp; sign
          </button>
        )}
        <button title="Download" className="w-8 h-8 rounded-lg text-fg-muted hover:text-fg hover:bg-bg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
