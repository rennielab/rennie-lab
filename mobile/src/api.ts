import type { CheckResponse, LanternChannel } from "./types";

/**
 * Point this at your deployed Next.js app (the rennie-lab repo serves
 * /api/lantern/check). For local dev with a device on the same network,
 * use your machine's LAN IP, e.g. http://192.168.1.20:3000
 */
const API_BASE =
  process.env.EXPO_PUBLIC_LANTERN_API ?? "http://localhost:3000";

export async function checkMessage(input: {
  text: string;
  channel: LanternChannel;
  context?: string;
}): Promise<CheckResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/lantern/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return (await res.json()) as CheckResponse;
  } catch {
    return {
      ok: false,
      error:
        "Could not reach Lantern. Check your connection and try again — and remember: never pay or reply while you wait.",
    };
  }
}
