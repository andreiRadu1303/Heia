'use client';

import { MAP_RESULTS, imageFor } from '@/lib/preview-mock-data';
import { MapBase } from './_map-base';
import { DraggableSheet } from './_draggable-sheet';

/**
 * EDITORIAL — Google Map fills the page; a hairline-edged sheet
 * with an italic serif "drag" label sits at the bottom.
 */
export function EditorialMap() {
  return (
    <div className="relative h-dvh overflow-hidden">
      <MapBase
        className="absolute inset-0"
        renderPin={(_, i) => (
          <div
            className={`rounded-full border border-foreground/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] shadow-sm ${
              i === 0 ? 'bg-foreground text-background' : 'bg-background text-foreground'
            }`}
          >
            {String(i + 1).padStart(2, '0')}
          </div>
        )}
      />

      {/* Floating top label */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="pointer-events-auto m-3">
          <div className="inline-flex items-center gap-2 border border-foreground/20 bg-background/90 px-3 py-2 backdrop-blur-sm">
            <div className="font-display text-base italic tracking-tight">Field guide</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Section III · 03
            </div>
          </div>
        </div>
      </div>

      <DraggableSheet
        peekHeight={280}
        expandedHeight={620}
        className="border-t border-foreground/15 bg-background shadow-2xl"
        handle={
          <div className="flex flex-col items-center gap-1.5 py-3">
            <div className="h-px w-12 bg-foreground/25" />
            <div className="font-display text-xs italic text-muted-foreground">drag</div>
          </div>
        }
      >
        <div className="px-5 pb-8">
          <div className="flex items-baseline gap-3 border-t border-foreground/15 pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Listings · {MAP_RESULTS.length}
            </span>
            <div className="h-px flex-1 bg-foreground/15" />
          </div>
          <ul className="divide-y divide-foreground/15">
            {MAP_RESULTS.map((r, i) => (
              <li key={r.id} className="flex items-start gap-4 py-4">
                <div className="grid size-7 shrink-0 place-items-center rounded-full border border-foreground/40 font-mono text-[10px]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <img
                  src={imageFor.thumb(r.id)}
                  alt=""
                  className="aspect-[3/4] w-14 shrink-0 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base italic leading-tight tracking-tight">
                    {r.name}
                  </h3>
                  <div className="text-xs text-muted-foreground">{r.specialty}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    ★ {r.rating} · {r.distance} · from {r.priceFrom}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DraggableSheet>
    </div>
  );
}
