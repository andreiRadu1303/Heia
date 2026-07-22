/**
 * StudioSite — the pure renderer for an expert's mini-site.
 *
 * Give it a `Studio` (content) and a `SiteConfig` (layout + theme) and it
 * draws the page. No data fetching, no hooks — so it works in both the
 * builder's live preview and, later, the public server-rendered page.
 *
 * Theming is entirely CSS-variable driven (see `themeVars`), so adding
 * palettes or styles never touches this file.
 */

import { MapPin, Star, Clock, ArrowRight, Quote } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import {
  img,
  formatLei,
  categoryById,
  type Studio,
} from '@/lib/app-mock-data';
import {
  themeVars,
  STYLE_PRESETS,
  type SiteConfig,
  type SiteSection,
} from '@/lib/site-config';
import { cn } from '@/lib/utils';

export function StudioSite({
  studio,
  config,
  locale,
}: {
  studio: Studio;
  config: SiteConfig;
  locale: string;
}) {
  const preset = STYLE_PRESETS[config.theme.style];
  const ctx = { studio, locale, preset };

  return (
    <div
      style={themeVars(config.theme)}
      className="bg-[var(--site-bg)] text-[color:var(--site-fg)] [font-family:var(--site-body-font)]"
    >
      {config.sections
        .filter((s) => s.enabled)
        .map((s) => (
          <Section key={s.key} section={s} ctx={ctx} />
        ))}
    </div>
  );
}

type Ctx = {
  studio: Studio;
  locale: string;
  preset: (typeof STYLE_PRESETS)[keyof typeof STYLE_PRESETS];
};

function Section({ section, ctx }: { section: SiteSection; ctx: Ctx }) {
  switch (section.type) {
    case 'hero':
      return <Hero variant={section.variant} ctx={ctx} />;
    case 'about':
      return <About ctx={ctx} />;
    case 'services':
      return <Services variant={section.variant} ctx={ctx} />;
    case 'gallery':
      return <Gallery variant={section.variant} ctx={ctx} />;
    case 'reviews':
      return <Reviews ctx={ctx} />;
    case 'hours':
      return <Hours ctx={ctx} />;
    case 'cta':
      return <Cta ctx={ctx} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

function Display({
  ctx,
  className,
  children,
}: {
  ctx: Ctx;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      style={{ fontFamily: 'var(--site-display-font)' }}
      className={cn(ctx.preset.headingClass, className)}
    >
      {children}
    </h2>
  );
}

function Eyebrow({ ctx, children }: { ctx: Ctx; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'text-[11px] text-[color:var(--site-accent)]',
        ctx.preset.eyebrowClass,
      )}
    >
      {children}
    </div>
  );
}

