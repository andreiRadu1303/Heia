'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Link as IntlLink } from '@/i18n/navigation';
import {
  PALETTES,
  STYLES,
  type PaletteId,
  type StyleId,
} from '@/lib/preview-mock-data';

type PageKey = 'landing' | 'categories' | 'map' | 'preferences';

const PAGE_TABS: { key: PageKey; label: string }[] = [
  { key: 'landing', label: 'Landing' },
  { key: 'categories', label: 'Categories' },
  { key: 'map', label: 'Map' },
  { key: 'preferences', label: 'Preferences' },
];

export default function PlayPage() {
  const locale = useLocale();
  const [palette, setPalette] = React.useState<PaletteId>('warm-premium');
  const [style, setStyle] = React.useState<StyleId>('editorial');
  const [page, setPage] = React.useState<PageKey>('landing');

  const iframeSrc = `/${locale}/preview/play/render?palette=${palette}&style=${style}&page=${page}`;

  const selectedPalette = PALETTES.find((p) => p.id === palette)!;
  const selectedStyle = STYLES.find((s) => s.id === style)!;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground" data-palette="cool-neutral">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-14 items-center gap-3 sm:h-16">
          <IntlLink
            href="/preview"
            className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            ← preview
          </IntlLink>
          <div className="mx-1 hidden h-4 w-px shrink-0 bg-border sm:block" aria-hidden />
          <nav className="hidden items-center gap-1 sm:flex">
            {PAGE_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setPage(t.key)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  page === t.key
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-secondary',
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden text-right text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
              <div className="font-mono">{selectedPalette.name}</div>
              <div className="font-mono opacity-60">{selectedStyle.name}</div>
            </div>
            <a
              href={iframeSrc}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
            >
              Open
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
        {/* Mobile page tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto px-3 pb-2 sm:hidden">
          {PAGE_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setPage(t.key)}
              className={cn(
                'whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors',
                page === t.key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-secondary',
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Three-column body on desktop, stacked on mobile */}
      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[300px_1fr_300px] lg:gap-0">
        {/* Palette picker — desktop sidebar */}
        <aside className="hidden border-r border-border bg-background lg:block lg:overflow-y-auto">
          <div className="border-b border-border px-5 py-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Palette · {PALETTES.length}
            </div>
            <div className="mt-1 text-sm">Color tokens applied to the frame.</div>
          </div>
          <ul className="divide-y divide-border">
            {PALETTES.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setPalette(p.id)}
                  className={cn(
                    'flex w-full items-center gap-3 px-5 py-3 text-left transition-colors',
                    palette === p.id
                      ? 'bg-secondary'
                      : 'hover:bg-secondary/50',
                  )}
                >
                  <div className="flex shrink-0 overflow-hidden rounded-md ring-1 ring-border">
                    {p.swatches.map((c, i) => (
                      <span key={i} className="block size-6" style={{ backgroundColor: c }} aria-hidden />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium">{p.name}</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                        {p.mode}
                      </span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{p.description}</div>
                  </div>
                  {palette === p.id ? (
                    <div className="size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Preview frame — middle column */}
        <main className="flex flex-col items-center justify-start gap-4 bg-secondary/30 px-3 py-6 lg:py-10">
          {/* Mobile pickers above the frame */}
          <PaletteScroller value={palette} onChange={setPalette} className="lg:hidden" />

          <div className="rounded-[40px] border-[10px] border-foreground/85 bg-foreground/85 shadow-2xl">
            <div className="overflow-hidden rounded-[30px] bg-background">
              <iframe
                key={iframeSrc}
                src={iframeSrc}
                title={`${selectedPalette.name} · ${selectedStyle.name} · ${page}`}
                width={390}
                height={780}
                style={{ width: 390, height: 780, border: 0, display: 'block' }}
              />
            </div>
          </div>

          <StyleScroller value={style} onChange={setStyle} className="lg:hidden" />

          {/* Footer summary */}
          <div className="mt-2 text-center text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{selectedPalette.name}</span>
            <span className="mx-1.5 opacity-50">·</span>
            <span className="font-medium text-foreground">{selectedStyle.name}</span>
            <span className="mx-1.5 opacity-50">·</span>
            <span>{page}</span>
          </div>
        </main>

        {/* Style picker — desktop sidebar */}
        <aside className="hidden border-l border-border bg-background lg:block lg:overflow-y-auto">
          <div className="border-b border-border px-5 py-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Style · {STYLES.length}
            </div>
            <div className="mt-1 text-sm">Typography and treatment.</div>
          </div>
          <ul className="divide-y divide-border">
            {STYLES.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={cn(
                    'block w-full px-5 py-4 text-left transition-colors',
                    style === s.id ? 'bg-secondary' : 'hover:bg-secondary/50',
                  )}
                  data-palette="cool-neutral"
                  data-style={s.id}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{s.name}</span>
                    {style === s.id ? (
                      <span className="size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden />
                    ) : null}
                  </div>
                  <div className="mt-2 font-display text-2xl leading-none">{s.sample}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{s.description}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {s.displayFont}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function PaletteScroller({
  value,
  onChange,
  className,
}: {
  value: PaletteId;
  onChange: (id: PaletteId) => void;
  className?: string;
}) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="flex w-max gap-2 px-1 py-1">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            aria-label={p.name}
            className={cn(
              'flex shrink-0 flex-col gap-1.5 rounded-xl border bg-card p-2 text-left transition-colors',
              value === p.id ? 'border-foreground' : 'border-border',
            )}
          >
            <div className="flex overflow-hidden rounded-md">
              {p.swatches.map((c, i) => (
                <span key={i} className="block size-5" style={{ backgroundColor: c }} aria-hidden />
              ))}
            </div>
            <div className="max-w-[100px] truncate text-[10px] font-medium">{p.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StyleScroller({
  value,
  onChange,
  className,
}: {
  value: StyleId;
  onChange: (id: StyleId) => void;
  className?: string;
}) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="flex w-max gap-2 px-1 py-1">
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            data-palette="cool-neutral"
            data-style={s.id}
            className={cn(
              'flex shrink-0 flex-col gap-1 rounded-xl border bg-card px-3 py-2 text-left transition-colors',
              value === s.id ? 'border-foreground' : 'border-border',
            )}
          >
            <span className="font-display text-base leading-none">{s.sample}</span>
            <span className="text-[10px] font-medium text-foreground/80">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
