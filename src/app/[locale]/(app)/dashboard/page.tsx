import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { createClient } from '@/lib/supabase/server';
import { resolveCity } from '@/lib/cities';
import { DiscoveryHome } from '@/components/app/discovery-home';

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

  const firstName = (profile?.display_name ?? user.email ?? 'there').split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  return <DiscoveryHome firstName={firstName} initial={initial} locale={locale} city={city} />;
}
