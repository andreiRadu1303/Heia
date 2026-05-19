import { CATEGORIES, imageFor } from '@/lib/preview-mock-data';

/**
 * BOUTIQUE ATELIER — categories as an asymmetric portfolio index.
 * Vertical brand label on left, right-aligned title, image/text
 * pairs alternating alignment.
 */
export function AtelierCategories() {
  return (
    <div className="relative pb-16">
      <div
        className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-end pb-12"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-muted-foreground">
          ProjectMarket · Index · 06
        </div>
      </div>

      <header className="px-5 pt-6 pl-10">
        <div className="text-right">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            № 02 — Browse, slowly
          </div>
        </div>
      </header>

      <section className="px-5 pl-10 pt-10">
        <div className="text-right">
          <h1 className="ml-auto max-w-[14ch] font-display text-[2.25rem] leading-[1.05] tracking-tight">
            Six rooms.
            <br />
            Each curated.
          </h1>
        </div>
      </section>

      <div className="my-10 mx-5 ml-10 h-px bg-foreground/20" />

      <section className="px-5 pl-10">
        <ul className="space-y-12">
          {CATEGORIES.map((c, i) => {
            const right = i % 2 === 0;
            return (
              <li key={c.id} className={right ? '' : 'pr-4'}>
                <div className={`flex items-end gap-5 ${right ? '' : 'flex-row-reverse text-right'}`}>
                  <div className="w-[55%] max-w-[180px] shrink-0 overflow-hidden">
                    <img
                      src={imageFor.category(c.id)}
                      alt=""
                      className="aspect-[3/4] size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                      Room № 0{i + 1}
                    </div>
                    <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight">
                      {c.name}
                    </h3>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {c.count} artists
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-14 mx-5 ml-10 h-px bg-foreground/20" />
      <div className="mt-3 px-5 pl-10 text-right font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        End of section
      </div>
    </div>
  );
}
