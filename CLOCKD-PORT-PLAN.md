# Clockd — Production Pickup & Port Plan

*Prepared 2026-06-12, from a full audit of `clockd-labs/clockd` (frozen at `orkan-handover`, 2026-05-22) vs the demo prototype (this repo). Updated same day after a live side-by-side review of production (localhost) vs prototype (Vercel staging).*

## TL;DR

The production codebase is in **far better shape than expected**. M1 + M2 are complete and heavily audited (42/46 P0 fixes done, 37/43 P1, all Round-4/5 ship-blockers closed). The web admin is feature-complete for firm operations. What's missing is exactly what the prototype is strong at: **the two mobile apps are empty shells**, and the differentiator wiring (Twilio webhooks → auto time entries) plus Stripe are unbuilt. The port is therefore not a rewrite — it's **finishing M3 with the prototype as the design spec**.

## The three users — where each codebase stands

Clockd has three personas, and production's depth is inversely proportional to distance from the admin:

| Persona | Prototype (demo) | Production (Orkan) | Gap |
|---|---|---|---|
| **1. Admin** — firm owner who registered Clockd, pays the subscription (Marcus) | Full demo surface: triage dashboard, approvals, Do Not Bill, invoicing, documents, chat | **Strongest**: real auth/MFA, full CRUD, permissions, batch confirm, aging buckets | Small — port UX moments only |
| **2. Firm User / Staff** — the lawyer being tracked (Sophia) | Dedicated `/firm` web persona + the **entire phone-first mobile app** | `MemberDashboardPage` web view only; **mobile-lawyer is an empty shell** | **Biggest.** Sophia lives on her phone → Phase 1 |
| **3. End Client** — the person in the matter, tracked and billed (Sarah) | Full portal: card-payment flow, documents + signing, Message Center | Thin portal: login, view matters, call history. **No payments/documents/chat** | Second-biggest — and it's the revenue loop → Phases 3–4 |

Every phase below should state which persona it serves; a phase that doesn't move one of the three doesn't ship.

## Side-by-side findings (live review, 2026-06-12)

**Port from prototype → production (admin surface):** dashboard triage queue ("Your queue"), per-user stacked hours chart with member faces, This Month/This Year toggle, time-entry column sorting, Do Not Bill flow + status tabs, matter stage taxonomy (Intake/Active/On Hold/Closed) + stalled detection, invoice header status pills, "(this month)" timeframe labels, login-page photography, copy pass (production ships *"Insert page description here."* on Time Entries/Matters/Invoices).

**Keep from production (already better than prototype):** real data grids with pagination, batch Confirm All, invoice aging buckets (30/60-day), header member+date filters, client archive + portal invites, team member detail + permissions pages, real settings (MFA/sessions/business details), the entire auth + API + WebSocket substrate.

## What production already has (don't rebuild)

| Area | State |
|---|---|
| Go API (Chi + Postgres + sqlc) | Mature. Auth w/ JWT+OAuth+MFA, matters, time entries (+bulk confirm, CSV export), clients (+portal invites, archive), invoices (line items, payments, recipients, void), team (+permissions, last-admin guard), settings, dashboards, WebSocket realtime |
| Web SPA (TanStack + React 19) | Feature-complete firm admin: 15 dashboard widgets, full invoice CRUD, notification prefs UI, sessions/MFA settings, client portal pages |
| Quality | PM.md = 3,200-line per-module business-rule audit with file:line citations. TASKS.md tracks 5 audit rounds |
| Dev env | Dockerised (Postgres ×2, Redis, Cloud Tasks emulator, goose migrations), one-command `bun run dev:stack` |

## Gaps (the actual work)

1. **Mobile apps are empty** — `apps/mobile-lawyer` + `apps/mobile-client` are 4-file Expo shells with deps wired (`@clockd/api-client`, `voip`, CallKeep). **This is the port target for the prototype's phone-first UX.**
2. **No Twilio/call webhooks** — `packages/voip` has Twilio + Agora provider stubs; no `/calls/webhook` handler, no call→time-entry pipeline. The hero flow doesn't exist server-side yet.
3. **No Stripe** — schema has `stripe_customer_id`; zero handlers/SDK. Web billing section says "coming soon". (Dana locked Stripe as gateway.)
4. **No internal Clockd-company dashboard** — admin dashboards are firm-scoped only. Dana asked for cross-firm signups/revenue/retention console.
5. **Open P0s (small)** — archived-client guards, rate-history slug mapping; 6 P1s incl. overdue-cron, PDF render+email, UTC→firm-tz.
6. **Terminology** — ~32 "Staff", ~8 "Add Time Entry" to rename (matters/clients naming already correct; no Campfire equivalent exists yet — chat itself is a gap).

## Proposed sequence

**Phase 0 — Boot & baseline (first session, ~half day)**
Free ≥3GB disk → `dev:setup` → `dev:infra` → seed `test_firm` → verify API+web run. Apply Dana terminology sweep (Staff→User, Add Time Entry→Manual Time Entry + activity categories). Close the 2 open P0s. Tag `pickup-baseline`.

**Phase 1 — Mobile-lawyer port (the headline, ~1-2 weeks of sessions)**
Port prototype screens onto `apps/mobile-lawyer` against the real API: Calls (keypad/contacts/recents + pill slider) → Ops daily brief → Time (entries via real `/time-entries`) → Chat (needs new API surface — see Phase 3) → hold-to-start FAB timer → profile. Real auth (JWT + secure store). Ship to TestFlight via the now-working Get Clockd pipeline (separate bundle id, e.g. `com.getclockd.lawyer`).

**Phase 2 — The differentiator (calls → entries)**
Twilio Voice wiring: number provisioning, `/calls/webhook` handler, call-ended → draft time entry w/ duration + matter inference, WebSocket push to web admin. Voice Intelligence transcription + AI summary slot in behind the existing "AI-summarized notes" UI.

**Phase 3 — Message Center + portal parity**
Chat/message domain in Go API (firm↔client threads, mentions, read state) + web slide-out + mobile Chat tab + client portal view — port the prototype UX wholesale.

**Phase 4 — Money**
Stripe: firm subscriptions ("Clockd Firm" $49/seat) + client invoice payment (the prototype's Review→Card→Processing→Success flow against Stripe Elements). Invoicing on/off toggle + Xero export stub. Internal Clockd-company dashboard fed by Stripe API.

**Phase 5 — M3 close-out**
Open P1s (overdue cron, PDF+email, tz defaults), store submissions (lawyer app public TestFlight → App Store), monitoring.

## Port mechanics

- Prototype stays the **design spec + demo surface**; production is the build target. No code is force-merged — screens are re-implemented on the production stack (its own UI kit, API client, auth), using prototype files as reference.
- Keep Dana in the loop on the same cadence: each phase ends with a TestFlight build + web deploy she can touch.
- Bundle/branding cleanup at Phase 1: app name "Get Clockd", consider `com.getclockd.*` bundle ids before anything public.

## Risks / unknowns

- **Disk**: dev stack needs ~1.5–3GB; Ben's Mac is at ~96%. Clear before Phase 0.
- **Twilio account** state unknown (Ben owes Dana a services-billing audit anyway — same login will answer both).
- **Notification service** uses GCP Cloud Tasks emulator in dev; prod GCP setup undocumented — investigate during Phase 0.
- **Agora vs Twilio**: voip package abstracts both; decision memo needed before Phase 2 (Twilio is the locked assumption).
