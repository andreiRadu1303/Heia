import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, MapPin, CalendarCheck, Search, Star } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { CATEGORIES, STUDIOS, img, formatLei } from '@/lib/app-mock-data';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const featured = STUDIOS.slice(0, 4);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Soft blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-24 -top-24 size-80 rounded-full opacity-40 blur-3xl" style={{ background: 'hsl(var(--accent))' }} />
        <div className="absolute -right-20 top-72 size-72 rounded-full opacity-30 blur-3xl" style={{ background: 'hsl(var(--accent))' }} />
      </div>

      <div className="relative">
        <SiteHeader />

        <main>
          {/* Hero */}
          <section className="container flex flex-col items-start gap-6 py-14 sm:items-center sm:py-24 sm:text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-medium shadow-sm ring-1 ring-border">
              <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden />
              Selfcare, your way · România
            </div>
            <h1 className="max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Find your people for whatever selfcare means to you.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Hair, tattoo, massage, nails and more — discover specialists near you, see how they
              work, and book in a few taps. Calm, considered, no pressure.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="h-12 gap-2 px-6">
                <Link href="/services">
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <Link href="#how">How it works</Link>
              </Button>
            </div>
          </section>

          {/* Category strip */}
          <section className="pb-6">
            <div className="-mr-5 overflow-x-auto sm:mr-0">
              <div className="container flex w-max gap-2.5 sm:w-full sm:flex-wrap sm:justify-center">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.id}
                    href={`/discover?category=${c.id}`}
                    className="flex shrink-0 items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-border transition-transform hover:-translate-y-0.5"
                  >
                    <span aria-hidden>{c.emoji}</span>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how" className="scroll-mt-20">
            <CurvedDivider />
            <div className="bg-card/60 py-16">
              <div className="container">
                <h2 className="mb-10 text-center text-2xl font-medium tracking-tight sm:text-3xl">
                  Three taps to booked.
                </h2>
                <div className="grid gap-6 sm:grid-cols-3">
                  <Step
                    icon={<Search className="size-5" />}
                    n="01"
                    title="Choose a service"
                    body="Pick what you’re in the mood for — from a fresh cut to a deep-tissue massage."
                  />
                  <Step
                    icon={<MapPin className="size-5" />}
                    n="02"
                    title="Discover nearby"
                    body="See specialists on a map, browse their work, read real reviews."
                  />
                  <Step
                    icon={<CalendarCheck className="size-5" />}
                    n="03"
                    title="Book in seconds"
                    body="Pick a time, confirm, pay. One place — no chasing DMs."
                  />
                </div>
              </div>
            </div>
            <CurvedDivider flip />
          </section>

          {/* Featured studios */}
          <section className="container py-16">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">Featured this week</h2>
              <Link
                href="/services"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {featured.map((s) => (
                <Link
                  key={s.id}
                  href={`/studio/${s.id}`}
                  className="group overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border transition-transform hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={img.square(s.heroSeed)}
                      alt=""
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <div className="truncate text-sm font-medium">{s.name}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3 fill-current text-accent" /> {s.rating} ·{' '}
                      {formatLei(s.priceFromLei)}+
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Closing CTA */}
          <section className="container pb-20">
            <div className="overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-center text-primary-foreground sm:py-16">
              <h2 className="mx-auto max-w-xl text-2xl font-medium tracking-tight sm:text-3xl">
                Your time, your ritual. Whenever you need it.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm opacity-80">
                Join Heia and find the people who get your vibe.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-8 h-12 gap-2 px-6">
                <Link href="/services">
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}

function Step({
  icon,
  n,
  title,
  body,
}: {
  icon: React.ReactNode;
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="flex items-center gap-3">
        <div
          className="grid size-11 place-items-center rounded-full text-foreground"
          style={{ background: 'hsl(var(--accent) / 0.2)' }}
        >
          {icon}
        </div>
        <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">{n}</span>
      </div>
      <h3 className="mt-4 text-lg font-medium tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function CurvedDivider({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      className="block w-full"
      viewBox="0 0 400 48"
      preserveAspectRatio="none"
      aria-hidden
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path d="M 0 32 Q 100 4 200 24 T 400 32 L 400 48 L 0 48 Z" fill="hsl(var(--card) / 0.6)" />
    </svg>
  );
}
