import { Check, ArrowRight } from 'lucide-react';
import { AESTHETICS, imageFor } from '@/lib/preview-mock-data';

const SELECTED = new Set(['soft-glam', 'natural-luxury', 'clean-girl']);

/**
 * SOFT WELLNESS — preferences as rounded, image-led cards with soft
 * shadows. Big friendly headline, pastel blob backdrop.
 */
export function WellnessPreferences() {
  return (
    <div className="relative min-h-dvh overflow-hidden pb-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -left-20 -top-20 size-72 rounded-full opacity-50 blur-3xl"
          style={{ background: 'hsl(var(--accent))' }}
        />
        <div
          className="absolute -right-16 top-40 size-60 rounded-full opacity-40 blur-3xl"
          style={{ background: 'hsl(var(--accent))' }}
        />
      </div>

      <div className="relative">
        <header className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-foreground" aria-hidden />
            <span className="h-1.5 w-6 rounded-full bg-foreground" aria-hidden />
            <span className="h-1.5 w-6 rounded-full bg-border" aria-hidden />
          </div>
          <button className="rounded-full bg-card px-4 py-1.5 text-xs font-medium shadow-sm">
            Skip
          </button>
        </header>

        <section className="px-6 pt-12">
          <h1 className="text-[2.5rem] font-medium leading-[1.05] tracking-tight">
            Pick what feels
            <br />
            like you.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Choose any number of styles that resonate. We&rsquo;ll surface artists you&rsquo;d
            actually love.
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
                  className={`relative overflow-hidden rounded-3xl bg-card text-left shadow-sm ring-1 transition-all ${
                    selected ? 'ring-2 ring-foreground' : 'ring-border hover:-translate-y-0.5'
                  }`}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={imageFor.aesthetic(a.id)}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium tracking-tight">{a.name}</div>
                  </div>
                  {selected ? (
                    <div className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-foreground text-background shadow">
                      <Check className="size-4" />
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-4 mb-3 flex items-center justify-between gap-3 rounded-full bg-card p-2 pl-5 shadow-lg ring-1 ring-border">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{SELECTED.size} selected</div>
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
  );
}
