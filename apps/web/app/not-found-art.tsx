'use client';

import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';

// Aerial roots hanging from the digits, each with its own sway and weight.
// Every one reaches the ground at y=350 except the one in the middle, which
// stops short. [path, stroke width]
const roots: [string, number][] = [
  ['M200 186C190 230 214 282 200 350', 2.2],
  ['M240 186C252 240 226 292 238 351', 1.6],
  ['M288 186C278 224 302 292 290 350', 2.4],
  ['M336 186C348 238 320 298 334 352', 1.6],
  ['M426 186C416 240 444 294 430 351', 2],
  ['M476 186C488 232 462 292 478 352', 1.6],
  ['M526 186C516 244 542 286 530 350', 2.4],
  ['M566 186C578 232 554 288 568 351', 1.6],
];

// Fine hair roots branching off the main ones.
const hairs = [
  'M205 262C214 270 222 276 224 292',
  'M292 270C302 278 306 290 304 304',
  'M434 276C424 286 420 296 422 310',
  'M530 268C540 278 546 290 544 306',
];

export function NotFoundArt() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('[data-nf=digits]', { opacity: 0, y: 14, duration: 0.9 })
          .fromTo(
            '[data-nf=ground]',
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' },
            0.15,
          )
          .fromTo(
            '[data-nf=root]',
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: 0.09 },
            0.35,
          )
          .fromTo(
            '[data-nf=lost]',
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
            0.8,
          )
          .fromTo(
            '[data-nf=hair]',
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out', stagger: 0.12 },
            1.5,
          )
          .from(
            '[data-nf=tip]',
            { opacity: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.4 },
            1.7,
          )
          .from('[data-nf=rise]', { opacity: 0, y: 16, duration: 0.8, stagger: 0.08 }, 0.9)
          .add(() => {
            gsap.to('[data-nf=sway]', {
              rotation: 3.5,
              transformBox: 'fill-box',
              transformOrigin: '50% 0%',
              duration: 2.2,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            });
          }, 2);
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="flex w-full flex-col items-center px-6">
      <svg
        viewBox="0 0 760 380"
        role="img"
        aria-label="The number 404, with roots hanging from the digits. One root in the middle stops short of the ground."
        className="w-full max-w-[720px] text-ink"
        style={{ maxHeight: '48dvh' }}
      >
        <text
          data-nf="digits"
          x="380"
          y="190"
          textAnchor="middle"
          fill="currentColor"
          style={{
            fontFamily: 'var(--font-literata), serif',
            fontSize: 230,
            letterSpacing: '-0.04em',
          }}
        >
          404
        </text>

        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path
            data-nf="ground"
            d="M40 354C160 348 260 358 380 353S620 349 720 354"
            pathLength="1"
            strokeDasharray="1"
            opacity="0.4"
          />
          {roots.map(([d, w]) => (
            <path
              key={d}
              data-nf="root"
              d={d}
              strokeWidth={w}
              pathLength="1"
              strokeDasharray="1"
              opacity="0.85"
            />
          ))}
          {hairs.map((d) => (
            <path
              key={d}
              data-nf="hair"
              d={d}
              strokeWidth="1.1"
              pathLength="1"
              strokeDasharray="1"
              opacity="0.55"
            />
          ))}
          <g data-nf="sway">
            <path
              data-nf="lost"
              d="M380 186C388 214 372 246 382 276"
              strokeWidth="1.8"
              pathLength="1"
              strokeDasharray="1"
              opacity="0.85"
            />
            <circle data-nf="tip" cx="382" cy="280" r="3.4" fill="currentColor" stroke="none" />
          </g>
        </g>
      </svg>

      <div className="mt-[clamp(12px,3dvh,32px)] flex flex-col items-center gap-3 text-center">
        <h1
          data-nf="rise"
          className="font-serif text-[clamp(30px,5.4dvh,40px)] leading-[1.05] tracking-[-0.02em]"
        >
          This branch doesn't reach the ground
        </h1>
      </div>

      <div data-nf="rise" className="mt-[clamp(16px,3.4dvh,32px)]">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="grid h-12 place-items-center rounded-full bg-accent px-7 text-base font-medium text-accent-ink transition-colors duration-200 hover:bg-accent-hover"
        >
          Go back
        </button>
      </div>
    </div>
  );
}
