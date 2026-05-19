# Roadmap

Phased plan with explicit scope per phase and an idea catalogue for anything explicitly out of current scope.

## Phase 0 — Foundation (current)

**Goal:** scaffold the repository so that future product work has a coherent surface to build on. No real users yet.

**In scope:**

- Repository structure
- Documentation (this folder)
- High-level architecture, diagrams, glossary
- Tech stack decisions
- Next.js project scaffold with i18n shell, Tailwind, shadcn/ui primitives
- Public landing page (concept-agnostic teaser + email waitlist UI)
- Stub routes for the key authenticated surfaces (no real auth wired)
- `.env.example` cataloguing future configuration
- Design brief to fuel Figma work

**Out of scope:**

- Connecting Supabase or picking auth methods
- Storing waitlist emails
- Concept-specific listing / transaction / fulfillment code
- Payments
- Real user flows

**Exit criteria:**

- Repository runs locally with `npm install && npm run dev`.
- All planning documents reviewed and approved.
- Partner has the design brief in hand to start Figma.
- Stack decisions are committed in writing.

## Phase 1 — Concept lock and MVP scope

**Trigger:** marketing partner converges on a concept.

**In scope:**

- Pick services vs. goods
- Fill in `concepts/<chosen>/` listing / transaction / fulfillment code
- Real Supabase project; auth flows live (methods chosen)
- Listing creation, listing browse, listing detail
- Profile pages
- Search + geo filter
- In-app messaging
- Reviews tied to completed transactions
- Email notifications (Resend)
- Cookie consent + privacy policy + terms of service

**Out of scope:**

- Payments (still in the idea catalogue)
- Mobile apps
- Multi-currency display

## Phase 2 — Pre-launch hardening

- Admin console (moderation queue, user / listing takedown, dispute escalation)
- Trust-tier badges live
- Phone OTP verification (if the auth decision retains it)
- GDPR-compliant data export and erasure tooling
- Error monitoring wired (Sentry)
- Analytics wired (PostHog or Plausible) with consent gating
- Accessibility audit (WCAG 2.1 AA)
- Performance baseline (Lighthouse, Core Web Vitals)
- Security review of auth flows, RLS policies, image uploads, XSS surface
- Stress test against ~10k listings, ~1k concurrent users
- Real domain, EU hosting regions confirmed

## Phase 3 — Launch (Romania)

- Marketing site live
- Open Seller signup
- Marketing-driven onboarding (partner-led)
- On-call / support channel
- Post-launch metrics dashboard

## Phase 4 — Iterate

Driven by real user behaviour. Topics likely to land:

- Search ranking improvements
- Listing recommendations
- Seller onboarding optimisation
- Booking calendar quality-of-life improvements (services concept)
- Inventory and shipping flow improvements (goods concept)
- Messaging quality of life (read receipts, attachments)

## Phase 5 — International expansion

**Trigger:** signal from adjacent markets.

- Add locales (EN first; others as demand appears)
- Multi-currency display + conversion
- Region-specific payments and tax (if payments are live)
- Region-specific moderation policies

## Idea catalogue (deferred, captured to prevent scope creep now)

### Monetization plumbing
- Stripe Connect from MVP day one, even if the platform takes no cut yet, so the rails exist when policy is set.
- Transaction cut, subscription tier, advertising surface — pick later.

### Mobile
- Expo / React Native or Flutter, triggered by traction.

### Engagement and retention
- Affiliate / referral program
- Loyalty / repeat-customer features
- Gift cards / vouchers
- Push notifications

### Concept-specific feature ideas
- Video calls / virtual consultations (services concept)
- AR try-on for stylists / fashion consultants (services concept)
- Maker collections / curated drops (goods concept)
- Made-to-order workflows with milestone messages (goods concept)

### Trust, safety, and operations
- Full disputes UI beyond manual admin handling
- Auto-flagging review moderation
- Self-serve onboarding tutorials for Sellers
- Internal CRM / ticket tool integration
