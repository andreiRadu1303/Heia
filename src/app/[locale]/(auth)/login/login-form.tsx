'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { magicLinkLoginAction, passwordLoginAction, type LoginState } from './actions';

const initialState: LoginState = {};

type Mode = 'password' | 'magic';

export function LoginForm({ locale, next }: { locale: string; next?: string }) {
  const t = useTranslations('Auth');
  const [mode, setMode] = React.useState<Mode>('password');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 rounded-md border border-input bg-secondary/40 p-1 text-xs">
        <ModeTab active={mode === 'password'} onClick={() => setMode('password')}>
          {t('loginWithPassword')}
        </ModeTab>
        <ModeTab active={mode === 'magic'} onClick={() => setMode('magic')}>
          {t('loginWithMagicLink')}
        </ModeTab>
      </div>

      {mode === 'password' ? (
        <PasswordForm locale={locale} next={next} />
      ) : (
        <MagicLinkForm locale={locale} next={next} />
      )}
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-sm px-3 py-1.5 font-medium transition-colors',
        active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
      )}
    >
      {children}
    </button>
  );
}

function PasswordForm({ locale, next }: { locale: string; next?: string }) {
  const t = useTranslations('Auth');
  const [state, formAction] = useActionState(passwordLoginAction, initialState);
  return (
    <form action={formAction} className="space-y-3" noValidate>
      <input type="hidden" name="locale" value={locale} />
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field id="email" name="email" type="email" autoComplete="email" required label={t('emailLabel')} placeholder={t('emailPlaceholder')} />
      <Field id="password" name="password" type="password" autoComplete="current-password" required label={t('passwordLabel')} placeholder={t('passwordPlaceholder')} />
      {state.error ? <ErrorBox>{t(state.error as 'errorGeneric')}</ErrorBox> : null}
      <SubmitButton label={t('loginSubmit')} />
    </form>
  );
}

function MagicLinkForm({ locale, next }: { locale: string; next?: string }) {
  const t = useTranslations('Auth');
  const [state, formAction] = useActionState(magicLinkLoginAction, initialState);
  if (state.magicLinkSent) {
    return (
      <div
        role="status"
        className="rounded-md border border-foreground/15 bg-secondary/40 px-3 py-3 text-sm"
      >
        {t('magicLinkSent')}
      </div>
    );
  }
  return (
    <form action={formAction} className="space-y-3" noValidate>
      <input type="hidden" name="locale" value={locale} />
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field id="ml-email" name="email" type="email" autoComplete="email" required label={t('emailLabel')} placeholder={t('emailPlaceholder')} />
      {state.error ? <ErrorBox>{t(state.error as 'errorGeneric')}</ErrorBox> : null}
      <SubmitButton label={t('magicLinkSubmit')} />
    </form>
  );
}

function Field({
  id,
  name,
  type,
  autoComplete,
  required,
  label,
  placeholder,
}: {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  label: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="h-11 bg-background text-base sm:h-10 sm:text-sm"
      />
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {children}
    </div>
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
