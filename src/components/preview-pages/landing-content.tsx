import { cn } from '@/lib/utils';
import { WaitlistForm } from '@/components/waitlist-form';

const AESTHETICS = [
  'Soft Glam',
  'Clean Girl',
  'Old Money',
  'Natural Luxury',
  'Editorial Glam',
  'Bridal Elegance',
];

/**
 * Palette- and style-agnostic landing content for the /preview/play picker.
 *
 * Reads font choices, weights, italic/case from the [data-style] CSS
 * variables on the ancestor. Reads colours from [data-palette]. The page
 * doesn't need to know about either — just uses Tailwind tokens.
 */
export function LandingContent() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border/60">
        <div className="flex h-14 items-center justify-between px-5">
          <div className="flex items-center gap-2 font-display text-base tracking-tight">
            <span className="inline-block size-2 rounded-sm bg-accent" aria-hidden />
            ProjectMarket
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Coming soon
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 pb-12 sm:px-8">
        <section className="pt-10 sm:pt-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" aria-hidden />
            A new place, soon · România
          </div>
          <h1 className="mt-6 font-display text-[2.5rem] leading-[1.05] tracking-tight sm:mt-8 sm:text-5xl">
            Find the right hands for the look you love.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:mt-7">
            A calm, considered place to discover specialists near you, see how they work, and book without
            friction.
          </p>
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </section>

        <section className="mt-14 border-t border-border/60 pt-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Built around how you choose
          </div>
          <h2 className="mt-3 font-display text-2xl leading-tight tracking-tight">
            Pick by aesthetic, not just by category.
          </h2>
          <div className="mt-7 flex flex-wrap gap-2">
            {AESTHETICS.map((a, i) => (
              <span
                key={a}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em]',
                  i === 0
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-foreground/80',
                )}
              >
                {a}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-8 border-t border-border/60 pt-10">
          <Pillar number="01" title="Discover" body="People you'd recommend onward." />
          <Pillar number="02" title="Read the style" body="Portfolio, reviews, what makes them theirs." />
          <Pillar number="03" title="Book simply" body="One place for appointments." />
        </section>
      </main>

      <footer className="border-t border-border/60 px-5 py-6 text-xs text-muted-foreground sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="font-display">ProjectMarket</div>
          <div className="font-mono uppercase tracking-[0.18em]">2026</div>
        </div>
      </footer>
    </div>
  );
}

function Pillar({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[10px] tracking-[0.22em] text-accent">{number}</div>
      <h3 className="font-display text-xl tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
