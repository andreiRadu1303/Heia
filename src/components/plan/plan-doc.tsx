'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  META,
  CONCEPT,
  BRAND,
  ROLES,
  SITEMAP,
  STACK,
  FEATURES,
  FEATURE_STATUSES,
  ROADMAP,
  type SiteNode,
  type FeatureStatus,
  type PhaseStatus,
} from '@/lib/plan-data';

const TABS = [
  { id: 'concept', label: 'Concept' },
  { id: 'brand', label: 'Brand' },
  { id: 'structure', label: 'Structure' },
  { id: 'features', label: 'Features' },
  { id: 'roadmap', label: 'Roadmap' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function PlanDoc() {
  const [tab, setTab] = React.useState<TabId>('concept');

  return (
    <div className="min-h-dvh">
      {/* Hero */}
      <header className="border-b border-border bg-card/40">
        <div className="container py-10">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="inline-block size-2 rounded-sm bg-accent" aria-hidden />
            {META.product} · {META.subtitle}
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            {META.oneLiner}
          </h1>
          <div className="mt-3 font-mono text-xs text-muted-foreground">
            Updated {META.updated} · living document
          </div>
        </div>
      </header>

      {/* Sticky tab nav */}
      <nav className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex gap-1 overflow-x-auto py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-secondary',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="container py-10">
        {tab === 'concept' && <ConceptSection />}
        {tab === 'brand' && <BrandSection />}
        {tab === 'structure' && <StructureSection />}
        {tab === 'features' && <FeaturesSection />}
        {tab === 'roadmap' && <RoadmapSection />}
      </main>

      <footer className="border-t border-border py-8">
        <div className="container font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {META.product} · internal · edit at src/lib/plan-data.ts
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 text-2xl font-medium tracking-tight">{children}</h2>;
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-3xl bg-card p-5 ring-1 ring-border', className)}>{children}</div>
  );
}

/* ---------------- Concept ---------------- */

function ConceptSection() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          {CONCEPT.headline}
        </h2>
        <div className="mt-5 max-w-2xl space-y-3 text-muted-foreground">
          {CONCEPT.paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Who it&rsquo;s for</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {CONCEPT.audience.map((a) => (
            <Card key={a.who}>
              <div className="text-lg font-medium">{a.who}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>What makes it different</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {CONCEPT.differentiators.map((d, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl bg-card p-4 ring-1 ring-border">
              <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span className="text-sm leading-relaxed">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Brand ---------------- */

function BrandSection() {
  return (
    <div className="space-y-10">
      <div>
        <SectionTitle>Voice</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {BRAND.voice.map((v, i) => (
            <div key={i} className="rounded-2xl bg-card p-4 text-sm leading-relaxed ring-1 ring-border">
              {v}
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>How it sounds</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {BRAND.hooks.map((h, i) => (
            <div
              key={i}
              className="rounded-full bg-accent/15 px-5 py-2.5 text-sm font-medium text-foreground"
            >
              “{h}”
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Palette</SectionTitle>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">{BRAND.style}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BRAND.palette.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-2xl ring-1 ring-border">
              <div className="h-20 w-full" style={{ background: c.hex }} aria-hidden />
              <div className="bg-card p-3">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="font-mono text-[11px] text-muted-foreground">{c.hex}</div>
                <div className="text-[11px] text-muted-foreground">{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Type</SectionTitle>
        <Card>
          <div className="font-display text-5xl tracking-tight">Aa</div>
          <div className="mt-3 text-lg font-medium">{BRAND.type.family}</div>
          <p className="mt-1 text-sm text-muted-foreground">{BRAND.type.note}</p>
          <p className="mt-4 font-display text-xl leading-snug tracking-tight">
            Find good people, when you need them.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Structure ---------------- */

function StructureSection() {
  return (
    <div className="space-y-10">
      <div>
        <SectionTitle>Two sides, one role per account</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {ROLES.map((r) => (
            <Card key={r.role}>
              <div className="flex items-baseline justify-between">
                <div className="text-lg font-medium">{r.role}</div>
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs">{r.home}</code>
              </div>
              <ol className="mt-4 space-y-2">
                {r.journey.map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/20 font-mono text-[11px]">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Sitemap</SectionTitle>
        <Card>
          <ul className="space-y-1">
            {SITEMAP.map((node) => (
              <SiteRow key={node.path} node={node} depth={0} />
            ))}
          </ul>
        </Card>
      </div>

      <div>
        <SectionTitle>Stack</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {STACK.map((s) => (
            <div key={s.name} className="flex items-baseline justify-between gap-4 rounded-2xl bg-card p-4 ring-1 ring-border">
              <span className="text-sm font-medium">{s.name}</span>
              <span className="text-right text-xs text-muted-foreground">{s.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TAG_STYLES: Record<NonNullable<SiteNode['tag']>, string> = {
  client: 'bg-accent/20 text-foreground',
  provider: 'bg-foreground text-background',
  shared: 'bg-secondary text-secondary-foreground',
  auth: 'bg-muted text-muted-foreground',
};

function SiteRow({ node, depth }: { node: SiteNode; depth: number }) {
  return (
    <>
      <li
        className="flex items-center gap-2 py-1"
        style={{ paddingLeft: `${depth * 1.25}rem` }}
      >
        {depth > 0 ? <span className="text-muted-foreground/50">└</span> : null}
        <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">{node.path}</code>
        <span className="text-sm text-muted-foreground">{node.label}</span>
        {node.tag ? (
          <span
            className={cn(
              'ml-auto shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide',
              TAG_STYLES[node.tag],
            )}
          >
            {node.tag}
          </span>
        ) : null}
      </li>
      {node.children?.map((child) => (
        <SiteRow key={child.path} node={child} depth={depth + 1} />
      ))}
    </>
  );
}

/* ---------------- Features ---------------- */

const STATUS_ACCENT: Record<FeatureStatus, string> = {
  live: 'bg-accent',
  building: 'bg-foreground',
  planned: 'bg-muted-foreground',
  idea: 'bg-border',
};

function FeaturesSection() {
  return (
    <div>
      <SectionTitle>Feature board</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_STATUSES.map((col) => {
          const items = FEATURES.filter((f) => f.status === col.id);
          return (
            <div key={col.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={cn('inline-block size-2 rounded-full', STATUS_ACCENT[col.id])} aria-hidden />
                <span className="text-sm font-medium">{col.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((f) => (
                  <div key={f.title} className="rounded-2xl bg-card p-3 ring-1 ring-border">
                    <div className="text-sm leading-snug">{f.title}</div>
                    <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                      {f.area}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Roadmap ---------------- */

const PHASE_STYLES: Record<PhaseStatus, { dot: string; badge: string; label: string }> = {
  done: { dot: 'bg-accent', badge: 'bg-accent/20 text-foreground', label: 'Done' },
  active: { dot: 'bg-foreground', badge: 'bg-foreground text-background', label: 'Now' },
  upcoming: { dot: 'bg-border', badge: 'bg-secondary text-muted-foreground', label: 'Upcoming' },
};

function RoadmapSection() {
  return (
    <div>
      <SectionTitle>Roadmap</SectionTitle>
      <div className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
        {ROADMAP.map((phase) => {
          const s = PHASE_STYLES[phase.status];
          return (
            <div key={phase.name} className="relative pl-8">
              <span
                className={cn('absolute left-0 top-1.5 size-4 rounded-full ring-4 ring-background', s.dot)}
                aria-hidden
              />
              <div className="rounded-3xl bg-card p-5 ring-1 ring-border">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium tracking-tight">{phase.name}</h3>
                  <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium', s.badge)}>
                    {s.label}
                  </span>
                </div>
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 inline-block size-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
