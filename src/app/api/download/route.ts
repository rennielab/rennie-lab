import { NextResponse } from "next/server";
import { isValidEmail, relaySubmission } from "@/lib/forms";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email is required" },
      { status: 400 },
    );
  }

  try {
    const result = await relaySubmission(`download:${body.kind ?? "deck"}`, body);
    return NextResponse.json({ ok: true, delivery: result.delivery });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[download] relay failed:", msg);
    return NextResponse.json({ ok: false, error: "Could not send right now" }, { status: 502 });
  }
}
