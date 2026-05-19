# Services and APIs

Third-party services the platform will use, with role, current pricing posture, and EU/GDPR considerations. Costs are estimates for a Romania-first launch and should be refined before committing.

## Live from foundation phase or early MVP

| Service | Role | Free tier | Starting paid tier | EU / GDPR |
|---------|------|-----------|--------------------|-----------|
| **Vercel** | Web hosting, edge CDN | Hobby (sufficient for foundation) | Pro ~$20/mo | EU regions available; DPA on Pro |
| **Supabase** | Postgres + Auth + Storage + Realtime | 500MB DB, 1GB storage, 50k MAU | Pro ~$25/mo | EU regions; DPA available |
| **Resend** | Transactional email | 3k emails/mo, 100/day | $20/mo for 50k | EU region; DPA available |
| **Cloudflare** | DNS, optional CDN / R2 storage | Generous | Pay-as-you-go | Strong DPA |
| **Sentry** | Error monitoring | 5k events/mo | $26/mo for 50k | EU region; DPA available |
| **PostHog** or **Plausible** | Product analytics | PostHog Cloud EU: 1M events/mo | $0 – ~$50/mo at small scale | EU-hosted by default |
| **Mapbox** | Geocoding, optional map tiles | 50k tile loads + 100k geocodes/mo | Pay-as-you-go | Standard DPA |

## To pick when concept-lock happens

| Item | Notes |
|------|-------|
| Domain registrar (Cloudflare Registrar or Namecheap) | Once the final product name is chosen |
| Brand assets host | Logo, favicons, social previews — Cloudflare or Supabase Storage |

## Idea catalogue (not committed)

| Service | Role | Trigger to add |
|---------|------|----------------|
| **Stripe Connect** | Marketplace payments + Seller KYC | When in-app transactions go live |
| **Twilio** or **Vonage** | SMS / phone OTP | When phone verification ships |
| **OneSignal** or **Firebase Cloud Messaging** | Push notifications | When mobile launches |
| **Algolia** or **Meilisearch** | Hosted search | When Postgres FTS scaling becomes a real concern |
| **Cloudflare R2 + Images** | Image hosting at scale | When egress / transform costs on Supabase Storage become uncomfortable |
| **Linear / Notion** | Internal project management | Once team grows past two |

## Approximate monthly cost

**Free during foundation phase** — every service above offers a free tier that covers pre-launch usage.

**Once live, paid baseline:**

- Vercel Pro: $20
- Supabase Pro: $25
- Resend: $20 (or free until volume justifies)
- Sentry: free → $26 once events climb
- Domain: ~$1/mo amortised

**Floor at small launch: ~$45 – $90/mo** depending on which paid tiers are activated.

Stripe Connect, when enabled, adds ~2.9% + €0.25 per transaction (rates per Stripe's EU pricing at the time of writing — verify before committing).

## GDPR-specific posture

- All services above offer Data Processing Agreements; sign before processing real user data.
- Hosting region: pick EU regions on Vercel (Frankfurt), Supabase (Frankfurt or Ireland), Resend (EU), Sentry (EU).
- Cookie consent banner required before non-essential analytics fire.
- User-facing privacy policy and terms of service drafted before public launch.
- Right-to-erasure: cascading delete must be implementable across all stored data, including third-party copies (Sentry breadcrumbs, PostHog event history) where applicable.
