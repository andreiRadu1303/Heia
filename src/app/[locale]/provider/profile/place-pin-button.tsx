'use client';

import * as React from 'react';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

import { LocationPicker, type LatLng } from '@/components/app/location-picker';
import { saveStudioLocationAction, suggestStudioLocationAction } from './location-actions';

/**
 * "Place on map" — opens the picker, seeded with the studio's existing pin or
 * a geocoded guess from whatever is currently typed in the address fields.
 */
export function PlacePinButton({
  locale,
  hasPin,
}: {
  locale: string;
  hasPin: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [initial, setInitial] = React.useState<LatLng | null>(null);
  const [opening, setOpening] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [placed, setPlaced] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /** Read the address fields as they are right now, unsaved included. */
  const readForm = () => {
    const form = document.querySelector('form');
    const address = (form?.querySelector('[name="address"]') as HTMLInputElement | null)?.value ?? '';
    const city = (form?.querySelector('[name="city"]') as HTMLSelectElement | null)?.value ?? '';
    return { address, city };
  };

  const openPicker = async () => {
    setOpening(true);
    setError(null);
    try {
      const { address, city } = readForm();
      const guess = await suggestStudioLocationAction(address, city);
      setInitial(guess);
      setOpen(true);
    } finally {
      setOpening(false);
    }
  };

  const confirm = async (point: LatLng) => {
    setSaving(true);
    setError(null);
    const res = await saveStudioLocationAction(locale, point.lat, point.lng);
    setSaving(false);
    if (res.ok) {
      setPlaced(true);
      setOpen(false);
    } else {
      setError(res.error ?? 'Could not save your pin.');
      setOpen(false);
    }
  };

  return (
    <>
      <div className="-mt-2 space-y-2">
        <button
          type="button"
          onClick={openPicker}
          disabled={opening}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium hover:bg-secondary disabled:opacity-60"
        >
          {opening ? <Loader2 className="size-4 animate-spin" /> : <MapPin className="size-4" />}
          {hasPin || placed ? 'Adjust pin on map' : 'Place on map'}
        </button>

        {placed ? (
          <div className="flex items-center gap-2 text-sm text-accent">
            <CheckCircle2 className="size-4" /> Pin saved — this is where clients will see you.
          </div>
        ) : null}

        {error ? <div className="text-sm text-destructive">{error}</div> : null}
      </div>

      {open ? (
        <LocationPicker
          initial={initial}
          saving={saving}
          onConfirm={confirm}
          onCancel={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
