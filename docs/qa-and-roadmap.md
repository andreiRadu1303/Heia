# QA log, refinements & roadmap

Living document. Captures what was tested, bugs found (with status), UX
refinements, and proposed new features. Last full sweep: production
(`heia-jet.vercel.app`), end-to-end, logged-in as a real specialist account.

---

## 1. What was tested (all passing ✅)

- **Signup** — choice screen (Client / Specialist) → tailored form → account created → routed correctly by role.
- **Onboarding wizard** — Service → Location → Profile → publish; `onboarded_at` set; not shown again.
- **Provider dashboard** — real stats, publish banner, Manage cards.
- **Services** — add / edit / save; persists; count updates.
- **Public studio page** — renders real data (name, category, address, tags, bio, service, price).
- **Booking loop** — pick slot → checkout → booking created (pending) → provider Accept → Mark completed.
- **Reviews** — gate opens only after a completed booking → submit → appears with **overall = exact average of the 3 sub-scores**, verified badge, recommend %, tag counts, comment.
- **Payments page** — degrades gracefully when Stripe is unconfigured (banner, disabled buttons, fee % shown, no crash).
- **Mini-site builder** — template switch + theme + Save (persists to DB).
- **Discover map** — self-contained mockup, pins placed by lat/lng, no Google dependency.
- **Profile** — Photos section (cover/avatar/portfolio uploaders), View-as-client, edit form.

---

## 2. Bugs

### Resolved

| # | Sev | Bug | Fix |
|---|-----|-----|-----|
| B1 | Critical | Provider area hard-broke ("no studio found") — deployed code selects columns from migrations 008/009 that weren't applied yet; the query errored and fell back to "no studio". | Ran migrations 008 + 009. **Process fix needed:** run migrations before deploying dependent code. |
| B2 | Minor | Random / broken placeholder photos (studio hero, account booking thumbnail) via picsum. | Branded **gradient** fallback when no image uploaded. |
| B3 | Minor | Misleading "Step 2 of 3" on the standalone studio page (it's a public page, not a wizard step). | Removed; booking flow renumbered **1 → 2**. |
| B4 | Minor | Mini-site builder previewed the demo "Andra Studio" instead of the logged-in expert's studio. | Builder now previews the expert's **own** studio content. |
| B7 | Low | Mini-site `StudioSite` hero used a random picsum image for real studios without a cover. | Gradient fallback applied inside `components/studio-site/studio-site.tsx`. |
| B9 | Nit | Footer "Termeni" / "Confidențialitate" linked to `/ro` placeholders. | Added real `/terms` + `/privacy` pages (starter copy; needs legal review) and wired the footer. |

### Open

| # | Sev | Bug | Suggested fix |
|---|-----|-----|---------------|
| B5 | Medium | **Localization gap** — landing + app-loop copy is hardcoded English; only header/auth/nav are translated. On `/ro` the marketing hero shows English. Significant for a Romania-first launch. (Absorbs B8: the booking day picker's mixed EN/RO resolves once the loop is localized.) | Move all user-facing strings into `messages/ro.json` + `en.json`; translate the landing and the (app) loop. |
| B6 | Low | **Brittle column coupling** — `getMyStudio()` (and other reads) select every column, so a single missing migration breaks the whole provider area (root of B1). Mitigated now that 008/009 are applied. | Select only needed columns per surface, or add a startup migration check / health probe. |

---

## 3. Refinements (non-bug UX / polish)

- **Full Romanian localization** of the app (ties to B5). Highest-impact polish for launch.
- **Real availability** — replace hardcoded booking slots with the provider's actual hours (`provider_hours` table) minus existing bookings; prevents double-booking. The `/provider/availability` page is still a browser-only demo.
- ~~**Wire discovery to real data**~~ — DONE. `/discover`, landing "featured", and `/services` counts now read real published studios (`lib/discover-server.ts`). **Follow-up:** geocode addresses → lat/lng on save (studios without coordinates currently get a deterministic city-centre offset, which is fine for the mockup map but not for real "near me" distance).
- **Money precision** — prices are stored as whole lei (`price_lei`). Move to **minor units (bani)** + explicit currency before scaling payments (Stripe already uses minor units).
- **Booking timezone** — `scheduled_at` is stored naive (local date+time). Move to explicit UTC + display TZ.
- **Auth completeness** — forgot-password flow, account deletion (GDPR), password strength / breached-password check.
- **Image optimization** — use `next/image` with the Supabase Storage domain in `remotePatterns` (currently plain `<img>`; there are lint warnings).
- **Loading / success feedback** — add toasts and skeleton states across the provider area and booking flow.
- **Empty & error states** — a few surfaces still show terse fallbacks (e.g. the old "no studio" copy); make them friendlier and actionable.

---

## 4. New feature proposals (prioritized)

### P0 — core differentiators / launch-critical

- **Beauty Match (aesthetic matching)** — the product's headline differentiator from the market research, not yet built. Tag experts with aesthetic styles ("clean girl", "old money", "soft glam"…), let clients pick their vibe at onboarding, and recommend matches. Start with manual tags + a simple filter; grow into scored recommendations.
- **Client notifications** — booking confirmations, reminders, status changes. Decide the channel (the interview guide flags SMS-vs-alternatives). Suggest starting with **email (Resend)** + in-app, add WhatsApp/SMS later.
- **Terms of Service + Privacy Policy + cookie consent** — legal/GDPR prerequisites for a public launch.

### P1 — strong value, near-term

- **In-app messaging** (client ↔ expert) — designed in the architecture, still a stub.
- **Deposits / no-show protection** — take a Stripe deposit at booking; the interview guide shows no-shows are a real cost. The commission plumbing already supports it.
- **Search + filters wired to real data** — the discovery filters exist in UI but run on mock data.
- **Provider analytics** — profile views, booking conversion, review trends; the "exposure/status" pitch to experts leans on this.
- **Portfolio richness** — before/after pairs, short video, per-service galleries (schema already has `gallery_urls`).

### P2 — later / scale

- **Google Calendar sync** for availability.
- **Featured-artist placement / promotion** (ties to subscriptions already built).
- **Reviews v2** — expert replies, report/abuse flow, helpful votes.
- **Packages & multi-service booking**, recurring appointments.
- **Dual-role accounts** — one login that can be both client and expert (deferred earlier; the current model is one role per account).
- **Multi-city / travel discovery** — the "find good people in a new city" segment from the research.
- **Mobile app** (Expo/React Native) once web has traction.

---

## 5. Known gaps / tech debt (not bugs)

- `/discover` and landing "featured" read `app-mock-data`, not real published studios.
- `/provider/availability` is a browser-only demo (no persistence).
- Photo upload couldn't be auto-tested (native file dialog); UI verified, upload path untested end-to-end — **verify manually**.
- Seeded demo studios have no owner, so their bookings can't be completed via the UI (fine for demo; real flow uses owned studios).
- `getMyStudio` column coupling (B6).
- Plain `<img>` throughout → `next/image` migration pending.

---

## 6. Suggested next sprint

1. Fix open bugs **B5 (localization)**, **B7**, **B8**, **B9**.
2. **Real availability** (provider hours → bookable slots, no double-booking).
3. **Wire discovery to real studios** + geocoding.
4. **Beauty Match v1** (manual aesthetic tags + client filter).
5. **Email notifications** (Resend) for booking lifecycle.
6. Legal pages (Terms/Privacy/cookies) ahead of any public marketing.
