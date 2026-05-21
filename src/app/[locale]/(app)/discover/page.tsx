import { setRequestLocale } from 'next-intl/server';

import { AppTopBar } from '@/components/app/app-top-bar';
import { CATEGORIES, categoryById, studiosByCategory } from '@/lib/app-mock-data';
import { DiscoverClient } from './discover-client';

export default async function DiscoverPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const category = categoryById(sp.category ?? '') ?? CATEGORIES[0];
  const studios = studiosByCategory(category.id);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppTopBar title={`${category.name} near you`} backHref="/services" step="Step 2 of 4" />
      <div className="relative flex-1">
        <DiscoverClient studios={studios} />
      </div>
    </div>
  );
}
