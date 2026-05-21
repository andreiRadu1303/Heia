import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Search, SlidersHorizontal, Star, MapPin } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  CATEGORIES,
  STUDIOS,
  CLIENT_BOOKINGS,
  img,
  formatLei,
  formatBookingDate,
  type Category,
  type Studio,
} from '@/lib/app-mock-data';

// Auth-gated: always run per request.
export const dynamic = 'force-dynamic';

export default async function ClientHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role === 'provider') redirect(`/${locale}/provider`);

  const firstName = (profile?.display_name ?? user.email ?? 'there').split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();
  const nearYou = STUDIOS.slice(0, 6);

  return (
    <div className="min-h-dvh pb-16">
      {/* Sticky top: greeting + avatar + search + tags */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="container flex items-center gap-3 pt-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">Hi, {firstName}</div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <MapPin className="size-3.5 text-accent" /> București
            </div>
          </div>
          <Link
            href="/account"
            aria-label="Account"
            className="grid size-10 place-items-center rounded-full bg-accent/25 font-medium text-foreground ring-1 ring-border"
          >
            {initial}
          </Link>
        </div>

        <div className="container pb-3 pt-3">
          <div className="flex gap-2">
            <Link
              href="/discover"
              className="flex h-12 flex-1 items-center gap-3 rounded-full border border-border bg-card px-5 text-muted-foreground"
            >
              <Search className="size-4 shrink-0" />
              <span className="truncate text-sm">Search treatments, studios…</span>
            </Link>
            <Link
              href="/discover"
              aria-label="Filters"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-foreground text-background"
            >
              <SlidersHorizontal className="size-5" />
            </Link>
          </div>

          {/* Tag chips */}
          <div className="-mr-4 mt-3 overflow-x-auto">
            <div className="flex w-max gap-2 pb-1">
              <TagChip href="/discover" label="All" active />
              {CATEGORIES.map((c) => (
                <TagChip key={c.id} href={`/discover?category=${c.id}`} label={c.name} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container space-y-10 pt-5">
        {/* Upcoming (compact) */}
        {CLIENT_BOOKINGS.length > 0 ? (
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Your next visit
              </h2>
              <Link href="/account" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                All bookings
              </Link>
            </div>
            <Link
              href={`/studio/${CLIENT_BOOKINGS[0].studioId}`}
              className="flex items-center gap-3 rounded-3xl bg-card p-3 ring-1 ring-border"
            >
              <img
                src={img.square(CLIENT_BOOKINGS[0].heroSeed)}
                alt=""
                className="size-14 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{CLIENT_BOOKINGS[0].studioName}</div>
                <div className="truncate text-sm text-muted-foreground">
                  {CLIENT_BOOKINGS[0].serviceName}
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {formatBookingDate(CLIENT_BOOKINGS[0].date, locale)}
                <br />
                {CLIENT_BOOKINGS[0].time}
              </div>
            </Link>
          </section>
        ) : null}

        {/* Categories carousel — 2 rows, horizontal scroll */}
        <section>
          <h2 className="mb-4 text-xl font-medium tracking-tight">Categories</h2>
          <div className="-mr-4 overflow-x-auto">
            <div className="grid w-max grid-flow-col grid-rows-2 gap-3 pb-1 pr-4 [grid-auto-columns:42%] sm:[grid-auto-columns:30%] lg:[grid-auto-columns:22%]">
              {CATEGORIES.map((c) => (
                <CategoryBox key={c.id} category={c} />
              ))}
            </div>
          </div>
        </section>

        {/* Services near you */}
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-medium tracking-tight">Near you</h2>
            <Link href="/discover" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              See on map
            </Link>
          </div>
          <div className="space-y-3">
            {nearYou.map((s) => (
              <StudioRow key={s.id} studio={s} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function TagChip({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors',
        active ? 'bg-foreground text-background' : 'bg-card text-foreground/80 ring-1 ring-border',
      )}
    >
      {label}
    </Link>
  );
}

function CategoryBox({ category }: { category: Category }) {
  return (
    <Link
      href={`/discover?category=${category.id}`}
      className="group relative aspect-[5/4] overflow-hidden rounded-3xl ring-1 ring-border"
    >
      <img
        src={img.card(`cat-${category.id}`)}
        alt=""
        className="absolute inset-0 size-full object-cover transition-transform group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(150deg, ${category.tint}55 0%, rgba(0,0,0,0.55) 100%)` }}
        aria-hidden
      />
      <div className="absolute inset-0 flex items-end p-3">
        <div className="text-base font-medium tracking-tight text-white">{category.name}</div>
      </div>
    </Link>
  );
}

function StudioRow({ studio }: { studio: Studio }) {
  return (
    <Link
      href={`/discover?category=${studio.categoryId}&focus=${studio.id}`}
      className="flex items-center gap-3 rounded-3xl bg-card p-3 ring-1 ring-border transition-transform hover:-translate-y-0.5"
    >
      <img
        src={img.square(studio.heroSeed)}
        alt=""
        className="size-20 shrink-0 rounded-2xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{studio.name}</div>
        <div className="truncate text-sm text-muted-foreground">{studio.tagline}</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="size-3 fill-current text-accent" /> {studio.rating}
          </span>
          <span aria-hidden>·</span>
          <span>{studio.distanceKm === 0 ? 'Mobile' : `${studio.distanceKm} km`}</span>
          <span aria-hidden>·</span>
          <span>{formatLei(studio.priceFromLei)}+</span>
        </div>
      </div>
    </Link>
  );
}
