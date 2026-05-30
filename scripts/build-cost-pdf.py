#!/usr/bin/env python3.10
"""
Build docs/heia-cost-analysis.pdf — Heia cost analysis with the corrected
Google Maps math, per-user consumption model, transaction volumes, and
pricing-floor tables (Stripe absorbed).

Run: python3.10 scripts/build-cost-pdf.py
"""
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak,
    Table, TableStyle, KeepTogether, ListFlowable, ListItem,
)
from reportlab.pdfgen import canvas

# ─── design tokens ─────────────────────────────────────────────────────────

FONT = 'Helvetica'
FONT_BOLD = 'Helvetica-Bold'
FONT_IT = 'Helvetica-Oblique'

TEXT = colors.HexColor('#1E2620')
MUTED = colors.HexColor('#6B7066')
ACCENT = colors.HexColor('#5E7050')
HEAD_BG = colors.HexColor('#EAEDE3')
ALT_BG = colors.HexColor('#F6F7F2')
RULE = colors.HexColor('#CFD3C6')
DESTRUCTIVE = colors.HexColor('#A04848')

PAGE_W, PAGE_H = A4
MARGIN = 20 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

# ─── styles ────────────────────────────────────────────────────────────────

styles = getSampleStyleSheet()

S_BODY = ParagraphStyle(
    'body', parent=styles['Normal'], fontName=FONT, fontSize=10,
    leading=14, textColor=TEXT, alignment=TA_LEFT, spaceAfter=6,
)
S_SMALL = ParagraphStyle(
    'small', parent=S_BODY, fontSize=8.5, leading=12, textColor=MUTED,
)
S_KICKER = ParagraphStyle(
    'kicker', parent=S_BODY, fontName=FONT_BOLD, fontSize=8, leading=10,
    textColor=MUTED, spaceBefore=4, spaceAfter=2,
)
S_H1 = ParagraphStyle(
    'h1', parent=S_BODY, fontName=FONT_BOLD, fontSize=20, leading=24,
    textColor=TEXT, spaceBefore=14, spaceAfter=10,
)
S_H2 = ParagraphStyle(
    'h2', parent=S_BODY, fontName=FONT_BOLD, fontSize=14, leading=18,
    textColor=TEXT, spaceBefore=14, spaceAfter=8,
)
S_H3 = ParagraphStyle(
    'h3', parent=S_BODY, fontName=FONT_BOLD, fontSize=11, leading=14,
    textColor=ACCENT, spaceBefore=10, spaceAfter=4,
)
S_NOTE = ParagraphStyle(
    'note', parent=S_BODY, fontName=FONT_IT, fontSize=9, leading=12,
    textColor=MUTED, leftIndent=10, borderColor=ACCENT,
    borderWidth=0, borderPadding=0,
)
S_BULLET = ParagraphStyle(
    'bullet', parent=S_BODY, fontSize=10, leading=14, leftIndent=14,
    bulletIndent=0,
)
S_COVER_TITLE = ParagraphStyle(
    'cover_title', parent=S_BODY, fontName=FONT_BOLD, fontSize=32,
    leading=36, textColor=TEXT, spaceAfter=10,
)
S_COVER_SUB = ParagraphStyle(
    'cover_sub', parent=S_BODY, fontName=FONT_IT, fontSize=13, leading=16,
    textColor=MUTED, spaceAfter=20,
)
S_COVER_KICKER = ParagraphStyle(
    'cover_kicker', parent=S_BODY, fontName=FONT_BOLD, fontSize=10,
    leading=12, textColor=ACCENT, spaceAfter=10,
)

# ─── primitives ─────────────────────────────────────────────────────────────

def p(text, style=S_BODY):
    return Paragraph(text, style)

def h1(text):
    return Paragraph(text, S_H1)

def h2(text):
    return Paragraph(text, S_H2)

def h3(text):
    return Paragraph(text, S_H3)

def kicker(text):
    return Paragraph(text.upper(), S_KICKER)

