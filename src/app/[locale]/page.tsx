import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, MapPin, CalendarCheck, Search, Star } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { img, formatLei } from '@/lib/app-mock-data';
import { getPublishedStudios } from '@/lib/discover-server';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Landing');

  const featured = await getPublishedStudios({ limit: 4 });

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <SiteHeader />

      <main>
        {/* =====================================================
            HERO — full-bleed editorial portrait + brand mark
            ===================================================== */}
        <section className="relative h-[88dvh] min-h-[640px] w-full overflow-hidden">
          {/* Photo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, hsl(var(--background) / 0.05) 0%, hsl(var(--background) / 0.35) 55%, hsl(var(--background)) 100%),
                url('/brand/heia-hero.jpg'),
                linear-gradient(135deg, hsl(30 14% 14%) 0%, hsl(0 35% 18%) 100%)
              `,
            }}
            aria-hidden
          />

          {/* Top kicker — pinned to top */}
          <div className="relative z-10 pt-6">
            <div className="container">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/50 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur-md ring-1 ring-foreground/15">
                <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden />
                {t('kicker')}
              </div>
            </div>
          </div>

          {/* Bottom block — brand line, headline, CTAs */}
          <div className="absolute inset-x-0 bottom-0 z-10 pb-14 sm:pb-20">
            <div className="container">
              <div
                className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent"
                style={{ textShadow: '0 1px 12px rgb(0 0 0 / 0.6)' }}
              >
                Heia
              </div>
              <h1
                className="mt-3 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl"
                style={{ textShadow: '0 2px 24px rgb(0 0 0 / 0.55)' }}
              >
                {t('heroTitle')}
              </h1>
              <p
                className="mt-5 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg"
                style={{ textShadow: '0 1px 16px rgb(0 0 0 / 0.5)' }}
              >
                {t('heroBody')}
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button asChild size="lg" className="h-12 gap-2 px-6">
                  <Link href="/services">
                    {t('getStarted')} <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-foreground/30 bg-background/30 px-6 text-foreground backdrop-blur-md hover:bg-background/50"
                >
                  <Link href="#how">{t('howItWorks')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            How it works
            ===================================================== */}
        <section id="how" className="scroll-mt-20 bg-card/40 py-20">
          <div className="container">
            <div className="mb-10 text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                {t('howItWorks')}
              </div>
              <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                {t('howTitle')}
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <Step
                icon={<Search className="size-5" />}
                n="01"
                title={t('step1Title')}
                body={t('step1Body')}
              />
              <Step
                icon={<MapPin className="size-5" />}
                n="02"
                title={t('step2Title')}
                body={t('step2Body')}
              />
              <Step
                icon={<CalendarCheck className="size-5" />}
                n="03"
                title={t('step3Title')}
                body={t('step3Body')}
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            Tools-of-the-craft (flatlay) — full-bleed image with copy on the side
            ===================================================== */}
        <section className="relative">
          <div className="grid lg:grid-cols-5">
            <div
              className="relative min-h-[60dvh] bg-cover bg-center lg:col-span-3"
              style={{
                backgroundImage: `
                  url('/brand/heia-flatlay.jpg'),
                  linear-gradient(135deg, hsl(0 45% 20%) 0%, hsl(30 14% 12%) 100%)
                `,
              }}
              aria-hidden
            />
            <div className="flex items-center bg-background py-16 lg:col-span-2 lg:py-24">
              <div className="container max-w-md">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                  {t('craftKicker')}
                </div>
                <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                  {t('craftTitle')}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {t('craftBody')}
                </p>
                <Button asChild size="lg" variant="secondary" className="mt-8 h-12 gap-2 px-6">
                  <Link href="/services">
                    {t('browseSpecialists')} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            For everyone — barber image, inclusivity copy
            ===================================================== */}
        <section className="relative">
          <div
            className="relative flex min-h-[78dvh] items-center bg-cover bg-center"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.35) 45%, hsl(var(--background) / 0) 100%),
                url('/brand/heia-barber.jpg'),
                linear-gradient(135deg, hsl(30 22% 12%) 0%, hsl(20 18% 16%) 100%)
              `,
            }}
          >
            <div className="container relative z-10">
              <div className="max-w-xl">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                  {t('everyoneKicker')}
                </div>
                <h2
                  className="mt-3 text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl"
                  style={{ textShadow: '0 2px 20px rgb(0 0 0 / 0.55)' }}
                >
                  {t('everyoneTitle')}
                </h2>
                <p
                  className="mt-5 text-base leading-relaxed text-foreground/90 sm:text-lg"
                  style={{ textShadow: '0 1px 16px rgb(0 0 0 / 0.5)' }}
                >
                  {t('everyoneBody')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            Featured studios
            ===================================================== */}
        <section className="container py-20">
          <div className="mb-8 flex items-baseline justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                {t('featuredKicker')}
              </div>
              <h2 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">
                {t('featuredTitle')}
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t('seeAll')}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featured.map((s) => (
              <Link
                key={s.id}
                href={`/studio/${s.id}`}
                className="group overflow-hidden rounded-3xl bg-card ring-1 ring-border transition-all hover:-translate-y-0.5 hover:ring-accent/50"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={s.heroUrl || img.square(s.heroSeed || s.id)}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
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

        {/* =====================================================
            Closing CTA
            ===================================================== */}
        <section className="container pb-24">
          <div
            className="overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:py-20"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at top, hsl(16 53% 32%) 0%, hsl(30 14% 9%) 70%)',
            }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
              Heia
            </div>
            <h2 className="mx-auto mt-3 max-w-xl text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {t('ctaTitle')}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-foreground/70">
              {t('ctaBody')}
            </p>
            <Button asChild size="lg" className="mt-8 h-12 gap-2 px-6">
              <Link href="/services">
                {t('getStarted')} <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
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
    <div className="rounded-3xl bg-card p-6 ring-1 ring-border">
      <div className="flex items-center gap-3">
        <div
          className="grid size-11 place-items-center rounded-full text-accent"
          style={{ background: 'hsl(var(--accent) / 0.15)' }}
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
