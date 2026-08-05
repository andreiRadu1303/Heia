# Stripe setup

Heia uses Stripe for two things:

1. **Commission on bookings** — clients pay by card at checkout; Stripe routes the
   money to the expert's connected account and keeps a platform fee for Heia.
2. **Subscriptions** — recurring plans (e.g. Pro / Premium) billed to a user.

Everything is **flexible via env vars**: the fee percentage and the plans are
configuration, not code. Start in **test mode**; switch keys to go live.

---

## 1. Run the migration

Supabase → SQL Editor → run [`009_stripe.sql`](supabase/009_stripe.sql). It adds
Connect fields to `studios`, subscription fields to `profiles`, a `paid_at`
marker on `bookings`, and a `payments` ledger.

## 2. Enable Stripe Connect

In the Stripe Dashboard → **Connect** → get started, choose **Express** accounts.
This lets experts onboard and receive payouts. (Test mode is fine.)

## 3. Environment variables

Add these to `.env.local` (dev) and to Vercel (Preview + Production). See
`.env.example` for the list.

| Var | What |
|-----|------|
| `STRIPE_SECRET_KEY` | Secret key `sk_test_…` (Dashboard → Developers → API keys) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret `whsec_…` (from step 5) |
| `PLATFORM_FEE_BPS` | Commission in basis points. `1000` = 10%. |
| `STRIPE_CURRENCY` | Payout currency, e.g. `ron`. |
| `STRIPE_PRICE_PRO` | (optional) A recurring Price ID → shows as a plan |
| `STRIPE_PLAN_PRO_NAME` | (optional) Display name for that plan |
| `STRIPE_PRICE_PREMIUM` / `STRIPE_PLAN_PREMIUM_NAME` | (optional) a second plan |

The webhook also needs `SUPABASE_SERVICE_ROLE_KEY` (already in `.env.example`)
so it can write results past RLS. Keep it **server-only** — never `NEXT_PUBLIC_`.

`NEXT_PUBLIC_SITE_URL` should point at the current origin (used for redirect URLs).

## 4. Create subscription plans (optional)

Dashboard → **Product catalogue** → add a product with a **recurring price**.
Copy the **Price ID** (`price_…`) into `STRIPE_PRICE_PRO` (and/or `_PREMIUM`).
Only the price IDs you set appear as plans on the provider **Payments** page.

## 5. Configure the webhook

Dashboard → **Developers → Webhooks → Add endpoint**:

- **URL:** `https://<your-domain>/api/stripe/webhook`
- **Events:** `account.updated`, `checkout.session.completed`,
  `customer.subscription.updated`, `customer.subscription.deleted`

Copy the endpoint's **Signing secret** into `STRIPE_WEBHOOK_SECRET`.

For local testing use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# use the whsec_… it prints as STRIPE_WEBHOOK_SECRET
```

## How it flows

**Commission (bookings)**
- Expert opens **Provider → Payments → Connect payouts** → completes Stripe
  onboarding. `account.updated` flips `studios.stripe_charges_enabled = true`.
- A client books at that studio → checkout says "Pay & book" → Stripe Checkout.
- On success, `checkout.session.completed` records a `payments` row (with the
  platform fee) and stamps `bookings.paid_at`. Stripe splits the money: the
  expert's connected account gets the total minus `PLATFORM_FEE_BPS`; Heia keeps
  the fee.
- If a studio hasn't connected payouts, booking still works — it just lands as
  `pending` with no payment (the existing flow).

**Subscriptions**
- Provider → Payments → **Subscribe** → Stripe Checkout (subscription mode).
- `checkout.session.completed` marks `profiles.subscription_status = active`;
  later `customer.subscription.updated/deleted` keep it in sync.
- **Manage subscription** opens Stripe's billing portal.

## Changing the fee or plans

- Fee: change `PLATFORM_FEE_BPS` and redeploy. No code change.
- Plans: add/point `STRIPE_PRICE_*` at different Price IDs. No code change.

## Test cards

Use `4242 4242 4242 4242`, any future expiry, any CVC. For Connect payout
testing, complete the Express onboarding with Stripe's test data.
