/* ──────────────────────────────────────────────────────────────
   Lantern — shared types + brand tokens
   Working name "Lantern" (pending trademark/domain search).
   Brand: Indigo 16243D · Amber F2A33C · Cream FAF6EF
   ────────────────────────────────────────────────────────────── */

export const LANTERN = {
  name: "Lantern",
  tagline: "Keep the people you love out of the dark.",
  colors: {
    indigo: "#16243D",
    indigoSoft: "#22335A",
    amber: "#F2A33C",
    amberDeep: "#D97E0F",
    cream: "#FAF6EF",
    creamLine: "rgba(22, 36, 61, 0.12)",
    safe: "#2E7D5B",
    caution: "#B45309",
    scam: "#B03A2E",
  },
} as const;

export type LanternVerdict =
  | "scam"
  | "suspicious"
  | "likely_safe"
  | "unclear";

export type LanternChannel = "sms" | "email" | "social" | "call" | "other";

export interface CheckRequest {
  /** Pasted/forwarded message text (or a call described in words). */
  text?: string;
  /** Base64 screenshot of the message, no data: prefix. */
  imageBase64?: string;
  /** Media type for imageBase64, e.g. "image/png". */
  imageMediaType?: "image/png" | "image/jpeg" | "image/webp" | "image/gif";
  /** Where the message arrived. */
  channel?: LanternChannel;
  /** Optional context, e.g. "my mum is 78 and got this today". */
  context?: string;
}

export interface CheckVerdict {
  verdict: LanternVerdict;
  /** 0–1 model confidence in the verdict. */
  confidence: number;
  /** Named scam pattern if recognised, e.g. "gift card scam", else null. */
  scamType: string | null;
  /** One calm plain-language sentence, written for an older adult. */
  headline: string;
  /** Short explanation of the telltale signs, plain language. */
  explanation: string;
  /** Concrete next steps, in order. */
  whatToDo: string[];
  /** One-sentence summary suitable for the family activity feed. */
  familyNote: string;
  /** True when money or credentials are at imminent risk. */
  urgent: boolean;
}

export interface CheckResponse {
  ok: boolean;
  demo?: boolean;
  verdict?: CheckVerdict;
  error?: string;
}
