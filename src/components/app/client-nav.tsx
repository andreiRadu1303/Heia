'use client';

import { Home, Heart, CalendarDays, User } from 'lucide-react';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/dashboard', label: 'Home', icon: Home, exact: true },
  { href: '/saved', label: 'Saved', icon: Heart },
  { href: '/bookings', label: 'My Bookings', icon: CalendarDays },
  { href: '/account', label: 'My Account', icon: User },
];

/** Bottom action bar for the client area (mirrors ProviderNav for experts). */
export function ClientNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      aria-label="Client"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {TABS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <Icon className={cn('size-5', active && 'stroke-[2.4]')} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
