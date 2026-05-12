# Clockd — Demo cheat sheet

## 🔗 Live URLs

### Web (production on Vercel)
- **Landing**: https://web-fawn-six-40.vercel.app
- **Admin login**: https://web-fawn-six-40.vercel.app/admin/login
- **Client portal**: https://web-fawn-six-40.vercel.app/portal/login

(any email + password works, mock data only)

### Mobile (Expo Go, EAS preview)
- **Deep link**: `exp://u.expo.dev/9611b8de-aebf-4411-b78a-b26cff67656f?channel-name=preview`
- **QR code**: `apps/mobile/EXPO-QR.png`
- **EAS dashboard**: https://expo.dev/accounts/rennielab/projects/clockd

### Install instructions for the client
1. Install **Expo Go** from the App Store or Play Store
2. Open Expo Go → **Scan QR code** → scan `apps/mobile/EXPO-QR.png`
3. Clockd loads in 5–10 seconds

## 🎬 The 90-second demo script

> "Sarah's a partner at Bennett & Hayes. She's about to call her client about a deposition."

**On mobile (Expo Go):**
1. Open Clockd → splash auto-advances → Login → tap **Login** (any creds)
2. Land on Home → tap **Directory** tab → tap **Sarah Mitchell** (Reyes v. Horizon)
3. Call screen — let the timer run for 5–10 seconds, then tap the **red End** button
4. Watch Processing Call → "Identifying matter" → "Drafting time entry"
5. Review screen — point out the **AI-summarized description**, the matter pre-selected, billing at $700/hr
6. Tap **Submit Entry** → Success animation → "Pending approval"

**Switch to web (browser):**
7. `/admin/login` → click **Sign in** → land on Dashboard
8. Click **Time Entries** in sidebar → calendar loads → **wait 2 seconds** → the new entry pulses in with a "NEW" badge and toast notification
9. Click the new entry → Entry Detail with AI summary + call recording + $94.45 billing → tap **Approve & Confirm**
10. After approve, the button becomes **Generate Invoice →** — click it
11. New Invoice page — entries are pre-selected → click **Issue Invoice**
12. Invoice page renders with full letterhead, line items, $2,961.67 total

**Switch to client portal:**
13. `/portal/login` → sign in → land on Invoices
14. The new invoice has a **NEW** badge → click it → click **Pay Now**
15. "Processing payment…" → "Payment received ✓"

> "That whole loop — call to paid invoice — used to take this firm hours of admin time. Clockd does it in 90 seconds, with one human approval click."

## ⚠️ Caveats for the demo

- **No real call** — "Processing Call" is a 4-second simulation. The AI summary is hardcoded.
- **Mock data only** — submitting on mobile doesn't actually push to the server. The admin web page is timed to "discover" the entry 2.4 seconds after page load. **Don't refresh** the entries page or the entry disappears.
- **The Pay button is fake** — no real Stripe.

These are all swapped for real services in M3 (Twilio Voice + Twilio Voice Intelligence) and M5 (Stripe).

## 🚨 Backup plan if Wi-Fi flakes

Run before the demo:
```bash
cd apps/mobile && npx expo start --tunnel
```
This gives a fallback QR via ngrok if EAS Update CDN is slow.

A pre-recorded video of the full hero loop should also be on hand — see `apps/mobile/DEMO-BACKUP.mp4` (TODO: record this).

## 🔄 Republishing if you change something

```bash
# Web
cd apps/web && npx vercel --prod --yes --scope ben-9361s-projects

# Mobile
cd apps/mobile && npx eas-cli update --branch preview --message "Tweak X"
```
EAS Update is instant — your client's Expo Go app picks up the new bundle next time they open it.
