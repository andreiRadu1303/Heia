'use client';

import * as React from 'react';
import { Camera, Loader2, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { saveAvatarAction } from './actions';

// Same bucket as studio photos: its policies let any signed-in user write
// under a folder named after their own uid (see migration 008).
const BUCKET = 'studio-media';
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Circular profile photo with a camera button to add/replace it, and a small
 * "x" to remove it. Uploads go straight to Supabase Storage from the browser;
 * only the resulting URL is written to `profiles.avatar_url`.
 */
export function AvatarUploader({
  locale,
  initialUrl,
  name,
}: {
  locale: string;
  initialUrl: string | null;
  name: string;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [url, setUrl] = React.useState<string | null>(initialUrl);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
      if (file.size > MAX_BYTES) throw new Error('Image must be under 5 MB.');

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('You are signed out.');

      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `${user.id}/avatar-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: true });
      if (upErr) throw upErr;

      const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      const res = await saveAvatarAction(locale, publicUrl);
      if (res.error) throw new Error(res.error);
      setUrl(publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    setError(null);
    setBusy(true);
    try {
      const res = await saveAvatarAction(locale, null);
      if (res.error) throw new Error(res.error);
      setUrl(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not remove photo.');
    } finally {
      setBusy(false);
    }
  }

  const initial = (name.trim().charAt(0) || '?').toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="size-24 overflow-hidden rounded-full bg-gradient-to-br from-accent/30 to-secondary ring-2 ring-border">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Profile photo" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center text-3xl font-medium text-foreground/60">
              {initial}
            </div>
          )}
          {busy ? (
            <div className="absolute inset-0 grid place-items-center rounded-full bg-background/70">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : null}
        </div>

        {/* Add / change */}
        <label
          className={cn(
            'absolute -bottom-1 -right-1 grid size-9 cursor-pointer place-items-center rounded-full bg-foreground text-background shadow ring-2 ring-card hover:opacity-90',
            busy && 'pointer-events-none opacity-60',
          )}
          aria-label={url ? 'Change profile photo' : 'Add profile photo'}
          title={url ? 'Change photo' : 'Add photo'}
        >
          <Camera className="size-4" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </label>

        {/* Remove */}
        {url && !busy ? (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove profile photo"
            title="Remove photo"
            className="absolute -left-1 -top-1 grid size-7 place-items-center rounded-full bg-card text-muted-foreground shadow ring-1 ring-border hover:text-destructive"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs text-destructive"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
