import { setRequestLocale } from 'next-intl/server';

import { PageShell } from '@/components/page-shell';

export default async function TermsPage({
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
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Draft — review with a lawyer before public launch.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">1. About Heia</h2>
          <p className="leading-relaxed">
            Heia is a marketplace that connects clients with independent beauty and lifestyle
            specialists. Heia facilitates discovery and booking; the service itself is provided by
            the specialist, not by Heia.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">2. Accounts</h2>
          <p className="leading-relaxed">
            You must provide accurate information and keep your credentials secure. You are
            responsible for activity on your account. An account is either a client or a specialist
            account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">3. Bookings and payments</h2>
          <p className="leading-relaxed">
            A booking is a request until the specialist confirms it. Where online payment is
            enabled, payments are processed by Stripe; Heia may retain a platform fee. Cancellations,
            refunds and no-shows are subject to the specialist&rsquo;s policy and applicable law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">4. Content and conduct</h2>
          <p className="leading-relaxed">
            You retain rights to content you upload but grant Heia a licence to display it on the
            platform. Reviews must reflect a genuine, completed appointment. Don&rsquo;t post
            unlawful, misleading or infringing content.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">5. Liability</h2>
          <p className="leading-relaxed">
            Heia provides the platform &ldquo;as is&rdquo; and is not a party to the agreement
            between a client and a specialist. To the extent permitted by law, Heia is not liable for
            the quality or outcome of services booked through the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">6. Changes</h2>
          <p className="leading-relaxed">
            We may update these terms. Material changes will be communicated in the app. Continued
            use after an update means you accept the revised terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">7. Contact</h2>
          <p className="leading-relaxed">Questions? Contact us at hello@heia.app.</p>
        </section>
      </article>
    </PageShell>
  );
}
