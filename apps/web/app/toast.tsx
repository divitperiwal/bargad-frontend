'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

/**
 * A short message for problems that aren't about a field: the server being
 * unreachable, too many attempts. Sits on the form side, closes itself.
 */
export function Toast({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-8 z-30 flex justify-center px-4 lg:left-auto lg:w-[48.8%]"
    >
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="pointer-events-auto flex max-w-[460px] items-start gap-3 rounded-2xl bg-ink px-5 py-3.5 text-sm text-bg shadow-lg"
          >
            <span aria-hidden="true" className="font-mono font-medium">
              !
            </span>
            <span className="flex-1">{message}</span>
            <button
              type="button"
              onClick={onClose}
              className="-my-1 -mr-2 h-8 rounded-full px-2 font-medium opacity-70 transition-opacity hover:opacity-100"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
