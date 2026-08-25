'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/sound';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'init' | 'taiji' | 'text' | 'fade'>('init');

  useEffect(() => {
    // Stage 1: Taiji forming (0-400ms)
    const t1 = setTimeout(() => {
      setStage('taiji');
    }, 150);

    // Stage 2: Logo and slogan (600ms)
    const t2 = setTimeout(() => {
      setStage('text');
      sound.playZenChime(528, 1.8);
    }, 650);

    // Stage 3: Fade out & finish (1400ms)
    const t3 = setTimeout(() => {
      setStage('fade');
    }, 1500);

    const t4 = setTimeout(() => {
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 'fade' ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050608] text-center overflow-hidden"
    >
      {/* Background Ambient Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,rgba(0,0,0,0.95)_70%)]" />

      {/* Dual Yin-Yang Fish Forming Taiji */}
      <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
        {/* Outer Golden Ring */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 360 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2 border-amber-400/40 shadow-[0_0_25px_rgba(212,175,55,0.4)]"
        />

        {/* Inner Taiji */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 720 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl text-amber-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
        >
          ☯
        </motion.div>
      </div>

      {/* Title & Slogan */}
      <AnimatePresence>
        {(stage === 'text' || stage === 'fade') && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl font-serif font-bold tracking-[0.25em] text-gold-gradient mb-1">
              天机52
            </h1>
            <p className="text-[11px] font-sans tracking-[0.35em] text-amber-400/70 uppercase mb-3">
              TIANJI 52 · EASTERN ORACLE
            </p>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent my-2" />
            <p className="text-xs font-serif text-neutral-400 tracking-widest mt-1">
              天机不可尽泄 · 顺势而行
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
