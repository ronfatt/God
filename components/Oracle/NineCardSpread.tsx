'use client';

import React from 'react';
import { CardDrawResult, OracleCardData } from '@/types/oracle';
import { CardFlip } from '@/components/Cards/CardFlip';
import { cn } from '@/lib/utils';

interface NineCardSpreadProps {
  cards: CardDrawResult[];
  onFlipCard: (index: number) => void;
  onCardClick?: (card: OracleCardData) => void;
}

export const NineCardSpread: React.FC<NineCardSpreadProps> = ({
  cards,
  onFlipCard,
  onCardClick,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-3 py-2">
      {/* 3x3 Nine Palaces Grid */}
      <div className="w-full grid grid-cols-3 gap-2 px-1">
        {cards.map((item, idx) => {
          const isCenterCard = idx === 4; // Center Palace (中宫)

          return (
            <div
              key={item.position.id}
              className={cn(
                'flex flex-col items-center relative transition-all duration-300',
                isCenterCard && 'scale-105 z-20'
              )}
            >
              {/* Position Header */}
              <div className="text-center mb-1">
                <span
                  className={cn(
                    'text-[10px] font-serif font-black block truncate',
                    isCenterCard ? 'text-amber-900 font-extrabold' : 'text-stone-700'
                  )}
                >
                  {item.position.title}
                </span>
              </div>

              {/* Card Container with Center Golden Breathing Light */}
              <div
                className={cn(
                  'w-full relative rounded-2xl',
                  isCenterCard && 'animate-glow-breathe rounded-2xl shadow-md'
                )}
                onClick={() => {
                  if (item.isRevealed && onCardClick) {
                    onCardClick(item.card);
                  }
                }}
              >
                <CardFlip
                  card={item.card}
                  isRevealed={item.isRevealed}
                  onFlip={() => onFlipCard(idx)}
                  size="sm"
                  showPrompt={!isCenterCard}
                />
              </div>

              {/* Quick Card Summary if Revealed */}
              {item.isRevealed && (
                <div className="mt-1 text-center animate-fade-in">
                  <span className="text-[9.5px] font-serif font-black text-stone-900 block truncate">
                    {item.card.name}
                  </span>
                  <span className="text-[8px] text-amber-800 font-serif font-medium">
                    {item.card.elementName} · {item.card.energyTitle}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
