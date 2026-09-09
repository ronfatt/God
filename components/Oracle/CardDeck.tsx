'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OracleCardData } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';
import { CardBack } from '@/components/Cards/CardBack';
import { sound } from '@/lib/sound';
import { Sparkles, Wand2, Check, ArrowRight } from 'lucide-react';
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
  const [selectedCards, setSelectedCards] = useState<OracleCardData[]>([]);
  const [isAutoSelecting, setIsAutoSelecting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shuffled = [...ORACLE_CARDS].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  }, []);

  const handleCardClick = (card: OracleCardData) => {
    if (isAutoSelecting) return;
    sound.playCardSelect();

    const isAlreadySelected = selectedCards.some((c) => c.id === card.id);
    if (isAlreadySelected) {
      setSelectedCards(selectedCards.filter((c) => c.id !== card.id));
    } else {
      if (selectedCards.length < requiredCount) {
        const nextSelected = [...selectedCards, card];
        setSelectedCards(nextSelected);
        if (nextSelected.length === requiredCount) {
          sound.playZenChime(528, 1.0);
        }
      }
    }
  };

  const handleConfirm = () => {
    if (selectedCards.length === requiredCount) {
      sound.playBassHit();
      onCardsSelected(selectedCards);
    }
  };

  // One-click intuitive auto draw
  const handleOneClickAutoDraw = () => {
    if (isAutoSelecting || deck.length === 0) return;
    setIsAutoSelecting(true);
    sound.playShuffleSound();

    // Pick requiredCount distinct cards
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, requiredCount);
    setSelectedCards(picked);

    setTimeout(() => {
      sound.playZenChime(528, 1.2);
    }, 200);

    setTimeout(() => {
      sound.playBassHit();
      onCardsSelected(picked);
    }, 600);
  };

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[460px] py-1 relative select-none space-y-3">
      {/* Top Section: Prompt & Status */}
      <div className="w-full px-2 text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-300/80 text-amber-950 text-xs font-serif font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>天机感应 · 直觉抽牌</span>
        </div>
        <p className="text-xs text-stone-500 font-serif">
          心诚则灵，可直接点击下方 <span className="text-amber-800 font-bold">一键抽卡</span>，或在牌组中随心选取
        </p>
      </div>

      {/* Heroic ONE-CLICK AUTO DRAW Button (放大强化“灵感随选”) */}
      <div className="w-full px-2">
        <motion.button
          type="button"
          onClick={handleOneClickAutoDraw}
          disabled={isAutoSelecting}
          whileTap={{ scale: 0.96 }}
          animate={{
            boxShadow: [
              '0 4px 20px rgba(217, 119, 6, 0.25)',
              '0 8px 30px rgba(217, 119, 6, 0.45)',
              '0 4px 20px rgba(217, 119, 6, 0.25)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className={cn(
            'w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-sm sm:text-base flex items-center justify-center gap-2.5 border-2 border-amber-300 cursor-pointer shadow-lg active:scale-98 transition-all',
            isAutoSelecting && 'opacity-85 pointer-events-none'
          )}
        >
          <Wand2 className={cn('w-5 h-5 text-stone-950', isAutoSelecting && 'animate-spin')} />
          <span className="tracking-wide">
            {isAutoSelecting ? '✨ 天机汇聚中...' : `灵感随选 · 一键抽取 ${requiredCount} 张神谕卡`}
          </span>
          <ArrowRight className="w-4 h-4 text-stone-950 shrink-0" />
        </motion.button>
      </div>

      {/* Manual Choice Divider */}
      <div className="w-full flex items-center gap-2 px-6">
        <div className="flex-1 h-[1px] bg-amber-200/80" />
        <span className="text-[11px] text-stone-400 font-serif">或 手动触摸牌组感应</span>
        <div className="flex-1 h-[1px] bg-amber-200/80" />
      </div>

      {/* 52 Cards 3D Cover Flow Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto py-4 px-4 flex items-center scrollbar-none no-scrollbar snap-x snap-mandatory perspective-1000"
        style={{
          scrollBehavior: 'smooth',
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <div className="flex items-center py-4 mx-auto min-w-max px-8">
          {deck.map((card) => {
            const isSelected = selectedCards.some((c) => c.id === card.id);
            const selectionOrder = selectedCards.findIndex((c) => c.id === card.id) + 1;

            return (
              <motion.div
                key={card.id}
                onClick={() => handleCardClick(card)}
                whileHover={{ y: -16, scale: 1.06 }}
                animate={{
                  y: isSelected ? -24 : 0,
                  scale: isSelected ? 1.08 : 1,
                }}
                transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'relative w-20 sm:w-24 cursor-pointer flex-shrink-0 transition-all duration-300 rounded-2xl group',
                  isSelected && 'z-30 shadow-[0_10px_25px_rgba(212,175,55,0.5)]'
                )}
                style={{
                  aspectRatio: '2/3',
                  marginRight: '-16px',
                }}
              >
                <CardBack
                  className={cn(
                    'w-full h-full shadow-md transition-all',
                    isSelected
                      ? 'border-2 border-amber-400 ring-2 ring-amber-300/60'
                      : 'hover:border-amber-400'
                  )}
                  isGlowing={isSelected}
                />

                {/* Selected Order Badge */}
                {isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black font-mono text-xs flex items-center justify-center shadow-lg border-2 border-white animate-bounce-short">
                    {selectionOrder}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Cards Mini Slots Preview */}
      <div className="w-full px-4">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: requiredCount }).map((_, idx) => {
            const card = selectedCards[idx];
            return (
              <div
                key={idx}
                className={cn(
                  'w-9 h-13 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 text-xs font-serif',
                  card
                    ? 'border-amber-500 bg-amber-100 text-amber-950 font-black shadow-xs ring-1 ring-amber-400/50 scale-105'
                    : 'border-stone-200 bg-stone-100/70 text-stone-400'
                )}
              >
                {card ? (
                  <Check className="w-4 h-4 text-amber-800 stroke-[3]" />
                ) : (
                  <span className="text-[10px] text-stone-400">0{idx + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Manual Confirmation Action */}
      <div className="w-full px-2 pt-1">
        <button
          onClick={handleConfirm}
          disabled={selectedCards.length !== requiredCount || isAutoSelecting}
          className={cn(
            'w-full py-3 rounded-2xl font-serif font-black text-xs sm:text-sm flex items-center justify-center gap-2 tracking-wide transition-all duration-300 shadow-md',
            selectedCards.length === requiredCount
              ? 'bg-amber-100 border-2 border-amber-400 text-amber-950 shadow-sm hover:bg-amber-200 active:scale-[0.98] cursor-pointer'
              : 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed shadow-none'
          )}
        >
          <Sparkles className={cn('w-4 h-4', selectedCards.length === requiredCount && 'text-amber-800')} />
          <span>
            {selectedCards.length === requiredCount
              ? `确认手动抽取 (${selectedCards.length}/${requiredCount}) · 进入显圣`
              : `已选 (${selectedCards.length}/${requiredCount}) · 亦可直接点击上方一键抽取`}
          </span>
        </button>
      </div>
    </div>
  );
};

