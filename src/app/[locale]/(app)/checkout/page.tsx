import { setRequestLocale } from 'next-intl/server';

import { AppTopBar } from '@/components/app/app-top-bar';
import { studioById } from '@/lib/app-mock-data';
import { CheckoutClient } from './checkout-client';

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ studio?: string; service?: string; date?: string; time?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const studio = studioById(sp.studio ?? '');
  const service = studio?.services.find((s) => s.id === sp.service);

  return (
    <div className="min-h-dvh pb-12">
      <AppTopBar
        title="Checkout"
        backHref={studio ? `/studio/${studio.id}/book` : '/services'}
      />
      <CheckoutClient
        studioName={studio?.name ?? ''}
        studioId={studio?.id ?? ''}
        serviceName={service?.name ?? ''}
        priceLei={service?.priceLei ?? 0}
        durationMin={service?.durationMin ?? 0}
        date={sp.date ?? ''}
        time={sp.time ?? ''}
        locale={locale}
      />
    </div>
  );
}
