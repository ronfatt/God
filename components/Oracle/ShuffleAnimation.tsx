'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/sound';
import { CardBack } from '@/components/Cards/CardBack';
import { Sparkles } from 'lucide-react';

interface ShuffleAnimationProps {
  onComplete: () => void;
}

export const ShuffleAnimation: React.FC<ShuffleAnimationProps> = ({ onComplete }) => {
  const [isShuffling, setIsShuffling] = useState(false);
  const [phase, setPhase] = useState<'ready' | 'scattering' | 'gathering' | 'done'>('ready');

  const startShuffle = () => {
    setIsShuffling(true);
    setPhase('scattering');
    sound.playShuffleSound();

    // After 1.1s, start gathering back
    setTimeout(() => {
      setPhase('gathering');
    }, 1100);

    // After 2.1s, complete
    setTimeout(() => {
      setPhase('done');
      sound.playZenChime(528, 1.2);
      onComplete();
    }, 2100);
  };

  // Generate 12 flying card silhouettes to create 52-card illusion without lag
  const cardsCount = 14;
  const cardIndices = Array.from({ length: cardsCount }, (_, i) => i);

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 min-h-[380px] relative overflow-hidden">
      {/* Mystic Background Golden Glow & Particle Field */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={
            isShuffling
              ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.6, 0.2],
                  rotate: [0, 180, 360],
                }
              : { scale: 1, opacity: 0.2 }
          }
          transition={{ duration: 2, repeat: isShuffling ? Infinity : 0 }}
          className="w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.25)_0%,transparent_70%)] blur-xl"
        />
      </div>

      {/* Center 3D Card Deck Arena */}
      <div className="relative w-40 h-56 flex items-center justify-center perspective-1000">
        {cardIndices.map((index) => {
          // Calculate scatter offsets based on index and phase
          const angle = (index / cardsCount) * 2 * Math.PI;
          const radius = phase === 'scattering' ? 110 + (index % 3) * 30 : 0;
          const scatterX = Math.cos(angle) * radius;
          const scatterY = Math.sin(angle) * (radius * 0.7);
          const rotateZ = phase === 'scattering' ? (index % 2 === 0 ? 35 : -35) * (index + 1) : index * 0.4;
          const rotateY = phase === 'scattering' ? (index % 3) * 60 : 0;

          return (
            <motion.div
              key={index}
              className="absolute w-36 h-52 preserve-3d"
              initial={{ x: 0, y: -index * 0.5, rotateZ: index * 0.4, scale: 1 }}
              animate={
                phase === 'scattering'
                  ? {
                      x: scatterX,
                      y: scatterY,
                      rotateZ: rotateZ,
                      rotateY: rotateY,
                      scale: 0.95,
                      filter: 'blur(0.5px)',
                    }
                  : phase === 'gathering'
                  ? {
                      x: 0,
                      y: -index * 0.5,
                      rotateZ: index * 0.4,
                      rotateY: 0,
                      scale: 1,
                      filter: 'blur(0px)',
                    }
                  : { x: 0, y: -index * 0.5, rotateZ: index * 0.4, scale: 1 }
              }
              transition={{
                duration: phase === 'scattering' ? 0.9 : 0.8,
                ease: phase === 'scattering' ? 'easeInOut' : [0.16, 1, 0.3, 1],
              }}
              style={{
                zIndex: phase === 'scattering' ? Math.floor(Math.random() * 20) : index,
              }}
            >
              <CardBack
                className="w-full h-full shadow-2xl border-amber-500/40"
                isGlowing={phase === 'gathering'}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Controls & Prompts */}
      <div className="mt-8 relative z-20 flex flex-col items-center">
        {phase === 'ready' && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={startShuffle}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-serif font-bold text-base shadow-[0_0_25px_rgba(212,175,55,0.6)] flex items-center gap-2 tracking-wider"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>开始洗牌 ✦ 聚灵</span>
          </motion.button>
        )}

        {isShuffling && phase !== 'done' && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-amber-300 font-serif text-sm tracking-widest animate-pulse">
              {phase === 'scattering' ? '天机聚散 · 乾坤流转...' : '神明感应 · 灵牌聚合...'}
            </span>
            <div className="w-36 h-1 rounded-full bg-neutral-800 overflow-hidden">
              <div className="h-full bg-amber-400 animate-shimmer" style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
