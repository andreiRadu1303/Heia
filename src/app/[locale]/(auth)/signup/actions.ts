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

  // Where the user should end up after signing up. Providers go to /provider,
  // which forwards first-timers into onboarding; clients to /dashboard.
  const destination = role === 'provider' ? `/${locale}/provider` : `/${locale}/dashboard`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=${destination}`,
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

  // Email confirmation OFF → a session is returned immediately, so send them
  // straight to their destination. Confirmation ON → no session yet, so ask
  // them to check their email.
  if (data.session) {
    redirect(destination);
  }

  redirect(`/${locale}/auth/check-email`);
}
