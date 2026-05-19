import { AESTHETICS, imageFor } from '@/lib/preview-mock-data';

const SELECTED = new Set(['soft-glam', 'natural-luxury', 'clean-girl']);

/**
 * EDITORIAL MAGAZINE — preferences as an "On your style" article.
 * Italic display headline, drop-capped lead paragraph, aesthetic
 * options as numbered photo-articles separated by hairlines.
 */
export function EditorialPreferences() {
  return (
    <div className="pb-32">
      <header className="border-b border-foreground/15 px-5 pt-4 pb-3">
        <div className="flex items-baseline justify-between">
          <div className="font-display text-lg italic tracking-tight">On your style</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            Article 02 · Step 2/3
          </div>
        </div>
      </header>

      <section className="px-5 pt-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Essay 02
        </div>
        <h1 className="mt-2 font-display text-3xl italic leading-tight tracking-tight sm:text-4xl">
          What feels like <em>you</em>?
        </h1>
        <p className="mt-5 text-base leading-[1.75] text-foreground">
          <span className="float-left mr-2 mt-1 font-display text-[3rem] italic leading-[0.85] text-accent">
            P
          </span>
          ick the aesthetics that resonate. We&rsquo;ll quietly use them to surface the right
          artists. Never to box you in, never to push.
        </p>
      </section>

      <hr className="mx-5 my-8 border-foreground/15" />

      <section className="px-5">
        <ul className="divide-y divide-foreground/15">
          {AESTHETICS.map((a, i) => {
            const selected = SELECTED.has(a.id);
            return (
              <li key={a.id} className="flex items-start gap-4 py-5">
                <div className="grid size-7 shrink-0 place-items-center rounded-full border border-foreground/40 font-mono text-[10px]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="aspect-[3/4] w-20 shrink-0 overflow-hidden">
                  <img
                    src={imageFor.aesthetic(a.id)}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg italic leading-tight tracking-tight">
                    {a.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.desc}</p>
                  <div
                    className={`mt-2 font-mono text-[10px] uppercase tracking-[0.22em] ${
                      selected ? 'text-accent' : 'text-muted-foreground'
                    }`}
                  >
                    {selected ? '— selected' : 'tap to add'}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-foreground/15 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {SELECTED.size} of 8 selected
          </div>
          <button className="font-display text-base italic tracking-tight text-accent">
            Confirm style →
          </button>
        </div>
      </div>
    </div>
  );
}
