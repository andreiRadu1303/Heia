'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { createClient } from '@/lib/supabase/server';

export interface LoginState {
  error?: string;
  magicLinkSent?: boolean;
}

export async function passwordLoginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const locale = String(formData.get('locale') ?? 'ro');

  if (!email || !password) return { error: 'errorGeneric' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes('email not confirmed')) {
      return { error: 'errorEmailNotConfirmed' };
    }
    if (message.includes('invalid login credentials') || message.includes('invalid')) {
      return { error: 'errorInvalidCredentials' };
    }
    return { error: 'errorGeneric' };
  }

  // Route each role to its own home — experts go straight to /provider
  // (no dashboard flash), clients to /dashboard.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let destination = `/${locale}/dashboard`;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (profile?.role === 'provider') destination = `/${locale}/provider`;
  }

  redirect(destination);
}

export async function magicLinkLoginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const locale = String(formData.get('locale') ?? 'ro');

  if (!email) return { error: 'errorGeneric' };

  const supabase = await createClient();
  const headerList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${headerList.get('host') ?? 'localhost:3000'}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/${locale}/dashboard`,
    },
  });

  if (error) {
    return { error: 'errorGeneric' };
  }

  return { magicLinkSent: true };
}
