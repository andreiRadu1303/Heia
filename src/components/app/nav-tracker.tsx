'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

export const NAV_DEPTH_KEY = 'heia:nav-depth';

/**
 * Counts in-app route changes in this tab (sessionStorage) so BackButton can
 * tell "there's an in-app page behind me" from "this was a deep link".
 * `document.referrer` can't be used: it doesn't change on client-side
 * navigations. Renders nothing.
 */
export function NavTracker() {
  const pathname = usePathname();
  const first = React.useRef(true);

  React.useEffect(() => {
    if (first.current) {
      first.current = false; // initial load isn't a navigation
      return;
    }
    try {
      const depth = Number(sessionStorage.getItem(NAV_DEPTH_KEY) ?? '0');
      sessionStorage.setItem(NAV_DEPTH_KEY, String(depth + 1));
    } catch {
      // sessionStorage unavailable (private mode etc.) — back falls back to href.
    }
  }, [pathname]);

  return null;
}

/** True when at least one in-app navigation happened in this tab. */
export function hasInAppHistory(): boolean {
  try {
    return Number(sessionStorage.getItem(NAV_DEPTH_KEY) ?? '0') > 0 && window.history.length > 1;
  } catch {
    return false;
  }
}
