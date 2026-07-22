'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export interface OnboardingData {
  categoryId: string;
  knownFor: string[];
  city: string;
  address: string;
  name: string;
  tagline: string;
  bio: string;
  publish: boolean;
}

export interface OnboardingResult {
  error?: string;
}

export async function completeOnboardingAction(
  locale: string,
  data: OnboardingData,
): Promise<OnboardingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const payload: Record<string, unknown> = {
    category_id: data.categoryId || 'hair',
    known_for: data.knownFor,
    city: data.city.trim() || null,
    address: data.address.trim() || null,
    tagline: data.tagline.trim() || null,
    bio: data.bio.trim() || null,
    is_published: data.publish,
    onboarded_at: new Date().toISOString(),
  };
  const name = data.name.trim();
  if (name) payload.name = name;

  const { error } = await supabase.from('studios').update(payload).eq('provider_id', user.id);

  if (error) {
    console.error('completeOnboardingAction failed', error);
    return { error: 'Could not save. Make sure migration 007 has been run, then try again.' };
  }

  redirect(`/${locale}/provider`);
}

export async function skipOnboardingAction(locale: string): Promise<OnboardingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { error } = await supabase
    .from('studios')
    .update({ onboarded_at: new Date().toISOString() })
    .eq('provider_id', user.id);

  if (error) {
    console.error('skipOnboardingAction failed', error);
    return { error: 'Could not skip. Make sure migration 007 has been run.' };
  }

  redirect(`/${locale}/provider`);
}
