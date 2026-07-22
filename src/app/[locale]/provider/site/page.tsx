import { setRequestLocale } from 'next-intl/server';

import { studioById, MY_STUDIO_ID } from '@/lib/app-mock-data';
import { SiteBuilder } from './site-builder';

// Auth-gated by the provider layout; keep dynamic.
export const dynamic = 'force-dynamic';

export default async function ProviderSitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // For now the builder edits the demo studio. When the provider area is
  // wired to real data, this resolves to the signed-in expert's own studio.
  const studio = studioById(MY_STUDIO_ID)!;

  return <SiteBuilder studio={studio} locale={locale} />;
}
