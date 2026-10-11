'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export interface AccountState {
  ok?: boolean;
  error?: string;
}

/**
 * Save the signed-in user's own profile fields. RLS ("Users can update own
 * profile") guarantees the update only touches their own row.
 */
export async function updateProfileAction(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const locale = String(formData.get('locale') ?? 'ro');
  const displayName = String(formData.get('display_name') ?? '').trim();
  const marketingConsent = formData.get('marketing_consent') === 'on';

  if (!displayName) return { error: 'Name is required.' };
  if (displayName.length > 80) return { error: 'Name is too long (max 80 characters).' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You are signed out. Please sign in again.' };

  // Only stamp consent time when the user turns marketing on; clear it when off.
  const { data: current } = await supabase
    .from('profiles')
    .select('marketing_consent')
    .eq('id', user.id)
    .maybeSingle();

  const consentChanged = (current?.marketing_consent ?? false) !== marketingConsent;

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName,
      marketing_consent: marketingConsent,
      ...(consentChanged
        ? { marketing_consent_at: marketingConsent ? new Date().toISOString() : null }
        : {}),
    })
    .eq('id', user.id);

  if (error) {
    console.error('updateProfileAction failed', error);
    return { error: 'Could not save. Please try again.' };
  }

  revalidatePath(`/${locale}/account`);
  revalidatePath(`/${locale}/dashboard`);
  return { ok: true };
}

/**
 * Persist the user's profile photo URL (the file itself is uploaded to
 * Supabase Storage from the client). Pass `null` to remove the photo.
 */
export async function saveAvatarAction(
  locale: string,
  avatarUrl: string | null,
): Promise<AccountState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You are signed out. Please sign in again.' };

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', user.id);

  if (error) {
    console.error('saveAvatarAction failed', error);
    return { error: 'Could not save photo. Please try again.' };
  }

  revalidatePath(`/${locale}/account`);
  revalidatePath(`/${locale}/dashboard`);
  return { ok: true };
}
