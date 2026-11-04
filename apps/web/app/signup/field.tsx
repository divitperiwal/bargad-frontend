'use client';

import { AnimatePresence, motion } from 'motion/react';

export const control =
  'h-[var(--ctl)] w-full rounded-xl border bg-surface px-4 text-base text-ink placeholder:text-ink-3 transition-colors duration-200 focus:border-ink';

export function Message({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          key="error"
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <span className="flex items-start gap-2 border-l-2 border-ink pl-3 text-sm text-ink">
            <span aria-hidden="true" className="font-mono font-medium">
              !
            </span>
            {error}
          </span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-anim="rise" className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-ink-2">
        {label}
      </label>
      {children}
      <Message id={id} error={error} />
    </div>
  );
}
