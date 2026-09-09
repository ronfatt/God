'use client';

import React, { useState, useEffect } from 'react';
import { OracleCardData } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';
import { CardFlip } from '@/components/Cards/CardFlip';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { Sparkles, RefreshCw, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const DailyOneCard: React.FC = () => {
  const [dailyCard, setDailyCard] = useState<OracleCardData>(ORACLE_CARDS[11]); // Default Guanyin
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

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
    sound.playCardSelect();
    Storage.setDailyCard(dailyCard.id);
    Storage.addCollectedCards([dailyCard.id]);
  };

  const handleRedraw = () => {
    setIsSpinning(true);
    sound.playShuffleSound();
    setIsRevealed(false);

    setTimeout(() => {
      const randomCard = ORACLE_CARDS[Math.floor(Math.random() * ORACLE_CARDS.length)];
      setDailyCard(randomCard);
      setIsSpinning(false);
      setTimeout(() => {
        setIsRevealed(true);
        sound.playZenChime(528, 1.0);
        Storage.setDailyCard(randomCard.id);
        Storage.addCollectedCards([randomCard.id]);
      }, 350);
    }, 300);
  };

  return (
    <div className="w-full glass-panel-gold rounded-3xl p-5 border-2 border-amber-400/60 shadow-[0_10px_35px_rgba(180,140,50,0.14)] flex flex-col items-center relative overflow-hidden">
      {/* Mystic Golden Background Halo */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-[0_0_8px_#D4AF37] animate-pulse" />
          <h3 className="text-sm font-serif font-black text-amber-950 tracking-wider">
            今日一牌 · 灵犀感应
          </h3>
        </div>

        {/* Prominent Header Redraw Button */}
        {isRevealed && (
          <button
            onClick={handleRedraw}
            className="text-xs text-amber-950 hover:text-stone-950 font-serif font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 border border-amber-400 shadow-xs hover:shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-800 ${isSpinning ? 'animate-spin' : ''}`} />
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

      {/* Revealed Message & Action Bar */}
      {isRevealed && (
        <div className="w-full mt-3 pt-3 border-t border-amber-900/10 flex flex-col items-center text-center animate-fade-in space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-900 font-serif font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
            <span>【{dailyCard.cardName || dailyCard.name} · {dailyCard.archetype}】{dailyCard.keywords.join(' · ')}</span>
          </div>

          <p className="text-xs text-stone-700 font-serif italic max-w-xs leading-relaxed px-2 bg-white/50 py-2 rounded-2xl border border-amber-200/50">
            “{dailyCard.oracle || dailyCard.oracleMessage}”
          </p>

          {/* Primary Action Button */}
          <div className="w-full space-y-2 pt-1">
            <Link
              href={`/draw?category=general&q=${encodeURIComponent('今日一牌 · 灵犀定数')}&spread=one`}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-xs sm:text-sm hover:shadow-md transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98 border border-amber-300"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>起卦推演此牌 · 洞悉天地定数</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-950" />
            </Link>

            {/* Secondary Actions: 重新感应 + 典籍 */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                type="button"
                onClick={handleRedraw}
                className="py-2.5 px-3 rounded-2xl bg-amber-100/80 hover:bg-amber-200/90 border border-amber-300/90 text-amber-950 text-xs font-serif font-black transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-800 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>重新感应换牌</span>
              </button>

              <Link
                href={`/cards/${dailyCard.id}`}
                className="py-2.5 px-3 rounded-2xl bg-white/90 hover:bg-amber-50/80 border border-stone-200 hover:border-amber-300 text-stone-800 text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>查看本尊典籍</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

