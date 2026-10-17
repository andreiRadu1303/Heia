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
import { isStudioSaved } from '@/lib/saved-studios';
import { createClient } from '@/lib/supabase/server';
import { getStudioHours } from '@/lib/availability';
import { SaveStudioButton } from '@/components/app/save-studio-button';
import { StudioSite } from '@/components/studio-site/studio-site';
import type { Review as RealReview } from '@/lib/reviews';
import { overall } from '@/lib/reviews';

// Reads the session (for owner preview of unpublished pages) → render per request.
export const dynamic = 'force-dynamic';

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Everything independent runs in parallel: the page waits for the slowest
  // round trip rather than the sum of them.
  const supabase = await createClient();
  const [realStudio, reviews, authResult] = await Promise.all([
    getPublicStudioBySlug(id),
    getStudioReviewsBySlug(id),
    supabase.auth.getUser(),
  ]);
  const user = authResult.data.user;

  // Real studio first (by slug), falling back to the seeded demo studios.
  const studio = realStudio ?? studioById(id);
  if (!studio) notFound();
  const category = categoryById(studio.categoryId);

  const [saved, hours] = await Promise.all([
    user ? isStudioSaved(id, user.id) : Promise.resolve(false),
    studio.siteConfig && studio.dbId ? getStudioHours(studio.dbId) : Promise.resolve(undefined),
  ]);

  // Expert designed a mini-site → render that instead of the generic layout.
  // Content (name, services, photos, reviews, hours) is still the real data.
  if (studio.siteConfig && studio.dbId) {
    const siteStudio = { ...studio, reviews: reviews.map(toSiteReview) };
    return (
      <div className="min-h-dvh pb-24">
        <AppTopBar title={studio.name} backHref={`/discover?category=${studio.categoryId}`} historyBack />
        <div className="relative">
          <SaveStudioButton
            slug={studio.id}
            locale={locale}
            initialSaved={saved}
            signedIn={!!user}
            className="absolute right-4 top-4 z-10"
          />
          <StudioSite studio={siteStudio} config={studio.siteConfig} locale={locale} hours={hours} />
        </div>
        <div className="container pt-8">
          <StudioReviews studioSlug={studio.id} reviews={reviews} locale={locale} />
        </div>
        <BookBar studio={studio} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-24">
      <AppTopBar title={studio.name} backHref={`/discover?category=${studio.categoryId}`} historyBack />

      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        {studio.heroUrl || studio.heroSeed ? (
          <img
            src={studio.heroUrl || img.hero(studio.heroSeed)}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div
            className="size-full"
            style={{
              background:
                'linear-gradient(160deg, hsl(var(--muted)) 0%, hsl(var(--secondary)) 55%, hsl(var(--accent) / 0.3) 100%)',
            }}
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent" />
        <SaveStudioButton
          slug={studio.id}
          locale={locale}
          initialSaved={saved}
          signedIn={!!user}
          className="absolute right-4 top-4"
        />
        <div className="absolute bottom-4 left-0 right-0 px-5">
          <div className="flex items-center gap-2 text-xs font-medium text-white/85">
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-black/80">
              {category?.name}
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
        {/* Keep the paragraphs / line breaks the expert typed in the profile editor. */}
        <p className="whitespace-pre-line leading-relaxed text-foreground/90">{studio.bio}</p>

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

      <BookBar studio={studio} />
    </div>
  );
}

/** Sticky "Book now" bar shared by both page layouts. */
function BookBar({ studio }: { studio: { id: string; priceFromLei: number } }) {
  return (
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
  );
}

/** Map a real review onto the compact shape the mini-site's Reviews section draws. */
function toSiteReview(r: RealReview) {
  return {
    id: r.id,
    author: r.author,
    avatarSeed: r.avatarSeed,
    rating: overall(r.scores),
    body: r.body,
    ago: timeAgo(r.createdAt),
  };
}

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
