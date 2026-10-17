'use client';

import * as React from 'react';
import { Search, SlidersHorizontal, X, Star, MapPin, ChevronDown, Check } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { CITIES, normalizeCityName, type City } from '@/lib/cities';
import { ClientNav } from '@/components/app/client-nav';
import { setCityAction } from '@/app/[locale]/(app)/dashboard/actions';
import {
  CATEGORIES,
  categoryById,
  img,
  formatLei,
  formatBookingDate,
  type Category,
  type Studio,
} from '@/lib/app-mock-data';

const PRICE_OPTIONS = [
  { id: 'any', label: 'Any price' },
  { id: 'lt120', label: 'Under 120 lei' },
  { id: '120-300', label: '120–300 lei' },
  { id: 'gt300', label: '300 lei+' },
];
const RATING_OPTIONS = [
  { id: 'any', label: 'Any' },
  { id: '4', label: '4.0+' },
  { id: '4.5', label: '4.5+' },
  { id: '4.8', label: '4.8+' },
];
const DISTANCE_OPTIONS = [
  { id: 'any', label: 'Any' },
  { id: '1', label: '1 km' },
  { id: '3', label: '3 km' },
  { id: '5', label: '5 km' },
];

/** The client's next upcoming visit, read from `bookings` on the server. */
export interface NextBooking {
  id: string;
  studioSlug: string | null;
  studioName: string;
  serviceName: string;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:MM'
  status: 'pending' | 'confirmed';
  imageUrl: string | null;
  heroSeed: string | null;
}

