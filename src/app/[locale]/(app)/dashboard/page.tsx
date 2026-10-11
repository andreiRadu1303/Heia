import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { createClient } from '@/lib/supabase/server';
import { resolveCity } from '@/lib/cities';
import { DiscoveryHome, type NextBooking } from '@/components/app/discovery-home';

// Auth-gated: always run per request.
export const dynamic = 'force-dynamic';

export default async function ClientHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role === 'provider') redirect(`/${locale}/provider`);

  // Separate query so a not-yet-applied migration 011 only loses the city,
  // not the whole profile (see QA log B6).
  const { data: cityRow } = await supabase
    .from('profiles')
    .select('city')
    .eq('id', user.id)
    .maybeSingle();
  const city = resolveCity(cityRow?.city);

  // The client's next upcoming visit (RLS limits rows to their own bookings).
  // `scheduled_at` is stored as a naive local datetime, so compare against a
  // local "now" formatted the same way.
  const now = new Date();
  const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 19);
  const { data: nextRow } = await supabase
    .from('bookings')
    .select('id, scheduled_at, service_name, status, studios(slug, name, hero_seed, cover_url)')
    .in('status', ['pending', 'confirmed'])
    .gte('scheduled_at', nowLocal)
    .order('scheduled_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const next = nextRow as unknown as NextBookingRow | null;
  const nextBooking: NextBooking | null = next
    ? {
        id: next.id,
        studioSlug: next.studios?.slug ?? null,
        studioName: next.studios?.name ?? 'Studio',
        serviceName: next.service_name,
        date: next.scheduled_at.slice(0, 10),
        time: next.scheduled_at.slice(11, 16),
        status: next.status,
        imageUrl: next.studios?.cover_url ?? null,
        heroSeed: next.studios?.hero_seed ?? null,
      }
    : null;

  const firstName = (profile?.display_name ?? user.email ?? 'there').split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <DiscoveryHome
      firstName={firstName}
      initial={initial}
      locale={locale}
      city={city}
      nextBooking={nextBooking}
    />
  );
}

interface NextBookingRow {
  id: string;
  scheduled_at: string;
  service_name: string;
  status: 'pending' | 'confirmed';
  studios: {
    slug: string;
    name: string;
    hero_seed: string | null;
    cover_url: string | null;
  } | null;
}
