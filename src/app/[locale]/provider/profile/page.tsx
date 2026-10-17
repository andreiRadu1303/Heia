import { setRequestLocale } from 'next-intl/server';
import { Store, ChevronRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { AccountSettings } from '@/components/app/account-settings';
import { logoutAction } from '@/app/[locale]/(app)/dashboard/actions';

export const dynamic = 'force-dynamic';

/**
 * The expert's own account — name, photo, email, password.
 * Their studio (what clients see) is a separate thing, under Studio.
 */
export default async function ProviderProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reset?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  return (
    <main className="container max-w-2xl space-y-6 pt-8">
      <header>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Profile</h1>
        <p className="mt-2 text-muted-foreground">Your account details and sign-in.</p>
      </header>

      <AccountSettings locale={locale} openPassword={sp.reset === '1'} />

      {/* Easy to look for studio details here, so point the way. */}
      <Link
        href="/provider/studio"
        className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-border transition-colors hover:bg-secondary/40"
      >
        <div
          className="grid size-10 shrink-0 place-items-center rounded-full text-accent"
          style={{ background: 'hsl(var(--accent) / 0.15)' }}
        >
          <Store className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium">Studio details</div>
          <div className="text-sm text-muted-foreground">
            Your public page, photos, location and mini-site.
          </div>
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
      </Link>

      <form action={logoutAction}>
        <input type="hidden" name="locale" value={locale} />
        <Button type="submit" variant="outline" className="w-full">
          Sign out
        </Button>
      </form>
    </main>
  );
}
