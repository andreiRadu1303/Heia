'use client';

import * as React from 'react';
import {
  Monitor,
  Smartphone,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Check,
  LayoutTemplate,
  Palette,
  Layers,
  Loader2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Studio } from '@/lib/app-mock-data';
import { StudioSite } from '@/components/studio-site/studio-site';
import {
  TEMPLATES,
  configFromTemplate,
  defaultConfig,
  PALETTE_OPTIONS,
  STYLE_OPTIONS,
  RADII,
  DENSITIES,
  SECTION_META,
  type SiteConfig,
  type ThemeConfig,
  type RadiusId,
  type DensityId,
  type TemplateId,
} from '@/lib/site-config';
import { saveSiteConfigAction } from './actions';

type Panel = 'template' | 'theme' | 'sections';
type Device = 'desktop' | 'phone';
type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export function SiteBuilder({
  studio,
  locale,
  initialConfig,
}: {
  studio: Studio;
  locale: string;
  initialConfig: SiteConfig | null;
}) {
  const [config, setConfig] = React.useState<SiteConfig>(() => initialConfig ?? defaultConfig());
  const [panel, setPanel] = React.useState<Panel>('template');
  const [device, setDevice] = React.useState<Device>('phone');
  const [save, setSave] = React.useState<SaveState>('idle');
  const [isPending, startTransition] = React.useTransition();

  // Any edit marks the design dirty (unless we're mid-save).
  const edit = React.useCallback((updater: (c: SiteConfig) => SiteConfig) => {
    setConfig(updater);
    setSave('dirty');
  }, []);

  const persist = () => {
    setSave('saving');
    startTransition(async () => {
      const res = await saveSiteConfigAction(config);
      setSave(res.ok ? 'saved' : 'error');
    });
  };

  const patchTheme = (patch: Partial<ThemeConfig>) =>
    edit((c) => ({ ...c, theme: { ...c.theme, ...patch } }));

  const applyTemplate = (id: TemplateId) => edit(() => configFromTemplate(id));

  const toggleSection = (key: string) =>
    edit((c) => ({
      ...c,
      sections: c.sections.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)),
    }));

  const setVariant = (key: string, variant: string) =>
    edit((c) => ({
      ...c,
      sections: c.sections.map((s) => (s.key === key ? { ...s, variant } : s)),
    }));

  const moveSection = (index: number, dir: -1 | 1) =>
    edit((c) => {
      const next = [...c.sections];
      const target = index + dir;
      if (target < 0 || target >= next.length) return c;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...c, sections: next };
    });

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Your mini-site</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Design the page clients see. Changes preview live.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5">
            <IconToggle active={device === 'phone'} onClick={() => setDevice('phone')} label="Phone">
              <Smartphone className="size-4" />
            </IconToggle>
            <IconToggle
              active={device === 'desktop'}
              onClick={() => setDevice('desktop')}
              label="Desktop"
            >
              <Monitor className="size-4" />
            </IconToggle>
          </div>
          <button
            type="button"
            onClick={() => edit(() => configFromTemplate(config.template))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
          <button
            type="button"
            onClick={persist}
            disabled={isPending || save === 'saved' || save === 'idle'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {save === 'saving' ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving…
              </>
            ) : save === 'saved' ? (
              <>
                <Check className="size-4" /> Saved
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </header>
      {save === 'error' ? (
        <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Couldn’t save. Make sure migration 006 (site_config) has been run, then try again.
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* ---------------- Controls ---------------- */}
        <div className="space-y-4">
          {/* Panel tabs */}
          <div className="grid grid-cols-3 rounded-xl border border-border bg-card p-1 text-sm">
            <PanelTab active={panel === 'template'} onClick={() => setPanel('template')}>
              <LayoutTemplate className="size-4" /> Template
            </PanelTab>
            <PanelTab active={panel === 'theme'} onClick={() => setPanel('theme')}>
              <Palette className="size-4" /> Theme
            </PanelTab>
            <PanelTab active={panel === 'sections'} onClick={() => setPanel('sections')}>
              <Layers className="size-4" /> Sections
            </PanelTab>
          </div>

          {panel === 'template' ? (
            <div className="space-y-2.5">
              {TEMPLATES.map((t) => {
                const active = config.template === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => applyTemplate(t.id)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors',
                      active ? 'border-foreground bg-secondary/50' : 'border-border hover:bg-secondary/30',
                    )}
                  >
                    <SwatchDots swatches={paletteSwatches(t.theme.palette)} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {t.name}
                        {active ? <Check className="size-3.5 text-foreground" /> : null}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {t.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {panel === 'theme' ? (
            <div className="space-y-5">
              <Control label="Palette">
                <div className="grid grid-cols-2 gap-2">
                  {PALETTE_OPTIONS.map((p) => {
                    const active = config.theme.palette === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => patchTheme({ palette: p.id })}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-colors',
                          active ? 'border-foreground bg-secondary/50' : 'border-border hover:bg-secondary/30',
                        )}
                      >
                        <SwatchDots swatches={p.swatches} />
                        <span className="min-w-0 flex-1 truncate">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </Control>

              <Control label="Style">
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_OPTIONS.map((s) => {
                    const active = config.theme.style === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => patchTheme({ style: s.id })}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-left text-xs transition-colors',
                          active ? 'border-foreground bg-secondary/50' : 'border-border hover:bg-secondary/30',
                        )}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </Control>

              <Control label="Corners">
                <Segmented
                  options={(Object.keys(RADII) as RadiusId[]).map((k) => ({
                    id: k,
                    label: RADII[k].label,
                  }))}
                  value={config.theme.radius}
                  onChange={(v) => patchTheme({ radius: v as RadiusId })}
                />
              </Control>

              <Control label="Spacing">
                <Segmented
                  options={(Object.keys(DENSITIES) as DensityId[]).map((k) => ({
                    id: k,
                    label: DENSITIES[k].label,
                  }))}
                  value={config.theme.density}
                  onChange={(v) => patchTheme({ density: v as DensityId })}
                />
              </Control>
            </div>
          ) : null}

          {panel === 'sections' ? (
            <div className="space-y-2">
              {config.sections.map((s, i) => {
                const meta = SECTION_META[s.type];
                return (
                  <div
                    key={s.key}
                    className={cn(
                      'rounded-xl border border-border p-3',
                      !s.enabled && 'opacity-60',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => moveSection(i, -1)}
                          disabled={i === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ChevronUp className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(i, 1)}
                          disabled={i === config.sections.length - 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{meta.label}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {meta.description}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSection(s.key)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={s.enabled ? 'Hide section' : 'Show section'}
                      >
                        {s.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      </button>
                    </div>

                    {s.enabled && meta.variants.length > 1 ? (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 pl-6">
                        {meta.variants.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setVariant(s.key, v.id)}
                            className={cn(
                              'rounded-md border px-2 py-1 text-xs transition-colors',
                              s.variant === v.id
                                ? 'border-foreground bg-secondary/60'
                                : 'border-border hover:bg-secondary/30',
                            )}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}

          <p className="rounded-xl border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            {save === 'dirty'
              ? 'Unsaved changes — hit Save to store your design.'
              : 'Your design is saved to your studio. The public page renders from it once content editing is wired.'}
          </p>
        </div>

        {/* ---------------- Live preview ---------------- */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-secondary/30 p-3">
            <div
              className={cn(
                'mx-auto h-[68vh] overflow-y-auto overscroll-contain rounded-xl border border-border bg-background shadow-sm transition-[max-width]',
                device === 'phone' ? 'max-w-[390px]' : 'max-w-full',
              )}
            >
              {/* View-only: pointer-events off so preview links don't navigate. */}
              <div className="pointer-events-none select-none">
                <StudioSite studio={studio} config={config} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small UI helpers
// ---------------------------------------------------------------------------

function paletteSwatches(paletteId: string): [string, string, string, string] {
  const p = PALETTE_OPTIONS.find((x) => x.id === paletteId);
  return (p?.swatches ?? ['#eee', '#ddd', '#999', '#222']) as [string, string, string, string];
}

function SwatchDots({ swatches }: { swatches: [string, string, string, string] }) {
  return (
    <span className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
      {swatches.map((c, i) => (
        <span key={i} className="size-4" style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

function IconToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'grid size-8 place-items-center rounded-md transition-colors',
        active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function PanelTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors',
        active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-lg border border-border p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
            value === o.id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
