'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export interface ServiceInput {
  id: string; // real uuid for existing rows, or a "tmp-…" placeholder for new ones
  name: string;
  durationMin: number;
  priceLei: number;
}

export interface ServicesState {
  ok?: boolean;
  error?: string;
}

/**
 * Reconcile the expert's full service list against the DB: update existing
 * rows, insert new ones, delete removed ones. Scoped to the owner's studio;
 * RLS ("Services: providers manage own") enforces ownership on every write.
 */
export async function saveServicesAction(
  locale: string,
  services: ServiceInput[],
): Promise<ServicesState> {
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
  const studioId = studio.id as string;

  const { data: existingRows } = await supabase
    .from('services')
    .select('id')
    .eq('studio_id', studioId);
  const existingIds = new Set((existingRows ?? []).map((r) => r.id as string));

  const clean = services
    .map((s) => ({
      id: s.id,
      name: s.name.trim(),
      durationMin: Math.max(1, Math.round(s.durationMin) || 0),
      priceLei: Math.max(0, Math.round(s.priceLei) || 0),
    }))
    .filter((s) => s.name.length > 0);

  const keptIds = new Set(clean.filter((s) => existingIds.has(s.id)).map((s) => s.id));
  const toDelete = [...existingIds].filter((id) => !keptIds.has(id));

  if (toDelete.length > 0) {
    const { error } = await supabase.from('services').delete().in('id', toDelete);
    if (error) {
      console.error('saveServices delete failed', error);
      return { error: 'Could not save. Please try again.' };
    }
  }

  for (let i = 0; i < clean.length; i++) {
    const s = clean[i];
    const payload = {
      name: s.name,
      duration_min: s.durationMin,
      price_lei: s.priceLei,
      sort_order: i,
    };
    const { error } = existingIds.has(s.id)
      ? await supabase.from('services').update(payload).eq('id', s.id)
      : await supabase.from('services').insert({ studio_id: studioId, ...payload });
    if (error) {
      console.error('saveServices upsert failed', error);
      return { error: 'Could not save — check for duplicate service names.' };
    }
  }

  // Keep the denormalised "from" price in sync (cheapest service).
  const priceFrom = clean.length > 0 ? Math.min(...clean.map((s) => s.priceLei)) : 0;
  await supabase.from('studios').update({ price_from_lei: priceFrom }).eq('id', studioId);

  revalidatePath(`/${locale}/provider/services`);
  revalidatePath(`/${locale}/provider`);
  return { ok: true };
}
