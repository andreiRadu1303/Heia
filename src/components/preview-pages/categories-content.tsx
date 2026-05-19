import { Search, Bell, Heart, Star, Home, CalendarDays, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AESTHETICS,
  CATEGORIES,
  FEATURED_ARTISTS,
  type DisplayFont,
} from '@/lib/preview-mock-data';

/**
 * Mobile-native categories page.
 *
 * Design notes:
 * - Edge-to-edge layout; the centered `container` only wraps text blocks.
 * - One big editorial hero at the top, not a "dashboard" of small modules.
 * - Image-led cards. Text is supporting cast.
 * - Single primary action per section. No competing chrome.
 * - Bottom tab bar on mobile; minimal top bar (no greeting text up there).
 */
export function CategoriesContent({ displayFont = 'display' }: { displayFont?: DisplayFont }) {
  const display = displayFont === 'display' ? 'font-display' : 'font-sans';
  const featured = FEATURED_ARTISTS[0];

  return (
    <div className="pb-28">
      {/* Minimal top bar — just identity + 2 affordances */}
      <header className="flex items-center justify-between gap-3 px-5 pt-4 sm:px-8">
        <button
          type="button"
          aria-label="Profile"
          className="size-10 rounded-full bg-accent/30 ring-1 ring-border"
        />
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            className="grid size-10 place-items-center rounded-full text-foreground/70 hover:bg-secondary/60"
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid size-10 place-items-center rounded-full text-foreground/70 hover:bg-secondary/60"
          >
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" aria-hidden />
          </button>
        </div>
      </header>

      {/* Hero greeting — content area, not chrome */}
      <section className="px-5 pt-10 pb-2 sm:px-8 sm:pt-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Bună dimineața, Alexandra
        </div>
        <h1
          className={cn(
            'mt-3 text-4xl leading-[1.04] tracking-tight sm:text-5xl md:text-6xl',
            display,
            displayFont === 'display' ? 'font-medium' : 'font-semibold',
          )}
        >
          What feels right
          <br />
          <em className={cn(displayFont === 'display' ? 'italic' : 'not-italic font-normal')}>today</em>?
        </h1>
      </section>

      {/* Big tappable search — hero of the page */}
      <section className="px-5 pt-8 sm:px-8">
        <button
          type="button"
          className="flex h-14 w-full items-center gap-3 rounded-full border border-border bg-card px-5 text-left text-muted-foreground transition-colors hover:bg-secondary/40"
        >
          <Search className="size-5 shrink-0" />
          <span className="truncate">Try “balayage”, “bridal makeup”…</span>
        </button>
      </section>

      {/* Aesthetic chips — your filter context */}
      <section className="pt-8">
        <div className="px-5 sm:px-8">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Your aesthetic
          </div>
        </div>
        <div className="mt-3 -mr-5 overflow-x-auto sm:-mr-8">
          <div className="flex w-max gap-2.5 px-5 pb-1 sm:px-8">
            {AESTHETICS.slice(0, 6).map((a, i) => (
              <span
                key={a.id}
                className={cn(
                  'whitespace-nowrap rounded-full px-5 py-2.5 text-sm transition-colors',
                  i === 0
                    ? 'bg-foreground text-background'
                    : 'border border-border bg-card text-foreground/80',
                )}
              >
                {a.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — 2-up TALL cards, image-led, edge-to-edge */}
      <section className="pt-14">
        <div className="px-5 sm:px-8">
          <div className="flex items-baseline justify-between">
            <h2 className={cn('text-2xl tracking-tight sm:text-3xl', display)}>Browse</h2>
            <button className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
              all 6
            </button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 px-5 sm:grid-cols-3 sm:gap-4 sm:px-8 md:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl text-left ring-1 ring-border"
            >
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(160deg, ${cat.color} 0%, ${cat.dark} 100%)` }}
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                aria-hidden
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                  {cat.count} artists
                </div>
                <div className={cn('text-xl font-medium tracking-tight text-white sm:text-2xl', display)}>
                  {cat.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured — ONE big editorial card, not a horizontal scroll */}
      <section className="pt-16">
        <div className="px-5 sm:px-8">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Featured this week
          </div>
          <h2 className={cn('mt-2 text-2xl tracking-tight sm:text-3xl', display)}>{featured.name}</h2>
        </div>
        <div className="mt-5 px-5 sm:px-8">
          <article className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-[4/5] sm:aspect-[16/10]">
              <div className="absolute inset-0" style={{ background: featured.color }} aria-hidden />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent"
                aria-hidden
              />
              <button
                type="button"
                aria-label="Save"
                className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/95 text-black/70"
              >
                <Heart className="size-4" />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-black/80">
                  <Star className="size-3 fill-current" /> {featured.rating.toFixed(2)} · {featured.city}
                </div>
                <div
                  className={cn(
                    'mt-3 text-2xl leading-tight tracking-tight text-white sm:text-3xl',
                    display,
                  )}
                >
                  {featured.specialty}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">
                  Known for · {featured.knownFor}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Recently viewed — small chip row, not a list */}
      <section className="pt-16">
        <div className="px-5 sm:px-8">
          <div className="flex items-baseline justify-between">
            <h2 className={cn('text-base font-medium tracking-tight', display)}>Recently viewed</h2>
            <button className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
              clear
            </button>
          </div>
        </div>
        <div className="mt-4 -mr-5 overflow-x-auto sm:-mr-8">
          <div className="flex w-max gap-4 px-5 pb-1 sm:px-8">
            {FEATURED_ARTISTS.map((a) => (
              <button key={a.id} type="button" className="flex w-20 shrink-0 flex-col items-center gap-2">
                <div
                  className="size-16 rounded-full ring-1 ring-border"
                  style={{ background: a.color }}
                  aria-hidden
                />
                <div className="truncate text-center text-xs font-medium">{a.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom tab bar — sticky, mobile only */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
        aria-label="Primary"
      >
        <div className="grid grid-cols-4">
          {[
            { icon: Home, label: 'Home', active: true },
            { icon: Search, label: 'Search' },
            { icon: CalendarDays, label: 'Bookings' },
            { icon: MessageCircle, label: 'Messages' },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              type="button"
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 py-3 text-[10px] font-medium tracking-[0.14em]',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <Icon className={cn('size-5', active && 'stroke-[2.4]')} />
              <span className="uppercase">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
