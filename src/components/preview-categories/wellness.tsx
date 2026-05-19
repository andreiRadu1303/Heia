import { Search } from 'lucide-react';
import { CATEGORIES, FEATURED_ARTISTS, imageFor } from '@/lib/preview-mock-data';

/**
 * SOFT WELLNESS — categories as friendly rounded pills with a
 * pastel background and curved wave dividers between sections.
 */
export function WellnessCategories() {
  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -left-20 -top-20 size-72 rounded-full opacity-50 blur-3xl"
          style={{ background: 'hsl(var(--accent))' }}
        />
      </div>

      <div className="relative">
        <header className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-2 font-medium">
            <span
              className="inline-block size-6 rounded-full"
              style={{ background: 'hsl(var(--accent))' }}
              aria-hidden
            />
            ProjectMarket
          </div>
          <img
            src={imageFor.avatar('me')}
            alt=""
            className="size-9 rounded-full object-cover ring-2 ring-card"
          />
        </header>

        <section className="px-6 pt-10">
          <h1 className="text-3xl font-medium leading-tight tracking-tight">
            What feels right today?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Pick a calm starting point. You can change your mind at any time.
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-full bg-card px-5 py-3 shadow-sm ring-1 ring-border">
            <Search className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search hair, makeup, brows…</span>
          </div>
        </section>

        <section className="mt-10 space-y-3 px-6">
          {CATEGORIES.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-full bg-card p-2.5 pr-5 shadow-sm ring-1 ring-border"
            >
              <div className="relative size-14 overflow-hidden rounded-full ring-2 ring-accent/30">
                <img src={imageFor.category(c.id)} alt="" className="size-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-medium tracking-tight">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.count} artists nearby</div>
              </div>
              <div className="text-xl text-muted-foreground">›</div>
            </div>
          ))}
        </section>
      </div>

      <svg className="block w-full" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
        <path
          d="M 0 30 Q 100 60 200 30 T 400 30 L 400 60 L 0 60 Z"
          fill="hsl(var(--card))"
          opacity="0.6"
        />
      </svg>

      <section className="bg-card/60 px-6 py-10">
        <h2 className="mb-4 text-lg font-medium tracking-tight">Trending this week</h2>
        <div className="grid grid-cols-2 gap-3">
          {FEATURED_ARTISTS.slice(0, 4).map((a) => (
            <div
              key={a.id}
              className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img src={imageFor.artist(a.id)} alt="" className="size-full object-cover" />
              </div>
              <div className="p-3">
                <div className="text-sm font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">
                  ★ {a.rating} · {a.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
