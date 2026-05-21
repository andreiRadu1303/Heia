import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { HeaderAuth } from '@/components/header-auth';

export async function SiteHeader() {
  const tNav = await getTranslations('Nav');
  const tMeta = await getTranslations('Meta');

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-foreground" aria-hidden />
          {tMeta('siteName')}
        </Link>

        {/* Desktop-only: secondary nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/browse">{tNav('browse')}</Link>
          </Button>
        </nav>

        {/* Right cluster — visible on all sizes, compacts on mobile */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* On mobile, hide locale + theme toggle so the auth buttons fit;
              they're still reachable on small-tablet+ screens. */}
          <div className="hidden sm:flex sm:items-center sm:gap-0.5">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>

          {/* Auth buttons — login/signup or dashboard/sign-out (client island) */}
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
