'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export async function logoutAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}
