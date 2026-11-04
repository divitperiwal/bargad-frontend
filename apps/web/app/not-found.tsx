import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NotFoundArt } from './not-found-art';

export const metadata: Metadata = { title: 'Page not found · Bargad' };

export default function NotFound() {
  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-bg">
      <header className="flex items-center px-8 py-6">
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
      </header>

      <div className="my-auto flex w-full flex-col items-center pb-12">
        <NotFoundArt />
      </div>
    </main>
  );
}
