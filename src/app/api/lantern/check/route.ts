import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type {
  CheckRequest,
  CheckResponse,
  CheckVerdict,
} from "@/lib/lantern";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are Lantern, a scam-detection assistant that protects older adults and their families.

You will be given a message someone received — pasted text, a screenshot, or a description of a phone call — and you must judge whether it is a scam.

You know the current scam landscape: phishing texts and emails, gift-card scripts, fake invoices and "subscription renewals", grandparent/"family emergency" calls, romance scams, fake parcel-delivery and toll notices, government/tax impersonation, tech-support popups, crypto "investment" pitches, mass-mailed "I hacked your webcam" bluff extortion, and AI voice-clone variants of all of the above.

Rules for your verdict:
- Be calm and firm, never alarmist. The reader may be frightened or embarrassed.
- Write for a smart 75-year-old: plain words, no jargon, short sentences.
- Never blame the recipient. Scams are industrialised; anyone can be targeted.
- If it is a scam, say so plainly and name the pattern.
- "whatToDo" steps must be concrete and ordered: e.g. "Do not reply", "Do not click the link", "Delete the message", "If you already paid, call your bank now on the number printed on your card".
- If the message involves threats with intimate images (sextortion), the first steps are: do not pay, do not reply, keep the evidence, and point to StopNCII.org (adults) or NCMEC Take It Down (under 18) and local police.
- If genuinely ambiguous, use verdict "unclear" and say what extra detail would settle it (e.g. "check the sender's full email address").
- Mark "urgent" true only when money or passwords are at imminent risk, or the person may have already paid.`;

const VERDICT_SCHEMA = {
  type: "object",
  properties: {
    verdict: {
      type: "string",
      enum: ["scam", "suspicious", "likely_safe", "unclear"],
      description: "Overall judgement of the message.",
    },
    confidence: {
      type: "number",
      description: "Confidence in the verdict from 0 to 1.",
    },
    scamType: {
      type: ["string", "null"],
      description:
        'Named scam pattern if recognised, e.g. "gift card scam", "fake parcel delivery", else null.',
    },
    headline: {
      type: "string",
      description:
        "One calm plain-language sentence, written for an older adult.",
    },
    explanation: {
      type: "string",
      description: "Short explanation of the telltale signs, plain language.",
    },
    whatToDo: {
      type: "array",
      items: { type: "string" },
      description: "Concrete next steps, in order.",
    },
    familyNote: {
      type: "string",
      description:
        'One sentence for the family activity feed, e.g. "Scam blocked: fake Medicare renewal text targeting Mum."',
    },
    urgent: {
      type: "boolean",
      description:
        "True when money or credentials are at imminent risk.",
    },
  },
  required: [
    "verdict",
    "confidence",
    "scamType",
    "headline",
    "explanation",
    "whatToDo",
    "familyNote",
    "urgent",
  ],
  additionalProperties: false,
} as const;

/** Returned when ANTHROPIC_API_KEY is not configured, so the app demos end-to-end. */
const DEMO_VERDICT: CheckVerdict = {
  verdict: "scam",
  confidence: 0.97,
  scamType: "gift card scam (demo response)",
  headline:
    "This is a known scam — no real company or government agency asks to be paid in gift cards.",
  explanation:
    "The message creates urgency, asks for secrecy, and demands payment in gift cards. Those three things together are the signature of a scam. (Demo mode: set ANTHROPIC_API_KEY to enable real analysis.)",
  whatToDo: [
    "Do not reply to the message.",
    "Do not buy any gift cards.",
    "Delete the message.",
    "If you already shared card numbers, call your bank now using the number printed on your card.",
  ],
  familyNote: "Scam blocked: gift-card payment demand (demo mode).",
  urgent: false,
};

export async function POST(request: Request) {
  let body: CheckRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<CheckResponse>(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const hasImage =
    typeof body.imageBase64 === "string" && body.imageBase64.length > 0;

  if (!text && !hasImage) {
    return NextResponse.json<CheckResponse>(
      { ok: false, error: "Provide message text or a screenshot" },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json<CheckResponse>({
      ok: true,
      demo: true,
      verdict: DEMO_VERDICT,
    });
  }

  const content: Anthropic.ContentBlockParam[] = [];
  if (hasImage) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: body.imageMediaType ?? "image/png",
        data: body.imageBase64!,
      },
    });
  }
  const intro = [
    body.channel ? `Channel: ${body.channel}` : null,
    body.context ? `Context from the family: ${body.context}` : null,
    text ? `Message received:\n${text}` : "The message is in the screenshot.",
  ]
    .filter(Boolean)
    .join("\n\n");
  content.push({ type: "text", text: intro });

  const client = new Anthropic();
  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      output_config: {
        format: {
          type: "json_schema",
          schema: VERDICT_SCHEMA,
        },
      },
      messages: [{ role: "user", content }],
    });

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text",
    );
    if (!textBlock) {
      return NextResponse.json<CheckResponse>(
        { ok: false, error: "No verdict returned" },
        { status: 502 },
      );
    }
    const verdict = JSON.parse(textBlock.text) as CheckVerdict;
    return NextResponse.json<CheckResponse>({ ok: true, verdict });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error("[lantern/check] API error", err.status, err.message);
      return NextResponse.json<CheckResponse>(
        { ok: false, error: "Could not analyse right now — try again shortly" },
        { status: 502 },
      );
    }
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[lantern/check] failed:", msg);
    return NextResponse.json<CheckResponse>(
      { ok: false, error: "Could not analyse right now" },
      { status: 500 },
    );
  }
}
