import { setRequestLocale } from 'next-intl/server';

import { getMyStudio } from '@/lib/provider-studio';
import { getStudioHours } from '@/lib/availability';
import { HoursEditor } from './hours-editor';

export const dynamic = 'force-dynamic';

export default async function ProviderAvailabilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const studio = await getMyStudio();
  const hours = studio ? await getStudioHours(studio.id) : [];

  return (
    <main className="container max-w-2xl space-y-6 pt-8">
      <header>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Hours</h1>
        <p className="mt-2 text-muted-foreground">When clients can book you.</p>
      </header>

      {studio ? (
        <HoursEditor initial={hours} locale={locale} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
          We couldn’t find a studio for your account. If you just signed up, try reloading.
        </div>
      )}
    </main>
  );
}
