'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle2, Pencil } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateProfileAction, type AccountState } from './actions';

export interface AccountProfile {
  display_name: string;
  role: 'client' | 'provider' | null;
  marketing_consent: boolean;
  created_at: string | null;
}

const initialState: AccountState = {};

/**
 * Account details card. Read-only by default; "Edit" switches the editable
 * fields (name, marketing consent) into inputs. Email, role and member-since
 * stay read-only — changing email needs a confirmation flow, and roles are
 * fixed at signup.
 */
export function AccountCard({
  email,
  profile,
  locale,
}: {
  email: string;
  profile: AccountProfile;
  locale: string;
}) {
  const [editing, setEditing] = React.useState(false);
  const [state, formAction] = useActionState(updateProfileAction, initialState);

  // Leave edit mode once a save succeeds; the page re-renders with fresh data.
  React.useEffect(() => {
    if (state.ok) setEditing(false);
  }, [state]);

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(locale)
    : '—';
  const roleLabel = profile.role === 'provider' ? 'Provider' : 'Client';

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="min-w-0 space-y-1.5">
          <CardDescription>Signed in as</CardDescription>
          <CardTitle className="truncate text-lg">{email}</CardTitle>
        </div>
        {!editing ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setEditing(true)}
          >
            <Pencil className="size-3.5" /> Edit
          </Button>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {editing ? (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />

            <label className="block space-y-1.5">
              <span className="text-sm text-muted-foreground">Name</span>
              <Input
                name="display_name"
                defaultValue={profile.display_name}
                required
                maxLength={80}
                autoFocus
                className="h-11 bg-card text-base"
              />
            </label>

            <Row label="Account type" value={roleLabel} />

            <label className="flex items-center justify-between gap-3 border-b border-border/60 pb-1.5">
              <span className="text-muted-foreground">Marketing updates</span>
              <input
                type="checkbox"
                name="marketing_consent"
                defaultChecked={profile.marketing_consent}
                className="size-4 rounded border-input"
              />
            </label>

            <Row label="Member since" value={memberSince} />

            {state.error ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {state.error}
              </div>
            ) : null}

            <div className="flex gap-2 pt-1">
              <SaveButton />
              <CancelButton onClick={() => setEditing(false)} />
            </div>
          </form>
        ) : (
          <>
            <Row label="Name" value={profile.display_name || '—'} />
            <Row label="Account type" value={roleLabel} />
            <Row
              label="Marketing updates"
              value={profile.marketing_consent ? 'Subscribed' : 'Off'}
            />
            <Row label="Member since" value={memberSince} />

            {state.ok ? (
              <div className="mt-2 flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
                <CheckCircle2 className="size-4" /> Saved.
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex-1">
      {pending ? 'Saving…' : 'Save'}
    </Button>
  );
}

function CancelButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus();
  return (
    <Button type="button" variant="outline" disabled={pending} onClick={onClick} className="flex-1">
      Cancel
    </Button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-1.5 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
