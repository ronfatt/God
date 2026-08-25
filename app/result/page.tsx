'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { OracleCardData } from '@/types/oracle';
import { Storage } from '@/lib/storage';
import { ORACLE_CARDS } from '@/data/cards';
import { ReadingSummary } from '@/components/Oracle/ReadingSummary';
import { OracleCard } from '@/components/Cards/OracleCard';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { analyzeCards } from '@/lib/readingEngine';
import { IntelligenceReadingResult } from '@/intelligence';
import { RotateCcw } from 'lucide-react';
import { sound } from '@/lib/sound';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [reading, setReading] = useState<IntelligenceReadingResult | null>(null);
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);

  useEffect(() => {
    const list = Storage.getHistory();
    let rawReading = null;
    if (id) {
      rawReading = list.find((item) => item.id === id);
    } else if (list.length > 0) {
      rawReading = list[0];
    }

    if (rawReading) {
      const cardDataList = rawReading.cards
        .map((c) => ORACLE_CARDS.find((card) => card.id === c.cardId))
        .filter((c): c is OracleCardData => !!c);

      const rehydrated = analyzeCards(cardDataList, rawReading.question, rawReading.category, rawReading.spreadType);
      setReading(rehydrated);
    }
  }, [id]);

  const handleFollowUp = (questionText: string, cardCount: 1 | 3) => {
    sound.playCardSelect();
    router.push(`/draw?q=${encodeURIComponent(questionText)}&spread=${cardCount === 1 ? 'three' : 'three'}`);
  };

  if (!reading) {
    return (
      <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
        <TopHeader title="命盘结果" />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 glass-panel rounded-3xl border border-amber-300 shadow-sm">
          <span className="text-4xl mb-3 text-amber-700">☯</span>
          <h2 className="text-base font-serif font-bold text-stone-900">暂无可显示的命盘结果</h2>
          <p className="text-xs text-stone-500 font-serif mt-1">
            请先开启今日神谕抽牌
          </p>
          <button
            onClick={() => router.push('/question')}
            className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-serif font-black text-xs shadow-xs"
          >
            开启抽牌 ✦
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="天机命盘 · 释卦" showBack onBack={() => router.push('/history')} />

      {/* Cards array grid */}
      <div className="w-full">
        <span className="text-xs font-serif font-bold text-stone-900 mb-2 block">
          本次卦象圣相 ({reading.cards.length} 张)
        </span>
        <div className="grid grid-cols-3 gap-2">
          {reading.cards.map((c, idx) => {
            const cardData = ORACLE_CARDS.find((card) => card.id === c.cardId);
            if (!cardData) return null;
            return (
              <div
                key={idx}
                onClick={() => setModalCard(cardData)}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <OracleCard card={cardData} size="sm" isCompact />
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Reading Summary */}
      <ReadingSummary reading={reading} onSelectFollowUp={handleFollowUp} />

      {/* Actions */}
      <div className="pt-4 flex flex-col gap-2.5">
        <button
          onClick={() => {
            sound.playCardSelect();
            router.push('/question');
          }}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-serif font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>问另一事 · 重新起卦</span>
        </button>
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={modalCard}
        onClose={() => setModalCard(null)}
      />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-amber-800 font-serif text-xs">正在载入命盘...</div>}>
      <ResultContent />
    </Suspense>
  );
}
