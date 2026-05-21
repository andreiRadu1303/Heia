import { setRequestLocale } from 'next-intl/server';

import { studioById, MY_STUDIO_ID, CATEGORIES } from '@/lib/app-mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const studio = studioById(MY_STUDIO_ID)!;

  return (
    <main className="container space-y-6 pt-8">
      <header>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Studio profile</h1>
        <p className="mt-2 text-muted-foreground">How clients see you on Heia.</p>
      </header>

      <form className="space-y-4">
        <Field label="Studio name">
          <Input defaultValue={studio.name} className="h-11 bg-card text-base" />
        </Field>

        <Field label="Tagline">
          <Input defaultValue={studio.tagline} className="h-11 bg-card text-base" />
        </Field>

        <Field label="Category">
          <select
            defaultValue={studio.categoryId}
            className="h-11 w-full rounded-md border border-input bg-card px-3 text-base"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Address">
          <Input defaultValue={studio.address} className="h-11 bg-card text-base" />
        </Field>

        <Field label="About">
          <textarea
            defaultValue={studio.bio}
            rows={5}
            className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-base leading-relaxed"
          />
        </Field>

        <Field label="Known for (comma-separated)">
          <Input defaultValue={studio.knownFor.join(', ')} className="h-11 bg-card text-base" />
        </Field>

        <Button type="button" className="h-11 w-full">
          Save changes
        </Button>

        <p className="rounded-2xl border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Demo — saving wires up with the database. For now, this is a preview of the editor.
        </p>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
