'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Flame } from 'lucide-react';
import { CombinationResult } from '@/intelligence/combinationEngine';

interface CombinationResonanceBannerProps {
  combination: CombinationResult;
}

export const CombinationResonanceBanner: React.FC<CombinationResonanceBannerProps> = ({ combination }) => {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.35 }}
      className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-neutral-900 to-amber-950/60 border-2 border-amber-400 shadow-[0_0_30px_rgba(212,175,55,0.4)] relative overflow-hidden text-center space-y-1 my-3 select-none"
    >
      {/* Animated Light Sweep */}
      <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent skew-x-12 animate-sweep pointer-events-none" />

      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-[10px] font-serif font-bold">
        <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-spin-slow" />
        <span>神谕组合共鸣 · MAJOR COMBINATION</span>
      </div>

      <h3 className="text-lg font-serif font-extrabold text-gold-gradient tracking-widest drop-shadow-md">
        【{combination.title}】
      </h3>

      <p className="text-xs text-amber-200 font-serif leading-relaxed px-4">
        {combination.meaning}
      </p>

      <div className="flex items-center justify-center gap-2 pt-1">
        {combination.cardNames.map((name, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded-lg bg-neutral-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-serif"
          >
            {name}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
