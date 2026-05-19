'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function WaitlistForm() {
  const t = useTranslations('Landing');
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    // UI-only stub: simulate a request. Real submission lands in MVP phase.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 400);
  }

  if (submitted) {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border bg-secondary px-4 py-3 text-sm">
        <Check className="size-4" aria-hidden />
        <span>{t('waitlistSuccess')}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="waitlist-email" className="sr-only">
          {t('waitlistLabel')}
        </label>
        <Input
          id="waitlist-email"
          type="email"
          required
          placeholder={t('waitlistPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="h-12 w-full text-base sm:h-10 sm:flex-1 sm:text-sm"
        />
        <Button type="submit" disabled={submitting} className="h-12 w-full sm:h-10 sm:w-auto">
          {t('waitlistCta')} <ArrowRight aria-hidden />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{t('waitlistNote')}</p>
    </form>
  );
}
