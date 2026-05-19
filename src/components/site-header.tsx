import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

export async function SiteHeader() {
  const tNav = await getTranslations('Nav');
  const tMeta = await getTranslations('Meta');

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-foreground" aria-hidden />
          {tMeta('siteName')}
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/browse">{tNav('browse')}</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
          <div className="ml-2 hidden gap-2 sm:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">{tNav('login')}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">{tNav('signup')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
