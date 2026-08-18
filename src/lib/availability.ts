import { createClient } from '@/lib/supabase/server';

export interface DayHours {
  weekday: number; // 0 = Sunday … 6 = Saturday
  isOpen: boolean;
  opensAt: string; // 'HH:MM'
  closesAt: string;
}

export const DEFAULT_HOURS: DayHours[] = [
  { weekday: 1, isOpen: true, opensAt: '09:00', closesAt: '18:00' },
  { weekday: 2, isOpen: true, opensAt: '09:00', closesAt: '18:00' },
  { weekday: 3, isOpen: true, opensAt: '09:00', closesAt: '18:00' },
  { weekday: 4, isOpen: true, opensAt: '09:00', closesAt: '18:00' },
  { weekday: 5, isOpen: true, opensAt: '09:00', closesAt: '18:00' },
  { weekday: 6, isOpen: true, opensAt: '10:00', closesAt: '16:00' },
  { weekday: 0, isOpen: false, opensAt: '10:00', closesAt: '16:00' },
];

interface HoursRow {
  weekday: number;
  is_open: boolean;
  opens_at: string;
  closes_at: string;
}

/** Weekly hours for a studio, ordered Mon→Sun. Falls back to defaults. */
export async function getStudioHours(studioId: string): Promise<DayHours[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('provider_hours')
    .select('weekday, is_open, opens_at, closes_at')
    .eq('studio_id', studioId);

  const rows = (data ?? []) as HoursRow[];
  if (rows.length === 0) return DEFAULT_HOURS;

  const byDay = new Map(rows.map((r) => [r.weekday, r]));
  // Monday-first ordering for display.
  return [1, 2, 3, 4, 5, 6, 0].map((weekday) => {
    const r = byDay.get(weekday);
    return {
      weekday,
      isOpen: r?.is_open ?? false,
      opensAt: r?.opens_at ?? '09:00',
      closesAt: r?.closes_at ?? '18:00',
    };
  });
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function toHHMM(minutes: number): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Bookable start times for a studio on a given date, given the service length.
 *
 * Slots run from opening to closing (stepped by the service duration, minimum
 * 30 min) and exclude any time that would overlap an existing pending/confirmed
 * booking — so the same slot can't be double-booked. Past times on today's date
 * are also removed.
 */
export async function getAvailableSlots(
  studioId: string,
  dateISO: string, // 'YYYY-MM-DD'
  durationMin: number,
): Promise<string[]> {
  const supabase = await createClient();
  const date = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(date.getTime())) return [];

  const hours = await getStudioHours(studioId);
  const day = hours.find((h) => h.weekday === date.getDay());
  if (!day || !day.isOpen) return [];

  const step = Math.max(30, durationMin || 60);
  const open = toMinutes(day.opensAt);
  const close = toMinutes(day.closesAt);

  // Existing bookings that still hold a slot.
  const { data: taken } = await supabase
    .from('bookings')
    .select('scheduled_at, duration_min, status')
    .eq('studio_id', studioId)
    .in('status', ['pending', 'confirmed'])
    .gte('scheduled_at', `${dateISO}T00:00:00`)
    .lte('scheduled_at', `${dateISO}T23:59:59`);

  const busy = ((taken ?? []) as { scheduled_at: string; duration_min: number }[]).map((b) => {
    const start = toMinutes(b.scheduled_at.slice(11, 16));
    return { start, end: start + (b.duration_min || 60) };
  });

  // Don't offer times that have already passed today.
  const now = new Date();
  const isToday = now.toISOString().slice(0, 10) === dateISO;
  const cutoff = isToday ? now.getHours() * 60 + now.getMinutes() : -1;

  const slots: string[] = [];
  for (let t = open; t + (durationMin || 60) <= close; t += step) {
    if (t <= cutoff) continue;
    const overlaps = busy.some((b) => t < b.end && t + (durationMin || 60) > b.start);
    if (!overlaps) slots.push(toHHMM(t));
  }
  return slots;
}
