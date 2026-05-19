import * as React from 'react';
import { PreviewSwitcher } from '@/components/preview-switcher';
import type { Variant, PreviewPage, Palette } from '@/lib/preview-mock-data';

export function PreviewShell({
  palette,
  variant,
  page,
  showChrome = true,
  children,
}: {
  palette: Palette;
  variant: Variant;
  page: PreviewPage;
  showChrome?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div data-palette={palette} className="min-h-dvh bg-background text-foreground">
      {showChrome ? <PreviewSwitcher currentVariant={variant} currentPage={page} /> : null}
      {children}
    </div>
  );
}
