'use client';

import React from 'react';
import { CardDrawResult, OracleCardData } from '@/types/oracle';
import { CardFlip } from '@/components/Cards/CardFlip';

interface OneCardSpreadProps {
  cards: CardDrawResult[];
  onFlipCard: (index: number) => void;
  onCardClick?: (card: OracleCardData) => void;
}

export const OneCardSpread: React.FC<OneCardSpreadProps> = ({
  cards,
  onFlipCard,
  onCardClick,
}) => {
  const item = cards[0];
  if (!item) return null;

  return (
    <div className="w-full flex flex-col items-center gap-3 py-3">
      {/* Position Header */}
      <div className="text-center mb-1">
        <span className="text-sm font-serif font-black text-amber-950 block tracking-widest uppercase">
          {item.position.title}
        </span>
        <span className="text-xs text-stone-500 font-serif block mt-0.5 font-medium">
          {item.position.description || '万象归真 · 显化核心神谕'}
        </span>
      </div>

      {/* Centerpiece One Card */}
      <div
        className="w-52 sm:w-60 cursor-pointer transition-transform hover:scale-102 my-1"
        onClick={() => {
          if (item.isRevealed && onCardClick) {
            onCardClick(item.card);
          }
        }}
      >
        <CardFlip
          card={item.card}
          isRevealed={item.isRevealed}
          onFlip={() => onFlipCard(0)}
          size="lg"
        />
      </div>

      {/* Quick Summary under revealed card */}
      {item.isRevealed && (
        <div className="mt-2 text-center animate-fade-in space-y-1 w-full max-w-xs bg-white/70 p-3 rounded-2xl border border-amber-300/60 shadow-2xs">
          <span className="text-base font-serif font-black text-stone-900 block">
            {item.card.cardName || item.card.name}
          </span>
          <span className="text-xs text-amber-900 font-serif font-bold block">
            【{item.card.archetype}】 · {item.card.realm} ({item.card.rank})
          </span>
          <p className="text-[11px] text-stone-600 font-serif leading-relaxed mt-1">
            {item.card.keywords.join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
};
