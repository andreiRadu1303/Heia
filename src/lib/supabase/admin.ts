import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. Bypasses RLS — use ONLY in trusted server
 * contexts with no user session (e.g. the Stripe webhook). Never import this
 * from a client component or expose the service-role key to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase admin env (URL + SERVICE_ROLE_KEY) not set.');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
