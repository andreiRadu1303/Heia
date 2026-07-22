'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { CalendarHeart, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signupAction, type SignupState } from './actions';

const initialState: SignupState = {};

export function SignupForm({
  locale,
  role: fixedRole,
}: {
  locale: string;
  /** When set, the account type is locked (chosen on the gateway screen) and
   *  the in-form role toggle is hidden. When omitted, the toggle is shown. */
  role?: 'client' | 'provider';
}) {
  const t = useTranslations('Auth');
  const [state, formAction] = useActionState(signupAction, initialState);
  const [role, setRole] = React.useState<'client' | 'provider'>(fixedRole ?? 'client');

  const submitLabel = role === 'provider' ? t('signupProviderSubmit') : t('signupSubmit');

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="role" value={role} />

      {/* Role selector — only when the role wasn't already chosen on the gateway */}
      {!fixedRole ? (
        <div className="space-y-1.5">
          <span className="text-sm font-medium">{t('roleIntro')}</span>
          <div className="grid grid-cols-2 gap-2">
            <RoleCard
              active={role === 'client'}
              onClick={() => setRole('client')}
              icon={<CalendarHeart className="size-5" />}
              label={t('roleClient')}
              hint={t('roleClientHint')}
            />
            <RoleCard
              active={role === 'provider'}
              onClick={() => setRole('provider')}
              icon={<Sparkles className="size-5" />}
              label={t('roleProvider')}
              hint={t('roleProviderHint')}
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="display_name" className="text-sm font-medium">
          {t('displayNameLabel')}
        </label>
        <Input
          id="display_name"
          name="display_name"
          type="text"
          autoComplete="name"
          required
          placeholder={t('displayNamePlaceholder')}
          className="h-11 bg-background text-base sm:h-10 sm:text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          {t('emailLabel')}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t('emailPlaceholder')}
          className="h-11 bg-background text-base sm:h-10 sm:text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          {t('passwordLabel')}
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder={t('passwordPlaceholder')}
          className="h-11 bg-background text-base sm:h-10 sm:text-sm"
        />
        <p className="text-xs text-muted-foreground">{t('passwordHint')}</p>
      </div>

      <label className="flex items-start gap-2.5 text-sm">
        <input
          type="checkbox"
          name="marketing_consent"
          className="mt-0.5 size-4 rounded border-input"
        />
        <span className="text-foreground/80">
          {t('marketingConsentLabel')}{' '}
          <span className="text-xs text-muted-foreground">— {t('marketingConsentHint')}</span>
        </span>
      </label>

      {state.error ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {t(state.error as 'errorGeneric')}
        </div>
      ) : null}

      <SubmitButton label={submitLabel} />
    </form>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-colors',
        active ? 'border-foreground bg-secondary/60' : 'border-border bg-card hover:bg-secondary/30',
      )}
    >
      <span
        className={cn(
          'grid size-9 place-items-center rounded-full',
          active ? 'bg-foreground text-background' : 'bg-secondary text-foreground',
        )}
      >
        {icon}
      </span>
      <span className="text-sm font-medium leading-tight">{label}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </button>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11 w-full sm:h-10">
      {pending ? '…' : label}
    </Button>
  );
}
