'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export interface SaveResult {
  ok: boolean;
  saved?: boolean;
  error?: string;
}

/**
 * Save or unsave a studio for the signed-in client. Looks the studio up by
 * slug (what the UI has), then inserts or deletes the (user, studio) row.
 * RLS guarantees users only touch their own saves.
 */
export async function toggleSaveStudioAction(
  locale: string,
  slug: string,
  save: boolean,
): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sign in to save studios.' };

  const { data: studio } = await supabase
    .from('studios')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (!studio) return { ok: false, error: 'Studio not found.' };

  const { error } = save
    ? await supabase
        .from('saved_studios')
        .upsert({ user_id: user.id, studio_id: studio.id }, { onConflict: 'user_id,studio_id' })
    : await supabase
        .from('saved_studios')
        .delete()
        .eq('user_id', user.id)
        .eq('studio_id', studio.id);

  if (error) {
    console.error('toggleSaveStudioAction failed', error);
    return { ok: false, error: 'Could not save. Make sure migration 012 has been run.' };
  }

  revalidatePath(`/${locale}/saved`);
  revalidatePath(`/${locale}/studio/${slug}`);
  return { ok: true, saved: save };
}
