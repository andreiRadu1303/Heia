'use client';

import { Sparkles, Search, SlidersHorizontal } from 'lucide-react';
import { MAP_RESULTS, imageFor } from '@/lib/preview-mock-data';
import { MapBase } from './_map-base';
import { DraggableSheet } from './_draggable-sheet';

/**
 * GLASS — Google Map under floating frosted chrome; draggable
 * glass drawer with backdrop-blur, sparkles on the highlighted
 * pin and on the active result.
 */
export function GlassMap() {
  return (
    <div className="relative h-dvh overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, hsl(var(--accent)) 0%, hsl(var(--background)) 35%, hsl(var(--muted)) 65%, hsl(var(--accent) / 0.6) 100%)',
        }}
        aria-hidden
      />

      <MapBase
        className="absolute inset-0"
        renderPin={(r, i) => (
          <div
            className={`flex -translate-y-1.5 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium shadow-lg backdrop-blur-xl ${
              i === 0
                ? 'border-border/40 bg-accent/85 text-accent-foreground'
                : 'border-border/40 bg-card/70 text-foreground'
            }`}
          >
            {i === 0 ? <Sparkles className="size-3" /> : null}
            {r.priceFrom}
          </div>
        )}
      />

      {/* Floating glass top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3">
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex h-11 flex-1 items-center gap-2 rounded-2xl border border-border/40 bg-card/30 px-4 shadow-lg backdrop-blur-xl">
            <Search className="size-4 text-muted-foreground" />
            <span className="truncate text-sm text-foreground/80">Hair · Soft Glam · 3 km</span>
          </div>
          <button
            className="grid size-11 place-items-center rounded-2xl border border-border/40 bg-card/30 shadow-lg backdrop-blur-xl"
            aria-label="Filters"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>
        <div className="pointer-events-auto -mr-3 mt-2 overflow-x-auto">
          <div className="flex w-max gap-2 pb-1">
            {['Open now', '★ 4.5+', 'Verified', 'Under €60'].map((c, i) => (
              <span
                key={c}
                className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1 text-xs shadow-sm backdrop-blur-md ${
                  i === 0
                    ? 'border-transparent bg-foreground text-background'
                    : 'border-border/40 bg-card/30 text-foreground/80'
                }`}
              >
                {i === 0 ? <Sparkles className="size-3" /> : null}
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <DraggableSheet
        peekHeight={290}
        expandedHeight={620}
        className="mx-3 mb-3 rounded-3xl border border-border/40 bg-card/40 shadow-2xl backdrop-blur-2xl"
        handle={
          <div className="flex flex-col items-center gap-1.5 py-3">
            <div className="h-1 w-10 rounded-full bg-foreground/30" aria-hidden />
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="size-3 text-accent" />
              {MAP_RESULTS.length} near you
            </div>
          </div>
        }
      >
        <div className="space-y-2 px-3 pb-8">
          {MAP_RESULTS.map((r, i) => (
            <div
              key={r.id}
              className={`flex items-center gap-3 rounded-2xl border p-2.5 backdrop-blur-md ${
                i === 0 ? 'border-border/40 bg-foreground/10' : 'border-transparent bg-transparent'
              }`}
            >
              <img
                src={imageFor.thumb(r.id)}
                alt=""
                className="size-12 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="truncate text-sm font-medium">{r.name}</div>
                  {i === 0 ? <Sparkles className="size-3 shrink-0 text-accent" /> : null}
                </div>
                <div className="truncate text-xs text-foreground/70">{r.specialty}</div>
                <div className="mt-0.5 text-xs text-foreground/60">
                  ★ {r.rating} · {r.distance}
                </div>
              </div>
              <div className="text-xs font-medium">{r.priceFrom}</div>
            </div>
          ))}
        </div>
      </DraggableSheet>
    </div>
  );
}
