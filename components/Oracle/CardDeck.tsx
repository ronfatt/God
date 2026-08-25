'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OracleCardData } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';
import { CardBack } from '@/components/Cards/CardBack';
import { sound } from '@/lib/sound';
import { Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardDeckProps {
  requiredCount: number;
  onCardsSelected: (selectedCards: OracleCardData[]) => void;
}

export const CardDeck: React.FC<CardDeckProps> = ({
  requiredCount,
  onCardsSelected,
}) => {
  // Shuffle cards internally for honest randomness on each session
  const [deck, setDeck] = useState<OracleCardData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(25); // Center around middle card
  const [selectedCards, setSelectedCards] = useState<OracleCardData[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Deterministic or pseudo-random shuffle of the 52 cards
    const shuffled = [...ORACLE_CARDS].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  }, []);

  const handleCardClick = (card: OracleCardData, index: number) => {
    sound.playCardSelect();
    setSelectedIndex(index);

    const isAlreadySelected = selectedCards.some((c) => c.id === card.id);
    if (isAlreadySelected) {
      // Unselect
      setSelectedCards(selectedCards.filter((c) => c.id !== card.id));
    } else {
      if (selectedCards.length < requiredCount) {
        setSelectedCards([...selectedCards, card]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedCards.length === requiredCount) {
      sound.playBassHit();
      onCardsSelected(selectedCards);
    }
  };

  const handleAutoSelect = () => {
    // Help user auto-draw remaining cards randomly by intuition
    sound.playShuffleSound();
    const remainingCount = requiredCount - selectedCards.length;
    const available = deck.filter((c) => !selectedCards.some((s) => s.id === c.id));
    const randomPick = available.slice(0, remainingCount);
    const newSelection = [...selectedCards, ...randomPick];
    setSelectedCards(newSelection);
  };

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[460px] py-2 relative select-none">
      {/* Top Status & Instructions */}
      <div className="w-full px-4 flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400 font-serif">
            请凭直觉触摸牌组抽取
          </span>
          <span className="text-sm font-serif font-bold text-amber-200">
            已抽取 <span className="text-amber-400 font-mono text-base">{selectedCards.length}</span> / {requiredCount} 张
          </span>
        </div>

        {selectedCards.length < requiredCount && (
          <button
            onClick={handleAutoSelect}
            className="px-3 py-1 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-300 text-xs font-serif hover:border-amber-400 flex items-center gap-1 active:scale-95 transition-all"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>灵感随选</span>
          </button>
        )}
      </div>

      {/* 52 Cards 3D Cover Flow Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto py-8 px-8 flex items-center gap-[-20px] scrollbar-none no-scrollbar snap-x snap-mandatory perspective-1000"
        style={{
          scrollBehavior: 'smooth',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <div className="flex items-center gap-1.5 py-4 mx-auto min-w-max px-12">
          {deck.map((card, index) => {
            const isSelected = selectedCards.some((c) => c.id === card.id);
            const selectionOrder = selectedCards.findIndex((c) => c.id === card.id) + 1;
            const isCurrentFocus = selectedIndex === index;

            return (
              <motion.div
                key={card.id}
                onClick={() => handleCardClick(card, index)}
                whileHover={{ y: -16, scale: 1.06 }}
                animate={{
                  y: isSelected ? -24 : 0,
                  scale: isSelected ? 1.08 : 1,
                }}
                transition={{ duration: 0.25 }}
                className={cn(
                  'relative w-24 h-36 cursor-pointer flex-shrink-0 transition-all duration-300 rounded-lg group',
                  isSelected && 'z-30 shadow-[0_0_25px_rgba(212,175,55,0.7)]'
                )}
                style={{
                  marginRight: '-12px',
                }}
              >
                <CardBack
                  className={cn(
                    'w-full h-full shadow-lg transition-all',
                    isSelected
                      ? 'border-2 border-amber-300 ring-2 ring-amber-400/50'
                      : 'hover:border-amber-400/60'
                  )}
                  isGlowing={isSelected}
                />

                {/* Selected Order Badge */}
                {isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold font-mono text-xs flex items-center justify-center shadow-lg border border-white">
                    {selectionOrder}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Cards Mini Preview Bar */}
      <div className="w-full px-4 my-2">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: requiredCount }).map((_, idx) => {
            const card = selectedCards[idx];
            return (
              <div
                key={idx}
                className={cn(
                  'w-8 h-12 rounded border flex items-center justify-center transition-all duration-300',
                  card
                    ? 'border-amber-400 bg-amber-950/60 text-amber-300 text-xs font-mono font-bold shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                    : 'border-neutral-800 bg-neutral-900/40 text-neutral-600 text-[10px]'
                )}
              >
                {card ? idx + 1 : '☯'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Confirmation Action */}
      <div className="w-full px-4 mt-2">
        <button
          onClick={handleConfirm}
          disabled={selectedCards.length !== requiredCount}
          className={cn(
            'w-full py-3.5 rounded-2xl font-serif font-bold text-base flex items-center justify-center gap-2 tracking-widest transition-all duration-300',
            selectedCards.length === requiredCount
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black shadow-[0_0_25px_rgba(212,175,55,0.6)] active:scale-[0.98]'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-500 cursor-not-allowed'
          )}
        >
          <Sparkles className={cn('w-4 h-4', selectedCards.length === requiredCount && 'animate-spin-slow')} />
          <span>
            {selectedCards.length === requiredCount
              ? `确认抽取 · 步入神谕 (${selectedCards.length}/${requiredCount})`
              : `请选择 ${requiredCount - selectedCards.length} 张神谕卡`}
          </span>
        </button>
      </div>
    </div>
  );
};
