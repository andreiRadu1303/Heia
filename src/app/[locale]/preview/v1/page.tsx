import { PreviewSwitcher } from '@/components/preview-switcher';
import { WaitlistForm } from '@/components/waitlist-form';

const AESTHETICS = [
  'Soft glam',
  'Clean girl',
  'Old money',
  'Natural luxury',
  'Editorial glam',
  'Bridal elegance',
];

export default function PreviewV1Page() {
  return (
    <div data-palette="warm-premium" className="min-h-dvh bg-background text-foreground">
      <PreviewSwitcher currentVariant="v1" currentPage="landing" />

      <header className="border-b border-border/60">
        <div className="container flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center gap-2 font-display text-base tracking-tight sm:text-lg">
            <span className="inline-block size-2 rounded-sm bg-accent" aria-hidden />
            ProjectMarket
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Coming soon
          </div>
        </div>
      </header>

      <main className="container py-10 sm:py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent sm:text-xs sm:tracking-[0.24em]">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" aria-hidden />
            A new place, soon · România
          </div>
          <h1 className="mt-6 font-display text-[2.5rem] leading-[1.05] tracking-tight sm:mt-8 sm:text-5xl md:text-6xl lg:text-7xl">
            Find <em className="font-display italic">the right</em> hands for the look you love.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg md:text-xl">
            A calm, considered place to discover specialists near you, see how they work, and book without
            friction. We’ll let you know when we open.
          </p>
          <div className="mt-8 sm:mt-10">
            <WaitlistForm />
          </div>
        </div>

        <section className="mt-16 border-t border-border/60 pt-10 sm:mt-24 sm:pt-14 md:mt-32 md:pt-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-xs sm:tracking-[0.24em]">
            Built around how you actually choose
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-2xl leading-tight tracking-tight sm:mt-4 sm:text-3xl md:text-4xl">
            Pick by aesthetic, not just by category.
          </h2>
          <div className="mt-8 flex flex-wrap gap-2 sm:mt-10">
            {AESTHETICS.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border bg-card px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/80 sm:px-4"
              >
                {a}
              </span>
            ))}
            <span className="rounded-full bg-accent px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-foreground sm:px-4">
              and more
            </span>
          </div>
        </section>

        <section className="mt-14 grid gap-8 border-t border-border/60 pt-10 sm:mt-20 sm:gap-10 sm:pt-14 md:mt-24 md:grid-cols-3 md:gap-12 md:pt-16">
          <Pillar number="01" title="Discover" body="People and places you’d recommend onward." />
          <Pillar number="02" title="Read the style" body="Portfolio, reviews, what makes them theirs." />
          <Pillar number="03" title="Book simply" body="One place for appointments. No scattered threads." />
        </section>
      </main>

      <footer className="container border-t border-border/60 py-8 text-sm text-muted-foreground sm:py-10">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="font-display">ProjectMarket</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]">v1 · warm premium</div>
        </div>
      </footer>
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
