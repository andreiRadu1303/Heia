import { Sparkles, Search } from 'lucide-react';
import { CATEGORIES, FEATURED_ARTISTS, imageFor } from '@/lib/preview-mock-data';

/**
 * GLASS MODERN — categories on a gradient backdrop with frosted
 * glass tiles. Each tile shows a category image through a
 * translucent layer.
 */
export function GlassCategories() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
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

      <div className="relative pb-12">
        <header className="mx-4 mt-4">
          <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-card/30 px-4 py-2.5 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm font-medium tracking-tight">
              <Sparkles className="size-3.5 text-accent" />
              Browse
            </div>
            <img
              src={imageFor.avatar('me')}
              alt=""
              className="size-8 rounded-full object-cover ring-1 ring-border/40"
            />
          </div>
        </header>

        <section className="px-5 pt-10">
          <h1 className="text-3xl font-light leading-tight tracking-tight">
            Find your aesthetic.
          </h1>
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border/40 bg-card/30 px-4 py-3 shadow-lg backdrop-blur-xl">
            <Search className="size-4 text-muted-foreground" />
            <span className="text-sm text-foreground/70">Search hair, makeup…</span>
          </div>
        </section>

        <section className="mt-8 px-4">
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((c) => (
              <div
                key={c.id}
                className="group relative overflow-hidden rounded-2xl border border-border/40 shadow-xl backdrop-blur-xl"
              >
                <img
                  src={imageFor.category(c.id)}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
                {/* Frosted glass overlay over the image */}
                <div className="relative aspect-square w-full bg-card/30 backdrop-blur-md">
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70">
                      {c.count} artists
                    </div>
                    <div className="mt-1.5 text-lg font-medium tracking-tight">{c.name}</div>
                  </div>
                  <Sparkles className="absolute right-3 top-3 size-3 text-foreground/50" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured carousel as glass cards */}
        <section className="mt-10">
          <div className="px-5">
            <h2 className="text-lg font-medium tracking-tight">Featured</h2>
          </div>
          <div className="mt-4 -mr-4 overflow-x-auto">
            <div className="flex w-max gap-3 pl-4 pr-4 pb-1">
              {FEATURED_ARTISTS.map((a) => (
                <div
                  key={a.id}
                  className="w-44 shrink-0 overflow-hidden rounded-2xl border border-border/40 bg-card/30 shadow-lg backdrop-blur-xl"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={imageFor.artist(a.id)}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-foreground/70">
                      ★ {a.rating} · {a.city}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
