import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { AppTopBar } from '@/components/app/app-top-bar';
import { studioById } from '@/lib/app-mock-data';
import { BookingClient } from './booking-client';

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const studio = studioById(id);
  if (!studio) notFound();

  return (
    <div className="min-h-dvh pb-28">
      <AppTopBar title={`Book · ${studio.name}`} backHref={`/studio/${id}`} step="Step 4 of 4" />
      <BookingClient studio={studio} locale={locale} />
    </div>
  );
}
