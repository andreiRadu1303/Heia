-- =============================================================
-- Heia · migration 004 · seed demo studios
-- =============================================================
-- Run AFTER 003_marketplace.sql. Idempotent — re-runs do nothing.
--
-- Seeds 12 demo studios (the same ones used in mock data, so URLs
-- like /studio/andra-studio keep working) with no provider_id.
-- They appear as published, browsable, and bookable. When a real
-- provider claims/creates a studio, theirs is separate.
-- =============================================================

-- 1. Studios --------------------------------------------------------

insert into public.studios
  (slug, name, category_id, tagline, bio, city, address, lat, lng,
   hero_seed, avatar_seed, gallery_seeds, known_for,
   price_from_lei, rating, review_count, is_published)
values
  ('andra-studio',
   'Andra Studio', 'hair', 'Balayage & lived-in colour',
   'A small, calm studio focused on colour that grows out beautifully. We take our time — one client at a time, no rush, no upsell.',
   'București', 'Str. Mendeleev 7', 44.4452, 26.0975,
   'andra-hero', 'andra',
   ARRAY['andra-1','andra-2','andra-3','andra-4'],
   ARRAY['Balayage','Soft glam','Lived-in colour'],
   180, 4.9, 218, true),

  ('salon-lumina',
   'Salon Lumina', 'hair', 'Classic cuts, modern finish',
   'A friendly neighbourhood salon. Walk-ins welcome, but booking gets you the stylist you want.',
   'București', 'Bd. Dacia 42', 44.4471, 26.1102,
   'lumina-hero', 'lumina',
   ARRAY['lumina-1','lumina-2','lumina-3'],
   ARRAY['Cuts','Blowouts','Bridal'],
   120, 4.7, 142, true),

  ('mihai-hair',
   E'Mihai · Hair', 'hair', 'Editorial cuts & texture',
   'Independent stylist working out of a shared studio. Texture, fringes, and cuts with a point of view.',
   'București', 'Str. Arthur Verona 13', 44.4419, 26.0968,
   'mihai-hero', 'mihai',
   ARRAY['mihai-1','mihai-2','mihai-3'],
   ARRAY['Editorial','Fringes','Texture'],
   220, 4.95, 96, true),

  ('barbierie-veche',
   E'Bărbierie Veche', 'barber', 'Hot towel, sharp fades',
   'Old-school barbershop energy with a clean modern finish. Espresso while you wait.',
   'București', E'Str. Franceză 30', 44.4301, 26.1024,
   'barber-hero', 'barbierie',
   ARRAY['barber-1','barber-2','barber-3'],
   ARRAY['Fades','Beard sculpt','Hot towel'],
   80, 4.8, 173, true),

  ('ink-and-co',
   'Ink & Co.', 'tattoo', 'Fine-line & blackwork',
   E'Private studio, by appointment only. Custom designs — bring a reference or a feeling, we''ll draw it.',
   'București', 'Str. Lipscani 55', 44.4318, 26.1008,
   'ink-hero', 'inkco',
   ARRAY['ink-1','ink-2','ink-3','ink-4'],
   ARRAY['Fine-line','Blackwork','Custom'],
   300, 4.9, 121, true),

  ('fine-line-atelier',
   'Fine Line Atelier', 'tattoo', 'Delicate, minimal, intentional',
   'A two-artist atelier specialising in the smallest, most delicate work. Calm, unhurried sessions.',
   'București', 'Str. Pictor Verona 2', 44.4425, 26.0991,
   'fla-hero', 'fineline',
   ARRAY['fla-1','fla-2','fla-3'],
   ARRAY['Micro tattoo','Minimal','Lettering'],
   350, 5.0, 64, true),

  ('calm-rooms',
   'Calm Rooms', 'massage', 'Deep tissue & relaxation',
   'Quiet treatment rooms away from the street noise. Therapists trained in deep tissue and relaxation.',
   'București', 'Calea Victoriei 101', 44.4389, 26.0962,
   'calm-hero', 'calmrooms',
   ARRAY['calm-1','calm-2','calm-3'],
   ARRAY['Deep tissue','Relaxation','Sports'],
   200, 4.85, 204, true),

  ('serene-touch',
   'Serene Touch', 'massage', 'Aromatherapy & lymphatic',
   'Aromatherapy-led massage in a warm, plant-filled space.',
   'București', E'Str. Polonă 68', 44.4515, 26.1066,
   'serene-hero', 'serene',
   ARRAY['serene-1','serene-2'],
   ARRAY['Aromatherapy','Lymphatic','Prenatal'],
   220, 4.75, 88, true),

  ('nail-atelier',
   'Nail Atelier', 'nails', 'Clean mani, quiet luxury',
   'Minimal nail studio. Hygiene-first, beautiful neutrals, and the occasional bit of art.',
   'București', 'Str. Eminescu 120', 44.4458, 26.1051,
   'nail-hero', 'nailatelier',
   ARRAY['nail-1','nail-2','nail-3'],
   ARRAY['Russian mani','Neutrals','Nail art'],
   90, 4.9, 156, true),

  ('maria-mua',
   E'Maria · MUA', 'makeup', 'Soft glam & bridal',
   E'Freelance makeup artist. Soft glam for events and weddings — I come to you.',
   'București', E'Mobile · comes to you', 44.4376, 26.1095,
   'mua-hero', 'mariamua',
   ARRAY['mua-1','mua-2','mua-3'],
   ARRAY['Soft glam','Bridal','Editorial'],
   180, 4.95, 112, true),

  ('brow-bar',
   'The Brow Bar', 'brows', 'Shape, tint, lift',
   'Brows and lashes only — we do one thing and do it well.',
   'București', E'Str. Batiștei 14', 44.4395, 26.1042,
   'brow-hero', 'browbar',
   ARRAY['brow-1','brow-2'],
   ARRAY['Brow lamination','Lash lift','Tint'],
   70, 4.8, 134, true),

  ('glow-skin',
   'Glow Skin Studio', 'skin', 'Facials & skin health',
   'Results-focused facials with a calm, spa-like feel. No gimmicks, just good skin habits.',
   'București', 'Str. Jean-Louis Calderon 40', 44.4361, 26.1078,
   'glow-hero', 'glowskin',
   ARRAY['glow-1','glow-2','glow-3'],
   ARRAY['Hydrafacial','Acne care','Peels'],
   200, 4.9, 99, true)
