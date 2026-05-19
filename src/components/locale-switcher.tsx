'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={`Switch language to ${otherLocale.toUpperCase()}`}
      onClick={() => router.replace(pathname, { locale: otherLocale })}
    >
      <span className="font-mono text-xs tracking-wider">
        {locale.toUpperCase()} <span className="text-muted-foreground">/ {otherLocale.toUpperCase()}</span>
      </span>
    </Button>
  );
}
