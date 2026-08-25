'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { ReadingAnalysis, OracleCardData } from '@/types/oracle';
import { Storage } from '@/lib/storage';
import { ORACLE_CARDS } from '@/data/cards';
import { ReadingSummary } from '@/components/Oracle/ReadingSummary';
import { OracleCard } from '@/components/Cards/OracleCard';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/sound';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [reading, setReading] = useState<ReadingAnalysis | null>(null);
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);

  useEffect(() => {
    const list = Storage.getHistory();
    if (id) {
      const found = list.find((item) => item.id === id);
      if (found) {
        setReading(found);
        return;
      }
    }
    // Default to most recent reading if exists
    if (list.length > 0) {
      setReading(list[0]);
    }
  }, [id]);

  if (!reading) {
    return (
      <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4">
        <TopHeader title="命盘结果" />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 glass-panel rounded-2xl border border-neutral-800">
          <span className="text-4xl mb-3">☯</span>
          <h2 className="text-base font-serif font-bold text-amber-200">暂无可显示的命盘结果</h2>
          <p className="text-xs text-neutral-400 font-serif mt-1">
            请先开启今日神谕抽牌
          </p>
          <button
            onClick={() => router.push('/question')}
            className="mt-4 px-6 py-2.5 rounded-full bg-amber-500 text-black font-serif font-bold text-xs"
          >
            开启抽牌 ✦
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4">
      <TopHeader title="天机命盘 · 释卦" showBack onBack={() => router.push('/history')} />

      {/* Cards array grid */}
      <div className="w-full">
        <span className="text-xs font-serif font-bold text-neutral-300 mb-2 block">
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
      <ReadingSummary reading={reading} />

      {/* Actions */}
      <div className="pt-4 flex flex-col gap-2.5">
        <button
          onClick={() => {
            sound.playCardSelect();
            router.push('/question');
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>问另一事 · 开启新神谕</span>
        </button>
      </div>

      <CardDetailModal
        card={modalCard}
        onClose={() => setModalCard(null)}
      />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-amber-300">正在推演天机...</div>}>
      <ResultContent />
    </Suspense>
  );
}
