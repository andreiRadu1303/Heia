/**
 * Generates docs/heia-cost-analysis.docx.
 * Run: node scripts/build-cost-doc.js
 */
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, TabStopType, TabStopPosition,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TableOfContents,
} = require('docx');

/* ---------------- design tokens ---------------- */

const FONT = 'Calibri';
const COLOR_TEXT = '1E2620';     // deep slate (matches Heia brand)
const COLOR_MUTED = '6B7066';
const COLOR_ACCENT = '5E7050';   // sage
const COLOR_HEAD_BG = 'EAEDE3';  // soft sage tint
const COLOR_ALT_BG = 'F6F7F2';
const COLOR_RULE = 'CFD3C6';

// A4 portrait
const PAGE_W = 11906;
const PAGE_H = 16838;
const MARGIN = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2; // 9026

/* ---------------- primitives ---------------- */

const border = { style: BorderStyle.SINGLE, size: 4, color: COLOR_RULE };
const borders = { top: border, bottom: border, left: border, right: border };

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: FONT,
    color: opts.color || COLOR_TEXT,
    bold: !!opts.bold,
    italics: !!opts.italics,
    size: opts.size || 22,           // 11pt default
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 60, after: opts.after ?? 100, line: 300 },
    alignment: opts.align,
    children: Array.isArray(text) ? text : [run(text, opts)],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: FONT, color: COLOR_TEXT, bold: true, size: 36 })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
    children: [new TextRun({ text, font: FONT, color: COLOR_TEXT, bold: true, size: 28 })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: FONT, color: COLOR_ACCENT, bold: true, size: 24 })],
  });
}

function kicker(text) {
  return new Paragraph({
    spacing: { before: 60, after: 40 },
    children: [new TextRun({
      text: text.toUpperCase(),
      font: FONT,
      color: COLOR_MUTED,
      bold: true,
      size: 16,
      characterSpacing: 60,
    })],
  });
}

function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: opts.level || 0 },
    spacing: { before: 30, after: 30, line: 290 },
    children: [run(text)],
  });
}

function note(text) {
  return new Paragraph({
    spacing: { before: 100, after: 100, line: 290 },
    indent: { left: 240, right: 240 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 16, color: COLOR_ACCENT, space: 12 },
    },
    children: [run(text, { italics: true, color: COLOR_MUTED })],
  });
}

function cell(text, opts = {}) {
  const widthDxa = opts.width;
  const children = Array.isArray(text)
    ? text.map((t) => new Paragraph({
        spacing: { before: 40, after: 40, line: 280 },
        children: [run(typeof t === 'string' ? t : t.text, {
          bold: opts.bold || (typeof t === 'object' && t.bold),
          color: opts.color,
          size: opts.size,
        })],
      }))
    : [new Paragraph({
        spacing: { before: 40, after: 40, line: 280 },
        alignment: opts.align,
        children: [run(text, {
          bold: opts.bold,
          color: opts.color,
          size: opts.size,
        })],
      })];

  return new TableCell({
    borders,
    width: { size: widthDxa, type: WidthType.DXA },
    shading: opts.bg ? { fill: opts.bg, type: ShadingType.CLEAR } : undefined,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    verticalAlign: 'center',
    children,
  });
}

function table({ columns, rows, headerBg = COLOR_HEAD_BG, zebra = true }) {
  const totalWidth = columns.reduce((a, b) => a + b, 0);
  const tableRows = rows.map((cells, ri) => {
    const isHeader = ri === 0;
    return new TableRow({
      tableHeader: isHeader,
      children: cells.map((c, ci) => {
        const opts = typeof c === 'object' && !Array.isArray(c) ? c : { text: c };
        return cell(opts.text ?? c, {
          width: columns[ci],
          bold: isHeader || opts.bold,
          color: opts.color,
          size: opts.size,
          align: opts.align,
          bg: isHeader ? headerBg : (zebra && ri % 2 === 0 ? COLOR_ALT_BG : undefined),
        });
      }),
    });
  });
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: columns,
    rows: tableRows,
  });
}

function spacer(size = 120) {
  return new Paragraph({ spacing: { before: size, after: size }, children: [] });
}

function rule() {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: COLOR_RULE, space: 6 } },
    children: [],
  });
}

/* ---------------- content ---------------- */

const children = [];

