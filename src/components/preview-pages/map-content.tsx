import { Search, SlidersHorizontal, ChevronLeft, Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAP_RESULTS, type DisplayFont } from '@/lib/preview-mock-data';

/**
 * Mobile-native map page.
 *
 * Design notes:
 * - Full-bleed map fills the viewport (Uber / Google Maps / Airbnb pattern).
 * - Floating top: back chevron + search pill + filter button.
 * - Floating filter chips below the search pill, horizontal scroll.
 * - Bottom sheet at the bottom with a drag handle, peek state shows the
 *   highlighted result. The user would drag up to reveal the list (faked here).
 * - Desktop: returns to a split layout with a sidebar list.
 */
export function MapContent({ displayFont = 'display' }: { displayFont?: DisplayFont }) {
  const display = displayFont === 'display' ? 'font-display' : 'font-sans';
  const primary = MAP_RESULTS[0];

  return (
    <div className="relative h-[calc(100dvh-88px)] overflow-hidden lg:grid lg:h-[calc(100dvh-88px)] lg:grid-cols-[380px_1fr] lg:gap-0">
      {/* Desktop list (sidebar) */}
      <aside className="hidden lg:block lg:overflow-y-auto lg:border-r lg:border-border lg:bg-background">
        <div className="border-b border-border px-6 py-5">
          <h2 className={cn('text-xl tracking-tight', display)}>Near you</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {MAP_RESULTS.length} results · Soft Glam first
          </p>
        </div>
        <ul>
          {MAP_RESULTS.map((r, i) => (
            <ListCard key={r.id} result={r} display={display} highlighted={i === 0} />
          ))}
        </ul>
      </aside>

      {/* Map area (full-bleed on mobile, right column on desktop) */}
      <div className="relative h-full">
        <MapMockup />

        {/* Pins */}
        {MAP_RESULTS.map((r, i) => (
          <button
            key={r.id}
            type="button"
            className={cn('absolute -translate-x-1/2 -translate-y-full', i === 0 ? 'z-20' : 'z-10')}
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
            aria-label={r.name}
          >
            <div
              className={cn(
                'relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-lg ring-1',
                i === 0
                  ? 'bg-accent text-accent-foreground ring-accent-foreground/30'
                  : 'bg-background text-foreground ring-border',
              )}
            >
              {r.priceFrom}
            </div>
            <div
              className={cn(
                'mx-auto h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent',
                i === 0 ? 'border-t-accent' : 'border-t-background',
              )}
            />
          </button>
        ))}

        {/* Floating top: search pill + filter */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 pt-3 lg:pt-5">
          <div className="pointer-events-auto mx-3 flex items-center gap-2 lg:mx-5">
            <button
              type="button"
              aria-label="Back"
              className="grid size-11 place-items-center rounded-full bg-background text-foreground shadow-md ring-1 ring-border"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              className="flex h-11 flex-1 items-center gap-2.5 rounded-full bg-background pl-4 pr-4 text-left text-sm shadow-md ring-1 ring-border"
            >
              <Search className="size-4 text-muted-foreground" />
              <span className="truncate">Hair · Soft Glam · 3 km</span>
            </button>
            <button
              type="button"
              aria-label="Filters"
              className="grid size-11 place-items-center rounded-full bg-foreground text-background shadow-md"
            >
              <SlidersHorizontal className="size-5" />
            </button>
          </div>
          {/* Filter chip row */}
          <div className="pointer-events-auto mt-3 overflow-x-auto pb-1">
            <div className="flex w-max items-center gap-2 px-3 lg:px-5">
              {['Open now', 'Verified', 'Top rated', 'Under €60', 'Walking distance'].map((c, i) => (
                <span
                  key={c}
                  className={cn(
                    'whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs shadow-sm ring-1',
                    i === 1
                      ? 'bg-foreground text-background ring-foreground'
                      : 'bg-background/95 text-foreground/80 ring-border',
                  )}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom sheet — peek state */}
        <div className="absolute inset-x-0 bottom-0 z-30 lg:hidden">
          <div className="mx-auto max-w-md rounded-t-3xl border border-b-0 border-border bg-background pb-[env(safe-area-inset-bottom)] shadow-2xl">
            {/* Drag handle */}
            <div className="flex justify-center py-2.5">
              <div className="h-1 w-10 rounded-full bg-border" aria-hidden />
            </div>
            {/* Peek content */}
            <div className="px-4 pb-4">
              <div className="flex items-baseline justify-between">
                <h2 className={cn('text-base tracking-tight', display)}>
                  {MAP_RESULTS.length} results
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  swipe up for list
                </span>
              </div>
              <article className="mt-3 flex gap-3 rounded-2xl bg-secondary/40 p-3">
                <div
                  className="size-20 shrink-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--muted)) 100%)`,
                  }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className={cn('truncate text-base font-medium', display)}>{primary.name}</div>
                    <button
                      type="button"
                      aria-label="Save"
                      className="grid size-8 place-items-center rounded-full text-muted-foreground hover:text-foreground"
                    >
                      <Heart className="size-4" />
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">{primary.specialty}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3 fill-current text-accent" /> {primary.rating}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{primary.distance}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="font-medium">from {primary.priceFrom}</span>
                  </div>
                  <button
                    type="button"
                    className="mt-2 inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 text-xs font-medium text-background"
                  >
                    View profile →
                  </button>
                </div>
              </article>
              {/* Pagination dots — implies swipeable */}
              <div className="mt-3 flex justify-center gap-1.5">
                {MAP_RESULTS.slice(0, 6).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      i === 0 ? 'w-5 bg-foreground' : 'w-1.5 bg-border',
                    )}
                    aria-hidden
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListCard({
  result,
  display,
  highlighted,
}: {
  result: (typeof MAP_RESULTS)[number];
  display: string;
  highlighted: boolean;
}) {
  return (
    <li
      className={cn(
        'flex items-center gap-3 border-b border-border px-6 py-4',
        highlighted && 'bg-secondary/40',
      )}
    >
      <div
        className="size-14 shrink-0 rounded-xl"
        style={{ background: `linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--muted)) 100%)` }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className={cn('truncate text-sm font-medium', display)}>{result.name}</div>
          <div className="inline-flex items-center gap-1 text-xs">
            <Star className="size-3 fill-current text-accent" />
            {result.rating}
          </div>
        </div>
        <div className="truncate text-xs text-muted-foreground">{result.specialty}</div>
        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {result.distance} · from {result.priceFrom}
        </div>
      </div>
    </li>
  );
}

function MapMockup() {
  // Soft, map-like background with organic shapes instead of a grid.
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--muted)) 0%, hsl(var(--secondary)) 100%)',
        }}
      />
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Faux water blob */}
        <path
          d="M -10 80 Q 20 75 35 85 T 75 78 T 110 90 L 110 110 L -10 110 Z"
          fill="hsl(var(--accent))"
          opacity="0.18"
        />
        {/* Faux park blob */}
        <ellipse cx="20" cy="40" rx="14" ry="9" fill="hsl(var(--accent))" opacity="0.16" />
        {/* Faux park 2 */}
        <ellipse cx="78" cy="28" rx="9" ry="6" fill="hsl(var(--accent))" opacity="0.14" />
        {/* Curving roads */}
        <path
          d="M -5 55 Q 30 50 50 60 T 105 50"
          fill="none"
          stroke="hsl(var(--background))"
          strokeWidth="1.4"
          opacity="0.7"
        />
        <path
          d="M -5 30 Q 40 40 60 25 T 105 22"
          fill="none"
          stroke="hsl(var(--background))"
          strokeWidth="0.9"
          opacity="0.55"
        />
        <path
          d="M 42 -5 Q 40 30 50 60 T 55 105"
          fill="none"
          stroke="hsl(var(--background))"
          strokeWidth="1.2"
          opacity="0.65"
        />
        <path
          d="M 78 -5 Q 80 40 75 70 T 80 105"
          fill="none"
          stroke="hsl(var(--background))"
          strokeWidth="0.9"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
