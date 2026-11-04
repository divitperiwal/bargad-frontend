'use client';

import { AnimatePresence, motion } from 'motion/react';

/** A text input. The focus ring is drawn inside the border so it never shifts layout. */
export const control =
  'h-[var(--ctl)] w-full rounded-xl border bg-surface px-4 text-base text-ink placeholder:text-ink-3 outline-none transition-[border-color,box-shadow] duration-200 ease-[var(--ease)] focus-visible:outline-none';

/** Classes for a control in its normal or error state. */
export function controlState(error?: string) {
  return error
    ? `${control} border-danger shadow-[inset_0_0_0_1px_var(--danger)] focus:border-danger focus:shadow-[inset_0_0_0_1px_var(--danger)]`
    : `${control} border-line-strong focus:border-brand focus:shadow-[inset_0_0_0_1px_var(--brand)]`;
}

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
          <span className="flex items-start gap-2 pt-0.5 text-sm leading-snug text-danger">
            <span
              aria-hidden="true"
              className="mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-danger text-[12px] font-bold leading-none text-surface"
            >
              !
            </span>
            {error}
          </span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-ink-2">
      {children}
    </label>
  );
}

export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  /** Shown under the control while there is no error. */
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-anim="rise" className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      <Message id={id} error={error} />
      {hint && !error && <p className="text-sm text-ink-3">{hint}</p>}
    </div>
  );
}
