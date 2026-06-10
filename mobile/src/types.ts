/** Mirrors src/lib/lantern.ts in the web/API repo — keep in sync. */

export type LanternVerdict = "scam" | "suspicious" | "likely_safe" | "unclear";

export type LanternChannel = "sms" | "email" | "social" | "call" | "other";

export interface CheckVerdict {
  verdict: LanternVerdict;
  confidence: number;
  scamType: string | null;
  headline: string;
  explanation: string;
  whatToDo: string[];
  familyNote: string;
  urgent: boolean;
}

export interface CheckResponse {
  ok: boolean;
  demo?: boolean;
  verdict?: CheckVerdict;
  error?: string;
}

export interface FeedItem {
  id: string;
  member: string;
  note: string;
  verdict: LanternVerdict;
  when: string;
}
