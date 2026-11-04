'use client';

import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import { SPLASH_HANDOFF, splashWillPlay } from '../splash';

/**
 * Page-load sequence for the login screen. Elements opt in with data-anim:
 *   art    the illustration, settles in from a slight zoom
 *   logo   the wordmark
 *   line   a headline line, rises out of an overflow-hidden mask
 *   rise   anything on the form side, staggered upward
 * Under prefers-reduced-motion nothing is hidden or moved.
 */
export function LoginStage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // The splash, when it plays, is still on screen: start as it lifts.
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          delay: splashWillPlay() ? SPLASH_HANDOFF : 0,
        });

        tl.from('[data-anim=art]', {
          opacity: 0,
          scale: 1.06,
          transformOrigin: '0% 100%',
          duration: 1.8,
          ease: 'power2.out',
        })
          .from('[data-anim=logo]', { opacity: 0, y: -10, duration: 0.8 }, 0.1)
          .from('[data-anim=line]', { yPercent: 115, duration: 1, stagger: 0.12 }, 0.2)
          .from('[data-anim=rise]', { opacity: 0, y: 18, duration: 0.8, stagger: 0.07 }, 0.35);
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <main ref={root} className={className}>
      {children}
    </main>
  );
}
