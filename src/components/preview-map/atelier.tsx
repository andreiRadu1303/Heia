'use client';

import { MAP_RESULTS, imageFor } from '@/lib/preview-mock-data';
import { MapBase } from './_map-base';
import { DraggableSheet } from './_draggable-sheet';

/**
 * ATELIER — Google Map with a vertical brand label on the left,
 * right-aligned title floating top, refined sheet at the bottom.
 */
export function AtelierMap() {
  return (
    <div className="relative h-dvh overflow-hidden">
      <MapBase
        className="absolute inset-0"
        renderPin={(_, i) => (
          <div className="grid size-5 -translate-y-2.5 place-items-center rounded-full bg-foreground font-mono text-[9px] text-background shadow">
            {String(i + 1).padStart(2, '0')}
          </div>
        )}
      />

      {/* Vertical brand label */}
      <div
        className="pointer-events-none absolute inset-y-0 left-2 z-20 flex items-center"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.32em] text-foreground/80">
          ProjectMarket · La carte · 03
        </div>
      </div>

      {/* Right-aligned floating title */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="pointer-events-auto m-3 ml-10 text-right">
          <div className="inline-block bg-background/85 px-3 py-2 backdrop-blur-sm">
            <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              № 03 — Within walking distance
            </div>
          </div>
        </div>
      </div>

      <DraggableSheet
        peekHeight={290}
        expandedHeight={620}
        className="border-t border-foreground/20 bg-background pl-8 shadow-2xl"
        handle={
          <div className="flex items-center justify-end px-4 py-3">
            <div className="h-px w-8 bg-foreground/25" />
            <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              drag for more
            </span>
          </div>
        }
      >
        <div className="px-5 pb-10">
          <ul className="space-y-7">
            {MAP_RESULTS.map((r, i) => {
              const right = i % 2 === 0;
              return (
                <li key={r.id}>
                  <div
                    className={`flex items-end gap-4 ${right ? '' : 'flex-row-reverse text-right'}`}
                  >
                    <div className="w-[35%] max-w-[120px] shrink-0 overflow-hidden">
                      <img
                        src={imageFor.thumb(r.id)}
                        alt=""
                        className="aspect-[3/4] size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                        № {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="mt-2 font-display text-lg leading-tight tracking-tight">
                        {r.name}
                      </h3>
                      <div className="mt-1 text-xs text-muted-foreground">{r.specialty}</div>
                      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {r.distance} · from {r.priceFrom}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </DraggableSheet>
    </div>
  );
}