export function DiscoveryHome({
  firstName,
  initial,
  locale,
  city: initialCity,
  studios,
  nextBooking,
}: {
  firstName: string;
  initial: string;
  locale: string;
  city: City;
  /** Published studios from Supabase, with distance from the chosen city. */
  studios: Studio[];
  nextBooking: NextBooking | null;
}) {
  const [tag, setTag] = React.useState<string>('all');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [cityOpen, setCityOpen] = React.useState(false);
  const [city, setCity] = React.useState<City>(initialCity);
  const [cityError, setCityError] = React.useState<string | null>(null);
  const [, startTransition] = React.useTransition();

  // Optimistic: switch the UI at once, persist in the background, roll back
  // (and say so) if the save fails.
  function chooseCity(next: City) {
    const previous = city;
    setCity(next);
    setCityError(null);
    setCityOpen(false);
    startTransition(async () => {
      const res = await setCityAction(locale, next.id);
      if (!res.ok) {
        setCity(previous);
        setCityError(res.error ?? 'Could not save city.');
      }
    });
  }
  const [price, setPrice] = React.useState('any');
  const [rating, setRating] = React.useState('any');
  const [distance, setDistance] = React.useState('any');

  const activeFilterCount = [price, rating, distance].filter((v) => v !== 'any').length;

  const filtered = React.useMemo(() => {
    return studios.filter((s) => {
      if (!sameCity(s.city, city.name)) return false;
      if (tag !== 'all' && s.categoryId !== tag) return false;
      if (price === 'lt120' && !(s.priceFromLei < 120)) return false;
      if (price === '120-300' && !(s.priceFromLei >= 120 && s.priceFromLei <= 300)) return false;
      if (price === 'gt300' && !(s.priceFromLei > 300)) return false;
      if (rating !== 'any' && s.rating < Number(rating)) return false;
      if (distance !== 'any' && !(s.distanceKm <= Number(distance))) return false;
      return true;
    });
  }, [studios, city, tag, price, rating, distance]);

  const hasStudiosInCity = studios.some((s) => sameCity(s.city, city.name));
  const nearTitle =
    tag === 'all' ? `In ${city.name}` : `${categoryById(tag)?.name} in ${city.name}`;

  return (
    <div className="min-h-dvh pb-24">
      {/* Sticky top */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="container flex items-center gap-3 pt-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">Hi, {firstName}</div>
            <button
              type="button"
              onClick={() => setCityOpen(true)}
              aria-label={`Change city (currently ${city.name})`}
              className="-ml-1 flex items-center gap-1 rounded-full px-1 text-sm font-medium hover:bg-secondary/60"
            >
              <MapPin className="size-3.5 text-accent" />
              {city.name}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
            {cityError ? (
              <div role="alert" className="mt-1 text-xs text-destructive">
                {cityError}
              </div>
            ) : null}
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
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-12 flex-1 items-center gap-3 rounded-full border border-border bg-card px-5 text-left text-muted-foreground"
            >
              <Search className="size-4 shrink-0" />
              <span className="truncate text-sm">Search treatments, studios…</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              aria-label="Filters"
              className="relative grid size-12 shrink-0 place-items-center rounded-full bg-foreground text-background"
            >
              <SlidersHorizontal className="size-5" />
              {activeFilterCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground ring-2 ring-background">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>

          {/* Tag chips — live in-page filter */}
          <div className="-mr-4 mt-3 overflow-x-auto">
            <div className="flex w-max gap-2 pb-1">
              <TagChip label="All" active={tag === 'all'} onClick={() => setTag('all')} />
              {CATEGORIES.map((c) => (
                <TagChip
                  key={c.id}
                  label={c.name}
                  active={tag === c.id}
                  onClick={() => setTag(c.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container space-y-10 pt-5">
        {/* Upcoming */}
        {nextBooking ? (
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
              href={nextBooking.studioSlug ? `/studio/${nextBooking.studioSlug}` : '/account'}
              className="flex items-center gap-3 rounded-3xl bg-card p-3 ring-1 ring-border"
            >
              {nextBooking.imageUrl || nextBooking.heroSeed ? (
                <img
                  src={nextBooking.imageUrl ?? img.square(nextBooking.heroSeed as string)}
                  alt=""
                  className="size-14 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div
                  className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent/30 to-secondary text-lg font-medium text-foreground/60"
                  aria-hidden
                >
                  {nextBooking.studioName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{nextBooking.studioName}</div>
                <div className="truncate text-sm text-muted-foreground">
                  {nextBooking.serviceName}
                  {nextBooking.status === 'pending' ? ' · awaiting confirmation' : ''}
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {formatBookingDate(nextBooking.date, locale)}
                <br />
                {nextBooking.time}
              </div>
            </Link>
          </section>
        ) : null}

        {/* Categories carousel */}
        <section>
          <h2 className="mb-4 text-xl font-medium tracking-tight">Categories</h2>
          <div className="overflow-x-auto pb-2">
            <div
              className="grid w-max grid-flow-col grid-rows-2 gap-3"
              style={{ gridAutoColumns: '11rem' }}
            >
              {CATEGORIES.map((c) => (
                <CategoryBox key={c.id} category={c} />
              ))}
            </div>
          </div>
        </section>

        {/* Near you (filtered) */}
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-medium tracking-tight">{nearTitle}</h2>
            <Link href="/discover" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              See on map
            </Link>
          </div>
          {!hasStudiosInCity ? (
            <div className="rounded-3xl bg-card p-6 text-center ring-1 ring-border">
              <p className="text-sm text-muted-foreground">
                No studios in {city.name} yet — we&apos;re expanding city by city.
              </p>
              <button
                type="button"
                onClick={() => setCityOpen(true)}
                className="mt-3 text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Choose another city
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl bg-card p-6 text-center ring-1 ring-border">
              <p className="text-sm text-muted-foreground">No matches with these filters.</p>
              <button
                type="button"
                onClick={() => {
                  setTag('all');
                  setPrice('any');
                  setRating('any');
                  setDistance('any');
                }}
                className="mt-3 text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Clear all
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((s) => (
                <StudioRow key={s.id} studio={s} />
              ))}
            </div>
          )}
        </section>
      </main>

      {cityOpen ? (
        <CitySheet current={city} onChoose={chooseCity} onClose={() => setCityOpen(false)} />
      ) : null}
      {searchOpen ? (
        <SearchOverlay studios={studios} onClose={() => setSearchOpen(false)} />
      ) : null}
      {filterOpen ? (
        <FilterSheet
          price={price}
          rating={rating}
          distance={distance}
          setPrice={setPrice}
          setRating={setRating}
          setDistance={setDistance}
          resultCount={filtered.length}
          onClose={() => setFilterOpen(false)}
          onReset={() => {
            setPrice('any');
            setRating('any');
            setDistance('any');
          }}
        />
      ) : null}

      <ClientNav />
    </div>
  );
}

function TagChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors',
        active ? 'bg-foreground text-background' : 'bg-card text-foreground/80 ring-1 ring-border',
      )}
    >
      {label}
    </button>
  );
}

function CategoryBox({ category }: { category: Category }) {
  return (
    <Link
      href={`/discover?category=${category.id}`}
      className="group relative block h-32 overflow-hidden rounded-3xl ring-1 ring-border"
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

/** Uploaded cover → seeded placeholder → gradient initial. */
function StudioThumb({ studio, className }: { studio: Studio; className: string }) {
  const src = studio.heroUrl || (studio.heroSeed ? img.square(studio.heroSeed) : null);
  return src ? (
    <img src={src} alt="" className={cn('shrink-0 rounded-2xl object-cover', className)} />
  ) : (
    <div
      className={cn(
        'grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent/30 to-secondary text-lg font-medium text-foreground/60',
        className,
      )}
      aria-hidden
    >
      {studio.name.charAt(0).toUpperCase()}
    </div>
  );
}

function StudioRow({ studio }: { studio: Studio }) {
  return (
    <Link
      href={`/studio/${studio.id}`}
      className="flex items-center gap-3 rounded-3xl bg-card p-3 ring-1 ring-border transition-transform hover:-translate-y-0.5"
    >
      <StudioThumb studio={studio} className="size-20" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{studio.name}</div>
        <div className="truncate text-sm text-muted-foreground">{studio.tagline}</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="size-3 fill-current text-accent" />{' '}
            {studio.rating > 0 ? studio.rating : 'New'}
          </span>
          <span aria-hidden>·</span>
          <span>{studio.distanceKm} km</span>
          {studio.priceFromLei > 0 ? (
            <>
              <span aria-hidden>·</span>
              <span>{formatLei(studio.priceFromLei)}+</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

/**
 * Studios store the city as free text typed by the provider; compare it to
 * the picker's name ignoring case, accents and surrounding spaces so
 * "oradea" or "Bucuresti" still match.
 */
function sameCity(a: string, b: string): boolean {
  return normalizeCityName(a) === normalizeCityName(b);
}

function SearchOverlay({ studios, onClose }: { studios: Studio[]; onClose: () => void }) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? studios.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          (categoryById(s.categoryId)?.name.toLowerCase().includes(q) ?? false) ||
          s.knownFor.some((k) => k.toLowerCase().includes(q)),
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="container flex items-center gap-2 pt-4">
        <div className="flex h-12 flex-1 items-center gap-3 rounded-full border border-border bg-card px-5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search treatments, studios, styles…"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <div className="container flex-1 overflow-y-auto pt-6">
        {!q ? (
          <div>
            <div className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Browse categories
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/discover?category=${c.id}`}
                  onClick={onClose}
                  className="rounded-full bg-card px-4 py-2 text-sm ring-1 ring-border"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="text-sm text-muted-foreground">No results for “{query}”.</p>
        ) : (
          <div className="space-y-3">
            {results.map((s) => (
              <Link
                key={s.id}
                href={`/studio/${s.id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-3xl bg-card p-3 ring-1 ring-border"
              >
                <StudioThumb studio={s} className="size-14" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.name}</div>
                  <div className="truncate text-sm text-muted-foreground">{s.tagline}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {categoryById(s.categoryId)?.name} · ★ {s.rating > 0 ? s.rating : 'New'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CitySheet({
  current,
  onChoose,
  onClose,
}: {
  current: City;
  onChoose: (city: City) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close city picker"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-background pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-medium tracking-tight">Choose your city</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>

        <ul className="px-3 py-3" role="listbox" aria-label="City">
          {CITIES.map((c) => {
            const active = c.id === current.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => onChoose(c)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-base',
                    active ? 'bg-foreground text-background' : 'hover:bg-secondary/60',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className={cn('size-4', active ? 'text-background' : 'text-accent')} />
                    {c.name}
                  </span>
                  {active ? <Check className="size-4" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function FilterSheet({
  price,
  rating,
  distance,
  setPrice,
  setRating,
  setDistance,
  resultCount,
  onClose,
  onReset,
}: {
  price: string;
  rating: string;
  distance: string;
  setPrice: (v: string) => void;
  setRating: (v: string) => void;
  setDistance: (v: string) => void;
  resultCount: number;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-background pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-medium tracking-tight">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">
          <FilterGroup label="Price" options={PRICE_OPTIONS} value={price} onChange={setPrice} />
          <FilterGroup label="Rating" options={RATING_OPTIONS} value={rating} onChange={setRating} />
          <FilterGroup label="Distance" options={DISTANCE_OPTIONS} value={distance} onChange={setDistance} />
        </div>

        <div className="sticky bottom-0 flex items-center gap-3 border-t border-border bg-background px-5 py-3">
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background"
          >
            Show {resultCount}{' '}
            {resultCount === 1 ? 'result' : 'results'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              'rounded-full px-4 py-2 text-sm transition-colors',
              value === o.id
                ? 'bg-foreground text-background'
                : 'bg-card text-foreground/80 ring-1 ring-border',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
