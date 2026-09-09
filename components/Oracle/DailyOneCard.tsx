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
    <div className="w-full glass-panel-gold rounded-3xl p-5 border-2 border-amber-400/60 shadow-[0_10px_35px_rgba(180,140,50,0.14)] flex flex-col items-center relative overflow-hidden">
      {/* Mystic Golden Background Halo */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 shadow-[0_0_8px_#D4AF37]" />
          <h3 className="text-sm font-serif font-black text-amber-950 tracking-wider">
            今日一牌 · 灵犀感应
          </h3>
        </div>
        {isRevealed && (
          <button
            onClick={handleRedraw}
            className="text-[11px] text-amber-900/80 hover:text-amber-950 flex items-center gap-1 transition-colors font-serif font-bold px-2 py-0.5 rounded-full bg-amber-100/60 border border-amber-300/60 shadow-2xs"
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

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-amber-900/10 w-full">
            <Link
              href={`/draw?category=general&q=${encodeURIComponent('今日一牌 · 灵犀定数')}&spread=one`}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-serif font-black text-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>起卦推演此牌</span>
            </Link>

            <Link
              href={`/cards/${dailyCard.id}`}
              className="py-2 px-3 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-serif font-bold hover:bg-amber-50 transition-colors flex items-center justify-center gap-1 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>典籍</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
