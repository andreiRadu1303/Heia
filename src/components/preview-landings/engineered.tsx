import { WaitlistForm } from '@/components/waitlist-form';
import { imageFor } from '@/lib/preview-mock-data';

/**
 * MODERN GRID (Engineered) landing — Linear / Vercel / Stripe Press / Read.cv.
 * Visible grid, mono labels, numbered cells, hairline borders, type-driven.
 * A small thumbnail strip at the bottom adds photographic context without
 * breaking the engineering tone.
 */
export function EngineeredLanding() {
  return (
    <div className="flex min-h-dvh flex-col font-sans">
      <header className="grid grid-cols-3 border-b border-border bg-background">
        <div className="border-r border-border px-4 py-2.5">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Build
          </div>
          <div className="font-mono text-xs">v0.1.0</div>
        </div>
        <div className="border-r border-border px-4 py-2.5">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Status
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            Building
          </div>
        </div>
        <div className="px-4 py-2.5 text-right">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Region
          </div>
          <div className="font-mono text-xs">ro-buc-1</div>
        </div>
      </header>

      <section className="border-b border-border px-5 py-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          ProjectMarket · changelog 01
        </div>
        <h1 className="mt-4 text-[2.25rem] font-bold leading-[1.05] tracking-tight">
          A directory for the right
          <br />
          hands. Engineered to be calm.
        </h1>
        <div className="mt-6 flex items-baseline gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>Posted · 2026-05-12</span>
          <span aria-hidden>·</span>
          <span>Tagged · launch, romania</span>
        </div>
      </section>

      <section className="grid grid-cols-2">
        <SpecCell index="01" label="Find" value="By style, not category" />
        <SpecCell index="02" label="See" value="Real portfolios" />
        <SpecCell index="03" label="Book" value="One place. No threads." />
        <SpecCell index="04" label="Trust" value="Graduated, never gamed" />
      </section>

      {/* Photographic strip — a row of small avatars to anchor the page */}
      <section className="border-y border-border bg-secondary/40">
        <div className="px-5 py-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Current artists · sample
          </div>
          <div className="mt-3 flex items-center gap-2">
            {['andra', 'maria', 'iulia', 'ana', 'elena'].map((id) => (
              <img
                key={id}
                src={imageFor.avatar(id)}
                alt=""
                className="size-10 rounded-md object-cover ring-1 ring-border"
              />
            ))}
            <div className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              +218 more
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border px-5 py-10">
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 border-b border-border pb-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            05
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Waitlist · join
          </div>
        </div>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Add your email. We&rsquo;ll send one notification at launch.
        </p>
        <div className="mt-5">
          <WaitlistForm />
        </div>
      </section>

      <footer className="mt-auto grid grid-cols-3">
        <div className="border-r border-border px-4 py-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Maintainer
          </div>
          <div className="font-mono text-xs">ProjectMarket</div>
        </div>
        <div className="border-r border-border px-4 py-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            License
          </div>
          <div className="font-mono text-xs">Internal</div>
        </div>
        <div className="px-4 py-3 text-right">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Region
          </div>
          <div className="font-mono text-xs">RO · EU</div>
        </div>
      </footer>
    </div>
  );
}

function SpecCell({ index, label, value }: { index: string; label: string; value: string }) {
  return (
    <div className="relative border-b border-r border-border px-5 py-6 last:border-r-0 [&:nth-child(2)]:border-r-0 [&:nth-child(2n)]:border-r-0">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {index} · {label}
      </div>
      <div className="mt-3 text-base font-semibold tracking-tight">{value}</div>
    </div>
  );
}
