# Follow-ups

Things explicitly deferred, in priority order. Each entry says **what** to do, **why** it was deferred, and **when** it should land.

## Security & hardening

### Restrict the Google Maps API key

**What:** Add HTTP referrer restrictions and an API restriction (Maps JavaScript API only) to the Google Maps key in Cloud Console.

**Why deferred:** Live site is open (no restrictions) during early dev so the key works from any environment without fiddling.

**When:** Before the marketplace's first public marketing push. Or sooner if the key shows up in any commit, PR, or leaked screenshot.

**Steps:**
1. [Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Click the key → **Application restrictions** → HTTP referrers → add:
   - `https://heia-jet.vercel.app/*` (and any branch deploys)
   - `https://<custom-domain>/*` (when we have one)
   - `http://localhost:3000/*` (keep for dev)
3. **API restrictions** → Restrict key → select **Maps JavaScript API** only
4. Save, wait ~30s for propagation

### Restrict the Supabase anon key (already public-safe, but)

**What:** Make sure RLS is enforced on every user-data table, and the `service_role` key never leaves server code.

**Why deferred:** RLS is on for `profiles` from day one; this is a checkpoint to do before any other table is added.

**When:** Audit before each new table migration. Add `service_role` to Vercel as a **server-only** env var (no `NEXT_PUBLIC_` prefix), never imported from client components.

### Pin Google Cloud OAuth client to specific domains

**What:** When we add Google OAuth (see below), restrict the OAuth client to specific authorized JavaScript origins and redirect URIs.

**Why deferred:** Google OAuth not enabled yet.

**When:** As part of adding Google OAuth.

## Auth expansions

### Google OAuth

**What:** Add "Continue with Google" button to signup + login.

**Why deferred:** Email + password + magic link already covers signup needs. OAuth adds value (lower friction) but requires Cloud Console setup.

**When:** After traction signals that signup conversion is the bottleneck. Or sooner if signup CR is below ~25% on the waitlist page.

**Setup steps when we do it:**
1. Google Cloud Console → APIs & Services → **OAuth consent screen** (configure once per project)
2. Credentials → Create OAuth 2.0 Client ID → Web application
3. Authorized JS origins: `https://<domain>`, `http://localhost:3000`
4. Authorized redirect URIs: `https://<supabase-project>.supabase.co/auth/v1/callback`
5. Supabase Dashboard → Authentication → Providers → Google → enable, paste client ID + secret
6. App side: add `signInWithOAuth({ provider: 'google' })` button on `/login` and `/signup`

### Phone OTP (SMS)

**What:** "Sign up with phone" path. Common trust signal in RO marketplaces.

**Why deferred:** Costs money (Twilio or Vonage SMS, ~$0.05 per SMS) and adds vendor. Not needed at waitlist stage.

**When:** Around launch, when trust signals start to matter to real sellers/clients. Pair with `phone_verified` trust tier badge (already in glossary).

**Setup steps when we do it:**
1. Pick provider: Twilio or Vonage. Both work with Supabase out of the box.
2. Add provider account + credentials in Supabase Dashboard → Authentication → Providers → Phone
3. UI: add phone signup tab on `/signup`
4. Validate phone numbers as E.164 (we already plan for this)

### Forgot password flow

**What:** Real "forgot password" page that triggers a Supabase reset email and a reset page that accepts the new password.

**Why deferred:** Anyone who hits "Forgot password" can use magic link to log in for now. Stub the link to point to the magic-link tab on /login.

**When:** Same iteration as password strength requirements (below).

### Password strength + breached-password check

**What:** Enforce minimum complexity. Optionally use Supabase's [HaveIBeenPwned check](https://supabase.com/docs/guides/auth/password-security#leaked-password-protection) (enable in dashboard, no code needed).

**Why deferred:** Supabase's default minimum (6 chars) is OK for waitlist. Tighten before public launch.

**When:** Pre-launch.

### Account deletion (GDPR)

**What:** A "delete my account" button that hard-deletes the user from `auth.users` (which cascades to `profiles`).

**Why deferred:** No users yet to delete. But GDPR requires it before processing real EU user data.

**When:** Before public launch, no later than the day we open to the public.

## Compliance & legal

### Privacy policy + Terms of Service

**What:** Real documents on `/privacy` and `/terms`. The footer already links to placeholders.

**When:** Before public launch.

### Cookie consent banner

**What:** EU cookie consent for any non-essential cookies (analytics, marketing).

**Why deferred:** Right now we set only essential cookies (Supabase auth session). Once we add analytics, this is required.

**When:** When PostHog/Plausible goes in.

### Marketing consent record

**What:** Already captured at signup (`profiles.marketing_consent` + `marketing_consent_at`). We need to honour it: never send marketing email to users where it's false.

**When:** First time we send any marketing email. Add an unsubscribe link too.

## Email & notifications

### Customize Supabase auth email templates

**What:** Default Supabase confirmation and magic-link emails are functional but generic. Replace with brand-aligned copy.

**Why deferred:** Defaults work for development.

**When:** Pre-launch. Probably alongside finalising brand name and palette.

### Transactional email service

**What:** Use Resend (planned) for app emails beyond auth (welcome, booking confirmations, etc).

**When:** When we send any email beyond Supabase's auth templates.

## Site visibility / SEO

### robots.txt + sitemap

**What:** Allow indexing of marketing pages, disallow `/preview/*` (internal design tool).

**When:** Soon — `/preview/*` shouldn't be in Google when the marketing site is real.

**Sketch:**
```
User-agent: *
Allow: /
Disallow: /preview/
Disallow: /dashboard
Disallow: /messages
Disallow: /auth/
Sitemap: https://<domain>/sitemap.xml
```

### Open Graph + social previews

**What:** Per-page `og:image`, `og:title`, `og:description`. Especially for listing/profile pages later.

**When:** When marketing pushes start.

## Observability

### Sentry error monitoring

**What:** Add Sentry (free tier) to surface server + client errors.

**When:** Around MVP, before public launch.

### PostHog or Plausible analytics

**What:** Track signups, waitlist conversions, dropoffs. Pair with cookie banner.

**When:** When traffic > a few visits/day.

## Performance

### Image optimization for stock images

**What:** The preview pages use `<img>` with Picsum/Pravatar URLs (bypasses `next/image`). For real product images, use `next/image` with proper sizing.

**When:** When the preview pages stop being just exploratory and start being real product pages.

## Mobile

### Mobile app (deferred to its own phase)

**What:** Either Expo/React Native (shares TS with web) or Flutter (separate codebase).

**When:** After web has traction. Per the original architecture decision.
