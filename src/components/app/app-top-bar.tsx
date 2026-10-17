import { ChevronLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BackButton } from './back-button';

/**
 * Sticky top bar for the app-loop pages. Back chevron + title + optional
 * step indicator. Soft Wellness styling inherited from the global theme.
 *
 * `historyBack` makes the chevron return to the page the visitor came from
 * (browser history), using `backHref` only when there is no history — for
 * pages reachable from many places, like a studio profile.
 */
export function AppTopBar({
  title,
  backHref,
  step,
  historyBack = false,
}: {
  title?: string;
  backHref?: string;
  step?: string;
  historyBack?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="container flex h-14 items-center gap-2">
        {backHref && historyBack ? (
          <BackButton fallback={backHref} />
        ) : backHref ? (
          <Link
            href={backHref}
            aria-label="Back"
            className="-ml-2 grid size-9 place-items-center rounded-full text-foreground/80 hover:bg-secondary"
          >
            <ChevronLeft className="size-5" />
          </Link>
        ) : null}
        <div className="flex-1 truncate font-medium tracking-tight">{title}</div>
        {step ? (
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {step}
          </div>
        ) : null}
      </div>
    </header>
  );
}
