import { WaitlistForm } from '@/components/waitlist-form';
import { imageFor } from '@/lib/preview-mock-data';

/**
 * SOFT WELLNESS landing — Headspace / Calm / BetterHelp.
 * Organic SVG blobs, curved wave dividers, pill shapes,
 * rounded-3xl cards, soft shadows.
 */
export function WellnessLanding() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -left-20 -top-20 size-72 rounded-full opacity-50 blur-3xl"
          style={{ background: 'hsl(var(--accent))' }}
        />
        <div
          className="absolute -right-16 top-40 size-60 rounded-full opacity-40 blur-3xl"
          style={{ background: 'hsl(var(--accent))' }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 size-40 rounded-full opacity-30 blur-2xl"
          style={{ background: 'hsl(var(--accent))' }}
        />
      </div>

      <div className="relative flex flex-1 flex-col">
        <header className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-2 font-medium">
            <span
              className="inline-block size-6 rounded-full"
              style={{ background: 'hsl(var(--accent))' }}
              aria-hidden
            />
            ProjectMarket
          </div>
          <button className="rounded-full bg-card px-4 py-1.5 text-xs font-medium shadow-sm">
            Log in
          </button>
        </header>

        <section className="px-6 pt-16 pb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-medium shadow-sm">
            <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden />
            Coming soon · România
          </div>
          <h1 className="mt-8 text-[2.5rem] font-medium leading-[1.05] tracking-tight">
            Find the right
            <br />
            hands. Slowly.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            No noise, no pressure. A calm directory where you can take your time and find
            specialists who feel like you.
          </p>
        </section>

        <svg className="block w-full" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
          <path
            d="M 0 40 Q 100 0 200 30 T 400 40 L 400 60 L 0 60 Z"
            fill="hsl(var(--card))"
            opacity="0.6"
          />
        </svg>

        <section className="bg-card/60 px-6 py-12">
          <h2 className="mb-8 text-xl font-medium tracking-tight">What you get</h2>
          <div className="space-y-3">
            {[
              { name: 'Andra C.', body: 'Balayage you wear like a season.', seed: 'andra' },
              { name: 'Maria B.', body: 'Bridal makeup with breathing room.', seed: 'maria' },
              { name: 'Elena R.', body: 'Brows shaped to your face only.', seed: 'elena' },
            ].map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border"
              >
                <img
                  src={imageFor.avatar(p.seed)}
                  alt=""
                  className="size-14 shrink-0 rounded-full object-cover ring-2 ring-accent/30"
                />
                <div className="min-w-0">
                  <div className="text-base font-medium tracking-tight">{p.name}</div>
                  <div className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <svg className="block w-full" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
          <path
            d="M 0 20 Q 100 60 200 30 T 400 20 L 400 0 L 0 0 Z"
            fill="hsl(var(--card))"
            opacity="0.6"
          />
        </svg>

        <section className="px-6 pb-16 pt-10">
          <div className="rounded-3xl bg-card p-6 shadow-md ring-1 ring-border">
            <div className="text-center">
              <h2 className="text-2xl font-medium tracking-tight">Be the first to know.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                One soft notification. No marketing nonsense.
              </p>
            </div>
            <div className="mt-6">
              <WaitlistForm />
            </div>
          </div>
        </section>

        <footer className="mt-auto px-6 pb-8 text-center text-xs text-muted-foreground">
          Made with care · București · 2026
        </footer>
      </div>
    </div>
  );
}
