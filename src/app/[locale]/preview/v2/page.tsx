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

export default function PreviewV2Page() {
  return (
    <div data-palette="soft-black" className="min-h-dvh bg-background text-foreground">
      <PreviewSwitcher currentVariant="v2" currentPage="landing" />

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
        <div className="grid items-start gap-10 lg:grid-cols-[5fr_4fr] lg:gap-16">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent sm:text-xs sm:tracking-[0.24em]">
              <span className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" aria-hidden />
              A new place, soon · România
            </div>
            <h1 className="mt-6 font-display text-[2.25rem] leading-[1.05] tracking-tight sm:mt-8 sm:text-5xl md:text-6xl lg:text-7xl">
              Not every artist
              <br />
              <em className="font-display italic text-accent">understands</em>
              <br />
              your face.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg md:text-xl">
              The right specialist isn’t the closest one. It’s the one whose work already looks like the future
              you. We’re building a calm place to find them.
            </p>
            <div className="mt-8 sm:mt-10">
              <WaitlistForm />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border/60 bg-secondary/40">
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Editorial preview
                  </div>
                  <div className="mt-2 font-display text-2xl italic">A balayage that looks like spring.</div>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                    Andra · Cluj-Napoca
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 border-t border-border/60 pt-10 sm:mt-24 sm:pt-14 md:mt-32 md:pt-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-xs sm:tracking-[0.24em]">
            How you actually choose
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
      </main>

      <footer className="container border-t border-border/60 py-8 text-sm text-muted-foreground sm:py-10">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="font-display">ProjectMarket</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em]">v2 · soft black luxury</div>
        </div>
      </footer>
    </div>
  );
}
