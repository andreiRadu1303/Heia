import { ArrowRight } from 'lucide-react';
import { WaitlistForm } from '@/components/waitlist-form';
import { imageFor } from '@/lib/preview-mock-data';

/**
 * BRUTALIST BOLD landing — Balenciaga / Bloomberg / Berlin galleries.
 * Massive UPPERCASE, 2px borders, hard image crops, diagonal accent.
 */
export function BrutalistLanding() {
  return (
    <div className="flex min-h-dvh flex-col [&_*]:rounded-none">
      <header className="border-b-[2px] border-foreground bg-foreground text-background">
        <div className="grid grid-cols-[1fr_auto] items-stretch">
          <div className="px-5 py-3 font-mono text-xs uppercase tracking-[0.18em]">
            ProjectMarket / 01
          </div>
          <div className="border-l-[2px] border-background/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em]">
            2026
          </div>
        </div>
      </header>

      <section className="border-b-[2px] border-foreground px-5 py-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          01 / 06 · Index
        </div>
        <h1
          className="mt-4 text-[3.5rem] font-black uppercase leading-[0.85] tracking-[-0.04em]"
          style={{ fontStretch: 'condensed' }}
        >
          Not every
          <br />
          <span className="text-accent">artist</span>
          <br />
          gets you.
        </h1>
      </section>

      {/* Hard-cropped image block */}
      <section className="border-b-[2px] border-foreground">
        <div className="grid grid-cols-[2fr_1fr]">
          <div
            className="relative aspect-[5/6] overflow-hidden border-r-[2px] border-foreground"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)' }}
          >
            <img
              src={imageFor.artist('brutalist-fig')}
              alt=""
              className="size-full object-cover"
            />
            {/* Diagonal accent stripe */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute -left-4 top-1/3 h-1.5 w-[150%] bg-background"
                style={{ transform: 'rotate(-18deg)' }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="border-b-[2px] border-foreground p-3 font-mono text-[10px] uppercase tracking-[0.18em]">
              FIG. 01
              <br />
              Andra C.
              <br />
              Cluj
            </div>
            <div className="flex-1 p-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Balayage
              <br />
              Soft Glam
              <br />
              ★ 4.9
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-[2px] border-foreground">
        {[
          ['02', 'FIND', 'Specialists by style, not category.'],
          ['03', 'READ', 'Portfolio over promise.'],
          ['04', 'BOOK', 'One place. Zero threads.'],
        ].map(([num, label, body]) => (
          <div
            key={num}
            className="grid grid-cols-[auto_1fr] items-start gap-4 border-b-[2px] border-foreground px-5 py-5 last:border-b-0"
          >
            <div className="font-mono text-2xl font-black leading-none tracking-tight">{num}</div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {label}
              </div>
              <div className="mt-1.5 text-base font-bold uppercase leading-tight tracking-[-0.02em]">
                {body}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="border-b-[2px] border-foreground bg-foreground text-background">
        <div className="px-5 py-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] opacity-70">
            05 / Waitlist
          </div>
          <h2 className="mt-3 text-2xl font-black uppercase leading-tight tracking-[-0.03em]">
            Get the note
            <br />
            when we open. <ArrowRight className="inline size-6" />
          </h2>
        </div>
        <div className="border-t-[2px] border-background/30 bg-background p-5 text-foreground">
          <WaitlistForm />
        </div>
      </section>

      <footer className="mt-auto bg-foreground text-background">
        <div className="grid grid-cols-3">
          <div className="border-r-[2px] border-background/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em]">
            RO
          </div>
          <div className="border-r-[2px] border-background/30 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.18em]">
            06 / 06
          </div>
          <div className="px-3 py-2 text-right font-mono text-[10px] uppercase tracking-[0.18em]">
            END
          </div>
        </div>
      </footer>
    </div>
  );
}
