import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { getStripe } from '@/lib/stripe/client';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Stripe sends the raw body; we must verify the signature against it. */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const body = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      // Expert finished (or updated) Connect onboarding.
      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await admin
          .from('studios')
          .update({ stripe_charges_enabled: Boolean(account.charges_enabled) })
          .eq('stripe_account_id', account.id);
        break;
      }

      // A Checkout Session finished — either a booking payment or a subscription.
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session;

        if (s.mode === 'payment') {
          const bookingId = s.metadata?.booking_id ?? null;
          await admin.from('payments').insert({
            booking_id: bookingId,
            studio_id: s.metadata?.studio_id ?? null,
            client_id: s.metadata?.client_id ?? null,
            stripe_session_id: s.id,
            stripe_payment_intent_id:
              typeof s.payment_intent === 'string' ? s.payment_intent : null,
            amount_total: s.amount_total ?? 0,
            application_fee: Number(s.metadata?.application_fee ?? 0),
            currency: s.currency ?? 'ron',
            status: 'paid',
          });
          if (bookingId) {
            await admin
              .from('bookings')
              .update({ paid_at: new Date().toISOString() })
              .eq('id', bookingId);
          }
        } else if (s.mode === 'subscription') {
          const userId = s.metadata?.user_id ?? null;
          const customerId = typeof s.customer === 'string' ? s.customer : null;
          if (userId) {
            await admin
              .from('profiles')
              .update({
                stripe_customer_id: customerId,
                subscription_status: 'active',
                subscription_price_id: s.metadata?.price_id ?? null,
              })
              .eq('id', userId);
          }
        }
        break;
      }

      // Subscription lifecycle changes.
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;

        // `current_period_end` lives on the subscription (older API) or its
        // items (newer API); read it defensively without assuming the shape.
        const shape = sub as unknown as {
          current_period_end?: number;
          items?: { data?: { current_period_end?: number }[] };
        };
        const periodEnd = shape.current_period_end ?? shape.items?.data?.[0]?.current_period_end;

        await admin
          .from('profiles')
          .update({
            subscription_status: sub.status,
            subscription_price_id: sub.items.data[0]?.price.id ?? null,
            subscription_current_period_end: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error('Stripe webhook handler error', err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
