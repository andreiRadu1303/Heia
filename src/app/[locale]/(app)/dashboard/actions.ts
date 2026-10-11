'use server';

import { redirect } from 'next/navigation';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { refundBookingPayment } from '@/lib/refunds';
import { cityById } from '@/lib/cities';

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

/**
 * Remember the city the client wants to discover in (header picker and the
 * account page). Only ids from `CITIES` are accepted.
 */
export async function setCityAction(
  locale: string,
  cityId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!cityById(cityId)) return { ok: false, error: 'Unknown city.' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You are signed out.' };

  const { error } = await supabase.from('profiles').update({ city: cityId }).eq('id', user.id);

  if (error) {
    console.error('setCityAction failed', error);
    return { ok: false, error: 'Could not save city. Make sure migration 011 has been run.' };
  }

  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/account`);
  return { ok: true };
}
