import { setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { AppTopBar } from '@/components/app/app-top-bar';
import { CATEGORIES, STUDIOS } from '@/lib/app-mock-data';

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  function countFor(categoryId: string) {
    return STUDIOS.filter((s) => s.categoryId === categoryId).length;
  }

  return (
    <div className="min-h-dvh pb-16">
      <AppTopBar title="Choose a service" backHref="/" step="Step 1 of 3" />

      <main className="container pt-8">
        <h1 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          What feels right today?
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Pick a starting point. You can always change your mind.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/discover?category=${c.id}`}
              className="group relative aspect-square overflow-hidden rounded-3xl ring-1 ring-border transition-transform hover:-translate-y-0.5"
            >
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(155deg, ${c.tint} 0%, hsl(var(--card)) 130%)` }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent" aria-hidden />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <div className="text-lg font-medium tracking-tight text-white">{c.name}</div>
                <div className="text-xs text-white/80">
                  {c.tagline} · {countFor(c.id)} nearby
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
