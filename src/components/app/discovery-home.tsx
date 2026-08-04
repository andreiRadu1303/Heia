'use client';

import * as React from 'react';
import { Search, SlidersHorizontal, X, Star, MapPin } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  CATEGORIES,
  STUDIOS,
  CLIENT_BOOKINGS,
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

export function DiscoveryHome({
  firstName,
  initial,
  locale,
}: {
  firstName: string;
  initial: string;
  locale: string;
}) {
  const [tag, setTag] = React.useState<string>('all');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [price, setPrice] = React.useState('any');
  const [rating, setRating] = React.useState('any');
  const [distance, setDistance] = React.useState('any');

  const activeFilterCount = [price, rating, distance].filter((v) => v !== 'any').length;

  const filtered = React.useMemo(() => {
    return STUDIOS.filter((s) => {
      if (tag !== 'all' && s.categoryId !== tag) return false;
      if (price === 'lt120' && !(s.priceFromLei < 120)) return false;
      if (price === '120-300' && !(s.priceFromLei >= 120 && s.priceFromLei <= 300)) return false;
      if (price === 'gt300' && !(s.priceFromLei > 300)) return false;
      if (rating !== 'any' && s.rating < Number(rating)) return false;
      if (distance !== 'any' && !(s.distanceKm <= Number(distance))) return false;
      return true;
    });
  }, [tag, price, rating, distance]);

  const nearTitle = tag === 'all' ? 'Near you' : `${categoryById(tag)?.name} near you`;

  return (
    <div className="min-h-dvh pb-16">
      {/* Sticky top */}
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
          {filtered.length === 0 ? (
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

      {searchOpen ? <SearchOverlay onClose={() => setSearchOpen(false)} /> : null}
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

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? STUDIOS.filter(
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
                <img
                  src={img.square(s.heroSeed)}
                  alt=""
                  className="size-14 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.name}</div>
                  <div className="truncate text-sm text-muted-foreground">{s.tagline}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {categoryById(s.categoryId)?.name} · ★ {s.rating}
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
