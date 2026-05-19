import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

/**
 * Handles confirmation links sent by Supabase Auth — signup confirmation,
 * magic link, and password recovery. The link in the email points here
 * with `?token_hash=...&type=signup|magiclink|recovery&next=/...`.
 *
 * On success, redirect to `next` (defaults to `/`). On failure, redirect
 * to /login with an error flag.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  const redirectTo = (path: string) =>
    NextResponse.redirect(new URL(path, request.url));

  if (!token_hash || !type) {
    return redirectTo(`${next.split('/').slice(0, 2).join('/') || ''}/login?error=invalid_link`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash, type });

  if (error) {
    return redirectTo(`${next.split('/').slice(0, 2).join('/') || ''}/login?error=invalid_link`);
  }

  return redirectTo(next);
}
