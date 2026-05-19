import { AESTHETICS, imageFor } from '@/lib/preview-mock-data';

const SELECTED = new Set(['soft-glam', 'natural-luxury', 'clean-girl']);

/**
 * MODERN GRID — preferences as a settings panel.
 * Status bar, mono labels, grid of aesthetic cells with hairline
 * borders, "checkbox" markers in [x] / [ ] mono style.
 */
export function EngineeredPreferences() {
  return (
    <div className="pb-28">
      <header className="grid grid-cols-3 border-b border-border bg-background">
        <div className="border-r border-border px-4 py-2.5">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Page
          </div>
          <div className="font-mono text-xs">preferences</div>
        </div>
        <div className="border-r border-border px-4 py-2.5">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Step
          </div>
          <div className="font-mono text-xs">02 / 03</div>
        </div>
        <div className="px-4 py-2.5 text-right">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Selected
          </div>
          <div className="font-mono text-xs">{SELECTED.size} / 8</div>
        </div>
      </header>

      <section className="border-b border-border px-5 py-7">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          aesthetic.toml
        </div>
        <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight">
          Set your style preferences.
        </h1>
      </section>

      <section className="grid grid-cols-2">
        {AESTHETICS.map((a, i) => {
          const selected = SELECTED.has(a.id);
          return (
            <button
              key={a.id}
              type="button"
              className={`relative border-b border-r border-border px-4 py-4 text-left transition-colors [&:nth-child(2n)]:border-r-0 ${
                selected ? 'bg-secondary' : 'bg-background hover:bg-secondary/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  0{i + 1}
                </div>
                <div className="font-mono text-[10px]">[{selected ? 'x' : ' '}]</div>
              </div>
              <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-sm ring-1 ring-border">
                <img
                  src={imageFor.aesthetic(a.id)}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="mt-3 text-sm font-semibold tracking-tight">{a.name}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                tag · {a.id}
              </div>
            </button>
          );
        })}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-[1fr_auto] items-center">
          <div className="border-r border-border px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {SELECTED.size} selected
            </div>
            <div className="truncate font-mono text-[11px]">
              {Array.from(SELECTED).join(', ')}
            </div>
          </div>
          <button className="bg-foreground px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-background">
            Save →
          </button>
        </div>
      </div>
    </div>
  );
}
