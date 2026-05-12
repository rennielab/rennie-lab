# Clockd — Client review pack

A working prototype of Clockd across **three personas at one firm
(Bennett & Hayes LLP)** plus a native mobile app for the firm user.
Everything below is live and reviewable. Any email + password works on
every sign-in screen.

## 🔗 Live URLs

### Web (production)
**Landing — three-tier persona picker**
https://web-fawn-six-40.vercel.app

| Persona | What they do | Direct URL |
| --- | --- | --- |
| **Admin** (Marcus Hayes) | Approve time, issue invoices, see firm cashflow | https://web-fawn-six-40.vercel.app/admin |
| **Firm User** (Sophia Williams) | Log time, manage matters, message client | https://web-fawn-six-40.vercel.app/firm |
| **Client** (Sarah Mitchell) | View matters, pay invoices, sign documents, chat | https://web-fawn-six-40.vercel.app/portal |

### Mobile (Sophia — the firm user, native app)
- **Deep link** (tap on your phone): `exp://u.expo.dev/9611b8de-aebf-4411-b78a-b26cff67656f?channel-name=preview`
- **QR code:** `apps/mobile/EXPO-QR.png` (also pasted into the email below)

## 📱 How to open the mobile app

1. Install **Expo Go** from the App Store (iOS) or Play Store (Android)
2. Open Expo Go → tap **Scan QR code**
3. Scan the QR from this doc / email
4. Clockd loads in 5–10s and lands on Sophia's Daily Brief

> iOS Camera app can't open `exp://` links — open inside Expo Go.

## 🎬 The 5-minute demo

This walks one complete cycle: lawyer logs time → admin approves → client pays.

### 1. Lawyer on mobile (Sophia)
1. Open Clockd on Expo Go → lands on **Daily Brief**
2. Point out: Bennett & Hayes firm bar, animated $ counter, real 7-day sparkline, the *Next* card with "Tap to dial" to David Chen
3. **Press and hold the green + button (3s)** → matter picker → pick *Reyes v. Horizon* → timer starts
4. Hit **Pause**, **Resume**, then **Stop** → review state → describe the work → **Save entry**
5. Show the **Campfire chat** (chat icon in firm bar) — @mention typeahead, client-tone amber bubbles, full Basecamp feel
6. Show the **Calls tab** — recents / contacts / dial pad

### 2. Admin on web (Marcus)
7. Go to `/admin` → notice the time entry that just submitted is in the **Entries** queue
8. Approve it → invoice gets a +$ ready to issue
9. Issue invoice → it appears on the client portal

### 3. Client on web (Sarah)
10. Go to `/portal` → outstanding invoice with **Pay** button
11. Tap **Pay** → routes into invoice detail → **Review → Card → Processing → Success** with full card form
12. Or use **Pay all outstanding** → batch checkout against combined total

### 4. Bonus moments
- **Firm User (`/firm`)** is Sophia's web view — matters, entries, the same Campfire chat the mobile uses
- **Documents** on admin + firm: upload, mark as needing signature → client reviews & signs
- **Stage simplification:** Intake / Active / On Hold / Closed everywhere

## ⚠️ Faked-for-demo (real in M3+)

| What's faked | Real plan |
| --- | --- |
| AI call summary is hardcoded | Twilio Voice Intelligence transcription |
| Mobile "submit" doesn't push to backend | Convex backend wiring |
| Pay flow is a 1.5–4s animation | Stripe Checkout |
| In-app call screen simulates the dial | Twilio Voice + CallKit |
| Chat is in-memory per session | Convex + push notifications |

## 🔄 Republishing

```bash
# Web (production)
cd apps/web && npx vercel --prod --yes --scope ben-9361s-projects

# Mobile (Expo Go via EAS Update — propagates on next app open)
cd apps/mobile && npx eas-cli update --branch preview --message "what changed"
```

## 🚨 Backup if EAS Update is slow

Run a tunneled dev server alongside:
```bash
cd apps/mobile && npx expo start --tunnel
```
Gives a fallback QR via ngrok the client can scan in Expo Go.
