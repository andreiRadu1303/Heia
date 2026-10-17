'use client';

import { ChevronLeft } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { hasInAppHistory } from './nav-tracker';

/**
 * Back chevron that returns to the page the visitor actually came from.
 * When there's no in-app history (deep link, new tab) it goes to `fallback`.
 */
export function BackButton({ fallback }: { fallback: string }) {
  const router = useRouter();

  function goBack() {
    if (hasInAppHistory()) router.back();
    else router.push(fallback);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Back"
      className="-ml-2 grid size-9 place-items-center rounded-full text-foreground/80 hover:bg-secondary"
    >
      <ChevronLeft className="size-5" />
    </button>
  );
}
