'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { createClient } from '@/lib/supabase/server';
import { cityById } from '@/lib/cities';

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
  const cityId = String(formData.get('city') ?? '').trim();

  if (!displayName) return { error: 'Name is required.' };
  if (displayName.length > 80) return { error: 'Name is too long (max 80 characters).' };
  if (cityId && !cityById(cityId)) return { error: 'Unknown city.' };

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
      // Only touch `city` when the form sent one, so the update still works
      // before migration 011 adds the column.
      ...(cityId ? { city: cityId } : {}),
      ...(consentChanged
        ? { marketing_consent_at: marketingConsent ? new Date().toISOString() : null }
        : {}),
    })
    .eq('id', user.id);

  if (error) {
    console.error('updateProfileAction failed', error);
    return {
      error:
        cityId && /city/i.test(error.message)
          ? 'Could not save. Make sure migration 011 has been run.'
          : 'Could not save. Please try again.',
    };
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

const MIN_PASSWORD_LENGTH = 8;

/**
 * Set a new password for the signed-in user. Supabase needs a live session
 * for this; if the project has "secure password change" on and the session
 * is old, it refuses — we point the user to the email reset link instead.
 */
export async function changePasswordAction(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (password !== confirm) return { error: 'Passwords do not match.' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You are signed out. Please sign in again.' };

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error('changePasswordAction failed', error);
    const msg = error.message.toLowerCase();
    if (msg.includes('different from the old')) {
      return { error: 'New password must be different from your current one.' };
    }
    if (msg.includes('reauthentication') || msg.includes('nonce')) {
      return { error: 'For security, please use the "Email me a reset link" option below.' };
    }
    if (msg.includes('weak') || msg.includes('pwned') || msg.includes('leaked')) {
      return { error: 'That password is too weak or has appeared in a data breach. Pick another.' };
    }
    return { error: 'Could not change password. Please try again.' };
  }

  return { ok: true };
}

/**
 * Email the signed-in user a password reset link. The link lands on
 * /auth/confirm, which starts a session and sends them back to the account
 * page with the change-password form open.
 */
export async function sendPasswordResetAction(locale: string): Promise<AccountState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: 'You are signed out. Please sign in again.' };

  const headerList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? `https://${headerList.get('host') ?? 'localhost:3000'}`;

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${origin}/auth/confirm?next=/${locale}/account?reset=1`,
  });

  if (error) {
    console.error('sendPasswordResetAction failed', error);
    return { error: 'Could not send the email. Please try again in a minute.' };
  }

  return { ok: true };
}
