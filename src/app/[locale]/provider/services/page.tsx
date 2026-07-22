import { setRequestLocale } from 'next-intl/server';

import { createClient } from '@/lib/supabase/server';
import { getMyStudio } from '@/lib/provider-studio';
import { ServicesEditor } from './services-editor';
import type { ServiceInput } from './actions';

export const dynamic = 'force-dynamic';

interface ServiceRow {
  id: string;
  name: string;
  duration_min: number;
  price_lei: number;
}

export default async function ProviderServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const studio = await getMyStudio();

  let initial: ServiceInput[] = [];
  if (studio) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('services')
      .select('id, name, duration_min, price_lei')
      .eq('studio_id', studio.id)
      .order('sort_order', { ascending: true });

    initial = ((data ?? []) as ServiceRow[]).map((r) => ({
      id: r.id,
      name: r.name,
      durationMin: r.duration_min,
      priceLei: r.price_lei,
    }));
  }

  return (
    <main className="container max-w-2xl space-y-6 pt-8">
      <header>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Services</h1>
        <p className="mt-2 text-muted-foreground">What you offer and what it costs.</p>
      </header>

      {studio ? (
        <ServicesEditor initial={initial} locale={locale} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
          We couldn’t find a studio for your account. If you just signed up, try reloading.
        </div>
      )}
    </main>
  );
}
