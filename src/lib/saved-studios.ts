import { createClient } from '@/lib/supabase/server';
import { STUDIO_LIST_COLUMNS, mapStudioRow, type StudioListRow } from '@/lib/discover-server';
import type { Studio } from '@/lib/app-mock-data';

/** Whether the signed-in user has saved the studio with this slug. */
export async function isStudioSaved(slug: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  // RLS limits rows to the user's own saves, so matching the slug is enough.
  const { data } = await supabase
    .from('saved_studios')
    .select('studio_id, studios!inner(slug)')
    .eq('studios.slug', slug)
    .limit(1);

  return (data ?? []).length > 0;
}

/** The signed-in user's saved studios, most recently saved first. */
export async function getSavedStudios(): Promise<Studio[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('saved_studios')
    .select(`created_at, studios(${STUDIO_LIST_COLUMNS})`)
    .order('created_at', { ascending: false });

  const rows = (data ?? []) as unknown as { studios: StudioListRow | null }[];
  return rows.flatMap((r) => (r.studios ? [mapStudioRow(r.studios)] : []));
}
