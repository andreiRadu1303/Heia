'use server';

import { createClient } from '@/lib/supabase/server';
import { getAvailableSlots } from '@/lib/availability';

/**
 * Bookable start times for a studio on a date, for a specific service.
 * Returns [] when the studio is closed that day or everything is taken.
 */
export async function getSlotsAction(
  studioSlug: string,
  dateISO: string,
  serviceId: string,
): Promise<string[]> {
  if (!studioSlug || !dateISO || !serviceId) return [];

  const supabase = await createClient();
  const { data: studio } = await supabase
    .from('studios')
    .select('id')
    .eq('slug', studioSlug)
    .maybeSingle();
  if (!studio) return [];

  const { data: service } = await supabase
    .from('services')
    .select('duration_min')
    .eq('id', serviceId)
    .eq('studio_id', studio.id)
    .maybeSingle();
  if (!service) return [];

  return getAvailableSlots(studio.id as string, dateISO, service.duration_min as number);
}
