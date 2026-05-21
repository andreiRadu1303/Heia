'use client';

import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { studioById, MY_STUDIO_ID } from '@/lib/app-mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditableService {
  id: string;
  name: string;
  durationMin: number;
  priceLei: number;
}

let tempId = 1000;

export default function ProviderServicesPage() {
  const studio = studioById(MY_STUDIO_ID)!;
  const [services, setServices] = React.useState<EditableService[]>(() =>
    studio.services.map((s) => ({ ...s })),
  );

  function patch(id: string, change: Partial<EditableService>) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...change } : s)));
  }
  function remove(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }
  function add() {
    setServices((prev) => [
      ...prev,
      { id: `tmp-${tempId++}`, name: '', durationMin: 60, priceLei: 0 },
    ]);
  }

  return (
    <main className="container space-y-6 pt-8">
      <header>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Services</h1>
        <p className="mt-2 text-muted-foreground">What you offer and what it costs.</p>
      </header>

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
      </div>

      <Button type="button" variant="outline" onClick={add} className="w-full gap-2">
        <Plus className="size-4" /> Add service
      </Button>

      <p className="rounded-2xl border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        Demo — edits live in the browser only. Saving to your account comes with the database.
      </p>
    </main>
  );
}
