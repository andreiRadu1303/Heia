import { setRequestLocale } from 'next-intl/server';
import { Star, TrendingUp, Eye, CalendarDays, Scissors, Clock, ArrowUpRight } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import {
  studioById,
  MY_STUDIO_ID,
  INCOMING_BOOKINGS,
  PROVIDER_STATS,
  img,
  formatLei,
} from '@/lib/app-mock-data';

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

  const studio = studioById(MY_STUDIO_ID)!;
  const name = profile?.display_name ?? studio.name;
  const today = new Date().toISOString().slice(0, 10);
  const todays = INCOMING_BOOKINGS.filter((b) => b.date === today);

  return (
    <main className="container space-y-8 pt-8">
      <header>
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Heia for pros
        </div>
        <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">Hi, {name}.</h1>
        <p className="mt-2 text-muted-foreground">Here’s how {studio.name} is doing.</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3">
        <Stat icon={<CalendarDays className="size-4" />} label="Upcoming" value={String(PROVIDER_STATS.upcoming)} />
        <Stat icon={<TrendingUp className="size-4" />} label="This week" value={formatLei(PROVIDER_STATS.weekEarningsLei)} />
        <Stat icon={<Star className="size-4" />} label="Rating" value={String(PROVIDER_STATS.rating)} />
        <Stat icon={<Eye className="size-4" />} label="Profile views" value={String(PROVIDER_STATS.profileViews)} />
      </section>

      {/* Today */}
      <section>
        <h2 className="mb-4 text-xl font-medium tracking-tight">Today</h2>
        {todays.length === 0 ? (
          <div className="rounded-3xl bg-card p-6 text-sm text-muted-foreground ring-1 ring-border">
            Nothing booked today. Enjoy the breathing room.
          </div>
        ) : (
          <div className="space-y-3">
            {todays.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 rounded-3xl bg-card p-3 ring-1 ring-border"
              >
                <img
                  src={img.avatar(b.clientAvatarSeed)}
                  alt=""
                  className="size-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{b.clientName}</div>
                  <div className="truncate text-sm text-muted-foreground">{b.serviceName}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{b.time}</div>
                  <div className="text-xs text-muted-foreground">{formatLei(b.priceLei)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          href="/provider/bookings"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          See all bookings <ArrowUpRight className="size-3.5" />
        </Link>
      </section>

      {/* Manage */}
      <section>
        <h2 className="mb-4 text-xl font-medium tracking-tight">Manage</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <ManageCard href="/provider/services" icon={<Scissors className="size-5" />} title="Services" hint={`${studio.services.length} listed`} />
          <ManageCard href="/provider/availability" icon={<Clock className="size-5" />} title="Hours" hint="Your weekly schedule" />
          <ManageCard href="/provider/profile" icon={<Star className="size-5" />} title="Studio profile" hint="How clients see you" />
        </div>
      </section>

      {/* Public profile preview */}
      <section>
        <Link
          href={`/studio/${studio.id}`}
          className="flex items-center gap-4 overflow-hidden rounded-3xl bg-card ring-1 ring-border"
        >
          <img src={img.square(studio.heroSeed)} alt="" className="size-20 shrink-0 object-cover" />
          <div className="min-w-0 flex-1 py-3">
            <div className="text-xs text-muted-foreground">Your public page</div>
            <div className="truncate font-medium">{studio.name}</div>
            <div className="truncate text-sm text-muted-foreground">{studio.tagline}</div>
          </div>
          <ArrowUpRight className="mr-4 size-5 shrink-0 text-muted-foreground" />
        </Link>
      </section>
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
