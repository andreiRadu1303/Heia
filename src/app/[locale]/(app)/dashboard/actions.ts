'use server';

import { redirect } from 'next/navigation';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { refundBookingPayment } from '@/lib/refunds';

/**
 * Client cancels their own booking. RLS ("Bookings: client cancels own") makes
 * sure they can only touch their own. If it was paid by card, we refund it.
 */
export async function cancelMyBookingAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const bookingId = String(formData.get('bookingId') ?? '');
  if (!bookingId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  await refundBookingPayment(bookingId);

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('client_id', user.id);

  if (error) console.error('cancelMyBookingAction failed', error);

  revalidatePath(`/${locale}/account`);
  revalidatePath(`/${locale}/dashboard`);
}

export async function logoutAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}
