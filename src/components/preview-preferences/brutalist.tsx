import { AESTHETICS, imageFor } from '@/lib/preview-mock-data';

const SELECTED = new Set(['soft-glam', 'natural-luxury', 'clean-girl']);

/**
 * BRUTALIST BOLD — preferences as a stacked vote sheet.
 * Each aesthetic is a full-width strip with hard borders, image,
 * UPPERCASE name. Selected strips have thicker border and "[X]".
 */
export function BrutalistPreferences() {
  return (
    <div className="pb-28 [&_*]:rounded-none">
      <header className="border-b-[2px] border-foreground bg-foreground text-background">
        <div className="grid grid-cols-[1fr_auto]">
          <div className="px-5 py-3 font-mono text-xs uppercase tracking-[0.18em]">
            Preferences / 02 of 03
          </div>
          <div className="border-l-[2px] border-background/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em]">
            {SELECTED.size} / 8
          </div>
        </div>
      </header>

      <section className="border-b-[2px] border-foreground px-5 py-7">
        <h1
          className="text-[3rem] font-black uppercase leading-[0.85] tracking-[-0.04em]"
          style={{ fontStretch: 'condensed' }}
        >
          Pick
          <br />
          your
          <br />
          aesthetic.
        </h1>
      </section>

      <ul>
        {AESTHETICS.map((a, i) => {
          const selected = SELECTED.has(a.id);
          return (
            <li
              key={a.id}
              className={`grid grid-cols-[auto_1fr_auto] items-stretch border-b-[2px] border-foreground ${
                selected ? 'bg-foreground text-background' : 'bg-background'
              }`}
            >
              <div className="grid place-items-center border-r-[2px] border-foreground/40 px-4 font-mono text-2xl font-black">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex flex-col justify-center px-4 py-4">
                <div
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
                    selected ? 'opacity-70' : 'text-muted-foreground'
                  }`}
                >
                  [{selected ? 'X' : ' '}] tag · {a.id}
                </div>
                <div className="mt-1 text-xl font-black uppercase leading-none tracking-[-0.03em]">
                  {a.name}
                </div>
              </div>
              <div className="relative aspect-square w-20 overflow-hidden border-l-[2px] border-foreground/40 sm:w-24">
                <img src={imageFor.aesthetic(a.id)} alt="" className="size-full object-cover" />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-foreground text-background pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-[1fr_auto] items-stretch">
          <div className="border-r-[2px] border-background/30 px-5 py-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">
              Selected
            </div>
            <div className="font-mono text-xs uppercase">{SELECTED.size} / 8</div>
          </div>
          <button className="bg-background px-6 py-4 font-mono text-xs font-black uppercase tracking-[0.18em] text-foreground">
            Submit →
          </button>
        </div>
      </div>
    </div>
  );
}
