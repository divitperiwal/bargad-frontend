'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

const messages = [
  'Every trade at a price you approved',
  "All your family's brokers in one view",
  'Everyone stays in charge of their own account',
];

const ease = [0.22, 1, 0.36, 1] as const;

/** The panel's one line, faded in once when the page loads. */
export function Headline({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.p
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease, delay: 0.15 }}
      className={className}
    >
      Manage your family's wealth, together.
    </motion.p>
  );
}

/**
 * One short message at a time along the bottom of the panel, changing every
 * four seconds with a fade and a 10px rise. Three dashes show which one is
 * up. With reduced motion it shows the first message and stays still.
 */
export function RotatingMessages() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, [reduce]);

  const active = reduce ? 0 : i;

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="relative h-6 min-w-0 flex-1 overflow-hidden" aria-live="off">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease }}
            className="absolute inset-0 truncate text-[15px] leading-6 text-brand-line"
          >
            {messages[active]}
          </motion.p>
        </AnimatePresence>
      </div>
      {!reduce && (
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          {messages.map((m, n) => (
            <span
              key={m}
              className={`h-[3px] rounded-full transition-[width,background-color] duration-500 ease-[var(--ease)] ${
                n === active ? 'w-6 bg-white' : 'w-3 bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
