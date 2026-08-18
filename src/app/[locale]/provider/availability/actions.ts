'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import type { DayHours } from '@/lib/availability';

export interface HoursState {
  ok?: boolean;
  error?: string;
}

/** Replace the signed-in expert's weekly hours. RLS scopes it to their studio. */
export async function saveHoursAction(locale: string, hours: DayHours[]): Promise<HoursState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You are signed out.' };

  const { data: studio } = await supabase
    .from('studios')
    .select('id')
    .eq('provider_id', user.id)
    .maybeSingle();
  if (!studio) return { error: 'No studio found for your account.' };

  const rows = hours.map((h) => ({
    studio_id: studio.id as string,
    weekday: h.weekday,
    is_open: h.isOpen,
    opens_at: h.opensAt,
    closes_at: h.closesAt,
  }));

  const { error } = await supabase
    .from('provider_hours')
    .upsert(rows, { onConflict: 'studio_id,weekday' });

  if (error) {
    console.error('saveHoursAction failed', error);
    return { error: 'Could not save. Make sure migration 010 has been run.' };
  }

  revalidatePath(`/${locale}/provider/availability`);
  return { ok: true };
}
