import { Link } from '@/i18n/navigation';
import { img, formatBookingDate } from '@/lib/app-mock-data';
import { cn } from '@/lib/utils';
import { cancelMyBookingAction } from '@/app/[locale]/(app)/dashboard/actions';

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed';

export interface BookingWithStudio {
  id: string;
  scheduled_at: string;
  status: BookingStatus;
  service_name: string;
  studios: {
    slug: string;
    name: string;
    hero_seed: string | null;
    cover_url: string | null;
  } | null;
}

/**
 * One booking row for the client's lists (My Bookings). Server component:
 * the cancel form posts straight to the server action.
 */
export function BookingCard({ booking: b, locale }: { booking: BookingWithStudio; locale: string }) {
  const studio = b.studios;
  const datePart = b.scheduled_at.slice(0, 10);
  const timePart = b.scheduled_at.slice(11, 16);
  const cancellable = b.status === 'pending' || b.status === 'confirmed';
  const thumb = studio?.cover_url || (studio?.hero_seed ? img.square(studio.hero_seed) : null);

  return (
    <div className="rounded-3xl bg-card ring-1 ring-border">
      <Link
        href={studio ? `/studio/${studio.slug}` : '/dashboard'}
        className="flex items-center gap-3 p-3"
      >
        {thumb ? (
          <img src={thumb} alt="" className="size-16 shrink-0 rounded-2xl object-cover" />
        ) : (
          <div
            className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent/30 to-secondary text-lg font-medium text-foreground/60"
            aria-hidden
          >
            {(studio?.name ?? 'S').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{studio?.name ?? 'Studio'}</div>
          <div className="truncate text-sm text-muted-foreground">{b.service_name}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {formatBookingDate(datePart, locale)} · {timePart}
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize',
            b.status === 'pending' && 'bg-accent/15 text-foreground',
            b.status === 'confirmed' && 'bg-secondary text-secondary-foreground',
            b.status === 'declined' && 'bg-muted text-muted-foreground',
            b.status === 'cancelled' && 'bg-muted text-muted-foreground',
            b.status === 'completed' && 'bg-foreground text-background',
          )}
        >
          {b.status}
        </span>
      </Link>

      {cancellable ? (
        <form action={cancelMyBookingAction} className="border-t border-border px-3 py-2">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="bookingId" value={b.id} />
          <button
            type="submit"
            className="text-xs font-medium text-muted-foreground hover:text-destructive"
          >
            Cancel booking
          </button>
        </form>
      ) : null}
    </div>
  );
}
