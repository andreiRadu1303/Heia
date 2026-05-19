import { PreviewSwitcher } from '@/components/preview-switcher';
import { WaitlistForm } from '@/components/waitlist-form';

export default function PreviewV3Page() {
  return (
    <div data-palette="cool-neutral" className="min-h-dvh bg-background text-foreground">
      <PreviewSwitcher currentVariant="v3" currentPage="landing" />

      <header className="border-b">
        <div className="container flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center gap-2 text-base font-semibold tracking-tight sm:text-lg">
            <span className="inline-block size-2 rounded-sm bg-foreground" aria-hidden />
            ProjectMarket
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Coming soon
          </div>
        </div>
      </header>

      <main className="container py-10 sm:py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border bg-secondary px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:text-xs">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-foreground" aria-hidden />
            Coming soon · România
          </div>
          <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:mt-8 sm:text-5xl md:text-6xl lg:text-7xl">
            Find good people, when you need them.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg md:text-xl">
            A new place to discover specialists near you, see how they work, and book without friction. We’ll
            let you know when we open.
          </p>
          <div className="mt-8 sm:mt-10">
            <WaitlistForm />
          </div>
        </div>

        <section className="mt-14 grid gap-8 border-t pt-10 sm:mt-20 sm:gap-10 sm:pt-14 md:mt-24 md:grid-cols-3 md:gap-12 md:pt-16">
          <Pillar number="01" title="Discover" body="People and places you’d recommend onward." />
          <Pillar number="02" title="Read the style" body="Portfolio, reviews, and what makes them theirs." />
          <Pillar number="03" title="Book simply" body="One place for appointments. No scattered threads." />
        </section>
      </main>

      <footer className="container border-t py-8 text-sm text-muted-foreground sm:py-10">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="font-semibold text-foreground">ProjectMarket</div>
          <div className="font-mono text-[10px] uppercase tracking-widest">v3 · cool neutral</div>
        </div>
      </footer>
    </div>
  );
}

function Pillar({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="font-mono text-[10px] tracking-widest text-muted-foreground sm:text-xs">{number}</div>
      <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{body}</p>
    </div>
  );
}
