import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SplashScreen as CapSplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { Sparkles, ShoppingBag, ShieldCheck, Heart, Utensils, Award } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  minDuration = 1600 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide native Capacitor splash screen quickly so our interactive React splash takes over smoothly
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      CapSplashScreen.hide().catch(() => {});
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-teal-900 via-teal-950 to-neutral-950 text-white p-6 select-none overflow-hidden"
          style={{
            paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2rem)',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)',
          }}
        >
          {/* Subtle Ambient Background Ring */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Pill / Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/40 border border-teal-700/50 backdrop-blur-sm text-[11px] font-semibold text-teal-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Local Indian Marketplace</span>
          </motion.div>

          {/* Center Brand Identity */}
          <div className="flex flex-col items-center text-center space-y-4 my-auto">
            {/* Logo Emblem Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-200 text-teal-950 flex items-center justify-center shadow-2xl shadow-amber-500/20 border-2 border-amber-200/60 ring-8 ring-teal-800/30">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl font-black tracking-tighter font-brand">D</span>
                  <div className="w-8 h-1 bg-teal-950 rounded-full mt-0.5" />
                </div>
              </div>

              {/* Orbiting Coin Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="absolute -top-1.5 -right-1.5 w-8 h-8 rounded-full bg-teal-700 border-2 border-amber-300 flex items-center justify-center text-amber-300 shadow-md"
              >
                <Award className="w-4 h-4" />
              </motion.div>
            </motion.div>

            {/* App Name */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-1"
            >
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-brand text-white">
                DUK<span className="text-amber-400">AANO</span>
              </h1>
              <p className="text-sm font-bold text-amber-200/90 tracking-wide">
                आपकी अपनी दुकान • Aapki Apni Dukaan
              </p>
            </motion.div>

            {/* Vertical Pillars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-neutral-300 flex-wrap max-w-xs"
            >
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <ShoppingBag className="w-3 h-3 text-emerald-400" />
                Grocery
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <Heart className="w-3 h-3 text-rose-400" />
                Care
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <Utensils className="w-3 h-3 text-amber-400" />
                Eats
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                SANIVOX
              </span>
            </motion.div>
          </div>

          {/* Bottom Loading Progress & Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="w-full max-w-xs flex flex-col items-center space-y-3"
          >
            {/* Animated progress track */}
            <div className="w-48 h-1 bg-teal-900/80 rounded-full overflow-hidden border border-teal-800/40">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-teal-300 rounded-full"
              />
            </div>
            
            <p className="text-[10px] text-teal-300/80 tracking-wider uppercase font-extrabold">
              100% Verified Local Merchants
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
