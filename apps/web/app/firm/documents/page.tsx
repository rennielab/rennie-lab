'use client';

import { useMemo, useState } from 'react';

import { FirmShell } from '@/components/FirmShell';
import { UploadDocumentModal } from '@/components/UploadDocumentModal';
import { currentFirmUser, matters as allMatters, seedEntries } from '@/lib/mock';
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

export default function FirmDocuments() {
  const docs = useAllDocuments();
  const signedIds = useSignedIds();
  const [kind, setKind] = useState<Kind>('all');
  const [q, setQ] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);

  // Sophia's scope: docs on matters she's worked on
  const myMatterIds = new Set(seedEntries.filter((e) => e.lawyerId === currentFirmUser.id).map((e) => e.matterId));
  const scoped = docs.filter((d) => myMatterIds.has(d.matterId));

  const filtered = useMemo(() => {
    let list = scoped;
    if (kind !== 'all') list = list.filter((d) => d.kind === kind);
    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(term) || d.matterName.toLowerCase().includes(term));
    }
    return list;
  }, [scoped, kind, q]);

  const byMatter = useMemo(() => {
    const groups: Record<string, { matterName: string; docs: typeof filtered }> = {};
    filtered.forEach((d) => {
      if (!groups[d.matterId]) groups[d.matterId] = { matterName: d.matterName, docs: [] };
      groups[d.matterId].docs.push(d);
    });
    return Object.entries(groups);
  }, [filtered]);

  return (
    <FirmShell
      title="Documents"
      subtitle="Files across the matters you're on. Upload drafts, share with clients."
      action={
        <button onClick={() => setUploadOpen(true)} className="bg-accent hover:bg-accent-dim text-white font-semibold text-sm px-4 h-10 rounded-lg inline-flex items-center gap-1.5">
          <span className="text-base leading-none">+</span> Upload document
        </button>
      }>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-card border border-border rounded-lg px-3 h-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your documents..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-subtle" />
        </div>
        <div className="flex items-center gap-1 border border-border bg-card rounded-lg p-1">
          {(['all', 'filing', 'contract', 'draft', 'receipt'] as const).map((k) => (
            <button key={k} onClick={() => setKind(k)} className={`px-3 h-8 rounded-md text-xs font-medium ${kind === k ? 'bg-accent-soft text-accent-dark' : 'text-fg-muted hover:text-fg'}`}>
              {k === 'all' ? 'All' : KIND_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      {byMatter.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-sm text-fg-muted">
          No documents on your matters yet. Hit Upload to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {byMatter.map(([matterId, group]) => (
            <div key={matterId} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-6 py-3 border-b border-border bg-bg/40">
                <div className="text-sm font-semibold">{group.matterName}</div>
                <div className="text-xs text-fg-muted">{group.docs.length} {group.docs.length === 1 ? 'document' : 'documents'}</div>
              </div>
              {group.docs.map((d) => {
                const color = KIND_COLOR[d.kind];
                const signed = signedIds.has(d.id);
                return (
                  <div key={d.id} className="grid grid-cols-[40px_1fr_120px_140px_120px] gap-3 items-center px-6 py-3.5 border-b border-border last:border-0">
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
                        {d.needsSignature && !signed && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-warning text-white">SIGN</span>}
                        {d.needsSignature && signed && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent text-white">SIGNED</span>}
                      </div>
                      <div className="text-xs text-fg-muted mt-0.5">Uploaded by {d.uploadedBy}</div>
                    </div>
                    <div className="text-sm text-fg-muted tabular-nums">{formatFileSize(d.sizeKb)}</div>
                    <div className="text-sm text-fg-muted">{new Date(d.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div></div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <UploadDocumentModal open={uploadOpen} onClose={() => setUploadOpen(false)} uploadedBy={currentFirmUser.name} />
    </FirmShell>
  );
}