def note(text):
    # Left rule via a single-cell table so we get a clean coloured stripe.
    inner = Paragraph(text, S_NOTE)
    t = Table([[inner]], colWidths=[CONTENT_W - 6 * mm])
    t.setStyle(TableStyle([
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LINEBEFORE', (0, 0), (0, -1), 2.2, ACCENT),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t

def bullets(items):
    flowables = []
    for item in items:
        flowables.append(ListItem(Paragraph(item, S_BULLET), leftIndent=10, value='•'))
    return ListFlowable(
        flowables, bulletType='bullet', bulletColor=ACCENT,
        leftIndent=18, bulletFontSize=8,
    )

def table(rows, col_widths, header=True, zebra=True, accent_last=False):
    """rows: 2-D list of strings or Paragraphs."""
    # Wrap strings in Paragraphs so they wrap inside cells.
    def cell(v, header_cell=False, align='LEFT'):
        if hasattr(v, 'wrap'):  # already a flowable
            return v
        style = ParagraphStyle(
            'cell',
            parent=S_BODY,
            fontName=FONT_BOLD if header_cell else FONT,
            fontSize=9 if header_cell else 9,
            leading=11.5,
            textColor=TEXT,
            alignment={'LEFT': TA_LEFT, 'RIGHT': TA_RIGHT, 'CENTER': TA_CENTER}[align],
            spaceAfter=0, spaceBefore=0,
        )
        return Paragraph(str(v), style)

    nrows = len(rows)
    ncols = len(rows[0])

    # Default: first column LEFT, others RIGHT (numbers).
    def col_align(ci):
        return 'LEFT' if ci == 0 else 'RIGHT'

    data = []
    for ri, row in enumerate(rows):
        is_header = header and ri == 0
        data.append([cell(v, is_header, col_align(ci)) for ci, v in enumerate(row)])

    t = Table(data, colWidths=col_widths, repeatRows=1 if header else 0)

    ts = [
        ('GRID', (0, 0), (-1, -1), 0.25, RULE),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]
    if header:
        ts.append(('BACKGROUND', (0, 0), (-1, 0), HEAD_BG))
        ts.append(('FONTNAME', (0, 0), (-1, 0), FONT_BOLD))
    if zebra:
        for ri in range(1 if header else 0, nrows):
            if (ri - (1 if header else 0)) % 2 == 0:
                ts.append(('BACKGROUND', (0, ri), (-1, ri), ALT_BG))
    if accent_last:
        ts.append(('BACKGROUND', (0, -1), (-1, -1), HEAD_BG))
        ts.append(('FONTNAME', (0, -1), (-1, -1), FONT_BOLD))

    t.setStyle(TableStyle(ts))
    return t

# ─── page template (header + footer) ───────────────────────────────────────

def on_page(canv: canvas.Canvas, doc):
    canv.saveState()
    canv.setFont(FONT, 8)
    canv.setFillColor(MUTED)
    canv.drawString(MARGIN, PAGE_H - MARGIN + 8, 'Heia · Cost analysis')
    canv.drawRightString(PAGE_W - MARGIN, PAGE_H - MARGIN + 8, 'Internal · May 2026')
    canv.setStrokeColor(RULE)
    canv.setLineWidth(0.3)
    canv.line(MARGIN, PAGE_H - MARGIN + 3, PAGE_W - MARGIN, PAGE_H - MARGIN + 3)

    canv.drawCentredString(PAGE_W / 2, MARGIN - 12,
                           f'Page {doc.page}')
    canv.restoreState()

def on_cover_page(canv: canvas.Canvas, doc):
    canv.saveState()
    canv.setFillColor(ACCENT)
    canv.rect(0, PAGE_H - 12 * mm, PAGE_W, 12 * mm, stroke=0, fill=1)
    canv.restoreState()

# ─── content ───────────────────────────────────────────────────────────────

story = []

# Cover
story.extend([
    Spacer(1, 60 * mm),
    Paragraph('HEIA', S_COVER_KICKER),
    Paragraph('Cost analysis', S_COVER_TITLE),
    Paragraph('Per-user consumption, transaction volumes, and pricing floors — including corrected Google Maps math.', S_COVER_SUB),
    Spacer(1, 25 * mm),
    Paragraph('Selfcare &amp; wellness marketplace · Romania-first', S_BODY),
    Paragraph('Prepared May 2026 (revision 2)', S_SMALL),
    PageBreak(),
])

# ─── 1 — Executive summary ─────────────────────────────────────────────────
story += [
    kicker('01 · Executive summary'),
    h1('What we found'),
    p('Heia is exceptionally cheap to run at every realistic scale. The infrastructure floor — the fixed cost of being online with no users — is <b>€44 / month</b> (Vercel Pro + Supabase Pro + domain). Above that, per-user costs are fractions of a euro cent at scale.'),
    p('The dominant variable cost <i>at meaningful scale</i> is Google Maps. With realistic usage assumptions (≈2 dynamic map loads per client per month, not the 20 used in the first pass), the Maps line stays inside the $200 free credit until roughly <b>30,000 MAU</b>, and stays under €100/month if static-map caching is implemented for studio cards (the pattern Mero uses on <font face="Helvetica-Oblique">d3ntpzmu1pnqba.cloudfront.net</font>).'),
    p('Whether Heia operates as a SaaS-for-salons (Mero model) or a true marketplace (Heia processes payments and absorbs Stripe), the cost-recovery floor for the platform is small enough that pricing decisions are decoupled from cost: <b>set price by perceived value, not by infrastructure overhead.</b>'),
    Spacer(1, 4 * mm),
    table([
        ['Phase', 'Cash floor', 'Monthly tooling', 'When'],
        ['Setup → soft launch', '€15 – €500', '€44 – €105', 'Now → +3 months'],
        ['Romania launch (10k MAU)', '€500 – €2,500', '€105 – €200', '+3 → +9 months'],
        ['Regional growth (100k MAU)', '€2k – €10k', '€417 (mitigated)', '+12 months on'],
        ['National scale (1M MAU)', 'Team build', '€2,200 (mitigated)', '+24 months on'],
    ], [50*mm, 40*mm, 40*mm, 40*mm]),
    Spacer(1, 4 * mm),
    note('“Mitigated” means static-map caching on studio cards, Cloudflare R2 for image storage, and Cloudflare CDN in front of Vercel. None are required before 50k MAU.'),
    PageBreak(),
]

# ─── 2 — Per-user consumption model ────────────────────────────────────────
story += [
    kicker('02 · Per-user consumption model'),
    h1('The 10:1 ratio'),
    p('Working assumptions: <b>10 clients per 1 expert</b>, with experts holding ~10× the stored data (galleries, services, availability vs. a client avatar). Egress flips: clients drive the bandwidth because they browse experts’ image-heavy galleries.'),
    Spacer(1, 3 * mm),
    table([
        ['Per user / month', 'Client', 'Expert', 'Mix (10:1)'],
        ['Storage (DB + images)', '0.3 MB', '3.0 MB', '0.55 MB'],
        ['Egress (bandwidth)', '33 MB', '5 MB', '30 MB'],
        ['Map loads (Google)', '2 – 3', '0', '~2.2'],
        ['Emails sent', '2.5', '1.5', '~2.4'],
        ['Bookings / month', '0.30', '—', '0.27'],
    ], [55*mm, 35*mm, 35*mm, 45*mm]),
    note('Reasoning: a client holds an avatar (≈300 KB) and some booking history; an expert holds 6–12 gallery photos + services + availability (≈3 MB). The 10× ratio is structural. Map loads were 20 in the first revision of this document; that estimate was too aggressive and has been corrected to 2–3 based on realistic browsing patterns (see chapter 5).'),

    h2('Volumes at scale'),
    table([
        ['MAU', 'Clients', 'Experts', 'Storage', 'Egress', 'Map loads', 'Emails'],
        ['1,000', '909', '91', '0.5 GB', '30 GB', '1.8k', '2.4k'],
        ['10,000', '9,091', '909', '5.5 GB', '300 GB', '18k', '24k'],
        ['50,000', '45,455', '4,545', '27 GB', '1.5 TB', '91k', '120k'],
        ['100,000', '90,909', '9,091', '55 GB', '3 TB', '182k', '240k'],
        ['500,000', '454,545', '45,455', '273 GB', '15 TB', '909k', '1.2M'],
        ['1,000,000', '909,091', '90,909', '545 GB', '30 TB', '1.8M', '2.4M'],
    ], [22*mm, 24*mm, 22*mm, 22*mm, 22*mm, 24*mm, 22*mm]),
    PageBreak(),
]

# ─── 3 — Cost tables ───────────────────────────────────────────────────────
story += [
    kicker('03 · Monthly cost'),
    h1('Current stack — no mitigations'),
    p('Vercel + Supabase + Google Maps + Resend + Sentry + Plausible + domain. Stripe is excluded (transactional, modelled separately).'),
    Spacer(1, 3 * mm),
    table([
        ['Line', '1k', '10k', '50k', '100k', '500k', '1M'],
        ['Vercel (Pro + egress)', '€19', '€25', '€42', '€112', '€670', '€1,395'],
        ['Supabase (Pro + MAU + egress)', '€23', '€27', '€128', '€315', '€2,557', '€5,533'],
        ['Google Maps (corrected)', '€0', '€0', '€405', '€998', '€5,732', '€11,650'],
        ['Resend email', '€0', '€19', '€33', '€80', '€230', '€400'],
        ['Sentry', '€0', '€24', '€74', '€74', '€230', '€230'],
        ['Plausible analytics', '€8', '€18', '€19', '€45', '€99', '€179'],
        ['Domain', '€2', '€2', '€2', '€2', '€2', '€2'],
        ['<b>Total / month</b>', '<b>€52</b>', '<b>€115</b>', '<b>€703</b>',
         '<b>€1,626</b>', '<b>€9,520</b>', '<b>€19,389</b>'],
    ], [50*mm, 18*mm, 18*mm, 18*mm, 18*mm, 20*mm, 28*mm], accent_last=True),

    h2('With mitigations'),
    p('Mitigations stacked: static-map thumbnails for studio cards, Mapbox for the live map, Cloudflare R2 for image storage, Cloudflare CDN in front of Vercel, WorkOS AuthKit instead of Supabase Auth above 100k MAU (free to 1M MAU).'),
    Spacer(1, 3 * mm),
    table([
        ['Line', '1k', '10k', '50k', '100k', '500k', '1M'],
        ['Vercel (behind CF)', '€19', '€19', '€19', '€25', '€25', '€25'],
        ['Supabase Postgres only', '€23', '€23', '€55', '€85', '€120', '€120'],
        ['Auth (Supabase / WorkOS)', 'incl', 'incl', 'incl', 'incl', '€0', '€0'],
        ['Cloudflare R2', '€0', '€0', '€0', '€1', '€4', '€8'],
        ['Maps (static + Mapbox)', '€0', '€0', '€0', '€0', '€90', '€405'],
        ['Resend email', '€0', '€19', '€33', '€80', '€230', '€400'],
        ['Sentry', '€0', '€24', '€74', '€74', '€230', '€230'],
        ['Plausible analytics', '€8', '€18', '€19', '€45', '€99', '€179'],
        ['Domain', '€2', '€2', '€2', '€2', '€2', '€2'],
        ['<b>Total / month</b>', '<b>€52</b>', '<b>€105</b>', '<b>€202</b>',
         '<b>€312</b>', '<b>€800</b>', '<b>€1,369</b>'],
    ], [50*mm, 18*mm, 18*mm, 18*mm, 18*mm, 20*mm, 28*mm], accent_last=True),
    PageBreak(),
]

# ─── 4 — Transaction volumes ───────────────────────────────────────────────
story += [
    kicker('04 · Transactions'),
    h1('Booking and payment volume'),
    p('Bookings per client per month vary by maturity. The central estimate (0.30) matches the cost model above; the early estimate matches typical pre-PMF marketplace conversion; the mature estimate matches Mero-level engagement.'),
    Spacer(1, 3 * mm),
    table([
        ['MAU', 'Clients', 'Early (×0.15)', 'Central (×0.30)', 'Mature (×0.45)'],
        ['1,000', '909', '136 / mo', '273 / mo', '409 / mo'],
        ['10,000', '9,091', '1,364 / mo', '2,727 / mo', '4,091 / mo'],
        ['50,000', '45,455', '6,818 / mo', '13,636 / mo', '20,455 / mo'],
        ['100,000', '90,909', '13,636 / mo', '27,273 / mo', '40,909 / mo'],
        ['500,000', '454,545', '68,182 / mo', '136,364 / mo', '204,545 / mo'],
        ['1,000,000', '909,091', '136,364 / mo', '272,727 / mo', '409,091 / mo'],
    ], [25*mm, 30*mm, 35*mm, 35*mm, 35*mm]),

    h2('GMV and Stripe load (central, full-marketplace mode)'),
    p('Assumed average ticket: <b>€50</b>. Stripe fee per transaction: 1.5% + €0.25 ≈ <b>€1.00 per €50 booking</b> ≈ <b>2% of GMV</b>. Heia absorbs the Stripe cut.'),
    Spacer(1, 3 * mm),
    table([
        ['MAU', 'Bookings / mo', 'GMV / month', 'Stripe load / mo'],
        ['1,000', '273', '€13,640', '€273'],
        ['10,000', '2,727', '€136,400', '€2,727'],
        ['50,000', '13,636', '€681,800', '€13,636'],
        ['100,000', '27,273', '€1,363,650', '€27,273'],
        ['500,000', '136,364', '€6,818,200', '€136,364'],
        ['1,000,000', '272,727', '€13,636,350', '€272,727'],
    ], [30*mm, 35*mm, 50*mm, 45*mm]),
    note('Stripe load is what Heia pays to the processor. Above this floor, every cent of commission charged to providers is gross margin.'),
    PageBreak(),
]

# ─── 5 — Google Maps math ──────────────────────────────────────────────────
story += [
    kicker('05 · Google Maps (corrected)'),
    h1('Where the cost actually comes from'),
    p('Google Maps Platform charges per API call, with a <b>$200 free credit per month</b> across all Maps APIs combined. Heia uses only the Maps JavaScript API for the live discover map; no Places, Directions, or Geocoding charges.'),
    Spacer(1, 3 * mm),
    table([
        ['API', 'Price', 'What triggers it'],
        ['Maps JavaScript — Dynamic', '$7 / 1,000 loads', 'Each call to new google.maps.Map()'],
        ['Maps Static API', '$2 / 1,000 loads', 'Each PNG image of a map'],
        ['Places Autocomplete', '$17 / 1,000 sessions', 'Each search-as-you-type session'],
        ['Places Details', '$17 – $32 / 1,000', 'Each metadata fetch'],
        ['Directions', '$5 / 1,000', 'Each route'],
        ['Geocoding', '$5 / 1,000', 'Each address → lat/lng'],
    ], [50*mm, 38*mm, 82*mm]),

    h2('The original number was too aggressive'),
    p('Revision 1 of this document used <b>20 dynamic map loads per client per month</b>, which translated to €11,600/month at 100k MAU. That assumption modelled a power user, not a realistic average.'),
    Spacer(1, 3 * mm),
    table([
        ['User type', '% of base', 'Map loads / month'],
        ['Light (open app 1–2×, browse once)', '60%', '1'],
        ['Medium (open 5×, browse 2–3×)', '30%', '3'],
        ['Heavy (open 15×, browse 5–6×)', '10%', '7'],
        ['<b>Weighted average</b>', '', '<b>~2.2</b>'],
    ], [85*mm, 35*mm, 50*mm], accent_last=True),

    h2('Corrected cost at 100k MAU under different assumptions'),
    table([
        ['Loads / client / month', 'Total loads', 'Gross', 'After $200 credit', 'EUR'],
        ['1 (heavily optimized)', '90,909', '$636', '$436', '€405'],
        ['2 (realistic average)', '181,818', '$1,273', '$1,073', '€998'],
        ['3 (high engagement)', '272,727', '$1,909', '$1,709', '€1,589'],
        ['7 (aggressive)', '636,363', '$4,455', '$4,255', '€3,957'],
        ['20 (rev. 1 estimate)', '1,818,180', '$12,727', '$12,527', '€11,650'],
    ], [45*mm, 30*mm, 25*mm, 35*mm, 35*mm]),

    h2('What mitigations actually save'),
    p('Two cheap moves cut Maps cost to near zero at every scale below 1M MAU:'),
    bullets([
        '<b>Static map thumbnails</b> for studio cards. Maps Static API is $2/1k (3.5× cheaper than dynamic) <i>and</i> the resulting PNGs can be cached on your own CDN — which makes repeat views free. Mero does exactly this on <font face="Helvetica-Oblique">d3ntpzmu1pnqba.cloudfront.net</font>.',
        '<b>Only render the live map on /discover</b>, never on /studio/[id] or in lists. Studio profile pages show a static PNG of the location, not a live embed.',
    ]),
    p('With both, the effective rate drops from ~2.2 loads/client/month to ~0.5. At 100k MAU that\'s 45,500 loads/month — well inside the $200 free credit. <b>Maps cost: €0.</b>'),

    h2('Plug-and-play formula'),
    note('monthly_maps_cost_EUR = max(0, (MAU × 0.909 × loads_per_client × 0.007) − 200) × 0.93<br/>'
         '— MAU: total monthly active users<br/>'
         '— 0.909: client share (10/11 of MAU)<br/>'
         '— loads_per_client: average dynamic map loads per client per month<br/>'
         '— $200: monthly free credit<br/>'
         '— 0.93: USD → EUR conversion'),
    PageBreak(),
]

# ─── 6 — Pricing floors ────────────────────────────────────────────────────
story += [
    kicker('06 · Pricing floor'),
    h1('The minimum to keep the lights on'),
    p('Cost-recovery floor only — pure infrastructure and (where applicable) Stripe fees that Heia absorbs. Whatever margin you set goes on top.'),

    h3('Floor A — Booking-only model (no Stripe, infra only)'),
    table([
        ['MAU', 'Infra / mo', 'Floor per expert / mo', 'Floor per booking'],
        ['1,000', '€52', '€0.57', '€0.19'],
        ['10,000', '€105', '€0.12', '€0.04'],
        ['50,000', '€242', '€0.053', '€0.018'],
        ['100,000', '€417', '€0.046', '€0.015'],
        ['500,000', '€1,320', '€0.029', '€0.010'],
        ['1,000,000', '€2,204', '€0.024', '€0.008'],
    ], [25*mm, 30*mm, 55*mm, 45*mm]),

    h3('Floor B — Marketplace model (Heia absorbs Stripe)'),
    p('Stripe = €1 / booking on average ≈ 3 bookings / expert / month ≈ €3 / expert / month.'),
    Spacer(1, 2 * mm),
    table([
        ['MAU', 'Infra / expert', 'Stripe / expert',
         'Floor per expert / mo', 'Floor per booking', 'Floor as % of GMV'],
        ['1,000', '€0.57', '€3.00', '€3.57', '€1.19', '2.4%'],
        ['10,000', '€0.12', '€3.00', '€3.12', '€1.04', '2.1%'],
        ['50,000', '€0.05', '€3.00', '€3.05', '€1.02', '2.0%'],
        ['100,000', '€0.05', '€3.00', '€3.05', '€1.015', '2.0%'],
        ['500,000', '€0.03', '€3.00', '€3.03', '€1.010', '2.0%'],
        ['1,000,000', '€0.02', '€3.00', '€3.02', '€1.008', '2.0%'],
    ], [20*mm, 25*mm, 25*mm, 35*mm, 30*mm, 30*mm]),
    note('Above ~5k MAU the floor essentially flatlines at ~€3/expert/month or ~2% of GMV. Infra is a rounding error from there onward — the floor is dominated by Stripe.'),

    h2('What you can charge above the floor'),
    p('Example: 10k MAU, marketplace mode. The Stripe + infra floor is €1.04 per €50 booking. The Mero/Booksy market range is 5–15% commission. So if Heia charges:'),
    Spacer(1, 3 * mm),
    table([
        ['Headline rate', 'On €50 booking', 'Floor', 'Heia margin / booking'],
        ['3% of GMV', '€1.50', '€1.04', '€0.46'],
        ['5% of GMV', '€2.50', '€1.04', '€1.46'],
        ['10% of GMV', '€5.00', '€1.04', '€3.96'],
        ['15% of GMV', '€7.50', '€1.04', '€6.46'],
    ], [40*mm, 35*mm, 25*mm, 50*mm]),
    p('Or in subscription form at 10k MAU (booking-only, no Stripe):'),
    Spacer(1, 3 * mm),
    table([
        ['Headline rate', 'Stripe', 'Infra', 'Heia margin / expert / mo'],
        ['€5 / expert / mo', '€0', '€0.12', '€4.88'],
        ['€15 / expert / mo', '€0', '€0.12', '€14.88'],
        ['€30 / expert / mo (Mero range)', '€0', '€0.12', '€29.88'],
    ], [55*mm, 25*mm, 25*mm, 45*mm]),
    PageBreak(),
]

# ─── 7 — Mero findings ─────────────────────────────────────────────────────
story += [
    kicker('07 · Competitive read'),
    h1('What Mero actually does'),
    p('Two facts from public data and direct site inspection that shape Heia’s positioning.'),

    h3('1. In-app payments are opt-in per salon, not platform-wide'),
    bullets([
        'Mero’s primary model is SaaS subscription to the salon (€30–€60/month range).',
        'In-app card payment via Stripe is an <i>optional</i> feature — turned on per salon to reduce no-shows and enable deposits.',
        'Stripe fee passed through at 1.5% + €1 RON; <b>no marketplace commission</b> taken by Mero on top.',
        'Implication for Heia: differentiation cannot be “we have in-app payments” — Mero already does. Differentiation has to be brand/positioning + payment model (take-rate marketplace vs SaaS subscription).',
    ]),

    h3('2. Image architecture: S3 + CloudFront, with pre-sized variants'),
    bullets([
        'Storage: AWS S3 in <b>eu-central-1 (Frankfurt)</b>, bucket <font face="Helvetica-Oblique">novabooker-uploads-eu-central</font>. (Mero’s parent was originally Novabooker.) EU region for GDPR.',
        'Delivery: AWS CloudFront. ~441 of 461 image references on a typical salon page are CDN-served.',
        'Images stored as files; database (MongoDB, evidenced by ObjectID-shaped filenames) holds only IDs.',
        'Variants pre-generated at upload, not on-the-fly: <i>thumbnail / small / medium / large / croppedLarge</i>. Trades flexibility for cost — Cloudinary-style transforms would be 10× more expensive.',
        'Static map thumbnails cached on a separate CloudFront distribution. This is the same Maps mitigation Heia should adopt.',
    ]),
    note('Heia’s current stack (Supabase Storage + Supabase CDN) is architecturally equivalent — Supabase Storage is S3-compatible under the hood. The patterns to mirror: pre-sized variants on upload, image references in DB (not bytes), static map caching on a CDN. None of this requires changing stacks.'),
    PageBreak(),
]

# ─── 8 — Watchpoints + recommendation ──────────────────────────────────────
story += [
    kicker('08 · Watchpoints'),
    h1('Triggers to revisit the stack'),
    p('Observable signals that mean it is time to migrate one piece. Migrate one piece at a time, never the whole stack at once.'),
    bullets([
        '<b>Maps spend exceeds €100/month for two consecutive months</b> → implement static-map caching for studio cards <i>before</i> considering Mapbox migration.',
        '<b>Supabase DB exceeds 6 GB or query p95 exceeds 200 ms</b> → upgrade Compute (Small → Medium → Large) before considering a different provider.',
        '<b>Studio image storage exceeds 80 GB</b> → move new uploads to Cloudflare R2 (no egress fees); lazily migrate old ones.',
        '<b>Email volume exceeds 30k/month</b> → upgrade Resend tier or add Postmark for transactional vs marketing split.',
        '<b>Vercel bandwidth exceeds 800 GB/month</b> → put Cloudflare in front of Vercel (free) for image and static asset caching.',
        '<b>Supabase MAU exceeds 100k</b> → evaluate WorkOS AuthKit (free to 1M MAU) for the auth surface, keeping Supabase for Postgres only.',
    ]),

    kicker('09 · Recommendation'),
    h1('What to do'),
    p('Stay on the current stack — Next.js, Vercel, Supabase, Google Maps — through pilot and Romania launch. Total tooling spend stays under €200/month all the way to 10k MAU on any reasonable usage pattern.'),
    p('Three line items to budget for ahead of launch:'),
    bullets([
        'Vercel Pro and Supabase Pro from launch day onward: ~€42/month combined.',
        '~€500 contingency for the first lawyer review of T&amp;Cs and privacy policy, ideally before opening paid bookings.',
        '€1,500–€3,000 marketing-channel test budget in the first three months of the Romania launch — out of scope here but the actual cost lever.',
    ]),
    p('Re-run this analysis when any watchpoint trigger fires, or every six months, whichever comes first.'),
    Spacer(1, 8 * mm),
    note('This is revision 2 of the cost analysis. Revision 1 used inflated Google Maps assumptions (20 loads/client/month); revision 2 uses the corrected 2–3 loads/client/month based on realistic browsing patterns. The pricing-floor and transaction-volume sections are new.'),
]

# ─── build ─────────────────────────────────────────────────────────────────

out_dir = Path(__file__).resolve().parent.parent / 'docs'
out_dir.mkdir(parents=True, exist_ok=True)
out_path = out_dir / 'heia-cost-analysis.pdf'

doc = BaseDocTemplate(
    str(out_path),
    pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN + 6 * mm, bottomMargin=MARGIN,
    title='Heia — Cost analysis',
    author='Heia',
)

frame = Frame(MARGIN, MARGIN, CONTENT_W, PAGE_H - 2 * MARGIN - 6 * mm,
              showBoundary=0, leftPadding=0, rightPadding=0,
              topPadding=0, bottomPadding=0, id='content')

cover_template = PageTemplate(id='cover', frames=[frame], onPage=on_cover_page)
body_template = PageTemplate(id='body', frames=[frame], onPage=on_page)

doc.addPageTemplates([cover_template, body_template])

# Switch from cover template to body template after the first page break.
class SwitchToBody:
    def wrap(self, *a, **k):
        return (0, 0)
    def drawOn(self, canv, x, y, _sw=0):
        pass

# Use a NextPageTemplate so subsequent pages use the body template.
from reportlab.platypus.doctemplate import NextPageTemplate
# Insert NextPageTemplate just before the first PageBreak.
# Find index of first PageBreak in story:
for i, item in enumerate(story):
    if isinstance(item, PageBreak):
        story.insert(i, NextPageTemplate('body'))
        break

doc.build(story)
print(f'wrote {out_path} ({out_path.stat().st_size / 1024:.1f} KB)')
