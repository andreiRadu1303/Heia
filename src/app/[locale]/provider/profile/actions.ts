'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export interface ProfileState {
  ok?: boolean;
  error?: string;
}

/**
 * Save the signed-in expert's studio profile. RLS ("Studios: providers update
 * own") guarantees the update only touches their own row.
 */
export async function saveProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const locale = String(formData.get('locale') ?? 'ro');
  const name = String(formData.get('name') ?? '').trim();
  const tagline = String(formData.get('tagline') ?? '').trim();
  const categoryId = String(formData.get('category_id') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const address = String(formData.get('address') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();
  const knownForRaw = String(formData.get('known_for') ?? '');
  const isPublished = formData.get('is_published') === 'on';

  if (!name) return { error: 'Studio name is required.' };

  const knownFor = knownForRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You are signed out. Please sign in again.' };

  const { error } = await supabase
    .from('studios')
    .update({
      name,
      tagline: tagline || null,
      category_id: categoryId || 'hair',
      city: city || null,
      address: address || null,
      bio: bio || null,
      known_for: knownFor,
      is_published: isPublished,
    })
    .eq('provider_id', user.id);

  if (error) {
    console.error('saveProfileAction failed', error);
    return { error: 'Could not save. Please try again.' };
  }

  revalidatePath(`/${locale}/provider/profile`);
  revalidatePath(`/${locale}/provider`);
  return { ok: true };
}
