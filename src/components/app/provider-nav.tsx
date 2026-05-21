'use client';

import { Home, CalendarDays, Scissors, Clock, User } from 'lucide-react';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/provider', label: 'Home', icon: Home, exact: true },
  { href: '/provider/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/provider/services', label: 'Services', icon: Scissors },
  { href: '/provider/availability', label: 'Hours', icon: Clock },
  { href: '/provider/profile', label: 'Profile', icon: User },
];

export function ProviderNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      aria-label="Provider"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
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
