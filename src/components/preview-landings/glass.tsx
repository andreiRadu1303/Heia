import { Sparkles } from 'lucide-react';
import { WaitlistForm } from '@/components/waitlist-form';
import { imageFor } from '@/lib/preview-mock-data';

/**
 * GLASS MODERN landing — iOS Liquid Glass / Arc / Linear Glass.
 * Multi-stop gradient, frosted glass cards, sparkle accents,
 * translucent layers with backdrop-blur.
 */
export function GlassLanding() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, hsl(var(--accent)) 0%, hsl(var(--background)) 35%, hsl(var(--muted)) 65%, hsl(var(--accent) / 0.6) 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-20 size-72 rounded-full opacity-50 blur-3xl"
        style={{ background: 'hsl(var(--accent))' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-1/3 size-80 rounded-full opacity-40 blur-3xl"
        style={{ background: 'hsl(var(--accent))' }}
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col">
        <header className="mx-4 mt-4">
          <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-card/30 px-4 py-2.5 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm font-medium tracking-tight">
              <Sparkles className="size-3.5 text-accent" />
              ProjectMarket
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              v0.1
            </div>
          </div>
        </header>

        <section className="px-6 pt-14 pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-card/30 px-3 py-1 text-xs backdrop-blur-md">
            <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden />
            Coming soon · România
          </div>
          <h1 className="mt-7 text-[2.5rem] font-light leading-[1.05] tracking-tight">
            Discover quietly
            <br />
            beautiful people.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/80">
            A directory of specialists, filtered by the aesthetic that already lives in your
            head.
          </p>
        </section>

        <section className="px-4 pb-10">
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: '✦', label: 'Discover', body: 'Quietly trusted people, close to you.' },
              { icon: '✿', label: 'Read style', body: 'Portfolio, reviews, the whole vibe.' },
              { icon: '✶', label: 'Book', body: 'One frictionless place, calm and clear.' },
            ].map((p) => (
              <div
                key={p.label}
                className="rounded-2xl border border-border/40 bg-card/30 p-5 shadow-lg backdrop-blur-xl"
              >
                <div className="font-mono text-xs text-accent">{p.icon}</div>
                <div className="mt-3 text-base font-medium tracking-tight">{p.label}</div>
                <div className="mt-1 text-sm leading-relaxed text-foreground/70">{p.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured artist as a glass card with real image */}
        <section className="px-4 pb-10">
          <div className="overflow-hidden rounded-3xl border border-border/40 bg-card/30 shadow-xl backdrop-blur-xl">
            <div className="relative h-40 overflow-hidden">
              <img
                src={imageFor.artist('glass-featured')}
                alt=""
                className="size-full object-cover"
              />
              <Sparkles className="absolute right-3 top-3 size-3.5 text-white/80 drop-shadow" />
            </div>
            <div className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Featured · Andra C.
              </div>
              <div className="mt-2 text-lg font-medium tracking-tight">
                A balayage that looks like spring.
              </div>
              <div className="mt-2 text-sm text-foreground/70">
                Cluj-Napoca · Soft Glam · ★ 4.9
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12">
          <div className="rounded-3xl border border-border/40 bg-card/40 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-medium tracking-tight">Get the invite.</h2>
              <Sparkles className="size-4 text-accent" />
            </div>
            <p className="mt-2 text-sm text-foreground/70">
              One notification when we open. Nothing else.
            </p>
            <div className="mt-5">
              <WaitlistForm />
            </div>
          </div>
        </section>

        <footer className="mt-auto px-6 pb-6 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          ProjectMarket · 2026
        </footer>
      </div>
    </div>
  );
}
