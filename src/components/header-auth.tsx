'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

type AuthState = 'loading' | { role: string } | null;

/**
 * Client island for the header's auth area. Keeps the surrounding
 * (server) header statically renderable while resolving the user's
 * session in the browser. Shows login/signup when logged out, and a
 * home link + sign out when logged in (home depends on role).
 */
export function HeaderAuth() {
  const t = useTranslations('Nav');
  const router = useRouter();
  const [auth, setAuth] = React.useState<AuthState>('loading');

  React.useEffect(() => {
    const supabase = createClient();
    let active = true;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return;
      if (!user) {
        setAuth(null);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (!active) return;
      setAuth({ role: data?.role ?? 'client' });
    });
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAuth(null);
    router.push('/');
    router.refresh();
  }

  if (auth === 'loading') {
    return <div className="h-8 w-24" aria-hidden />;
  }

  if (auth === null) {
    return (
      <div className="ml-1 flex items-center gap-1 sm:ml-2 sm:gap-2">
        <Button variant="ghost" size="sm" asChild className="px-2.5 sm:px-3">
          <Link href="/login">{t('login')}</Link>
        </Button>
        <Button size="sm" asChild className="px-2.5 sm:px-3">
          <Link href="/signup">{t('signup')}</Link>
        </Button>
      </div>
    );
  }

  const home = auth.role === 'provider' ? '/provider' : '/dashboard';
  return (
    <div className="ml-1 flex items-center gap-1 sm:ml-2 sm:gap-2">
      <Button variant="ghost" size="sm" asChild className="px-2.5 sm:px-3">
        <Link href={home}>{t('dashboard')}</Link>
      </Button>
      <Button variant="outline" size="sm" onClick={signOut} className="px-2.5 sm:px-3">
        {t('signOut')}
      </Button>
    </div>
  );
}
