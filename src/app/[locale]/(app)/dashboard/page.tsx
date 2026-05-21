import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

// Auth-gated: always run per request.
export const dynamic = 'force-dynamic';
import { Star, ArrowRight } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CLIENT_BOOKINGS, img, formatBookingDate } from '@/lib/app-mock-data';
import { logoutAction } from './actions';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role, created_at')
    .eq('id', user.id)
    .maybeSingle();

  // Providers get their own area.
  if (profile?.role === 'provider') {
    redirect(`/${locale}/provider`);
  }

  const displayName = profile?.display_name ?? user.email ?? 'there';

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Your space
          </div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">Hi, {displayName}.</h1>
          <p className="mt-3 max-w-prose text-muted-foreground">
            Your upcoming bookings and your account live here.
          </p>
        </div>

        {/* Upcoming bookings */}
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-medium tracking-tight">Upcoming</h2>
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Book more
            </Link>
          </div>
          {CLIENT_BOOKINGS.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-start gap-3 py-8">
                <p className="text-muted-foreground">No bookings yet.</p>
                <Button asChild>
                  <Link href="/services">Find a service</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {CLIENT_BOOKINGS.map((b) => (
                <Link
                  key={b.id}
                  href={`/studio/${b.studioId}`}
                  className="flex items-center gap-3 rounded-3xl bg-card p-3 ring-1 ring-border transition-transform hover:-translate-y-0.5"
                >
                  <img
                    src={img.square(b.heroSeed)}
                    alt=""
                    className="size-16 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{b.studioName}</div>
                    <div className="truncate text-sm text-muted-foreground">{b.serviceName}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {formatBookingDate(b.date, locale)} · {b.time}
                    </div>
                  </div>
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium capitalize text-foreground">
                    {b.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Discover CTA */}
        <Link
          href="/services"
          className="flex items-center justify-between rounded-3xl bg-primary px-5 py-5 text-primary-foreground"
        >
          <div>
            <div className="font-medium">Treat yourself to something</div>
            <div className="text-sm opacity-80">Browse hair, massage, nails and more</div>
          </div>
          <ArrowRight className="size-5" />
        </Link>

        {/* Account */}
        <section>
          <h2 className="mb-4 text-xl font-medium tracking-tight">Account</h2>
          <Card>
            <CardHeader>
              <CardDescription>Signed in as</CardDescription>
              <CardTitle className="text-lg">{user.email}</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={logoutAction}>
                <input type="hidden" name="locale" value={locale} />
                <Button type="submit" variant="outline" className="w-full">
                  Sign out
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  );
}