// ----- Cover -----
children.push(
  new Paragraph({ spacing: { before: 2000 }, children: [] }),
  new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({ text: 'HEIA', font: FONT, color: COLOR_ACCENT, bold: true, size: 24, characterSpacing: 200 })],
  }),
  new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: 'Cost analysis', font: FONT, color: COLOR_TEXT, bold: true, size: 72 })],
  }),
  new Paragraph({
    spacing: { after: 600 },
    children: [new TextRun({ text: 'Setup, launch, and maintenance — current stack and alternatives', font: FONT, color: COLOR_MUTED, italics: true, size: 28 })],
  }),
  new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text: 'Selfcare & wellness marketplace · Romania-first', font: FONT, color: COLOR_TEXT, size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text: 'Prepared May 2026', font: FONT, color: COLOR_MUTED, size: 22 })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ----- Executive summary -----
children.push(
  kicker('01 · Executive summary'),
  h1('At a glance'),
  p('Heia can be brought to a live soft-launch on the current stack for roughly €15–€500 in one-time cash (mostly a domain, optional legal templates, and optional brand work) plus ~€45/month in tooling. Scaling that to a country-wide Romania launch costs ~€120/month in tooling — well under €1,500 for the first full year before paid marketing. The dominant variable cost is Google Maps usage beyond ~28k loads/month, which can blow up to €3,000+/month at high scale unless mitigated.'),
  p('The recommendation is to stay on Next.js + Vercel + Supabase + Google Maps through the soft launch and Romania launch. Alternative stacks (self-hosted on Hetzner, Firebase, AWS) are cheaper on paper but expensive in ops time for a sole programmer.'),
  spacer(80),
  table({
    columns: [2200, 2200, 2400, 2226],
    rows: [
      ['Phase', 'One-time cash', 'Monthly tooling', 'When'],
      ['Setup → soft launch', '€15 – €500', '€0 – €45', 'Now → +3 months'],
      ['Romania launch', '€500 – €2,500', '€90 – €150', '+3 → +9 months'],
      ['Regional growth', '€2k – €10k', '€350 – €500*', '+12 months on'],
    ],
  }),
  p([
    run('* assuming Google Maps mitigations (caching, static maps, or Mapbox migration). Without mitigation, Maps API alone can exceed €3,000/month at 100k MAU.', { italics: true, color: COLOR_MUTED, size: 20 }),
  ]),
);

// ----- Scope & assumptions -----
children.push(
  kicker('02 · Scope'),
  h1('What this document covers'),
  p('This is a tooling and infrastructure budget. It estimates direct, recurring third-party costs (hosting, database, auth, email, maps, monitoring, payments) plus the one-time cash needed to ship a credible product. It explicitly does not cover:'),
  bullet('Founder time. The sole programmer and the partner doing marketing/research are not in this budget.'),
  bullet('Paid acquisition. Performance marketing, influencer partnerships, and PR are budgeted separately.'),
  bullet('Stripe transaction fees. These are listed for context but are a percentage of GMV, not a subscription, so they belong on the unit-economics side.'),
  bullet('Salaries, hardware, accounting, and corporate overhead.'),

  h2('Currency and pricing'),
  p('Quoted in EUR. USD vendor prices converted at €1 = $1.08 (approximate, mid-2026). Vendor list prices are pre-VAT — Romanian VAT (19%) applies to most B2B SaaS billed within the EU and is recoverable for a registered business. Prices change frequently; verify before commitment.'),

  h2('Scale tiers'),
  p('Three working scenarios drive the rest of the document:'),
  spacer(60),
  table({
    columns: [2000, 1500, 1500, 1500, 2526],
    rows: [
      ['Tier', 'MAU', 'Providers', 'Bookings/mo', 'Description'],
      ['Pilot', '500', '50', '200', 'Friends + first stylists, Bucharest only.'],
      ['Romania launch', '10,000', '500', '3,000', 'Country-wide soft launch with marketing.'],
      ['Regional growth', '100,000', '5,000', '30,000', 'Multi-city + first foreign locale.'],
    ],
  }),
  note('“MAU” means monthly active users that hit the site or app. Provider counts are active accounts with a published profile. Bookings are completed reservations.'),
);

