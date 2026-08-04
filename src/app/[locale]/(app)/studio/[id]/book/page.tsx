import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { AppTopBar } from '@/components/app/app-top-bar';
import { createClient } from '@/lib/supabase/server';
import { BookingClient } from './booking-client';

export const dynamic = 'force-dynamic';

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const { data: studio } = await supabase
    .from('studios')
    .select('id, slug, name')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!studio) notFound();

  const { data: rawServices } = await supabase
    .from('services')
    .select('id, name, duration_min, price_lei')
    .eq('studio_id', studio.id)
    .order('sort_order', { ascending: true });

  const services = (rawServices ?? []).map((s) => ({
    id: s.id as string,
    name: s.name as string,
    durationMin: s.duration_min as number,
    priceLei: s.price_lei as number,
  }));

  return (
    <div className="min-h-dvh pb-28">
      <AppTopBar
        title={`Book · ${studio.name}`}
        backHref={`/studio/${slug}`}
        step="Step 3 of 3"
      />
      <BookingClient
        studioSlug={studio.slug}
        studioName={studio.name}
        services={services}
        locale={locale}
      />
    </div>
  );
}
