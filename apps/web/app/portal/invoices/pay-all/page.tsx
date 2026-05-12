'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BHLogo } from '@/components/BHLogo';
import { PortalShell } from '@/components/PortalShell';
import { firm, formatDate, formatMoneyCompact } from '@/lib/mock';
import { markInvoicePaid, usePaidInvoiceIds } from '@/lib/portalState';

// Same invoice list as /portal/invoices/[id] — multiple unpaid invoices selected
// for a single combined payment.
const ALL_INVOICES = [
  { id: 'inv_hero', number: 'INV-008', matterName: 'Litigation — Contract Dispute', amount: 700, issuedAt: Date.now(), dueAt: Date.now() + 30 * 24 * 3600 * 1000 },
  { id: 'inv_7', number: 'INV-007', matterName: 'Corporate — Annual Filing', amount: 1200, issuedAt: Date.parse('2026-03-08'), dueAt: Date.parse('2026-04-07'), overdue: true },
  { id: 'inv_5', number: 'INV-005', matterName: 'IP — Patent Filing', amount: 1500, issuedAt: Date.parse('2026-03-05'), dueAt: Date.parse('2026-04-04') },
];

type Step = 'review' | 'card' | 'processing' | 'success';

export default function PayAllCheckout() {
  const router = useRouter();
  const paidIds = usePaidInvoiceIds();

  const unpaid = ALL_INVOICES.filter((i) => !paidIds.has(i.id));
  const total = unpaid.reduce((a, i) => a + i.amount, 0);

  const [step, setStep] = useState<Step>('review');
  const [method, setMethod] = useState<'saved' | 'new'>('saved');
  const [cardNumber, setCardNumber] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [zip, setZip] = useState('');
  const [cardholderName, setCardholderName] = useState('Sarah Mitchell');

  useEffect(() => {
    if (step !== 'processing') return;
    const t = setTimeout(() => {
      unpaid.forEach((i) => markInvoicePaid(i.id));
      setStep('success');
    }, 2200);
    return () => clearTimeout(t);
  }, [step, unpaid]);

  const cardValid =
    method === 'saved' ||
    (cardNumber.replace(/\s/g, '').length >= 15 && /^\d\d\/\d\d$/.test(exp) && cvv.length >= 3 && zip.length >= 5);

  function startPayment() {
    if (method === 'saved') setStep('processing');
    else setStep('card');
  }

  function confirmPayment() {
    if (!cardValid) return;
    setStep('processing');
  }

  if (unpaid.length === 0 && step !== 'success') {
    return (
      <PortalShell>
        <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto bg-accent-soft rounded-full flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-accent-dark">
              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-lg font-semibold">No outstanding invoices</div>
          <div className="text-sm text-fg-muted mt-1 mb-4">You&apos;re all paid up.</div>
          <Link href="/portal/invoices" className="text-sm font-medium text-accent hover:underline">Back to invoices →</Link>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/portal/invoices" className="text-sm text-fg-muted hover:text-fg inline-flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All invoices
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-[-0.5px]">Pay all outstanding</h1>
        <p className="text-sm text-fg-muted mt-1">{unpaid.length} invoices · paid in a single transaction.</p>
      </div>

      <div className="grid grid-cols-[1fr_400px] gap-6 items-start">
        {/* Invoice summary */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-start gap-3 mb-8">
            <BHLogo size={48} />
            <div>
              <div className="font-semibold text-fg">{firm.name}</div>
              <div className="text-xs text-fg-muted mt-0.5">{firm.location}</div>
            </div>
          </div>

          <div className="text-xs uppercase tracking-wide text-fg-muted font-semibold mb-3">Invoices being paid</div>

          <div className="bg-bg/40 border border-border rounded-xl overflow-hidden mb-6">
            <div className="grid grid-cols-[100px_1fr_120px_120px] gap-3 px-5 py-3 border-b border-border text-xs font-semibold text-fg-muted">
              <div>Invoice #</div>
              <div>Matter</div>
              <div>Due</div>
              <div className="text-right">Amount</div>
            </div>
            {unpaid.map((inv) => (
              <div key={inv.id} className="grid grid-cols-[100px_1fr_120px_120px] gap-3 items-center px-5 py-3 border-b border-border last:border-0">
                <div className="text-sm font-semibold text-accent">{inv.number}</div>
                <div className="text-sm truncate">{inv.matterName}</div>
                <div className="text-sm text-fg-muted">
                  {formatDate(inv.dueAt)}
                  {inv.overdue && <div className="text-xs font-semibold text-danger">Past due</div>}
                </div>
                <div className="text-sm font-semibold tabular-nums text-right">{formatMoneyCompact(inv.amount)}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-fg-muted">Subtotal</span>
                <span className="tabular-nums">{formatMoneyCompact(total)}</span>
              </div>
              <div className="flex justify-between font-semibold text-xl border-t border-border pt-3">
                <span>Total</span>
                <span className="text-accent tabular-nums">{formatMoneyCompact(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment side panel */}
        <aside className="sticky top-24">
          {step === 'success' ? (
            <SuccessPanel total={total} count={unpaid.length} onDone={() => router.push('/portal/invoices')} />
          ) : step === 'processing' ? (
            <ProcessingPanel total={total} count={unpaid.length} />
          ) : step === 'card' ? (
            <CardEntryPanel
              total={total}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              exp={exp}
              setExp={setExp}
              cvv={cvv}
              setCvv={setCvv}
              zip={zip}
              setZip={setZip}
              cardholderName={cardholderName}
              setCardholderName={setCardholderName}
              canSubmit={cardValid}
              onBack={() => setStep('review')}
              onConfirm={confirmPayment}
            />
          ) : (
            <ReviewPanel
              total={total}
              count={unpaid.length}
              method={method}
              setMethod={setMethod}
              onPay={startPayment}
            />
          )}
        </aside>
      </div>
    </PortalShell>
  );
}

// ---------- Panels ----------

function ReviewPanel({
  total, count, method, setMethod, onPay,
}: {
  total: number; count: number; method: 'saved' | 'new'; setMethod: (m: 'saved' | 'new') => void; onPay: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="text-xs uppercase tracking-wide text-fg-muted font-semibold mb-1">Combined total</div>
      <div className="text-3xl font-semibold tabular-nums">{formatMoneyCompact(total)}</div>
      <div className="text-xs text-fg-muted mt-1 mb-5">{count} invoices · one charge to your card</div>

      <div className="text-xs uppercase tracking-wide text-fg-muted font-semibold mb-2">Payment method</div>
      <div className="space-y-2 mb-5">
        <PaymentMethodCard
          selected={method === 'saved'}
          onSelect={() => setMethod('saved')}
          icon={<VisaMark />}
          label="Visa ending in 4242"
          sub="Expires 09/27 · Default"
        />
        <PaymentMethodCard
          selected={method === 'new'}
          onSelect={() => setMethod('new')}
          icon={<PlusMark />}
          label="Pay with a new card"
          sub="Visa, Mastercard, Amex"
        />
      </div>

      <button onClick={onPay} className="w-full h-12 rounded-[10px] bg-accent hover:bg-accent-dim text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        Pay {formatMoneyCompact(total)}
      </button>
      <div className="text-[11px] text-fg-subtle text-center mt-3">
        Secured by Stripe. Your card details never touch Bennett &amp; Hayes systems.
      </div>
    </div>
  );
}

function CardEntryPanel({
  total,
  cardNumber, setCardNumber,
  exp, setExp,
  cvv, setCvv,
  zip, setZip,
  cardholderName, setCardholderName,
  canSubmit, onBack, onConfirm,
}: {
  total: number;
  cardNumber: string; setCardNumber: (v: string) => void;
  exp: string; setExp: (v: string) => void;
  cvv: string; setCvv: (v: string) => void;
  zip: string; setZip: (v: string) => void;
  cardholderName: string; setCardholderName: (v: string) => void;
  canSubmit: boolean; onBack: () => void; onConfirm: () => void;
}) {
  function fmtCardNumber(raw: string) {
    return raw.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
  }
  function fmtExp(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-fg-muted hover:text-fg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="text-sm font-semibold">New card</div>
      </div>
      <div className="text-xs text-fg-muted mb-4">
        Paying <span className="font-semibold text-fg">{formatMoneyCompact(total)}</span>
      </div>
      <div className="space-y-3">
        <label className="block">
          <span className="text-xs font-semibold text-fg-muted">Card number</span>
          <div className="mt-1.5 relative">
            <input value={cardNumber} onChange={(e) => setCardNumber(fmtCardNumber(e.target.value))} placeholder="1234 1234 1234 1234" inputMode="numeric" className="w-full h-11 pl-3.5 pr-12 rounded-lg border border-border bg-card text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-fg-subtle">
              <VisaMark /><MastercardMark />
            </div>
          </div>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-fg-muted">Expiry</span>
            <input value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} placeholder="MM / YY" inputMode="numeric" className="mt-1.5 w-full h-11 px-3.5 rounded-lg border border-border bg-card text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-fg-muted">CVC</span>
            <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" inputMode="numeric" className="mt-1.5 w-full h-11 px-3.5 rounded-lg border border-border bg-card text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
          </label>
        </div>
        <label className="block">
          <span className="text-xs font-semibold text-fg-muted">Cardholder name</span>
          <input value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} className="mt-1.5 w-full h-11 px-3.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-fg-muted">ZIP / Postcode</span>
          <input value={zip} onChange={(e) => setZip(e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 10))} placeholder="94105" className="mt-1.5 w-full h-11 px-3.5 rounded-lg border border-border bg-card text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
        </label>
      </div>
      <button onClick={onConfirm} disabled={!canSubmit} className="w-full h-12 mt-5 rounded-[10px] bg-accent hover:bg-accent-dim text-white font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        Pay {formatMoneyCompact(total)}
      </button>
      <div className="text-[11px] text-fg-subtle text-center mt-3">
        Secured by Stripe · 256-bit encryption · PCI DSS compliant.
      </div>
    </div>
  );
}

function ProcessingPanel({ total, count }: { total: number; count: number }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-5">
        <svg viewBox="0 0 50 50" className="animate-spin text-accent">
          <circle cx="25" cy="25" r="20" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" fill="none" />
          <path d="M25 5 a20 20 0 0 1 20 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <div className="text-base font-semibold mb-1">Processing payment…</div>
      <div className="text-sm text-fg-muted">Charging {formatMoneyCompact(total)} across {count} invoices · please don&apos;t close this tab.</div>
    </div>
  );
}

function SuccessPanel({ total, count, onDone }: { total: number; count: number; onDone: () => void }) {
  return (
    <div className="bg-card border border-accent/40 rounded-2xl p-6 text-center">
      <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="text-lg font-semibold mb-1">{count} invoices paid</div>
      <div className="text-sm text-fg-muted">
        {formatMoneyCompact(total)} paid to Bennett &amp; Hayes LLP
      </div>
      <div className="text-xs text-fg-subtle mt-2">Receipts sent to your email.</div>
      <button className="w-full h-11 mt-5 rounded-[10px] border border-border bg-card hover:bg-bg text-sm font-semibold inline-flex items-center justify-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Download receipts
      </button>
      <button onClick={onDone} className="w-full h-11 mt-2 rounded-[10px] bg-accent hover:bg-accent-dim text-white text-sm font-semibold">
        Back to invoices
      </button>
    </div>
  );
}

function PaymentMethodCard({ selected, onSelect, icon, label, sub }: { selected: boolean; onSelect: () => void; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <button onClick={onSelect} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition ${selected ? 'border-accent bg-accent-soft/40' : 'border-border bg-card hover:bg-bg'}`}>
      <span className="w-10 h-7 rounded-md bg-card border border-border flex items-center justify-center shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{label}</div>
        <div className="text-xs text-fg-muted truncate">{sub}</div>
      </div>
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-accent' : 'border-border-strong'}`}>
        {selected && <span className="w-2 h-2 rounded-full bg-accent" />}
      </span>
    </button>
  );
}

function VisaMark() {
  return (
    <svg width="22" height="8" viewBox="0 0 22 8" fill="none" className="text-[#1A1F71]">
      <text x="0" y="7" fontFamily="Helvetica, Arial, sans-serif" fontSize="8" fontWeight="900" fontStyle="italic" fill="currentColor">VISA</text>
    </svg>
  );
}
function MastercardMark() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
      <circle cx="7" cy="6" r="5" fill="#EB001B" />
      <circle cx="13" cy="6" r="5" fill="#F79E1B" opacity="0.9" />
    </svg>
  );
}
function PlusMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-fg-muted">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
