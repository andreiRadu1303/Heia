import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { studioById } from '@/lib/app-mock-data';
import { ReviewClient } from './review-client';

export default async function StudioReviewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const studio = studioById(id);
  if (!studio) notFound();

  return <ReviewClient studioId={studio.id} studioName={studio.name} locale={locale} />;
}