// ----- Current stack -----
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  kicker('03 · Current stack'),
  h1('Pricing on what we have today'),
  p('The current production stack is Next.js (open source) hosted on Vercel, with Supabase for auth and Postgres, Google Maps for the discovery map, and supporting services for email, errors, and storage. Each line item is described, then summarised in a per-tier table.'),

  h2('Line items'),

  h3('Vercel — web hosting'),
  bullet('Hobby plan is free but disallows commercial use. Production requires Pro.'),
  bullet('Pro: $20/seat/month (€19). Includes 1 TB bandwidth and generous build minutes.'),
  bullet('Heavy image traffic or many serverless invocations can add bandwidth/function overages — typically €5–€30 at Romania scale.'),

  h3('Supabase — auth, Postgres, storage'),
  bullet('Free tier: 50k MAU, 500 MB DB, 1 GB storage, 5 GB egress. Free projects pause after 7 days inactive — not safe for production.'),
  bullet('Pro: $25/month (€23). 100k MAU, 8 GB DB, 100 GB storage, 250 GB egress, daily backups (7-day retention). Required for a live launch.'),
  bullet('Compute upgrades (Small → 2XL): $10 – $1,200/month. Most projects stay on Micro/Small for a long time.'),
  bullet('Storage overage: $0.021/GB/month above included 100 GB.'),

  h3('Google Maps Platform'),
  bullet('$200 free credit per month, applied to all Maps APIs.'),
  bullet('Dynamic Maps JS: $7 per 1,000 loads → free credit covers ~28,500 loads/month.'),
  bullet('Places Autocomplete: $17 per 1,000 sessions; Place Details: $17 – $32 per 1,000 depending on fields.'),
  bullet('At 100k MAU with 5 map loads each = 500k loads/month → ~€3,055 after credit. This is the biggest variable cost at scale.'),
  bullet('Mitigations: Static Maps API (cheaper), client-side caching of tiles, render fewer Advanced Markers, batch Places calls server-side. Or migrate to Mapbox: 50k free loads/month and $0.50/1k after.'),

  h3('Email — Resend (or Postmark)'),
  bullet('Resend free tier: 3,000 emails/month, 100/day. Enough for pilot.'),
  bullet('Resend Pro: $20/month for 50,000 emails. Enough for Romania launch.'),
  bullet('Postmark equivalent: $15/month for 10k, $50/month for 50k. Postmark has best deliverability for transactional.'),

  h3('Error monitoring — Sentry'),
  bullet('Free tier: 5k errors/month, 1 user. Enough for pilot.'),
  bullet('Team: $26/month for 50k events. Good through Romania launch.'),
  bullet('Business: $80/month for 250k events. Regional-growth tier.'),

  h3('DNS, SSL, CDN — Cloudflare'),
  bullet('Free. Including unlimited bandwidth on the orange-cloud proxy.'),
  bullet('R2 object storage (if used for studio images later): $0.015/GB/month stored, $0 egress.'),

  h3('Domain'),
  bullet('.com renewal: ~€12/year. .ro renewal: ~€20/year. heia-app.com or similar.'),

  h3('Analytics'),
  bullet('Vercel Analytics: included in Pro for 25k events; $50/month for 250k.'),
  bullet('Plausible (privacy-first, EU-hosted): €9/month up to 10k pageviews; €19 up to 100k. Recommended for GDPR-friendliness.'),
  bullet('PostHog (self-host or cloud): generous free tier, useful when product analytics matter more than vanity pageviews.'),

  h3('Payments — Stripe Connect (when live)'),
  bullet('Card fees: 1.5% + €0.25 (EEA card) or 2.5% + €0.25 (non-EEA / Amex). Transactional, not subscription.'),
  bullet('Connect Express accounts: $2/month per active connected account in the US; in the EU it is bundled, but currency conversions and payout fees still apply.'),
  bullet('Heia commission take rate (assumed 10% of booking) is gross; net after Stripe is roughly 6.5–7.5% depending on mix.'),
);

