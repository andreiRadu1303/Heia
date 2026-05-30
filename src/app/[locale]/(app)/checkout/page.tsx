import { setRequestLocale } from 'next-intl/server';

import { AppTopBar } from '@/components/app/app-top-bar';
import { createClient } from '@/lib/supabase/server';
import { CheckoutClient } from './checkout-client';

export const dynamic = 'force-dynamic';

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
  const studioSlug = sp.studio ?? '';
  const serviceId = sp.service ?? '';

  const supabase = await createClient();

  // Single query that validates the service belongs to a published studio with this slug.
  const { data: bundle } = await supabase
    .from('services')
    .select('id, name, duration_min, price_lei, studios!inner(slug, name, is_published)')
    .eq('id', serviceId)
    .eq('studios.slug', studioSlug)
    .eq('studios.is_published', true)
    .maybeSingle();

  const studio = bundle?.studios as
    | { slug: string; name: string; is_published: boolean }
    | undefined;

  return (
    <div className="min-h-dvh pb-12">
      <AppTopBar
        title="Checkout"
        backHref={studio ? `/studio/${studio.slug}/book` : '/services'}
      />
      <CheckoutClient
        studioName={studio?.name ?? ''}
        studioSlug={studio?.slug ?? ''}
        serviceId={(bundle?.id as string | undefined) ?? ''}
        serviceName={(bundle?.name as string | undefined) ?? ''}
        priceLei={(bundle?.price_lei as number | undefined) ?? 0}
        durationMin={(bundle?.duration_min as number | undefined) ?? 0}
        date={sp.date ?? ''}
        time={sp.time ?? ''}
        locale={locale}
      />
    </div>
  );
}
