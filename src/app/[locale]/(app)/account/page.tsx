import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Star } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { AppTopBar } from '@/components/app/app-top-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CLIENT_BOOKINGS, img, formatBookingDate } from '@/lib/app-mock-data';
import { logoutAction } from '../dashboard/actions';

export const dynamic = 'force-dynamic';

export default async function AccountPage({
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
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role, marketing_consent, created_at')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="min-h-dvh pb-12">
      <AppTopBar title="Account" backHref="/dashboard" />

      <main className="container space-y-8 pt-6">
        {/* Bookings */}
        <section>
          <h2 className="mb-4 text-xl font-medium tracking-tight">Your bookings</h2>
          {CLIENT_BOOKINGS.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-start gap-3 py-8">
                <p className="text-muted-foreground">No bookings yet.</p>
                <Button asChild>
                  <Link href="/dashboard">Find a service</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {CLIENT_BOOKINGS.map((b) => (
                <Link
                  key={b.id}
                  href={`/studio/${b.studioId}`}
                  className="flex items-center gap-3 rounded-3xl bg-card p-3 ring-1 ring-border"
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

        {/* Account */}
        <section>
          <h2 className="mb-4 text-xl font-medium tracking-tight">Account</h2>
          <Card>
            <CardHeader>
              <CardDescription>Signed in as</CardDescription>
              <CardTitle className="text-lg">{user.email}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Name" value={profile?.display_name ?? '—'} />
              <Row label="Account type" value={profile?.role === 'provider' ? 'Provider' : 'Client'} />
              <Row
                label="Marketing updates"
                value={profile?.marketing_consent ? 'Subscribed' : 'Off'}
              />
              <Row
                label="Member since"
                value={
                  profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString(locale)
                    : '—'
                }
              />
            </CardContent>
          </Card>
        </section>

        <form action={logoutAction}>
          <input type="hidden" name="locale" value={locale} />
          <Button type="submit" variant="outline" className="w-full">
            Sign out
          </Button>
        </form>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-1.5 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
