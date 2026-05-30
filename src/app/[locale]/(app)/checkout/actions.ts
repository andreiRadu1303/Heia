'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

/**
 * Insert a real booking row in Supabase from the checkout "pay" button.
 * For now this is the entire payment step — no Stripe integration yet —
 * so the booking lands as `pending`. The provider sees it on their
 * dashboard and accepts/declines.
 */
export async function createBookingAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const studioSlug = String(formData.get('studioSlug') ?? '');
  const serviceId = String(formData.get('serviceId') ?? '');
  const scheduledAt = String(formData.get('scheduledAt') ?? '');
  const notes = (String(formData.get('notes') ?? '').trim() || null) as string | null;

  // Need the basics; otherwise punt to services.
  if (!studioSlug || !serviceId || !scheduledAt) {
    redirect(`/${locale}/services`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // Bounce to login; client comes back to checkout via the next param.
    redirect(`/${locale}/login`);
  }

  // Validate the service belongs to that studio (and capture snapshot fields).
  const { data: service, error: svcErr } = await supabase
    .from('services')
    .select('id, name, duration_min, price_lei, studio_id, studios!inner(slug)')
    .eq('id', serviceId)
    .eq('studios.slug', studioSlug)
    .maybeSingle();

  if (svcErr || !service) {
    redirect(`/${locale}/services`);
  }

  const { error: insErr } = await supabase.from('bookings').insert({
    studio_id: service.studio_id,
    service_id: service.id,
    client_id: user.id,
    service_name: service.name,
    price_lei: service.price_lei,
    duration_min: service.duration_min,
    scheduled_at: scheduledAt,
    notes,
  });

  if (insErr) {
    console.error('createBookingAction: insert failed', insErr);
    redirect(`/${locale}/checkout?err=db`);
  }

  redirect(`/${locale}/account?booked=1`);
}
