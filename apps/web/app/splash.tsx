'use client';

import gsap from 'gsap';
import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';

export const SPLASH_KEY = 'bargad-splash';
/** Seconds into the splash when the page behind it can start moving. */
export const SPLASH_HANDOFF = 1.3;

export function splashWillPlay() {
  try {
    if (new URLSearchParams(location.search).has('splash')) return true;
    return sessionStorage.getItem(SPLASH_KEY) !== '1';
  } catch {
    return false;
  }
}

/**
 * Full-screen loader: the wordmark blurs into focus, a line draws under it,
 * then the whole thing lifts away. Plays once per browser session
 * (add ?splash to the URL to see it again). Skipped for reduced motion.
 */
export function Splash() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !splashWillPlay()) {
      setGone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(SPLASH_KEY, '1');
          } catch {}
          setGone(true);
        },
      });

      tl.from('[data-splash=mark]', {
        opacity: 0,
        y: 10,
        filter: 'blur(14px)',
        duration: 1,
        ease: 'power2.out',
      })
        .from(
          '[data-splash=word]',
          { opacity: 0, filter: 'blur(14px)', duration: 1, ease: 'power2.out' },
          0.15,
        )
        .from('[data-splash=line]', { scaleX: 0, duration: 1.1, ease: 'power2.inOut' }, 0.15)
        .to(
          '[data-splash=content]',
          { opacity: 0, y: -8, filter: 'blur(6px)', duration: 0.45, ease: 'power1.in' },
          SPLASH_HANDOFF - 0.1,
        )
        .to(root.current, { opacity: 0, duration: 0.55, ease: 'power1.out' }, SPLASH_HANDOFF);
    }, root);

    return () => ctx.revert();
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-50 grid place-items-center bg-bg text-ink"
    >
      <div data-splash="content" className="flex flex-col items-center" style={{ gap: 12 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <span className="theme-ink flex">
            <Image
              data-splash="mark"
              src="/brand/mark-b-roots-ink.png"
              alt=""
              width={215}
              height={285}
              priority
              className="w-auto"
              style={{ height: 30 }}
            />
          </span>
          <span
            data-splash="word"
            className="font-serif leading-none tracking-tight"
            style={{ fontSize: 26 }}
          >
            bargad
          </span>
        </div>
        <span
          data-splash="line"
          className="block origin-left rounded-full bg-ink/70"
          style={{ height: 2, width: 120 }}
        />
      </div>
    </div>
  );
}
