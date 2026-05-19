import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { AESTHETICS, imageFor } from '@/lib/preview-mock-data';

const SELECTED = new Set(['soft-glam', 'natural-luxury', 'clean-girl']);

/**
 * GLASS MODERN — preferences as floating glass cards over a
 * gradient backdrop. Each card has a real image behind a frosted
 * overlay. Sparkles mark selection.
 */
export function GlassPreferences() {
  return (
    <div className="relative min-h-dvh overflow-hidden pb-32">
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

      <div className="relative">
        <header className="mx-4 mt-4">
          <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-card/30 px-4 py-2.5 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-foreground" aria-hidden />
              <span className="h-1.5 w-6 rounded-full bg-foreground" aria-hidden />
              <span className="h-1.5 w-6 rounded-full bg-foreground/30" aria-hidden />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Step 2 of 3
            </span>
          </div>
        </header>

        <section className="px-5 pt-10">
          <h1 className="text-[2.25rem] font-light leading-[1.05] tracking-tight">
            Which feels
            <br />
            most like you?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">
            Pick all that resonate. Selected cards shimmer.
          </p>
        </section>

        <section className="mt-8 px-4">
          <div className="grid grid-cols-2 gap-3">
            {AESTHETICS.map((a) => {
              const selected = SELECTED.has(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  className={`group relative overflow-hidden rounded-2xl border shadow-xl backdrop-blur-xl transition-transform ${
                    selected
                      ? 'border-foreground/40 ring-2 ring-foreground/30'
                      : 'border-border/40 hover:-translate-y-0.5'
                  }`}
                >
                  <img
                    src={imageFor.aesthetic(a.id)}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                  />
                  <div className="relative aspect-[3/4] bg-card/30 backdrop-blur-sm">
                    <div className="absolute inset-0 flex flex-col justify-end p-3">
                      <div className="text-base font-medium tracking-tight text-foreground">
                        {a.name}
                      </div>
                    </div>
                    {selected ? (
                      <>
                        <Sparkles className="absolute left-2.5 top-2.5 size-3.5 text-foreground" />
                        <div className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full bg-foreground text-background">
                          <Check className="size-3.5" />
                        </div>
                      </>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-3 mb-3 rounded-2xl border border-border/40 bg-card/40 p-3 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="size-3 text-accent" />
                {SELECTED.size} selected
              </div>
              <div className="truncate text-sm font-medium">
                {Array.from(SELECTED)
                  .map((id) => AESTHETICS.find((a) => a.id === id)?.name)
                  .join(' · ')}
              </div>
            </div>
            <button className="inline-flex h-11 items-center gap-1.5 rounded-full bg-foreground px-5 text-sm font-medium text-background">
              Continue
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
