'use client';

import React, { useState, useEffect } from 'react';
import { TopHeader } from '@/components/Layout/TopHeader';
import { ReadingAnalysis, OracleCardData } from '@/types/oracle';
import { Storage } from '@/lib/storage';
import { ORACLE_CARDS } from '@/data/cards';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { ReadingSummary } from '@/components/Oracle/ReadingSummary';
import { Sparkles, Flame, Clock, Calendar, ArrowRight, ChevronRight, X } from 'lucide-react';
import { sound } from '@/lib/sound';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { analyzeCards } from '@/lib/readingEngine';
import { IntelligenceReadingResult } from '@/intelligence';

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<ReadingAnalysis[]>([]);
  const [user, setUser] = useState(Storage.getUser());
  const [selectedReading, setSelectedReading] = useState<IntelligenceReadingResult | null>(null);
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);

  useEffect(() => {
    const list = Storage.getHistory();
    setHistory(list);
    setUser(Storage.getUser());
  }, []);

  const handleOpenReading = (reading: ReadingAnalysis) => {
    sound.playCardSelect();
    const cardDataList = reading.cards
      .map((c) => ORACLE_CARDS.find((card) => card.id === c.cardId))
      .filter((c): c is OracleCardData => !!c);

    const rehydrated = analyzeCards(cardDataList, reading.question, reading.category, reading.spreadType);
    setSelectedReading(rehydrated);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="天机占验记录" />

      {/* Top Streak Header */}
      <div className="w-full glass-panel rounded-3xl p-4 border border-rose-300 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-300 flex items-center justify-center text-rose-600 shadow-xs">
            <Flame className="w-6 h-6 fill-rose-500/30 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-serif font-medium">天机连续记录</div>
            <div className="text-base font-serif font-black text-rose-900">
              {user.streak} Day Streak · 恒心通神
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-stone-500 font-serif">总占验</div>
          <div className="text-base font-mono font-black text-amber-800">
            {history.length || user.totalDraws} 次
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-serif text-stone-500 px-1">
          <span>往昔神谕明细</span>
          <span>共 {history.length} 条</span>
        </div>

        {history.length === 0 ? (
          <div className="w-full glass-panel rounded-3xl p-8 border border-amber-300 text-center flex flex-col items-center justify-center my-6 shadow-sm">
            <div className="w-20 h-28 rounded-2xl border-2 border-dashed border-amber-400 flex items-center justify-center text-3xl text-amber-700 mb-3 animate-float bg-amber-50/60">
              ☯
            </div>
            <h3 className="text-base font-serif font-bold text-stone-900">
              天机尚未开启
            </h3>
            <p className="text-xs text-stone-500 font-serif mt-1 max-w-xs leading-relaxed">
              您尚未进行任何神谕抽牌，开启您的第一次天机问事吧。
            </p>
            <button
              onClick={() => {
                sound.playCardSelect();
                router.push('/question');
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-serif font-black text-xs shadow-md active:scale-95 transition-all"
            >
              第一次问卦 ✦
            </button>
          </div>
        ) : (
          history.map((item) => {
            const spreadTitle =
              item.spreadType === 'three'
                ? '三才神谕'
                : item.spreadType === 'six'
                ? '六合命盘'
                : '九宫大阵';

            return (
              <div
                key={item.id}
                onClick={() => handleOpenReading(item)}
                className="w-full p-4 rounded-3xl glass-panel border border-stone-200 hover:border-amber-400 cursor-pointer transition-all duration-300 shadow-sm space-y-2.5 group hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {spreadTitle}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">
                      {item.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-800 text-xs font-mono font-bold">
                    <span>{item.overallScore} 分</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <h4 className="text-sm font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                  问：{item.question}
                </h4>

                <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    {item.cards.map((c, i) => {
                      const found = ORACLE_CARDS.find((card) => card.id === c.cardId);
                      return (
                        <span
                          key={i}
                          className="text-[10px] font-serif font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200"
                        >
                          {found ? found.cardName : c.cardId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reading Rehydration Modal */}
      <AnimatePresence>
        {selectedReading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReading(null)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative z-10 w-full max-w-[420px] max-h-[85vh] bg-[#FAF8F5] border-2 border-amber-400 rounded-3xl shadow-2xl overflow-y-auto p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-sm font-serif font-bold text-stone-900">
                  往昔神谕复盘
                </span>
                <button
                  onClick={() => setSelectedReading(null)}
                  className="p-1 text-stone-400 hover:text-stone-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ReadingSummary reading={selectedReading} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
