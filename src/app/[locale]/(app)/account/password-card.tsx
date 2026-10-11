'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle2, Eye, EyeOff, KeyRound, Mail } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { changePasswordAction, sendPasswordResetAction, type AccountState } from './actions';

const initialState: AccountState = {};

/**
 * Password section of My Account. Two ways to reset:
 *  1. Change it here (new + confirm) — works while signed in.
 *  2. "Email me a reset link" — for when the session is too old to change
 *     the password directly, or the user simply forgot it. The link comes
 *     back here with `?reset=1`, which opens the form automatically.
 */
export function PasswordCard({
  locale,
  openByDefault,
}: {
  locale: string;
  openByDefault: boolean;
}) {
  const [open, setOpen] = React.useState(openByDefault);
  const [state, formAction] = useActionState(changePasswordAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  // Collapse the form again once a change succeeds.
  React.useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="min-w-0 space-y-1.5">
          <CardDescription>Security</CardDescription>
          <CardTitle className="text-lg">Password</CardTitle>
        </div>
        {!open ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setOpen(true)}
          >
            <KeyRound className="size-3.5" /> Change
          </Button>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {state.ok && !open ? (
          <div className="flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
            <CheckCircle2 className="size-4" /> Password changed.
          </div>
        ) : null}

        {open ? (
          <form ref={formRef} action={formAction} className="space-y-4">
            {openByDefault ? (
              <p className="text-muted-foreground">Set your new password below.</p>
            ) : null}

            <PasswordField name="password" label="New password" autoFocus />
            <PasswordField name="confirm" label="Confirm new password" />

            <p className="text-xs text-muted-foreground">At least 8 characters.</p>

            {state.error ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {state.error}
              </div>
            ) : null}

            <div className="flex gap-2 pt-1">
              <SubmitButton />
              <CancelButton onClick={() => setOpen(false)} />
            </div>
          </form>
        ) : (
          <p className="text-muted-foreground">
            Change your password here, or get a reset link by email if you&apos;ve forgotten it.
          </p>
        )}

        <ResetLinkRow locale={locale} />
      </CardContent>
    </Card>
  );
}

function PasswordField({
  name,
  label,
  autoFocus,
}: {
  name: string;
  label: string;
  autoFocus?: boolean;
}) {
  const [show, setShow] = React.useState(false);
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="relative">
        <Input
          name={name}
          type={show ? 'text' : 'password'}
          required
          minLength={8}
          autoComplete="new-password"
          autoFocus={autoFocus}
          className="h-11 bg-card pr-11 text-base"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex-1">
      {pending ? 'Saving…' : 'Save new password'}
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

/** Secondary path: send a reset link to the signed-in user's email. */
function ResetLinkRow({ locale }: { locale: string }) {
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);

  async function send() {
    setStatus('sending');
    setError(null);
    const res = await sendPasswordResetAction(locale);
    if (res.ok) {
      setStatus('sent');
    } else {
      setStatus('error');
      setError(res.error ?? 'Could not send the email.');
    }
  }

  return (
    <div className="border-t border-border/60 pt-3">
      {status === 'sent' ? (
        <div className="flex items-center gap-2 text-sm text-accent">
          <CheckCircle2 className="size-4" /> Reset link sent — check your inbox.
        </div>
      ) : (
        <button
          type="button"
          onClick={send}
          disabled={status === 'sending'}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
        >
          <Mail className="size-4" />
          {status === 'sending' ? 'Sending…' : 'Email me a reset link'}
        </button>
      )}
      {error ? (
        <div role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}
