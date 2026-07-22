'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle2, Globe } from 'lucide-react';

import { CATEGORIES } from '@/lib/app-mock-data';
import type { StudioRow } from '@/lib/provider-studio';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { saveProfileAction, type ProfileState } from './actions';

const initialState: ProfileState = {};

export function ProfileForm({ studio, locale }: { studio: StudioRow; locale: string }) {
  const [state, formAction] = useActionState(saveProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />

      <Field label="Studio name">
        <Input name="name" defaultValue={studio.name} required className="h-11 bg-card text-base" />
      </Field>

      <Field label="Tagline">
        <Input
          name="tagline"
          defaultValue={studio.tagline ?? ''}
          placeholder="Balayage & lived-in colour"
          className="h-11 bg-card text-base"
        />
      </Field>

      <Field label="Category">
        <select
          name="category_id"
          defaultValue={studio.category_id}
          className="h-11 w-full rounded-md border border-input bg-card px-3 text-base"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City">
          <Input name="city" defaultValue={studio.city ?? ''} className="h-11 bg-card text-base" />
        </Field>
        <Field label="Address">
          <Input
            name="address"
            defaultValue={studio.address ?? ''}
            className="h-11 bg-card text-base"
          />
        </Field>
      </div>

      <Field label="About">
        <textarea
          name="bio"
          defaultValue={studio.bio ?? ''}
          rows={5}
          placeholder="Tell clients who you are and what makes your work yours."
          className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-base leading-relaxed"
        />
      </Field>

      <Field label="Known for (comma-separated)">
        <Input
          name="known_for"
          defaultValue={studio.known_for.join(', ')}
          placeholder="Balayage, Curly cuts, Bridal"
          className="h-11 bg-card text-base"
        />
      </Field>

      {/* Publish toggle */}
      <label className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={studio.is_published}
          className="mt-0.5 size-4 rounded border-input"
        />
        <span>
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <Globe className="size-4" /> Publish my profile
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            When on, clients can find and book you. Turn off to stay hidden while you set things up.
          </span>
        </span>
      </label>

      {state.error ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </div>
      ) : null}

      {state.ok ? (
        <div className="flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          <CheckCircle2 className="size-4" /> Saved.
        </div>
      ) : null}

      <SubmitButton />
    </form>
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11 w-full">
      {pending ? 'Saving…' : 'Save changes'}
    </Button>
  );
}