// ----- Cost table for current stack across tiers -----
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  h2('Current stack — monthly cost by tier'),
  p('Numbers are EUR per month. Ranges reflect realistic low/high based on real usage patterns. “Stripe fees” are excluded from totals because they are a percentage of GMV, not subscription.'),
  spacer(60),
  table({
    columns: [2426, 2000, 2000, 2600],
    rows: [
      ['Line item', 'Pilot (500 MAU)', 'Romania (10k MAU)', 'Regional (100k MAU)'],
      ['Vercel', '€19 (Pro required)', '€25 – €40', '€60 – €150'],
      ['Supabase', '€23 (Pro)', '€23 – €30', '€90 – €250'],
      ['Google Maps', '€0 (under credit)', '€0 – €30', '€500 – €3,055'],
      ['Email (Resend)', '€0', '€19', '€35 – €80'],
      ['Sentry', '€0', '€24', '€75'],
      ['Plausible / analytics', '€8', '€18', '€45'],
      ['Cloudflare R2', '€0', '€0 – €5', '€10 – €25'],
      ['Domain (amortised)', '€2', '€2', '€2'],
      [
        { text: 'Total / month', bold: true },
        { text: '€52', bold: true },
        { text: '€111 – €168', bold: true },
        { text: '€817 – €3,682', bold: true, color: COLOR_ACCENT },
      ],
      [
        { text: 'Total / month (with mitigations)', bold: true, color: COLOR_MUTED },
        { text: '€52', color: COLOR_MUTED },
        { text: '€111 – €168', color: COLOR_MUTED },
        { text: '€350 – €600', color: COLOR_ACCENT, bold: true },
      ],
    ],
  }),
  note('“Mitigations” means: switch the discovery map to Mapbox or cache static maps for non-interactive views; move studio images from Supabase storage to Cloudflare R2 once they exceed 50 GB; tune Sentry sample rate. None of these are required before Romania launch.'),
);

// ----- One-time setup -----
children.push(
  kicker('04 · One-time setup'),
  h1('Cash to ship the first version'),
  p('This is what has to be paid in cash before the product is live, separate from monthly tooling. Founder time is intentionally excluded.'),
  spacer(60),
  table({
    columns: [3000, 1600, 1600, 2826],
    rows: [
      ['Item', 'Low', 'High', 'Notes'],
      ['Domain registration (.com + .ro)', '€15', '€40', 'Annual. Bundle a hyphen-free alternative as a defensive registration.'],
      ['Logo and brand assets', '€0', '€2,000', 'DIY in Figma → free. Solid freelancer (Dribbble) → €500–€1,500. Studio → €2k+.'],
      ['Legal: T&Cs, privacy, cookie policy', '€0', '€1,500', 'EU-marketplace templates exist (Termly, iubenda). For real marketplace operations involving payments, use a lawyer once before scaling.'],
      ['Trademark search (RO + EU)', '€0', '€500', 'Self-search via OSIM/EUIPO is free. Lawyer consultation €200–€500. Filing the trademark is a separate ~€850 EUIPO fee (deferred until traction).'],
      ['Business registration (SRL)', '€0', '€500', 'Romanian SRL setup is roughly €200–€500 with an accountant; the founder can also do it solo.'],
      ['Stock photography (placeholders)', '€0', '€200', 'Unsplash free is fine for v1; Envato/Adobe Stock for polished marketing assets.'],
      [
        { text: 'Realistic total', bold: true },
        { text: '€15', bold: true },
        { text: '€4,740', bold: true },
        { text: 'Minimal credible launch: €15 (domain) + DIY everything else.' },
      ],
    ],
  }),

  h2('Launch month (incremental)'),
  bullet('Vercel Pro: €19 (turn it on the day before going live, not earlier — Hobby is fine for pre-launch).'),
  bullet('Supabase Pro: €23 (turn it on before opening signups; daily backups matter the moment users exist).'),
  bullet('Sentry Team: €24 (optional; free tier is fine for the first thousand users).'),
  bullet('Email sender domain warm-up: €0 — set DKIM/SPF/DMARC, send a small initial volume.'),
  bullet('Cookie/consent banner: €0 with a self-hosted component, or €9/month with Iubenda.'),
);

