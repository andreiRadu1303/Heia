'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  DEFAULT_PLAN,
  FEATURE_STATUSES,
  type PlanData,
  type SiteNode,
  type FeatureStatus,
  type PhaseStatus,
} from '@/lib/plan-data';

const STORAGE_KEY = 'heia-plan-v1';

const TABS = [
  { id: 'concept', label: 'Concept' },
  { id: 'brand', label: 'Brand' },
  { id: 'structure', label: 'Structure' },
  { id: 'screens', label: 'Screens' },
  { id: 'features', label: 'Features' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'kpis', label: 'KPIs' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/* ---------------- persistence helpers ---------------- */

function isObj(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/** Deep-merge stored JSON over the defaults: objects merge, arrays replace wholesale. */
function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  if (isObj(base)) {
    const out: Record<string, unknown> = { ...base };
    if (isObj(override)) {
      for (const k of Object.keys(override)) {
        out[k] =
          k in base
            ? deepMerge((base as Record<string, unknown>)[k], override[k])
            : override[k];
      }
    }
    return out as T;
  }
  return (override === undefined ? base : override) as T;
}

const DEFAULT_JSON = JSON.stringify(DEFAULT_PLAN);

/* ---------------- edit context ---------------- */

interface PlanCtx {
  plan: PlanData;
  editing: boolean;
  mutate: (fn: (draft: PlanData) => void) => void;
}

const Ctx = React.createContext<PlanCtx | null>(null);
function usePlan() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('usePlan outside provider');
  return ctx;
}

/* ---------------- root ---------------- */

export function PlanDoc() {
  const [tab, setTab] = React.useState<TabId>('concept');
  const [plan, setPlan] = React.useState<PlanData>(DEFAULT_PLAN);
  const [editing, setEditing] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const locale = useLocale();
  const fileRef = React.useRef<HTMLInputElement>(null);

  // Hydrate from localStorage after mount (keeps SSR markup === first client paint).
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlan(deepMerge(DEFAULT_PLAN, JSON.parse(raw)));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Auto-save to this browser whenever the plan changes (after hydration).
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      const json = JSON.stringify(plan);
      if (json === DEFAULT_JSON) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, json);
    } catch {
      /* storage may be unavailable */
    }
  }, [plan, hydrated]);

  const mutate = React.useCallback((fn: (draft: PlanData) => void) => {
    setPlan((prev) => {
      const draft: PlanData = structuredClone(prev);
      fn(draft);
      return draft;
    });
  }, []);

  const hasLocalEdits = hydrated && JSON.stringify(plan) !== DEFAULT_JSON;

  function exportJson() {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heia-plan-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    file
      .text()
      .then((txt) => {
        const parsed = JSON.parse(txt);
        setPlan(deepMerge(DEFAULT_PLAN, parsed));
      })
      .catch(() => alert('That file isn’t valid plan JSON.'));
  }

  function reset() {
    if (confirm('Reset the plan to the built-in defaults? This clears the edits saved in this browser.')) {
      setPlan(DEFAULT_PLAN);
      setEditing(false);
    }
  }

  const ctx: PlanCtx = { plan, editing, mutate };

  return (
    <Ctx.Provider value={ctx}>
      <div className="min-h-dvh">
        {/* Hero */}
        <header className="border-b border-border bg-card/40">
          <div className="container py-10">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="inline-block size-2 rounded-sm bg-accent" aria-hidden />
              {plan.meta.product} · {plan.meta.subtitle}
              {hasLocalEdits ? (
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] tracking-wide text-foreground">
                  local edits
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              {editing ? (
                <Txt
                  value={plan.meta.oneLiner}
                  set={(v) => mutate((d) => void (d.meta.oneLiner = v))}
                  editing
                  multiline
                  className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
                />
              ) : (
                plan.meta.oneLiner
              )}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
              <span>Updated</span>
              {editing ? (
                <Txt
                  value={plan.meta.updated}
                  set={(v) => mutate((d) => void (d.meta.updated = v))}
                  editing
                  className="w-32 font-mono text-xs"
                />
              ) : (
                <span>{plan.meta.updated}</span>
              )}
              <span>· living document</span>
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <ToolButton variant="primary" onClick={() => setEditing((v) => !v)}>
                {editing ? 'Done editing' : 'Edit'}
              </ToolButton>
              <ToolButton onClick={exportJson}>Export JSON</ToolButton>
              <ToolButton onClick={() => fileRef.current?.click()}>Import JSON</ToolButton>
              {hasLocalEdits ? (
                <ToolButton onClick={reset}>Reset to defaults</ToolButton>
              ) : null}
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                onChange={onImportFile}
                className="hidden"
              />
              {editing ? (
                <span className="ml-1 text-xs text-muted-foreground">
                  Saved to this browser as you type.
                </span>
              ) : null}
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
          {tab === 'screens' && <ScreensSection locale={locale} />}
          {tab === 'features' && <FeaturesSection />}
          {tab === 'roadmap' && <RoadmapSection />}
          {tab === 'decisions' && <DecisionsSection />}
          {tab === 'kpis' && <KpisSection />}
        </main>

        <footer className="border-t border-border py-8">
          <div className="container font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {plan.meta.product} · internal · edit in the browser · Export JSON to back up · defaults in
            src/lib/plan-data.ts
          </div>
        </footer>
      </div>
    </Ctx.Provider>
  );
}

