import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

/**
 * Handles auth confirmation links sent by Supabase — signup confirmation,
 * magic link, and password recovery.
 *
 * The current Supabase flow (PKCE) sends users back here with `?code=...`
 * which we exchange for a session. The older implicit flow used
 * `?token_hash=...&type=...` — we still accept it for backwards
 * compatibility in case any in-flight emails were sent the old way.
 *
 * On success: redirect to `next` (defaults to `/`, which the i18n
 * middleware will resolve to the user's locale).
 * On failure: redirect to the login page in the locale we can infer
 * from `next`, with an error flag.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/';

  const supabase = await createClient();

  // PKCE flow (current Supabase default)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Implicit flow (older Supabase clients) — accepted for compatibility
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'magiclink' | 'recovery' | 'invite' | 'email_change',
      token_hash,
    });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Fall through: token invalid, expired, or missing. Send the user to
  // the login page in the locale we can infer from `next`.
  const locale = next.split('/')[1] || 'ro';
  return NextResponse.redirect(`${origin}/${locale}/login?error=invalid_link`);
}
