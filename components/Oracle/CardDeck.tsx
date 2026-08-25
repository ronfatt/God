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
  const [deck, setDeck] = useState<OracleCardData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(25);
  const [selectedCards, setSelectedCards] = useState<OracleCardData[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shuffled = [...ORACLE_CARDS].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  }, []);

  const handleCardClick = (card: OracleCardData, index: number) => {
    sound.playCardSelect();
    setSelectedIndex(index);

    const isAlreadySelected = selectedCards.some((c) => c.id === card.id);
    if (isAlreadySelected) {
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
          <span className="text-xs text-stone-500 font-serif font-medium">
            请凭直觉触摸牌组抽取
          </span>
          <span className="text-sm font-serif font-black text-amber-900">
            已抽取 <span className="text-amber-700 font-mono text-base font-black">{selectedCards.length}</span> / {requiredCount} 张
          </span>
        </div>

        {selectedCards.length < requiredCount && (
          <button
            onClick={handleAutoSelect}
            className="px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-serif font-bold hover:bg-amber-100 flex items-center gap-1 shadow-xs active:scale-95 transition-all"
          >
            <Sparkles className="w-3 h-3 text-amber-700" />
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
                  'relative w-24 h-36 cursor-pointer flex-shrink-0 transition-all duration-300 rounded-2xl group',
                  isSelected && 'z-30 shadow-[0_10px_25px_rgba(212,175,55,0.45)]'
                )}
                style={{
                  marginRight: '-12px',
                }}
              >
                <CardBack
                  className={cn(
                    'w-full h-full shadow-md transition-all',
                    isSelected
                      ? 'border-2 border-amber-500 ring-2 ring-amber-400/60'
                      : 'hover:border-amber-400'
                  )}
                  isGlowing={isSelected}
                />

                {/* Selected Order Badge */}
                {isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black font-mono text-xs flex items-center justify-center shadow-md border-2 border-white">
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
                  'w-8 h-12 rounded-lg border flex items-center justify-center transition-all duration-300',
                  card
                    ? 'border-amber-500 bg-amber-100/90 text-amber-900 text-xs font-mono font-black shadow-xs'
                    : 'border-stone-200 bg-stone-100/60 text-stone-400 text-[10px]'
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
            'w-full py-4 rounded-2xl font-serif font-black text-sm flex items-center justify-center gap-2 tracking-widest transition-all duration-300',
            selectedCards.length === requiredCount
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-[0.98]'
              : 'bg-stone-200/80 border border-stone-300 text-stone-400 cursor-not-allowed'
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
