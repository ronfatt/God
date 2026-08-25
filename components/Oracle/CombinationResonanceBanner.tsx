'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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
      className="w-full p-4 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border-2 border-amber-500 shadow-[0_10px_30px_rgba(212,175,55,0.25)] relative overflow-hidden text-center space-y-1 my-3 select-none"
    >
      {/* Animated Light Sweep */}
      <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent skew-x-12 animate-sweep pointer-events-none" />

      <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-amber-100 border border-amber-400/80 text-amber-900 text-[10px] font-serif font-bold shadow-xs">
        <Sparkles className="w-3 h-3 text-amber-700 fill-amber-700 animate-spin-slow" />
        <span>神谕组合共鸣 · MAJOR COMBINATION</span>
      </div>

      <h3 className="text-xl font-serif font-black text-gold-gradient tracking-widest drop-shadow-xs">
        【{combination.title}】
      </h3>

      <p className="text-xs text-stone-700 font-serif leading-relaxed px-4">
        {combination.meaning}
      </p>

      <div className="flex items-center justify-center gap-2 pt-1">
        {combination.cardNames.map((name, i) => (
          <span
            key={i}
            className="px-2.5 py-0.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-serif font-bold shadow-xs"
          >
            {name}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
