import { setRequestLocale } from 'next-intl/server';

import { AppTopBar } from '@/components/app/app-top-bar';
import { CATEGORIES, categoryById, studiosByCategory, studioById } from '@/lib/app-mock-data';
import { DiscoverClient } from './discover-client';

export default async function DiscoverPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; focus?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;

  // A `focus` studio implies its category; otherwise use the category param.
  const focused = sp.focus ? studioById(sp.focus) : undefined;
  const category =
    categoryById(focused?.categoryId ?? sp.category ?? '') ?? CATEGORIES[0];
  const studios = studiosByCategory(category.id);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppTopBar title={`${category.name} near you`} backHref="/dashboard" />
      <div className="relative flex-1">
        <DiscoverClient studios={studios} focusId={focused?.id} />
      </div>
    </div>
  );
}
