'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Mail, Loader2, MailCheck } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { changeEmailAction, type AccountState } from './actions';

const initialState: AccountState = {};

/**
 * Change the sign-in email.
 *
 * Collapsed by default — most people never touch it, and it's the setting
 * most likely to lock someone out if mistyped. Hence: confirm the address
 * twice, and be explicit that nothing changes until the link is clicked.
 */
export function EmailCard({ email }: { email: string }) {
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useActionState(changeEmailAction, initialState);

  // Once the confirmation is sent, the form has done its job.
  const sent = state.ok;

  return (
    <div className="rounded-3xl bg-card p-5 ring-1 ring-border">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-accent" />
            <h3 className="font-medium">Email</h3>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">{email || '—'}</p>
        </div>
        {!open && !sent ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Change
          </button>
        ) : null}
      </div>

      {sent ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">
          <MailCheck className="mt-0.5 size-4 shrink-0 text-accent" />
          <span>
            Check your new inbox — we sent a confirmation link. Your email stays the same
            until you click it.
          </span>
        </div>
      ) : open ? (
        <form action={formAction} className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="new-email" className="text-sm font-medium">
              New email
            </label>
            <Input
              id="new-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              autoFocus
              className="h-11 bg-background text-base"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm-email" className="text-sm font-medium">
              Confirm new email
            </label>
            <Input
              id="confirm-email"
              name="confirm_email"
              type="email"
              autoComplete="off"
              required
              className="h-11 bg-background text-base"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            We&rsquo;ll send a link to the new address. Nothing changes until you click it —
            so if you mistype it, your current email keeps working.
          </p>

          {state.error ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state.error}
            </div>
          ) : null}

          <div className="flex gap-2">
            <SubmitButton />
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11 flex-1 gap-2">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> Sending…
        </>
      ) : (
        'Send confirmation link'
      )}
    </Button>
  );
}
