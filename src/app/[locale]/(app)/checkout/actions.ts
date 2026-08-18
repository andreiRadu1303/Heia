'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe/client';
import {
  isStripeConfigured,
  toMinor,
  applicationFeeMinor,
  STRIPE_CURRENCY,
} from '@/lib/stripe/config';

interface JoinedStudio {
  slug: string;
  stripe_account_id: string | null;
  stripe_charges_enabled: boolean;
}

/**
 * Create a booking, then — if the expert has Stripe payouts enabled — send the
 * client to Stripe Checkout with the platform's application fee split out. If
 * Stripe isn't set up for this studio, the booking simply lands as `pending`
 * and the provider confirms it (no payment).
 */
export async function createBookingAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const studioSlug = String(formData.get('studioSlug') ?? '');
  const serviceId = String(formData.get('serviceId') ?? '');
  const scheduledAt = String(formData.get('scheduledAt') ?? '');
  const notes = (String(formData.get('notes') ?? '').trim() || null) as string | null;

  if (!studioSlug || !serviceId || !scheduledAt) {
    redirect(`/${locale}/services`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: service, error: svcErr } = await supabase
    .from('services')
    .select(
      'id, name, duration_min, price_lei, studio_id, studios!inner(slug, stripe_account_id, stripe_charges_enabled)',
    )
    .eq('id', serviceId)
    .eq('studios.slug', studioSlug)
    .maybeSingle();

  if (svcErr || !service) {
    redirect(`/${locale}/services`);
  }

  const studio = service.studios as unknown as JoinedStudio;

  const { data: booking, error: insErr } = await supabase
    .from('bookings')
    .insert({
      studio_id: service.studio_id,
      service_id: service.id,
      client_id: user.id,
      service_name: service.name,
      price_lei: service.price_lei,
      duration_min: service.duration_min,
      scheduled_at: scheduledAt,
      notes,
    })
    .select('id')
    .single();

  if (insErr || !booking) {
    console.error('createBookingAction: insert failed', insErr);
    redirect(`/${locale}/checkout?err=db`);
  }

  // Paid path: charge the client and split the platform fee to us.
  let checkoutUrl: string | null = null;
  const canCharge =
    isStripeConfigured() && studio.stripe_charges_enabled && !!studio.stripe_account_id;

  if (canCharge) {
    const host = (await headers()).get('host') ?? 'localhost:3000';
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${host}`;
    const amountMinor = toMinor(service.price_lei);
    const fee = applicationFeeMinor(amountMinor);

    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: STRIPE_CURRENCY,
              product_data: { name: service.name },
              unit_amount: amountMinor,
            },
          },
        ],
        payment_intent_data: {
          application_fee_amount: fee,
          transfer_data: { destination: studio.stripe_account_id as string },
        },
        // The session id lets the success page reconcile the payment into our
        // own tables even if the webhook never arrives.
        success_url: `${base}/${locale}/account?booked=1&paid=1&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/${locale}/studio/${studio.slug}/book`,
        metadata: {
          booking_id: booking.id as string,
          studio_id: service.studio_id as string,
          client_id: user.id,
          application_fee: String(fee),
        },
      });
      checkoutUrl = session.url;
    } catch (err) {
      // Payment couldn't start — keep the pending booking so it isn't lost.
      console.error('createBookingAction: stripe session failed', err);
    }
  }

  if (checkoutUrl) redirect(checkoutUrl);
  redirect(`/${locale}/account?booked=1`);
}