// ----- Alternatives -----
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  kicker('05 · Alternatives'),
  h1('What it would cost on other stacks'),
  p('These are not recommendations — they exist to put the current-stack pricing in context. Each row assumes equivalent functionality (SSR web app, Postgres-shaped data, auth, email, maps, error monitoring) at the Romania launch tier (~10k MAU). The lowest sticker price is rarely the best choice for a sole programmer because ops time is the hidden cost.'),

  h3('A · Self-hosted on Hetzner + Neon + Cloudflare'),
  bullet('Hetzner CX22 VPS (4 GB RAM, EU): €6/month — host the Next.js app via Docker or PM2.'),
  bullet('Neon serverless Postgres Launch: $19/month (~€18) for 10 GB DB + branch databases. Or Supabase self-hosted on a second VPS.'),
  bullet('Auth: NextAuth.js (free) or Clerk ($25/month for 10k MAU).'),
  bullet('Cloudflare: free CDN, R2 for images at $0.015/GB.'),
  bullet('Email: Resend €19. Maps: same Google charges. Sentry €24.'),
  bullet('Total: €70 – €110/month. Cheaper, but the programmer becomes a sysadmin: server upgrades, log rotation, backups, security patches.'),

  h3('B · Firebase'),
  bullet('Hosting + Firestore + Auth + Functions bundled. Generous Spark free tier; Blaze plan is pay-as-you-go.'),
  bullet('No native geo queries (PostGIS) — GeoFire and GeoFirestore exist but are heavy. Bad fit for “near me” discovery at scale.'),
  bullet('Bad fit for SSR/SEO — would need a separate Next.js host alongside Firebase services.'),
  bullet('Estimated Romania tier: €50 – €100/month, but feature surface costs more engineering for parity.'),

  h3('C · AWS Amplify + RDS Postgres + Cognito'),
  bullet('Amplify Hosting: ~$15/month + $0.15/GB egress (~€20–€40/month).'),
  bullet('RDS Postgres t4g.micro Multi-AZ: ~€30/month; without Multi-AZ ~€15.'),
  bullet('Cognito: free for first 50k MAU.'),
  bullet('SES email: $0.10 per 1,000 — practically free.'),
  bullet('Estimated Romania tier: €70 – €120/month. Steepest learning curve; great if scaling into AWS ecosystem later.'),

  h3('D · Netlify + PlanetScale (or Neon) + Mapbox'),
  bullet('Netlify Pro: $19/seat/month. Equivalent to Vercel Pro.'),
  bullet('PlanetScale Scaler: $39/month — MySQL-flavoured (not Postgres). Or Neon $19.'),
  bullet('Mapbox: $200 free credit, 50k loads free; €0.50/1k overage. Cheaper than Google at scale.'),
  bullet('Auth: NextAuth or Clerk.'),
  bullet('Estimated Romania tier: €80 – €120/month. The Mapbox swap is the main reason to consider this combination.'),

  h3('E · Render or Railway (PaaS Lite)'),
  bullet('Render Web Service Standard: $7/month. Postgres Starter: $7/month. Total platform fee ~$15.'),
  bullet('Auth via Supabase Auth alone ($0 free tier) or Clerk.'),
  bullet('Cold starts on the smallest plan; fine for pilot, not for launch.'),
  bullet('Estimated Romania tier: €40 – €80/month. Cheapest legitimate option; fewer guardrails than Vercel/Supabase.'),

  h2('Side-by-side at Romania scale'),
  spacer(60),
  table({
    columns: [2426, 2000, 2300, 2300],
    rows: [
      ['Stack', 'Monthly cost', 'Ops burden', 'Best for'],
      ['Current (Vercel + Supabase)', '€111 – €168', 'Low', 'Sole programmer wanting to stay in product mode.'],
      ['Self-hosted (Hetzner + Neon)', '€70 – €110', 'High', 'Teams with a dedicated devops person.'],
      ['Firebase', '€50 – €100', 'Medium', 'Apps without complex geo or SSR/SEO needs.'],
      ['AWS Amplify + RDS', '€70 – €120', 'High', 'Long-term AWS commitment.'],
      ['Netlify + Neon + Mapbox', '€80 – €120', 'Low', 'Heavy map usage — Mapbox is materially cheaper.'],
      ['Render / Railway', '€40 – €80', 'Low–Medium', 'Pilot stage and tight budgets.'],
    ],
  }),
  note('“Ops burden” is the part of the cost not on the invoice. A sole programmer paying €40/month but spending 8 hours/month patching servers is paying far more than someone on the €120/month managed stack.'),
);

