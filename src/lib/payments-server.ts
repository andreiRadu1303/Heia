import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe/client';
import { isStripeConfigured } from '@/lib/stripe/config';

/**
 * Reconcile a completed Stripe Checkout Session into our own tables.
 *
 * The webhook (`checkout.session.completed`) is the primary path, but webhooks
 * can be misconfigured, delayed, or dropped — and a payment that Stripe took
 * but we never recorded is the worst possible failure. So the success redirect
 * calls this too. It is idempotent: if a row for this session already exists,
 * nothing is duplicated.
 */
export async function reconcilePaidSession(sessionId: string): Promise<boolean> {
  if (!sessionId || !isStripeConfigured()) return false;

  const supabase = await createClient();

  // Already recorded? Nothing to do.
  const { data: existing } = await supabase
    .from('payments')
    .select('id')
    .eq('stripe_session_id', sessionId)
    .maybeSingle();
  if (existing) return true;

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') return false;

    const bookingId = session.metadata?.booking_id ?? null;

    const { error } = await supabase.from('payments').insert({
      booking_id: bookingId,
      studio_id: session.metadata?.studio_id ?? null,
      client_id: session.metadata?.client_id ?? null,
      stripe_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string' ? session.payment_intent : null,
      amount_total: session.amount_total ?? 0,
      application_fee: Number(session.metadata?.application_fee ?? 0),
      currency: session.currency ?? 'ron',
      status: 'paid',
    });
    if (error) {
      console.error('reconcilePaidSession: insert failed', error);
      return false;
    }

    if (bookingId) {
      await supabase
        .from('bookings')
        .update({ paid_at: new Date().toISOString() })
        .eq('id', bookingId);
    }
    return true;
  } catch (e) {
    console.error('reconcilePaidSession failed', e);
    return false;
  }
}

export interface EarningsSummary {
  grossMinor: number;
  feeMinor: number;
  netMinor: number;
  count: number;
  currency: string;
  recent: {
    id: string;
    amountMinor: number;
    feeMinor: number;
    createdAt: string;
    serviceName: string | null;
  }[];
}

/** Payment history + totals for the signed-in expert's studio. */
export async function getStudioEarnings(studioId: string): Promise<EarningsSummary> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('payments')
    .select('id, amount_total, application_fee, currency, created_at, booking_id, bookings(service_name)')
    .eq('studio_id', studioId)
    .eq('status', 'paid')
    .order('created_at', { ascending: false });

  const rows = (data ?? []) as unknown as {
    id: string;
    amount_total: number;
    application_fee: number;
    currency: string;
    created_at: string;
    bookings: { service_name: string } | { service_name: string }[] | null;
  }[];

  const grossMinor = rows.reduce((s, r) => s + (r.amount_total ?? 0), 0);
  const feeMinor = rows.reduce((s, r) => s + (r.application_fee ?? 0), 0);

  return {
    grossMinor,
    feeMinor,
    netMinor: grossMinor - feeMinor,
    count: rows.length,
    currency: rows[0]?.currency ?? 'ron',
    recent: rows.slice(0, 10).map((r) => {
      const b = Array.isArray(r.bookings) ? r.bookings[0] : r.bookings;
      return {
        id: r.id,
        amountMinor: r.amount_total ?? 0,
        feeMinor: r.application_fee ?? 0,
        createdAt: r.created_at,
        serviceName: b?.service_name ?? null,
      };
    }),
  };
}
