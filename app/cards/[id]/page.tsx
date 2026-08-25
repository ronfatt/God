'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { ORACLE_CARDS } from '@/data/cards';
import { OracleCard } from '@/components/Cards/OracleCard';
import { formatSuitInfo, formatElementColor } from '@/lib/utils';
import { Sparkles, Heart, Briefcase, Coins, Compass, Sun, Moon, ArrowLeft } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function CardLoreDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const card = ORACLE_CARDS.find((c) => c.id === id) || ORACLE_CARDS[0];
  const suitInfo = formatSuitInfo(card.suit);
  const elementStyle = formatElementColor(card.element);

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4">
      <TopHeader title={card.cardName} showBack onBack={() => router.push('/cards')} />

      {/* Main Card Hero Display */}
      <div className="w-full flex justify-center py-2">
        <div className="w-56 shadow-2xl">
          <OracleCard card={card} size="lg" />
        </div>
      </div>

      {/* Oracle Message Banner */}
      <div className="p-4 rounded-2xl glass-panel border border-amber-500/30">
        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-serif font-bold mb-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>神谕天机密语</span>
        </div>
        <p className="text-sm text-neutral-200 font-serif italic leading-relaxed">
          “{card.oracle}”
        </p>
      </div>

      {/* Upright & Shadow Duality */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-emerald-500/20">
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-emerald-400 mb-1">
            <Sun className="w-4 h-4" />
            <span>顺势 · 正位</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {card.upright}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-purple-500/20">
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-purple-400 mb-1">
            <Moon className="w-4 h-4" />
            <span>考验 · 逆位</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {card.shadow}
          </p>
        </div>
      </div>

      {/* Three Realms Guidance */}
      <div className="glass-panel rounded-2xl p-4 border border-neutral-800 space-y-3">
        <h4 className="text-xs font-serif font-bold text-neutral-300">三界具体洞察</h4>

        <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-rose-500/20 flex items-start gap-2.5">
          <Heart className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-serif font-bold text-rose-300">感情 · 缘分</span>
            <p className="text-xs text-neutral-300 leading-relaxed mt-0.5">{card.love}</p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-emerald-500/20 flex items-start gap-2.5">
          <Briefcase className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-serif font-bold text-emerald-300">事业 · 功名</span>
            <p className="text-xs text-neutral-300 leading-relaxed mt-0.5">{card.career}</p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-amber-500/20 flex items-start gap-2.5">
          <Coins className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-serif font-bold text-amber-300">财富 · 资产</span>
            <p className="text-xs text-neutral-300 leading-relaxed mt-0.5">{card.wealth}</p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => {
          sound.playCardSelect();
          router.push('/cards');
        }}
        className="w-full py-3.5 rounded-2xl bg-neutral-900 border border-neutral-700 text-neutral-300 font-serif text-sm flex items-center justify-center gap-2 hover:text-amber-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>返回神谕图鉴</span>
      </button>
    </div>
  );
}
