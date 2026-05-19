import { WaitlistForm } from '@/components/waitlist-form';
import { imageFor } from '@/lib/preview-mock-data';

/**
 * BOUTIQUE ATELIER landing — Aesop / Apartamento / Cereal.
 * Asymmetric, vertical brand label, right-aligned typography,
 * strategic empty space, refined serif.
 */
export function AtelierLanding() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-end pb-12"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-muted-foreground">
          ProjectMarket · Est. 2026 · România
        </div>
      </div>

      <header className="px-5 pt-6 pl-10">
        <div className="text-right">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            № 01 — Coming soon
          </div>
        </div>
      </header>

      <section className="px-5 pl-10 pt-16">
        <div className="text-right">
          <h1 className="ml-auto max-w-[18ch] font-display text-[2.25rem] leading-[1.05] tracking-tight">
            For the look
            <br />
            you almost
            <br />
            have.
          </h1>
        </div>
      </section>

      {/* Small portrait card, offset to right */}
      <div className="mt-10 px-5 pl-10">
        <div className="ml-auto w-[55%] max-w-[200px]">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={imageFor.artist('atelier-portrait')}
              alt=""
              className="size-full object-cover"
            />
          </div>
          <div className="mt-2 text-right font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            01 — Andra C. · Cluj-Napoca
          </div>
        </div>
      </div>

      <div className="my-14 mx-5 ml-10 h-px bg-foreground/20" />

      <section className="px-5 pl-10 max-w-[80%]">
        <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          On selection
        </div>
        <p className="mt-3 font-display text-lg leading-snug tracking-tight">
          We look for artists whose work has a point of view. Then we get out of the way.
        </p>
      </section>

      <div className="my-14 mx-5 ml-10 h-px bg-foreground/20" />

      <section className="px-5 pl-10 pb-16">
        <div className="ml-auto max-w-[85%] text-right">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            Correspondence
          </div>
          <h2 className="mt-2 font-display text-xl leading-tight tracking-tight">
            Leave your address. We&rsquo;ll write once.
          </h2>
        </div>
        <div className="ml-auto mt-5 max-w-[280px]">
          <WaitlistForm />
        </div>
      </section>

      <footer className="mt-auto px-5 pl-10 pb-6">
        <div className="ml-auto max-w-fit text-right font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          ProjectMarket · all rights · 2026
        </div>
      </footer>
    </div>
  );
}
