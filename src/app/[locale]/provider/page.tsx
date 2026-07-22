import { setRequestLocale } from 'next-intl/server';
import {
  Star,
  MessageSquareText,
  Scissors,
  Clock,
  CalendarDays,
  LayoutTemplate,
  User,
  ArrowUpRight,
  Globe,
  EyeOff,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { getMyStudio } from '@/lib/provider-studio';

export const dynamic = 'force-dynamic';

export default async function ProviderHome({
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
  const { data: profile } = user
    ? await supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle()
    : { data: null };

  const studio = await getMyStudio();

  let serviceCount = 0;
  if (studio) {
    const { count } = await supabase
      .from('services')
      .select('id', { count: 'exact', head: true })
      .eq('studio_id', studio.id);
    serviceCount = count ?? 0;
  }

  const name = (profile?.display_name ?? studio?.name ?? 'there').split(' ')[0];

  return (
    <main className="container space-y-8 pt-8">
      <header>
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Heia for pros
        </div>
        <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">Hi, {name}.</h1>
        {studio ? (
          <p className="mt-2 text-muted-foreground">Manage {studio.name} and get discovered.</p>
        ) : null}
      </header>

      {!studio ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
          We couldn’t find a studio for your account. If you just signed up, try reloading.
        </div>
      ) : (
        <>
          {/* Publish status */}
          <section
            className={
              studio.is_published
                ? 'flex items-center gap-3 rounded-3xl border border-accent/40 bg-accent/10 p-4'
                : 'flex items-center gap-3 rounded-3xl border border-border bg-card p-4 ring-1 ring-border'
            }
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background">
              {studio.is_published ? (
                <Globe className="size-5 text-accent" />
              ) : (
                <EyeOff className="size-5 text-muted-foreground" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-medium">
                {studio.is_published ? 'Your profile is live' : 'Your profile is a draft'}
              </div>
              <div className="text-sm text-muted-foreground">
                {studio.is_published
                  ? 'Clients can find and book you.'
                  : 'Only you can see it. Publish it from your profile.'}
              </div>
            </div>
            <Link
              href="/provider/profile"
              className="shrink-0 text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              {studio.is_published ? 'Edit' : 'Publish'}
            </Link>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-3 gap-3">
            <Stat
              icon={<Star className="size-4" />}
              label="Rating"
              value={studio.rating > 0 ? studio.rating.toFixed(1) : '—'}
            />
            <Stat
              icon={<MessageSquareText className="size-4" />}
              label="Reviews"
              value={String(studio.review_count)}
            />
            <Stat icon={<Scissors className="size-4" />} label="Services" value={String(serviceCount)} />
          </section>

          {/* Manage */}
          <section>
            <h2 className="mb-4 text-xl font-medium tracking-tight">Manage</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <ManageCard href="/provider/profile" icon={<User className="size-5" />} title="Studio profile" hint="Name, bio, publish" />
              <ManageCard href="/provider/services" icon={<Scissors className="size-5" />} title="Services" hint={`${serviceCount} listed`} />
              <ManageCard href="/provider/site" icon={<LayoutTemplate className="size-5" />} title="Mini-site" hint="Design your page" />
              <ManageCard href="/provider/availability" icon={<Clock className="size-5" />} title="Hours" hint="Your weekly schedule" />
              <ManageCard href="/provider/bookings" icon={<CalendarDays className="size-5" />} title="Bookings" hint="Requests & schedule" />
            </div>
          </section>

          {/* Site builder link */}
          <section>
            <Link
              href="/provider/site"
              className="flex items-center gap-3 rounded-3xl bg-card p-4 ring-1 ring-border transition-transform hover:-translate-y-0.5"
            >
              <span className="grid size-10 place-items-center rounded-full bg-accent/20">
                <LayoutTemplate className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium">Design your mini-site</div>
                <div className="truncate text-sm text-muted-foreground">
                  Pick a template, colours and sections
                </div>
              </div>
              <ArrowUpRight className="size-5 shrink-0 text-muted-foreground" />
            </Link>
          </section>
        </>
      )}
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-card p-4 ring-1 ring-border">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-medium tracking-tight">{value}</div>
    </div>
  );
}

function ManageCard({
  href,
  icon,
  title,
  hint,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-3xl bg-card p-4 ring-1 ring-border transition-transform hover:-translate-y-0.5"
    >
      <span className="grid size-10 place-items-center rounded-full bg-accent/20 text-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{hint}</div>
      </div>
    </Link>
  );
}