function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('px-6 py-[var(--site-section-y)] sm:px-10', className)}>
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero({ variant, ctx }: { variant: string; ctx: Ctx }) {
  const { studio } = ctx;
  const category = categoryById(studio.categoryId);

  if (variant === 'minimal') {
    return (
      <section className="px-6 py-[var(--site-section-y)] sm:px-10">
        <div className="mx-auto w-full max-w-3xl">
          <Eyebrow ctx={ctx}>{category?.name}</Eyebrow>
          <Display ctx={ctx} className="mt-4 text-5xl leading-[1.02] sm:text-7xl">
            {studio.name}
          </Display>
          <p className="mt-5 max-w-xl text-lg text-[color:var(--site-fg-muted)]">
            {studio.tagline}
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-[color:var(--site-fg-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-4 fill-[var(--site-accent)] text-[color:var(--site-accent)]" />
              {studio.rating.toFixed(1)} · {studio.reviewCount}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> {studio.city}
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section className="grid sm:grid-cols-2">
        <div
          className="min-h-[280px] bg-cover bg-center sm:min-h-[520px]"
          style={{ backgroundImage: `url('${img.hero(studio.heroSeed)}')` }}
          aria-hidden
        />
        <div className="flex flex-col justify-center bg-[var(--site-surface)] px-6 py-[var(--site-section-y)] sm:px-10">
          <Eyebrow ctx={ctx}>{category?.name}</Eyebrow>
          <Display ctx={ctx} className="mt-4 text-4xl leading-[1.05] sm:text-5xl">
            {studio.name}
          </Display>
          <p className="mt-4 text-base text-[color:var(--site-fg-muted)]">{studio.tagline}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-[color:var(--site-fg-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-4 fill-[var(--site-accent)] text-[color:var(--site-accent)]" />
              {studio.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> {studio.city}
            </span>
          </div>
        </div>
      </section>
    );
  }

  // variant === 'photo' (default)
  return (
    <section
      className="relative flex min-h-[70vh] items-end bg-cover bg-center"
      style={{ backgroundImage: `url('${img.hero(studio.heroSeed)}')` }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--site-bg) 4%, color-mix(in srgb, var(--site-bg) 30%, transparent) 45%, transparent 80%)',
        }}
        aria-hidden
      />
      <div className="relative w-full px-6 pb-[var(--site-section-y)] sm:px-10">
        <div className="mx-auto w-full max-w-3xl">
          <Eyebrow ctx={ctx}>{category?.name}</Eyebrow>
          <Display ctx={ctx} className="mt-3 text-5xl leading-[1.02] sm:text-7xl">
            {studio.name}
          </Display>
          <p className="mt-4 max-w-xl text-lg text-[color:var(--site-fg-muted)]">
            {studio.tagline}
          </p>
          <div className="mt-5 flex items-center gap-4 text-sm text-[color:var(--site-fg-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-4 fill-[var(--site-accent)] text-[color:var(--site-accent)]" />
              {studio.rating.toFixed(1)} · {studio.reviewCount}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> {studio.city}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

function About({ ctx }: { ctx: Ctx }) {
  const { studio } = ctx;
  return (
    <Shell>
      <Eyebrow ctx={ctx}>About</Eyebrow>
      <p className="mt-4 text-xl leading-relaxed sm:text-2xl">{studio.bio}</p>
      {studio.knownFor.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-[var(--site-gap)]">
          {studio.knownFor.map((tag) => (
            <span
              key={tag}
              className="rounded-[var(--site-radius)] border border-[color:var(--site-border)] bg-[var(--site-surface)] px-3 py-1.5 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Shell>
  );
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

function Services({ variant, ctx }: { variant: string; ctx: Ctx }) {
  const { studio } = ctx;

  return (
    <Shell className="bg-[var(--site-surface)]">
      <Eyebrow ctx={ctx}>Services</Eyebrow>
      <Display ctx={ctx} className="mt-3 text-3xl sm:text-4xl">
        What I offer
      </Display>

      {variant === 'cards' ? (
        <div className="mt-8 grid gap-[var(--site-gap)] sm:grid-cols-2">
          {studio.services.map((s) => (
            <div
              key={s.id}
              className="rounded-[var(--site-radius)] border border-[color:var(--site-border)] bg-[var(--site-bg)] p-5"
            >
              <div className="font-medium">{s.name}</div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-[color:var(--site-fg-muted)]">
                <Clock className="size-3.5" /> {s.durationMin} min
              </div>
              <div className="mt-4 text-lg font-semibold text-[color:var(--site-accent)]">
                {formatLei(s.priceLei)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 divide-y divide-[color:var(--site-border)]">
          {studio.services.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-sm text-[color:var(--site-fg-muted)]">
                  <Clock className="size-3.5" /> {s.durationMin} min
                </div>
              </div>
              <div className="shrink-0 text-lg font-semibold text-[color:var(--site-accent)]">
                {formatLei(s.priceLei)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

function Gallery({ variant, ctx }: { variant: string; ctx: Ctx }) {
  const { studio } = ctx;
  if (studio.gallerySeeds.length === 0) return null;

  if (variant === 'strip') {
    return (
      <section className="py-[var(--site-section-y)]">
        <div className="mx-auto mb-6 w-full max-w-3xl px-6 sm:px-10">
          <Eyebrow ctx={ctx}>Portfolio</Eyebrow>
        </div>
        <div className="flex snap-x gap-[var(--site-gap)] overflow-x-auto px-6 pb-2 sm:px-10">
          {studio.gallerySeeds.map((seed) => (
            <img
              key={seed}
              src={img.hero(seed)}
              alt=""
              className="h-72 w-56 shrink-0 snap-start rounded-[var(--site-radius)] object-cover sm:h-96 sm:w-72"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <Shell>
      <Eyebrow ctx={ctx}>Portfolio</Eyebrow>
      <div className="mt-6 grid grid-cols-2 gap-[var(--site-gap)] sm:grid-cols-3">
        {studio.gallerySeeds.map((seed) => (
          <img
            key={seed}
            src={img.square(seed)}
            alt=""
            className="aspect-square w-full rounded-[var(--site-radius)] object-cover"
          />
        ))}
      </div>
    </Shell>
  );
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

function Reviews({ ctx }: { ctx: Ctx }) {
  const { studio } = ctx;
  const featured = studio.reviews.slice(0, 2);

  return (
    <Shell className="bg-[var(--site-surface)]">
      <Eyebrow ctx={ctx}>Reviews</Eyebrow>
      <div className="mt-4 flex items-baseline gap-3">
        <span
          style={{ fontFamily: 'var(--site-display-font)' }}
          className={cn('text-5xl', ctx.preset.headingClass)}
        >
          {studio.rating.toFixed(1)}
        </span>
        <span className="text-[color:var(--site-fg-muted)]">
          {studio.reviewCount} reviews
        </span>
      </div>

      {featured.length > 0 ? (
        <div className="mt-8 grid gap-[var(--site-gap)] sm:grid-cols-2">
          {featured.map((r) => (
            <figure
              key={r.id}
              className="rounded-[var(--site-radius)] border border-[color:var(--site-border)] bg-[var(--site-bg)] p-5"
            >
              <Quote className="size-5 text-[color:var(--site-accent)]" />
              <blockquote className="mt-3 leading-relaxed">{r.body}</blockquote>
              <figcaption className="mt-4 text-sm text-[color:var(--site-fg-muted)]">
                {r.author} · {r.ago}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </Shell>
  );
}

// ---------------------------------------------------------------------------
// Hours (static placeholder until availability data lands)
// ---------------------------------------------------------------------------

const SAMPLE_HOURS: [string, string][] = [
  ['Mon–Fri', '09:00 – 19:00'],
  ['Sat', '10:00 – 16:00'],
  ['Sun', 'Closed'],
];

function Hours({ ctx }: { ctx: Ctx }) {
  return (
    <Shell>
      <Eyebrow ctx={ctx}>Hours</Eyebrow>
      <dl className="mt-6 divide-y divide-[color:var(--site-border)]">
        {SAMPLE_HOURS.map(([day, time]) => (
          <div key={day} className="flex items-center justify-between py-3">
            <dt className="font-medium">{day}</dt>
            <dd className="text-[color:var(--site-fg-muted)]">{time}</dd>
          </div>
        ))}
      </dl>
    </Shell>
  );
}

// ---------------------------------------------------------------------------
// Booking CTA
// ---------------------------------------------------------------------------

function Cta({ ctx }: { ctx: Ctx }) {
  const { studio, locale } = ctx;
  return (
    <Shell>
      <div className="rounded-[var(--site-radius)] bg-[var(--site-accent)] px-8 py-[var(--site-section-y)] text-center text-[color:var(--site-accent-fg)]">
        <Display ctx={ctx} className="text-3xl sm:text-4xl">
          Ready when you are
        </Display>
        <p className="mx-auto mt-3 max-w-md opacity-90">
          Book {studio.name} in a few taps — pick a service and a time.
        </p>
        <Link
          href={`/studio/${studio.id}/book`}
          locale={locale}
          className="mt-6 inline-flex items-center gap-2 rounded-[var(--site-radius)] bg-[var(--site-bg)] px-6 py-3 font-medium text-[color:var(--site-fg)]"
        >
          Book now
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </Shell>
  );
}