/* ---------------- shared primitives ---------------- */

function ToolButton({
  children,
  onClick,
  variant = 'ghost',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
        variant === 'primary'
          ? 'bg-foreground text-background hover:opacity-90'
          : 'border border-border text-muted-foreground hover:bg-secondary hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

/** Inline editable text. In read mode it renders the plain value. */
function Txt({
  value,
  set,
  editing,
  multiline,
  className,
  placeholder,
}: {
  value: string;
  set: (v: string) => void;
  editing: boolean;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}) {
  if (!editing) return <>{value}</>;
  if (multiline) {
    const rows = Math.max(2, value.split('\n').length, Math.ceil(value.length / 60));
    return (
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => set(e.target.value)}
        rows={rows}
        className={cn(
          'w-full resize-y rounded-lg border border-border bg-background px-2 py-1 text-sm leading-relaxed text-foreground outline-none focus:border-accent',
          className,
        )}
      />
    );
  }
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => set(e.target.value)}
      className={cn(
        'w-full rounded-lg border border-border bg-background px-2 py-1 text-foreground outline-none focus:border-accent',
        className,
      )}
    />
  );
}

function EditSelect({
  value,
  set,
  options,
  className,
}: {
  value: string;
  set: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => set(e.target.value)}
      className={cn(
        'rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-accent',
        className,
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function AddButton({ onClick, label = 'Add' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
    >
      + {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove"
      className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
    >
      ✕
    </button>
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
  const { plan, editing, mutate } = usePlan();
  const c = plan.concept;
  return (
    <div className="space-y-10">
      <div>
        <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          <Txt
            value={c.headline}
            set={(v) => mutate((d) => void (d.concept.headline = v))}
            editing={editing}
            multiline
          />
        </h2>
        <div className="mt-5 max-w-2xl space-y-3 text-muted-foreground">
          {c.paragraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <p className="flex-1 leading-relaxed">
                <Txt
                  value={p}
                  set={(v) => mutate((d) => void (d.concept.paragraphs[i] = v))}
                  editing={editing}
                  multiline
                />
              </p>
              {editing ? (
                <RemoveButton onClick={() => mutate((d) => void d.concept.paragraphs.splice(i, 1))} />
              ) : null}
            </div>
          ))}
          {editing ? (
            <AddButton
              label="Paragraph"
              onClick={() => mutate((d) => void d.concept.paragraphs.push(''))}
            />
          ) : null}
        </div>
      </div>

      <div>
        <SectionTitle>Who it&rsquo;s for</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {c.audience.map((a, i) => (
            <Card key={i}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 text-lg font-medium">
                  <Txt
                    value={a.who}
                    set={(v) => mutate((d) => void (d.concept.audience[i].who = v))}
                    editing={editing}
                  />
                </div>
                {editing ? (
                  <RemoveButton onClick={() => mutate((d) => void d.concept.audience.splice(i, 1))} />
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <Txt
                  value={a.desc}
                  set={(v) => mutate((d) => void (d.concept.audience[i].desc = v))}
                  editing={editing}
                  multiline
                />
              </p>
            </Card>
          ))}
        </div>
        {editing ? (
          <div className="mt-3">
            <AddButton
              label="Audience"
              onClick={() => mutate((d) => void d.concept.audience.push({ who: '', desc: '' }))}
            />
          </div>
        ) : null}
      </div>

      <div>
        <SectionTitle>What makes it different</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {c.differentiators.map((diff, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl bg-card p-4 ring-1 ring-border"
            >
              <span
                className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-accent"
                aria-hidden
              />
              <span className="flex-1 text-sm leading-relaxed">
                <Txt
                  value={diff}
                  set={(v) => mutate((d) => void (d.concept.differentiators[i] = v))}
                  editing={editing}
                  multiline
                />
              </span>
              {editing ? (
                <RemoveButton
                  onClick={() => mutate((d) => void d.concept.differentiators.splice(i, 1))}
                />
              ) : null}
            </div>
          ))}
        </div>
        {editing ? (
          <div className="mt-3">
            <AddButton
              label="Differentiator"
              onClick={() => mutate((d) => void d.concept.differentiators.push(''))}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- Brand ---------------- */

function BrandSection() {
  const { plan, editing, mutate } = usePlan();
  const b = plan.brand;
  return (
    <div className="space-y-10">
      <div>
        <SectionTitle>Voice</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {b.voice.map((v, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-2xl bg-card p-4 text-sm leading-relaxed ring-1 ring-border"
            >
              <span className="flex-1">
                <Txt
                  value={v}
                  set={(val) => mutate((d) => void (d.brand.voice[i] = val))}
                  editing={editing}
                  multiline
                />
              </span>
              {editing ? (
                <RemoveButton onClick={() => mutate((d) => void d.brand.voice.splice(i, 1))} />
              ) : null}
            </div>
          ))}
        </div>
        {editing ? (
          <div className="mt-3">
            <AddButton label="Voice note" onClick={() => mutate((d) => void d.brand.voice.push(''))} />
          </div>
        ) : null}
      </div>

      <div>
        <SectionTitle>How it sounds</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {b.hooks.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-full bg-accent/15 px-5 py-2.5 text-sm font-medium text-foreground"
            >
              {editing ? (
                <Txt
                  value={h}
                  set={(v) => mutate((d) => void (d.brand.hooks[i] = v))}
                  editing
                  className="min-w-[12rem]"
                />
              ) : (
                <>“{h}”</>
              )}
              {editing ? (
                <RemoveButton onClick={() => mutate((d) => void d.brand.hooks.splice(i, 1))} />
              ) : null}
            </div>
          ))}
          {editing ? (
            <AddButton label="Hook" onClick={() => mutate((d) => void d.brand.hooks.push(''))} />
          ) : null}
        </div>
      </div>

      <div>
        <SectionTitle>Palette</SectionTitle>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
          <Txt
            value={b.style}
            set={(v) => mutate((d) => void (d.brand.style = v))}
            editing={editing}
            multiline
          />
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {b.palette.map((color, i) => (
            <div key={i} className="overflow-hidden rounded-2xl ring-1 ring-border">
              {editing ? (
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => mutate((d) => void (d.brand.palette[i].hex = e.target.value))}
                  className="block h-20 w-full cursor-pointer border-0 bg-transparent p-0"
                  aria-label={`${color.name} colour`}
                />
              ) : (
                <div className="h-20 w-full" style={{ background: color.hex }} aria-hidden />
              )}
              <div className="space-y-1 bg-card p-3">
                {editing ? (
                  <>
                    <Txt
                      value={color.name}
                      set={(v) => mutate((d) => void (d.brand.palette[i].name = v))}
                      editing
                      className="text-sm font-medium"
                      placeholder="Name"
                    />
                    <Txt
                      value={color.hex}
                      set={(v) => mutate((d) => void (d.brand.palette[i].hex = v))}
                      editing
                      className="font-mono text-[11px]"
                      placeholder="#hex"
                    />
                    <Txt
                      value={color.role}
                      set={(v) => mutate((d) => void (d.brand.palette[i].role = v))}
                      editing
                      className="text-[11px]"
                      placeholder="Role"
                    />
                    <div className="pt-1">
                      <RemoveButton
                        onClick={() => mutate((d) => void d.brand.palette.splice(i, 1))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-medium">{color.name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{color.hex}</div>
                    <div className="text-[11px] text-muted-foreground">{color.role}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {editing ? (
          <div className="mt-3">
            <AddButton
              label="Colour"
              onClick={() =>
                mutate((d) => void d.brand.palette.push({ name: 'New', hex: '#888888', role: '' }))
              }
            />
          </div>
        ) : null}
      </div>

      <div>
        <SectionTitle>Type</SectionTitle>
        <Card>
          <div className="font-display text-5xl tracking-tight">Aa</div>
          <div className="mt-3 text-lg font-medium">
            <Txt
              value={b.type.family}
              set={(v) => mutate((d) => void (d.brand.type.family = v))}
              editing={editing}
            />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <Txt
              value={b.type.note}
              set={(v) => mutate((d) => void (d.brand.type.note = v))}
              editing={editing}
              multiline
            />
          </p>
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
  const { plan, editing, mutate } = usePlan();
  return (
    <div className="space-y-10">
      <div>
        <SectionTitle>Two sides, one role per account</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {plan.roles.map((r, ri) => (
            <Card key={ri}>
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex-1 text-lg font-medium">
                  <Txt
                    value={r.role}
                    set={(v) => mutate((d) => void (d.roles[ri].role = v))}
                    editing={editing}
                  />
                </div>
                {editing ? (
                  <Txt
                    value={r.home}
                    set={(v) => mutate((d) => void (d.roles[ri].home = v))}
                    editing
                    className="w-28 font-mono text-xs"
                  />
                ) : (
                  <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs">{r.home}</code>
                )}
                {editing ? (
                  <RemoveButton onClick={() => mutate((d) => void d.roles.splice(ri, 1))} />
                ) : null}
              </div>
              <ol className="mt-4 space-y-2">
                {r.journey.map((step, si) => (
                  <li key={si} className="flex items-center gap-3 text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/20 font-mono text-[11px]">
                      {si + 1}
                    </span>
                    <span className="flex-1">
                      <Txt
                        value={step}
                        set={(v) => mutate((d) => void (d.roles[ri].journey[si] = v))}
                        editing={editing}
                      />
                    </span>
                    {editing ? (
                      <RemoveButton
                        onClick={() => mutate((d) => void d.roles[ri].journey.splice(si, 1))}
                      />
                    ) : null}
                  </li>
                ))}
              </ol>
              {editing ? (
                <div className="mt-3">
                  <AddButton
                    label="Step"
                    onClick={() => mutate((d) => void d.roles[ri].journey.push(''))}
                  />
                </div>
              ) : null}
            </Card>
          ))}
        </div>
        {editing ? (
          <div className="mt-3">
            <AddButton
              label="Role"
              onClick={() => mutate((d) => void d.roles.push({ role: 'New role', home: '/', journey: [] }))}
            />
          </div>
        ) : null}
      </div>

      <div>
        <SectionTitle>Sitemap</SectionTitle>
        <Card>
          <ul className="space-y-1">
            {plan.sitemap.map((node, i) => (
              <SiteRow key={i} node={node} path={[i]} depth={0} />
            ))}
          </ul>
          {editing ? (
            <div className="mt-3">
              <AddButton
                label="Top-level page"
                onClick={() =>
                  mutate((d) => void d.sitemap.push({ path: '/', label: 'New page', tag: 'shared' }))
                }
              />
            </div>
          ) : null}
        </Card>
      </div>

      <div>
        <SectionTitle>Stack</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {plan.stack.map((s, i) => (
            <div
              key={i}
              className="flex items-baseline justify-between gap-4 rounded-2xl bg-card p-4 ring-1 ring-border"
            >
              {editing ? (
                <>
                  <Txt
                    value={s.name}
                    set={(v) => mutate((d) => void (d.stack[i].name = v))}
                    editing
                    className="text-sm font-medium"
                  />
                  <Txt
                    value={s.role}
                    set={(v) => mutate((d) => void (d.stack[i].role = v))}
                    editing
                    className="text-xs"
                  />
                  <RemoveButton onClick={() => mutate((d) => void d.stack.splice(i, 1))} />
                </>
              ) : (
                <>
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className="text-right text-xs text-muted-foreground">{s.role}</span>
                </>
              )}
            </div>
          ))}
        </div>
        {editing ? (
          <div className="mt-3">
            <AddButton
              label="Stack item"
              onClick={() => mutate((d) => void d.stack.push({ name: '', role: '' }))}
            />
          </div>
        ) : null}
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

const TAG_OPTIONS = [
  { value: 'shared', label: 'shared' },
  { value: 'client', label: 'client' },
  { value: 'provider', label: 'provider' },
  { value: 'auth', label: 'auth' },
];

function siteNodeAt(d: PlanData, path: number[]): SiteNode {
  let node = d.sitemap[path[0]];
  for (let i = 1; i < path.length; i++) node = node.children![path[i]];
  return node;
}

function SiteRow({ node, path, depth }: { node: SiteNode; path: number[]; depth: number }) {
  const { editing, mutate } = usePlan();
  return (
    <>
      <li className="flex items-center gap-2 py-1" style={{ paddingLeft: `${depth * 1.25}rem` }}>
        {depth > 0 ? <span className="text-muted-foreground/50">└</span> : null}
        {editing ? (
          <>
            <Txt
              value={node.path}
              set={(v) => mutate((d) => void (siteNodeAt(d, path).path = v))}
              editing
              className="w-40 font-mono text-xs"
            />
            <Txt
              value={node.label}
              set={(v) => mutate((d) => void (siteNodeAt(d, path).label = v))}
              editing
              className="flex-1 text-sm"
            />
            <EditSelect
              value={node.tag ?? 'shared'}
              set={(v) =>
                mutate((d) => void (siteNodeAt(d, path).tag = v as NonNullable<SiteNode['tag']>))
              }
              options={TAG_OPTIONS}
            />
            <button
              type="button"
              onClick={() =>
                mutate((d) => {
                  const n = siteNodeAt(d, path);
                  (n.children ??= []).push({ path: '/', label: 'New', tag: n.tag ?? 'shared' });
                })
              }
              className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Add child page"
              title="Add child page"
            >
              ↳
            </button>
            <RemoveButton
              onClick={() =>
                mutate((d) => {
                  if (path.length === 1) d.sitemap.splice(path[0], 1);
                  else siteNodeAt(d, path.slice(0, -1)).children!.splice(path[path.length - 1], 1);
                })
              }
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </li>
      {node.children?.map((child, ci) => (
        <SiteRow key={ci} node={child} path={[...path, ci]} depth={depth + 1} />
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

const STATUS_OPTIONS = FEATURE_STATUSES.map((s) => ({ value: s.id, label: s.label }));

function FeaturesSection() {
  const { plan, editing, mutate } = usePlan();
  return (
    <div>
      <SectionTitle>Feature board</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_STATUSES.map((col) => {
          const items = plan.features
            .map((f, idx) => ({ f, idx }))
            .filter(({ f }) => f.status === col.id);
          return (
            <div key={col.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn('inline-block size-2 rounded-full', STATUS_ACCENT[col.id])}
                  aria-hidden
                />
                <span className="text-sm font-medium">{col.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map(({ f, idx }) => (
                  <div key={idx} className="rounded-2xl bg-card p-3 ring-1 ring-border">
                    {editing ? (
                      <div className="space-y-2">
                        <Txt
                          value={f.title}
                          set={(v) => mutate((d) => void (d.features[idx].title = v))}
                          editing
                          multiline
                          className="text-sm"
                          placeholder="Title"
                        />
                        <div className="flex items-center gap-2">
                          <Txt
                            value={f.area}
                            set={(v) => mutate((d) => void (d.features[idx].area = v))}
                            editing
                            className="text-[11px]"
                            placeholder="Area"
                          />
                          <EditSelect
                            value={f.status}
                            set={(v) =>
                              mutate((d) => void (d.features[idx].status = v as FeatureStatus))
                            }
                            options={STATUS_OPTIONS}
                          />
                          <RemoveButton
                            onClick={() => mutate((d) => void d.features.splice(idx, 1))}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm leading-snug">{f.title}</div>
                        <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                          {f.area}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {editing ? (
                <AddButton
                  label="Feature"
                  onClick={() =>
                    mutate((d) => void d.features.push({ title: '', area: '', status: col.id }))
                  }
                />
              ) : null}
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

const PHASE_OPTIONS = [
  { value: 'done', label: 'Done' },
  { value: 'active', label: 'Now' },
  { value: 'upcoming', label: 'Upcoming' },
];

function RoadmapSection() {
  const { plan, editing, mutate } = usePlan();
  return (
    <div>
      <SectionTitle>Roadmap</SectionTitle>
      <div className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
        {plan.roadmap.map((phase, pi) => {
          const s = PHASE_STYLES[phase.status];
          return (
            <div key={pi} className="relative pl-8">
              <span
                className={cn(
                  'absolute left-0 top-1.5 size-4 rounded-full ring-4 ring-background',
                  s.dot,
                )}
                aria-hidden
              />
              <div className="rounded-3xl bg-card p-5 ring-1 ring-border">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="flex-1 font-medium tracking-tight">
                    <Txt
                      value={phase.name}
                      set={(v) => mutate((d) => void (d.roadmap[pi].name = v))}
                      editing={editing}
                    />
                  </h3>
                  {editing ? (
                    <>
                      <EditSelect
                        value={phase.status}
                        set={(v) => mutate((d) => void (d.roadmap[pi].status = v as PhaseStatus))}
                        options={PHASE_OPTIONS}
                      />
                      <RemoveButton onClick={() => mutate((d) => void d.roadmap.splice(pi, 1))} />
                    </>
                  ) : (
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                        s.badge,
                      )}
                    >
                      {s.label}
                    </span>
                  )}
                </div>
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {phase.items.map((item, ii) => (
                    <li
                      key={ii}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span
                        className="mt-1.5 inline-block size-1 shrink-0 rounded-full bg-muted-foreground"
                        aria-hidden
                      />
                      <span className="flex-1">
                        <Txt
                          value={item}
                          set={(v) => mutate((d) => void (d.roadmap[pi].items[ii] = v))}
                          editing={editing}
                          multiline
                        />
                      </span>
                      {editing ? (
                        <RemoveButton
                          onClick={() => mutate((d) => void d.roadmap[pi].items.splice(ii, 1))}
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
                {editing ? (
                  <div className="mt-3">
                    <AddButton
                      label="Item"
                      onClick={() => mutate((d) => void d.roadmap[pi].items.push(''))}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {editing ? (
        <div className="mt-4 pl-8">
          <AddButton
            label="Phase"
            onClick={() =>
              mutate((d) => void d.roadmap.push({ name: 'New phase', status: 'upcoming', items: [] }))
            }
          />
        </div>
      ) : null}
    </div>
  );
}

/* ---------------- Screens ---------------- */

function ScreensSection({ locale }: { locale: string }) {
  const { plan, editing, mutate } = usePlan();
  const href = (path: string) => `/${locale}${path === '/' ? '' : path}`;
  return (
    <div>
      <SectionTitle>Screens</SectionTitle>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Live previews of the public screens at phone size. Auth-gated screens link out (they need a
        session to render).
      </p>
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {plan.screens.map((s, i) => (
          <div key={i} className="flex flex-col gap-2">
            {editing ? (
              <div className="space-y-2 rounded-2xl bg-card p-4 ring-1 ring-border">
                <Txt
                  value={s.label}
                  set={(v) => mutate((d) => void (d.screens[i].label = v))}
                  editing
                  className="text-sm font-medium"
                  placeholder="Label"
                />
                <Txt
                  value={s.path}
                  set={(v) => mutate((d) => void (d.screens[i].path = v))}
                  editing
                  className="font-mono text-xs"
                  placeholder="/path"
                />
                <Txt
                  value={s.note}
                  set={(v) => mutate((d) => void (d.screens[i].note = v))}
                  editing
                  className="text-xs"
                  placeholder="Note"
                />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={s.embeddable}
                    onChange={(e) =>
                      mutate((d) => void (d.screens[i].embeddable = e.target.checked))
                    }
                  />
                  Embeddable (public — show live iframe)
                </label>
                <RemoveButton onClick={() => mutate((d) => void d.screens.splice(i, 1))} />
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between">
                  <div className="text-sm font-medium">{s.label}</div>
                  <a
                    href={href(s.path)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                  >
                    open →
                  </a>
                </div>
                <div className="text-xs text-muted-foreground">{s.note}</div>
                {s.embeddable ? (
                  <div className="mt-1 overflow-hidden rounded-[28px] border-[8px] border-foreground/85 bg-foreground/85 shadow-xl">
                    <div className="overflow-hidden rounded-[20px] bg-background">
                      <iframe
                        src={href(s.path)}
                        title={s.label}
                        loading="lazy"
                        width={360}
                        height={620}
                        style={{ width: '100%', height: 620, border: 0, display: 'block' }}
                      />
                    </div>
                  </div>
                ) : (
                  <a
                    href={href(s.path)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 grid h-40 place-items-center rounded-3xl border border-dashed border-border bg-card text-center text-sm text-muted-foreground"
                  >
                    Requires login — open in a new tab
                  </a>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {editing ? (
        <div className="mt-4">
          <AddButton
            label="Screen"
            onClick={() =>
              mutate(
                (d) =>
                  void d.screens.push({ label: 'New screen', path: '/', note: '', embeddable: false }),
              )
            }
          />
        </div>
      ) : null}
    </div>
  );
}

/* ---------------- Decisions ---------------- */

function DecisionsSection() {
  const { plan, editing, mutate } = usePlan();
  return (
    <div>
      <SectionTitle>Decisions log</SectionTitle>
      <div className="space-y-3">
        {plan.decisions.map((dec, i) => (
          <div key={i} className="rounded-3xl bg-card p-5 ring-1 ring-border">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="flex-1 font-medium tracking-tight">
                <Txt
                  value={dec.title}
                  set={(v) => mutate((d) => void (d.decisions[i].title = v))}
                  editing={editing}
                />
              </h3>
              {editing ? (
                <>
                  <Txt
                    value={dec.date}
                    set={(v) => mutate((d) => void (d.decisions[i].date = v))}
                    editing
                    className="w-24 font-mono text-[11px]"
                  />
                  <RemoveButton onClick={() => mutate((d) => void d.decisions.splice(i, 1))} />
                </>
              ) : (
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {dec.date}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm">
              <Txt
                value={dec.decision}
                set={(v) => mutate((d) => void (d.decisions[i].decision = v))}
                editing={editing}
                multiline
              />
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              <span className="font-medium text-foreground/70">Why: </span>
              <Txt
                value={dec.why}
                set={(v) => mutate((d) => void (d.decisions[i].why = v))}
                editing={editing}
                multiline
              />
            </p>
          </div>
        ))}
      </div>
      {editing ? (
        <div className="mt-4">
          <AddButton
            label="Decision"
            onClick={() =>
              mutate(
                (d) =>
                  void d.decisions.push({
                    date: new Date().toISOString().slice(0, 7),
                    title: 'New decision',
                    decision: '',
                    why: '',
                  }),
              )
            }
          />
        </div>
      ) : null}
    </div>
  );
}

/* ---------------- KPIs ---------------- */

function KpisSection() {
  const { plan, editing, mutate } = usePlan();

  if (editing) {
    return (
      <div>
        <SectionTitle>KPIs / metrics</SectionTitle>
        <div className="space-y-2">
          {plan.kpis.map((k, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-2 rounded-2xl bg-card p-3 ring-1 ring-border"
            >
              <Txt
                value={k.area}
                set={(v) => mutate((d) => void (d.kpis[i].area = v))}
                editing
                className="w-32 text-xs font-medium uppercase"
                placeholder="Area"
              />
              <Txt
                value={k.metric}
                set={(v) => mutate((d) => void (d.kpis[i].metric = v))}
                editing
                className="flex-1 text-sm"
                placeholder="Metric"
              />
              <Txt
                value={k.target}
                set={(v) => mutate((d) => void (d.kpis[i].target = v))}
                editing
                className="w-40 text-sm"
                placeholder="Target"
              />
              <RemoveButton onClick={() => mutate((d) => void d.kpis.splice(i, 1))} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <AddButton
            label="KPI"
            onClick={() =>
              mutate((d) => void d.kpis.push({ area: 'General', metric: '', target: '' }))
            }
          />
        </div>
      </div>
    );
  }

  const areas = Array.from(new Set(plan.kpis.map((k) => k.area)));
  return (
    <div className="space-y-8">
      <div>
        <SectionTitle>KPIs / metrics</SectionTitle>
        <p className="max-w-2xl text-sm text-muted-foreground">
          What we&rsquo;ll watch, by stage. Targets are directional — many firm up once there&rsquo;s
          real traffic.
        </p>
      </div>
      {areas.map((area) => (
        <div key={area}>
          <div className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {area}
          </div>
          <div className="overflow-hidden rounded-3xl ring-1 ring-border">
            {plan.kpis
              .filter((k) => k.area === area)
              .map((k, i) => (
                <div
                  key={k.metric + i}
                  className={cn(
                    'flex items-baseline justify-between gap-4 bg-card px-5 py-3',
                    i > 0 && 'border-t border-border',
                  )}
                >
                  <span className="text-sm">{k.metric}</span>
                  <span className="shrink-0 text-right text-sm font-medium text-muted-foreground">
                    {k.target}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