// ----- 12-month projection -----
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  kicker('06 · 12-month projection'),
  h1('Total tooling cost, year one'),
  p('Cash spend through 12 months on the current stack, by scenario. Domain amortised at €15/year. Stripe fees and marketing excluded.'),
  spacer(60),
  table({
    columns: [2426, 2000, 2300, 2300],
    rows: [
      ['Scenario', 'Tooling/mo', '12-mo total', 'Comments'],
      ['Stay pilot all year', '€52', '€625', 'Hobby project budget. Plenty of room to validate.'],
      ['Pilot → Romania (mid-year)', '€80 avg', '€960', 'Realistic if launch hits ~month 6.'],
      ['Romania launch from month 1', '€140 avg', '€1,680', 'Aggressive ramp.'],
      ['Romania → regional (mid-year)', '€280 avg', '€3,360', 'Mid-year breakout, mitigations active.'],
    ],
  }),
  spacer(80),
  p([run('Reference point: ', { bold: true }), run('a single freelance developer day in Bucharest costs roughly €300–€600. The entire first year of cloud tooling at Romania scale costs about 3 freelance days. The cost lever is overwhelmingly founder time and marketing, not infrastructure.')]),
);

// ----- Watchpoints -----
children.push(
  kicker('07 · Watchpoints'),
  h1('Triggers to revisit the stack'),
  p('Specific, observable signals that mean it is time to migrate something. Migrate one piece at a time; never the whole stack at once.'),
  bullet('Maps spend exceeds €200/month for two consecutive months → enable Static Maps for thumbnails, then migrate the interactive map to Mapbox.'),
  bullet('Supabase DB exceeds 6 GB or query p95 exceeds 200 ms → upgrade Compute (Small → Medium → Large) before considering a different provider.'),
  bullet('Studio image storage exceeds 80 GB → move new uploads to Cloudflare R2 (no egress fees) and lazily migrate old ones.'),
  bullet('Email volume exceeds 30k/month → upgrade Resend tier or add Postmark for transactional vs marketing split.'),
  bullet('Vercel bandwidth exceeds 800 GB/month → set up Cloudflare in front of Vercel (free) for image and static asset caching.'),
  bullet('Stripe payouts exceed €50k/month → review Stripe Connect tier and consider negotiated card rates.'),
);

// ----- Recommendation -----
children.push(
  kicker('08 · Recommendation'),
  h1('What to do'),
  p('Stay on the current stack — Next.js, Vercel, Supabase, Google Maps — through the pilot and Romania launch. Total year-one tooling spend is under €2,000 in every realistic scenario, and the time saved by not running infrastructure pays for itself many times over for a sole programmer.'),
  p('Three line items to budget for ahead of launch:'),
  bullet('Vercel Pro and Supabase Pro from launch day onward: ~€42/month combined.'),
  bullet('A €500 contingency for the first lawyer review of T&Cs and privacy policy, ideally before opening paid bookings.'),
  bullet('A €1,500–€3,000 marketing-channel test budget in the first three months of the Romania launch — out of scope here but the actual cost lever.'),
  p('Re-run this analysis when any watchpoint trigger fires, or every six months, whichever comes first.'),
);

/* ---------------- document ---------------- */

const doc = new Document({
  creator: 'Heia',
  title: 'Heia — Cost analysis',
  description: 'Setup, launch and maintenance budget for the Heia marketplace.',
  styles: {
    default: { document: { run: { font: FONT, size: 22, color: COLOR_TEXT } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: FONT, color: COLOR_TEXT },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: FONT, color: COLOR_TEXT },
        paragraph: { spacing: { before: 260, after: 120 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: FONT, color: COLOR_ACCENT },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          {
            level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 280 } } },
          },
          {
            level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 900, hanging: 280 } } },
          },
        ],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
          children: [
            new TextRun({ text: 'Heia · Cost analysis', font: FONT, color: COLOR_MUTED, size: 18 }),
            new TextRun({ text: '\tInternal · May 2026', font: FONT, color: COLOR_MUTED, size: 18 }),
          ],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Page ', font: FONT, color: COLOR_MUTED, size: 18 }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, color: COLOR_MUTED, size: 18 }),
            new TextRun({ text: ' of ', font: FONT, color: COLOR_MUTED, size: 18 }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, color: COLOR_MUTED, size: 18 }),
          ],
        })],
      }),
    },
    children,
  }],
});

/* ---------------- emit ---------------- */

const outDir = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'heia-cost-analysis.docx');

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  console.log('wrote', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)');
});
