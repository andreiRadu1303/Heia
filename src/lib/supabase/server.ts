import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client. Use from Server Components, Server Actions,
 * and Route Handlers. Reads + writes the auth session cookies.
 *
 * Per Supabase docs: never run any other code between `createClient()`
 * and the first `auth.getUser()` call — otherwise the cookie refresh
 * may not flush in time.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll throws from Server Components — that's fine,
            // middleware will refresh the session on the next request.
          }
        },
      },
    },
  );
}
