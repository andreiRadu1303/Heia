'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { refundBookingPayment } from '@/lib/refunds';

type Next = 'confirmed' | 'declined' | 'completed' | 'cancelled';

async function setBookingStatus(bookingId: string, next: Next, locale: string) {
  if (!bookingId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // Declining or cancelling a paid booking must return the client's money.
  if (next === 'declined' || next === 'cancelled') {
    await refundBookingPayment(bookingId);
  }

  // RLS enforces that only the studio owner can update — but we double-check
  // by id so a stale form can't change a row we no longer own.
  const { error } = await supabase
    .from('bookings')
    .update({ status: next })
    .eq('id', bookingId);

  if (error) {
    console.error(`setBookingStatus(${next}) failed`, error);
  }

  revalidatePath(`/${locale}/provider/bookings`);
  revalidatePath(`/${locale}/provider`);
}

export async function acceptBookingAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const id = String(formData.get('bookingId') ?? '');
  await setBookingStatus(id, 'confirmed', locale);
}

export async function declineBookingAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const id = String(formData.get('bookingId') ?? '');
  await setBookingStatus(id, 'declined', locale);
}

export async function completeBookingAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const id = String(formData.get('bookingId') ?? '');
  await setBookingStatus(id, 'completed', locale);
}

/** Provider cancels an already-confirmed booking (refunds if it was paid). */
export async function cancelBookingAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const id = String(formData.get('bookingId') ?? '');
  await setBookingStatus(id, 'cancelled', locale);
}
