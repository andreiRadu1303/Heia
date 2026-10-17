import { redirect } from 'next/navigation';
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
  ExternalLink,
  Globe,
  EyeOff,
  CreditCard,
  Bell,
  CalendarPlus,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { getMyStudio } from '@/lib/provider-studio';
import { formatBookingDate } from '@/lib/app-mock-data';
import { getProviderActivity, getMonthlySummary, type ActivityItem } from '@/lib/provider-home';
import { cn } from '@/lib/utils';
import { MonthTotalsWidget } from '@/components/app/provider-stats';

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

  const [{ data: profile }, studio] = await Promise.all([
    user
      ? supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    getMyStudio(),
  ]);

  // First-run: send new experts through onboarding before the dashboard.
  if (studio && !studio.onboarded_at) redirect(`/${locale}/provider/onboarding`);

  // Everything below is independent → one parallel batch.
  const [serviceCount, activity, summary] = studio
    ? await Promise.all([
        supabase
          .from('services')
          .select('id', { count: 'exact', head: true })
          .eq('studio_id', studio.id)
          .then(({ count }) => count ?? 0),
        getProviderActivity(studio.id),
        getMonthlySummary(studio.id, locale),
      ])
    : [0, null, null];

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

          {/* Notifications */}
          {activity ? (
            <section>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="flex items-center gap-2 text-xl font-medium tracking-tight">
                  <Bell className="size-5" /> What’s new
                  {activity.pendingCount + activity.newReviewCount > 0 ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                      {activity.pendingCount + activity.newReviewCount}
                    </span>
                  ) : null}
                </h2>
                <Link
                  href="/provider/bookings"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  All bookings
                </Link>
              </div>

              {activity.items.length === 0 ? (
                <div className="rounded-3xl bg-card p-5 text-sm text-muted-foreground ring-1 ring-border">
                  Nothing new yet. New booking requests and reviews will show up here.
                </div>
              ) : (
                <div className="divide-y divide-border rounded-3xl bg-card ring-1 ring-border">
                  {activity.items.map((item) => (
                    <ActivityRow key={`${item.kind}-${item.id}`} item={item} locale={locale} studioSlug={studio.slug} />
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* Analytics summary */}
          {summary ? <MonthTotalsWidget summary={summary} /> : null}

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
              <ManageCard href="/provider/payments" icon={<CreditCard className="size-5" />} title="Payments" hint="Payouts & plan" />
            </div>
          </section>

          {/* View public page */}
          <section>
            <Link
              href={`/studio/${studio.slug}`}
              target="_blank"
              className="flex items-center gap-3 rounded-3xl bg-card p-4 ring-1 ring-border transition-transform hover:-translate-y-0.5"
            >
              <span className="grid size-10 place-items-center rounded-full bg-accent/20">
                <ExternalLink className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium">View your public page</div>
                <div className="truncate text-sm text-muted-foreground">
                  See exactly what clients see
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

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function ActivityRow({
  item,
  locale,
  studioSlug,
}: {
  item: ActivityItem;
  locale: string;
  studioSlug: string;
}) {
  if (item.kind === 'booking') {
    const pending = item.status === 'pending';
    const date = item.scheduledAt.slice(0, 10);
    const time = item.scheduledAt.slice(11, 16);
    return (
      <Link href="/provider/bookings" className="flex items-center gap-3 p-4 hover:bg-secondary/30">
        <span
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-full',
            pending ? 'bg-accent text-accent-foreground' : 'bg-accent/20 text-foreground',
          )}
        >
          <CalendarPlus className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">
            {pending ? 'New booking request' : 'Booking'} · {item.clientName}
          </div>
          <div className="truncate text-sm text-muted-foreground">
            {item.serviceName} · {formatBookingDate(date, locale)} {time}
          </div>
        </div>
        <div className="shrink-0 text-right">
          {pending ? (
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium">Respond</span>
          ) : (
            <span className="text-xs capitalize text-muted-foreground">{item.status}</span>
          )}
          <div className="mt-1 text-[11px] text-muted-foreground">{timeAgo(item.at)}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/studio/${studioSlug}`} className="flex items-center gap-3 p-4 hover:bg-secondary/30">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/20 text-foreground">
        <Star className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">
          New review · {item.authorName}
          <span className="ml-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-3 fill-current text-accent" /> {item.rating.toFixed(1)}
          </span>
        </div>
        <div className="truncate text-sm text-muted-foreground">{item.body || 'No comment'}</div>
      </div>
      <div className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(item.at)}</div>
    </Link>
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
