import { createClient } from '@/lib/supabase/server';
import { overall } from '@/lib/reviews';

// ---------------------------------------------------------------------------
// Activity feed ("What's new"): new booking requests + new reviews.
// Derived from the bookings/reviews tables, so no notifications table needed.
// ---------------------------------------------------------------------------

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed';

export type ActivityItem =
  | {
      kind: 'booking';
      id: string;
      at: string; // ISO — when it happened (booking created)
      clientName: string;
      serviceName: string;
      scheduledAt: string;
      status: BookingStatus;
    }
  | {
      kind: 'review';
      id: string;
      at: string;
      authorName: string;
      rating: number; // 1..5 (average of sub-scores)
      body: string;
    };

export interface ProviderActivity {
  items: ActivityItem[];
  /** Booking requests still waiting for accept / decline. */
  pendingCount: number;
  /** Reviews received in the last 7 days. */
  newReviewCount: number;
}

interface BookingRow {
  id: string;
  created_at: string;
  scheduled_at: string;
  status: BookingStatus;
  service_name: string;
  client_id: string;
}

interface ReviewRow {
  id: string;
  created_at: string;
  author_id: string;
  score_quality: number;
  score_cleanliness: number;
  score_value: number;
  body: string | null;
}

const DAY_MS = 86_400_000;

/** Recent activity for the expert's studio, newest first (max `limit`). */
export async function getProviderActivity(
  studioId: string,
  limit = 8,
): Promise<ProviderActivity> {
  const supabase = await createClient();
  const since7d = new Date(Date.now() - 7 * DAY_MS).toISOString();
  const since30d = new Date(Date.now() - 30 * DAY_MS).toISOString();

  // Pending requests always show (they need an answer); other bookings and
  // reviews only while they're recent.
  const [{ data: bookingRows }, { data: reviewRows }] = await Promise.all([
    supabase
      .from('bookings')
      .select('id, created_at, scheduled_at, status, service_name, client_id')
      .eq('studio_id', studioId)
      .or(`status.eq.pending,created_at.gte.${since7d}`)
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('reviews')
      .select('id, created_at, author_id, score_quality, score_cleanliness, score_value, body')
      .eq('studio_id', studioId)
      .gte('created_at', since30d)
      .order('created_at', { ascending: false })
      .limit(limit),
  ]);

  const bookings = (bookingRows ?? []) as BookingRow[];
  const reviews = (reviewRows ?? []) as ReviewRow[];

  // Resolve display names in one query (bookings/reviews reference auth.users,
  // which can't be embedded; profiles are publicly readable).
  const ids = Array.from(new Set([...bookings.map((b) => b.client_id), ...reviews.map((r) => r.author_id)]));
  const nameById = new Map<string, string>();
  if (ids.length > 0) {
    const { data: profiles } = await supabase.from('profiles').select('id, display_name').in('id', ids);
    for (const p of (profiles ?? []) as { id: string; display_name: string | null }[]) {
      nameById.set(p.id, p.display_name?.trim() || 'Client');
    }
  }

  const items: ActivityItem[] = [
    ...bookings.map<ActivityItem>((b) => ({
      kind: 'booking',
      id: b.id,
      at: b.created_at,
      clientName: nameById.get(b.client_id) ?? 'Client',
      serviceName: b.service_name,
      scheduledAt: b.scheduled_at,
      status: b.status,
    })),
    ...reviews.map<ActivityItem>((r) => ({
      kind: 'review',
      id: r.id,
      at: r.created_at,
      authorName: nameById.get(r.author_id) ?? 'Client',
      rating: overall({
        quality: r.score_quality,
        cleanliness: r.score_cleanliness,
        value: r.score_value,
      }),
      body: r.body ?? '',
    })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, limit);

  return {
    items,
    pendingCount: bookings.filter((b) => b.status === 'pending').length,
    newReviewCount: reviews.filter((r) => r.created_at >= since7d).length,
  };
}

// ---------------------------------------------------------------------------
// Monthly series: bookings + net profit per month for the last N months.
// ---------------------------------------------------------------------------

export interface MonthStats {
  /** Short label for the axis, e.g. "Oct". */
  label: string;
  /** Full label for tables / tooltips, e.g. "October 2026". */
  fullLabel: string;
  /** Bookings scheduled in the month that weren't declined/cancelled. */
  bookings: number;
  completed: number;
  /** Sum of booking prices (lei) for those bookings — what was booked. */
  bookedValueLei: number;
  /** Card payments received minus Heia's fee (lei), refunds excluded. */
  netLei: number;
}

export interface MonthlySummary {
  /** Oldest → newest; the last entry is the current month. */
  months: MonthStats[];
  thisMonth: MonthStats;
  lastMonth: MonthStats;
}

interface BookingStatRow {
  scheduled_at: string;
  status: string;
  price_lei: number;
}

interface PaymentRow {
  created_at: string;
  amount_total: number;
  application_fee: number;
  status: string;
}

function monthStart(d: Date, offsetMonths = 0): Date {
  return new Date(d.getFullYear(), d.getMonth() + offsetMonths, 1);
}

/** Local 'YYYY-MM-DDTHH:MM:SS' — bookings.scheduled_at is stored naive-local. */
function toNaiveLocal(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 19);
}

export async function getMonthlySummary(
  studioId: string,
  locale: string,
  monthCount = 6,
): Promise<MonthlySummary> {
  const supabase = await createClient();
  const now = new Date();
  const startFirst = monthStart(now, -(monthCount - 1));
  const startNext = monthStart(now, 1);

  // Two queries covering the whole window; bucketing happens in memory.
  const [{ data: bookingRows }, { data: paymentRows }] = await Promise.all([
    supabase
      .from('bookings')
      .select('scheduled_at, status, price_lei')
      .eq('studio_id', studioId)
      .gte('scheduled_at', toNaiveLocal(startFirst))
      .lt('scheduled_at', toNaiveLocal(startNext)),
    supabase
      .from('payments')
      .select('created_at, amount_total, application_fee, status')
      .eq('studio_id', studioId)
      .eq('status', 'paid')
      .gte('created_at', startFirst.toISOString())
      .lt('created_at', startNext.toISOString()),
  ]);

  const bookings = (bookingRows ?? []) as BookingStatRow[];
  const payments = (paymentRows ?? []) as PaymentRow[];

  const months: MonthStats[] = [];
  for (let i = monthCount - 1; i >= 0; i--) {
    const from = monthStart(now, -i);
    const to = monthStart(now, -i + 1);
    const fromLocal = toNaiveLocal(from);
    const toLocal = toNaiveLocal(to);
    const inMonth = bookings.filter(
      (b) =>
        b.scheduled_at >= fromLocal &&
        b.scheduled_at < toLocal &&
        b.status !== 'declined' &&
        b.status !== 'cancelled',
    );
    const paid = payments.filter(
      (p) => p.created_at >= from.toISOString() && p.created_at < to.toISOString(),
    );
    months.push({
      label: from.toLocaleDateString(locale, { month: 'short' }).replace('.', ''),
      fullLabel: from.toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
      bookings: inMonth.length,
      completed: inMonth.filter((b) => b.status === 'completed').length,
      bookedValueLei: inMonth.reduce((sum, b) => sum + (b.price_lei ?? 0), 0),
      netLei: Math.round(
        paid.reduce((sum, p) => sum + (p.amount_total - p.application_fee), 0) / 100,
      ),
    });
  }

  return {
    months,
    thisMonth: months[months.length - 1],
    lastMonth: months[months.length - 2] ?? months[months.length - 1],
  };
}
