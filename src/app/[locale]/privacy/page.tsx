import { setRequestLocale } from 'next-intl/server';

import { PageShell } from '@/components/page-shell';

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell>
      <article className="mx-auto max-w-2xl space-y-6 text-foreground/90">
        <header>
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Draft — review with a lawyer before public launch. GDPR applies.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">1. What we collect</h2>
          <p className="leading-relaxed">
            Account details (name, email), profile and studio information you provide, bookings and
            reviews, and technical data needed to run the service. Payment card details are handled
            directly by Stripe — Heia never stores them.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">2. How we use it</h2>
          <p className="leading-relaxed">
            To operate the marketplace: authentication, discovery, bookings, payments, reviews, and
            support. We send transactional messages (e.g. booking updates) and, only with your
            consent, occasional product news.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">3. Sharing</h2>
          <p className="leading-relaxed">
            We share data with processors that run the service (e.g. Supabase for hosting/database,
            Stripe for payments) under appropriate agreements. Specialists see the booking details
            necessary to serve their clients. We don&rsquo;t sell your data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">4. Storage and security</h2>
          <p className="leading-relaxed">
            Data is stored on managed infrastructure with row-level security. We keep data only as
            long as needed for the service and legal obligations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">5. Your rights (GDPR)</h2>
          <p className="leading-relaxed">
            You may access, correct, export or delete your personal data, and withdraw marketing
            consent at any time. Contact us to exercise these rights.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">6. Cookies</h2>
          <p className="leading-relaxed">
            We use essential cookies for authentication. Any non-essential cookies (e.g. analytics)
            will be used only with your consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">7. Contact</h2>
          <p className="leading-relaxed">
            Data requests and questions: privacy@heia.app.
          </p>
        </section>
      </article>
    </PageShell>
  );
}
