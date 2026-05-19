'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DraggableSheetProps {
  /** Height in px when collapsed to "peek" state. */
  peekHeight?: number;
  /** Height in px when fully expanded. */
  expandedHeight?: number;
  /** Sheet container classes (background, border, shadow, radius). */
  className?: string;
  /** Drag handle area. Click/drag on this region moves the sheet. */
  handle?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * A bottom sheet that the user can drag up over the map.
 * - Single pointer-event handler covers mouse + touch + pen.
 * - Snaps to "peek" or "expanded" on release based on midpoint.
 * - Children area is independently scrollable when expanded.
 * - touch-none on the handle so dragging it doesn't pan the page.
 */
export function DraggableSheet({
  peekHeight = 280,
  expandedHeight = 600,
  className,
  handle,
  children,
}: DraggableSheetProps) {
  const [collapsed, setCollapsed] = React.useState(true);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const startY = React.useRef(0);

  const closedTranslate = Math.max(0, expandedHeight - peekHeight);
  const baseTranslate = collapsed ? closedTranslate : 0;
  // Clamp to [0, closedTranslate] — sheet can't go above expanded or below peek.
  const translate = Math.max(0, Math.min(closedTranslate, baseTranslate + dragOffset));

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    startY.current = e.clientY;
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      /* some browsers may not allow capture; safe to ignore */
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragOffset(e.clientY - startY.current);
  };

  const finish = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const finalTranslate = baseTranslate + dragOffset;
    const midpoint = closedTranslate / 2;
    setCollapsed(finalTranslate > midpoint);
    setDragOffset(0);
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* ok */
    }
  };

  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden',
        className,
      )}
      style={{
        height: expandedHeight,
        transform: `translateY(${translate}px)`,
        transition: dragging ? 'none' : 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      <div
        className="shrink-0 touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finish}
        onPointerCancel={finish}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        {handle ?? (
          <div className="flex justify-center py-2.5">
            <div className="h-1 w-10 rounded-full bg-foreground/30" aria-hidden />
          </div>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </div>
  );
}
