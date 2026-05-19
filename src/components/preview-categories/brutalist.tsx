import { CATEGORIES, imageFor } from '@/lib/preview-mock-data';

/**
 * BRUTALIST BOLD — categories as a stacked index, each a full-width
 * strip with massive number, UPPERCASE label, hard-cropped image
 * bleeding to the right edge.
 */
export function BrutalistCategories() {
  return (
    <div className="[&_*]:rounded-none">
      <header className="border-b-[2px] border-foreground bg-foreground text-background">
        <div className="grid grid-cols-[1fr_auto]">
          <div className="px-5 py-3 font-mono text-xs uppercase tracking-[0.18em]">
            Browse / 06
          </div>
          <div className="border-l-[2px] border-background/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em]">
            Index
          </div>
        </div>
      </header>

      <section className="border-b-[2px] border-foreground px-5 py-7">
        <h1
          className="text-[3.25rem] font-black uppercase leading-[0.85] tracking-[-0.04em]"
          style={{ fontStretch: 'condensed' }}
        >
          What
          <br />
          are you
          <br />
          here for?
        </h1>
      </section>

      <ul>
        {CATEGORIES.map((c, i) => (
          <li
            key={c.id}
            className="grid grid-cols-[auto_1fr_auto] items-stretch border-b-[2px] border-foreground"
          >
            <div className="grid place-items-center border-r-[2px] border-foreground px-4 font-mono text-3xl font-black">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="flex flex-col justify-center px-4 py-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {c.count} artists
              </div>
              <div className="text-2xl font-black uppercase leading-none tracking-[-0.03em]">
                {c.name}
              </div>
            </div>
            <div className="relative aspect-square w-24 overflow-hidden border-l-[2px] border-foreground sm:w-28">
              <img src={imageFor.category(c.id)} alt="" className="size-full object-cover" />
            </div>
          </li>
        ))}
      </ul>

      <footer className="bg-foreground text-background">
        <div className="grid grid-cols-3">
          <div className="border-r-[2px] border-background/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em]">
            RO
          </div>
          <div className="border-r-[2px] border-background/30 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.18em]">
            END
          </div>
          <div className="px-3 py-2 text-right font-mono text-[10px] uppercase tracking-[0.18em]">
            06 / 06
          </div>
        </div>
      </footer>
    </div>
  );
}
