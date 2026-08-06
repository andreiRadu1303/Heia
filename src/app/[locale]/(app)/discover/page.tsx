import { setRequestLocale } from 'next-intl/server';

import { AppTopBar } from '@/components/app/app-top-bar';
import { CATEGORIES, categoryById } from '@/lib/app-mock-data';
import { getPublishedStudios } from '@/lib/discover-server';
import { DiscoverClient } from './discover-client';

export const dynamic = 'force-dynamic';

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

  const category = categoryById(sp.category ?? '') ?? CATEGORIES[0];
  const studios = await getPublishedStudios({ categoryId: category.id });
  // A `focus` studio (by slug) surfaces first if it's in this category.
  const focused = sp.focus ? studios.find((s) => s.id === sp.focus) : undefined;

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppTopBar title={`${category.name} near you`} backHref="/dashboard" />
      <div className="relative flex-1">
        <DiscoverClient studios={studios} focusId={focused?.id} />
      </div>
    </div>
  );
}
