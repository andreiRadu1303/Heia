import { setRequestLocale } from 'next-intl/server';

import { createClient } from '@/lib/supabase/server';
import { studioById, MY_STUDIO_ID } from '@/lib/app-mock-data';
import { type SiteConfig } from '@/lib/site-config';
import { SiteBuilder } from './site-builder';

// Auth-gated by the provider layout; keep dynamic (reads the user's studio).
export const dynamic = 'force-dynamic';

function isSiteConfig(value: unknown): value is SiteConfig {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as SiteConfig).version === 1 &&
    Array.isArray((value as SiteConfig).sections)
  );
}

export default async function ProviderSitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load the signed-in expert's saved config from their own studio row.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialConfig: SiteConfig | null = null;
  if (user) {
    const { data } = await supabase
      .from('studios')
      .select('site_config')
      .eq('provider_id', user.id)
      .maybeSingle();
    if (isSiteConfig(data?.site_config)) initialConfig = data!.site_config as SiteConfig;
  }

  // Preview uses representative content (the demo studio) until content
  // editing is wired; the design/config being saved is the expert's own.
  const studio = studioById(MY_STUDIO_ID)!;

  return <SiteBuilder studio={studio} locale={locale} initialConfig={initialConfig} />;
}
