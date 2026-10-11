'use client';

import * as React from 'react';
import { Heart } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { toggleSaveStudioAction } from '@/app/[locale]/(app)/saved/actions';

const BASE =
  'grid size-10 place-items-center rounded-full bg-white/90 text-black/80 shadow ring-1 ring-black/10 transition hover:bg-white';

/**
 * Heart toggle for a studio. Optimistic: flips at once, persists in the
 * background, reverts (and shows why) if the save fails. Signed-out visitors
 * are sent to login and come back here afterwards.
 */
export function SaveStudioButton({
  slug,
  locale,
  initialSaved,
  signedIn,
  className,
}: {
  slug: string;
  locale: string;
  initialSaved: boolean;
  signedIn: boolean;
  className?: string;
}) {
  const [saved, setSaved] = React.useState(initialSaved);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  if (!signedIn) {
    return (
      <Link
        href={`/login?next=/${locale}/studio/${slug}`}
        aria-label="Sign in to save this studio"
        title="Save"
        className={cn(BASE, className)}
      >
        <Heart className="size-5" />
      </Link>
    );
  }

  function toggle() {
    const next = !saved;
    setSaved(next);
    setError(null);
    startTransition(async () => {
      const res = await toggleSaveStudioAction(locale, slug, next);
      if (!res.ok) {
        setSaved(!next);
        setError(res.error ?? 'Could not save.');
      }
    });
  }

  return (
    <div className={cn('flex flex-col items-end gap-1', className)}>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={saved}
        aria-label={saved ? 'Remove from saved' : 'Save studio'}
        title={saved ? 'Saved' : 'Save'}
        className={cn(BASE, pending && 'opacity-70')}
      >
        <Heart className={cn('size-5', saved && 'fill-red-500 text-red-500')} />
      </button>
      {error ? (
        <span role="alert" className="rounded-md bg-background/90 px-2 py-1 text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </div>
  );
}
