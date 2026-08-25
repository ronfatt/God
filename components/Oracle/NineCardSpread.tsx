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
                    'text-[10px] font-serif font-bold block truncate',
                    isCenterCard ? 'text-amber-300 font-extrabold' : 'text-amber-300/80'
                  )}
                >
                  {item.position.title}
                </span>
              </div>

              {/* Card Container with Center Golden Breathing Light */}
              <div
                className={cn(
                  'w-full relative rounded-xl',
                  isCenterCard && 'animate-glow-breathe rounded-xl'
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
                  <span className="text-[9px] font-serif font-semibold text-neutral-200 block truncate">
                    {item.card.name}
                  </span>
                  <span className="text-[7.5px] text-amber-400/80 font-serif">
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
