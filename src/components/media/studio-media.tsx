'use client';

import * as React from 'react';
import { ImagePlus, Camera, X, Loader2, CheckCircle2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import {
  saveStudioMediaAction,
  type StudioMedia,
} from '@/app/[locale]/provider/profile/media-actions';

const BUCKET = 'studio-media';
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function StudioMediaEditor({
  locale,
  initialAvatar,
  initialCover,
  initialGallery,
}: {
  locale: string;
  initialAvatar: string | null;
  initialCover: string | null;
  initialGallery: string[];
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [avatar, setAvatar] = React.useState<string | null>(initialAvatar);
  const [cover, setCover] = React.useState<string | null>(initialCover);
  const [gallery, setGallery] = React.useState<string[]>(initialGallery);
  const [busy, setBusy] = React.useState<null | 'avatar' | 'cover' | 'gallery'>(null);
  const [save, setSave] = React.useState<SaveState>('idle');
  const [error, setError] = React.useState<string | null>(null);

  async function uploadFile(file: File, kind: string): Promise<string> {
    if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
    if (file.size > MAX_BYTES) throw new Error('Image must be under 5 MB.');

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('You are signed out.');

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${user.id}/${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: true });
    if (upErr) throw upErr;

    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  async function persist(next: StudioMedia) {
    setSave('saving');
    const res = await saveStudioMediaAction(locale, next);
    if (res.ok) {
      setSave('saved');
    } else {
      setSave('error');
      setError(res.error ?? 'Could not save.');
    }
  }

  async function handleSingle(kind: 'avatar' | 'cover', file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(kind);
    try {
      const url = await uploadFile(file, kind);
      if (kind === 'avatar') {
        setAvatar(url);
        await persist({ avatarUrl: url, coverUrl: cover, galleryUrls: gallery });
      } else {
        setCover(url);
        await persist({ avatarUrl: avatar, coverUrl: url, galleryUrls: gallery });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
      setSave('error');
    } finally {
      setBusy(null);
    }
  }

  async function handleGalleryAdd(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy('gallery');
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadFile(file, 'gallery'));
      const next = [...gallery, ...urls];
      setGallery(next);
      await persist({ avatarUrl: avatar, coverUrl: cover, galleryUrls: next });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
      setSave('error');
    } finally {
      setBusy(null);
    }
  }

  async function removeGalleryItem(url: string) {
    const next = gallery.filter((g) => g !== url);
    setGallery(next);
    await persist({ avatarUrl: avatar, coverUrl: cover, galleryUrls: next });
  }

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Photos</h2>
        {save === 'saving' ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" /> Saving…
          </span>
        ) : save === 'saved' ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-accent">
            <CheckCircle2 className="size-3.5" /> Saved
          </span>
        ) : null}
      </div>

      {/* Cover + avatar */}
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted/40">
          <div className="aspect-[16/9] w-full">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="Cover" className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center text-sm text-muted-foreground">
                No cover photo yet
              </div>
            )}
          </div>
          <UploadButton
            label="Cover"
            busy={busy === 'cover'}
            onFile={(f) => handleSingle('cover', f)}
            className="absolute bottom-2 right-2"
          />
          {/* Avatar overlapping */}
          <div className="absolute -bottom-2 left-4">
            <div className="relative size-16 overflow-hidden rounded-full border-2 border-card bg-muted">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="Profile" className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center">
                  <Camera className="size-5 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <UploadButton
            label="Profile photo"
            busy={busy === 'avatar'}
            onFile={(f) => handleSingle('avatar', f)}
          />
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Portfolio</div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {gallery.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryItem(url)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          <label
            className={cn(
              'grid aspect-square cursor-pointer place-items-center rounded-lg border border-dashed border-border text-muted-foreground hover:bg-secondary/40',
              busy === 'gallery' && 'pointer-events-none opacity-60',
            )}
          >
            {busy === 'gallery' ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <ImagePlus className="size-5" />
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleGalleryAdd(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </section>
  );
}

function UploadButton({
  label,
  busy,
  onFile,
  className,
}: {
  label: string;
  busy: boolean;
  onFile: (file: File | undefined) => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background/90 px-3 py-1.5 text-xs font-medium hover:bg-secondary',
        busy && 'pointer-events-none opacity-60',
        className,
      )}
    >
      {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
      {label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </label>
  );
}
