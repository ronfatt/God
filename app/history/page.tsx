'use client';

import React, { useState, useEffect } from 'react';
import { TopHeader } from '@/components/Layout/TopHeader';
import { ReadingAnalysis, OracleCardData } from '@/types/oracle';
import { Storage } from '@/lib/storage';
import { ORACLE_CARDS } from '@/data/cards';
import { CardBack } from '@/components/Cards/CardBack';
import { OracleCard } from '@/components/Cards/OracleCard';
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
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4">
      <TopHeader title="天机占验记录" />

      {/* Top Streak Header */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-rose-500/20 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Flame className="w-6 h-6 fill-rose-400/40 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-neutral-400 font-serif">天机连续记录</div>
            <div className="text-lg font-serif font-bold text-rose-300">
              {user.streak} Day Streak · 恒心通神
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-neutral-400 font-serif">总占验</div>
          <div className="text-base font-mono font-bold text-amber-300">
            {history.length || user.totalDraws} 次
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-serif text-neutral-400 px-1">
          <span>往昔神谕明细</span>
          <span>共 {history.length} 条</span>
        </div>

        {history.length === 0 ? (
          /* Empty State as requested in Prompt */
          <div className="w-full glass-panel rounded-2xl p-8 border border-neutral-800 text-center flex flex-col items-center justify-center my-6">
            <div className="w-20 h-28 rounded-xl border border-dashed border-amber-500/40 flex items-center justify-center text-2xl text-amber-400/50 mb-3 animate-float">
              ☯
            </div>
            <h3 className="text-base font-serif font-bold text-amber-200">
              天机尚未开启
            </h3>
            <p className="text-xs text-neutral-400 font-serif mt-1 max-w-xs">
              您尚未进行任何神谕抽牌，开启您的第一次天机问事吧。
            </p>
            <button
              onClick={() => {
                sound.playCardSelect();
                router.push('/question');
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-bold text-xs shadow-md active:scale-95 transition-all"
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
                : '九宫天命';

            const firstCard = ORACLE_CARDS.find((c) => c.id === item.cards[0]?.cardId);

            return (
              <div
                key={item.id}
                onClick={() => handleOpenReading(item)}
                className="w-full p-3.5 rounded-2xl glass-panel border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 active:scale-[0.98] cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* Card Mini Icon */}
                  <div className="w-10 h-14 rounded-lg bg-neutral-900 border border-amber-500/30 flex items-center justify-center text-xs font-serif font-bold text-amber-300 flex-shrink-0 shadow-sm">
                    {firstCard ? firstCard.name.charAt(0) : '☯'}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-bold text-neutral-100 group-hover:text-amber-300 transition-colors truncate max-w-[180px]">
                        {item.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-serif mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400">
                        {spreadTitle}
                      </span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Arrow */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-[9px] text-neutral-500 font-serif">命势指数</div>
                    <div className="text-sm font-mono font-bold text-amber-300">
                      {item.overallScore}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reading Detail Modal */}
      <AnimatePresence>
        {selectedReading && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReading(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-w-[440px] max-h-[88vh] bg-[#0c0e15] border-t border-amber-500/30 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Top Bar */}
              <div className="w-full flex items-center justify-between px-6 pt-4 pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">☯</span>
                  <h3 className="text-sm font-serif font-bold text-amber-200">
                    占验明细 · {selectedReading.question}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReading(null)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Drawn Cards Preview */}
                <div className="w-full">
                  <span className="text-xs font-serif font-bold text-neutral-300 mb-2 block">
                    抽得神明圣相
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedReading.cards.map((c, idx) => {
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

                <ReadingSummary reading={selectedReading} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card Lore Detail Modal */}
      <CardDetailModal
        card={modalCard}
        onClose={() => setModalCard(null)}
      />
    </div>
  );
}
