'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signupAction, type SignupState } from './actions';

const initialState: SignupState = {};

export function SignupForm({ locale }: { locale: string }) {
  const t = useTranslations('Auth');
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="locale" value={locale} />

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

      <SubmitButton label={t('signupSubmit')} />
    </form>
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
