import Stripe from 'stripe';

let cached: Stripe | null = null;

/**
 * Lazy server-side Stripe client. Never import this from a client component.
 * Throws a clear error if the secret key isn't configured, so callers should
 * guard with `isStripeConfigured()` first for graceful UX.
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set.');
  if (!cached) cached = new Stripe(key);
  return cached;
}
