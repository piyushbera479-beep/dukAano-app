import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AndroidToastProps {
  message: string | null;
  onClear: () => void;
  duration?: number;
}

export const AndroidToast: React.FC<AndroidToastProps> = ({ 
  message, 
  onClear, 
  duration = 2000 
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClear();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClear]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-[90vw]"
        >
          <div className="bg-neutral-900/95 dark:bg-neutral-800/95 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl border border-neutral-700/50 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
