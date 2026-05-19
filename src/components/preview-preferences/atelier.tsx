import { AESTHETICS, imageFor } from '@/lib/preview-mock-data';

const SELECTED = new Set(['soft-glam', 'natural-luxury', 'clean-girl']);

/**
 * BOUTIQUE ATELIER — preferences as a refined "selection" page.
 * Vertical brand label, right-aligned title, aesthetics as
 * portrait/text pairs alternating alignment, long hairlines.
 */
export function AtelierPreferences() {
  return (
    <div className="relative pb-28">
      <div
        className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-end pb-12"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-muted-foreground">
          ProjectMarket · Selection · 02 / 03
        </div>
      </div>

      <header className="px-5 pt-6 pl-10">
        <div className="text-right">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            № 02 — Your aesthetic
          </div>
        </div>
      </header>

      <section className="px-5 pl-10 pt-10">
        <div className="text-right">
          <h1 className="ml-auto max-w-[14ch] font-display text-[2rem] leading-[1.05] tracking-tight">
            Pick what feels
            <br />
            like you.
          </h1>
        </div>
      </section>

      <div className="my-10 mx-5 ml-10 h-px bg-foreground/20" />

      <section className="px-5 pl-10">
        <ul className="space-y-10">
          {AESTHETICS.map((a, i) => {
            const selected = SELECTED.has(a.id);
            const right = i % 2 === 0;
            return (
              <li key={a.id}>
                <div className={`flex items-end gap-5 ${right ? '' : 'flex-row-reverse text-right'}`}>
                  <div className="w-[50%] max-w-[160px] shrink-0 overflow-hidden">
                    <div className="relative aspect-[3/4]">
                      <img
                        src={imageFor.aesthetic(a.id)}
                        alt=""
                        className="size-full object-cover"
                      />
                      {selected ? (
                        <div className="absolute inset-0 ring-[2px] ring-foreground" />
                      ) : null}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                      № {String(i + 1).padStart(2, '0')}{selected ? ' — chosen' : ''}
                    </div>
                    <h3 className="mt-2 font-display text-xl leading-tight tracking-tight">
                      {a.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.desc}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="px-5 pl-10 py-3.5">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              {SELECTED.size} chosen
            </div>
            <button className="font-display text-base tracking-tight">
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
