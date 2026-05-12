'use client';

import { useState } from 'react';

import { signDocument } from '@/lib/docsState';
import { currentClient } from '@/lib/mock';
import type { Document } from '@/lib/portalData';

export function SignDocumentModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const [signed, setSigned] = useState(false);
  const [agree, setAgree] = useState(false);

  function sign() {
    signDocument(doc.id);
    setSigned(true);
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-6 py-8 overflow-y-auto">
      <div onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="text-base font-semibold">{doc.name}</div>
            <div className="text-xs text-fg-muted mt-0.5">{doc.matterName} · uploaded by {doc.uploadedBy}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-bg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="bg-bg border border-border rounded-xl p-8 min-h-[260px] relative">
            <div className="absolute top-3 right-3 text-[10px] font-bold text-fg-subtle uppercase tracking-wider">Preview</div>
            <div className="text-center mb-6">
              <div className="text-lg font-bold text-fg">{doc.name.replace(/\.pdf$/i, '')}</div>
              <div className="text-xs text-fg-muted mt-1">Bennett &amp; Hayes LLP · {doc.matterName}</div>
            </div>
            <div className="space-y-2.5 text-sm text-fg leading-relaxed">
              <p className="text-fg-muted">This Agreement is entered into between Bennett &amp; Hayes LLP ("Firm") and Reyes Family Trust ("Client") for legal services on the matter referenced above.</p>
              <p className="text-fg-muted">1. <span className="text-fg">Scope.</span> Firm will provide the legal services described in the engagement summary attached hereto as Schedule A.</p>
              <p className="text-fg-muted">2. <span className="text-fg">Fees.</span> Hourly billing at the rate stated on the cover page. Invoices issued monthly. Net 30.</p>
              <p className="text-fg-muted">3. <span className="text-fg">Confidentiality.</span> Both parties will treat as confidential all non-public information shared in the course of this engagement.</p>
              <p className="text-fg-subtle italic text-xs mt-4">[Demo preview — actual signed document would appear here in production.]</p>
            </div>
          </div>

          {/* Signature block */}
          {signed ? (
            <div className="mt-5 bg-accent-soft border border-accent/40 rounded-xl p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-accent text-white inline-flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-fg">Signed by {currentClient.name}</div>
              <div className="text-xs text-fg-muted mt-1">{new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} · countersigned copy will arrive by email</div>
            </div>
          ) : (
            <div className="mt-5 bg-bg/60 border border-border rounded-xl p-5">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[#22C55E]"
                />
                <div className="text-sm text-fg leading-relaxed">
                  I, <span className="font-semibold">{currentClient.name}</span>, have read and agree to be bound by the terms of this document. By clicking "Sign", I am applying my electronic signature.
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <button className="text-sm font-medium text-fg-muted hover:text-fg inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download original
          </button>
          {signed ? (
            <button onClick={onClose} className="h-10 px-5 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold">
              Done
            </button>
          ) : (
            <button
              onClick={sign}
              disabled={!agree}
              className="h-10 px-5 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-semibold disabled:opacity-50 inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign document
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
