'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { OracleCardData } from '@/types/oracle';
import { CardBack } from '@/components/Cards/CardBack';
import { OracleCard } from '@/components/Cards/OracleCard';
import { sound } from '@/lib/sound';
import { formatSuitInfo } from '@/lib/utils';

interface CardFlipProps {
  card: OracleCardData;
  isRevealed: boolean;
  onFlip?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showPrompt?: boolean;
}

export const CardFlip: React.FC<CardFlipProps> = ({
  card,
  isRevealed,
  onFlip,
  disabled = false,
  className = 'w-full max-w-[240px]',
  size = 'md',
  showPrompt = true,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const suitInfo = formatSuitInfo(card.suit);

  const handleCardClick = (e: React.MouseEvent) => {
    if (disabled || isRevealed || isFlipping) return;

    setIsFlipping(true);
    sound.playCardFlip(card.suit);

    // Trigger suit-specific oriental particle burst
    try {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 38,
        spread: 60,
        origin: { x, y },
        colors: suitInfo.particleColor,
        ticks: 150,
        gravity: 0.8,
        scalar: 0.9,
        shapes: ['circle'],
      });
    } catch {
      // Fallback
    }

    if (onFlip) {
      onFlip();
    }

    setTimeout(() => {
      setIsFlipping(false);
    }, 800);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative perspective-1000 cursor-pointer select-none group ${className}`}
    >
      <motion.div
        className="w-full h-full preserve-3d"
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 1, 0.5, 1], // Smooth cinematic curve
        }}
      >
        {/* Front Face (Card Back before reveal) */}
        <div className="w-full h-full backface-hidden">
          <CardBack
            size={size}
            className="group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300"
          />

          {/* Hint Overlay */}
          {!isRevealed && showPrompt && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none">
              <span className="px-3 py-1 rounded-full text-[11px] font-serif bg-black/75 border border-amber-400/50 text-amber-300 backdrop-blur-md animate-pulse shadow-lg">
                点击翻牌 ✦
              </span>
            </div>
          )}
        </div>

        {/* Back Face (Revealed Oracle Card Face) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <OracleCard card={card} size={size} />
        </div>
      </motion.div>
    </div>
  );
};
