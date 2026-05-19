import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StubPage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-prose text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[4/3] w-full bg-muted" aria-hidden />
            <CardHeader>
              <CardTitle className="text-base">Placeholder {i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-2/3 rounded bg-muted" />
              <div className="mt-2 h-2 w-1/2 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
