'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export interface StudioMedia {
  avatarUrl: string | null;
  coverUrl: string | null;
  galleryUrls: string[];
}

export interface MediaResult {
  ok: boolean;
  error?: string;
}

/**
 * Persist the studio's photo URLs (files themselves are uploaded to Supabase
 * Storage from the client). RLS restricts the update to the owner's row.
 */
export async function saveStudioMediaAction(
  locale: string,
  media: StudioMedia,
): Promise<MediaResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You are signed out.' };

  const { error } = await supabase
    .from('studios')
    .update({
      avatar_url: media.avatarUrl,
      cover_url: media.coverUrl,
      gallery_urls: media.galleryUrls,
    })
    .eq('provider_id', user.id);

  if (error) {
    console.error('saveStudioMediaAction failed', error);
    return { ok: false, error: 'Could not save photos. Make sure migration 008 has been run.' };
  }

  revalidatePath(`/${locale}/provider/profile`);
  revalidatePath(`/${locale}/provider`);
  return { ok: true };
}
