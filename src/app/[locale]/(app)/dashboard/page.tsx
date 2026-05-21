import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { createClient } from '@/lib/supabase/server';
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

  const firstName = (profile?.display_name ?? user.email ?? 'there').split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  return <DiscoveryHome firstName={firstName} initial={initial} locale={locale} />;
}
