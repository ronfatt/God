'use client';

import React, { useState, useEffect } from 'react';
import { OracleCardData } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';
import { CardFlip } from '@/components/Cards/CardFlip';
import { Storage } from '@/lib/storage';
import { Sparkles, RefreshCw, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const DailyOneCard: React.FC = () => {
  const [dailyCard, setDailyCard] = useState<OracleCardData>(ORACLE_CARDS[11]); // Default Guanyin
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const saved = Storage.getDailyCard();
    const today = new Date().toISOString().slice(0, 10);

    if (saved && saved.date === today) {
      const found = ORACLE_CARDS.find((c) => c.id === saved.cardId);
      if (found) {
        setDailyCard(found);
        setIsRevealed(true);
      }
    } else {
      const dayNum = new Date().getDate();
      const card = ORACLE_CARDS[dayNum % ORACLE_CARDS.length];
      setDailyCard(card);
      setIsRevealed(false);
    }
  }, []);

  const handleFlip = () => {
    setIsRevealed(true);
    Storage.setDailyCard(dailyCard.id);
    Storage.addCollectedCards([dailyCard.id]);
  };

  const handleRedraw = () => {
    const randomCard = ORACLE_CARDS[Math.floor(Math.random() * ORACLE_CARDS.length)];
    setDailyCard(randomCard);
    setIsRevealed(false);
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-4 border border-amber-400/40 shadow-sm flex flex-col items-center relative overflow-hidden">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
          <h3 className="text-sm font-serif font-bold text-stone-900 tracking-wider">
            今日一牌 · 灵犀感应
          </h3>
        </div>
        {isRevealed && (
          <button
            onClick={handleRedraw}
            className="text-[11px] text-stone-500 hover:text-amber-800 flex items-center gap-1 transition-colors font-serif font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            <span>重新感应</span>
          </button>
        )}
      </div>

      {/* 3D Flip Card Container */}
      <div className="my-2 w-44 flex justify-center">
        <CardFlip
          card={dailyCard}
          isRevealed={isRevealed}
          onFlip={handleFlip}
          size="md"
        />
      </div>

      {/* Revealed Message */}
      {isRevealed && (
        <div className="w-full mt-3 pt-3 border-t border-amber-900/10 flex flex-col items-center text-center animate-fade-in">
          <div className="flex items-center gap-1.5 text-xs text-amber-900 font-serif font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
            <span>【{dailyCard.cardName || dailyCard.name} · {dailyCard.archetype}】{dailyCard.keywords.join(' · ')}</span>
          </div>
          <p className="text-xs text-stone-700 font-serif italic max-w-xs leading-relaxed px-2">
            “{dailyCard.oracle || dailyCard.oracleMessage}”
          </p>

          <Link
            href={`/cards/${dailyCard.id}`}
            className="mt-2 text-[11px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 transition-colors font-serif underline decoration-amber-500/40 underline-offset-2"
          >
            <BookOpen className="w-3 h-3" />
            <span>查看完整神谕密语与五行解说</span>
          </Link>
        </div>
      )}
    </div>
  );
};
