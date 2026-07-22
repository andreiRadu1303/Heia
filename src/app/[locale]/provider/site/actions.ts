'use server';

import { createClient } from '@/lib/supabase/server';
import type { SiteConfig } from '@/lib/site-config';

export interface SaveResult {
  ok: boolean;
  error?: 'auth' | 'db';
}

/**
 * Persist the signed-in expert's mini-site config onto their own studio row.
 * RLS ("Studios: providers update own") restricts the write to the owner.
 */
export async function saveSiteConfigAction(config: SiteConfig): Promise<SaveResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'auth' };

  const { error } = await supabase
    .from('studios')
    .update({ site_config: config })
    .eq('provider_id', user.id);

  if (error) {
    console.error('saveSiteConfigAction failed', error);
    return { ok: false, error: 'db' };
  }

  return { ok: true };
}
