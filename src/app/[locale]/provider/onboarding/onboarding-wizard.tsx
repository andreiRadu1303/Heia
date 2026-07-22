'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, Check, Globe, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/app-mock-data';
import type { StudioRow } from '@/lib/provider-studio';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { completeOnboardingAction, skipOnboardingAction } from './actions';

const STEPS = ['Service', 'Location', 'Profile'] as const;

export function OnboardingWizard({ studio, locale }: { studio: StudioRow; locale: string }) {
  const [step, setStep] = React.useState(0);
  const [categoryId, setCategoryId] = React.useState(studio.category_id || 'hair');
  const [knownFor, setKnownFor] = React.useState(studio.known_for.join(', '));
  const [city, setCity] = React.useState(studio.city ?? '');
  const [address, setAddress] = React.useState(studio.address ?? '');
  // The auto-created name is "<name> · Studio"; offer it but let them change it.
  const [name, setName] = React.useState(studio.name ?? '');
  const [tagline, setTagline] = React.useState(studio.tagline === 'Edit your profile to get discovered' ? '' : studio.tagline ?? '');
  const [bio, setBio] = React.useState(studio.bio ?? '');
  const [publish, setPublish] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const canNext = step === 0 ? !!categoryId : step === 1 ? city.trim().length > 0 : name.trim().length > 0;

  const finish = () => {
    setError(null);
    startTransition(async () => {
      const res = await completeOnboardingAction(locale, {
        categoryId,
        knownFor: knownFor.split(',').map((s) => s.trim()).filter(Boolean),
        city,
        address,
        name,
        tagline,
        bio,
        publish,
      });
      if (res?.error) setError(res.error);
    });
  };

  const skip = () => {
    setError(null);
    startTransition(async () => {
      const res = await skipOnboardingAction(locale);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'grid size-7 place-items-center rounded-full text-xs font-medium',
                  i < step
                    ? 'bg-accent text-accent-foreground'
                    : i === step
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-muted-foreground',
                )}
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  'text-sm font-medium',
                  i === step ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 ? <div className="h-px flex-1 bg-border" /> : null}
          </React.Fragment>
        ))}
      </div>

      {/* Step body */}
      {step === 0 ? (
        <div className="space-y-5">
          <StepHead title="What do you do?" subtitle="Pick your main service. You can add more later." />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(c.id)}
                className={cn(
                  'rounded-2xl border p-4 text-left transition-colors',
                  categoryId === c.id
                    ? 'border-foreground bg-secondary/50'
                    : 'border-border hover:bg-secondary/30',
                )}
              >
                <div className="text-sm font-medium">{c.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{c.tagline}</div>
              </button>
            ))}
          </div>
          <Field label="Known for (optional, comma-separated)">
            <Input
              value={knownFor}
              onChange={(e) => setKnownFor(e.target.value)}
              placeholder="Balayage, Curly cuts, Bridal"
              className="h-11 bg-card text-base"
            />
          </Field>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-5">
          <StepHead title="Where are you?" subtitle="So clients nearby can find you." />
          <Field label="City">
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="București"
              className="h-11 bg-card text-base"
            />
          </Field>
          <Field label="Address (optional)">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Str. Example 12"
              className="h-11 bg-card text-base"
            />
          </Field>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-5">
          <StepHead title="Make your profile" subtitle="This is what clients see first." />
          <Field label="Studio / display name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 bg-card text-base"
            />
          </Field>
          <Field label="Tagline">
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Balayage & lived-in colour"
              className="h-11 bg-card text-base"
            />
          </Field>
          <Field label="About (optional)">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell clients who you are and what makes your work yours."
              className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-base leading-relaxed"
            />
          </Field>
          <label className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="mt-0.5 size-4 rounded border-input"
            />
            <span>
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Globe className="size-4" /> Publish my profile now
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                You can change this any time from your profile.
              </span>
            </span>
          </label>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="gap-1.5">
            <ArrowLeft className="size-4" /> Back
          </Button>
        ) : (
          <button
            type="button"
            onClick={skip}
            disabled={isPending}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Skip for now
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="gap-1.5">
            Next <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={finish} disabled={!canNext || isPending} className="gap-1.5">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Finishing…
              </>
            ) : (
              <>
                <Check className="size-4" /> Finish
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function StepHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
