import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AESTHETICS, type DisplayFont } from '@/lib/preview-mock-data';

const SELECTED = new Set(['soft-glam', 'natural-luxury', 'clean-girl']);

/**
 * Mobile-native preferences picker.
 *
 * Design notes:
 * - Edge-to-edge layout; padding handles inset.
 * - HUGE editorial headline with breathing room — sets the tone.
 * - 2-up cards on mobile, each with a tall colour swatch + name only.
 *   No description text on the card (saves space; tap to learn more).
 * - Floating bottom continue bar with the selected count.
 */
export function PreferencesContent({ displayFont = 'display' }: { displayFont?: DisplayFont }) {
  const display = displayFont === 'display' ? 'font-display' : 'font-sans';

  return (
    <div className="pb-36">
      {/* Top bar: progress dots + skip */}
      <header className="flex items-center justify-between px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-6 rounded-full bg-foreground" aria-hidden />
          <span className="h-1.5 w-6 rounded-full bg-foreground" aria-hidden />
          <span className="h-1.5 w-6 rounded-full bg-border" aria-hidden />
        </div>
        <button className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          Skip
        </button>
      </header>

      {/* Hero */}
      <section className="px-5 pt-12 sm:px-8 sm:pt-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Step 2 of 3
        </div>
        <h1
          className={cn(
            'mt-3 text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl',
            display,
            displayFont === 'display' ? 'font-medium' : 'font-semibold',
          )}
        >
          What feels
          <br />
          like{' '}
          <em className={cn(displayFont === 'display' ? 'italic' : 'not-italic font-normal')}>you</em>?
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          Pick the ones that resonate — we’ll use them to surface the right artists. Change them any time.
        </p>
      </section>

      {/* Cards: 2-up on mobile, big swatches, no on-card descriptions */}
      <section className="mt-10 px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
          {AESTHETICS.map((a) => {
            const selected = SELECTED.has(a.id);
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={selected}
                className={cn(
                  'group relative overflow-hidden rounded-2xl text-left transition-transform',
                  selected
                    ? 'ring-2 ring-foreground ring-offset-4 ring-offset-background'
                    : 'ring-1 ring-border hover:-translate-y-0.5',
                )}
              >
                <div
                  className="aspect-[3/4] w-full transition-transform group-hover:scale-[1.02]"
                  style={{ background: a.color }}
                  aria-hidden
                />
                <div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-3.5 sm:p-4"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                  <div
                    className={cn(
                      'text-base font-medium tracking-tight text-white sm:text-lg',
                      display,
                    )}
                  >
                    {a.name}
                  </div>
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

      {/* Sticky continue bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {SELECTED.size} selected
            </div>
            <div className="truncate text-xs text-foreground/80">
              {Array.from(SELECTED)
                .map((id) => AESTHETICS.find((a) => a.id === id)?.name)
                .join(' · ')}
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background"
          >
            Continue
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
