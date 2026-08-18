/**
 * Stripe configuration — deliberately flexible and env-driven so the platform
 * fee and the subscription plans can change without code edits.
 *
 * Env vars:
 *   STRIPE_SECRET_KEY               server secret (sk_test_… / sk_live_…)
 *   STRIPE_WEBHOOK_SECRET           signing secret for the webhook (whsec_…)
 *   PLATFORM_FEE_BPS               commission in basis points (1000 = 10%)
 *   STRIPE_CURRENCY                ISO currency (default 'ron')
 *   STRIPE_PRICE_PRO / _PREMIUM    recurring price ids for subscription plans
 *   STRIPE_PLAN_PRO_NAME / …       optional display names
 */

export const STRIPE_CURRENCY = (process.env.STRIPE_CURRENCY ?? 'ron').toLowerCase();

/** Commission in basis points. 1000 = 10%. */
export const PLATFORM_FEE_BPS = Number(process.env.PLATFORM_FEE_BPS ?? '1000');

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Whether Stripe is running against test keys. Derived from the key prefix, so
 * it never exposes the secret itself — just lets the UI warn loudly when the
 * app is wired to LIVE keys (i.e. real money) while you're still testing.
 */
export function isStripeTestMode(): boolean {
  return (process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_test_');
}

/** Whole currency units → minor units (lei → bani). */
export function toMinor(amount: number): number {
  return Math.round(amount * 100);
}

/** The platform's cut of a charge, in minor units. */
export function applicationFeeMinor(amountMinor: number): number {
  return Math.round((amountMinor * PLATFORM_FEE_BPS) / 10000);
}

export function feePercentLabel(): string {
  const pct = PLATFORM_FEE_BPS / 100;
  return `${Number.isInteger(pct) ? pct : pct.toFixed(1)}%`;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceId: string;
  blurb: string;
}

/** Subscription plans, built from whichever price ids are configured. */
export function getPlans(): SubscriptionPlan[] {
  const plans: SubscriptionPlan[] = [];
  if (process.env.STRIPE_PRICE_PRO) {
    plans.push({
      id: 'pro',
      name: process.env.STRIPE_PLAN_PRO_NAME ?? 'Pro',
      priceId: process.env.STRIPE_PRICE_PRO,
      blurb: 'Featured placement and priority support.',
    });
  }
  if (process.env.STRIPE_PRICE_PREMIUM) {
    plans.push({
      id: 'premium',
      name: process.env.STRIPE_PLAN_PREMIUM_NAME ?? 'Premium',
      priceId: process.env.STRIPE_PRICE_PREMIUM,
      blurb: 'Everything in Pro plus a homepage spotlight.',
    });
  }
  return plans;
}
