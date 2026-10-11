'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  requestResetCodeAction,
  resetPasswordWithCodeAction,
  type ForgotState,
} from './actions';

const initialState: ForgotState = {};

/**
 * Two steps: (1) email → we send a one-time code; (2) code + new password.
 * "Use a different email" goes back to step 1; "Resend code" re-sends.
 */
export function ForgotPasswordForm({ locale }: { locale: string }) {
  const [sendState, sendAction] = useActionState(requestResetCodeAction, initialState);
  const [resetState, resetAction] = useActionState(resetPasswordWithCodeAction, initialState);
  const [startOver, setStartOver] = React.useState(false);

  const email = !startOver ? (sendState.sentTo ?? resetState.sentTo) : undefined;

  if (!email) {
    return <EmailStep locale={locale} state={sendState} action={sendAction} onUsed={() => setStartOver(false)} />;
  }

  return (
    <CodeStep
      locale={locale}
      email={email}
      state={resetState}
      action={resetAction}
      resendAction={sendAction}
      onChangeEmail={() => setStartOver(true)}
    />
  );
}

function EmailStep({
  locale,
  state,
  action,
  onUsed,
}: {
  locale: string;
  state: ForgotState;
  action: (formData: FormData) => void;
  onUsed: () => void;
}) {
  const t = useTranslations('Auth');
  return (
    <form
      action={(fd) => {
        onUsed();
        action(fd);
      }}
      className="space-y-3"
      noValidate
    >
      <input type="hidden" name="locale" value={locale} />
      <Field
        id="fp-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        label={t('emailLabel')}
        placeholder={t('emailPlaceholder')}
      />
      {state.error ? <ErrorBox>{t(state.error as 'errorGeneric')}</ErrorBox> : null}
      <SubmitButton label={t('forgotSendCode')} />
    </form>
  );
}

function CodeStep({
  locale,
  email,
  state,
  action,
  resendAction,
  onChangeEmail,
}: {
  locale: string;
  email: string;
  state: ForgotState;
  action: (formData: FormData) => void;
  resendAction: (formData: FormData) => void;
  onChangeEmail: () => void;
}) {
  const t = useTranslations('Auth');
  const [resent, setResent] = React.useState(false);

  return (
    <div className="space-y-4">
      <div
        role="status"
        className="rounded-md border border-foreground/15 bg-secondary/40 px-3 py-3 text-sm"
      >
        {t('forgotCodeSent', { email })}
      </div>

      <form action={action} className="space-y-3" noValidate>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="email" value={email} />
        <Field
          id="fp-code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          label={t('codeLabel')}
          placeholder={t('codePlaceholder')}
          className="tracking-[0.3em]"
        />
        <Field
          id="fp-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          label={t('newPasswordLabel')}
          placeholder={t('passwordPlaceholder')}
          hint={t('passwordHint')}
        />
        <Field
          id="fp-confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          label={t('confirmPasswordLabel')}
          placeholder={t('passwordPlaceholder')}
        />
        {state.error ? <ErrorBox>{t(state.error as 'errorGeneric')}</ErrorBox> : null}
        <SubmitButton label={t('forgotSubmit')} />
      </form>

      <div className="flex items-center justify-between text-sm">
        <form
          action={(fd) => {
            setResent(true);
            resendAction(fd);
          }}
        >
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="email" value={email} />
          <ResendButton label={resent ? t('forgotResent') : t('forgotResend')} disabled={resent} />
        </form>
        <button
          type="button"
          onClick={onChangeEmail}
          className="font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t('forgotChangeEmail')}
        </button>
      </div>
    </div>
  );
}

function Field({
  id,
  name,
  type,
  autoComplete,
  inputMode,
  required,
  label,
  placeholder,
  hint,
  className,
}: {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  required?: boolean;
  label: string;
  placeholder?: string;
  hint?: string;
  className?: string;
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
        inputMode={inputMode}
        required={required}
        placeholder={placeholder}
        className={`h-11 bg-background text-base sm:h-10 sm:text-sm ${className ?? ''}`}
      />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
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

function ResendButton({ label, disabled }: { label: string; disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:no-underline disabled:opacity-60"
    >
      {pending ? '…' : label}
    </button>
  );
}
