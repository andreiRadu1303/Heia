import { setRequestLocale } from 'next-intl/server';

import { studioById, MY_STUDIO_ID } from '@/lib/app-mock-data';
import { getMyStudio } from '@/lib/provider-studio';
import { getPublicStudioBySlug } from '@/lib/public-studio';
import { type SiteConfig } from '@/lib/site-config';
import { SiteBuilder } from './site-builder';

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

  const myStudio = await getMyStudio();
  const initialConfig = isSiteConfig(myStudio?.site_config)
    ? (myStudio!.site_config as SiteConfig)
    : null;

  // Preview the expert's OWN studio content so it's really "their" page.
  // Fall back to a demo studio if we can't resolve it (e.g. no studio yet).
  let studio = studioById(MY_STUDIO_ID)!;
  if (myStudio) {
    const real = await getPublicStudioBySlug(myStudio.slug);
    if (real) studio = real;
  }

  return <SiteBuilder studio={studio} locale={locale} initialConfig={initialConfig} />;
}
