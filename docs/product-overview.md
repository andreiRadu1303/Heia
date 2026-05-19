# Product overview

ProjectMarket is a two-sided marketplace platform that connects **Clients** (people looking for a service or product) with **Sellers** (people offering it). It is being built in Romania, for a Romania-first launch, with architecture and content systems designed for international expansion.

## Why now, why here

Romania has well-developed buyer and seller populations in several categories where no dominant digital aggregator has localised properly. International players exist but have not adapted to the market. A focused launch in a smaller market gives the platform breathing room to find product-market fit before competing against entrenched international platforms.

## The concept question

The platform's specific consumer-facing concept is currently undecided between two candidates:

1. **Services marketplace** — stylists, tattoo artists, beauty professionals, fashion consultants. The product is the Seller's **time** and **skill**. Discovery is portfolio-driven and identity-first.
2. **Goods marketplace** — independent makers of handmade physical goods. The product is the **object**. Discovery is product-first; fulfillment involves shipping.

A marketing-and-research partner is evaluating both concepts in parallel. The codebase intentionally avoids vocabulary that would commit to one (no `Expert`, no `Artisan`, no `Service` or `Product` in identifiers — see [Glossary](glossary.md)).

The two concepts share a large core (auth, profiles, discovery, messaging, reviews, payment rails, admin, GDPR plumbing). They diverge in exactly three places:

- **Listing model** — what a Seller publishes (a service catalogue vs. an inventoried product)
- **Transaction model** — what a Client commits to (a booking at a time slot vs. a shipped order)
- **Fulfillment model** — how value is delivered (appointment vs. shipment)

The architecture treats those three as a swappable module. See [Architecture](architecture.md) for the seam.

## Roles

- **Client** — buys a Listing's value (books a service, orders a product). Can browse, message, transact, review.
- **Seller** — publishes Listings, manages availability or inventory, fulfils Orders, responds to messages. A user account can be both Client and Seller; role is per-action, not per-account.
- **Admin** — internal staff. Moderation queue, dispute handling, takedowns, support.
- **Moderator** (future) — limited admin: review flagged content, escalate to admin.

## Marketplace shape

- **Open marketplace.** Anyone can sign up as a Seller. Trust is **graduated**, not binary — see "Trust tiers" below.
- **Discovery surface is SEO-critical.** Listing pages, profile pages, and category browse must be indexable. This drives the web-stack choice (server-rendered Next.js, not Flutter-canvas).
- **Payments** preferably route through the platform, but the platform does not block off-platform contact between Client and Seller. Trust in payment rails is earned over time.
- **Reviews** are tied to completed Transactions, not to identity alone — limits fake-review attacks.
- **Messaging** between Client and Seller is in-app from day one.

## Trust tiers (graduated verification)

Sellers and Listings accumulate verification levels rather than passing or failing a single check:

1. `email_verified` — automatic on signup
2. `phone_verified` — phone OTP
3. `payment_account_connected` — Stripe Connect onboarding (carries built-in KYC when payments turn on)
4. `id_verified` — formal identity check (deferred until payments)
5. `manually_reviewed` — staff approved

Each tier surfaces as a badge on public profiles. Listings may require minimum tiers depending on category risk.

## Out of scope for the foundation phase

The following are acknowledged future concerns. They are not built in the foundation, but are documented so the foundation does not preclude them. See [Roadmap](roadmap.md) for the idea catalogue.

- Monetization (transaction cut, subscription, or advertising)
- Mobile applications (web first)
- Multi-currency display
- Advanced search ranking
- Native chat moderation tooling
- Affiliate / referral programs

## Principles

- **Concept-neutral until decided.** No naming that boxes us in.
- **Domain-agnostic core, concept-specific seam.** Build once, swap the listing / transaction / fulfillment layer when the concept lands.
- **Romania-first, international-shaped.** Multi-currency-ready, i18n-ready, GDPR-by-default.
- **Solo-dev maintainability.** Lean on managed services; do not reinvent infrastructure.
- **No premature abstraction.** Build the seam, not both implementations of the seam.
