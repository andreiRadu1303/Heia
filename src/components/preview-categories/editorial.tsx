import { CATEGORIES, FEATURED_ARTISTS, imageFor } from '@/lib/preview-mock-data';

/**
 * EDITORIAL MAGAZINE — categories page as an issue contents page.
 * Hero feature article, italic serif headlines, hairline rules,
 * category "articles" with full-bleed photographs.
 */
export function EditorialCategories() {
  const feature = FEATURED_ARTISTS[0];
  return (
    <div className="pb-12">
      <header className="border-b border-foreground/15 px-5 pt-4 pb-3">
        <div className="flex items-baseline justify-between">
          <div className="font-display text-lg italic tracking-tight">Contents</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            Issue 01 · Section II
          </div>
        </div>
      </header>

      {/* Feature article */}
      <article>
        <div className="relative h-72 overflow-hidden">
          <img src={imageFor.artist('ed-cat-hero')} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent" />
          <div className="absolute left-5 top-5 font-mono text-[9px] uppercase tracking-[0.28em] text-white/85">
            The Feature · 01
          </div>
        </div>
        <div className="px-5 pt-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            On Soft Glam — {feature.city}
          </div>
          <h2 className="mt-2 font-display text-2xl italic leading-tight tracking-tight">
            “The right artist isn’t the closest one.”
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A conversation with {feature.name}, photographed in her Cluj studio, on why
            balayage is the calmest decision a colour can make.
          </p>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Read article →
          </div>
        </div>
      </article>

      <hr className="mx-5 my-10 border-foreground/15" />

      {/* Category articles */}
      <section className="px-5">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            §02 · Departments
          </span>
          <div className="h-px flex-1 bg-foreground/15" />
        </div>

        <div className="mt-6 divide-y divide-foreground/15">
          {CATEGORIES.map((c, i) => (
            <article key={c.id} className="flex items-start gap-4 py-5">
              <div className="aspect-[3/4] w-24 shrink-0 overflow-hidden">
                <img src={imageFor.category(c.id)} alt="" className="size-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Department · 0{i + 1}
                </div>
                <h3 className="mt-1.5 font-display text-xl italic leading-tight tracking-tight">
                  {c.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {c.count} artists, curated for taste.
                </p>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  Read →
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
