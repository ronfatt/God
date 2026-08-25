'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/lib/sound';
import { Scissors, Check, RefreshCw } from 'lucide-react';

interface CutDeckAnimationProps {
  onCutComplete: (cutPileIndex: number) => void;
}

export const CutDeckAnimation: React.FC<CutDeckAnimationProps> = ({ onCutComplete }) => {
  const [selectedPile, setSelectedPile] = useState<number | null>(null);
  const [isMerging, setIsMerging] = useState(false);

  const handleSelectPile = (index: number) => {
    sound.playCardSelect();
    setSelectedPile(index);
    setIsMerging(true);

    setTimeout(() => {
      sound.playBassHit();
      onCutComplete(index);
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 space-y-6 select-none">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-serif font-bold shadow-xs">
          <Scissors className="w-3.5 h-3.5 text-amber-700 rotate-90" />
          <span>天机定序 · 请截取一叠牌堆</span>
        </div>
        <p className="text-xs text-stone-500 font-serif">
          随顺直觉，点击选择你感应最强的一叠牌组以完成定卦
        </p>
      </div>

      {/* 3 Split Deck Piles */}
      <div className="flex items-center justify-center gap-4 py-4 relative">
        {[0, 1, 2].map((pileIdx) => {
          const pileNames = ['上叠 · 顺承天时', '中叠 · 执中秉心', '下叠 · 潜龙生发'];
          const isSelected = selectedPile === pileIdx;

          return (
            <motion.div
              key={pileIdx}
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: isSelected ? -20 : isMerging ? 40 : 0,
                opacity: isMerging && !isSelected ? 0.3 : 1,
                scale: isSelected ? 1.08 : 1,
              }}
              whileHover={{ scale: isMerging ? 1 : 1.05, y: -8 }}
              onClick={() => !isMerging && handleSelectPile(pileIdx)}
              className={`w-24 h-36 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between p-2.5 relative overflow-hidden bg-gradient-to-b from-[#241F1A] via-[#1C1814] to-[#12100D] shadow-lg ${
                isSelected
                  ? 'border-amber-400 shadow-[0_10px_25px_rgba(212,175,55,0.45)]'
                  : 'border-amber-500/30 hover:border-amber-400'
              }`}
            >
              {/* Stack effect layers */}
              <div className="absolute -top-1 left-2 right-2 h-1 bg-amber-400/25 rounded-t-md border-t border-amber-300/40 pointer-events-none" />
              <div className="absolute -top-2 left-3 right-3 h-1 bg-amber-400/15 rounded-t-md border-t border-amber-300/20 pointer-events-none" />

              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-amber-400/10 pointer-events-none">
                ☯
              </div>

              <span className="text-[10px] font-mono text-amber-300 font-bold">
                PILE 0{pileIdx + 1}
              </span>

              <div className="text-center space-y-0.5">
                <span className="text-[11px] font-serif font-extrabold text-amber-100 block">
                  {pileNames[pileIdx].split(' · ')[0]}
                </span>
                <span className="text-[9px] text-amber-200/70 font-serif block">
                  {pileNames[pileIdx].split(' · ')[1]}
                </span>
              </div>

              <div className="flex justify-center">
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-amber-400/40" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {isMerging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-amber-800 font-serif font-bold flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />
          <span>正在聚气合一，开启神谕...</span>
        </motion.div>
      )}
    </div>
  );
};
