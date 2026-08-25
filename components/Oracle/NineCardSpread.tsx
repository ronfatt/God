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
                isCenterCard && 'scale-[1.03] z-20'
              )}
            >
              {/* Position Header */}
              <div className="text-center mb-1 w-full">
                <span
                  className={cn(
                    'text-[10.5px] font-serif block truncate font-black',
                    isCenterCard ? 'text-amber-900 font-extrabold' : 'text-stone-700'
                  )}
                >
                  {item.position.title}
                </span>
              </div>

              {/* Card Container with Center Golden Breathing Light */}
              <div
                className={cn(
                  'w-full relative rounded-2xl cursor-pointer transition-transform hover:scale-102',
                  isCenterCard && 'animate-glow-breathe rounded-2xl shadow-lg ring-2 ring-amber-400/50'
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
                <div className="mt-1 text-center animate-fade-in space-y-0.5 w-full">
                  <span className="text-[10px] font-serif font-black text-stone-900 block truncate">
                    {item.card.cardName || item.card.name}
                  </span>
                  <span className="text-[8.5px] text-amber-800 font-serif font-bold block truncate">
                    【{item.card.archetype}】
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
