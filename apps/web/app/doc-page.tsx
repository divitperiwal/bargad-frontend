import Image from 'next/image';
import Link from 'next/link';

/** A plain reading page for terms and policies. Text here can be selected. */
export function DocPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-bg">
      <header className="mx-auto flex max-w-[760px] items-center justify-between px-6 py-6">
        <Link href="/login" className="flex items-center gap-2.5">
          <Image
            src="/brand/mark-b-roots-ink.png"
            alt=""
            width={215}
            height={285}
            className="theme-ink h-8 w-auto"
          />
          <span className="font-serif text-2xl leading-none tracking-tight">bargad</span>
        </Link>
        <Link
          href="/login"
          className="text-sm text-ink-3 underline underline-offset-2 transition-colors hover:text-ink"
        >
          Back to log in
        </Link>
      </header>

      <article className="selectable mx-auto max-w-[680px] px-6 pb-24 pt-8">
        <p className="mb-5 w-fit rounded-full bg-surface-2 px-3 py-1 text-sm text-ink-2">
          Draft for review. Not legal advice.
        </p>
        <h1 className="font-serif text-[clamp(36px,6dvh,52px)] leading-[1.05] tracking-[-0.02em]">
          {title}
        </h1>
        <div className="mt-10 flex flex-col gap-10">{children}</div>
      </article>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-serif text-[26px] leading-tight tracking-[-0.01em]">{title}</h2>
      <div className="flex flex-col gap-3 text-base leading-relaxed text-ink-2">{children}</div>
    </section>
  );
}
