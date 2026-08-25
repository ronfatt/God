'use client';

import React from 'react';
import { CardDrawResult, OracleCardData } from '@/types/oracle';
import { CardFlip } from '@/components/Cards/CardFlip';

interface ThreeCardSpreadProps {
  cards: CardDrawResult[];
  onFlipCard: (index: number) => void;
  onCardClick?: (card: OracleCardData) => void;
}

export const ThreeCardSpread: React.FC<ThreeCardSpreadProps> = ({
  cards,
  onFlipCard,
  onCardClick,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-4 py-2">
      {/* 3 Cards Horizontal Grid */}
      <div className="w-full grid grid-cols-3 gap-2 px-1">
        {cards.map((item, idx) => {
          return (
            <div key={item.position.id} className="flex flex-col items-center">
              {/* Position Header */}
              <div className="text-center mb-1.5">
                <span className="text-[11px] font-serif font-black text-amber-900 block">
                  {item.position.title.split(' · ')[0]}
                </span>
                <span className="text-[9px] text-stone-500 font-serif block -mt-0.5">
                  {item.position.title.split(' · ')[1]}
                </span>
              </div>

              {/* Card Container with Flip */}
              <div
                className="w-full"
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
                />
              </div>

              {/* Quick Card Summary if Revealed */}
              {item.isRevealed && (
                <div className="mt-1.5 text-center animate-fade-in">
                  <span className="text-[10px] font-serif font-black text-stone-900 block truncate">
                    {item.card.name}
                  </span>
                  <span className="text-[8.5px] text-amber-800 font-serif font-medium">
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
