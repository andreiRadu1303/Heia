import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe/client';
import { isStripeConfigured } from '@/lib/stripe/config';

export interface RefundResult {
  refunded: boolean;
  amountMinor?: number;
  error?: string;
}

/**
 * Refund a booking's payment, if it was paid by card.
 *
 * Safe to call for unpaid bookings (returns `refunded: false` with no error) so
 * cancellation flows don't need to branch. Idempotent-ish: once the payments row
 * is marked `refunded` we won't refund again.
 */
export async function refundBookingPayment(bookingId: string): Promise<RefundResult> {
  if (!isStripeConfigured()) return { refunded: false };

  const supabase = await createClient();
  const { data: payment } = await supabase
    .from('payments')
    .select('id, stripe_payment_intent_id, amount_total, status')
    .eq('booking_id', bookingId)
    .eq('status', 'paid')
    .maybeSingle();

  if (!payment?.stripe_payment_intent_id) return { refunded: false };

  try {
    const refund = await getStripe().refunds.create({
      payment_intent: payment.stripe_payment_intent_id as string,
      // Pull our platform fee back too, so the expert isn't charged commission
      // on a booking that never happened.
      refund_application_fee: true,
      reverse_transfer: true,
    });

    await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('id', payment.id);

    return { refunded: true, amountMinor: refund.amount ?? payment.amount_total ?? 0 };
  } catch (e) {
    console.error('refundBookingPayment failed', e);
    return { refunded: false, error: e instanceof Error ? e.message : 'Refund failed' };
  }
}
