import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Star, MapPin, Clock } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { AppTopBar } from '@/components/app/app-top-bar';
import { Button } from '@/components/ui/button';
import { StudioReviews } from '@/components/reviews/studio-reviews';
import { studioById, categoryById, img, formatLei } from '@/lib/app-mock-data';
import { getPublicStudioBySlug } from '@/lib/public-studio';
import { getStudioReviewsBySlug } from '@/lib/reviews-server';

// Reads the session (for owner preview of unpublished pages) → render per request.
export const dynamic = 'force-dynamic';

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Real studio first (by slug), falling back to the seeded demo studios.
  const studio = (await getPublicStudioBySlug(id)) ?? studioById(id);
  if (!studio) notFound();
  const category = categoryById(studio.categoryId);
  const reviews = await getStudioReviewsBySlug(id);

  return (
    <div className="min-h-dvh pb-24">
      <AppTopBar
        title={studio.name}
        backHref={`/discover?category=${studio.categoryId}`}
        step="Step 3 of 4"
      />

      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <img
          src={studio.heroUrl || img.hero(studio.heroSeed)}
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent" />
        <div className="absolute bottom-4 left-0 right-0 px-5">
          <div className="flex items-center gap-2 text-xs font-medium text-white/85">
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-black/80">
              {category?.emoji} {category?.name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-black/80">
              <Star className="size-3 fill-current" /> {studio.rating} ({studio.reviewCount})
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-white">{studio.name}</h1>
        </div>
      </div>

      <main className="container space-y-8 pt-6">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" /> {studio.address}
            {studio.distanceKm > 0 ? ` · ${studio.distanceKm} km` : ''}
          </span>
        </div>

        {/* Known for */}
        <div className="flex flex-wrap gap-2">
          {studio.knownFor.map((k) => (
            <span
              key={k}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {k}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="leading-relaxed text-foreground/90">{studio.bio}</p>

        {/* Services */}
        <section>
          <h2 className="mb-4 text-xl font-medium tracking-tight">Services</h2>
          <div className="divide-y divide-border rounded-3xl bg-card ring-1 ring-border">
            {studio.services.map((sv) => (
              <div key={sv.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="font-medium">{sv.name}</div>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" /> {sv.durationMin} min
                  </div>
                </div>
                <div className="text-sm font-medium">{formatLei(sv.priceLei)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        {(() => {
          const gallery =
            studio.galleryUrls && studio.galleryUrls.length > 0
              ? studio.galleryUrls
              : studio.gallerySeeds.map((s) => img.square(s));
          if (gallery.length === 0) return null;
          return (
            <section>
              <h2 className="mb-4 text-xl font-medium tracking-tight">Work</h2>
              <div className="grid grid-cols-3 gap-2">
                {gallery.map((src) => (
                  <div
                    key={src}
                    className="aspect-square overflow-hidden rounded-2xl ring-1 ring-border"
                  >
                    <img src={src} alt="" className="size-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Reviews */}
        <StudioReviews studioSlug={studio.id} reviews={reviews} locale={locale} />
      </main>

      {/* Sticky book bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-3">
          <div>
            <div className="text-xs text-muted-foreground">From</div>
            <div className="font-medium">{formatLei(studio.priceFromLei)}</div>
          </div>
          <Button asChild size="lg" className="h-12 px-8">
            <Link href={`/studio/${studio.id}/book`}>Book now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
