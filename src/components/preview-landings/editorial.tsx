import { WaitlistForm } from '@/components/waitlist-form';
import { imageFor } from '@/lib/preview-mock-data';

/**
 * EDITORIAL MAGAZINE landing — Vogue / NYT Cooking / Bon Appétit.
 * Full-bleed photographic hero, italic serif overlapping the image,
 * drop-capped lead, hairline rules, oversized pull quote.
 */
export function EditorialLanding() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Masthead */}
      <header className="border-b border-foreground/15 px-5 pt-3 pb-2">
        <div className="flex items-baseline justify-between">
          <div className="font-display text-lg italic tracking-tight">ProjectMarket</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            No. 01 · 2026
          </div>
        </div>
      </header>

      {/* Hero photograph, full-bleed */}
      <div className="relative">
        <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
          <img
            src={imageFor.artist('editorial-hero')}
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />
          <div className="absolute left-5 top-5 font-mono text-[9px] uppercase tracking-[0.28em] text-white/85">
            Issue 01 · Spring 2026
          </div>
          <div className="absolute bottom-4 right-5 max-w-[55%] text-right font-mono text-[9px] uppercase tracking-[0.22em] text-white/75">
            Photograph · Andra C. for ProjectMarket
          </div>
        </div>
        <h1 className="-mt-12 relative px-5 font-display text-[3rem] italic leading-[0.95] tracking-tight">
          Find the right
          <br />
          hands.
        </h1>
      </div>

      {/* Lead paragraph with drop cap */}
      <section className="mt-8 px-5">
        <p className="text-base leading-[1.75] text-foreground">
          <span className="float-left mr-2 mt-1 font-display text-[3.5rem] italic leading-[0.85] text-accent">
            A
          </span>
          new place to discover specialists near you — the ones whose work already looks like
          the future you. Calm, considered, and quietly premium. We&rsquo;ll let you know when
          we open the doors.
        </p>
      </section>

      <hr className="mx-5 mt-10 border-foreground/15" />
      <section className="px-5 pt-8">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            §01
          </span>
          <div className="h-px flex-1 bg-foreground/15" />
        </div>
        <h2 className="mt-3 font-display text-2xl italic tracking-tight">
          A directory you want to read.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Curated profiles. Visible style. No noise. Every artist appears because their work
          earns the place — not because they paid.
        </p>
      </section>

      <hr className="mx-5 mt-8 border-foreground/15" />

      {/* Pull quote */}
      <section className="px-5 py-12">
        <div className="relative">
          <span
            aria-hidden
            className="absolute -top-6 left-0 font-display text-[5rem] italic leading-none text-accent"
          >
            &ldquo;
          </span>
          <blockquote className="pl-10 font-display text-xl italic leading-snug tracking-tight">
            Finding the right hairstylist is harder than dating.
          </blockquote>
          <div className="mt-3 pl-10 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            — overheard, București · 2026
          </div>
        </div>
      </section>

      <hr className="mx-5 border-foreground/15" />

      {/* Waitlist as "subscribe" */}
      <section className="px-5 py-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Subscribe to Issue 02
        </div>
        <h2 className="mt-2 font-display text-2xl italic tracking-tight">
          Be the first reader.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          One letter when we open. Nothing else.
        </p>
        <div className="mt-5">
          <WaitlistForm />
        </div>
      </section>

      <footer className="mt-auto border-t border-foreground/15 px-5 py-6">
        <div className="flex items-baseline justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
          <span>Editor · ProjectMarket</span>
          <span>Bucharest · 2026</span>
        </div>
      </footer>
    </div>
  );
}
