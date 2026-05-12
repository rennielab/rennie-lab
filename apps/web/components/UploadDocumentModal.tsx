'use client';

import { useState } from 'react';

import { clients, matters } from '@/lib/mock';
import { uploadDocument } from '@/lib/docsState';
import type { Document } from '@/lib/portalData';

export function UploadDocumentModal({
  open,
  onClose,
  uploadedBy,
  defaultMatterId,
}: {
  open: boolean;
  onClose: () => void;
  uploadedBy: string;
  defaultMatterId?: string;
}) {
  const [matterId, setMatterId] = useState(defaultMatterId ?? matters[0]?.id ?? '');
  const [name, setName] = useState('');
  const [kind, setKind] = useState<Document['kind']>('contract');
  const [needsSignature, setNeedsSignature] = useState(false);
  const [shareWithClient, setShareWithClient] = useState(true);

  if (!open) return null;

  const matter = matters.find((m) => m.id === matterId);
  const client = matter ? clients.find((c) => c.id === matter.clientId) : undefined;
  const canSave = !!matterId && name.trim().length > 0;

  function commit() {
    if (!canSave || !matter) return;
    const trimmed = name.trim();
    const finalName = trimmed.toLowerCase().endsWith('.pdf') ? trimmed : `${trimmed}.pdf`;
    uploadDocument({
      matterId: matter.id,
      matterName: matter.shortName,
      name: finalName,
      kind,
      sizeKb: 800 + Math.floor(Math.random() * 2000),
      uploadedBy,
      needsSignature,
    });
    onClose();
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-6">
      <div onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="text-lg font-semibold mb-1">Upload a document</div>
        <p className="text-sm text-fg-muted mb-5">{shareWithClient ? 'Shared with the client by default.' : 'Internal — not visible to the client.'}</p>

        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-fg-muted">Matter</span>
            <select
              value={matterId}
              onChange={(e) => setMatterId(e.target.value)}
              className="mt-1.5 w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
              {matters.map((m) => {
                const c = clients.find((cl) => cl.id === m.clientId);
                return <option key={m.id} value={m.id}>{c?.name} · {m.shortName}</option>;
              })}
            </select>
            {client && <span className="text-xs text-fg-muted mt-1 block">Client: {client.name}</span>}
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-fg-muted">Document name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Engagement letter — updated"
              className="mt-1.5 w-full h-11 px-3 rounded-lg border border-border bg-card text-sm placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </label>

          <div>
            <div className="text-xs font-semibold text-fg-muted mb-2">Type</div>
            <div className="grid grid-cols-5 gap-1.5">
              {(['filing', 'contract', 'draft', 'receipt', 'letter'] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`h-10 rounded-lg border text-xs font-medium capitalize ${
                    kind === k ? 'border-accent bg-accent-soft text-accent-dark' : 'border-border bg-card hover:bg-bg'
                  }`}>
                  {k}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={needsSignature} onChange={(e) => setNeedsSignature(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#22C55E]" />
            <div>
              <div className="text-sm font-medium">Requires client signature</div>
              <div className="text-xs text-fg-muted">Client gets a Review &amp; sign action in their portal.</div>
            </div>
          </label>

          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={shareWithClient} onChange={(e) => setShareWithClient(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#22C55E]" />
            <div>
              <div className="text-sm font-medium">Share with client</div>
              <div className="text-xs text-fg-muted">Uncheck to keep this as an internal-only document.</div>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 h-10 rounded-lg border border-border text-sm font-medium">Cancel</button>
          <button onClick={commit} disabled={!canSave} className="px-5 h-10 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold disabled:opacity-50">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
