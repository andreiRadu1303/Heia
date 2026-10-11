'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { createClient } from '@/lib/supabase/server';

export interface ForgotState {
  /** Step 2 is shown once a code has been sent to this email. */
  sentTo?: string;
  /** Translation key under the `Auth` namespace. */
  error?: string;
}

const MIN_PASSWORD_LENGTH = 6; // matches signup (Auth.passwordHint)

/**
 * Step 1 — email the user a one-time recovery code. Supabase's recovery
 * email carries both a 6-digit code ({{ .Token }}) and a link; we use the
 * code here, and the link still works as a fallback (it lands on My Account
 * with the change-password form open).
 */
export async function requestResetCodeAction(
  _prev: ForgotState,
  formData: FormData,
): Promise<ForgotState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const locale = String(formData.get('locale') ?? 'ro');
  if (!email) return { error: 'errorGeneric' };

  const supabase = await createClient();
  const headerList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? `https://${headerList.get('host') ?? 'localhost:3000'}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/${locale}/account?reset=1`,
  });

  if (error) {
    console.error('requestResetCodeAction failed', error);
    const msg = error.message.toLowerCase();
    if (msg.includes('rate limit') || msg.includes('too many')) return { error: 'errorRateLimit' };
    return { error: 'errorGeneric' };
  }

  // Deliberately the same outcome whether or not the email exists, so the
  // form can't be used to probe for accounts.
  return { sentTo: email };
}

/**
 * Step 2 — verify the code (OTP, type "recovery"), which signs the user in,
 * then set the new password on that session. Ends on the dashboard.
 */
export async function resetPasswordWithCodeAction(
  _prev: ForgotState,
  formData: FormData,
): Promise<ForgotState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const code = String(formData.get('code') ?? '').replace(/\D/g, '');
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');
  const locale = String(formData.get('locale') ?? 'ro');

  const keep: ForgotState = { sentTo: email };
  if (!email || code.length < 6) return { ...keep, error: 'errorInvalidCode' };
  if (password.length < MIN_PASSWORD_LENGTH) return { ...keep, error: 'errorPasswordShort' };
  if (password !== confirm) return { ...keep, error: 'errorPasswordMismatch' };

  const supabase = await createClient();

  const { error: otpError } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'recovery',
  });
  if (otpError) {
    console.error('resetPasswordWithCodeAction: verifyOtp failed', otpError);
    return { ...keep, error: 'errorInvalidCode' };
  }

  const { error: updError } = await supabase.auth.updateUser({ password });
  if (updError) {
    console.error('resetPasswordWithCodeAction: updateUser failed', updError);
    const msg = updError.message.toLowerCase();
    if (msg.includes('different from the old')) return { ...keep, error: 'errorSamePassword' };
    if (msg.includes('weak') || msg.includes('pwned') || msg.includes('leaked')) {
      return { ...keep, error: 'errorWeakPassword' };
    }
    return { ...keep, error: 'errorGeneric' };
  }

  // The OTP exchange created a session, so the user is signed in now.
  redirect(`/${locale}/dashboard`);
}
