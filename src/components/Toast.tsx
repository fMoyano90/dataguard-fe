"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message?: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-2xl bg-gray-900 px-4 py-3 text-body-sm font-bold leading-6 text-white shadow-[0_20px_60px_rgba(7,17,31,0.3)]"
          exit={{ opacity: 0, y: 10 }}
          initial={{ opacity: 0, y: 12 }}
          role="status"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
