import { CATEGORIES, FEATURED_ARTISTS, imageFor } from '@/lib/preview-mock-data';

/**
 * MODERN GRID — categories as a bento with hairline borders.
 * Mono labels, numbered cells, timestamp metadata, photographic
 * thumbs but kept small.
 */
export function EngineeredCategories() {
  return (
    <div>
      {/* Status bar */}
      <header className="grid grid-cols-3 border-b border-border bg-background">
        <div className="border-r border-border px-4 py-2.5">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Page
          </div>
          <div className="font-mono text-xs">categories</div>
        </div>
        <div className="border-r border-border px-4 py-2.5">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Records
          </div>
          <div className="font-mono text-xs">{CATEGORIES.length}</div>
        </div>
        <div className="px-4 py-2.5 text-right">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Sort
          </div>
          <div className="font-mono text-xs">popularity ↓</div>
        </div>
      </header>

      {/* Title row */}
      <section className="border-b border-border px-5 py-7">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          browse.md
        </div>
        <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight">
          Categories — the index.
        </h1>
      </section>

      {/* Bento grid */}
      <section className="grid grid-cols-2">
        {CATEGORIES.map((c, i) => (
          <div
            key={c.id}
            className="border-b border-r border-border px-4 py-5 [&:nth-child(2n)]:border-r-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  0{i + 1} · {c.name.toLowerCase()}
                </div>
                <div className="mt-2 text-base font-semibold tracking-tight">{c.name}</div>
                <div className="mt-1 font-mono text-xs text-muted-foreground">
                  {c.count} artists
                </div>
              </div>
              <img
                src={imageFor.category(c.id)}
                alt=""
                className="size-14 shrink-0 rounded-sm object-cover ring-1 ring-border"
              />
            </div>
            <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Updated · 2026-05-12
            </div>
          </div>
        ))}
      </section>

      {/* Sample artists log */}
      <section className="border-b border-border bg-secondary/40 px-5 py-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Sample log · top artists
        </div>
        <ul className="mt-3 divide-y divide-border/70 font-mono text-xs">
          {FEATURED_ARTISTS.map((a, i) => (
            <li key={a.id} className="flex items-center gap-3 py-2.5">
              <span className="text-muted-foreground">[{String(i + 1).padStart(2, '0')}]</span>
              <img
                src={imageFor.avatar(a.id)}
                alt=""
                className="size-7 rounded-sm object-cover ring-1 ring-border"
              />
              <span className="flex-1 truncate">{a.name.toLowerCase()}</span>
              <span className="text-muted-foreground">★ {a.rating}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{a.city.toLowerCase()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
