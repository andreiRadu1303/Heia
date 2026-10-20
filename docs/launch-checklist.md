# Heia — what's left

Last updated: 2026-10-20

Ordered by what blocks what. Section A are hard blockers on taking real money;
B blocks real clients; C and D can happen after launch.

---

## A. Blockers before switching to live Stripe keys

- [ ] **Booking notifications.** Nobody is told anything right now — a client books, the
      expert never finds out unless they open the dashboard. This is the single biggest
      launch blocker. Needs `RESEND_API_KEY` (free tier at resend.com), then emails for
      booking requested / confirmed / declined / completed.
- [ ] **Legal review of Terms & Privacy.** `/terms` and `/privacy` exist but the copy is a
      draft, not reviewed by a lawyer. Taking payments from Romanian consumers brings
      GDPR and consumer-protection obligations.
- [ ] **Exercise the refund path once in test mode.** Cancel + refund is written and
      typechecks, but has never actually run. With destination charges the platform
      carries dispute liability, so this must be proven before real money.
- [ ] **Confirm the webhook writes the `payments` row.** The success-page reconciliation
      makes payments safe either way, but the webhook should still work on its own —
      `account.updated` never fired earlier, which suggests delivery is misconfigured.
- [ ] **When flipping to live:** swap `STRIPE_SECRET_KEY` *and* `STRIPE_WEBHOOK_SECRET`
      (live `whsec_…`), then reconnect Connect payouts — the stored test account id
      self-heals but needs one click.

## B. Before real clients arrive

- [ ] **Romanian localization of the app loop** (bug B5). The landing page is Romanian;
      services, discover, studio, book, checkout, account and the whole provider area are
      still hardcoded English. For a Romania-first product this is the most visible gap.
- [ ] **Multi-currency: RON, EUR, USD.** Currently single-currency via `STRIPE_CURRENCY`,
      and prices are stored as whole lei rather than minor units.
- [ ] **Verify location end-to-end.** Geocode-on-save, manual pin placement, the
      "use my address instead" reset and the stale-pin warning are all built but none has
      been run against a real address yet.
- [ ] **Decide what un-located studios look like.** They're correctly kept off the map, but
      there's no "location not set" affordance in the list.

## C. Growth / differentiators

- [ ] **Beauty Match** — the recommendation feature, still the main differentiator and
      still unbuilt.
- [ ] **Subscriptions.** Plan plumbing exists but needs real Stripe prices created and
      `STRIPE_PRICE_PRO` / `STRIPE_PRICE_PREMIUM` set.
- [ ] **"Get directions" deep link** — a `geo:` URI opens whatever map app the client has.
      Cheap win now that studios have coordinates.
- [ ] **Self-hosted PMTiles**, if depending on OpenFreeMap's donation-funded public
      instance ever becomes uncomfortable. One URL change in `lib/maplibre-loader.ts`.
- [ ] **Client notifications** beyond email (SMS was the open question for the expert
      interviews).

## D. Tech debt

- [ ] **Studio form files live in the wrong folder.** `profile-form.tsx`, `actions.ts`,
      `location-actions.ts`, `place-pin-button.tsx`, `media-actions.ts` and
      `backfill-actions.ts` are under `provider/profile/` but belong to
      `provider/studio/`. Needs `git mv` plus import fixes.
- [ ] **Brittle column coupling** (B6). Reads select every column, so one missing
      migration breaks the whole provider area — this caused B1.
- [ ] **Two discover implementations.** `discover-client.tsx` and `discovery-home.tsx`
      may overlap; check whether the former is now dead code.
- [ ] **Rounding mismatch.** Analytics rounds per month; the Earnings panel sums minor
      units. Twelve rounded months can disagree with the all-time total by a leu or two.
- [ ] **`on_behalf_of`** refinement on Stripe charges.

---

## Done (for reference)

Real availability with no double-booking · Stripe commission verified end-to-end
(180 RON → 18 RON fee → 162 RON to expert) · payment reconciliation that survives a
dead webhook · provider earnings log · refunds on cancellation · cold-start empty
states and founding-expert CTA · demo studios unpublished · Google Maps replaced with
MapLibre + OpenFreeMap · geocoding + manual pin placement · split account settings
from studio profile · email change with confirmation · reviews · Connect onboarding.
