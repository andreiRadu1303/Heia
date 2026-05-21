import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

/**
 * Guard for provider-only pages. Redirects to login if signed out, or to
 * the client dashboard if the account is a client. Returns the user +
 * profile when the visitor is a provider.
 */
export async function requireProvider(locale: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'provider') {
    redirect(`/${locale}/dashboard`);
  }

  return { user, profile };
}
