import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client.
 * Only use from Client Components ('use client').
 * Reads cookies the browser already has; works for queries the user is
 * authorised to see via RLS.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
