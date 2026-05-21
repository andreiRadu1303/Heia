'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { createClient } from '@/lib/supabase/server';

export interface SignupState {
  error?: string;
}

export async function signupAction(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const displayName = String(formData.get('display_name') ?? '').trim();
  const marketingConsent = formData.get('marketing_consent') === 'on';
  const locale = String(formData.get('locale') ?? 'ro');
  const role = formData.get('role') === 'provider' ? 'provider' : 'client';

  if (!email || !password || !displayName) {
    return { error: 'errorGeneric' };
  }

  const supabase = await createClient();
  const headerList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${headerList.get('host') ?? 'localhost:3000'}`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/${locale}/dashboard`,
      data: {
        display_name: displayName,
        locale,
        marketing_consent: marketingConsent,
        role,
      },
    },
  });

  if (error) {
    if (
      error.message.toLowerCase().includes('already registered') ||
      error.message.toLowerCase().includes('user already')
    ) {
      return { error: 'errorEmailInUse' };
    }
    return { error: 'errorGeneric' };
  }

  redirect(`/${locale}/auth/check-email`);
}
