'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveServicesAction, type ServiceInput } from './actions';

let tempId = 1000;

type Save = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export function ServicesEditor({
  initial,
  locale,
}: {
  initial: ServiceInput[];
  locale: string;
}) {
  const router = useRouter();
  const [services, setServices] = React.useState<ServiceInput[]>(initial);
  const [save, setSave] = React.useState<Save>('idle');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const mutate = (fn: (prev: ServiceInput[]) => ServiceInput[]) => {
    setServices(fn);
    setSave('dirty');
  };

  const patch = (id: string, change: Partial<ServiceInput>) =>
    mutate((prev) => prev.map((s) => (s.id === id ? { ...s, ...change } : s)));
  const remove = (id: string) => mutate((prev) => prev.filter((s) => s.id !== id));
  const add = () =>
    mutate((prev) => [...prev, { id: `tmp-${tempId++}`, name: '', durationMin: 60, priceLei: 0 }]);

  const persist = () => {
    setSave('saving');
    setErrorMsg(null);
    startTransition(async () => {
      const res = await saveServicesAction(locale, services);
      if (res.ok) {
        setSave('saved');
        router.refresh(); // re-pull rows so new items get real ids
      } else {
        setSave('error');
        setErrorMsg(res.error ?? 'Could not save.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="space-y-3 rounded-3xl bg-card p-4 ring-1 ring-border">
            <Input
              value={s.name}
              onChange={(e) => patch(s.id, { name: e.target.value })}
              placeholder="Service name"
              className="h-11 bg-background font-medium"
            />
            <div className="flex items-end gap-3">
              <label className="flex-1 text-xs font-medium text-muted-foreground">
                Duration (min)
                <Input
                  type="number"
                  min={0}
                  value={s.durationMin}
                  onChange={(e) => patch(s.id, { durationMin: Number(e.target.value) })}
                  className="mt-1 h-11 bg-background text-base"
                />
              </label>
              <label className="flex-1 text-xs font-medium text-muted-foreground">
                Price (lei)
                <Input
                  type="number"
                  min={0}
                  value={s.priceLei}
                  onChange={(e) => patch(s.id, { priceLei: Number(e.target.value) })}
                  className="mt-1 h-11 bg-background text-base"
                />
              </label>
              <button
                type="button"
                onClick={() => remove(s.id)}
                aria-label="Remove service"
                className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}

        {services.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            No services yet. Add your first below.
          </div>
        ) : null}
      </div>

      <Button type="button" variant="outline" onClick={add} className="w-full gap-2">
        <Plus className="size-4" /> Add service
      </Button>

      {errorMsg ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMsg}
        </div>
      ) : null}

      <Button
        type="button"
        onClick={persist}
        disabled={isPending || save === 'idle' || save === 'saved'}
        className="h-11 w-full gap-2"
      >
        {save === 'saving' ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Saving…
          </>
        ) : save === 'saved' ? (
          <>
            <CheckCircle2 className="size-4" /> Saved
          </>
        ) : (
          'Save changes'
        )}
      </Button>
    </div>
  );
}