on conflict (slug) do nothing;


-- 2. Services -------------------------------------------------------
-- Each service is inserted with a sub-select on slug so we don't need
-- to know the uuid PK ahead of time. ON CONFLICT (studio_id, name) uses
-- the unique constraint added in 003.

insert into public.services (studio_id, name, duration_min, price_lei, sort_order)
select s.id, v.name, v.duration_min, v.price_lei, v.sort_order
from public.studios s
join (values
  -- Andra Studio
  ('andra-studio', 'Cut & finish',           60,  180, 0),
  ('andra-studio', 'Balayage + gloss',      180,  520, 1),
  ('andra-studio', 'Root touch-up',          90,  260, 2),
  ('andra-studio', 'Treatment & blow-dry',   45,  140, 3),
  -- Salon Lumina
  ('salon-lumina', 'Cut & style',            50,  120, 0),
  ('salon-lumina', 'Blow-dry',               40,   90, 1),
  ('salon-lumina', 'Bridal trial',           90,  320, 2),
  -- Mihai Hair
  ('mihai-hair',   'Signature cut',          75,  220, 0),
  ('mihai-hair',   'Fringe trim',            20,   60, 1),
  -- Barbierie Veche
  ('barbierie-veche', 'Haircut',             40,   80, 0),
  ('barbierie-veche', 'Cut + beard',         60,  120, 1),
  ('barbierie-veche', 'Hot towel shave',     30,   70, 2),
  -- Ink and Co
  ('ink-and-co',   'Small fine-line (consult)', 60,  300, 0),
  ('ink-and-co',   'Half-day session',      240, 1200, 1),
  ('ink-and-co',   'Design consultation',    30,    0, 2),
  -- Fine Line Atelier
  ('fine-line-atelier', 'Micro tattoo',      60,  350, 0),
  ('fine-line-atelier', 'Lettering',         90,  450, 1),
  -- Calm Rooms
  ('calm-rooms',   'Relaxation (60 min)',    60,  200, 0),
  ('calm-rooms',   'Deep tissue (60 min)',   60,  240, 1),
  ('calm-rooms',   'Deep tissue (90 min)',   90,  340, 2),
  -- Serene Touch
  ('serene-touch', 'Aromatherapy (60 min)',  60,  220, 0),
  ('serene-touch', 'Lymphatic drainage',     75,  280, 1),
  -- Nail Atelier
  ('nail-atelier', 'Manicure + gel',         75,  130, 0),
  ('nail-atelier', 'Pedicure',               60,  120, 1),
  ('nail-atelier', 'Express mani',           40,   90, 2),
  -- Maria MUA
  ('maria-mua',    'Event makeup',           60,  180, 0),
  ('maria-mua',    'Bridal (trial + day)',  120,  650, 1),
  -- The Brow Bar
  ('brow-bar',     'Brow shape + tint',      40,   90, 0),
  ('brow-bar',     'Brow lamination',        60,  160, 1),
  ('brow-bar',     'Lash lift',              60,  170, 2),
  -- Glow Skin Studio
  ('glow-skin',    'Signature facial',       60,  200, 0),
  ('glow-skin',    'Hydrafacial',            75,  320, 1)
) as v(slug, name, duration_min, price_lei, sort_order)
  on s.slug = v.slug
on conflict (studio_id, name) do nothing;
