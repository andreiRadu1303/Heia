'use client';

import * as React from 'react';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

import { LocationPicker, type LatLng } from '@/components/app/location-picker';
import {
  saveStudioLocationAction,
  suggestStudioLocationAction,
  resetStudioLocationAction,
} from './location-actions';

/**
 * "Place on map" — opens the picker, seeded with the studio's existing pin or
 * a geocoded guess from whatever is currently typed in the address fields.
 */
export function PlacePinButton({
  locale,
  hasPin,
  isManual = false,
  stale = false,
}: {
  locale: string;
  hasPin: boolean;
  /** True when the expert positioned this pin themselves. */
  isManual?: boolean;
  /** True when the address just changed but the manual pin didn't follow. */
  stale?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [initial, setInitial] = React.useState<LatLng | null>(null);
  const [opening, setOpening] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [placed, setPlaced] = React.useState(false);
  const [reset, setReset] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Manual until they hand it back; placing a pin makes it manual again.
  const manual = (isManual || placed) && !reset;

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
      setReset(false);
      setOpen(false);
    } else {
      setError(res.error ?? 'Could not save your pin.');
      setOpen(false);
    }
  };

  const useAddressInstead = async () => {
    setResetting(true);
    setError(null);
    const { address, city } = readForm();
    const res = await resetStudioLocationAction(locale, address, city);
    setResetting(false);
    if (res.ok) {
      setReset(true);
      setPlaced(false);
    } else {
      setError(res.error ?? 'Could not update your location.');
    }
  };

  return (
    <>
      <div className="-mt-2 space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            onClick={openPicker}
            disabled={opening}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium hover:bg-secondary disabled:opacity-60"
          >
            {opening ? <Loader2 className="size-4 animate-spin" /> : <MapPin className="size-4" />}
            {hasPin || placed ? 'Adjust pin on map' : 'Place on map'}
          </button>

          {/* Only meaningful once they've overridden the geocoder. */}
          {manual ? (
            <button
              type="button"
              onClick={useAddressInstead}
              disabled={resetting}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-60"
            >
              {resetting ? <Loader2 className="size-3.5 animate-spin" /> : null}
              Use my address instead
            </button>
          ) : null}
        </div>

        {/* The dangerous case: they moved, their hand-placed pin didn't.
            Nothing else on screen would reveal it, so say so and offer both
            ways out right here. */}
        {stale && !placed && !reset ? (
          <div className="space-y-2 rounded-xl border border-accent/40 bg-accent/10 p-3">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>
                Your address changed, but your pin is still at the old location.
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={useAddressInstead}
                disabled={resetting}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-3 text-sm font-medium text-background disabled:opacity-60"
              >
                {resetting ? <Loader2 className="size-3.5 animate-spin" /> : null}
                Move it to my new address
              </button>
              <button
                type="button"
                onClick={openPicker}
                disabled={opening}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium hover:bg-secondary disabled:opacity-60"
              >
                {opening ? <Loader2 className="size-3.5 animate-spin" /> : null}
                Place it myself
              </button>
            </div>
          </div>
        ) : placed ? (
          <div className="flex items-center gap-2 text-sm text-accent">
            <CheckCircle2 className="size-4" /> Pin saved — this is where clients will see you.
          </div>
        ) : reset ? (
          <div className="flex items-center gap-2 text-sm text-accent">
            <CheckCircle2 className="size-4" /> Back to your address — we&rsquo;ll keep it in sync
            from now on.
          </div>
        ) : manual ? (
          <p className="text-xs text-muted-foreground">
            Your pin is placed by hand, so changing the address won&rsquo;t move it.
          </p>
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
