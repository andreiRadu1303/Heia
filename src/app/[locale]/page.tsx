import { getTranslations, setRequestLocale } from 'next-intl/server';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WaitlistForm } from '@/components/waitlist-form';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Landing');

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container flex flex-col items-start gap-5 py-12 sm:gap-8 sm:py-20 md:gap-10 md:py-32">
          <div className="inline-flex items-center rounded-full border border-foreground/15 bg-secondary/40 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-accent" aria-hidden />
            {t('eyebrow')}
          </div>
          <h1 className="max-w-3xl font-display text-[2.5rem] font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t('title')}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            {t('subtitle')}
          </p>
          <WaitlistForm />
        </section>

        <section className="border-t bg-secondary/20">
          <div className="container py-14 sm:py-20 md:py-24">
            <h2 className="mb-8 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground sm:mb-12 sm:text-xs">
              {t('pillarsTitle')}
            </h2>
            <div className="grid gap-10 sm:gap-8 md:grid-cols-3 md:gap-10">
              <Pillar number="01" title={t('pillar1Title')} body={t('pillar1Body')} />
              <Pillar number="02" title={t('pillar2Title')} body={t('pillar2Body')} />
              <Pillar number="03" title={t('pillar3Title')} body={t('pillar3Body')} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Pillar({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="font-mono text-[10px] tracking-[0.22em] text-accent sm:text-xs">{number}</div>
      <h3 className="font-display text-xl font-medium tracking-tight sm:text-2xl">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{body}</p>
    </div>
  );
}
