// Shared form-submission helpers for /api/contact and /api/download.
// Order of priority on submit:
//   1. Resend API   (env: RESEND_API_KEY, RL_FORM_TO, RL_FORM_FROM)
//   2. Webhook URL  (env: RL_FORM_WEBHOOK — accepts JSON POST; e.g. Slack, Tally, Zapier)
//   3. Console log  (dev fallback so the form always feels alive locally)

type SubmissionPayload = Record<string, unknown>;

export async function relaySubmission(kind: string, payload: SubmissionPayload) {
  const subject = `[Rennie Lab · ${kind}] new submission`;
  const body = formatForEmail(kind, payload);

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.RL_FORM_TO;
  const from = process.env.RL_FORM_FROM ?? "forms@rennielab.com";

  if (resendKey && to) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Rennie Lab <${from}>`,
        to: [to],
        subject,
        text: body,
        reply_to:
          typeof payload.email === "string" && payload.email.includes("@")
            ? payload.email
            : undefined,
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "(no body)");
      throw new Error(`Resend ${res.status}: ${errText}`);
    }
    return { delivery: "resend" as const };
  }

  const webhook = process.env.RL_FORM_WEBHOOK;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, subject, body, payload }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "(no body)");
      throw new Error(`Webhook ${res.status}: ${errText}`);
    }
    return { delivery: "webhook" as const };
  }

  // Dev / unconfigured fallback — log it and return success so the form UX works.
  console.info(`[rennie-lab][${kind}] submission (no relay configured):\n${body}`);
  return { delivery: "log" as const };
}

function formatForEmail(kind: string, payload: SubmissionPayload): string {
  const lines: string[] = [`New ${kind} submission`, "─".repeat(40)];
  for (const [k, v] of Object.entries(payload)) {
    const value = Array.isArray(v) ? v.join(", ") : String(v ?? "");
    lines.push(`${k}: ${value}`);
  }
  return lines.join("\n");
}

export function isValidEmail(s: unknown): s is string {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
