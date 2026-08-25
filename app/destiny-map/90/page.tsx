'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { OracleCardData } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';
import { generateNinetyDayDestinyMap, NinetyDayDestinyMapResult } from '@/destiny-map/ninetyDayEngine';
import { CardDeck } from '@/components/Oracle/CardDeck';
import { OracleCard } from '@/components/Cards/OracleCard';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { Sparkles, Calendar, TrendingUp, CheckCircle2, ChevronRight, Crown, Layers, Eye, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function NinetyDayDestinyMapPage() {
  const router = useRouter();
  // Stages: 'intro' -> 'draw_round1' -> 'draw_round2' -> 'draw_round3' -> 'result'
  const [stage, setStage] = useState<'intro' | 'draw_round1' | 'draw_round2' | 'draw_round3' | 'result'>('intro');
  const [selectedCards, setSelectedCards] = useState<OracleCardData[]>([]);
  const [mapResult, setMapResult] = useState<NinetyDayDestinyMapResult | null>(null);
  const [activeMonthTab, setActiveMonthTab] = useState<number>(1);
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);

  const handleStartDraw = () => {
    sound.playBassHit();
    // Check tokens or Pro entitlement
    const hasPaid = Storage.consumeTokens(50, '开启九十日天机图');
    setSelectedCards([]);
    setStage('draw_round1');
  };

  const handleRoundCards = (cards: OracleCardData[], nextStage: 'draw_round2' | 'draw_round3' | 'result') => {
    sound.playCardSelect();
    const updated = [...selectedCards, ...cards];
    setSelectedCards(updated);

    if (nextStage === 'result') {
      const result = generateNinetyDayDestinyMap(updated);
      setMapResult(result);
      setStage('result');
      try {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#D4AF37', '#FDE68A', '#E11D48', '#10B981', '#A855F7'],
        });
      } catch {}
    } else {
      setStage(nextStage);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="九十日天机图" showBack onBack={() => router.push('/')} />

      {/* STAGE 1: INTRO */}
      {stage === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in my-auto py-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 via-neutral-900 to-black border-2 border-amber-400/50 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            🗺️
          </div>

          <div className="space-y-1.5 px-4">
            <h2 className="text-2xl font-serif font-extrabold text-gold-gradient tracking-wide">
              九十日全维天机图
            </h2>
            <p className="text-xs text-amber-300/80 font-serif">
              3 个月 × 4 维因缘 · 12 张神谕推演未来阶段走势
            </p>
          </div>

          {/* 3 Phases Feature Preview */}
          <div className="w-full glass-panel rounded-2xl p-4 border border-amber-500/20 space-y-2.5 text-left text-xs font-serif">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-[10px] flex items-center justify-center">
                01
              </span>
              <span className="text-neutral-200">首月 (1-30天)：事业/财富/情感/内在奠基与防漏</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-[10px] flex items-center justify-center">
                02
              </span>
              <span className="text-neutral-200">次月 (31-60天)：贵人显现、新机试水与生机破局</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-[10px] flex items-center justify-center">
                03
              </span>
              <span className="text-neutral-200">季末 (61-90天)：大势成型、成果定鼎与能量丰盛</span>
            </div>
          </div>

          <button
            onClick={handleStartDraw}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>开启 3 轮直觉抽牌 (50令)</span>
          </button>
        </div>
      )}

      {/* STAGE 2: DRAW ROUND 1 (Month 1: 4 Cards) */}
      {stage === 'draw_round1' && (
        <div className="flex-1 flex flex-col items-center space-y-3 animate-fade-in">
          <div className="text-center space-y-1">
            <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-serif">
              第一轮 · 抽选首月 4 张神谕 (事业/财富/感情/内在)
            </span>
            <p className="text-[11px] text-neutral-400 font-serif">
              请在下方牌组中连续选取 4 张卡牌
            </p>
          </div>

          <CardDeck
            requiredCount={4}
            onCardsSelected={(cards) => handleRoundCards(cards, 'draw_round2')}
          />
        </div>
      )}

      {/* STAGE 3: DRAW ROUND 2 (Month 2: 4 Cards) */}
      {stage === 'draw_round2' && (
        <div className="flex-1 flex flex-col items-center space-y-3 animate-fade-in">
          <div className="text-center space-y-1">
            <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-serif">
              第二轮 · 抽选次月 4 张神谕 (转折与贵人机运)
            </span>
            <p className="text-[11px] text-neutral-400 font-serif">
              请继续在牌组中选取 4 张卡牌
            </p>
          </div>

          <CardDeck
            requiredCount={4}
            onCardsSelected={(cards) => handleRoundCards(cards, 'draw_round3')}
          />
        </div>
      )}

      {/* STAGE 4: DRAW ROUND 3 (Month 3: 4 Cards) */}
      {stage === 'draw_round3' && (
        <div className="flex-1 flex flex-col items-center space-y-3 animate-fade-in">
          <div className="text-center space-y-1">
            <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-serif">
              第三轮 · 抽选季末 4 张神谕 (大势终局定鼎)
            </span>
            <p className="text-[11px] text-neutral-400 font-serif">
              最后选取 4 张卡牌完成九十日推演
            </p>
          </div>

          <CardDeck
            requiredCount={4}
            onCardsSelected={(cards) => handleRoundCards(cards, 'result')}
          />
        </div>
      )}

      {/* STAGE 5: FINAL 90-DAY FORECAST RESULT */}
      {stage === 'result' && mapResult && (
        <div className="flex-1 flex flex-col space-y-4 animate-fade-in">
          {/* Hero Overall Trajectory Banner */}
          <div className="w-full glass-panel rounded-3xl p-5 border border-amber-500/30 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-amber-400" />
                <h3 className="text-xs font-serif font-bold text-amber-300 uppercase">
                  90日气运演进轨迹
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                推演于 {mapResult.generatedAt}
              </span>
            </div>

            <h2 className="text-xl font-serif font-extrabold text-gold-gradient tracking-wide">
              {mapResult.overallTrajectory}
            </h2>

            <p className="text-xs text-neutral-300 font-serif leading-relaxed bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800">
              “{mapResult.summaryQuote}”
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-serif">
              <div className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">最强爆发月份</span>
                <span className="text-amber-300 font-bold">{mapResult.peakMonthTitle}</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">关键调整月份</span>
                <span className="text-purple-300 font-bold">{mapResult.adjustmentMonthTitle}</span>
              </div>
            </div>
          </div>

          {/* Month Tabs */}
          <div className="flex items-center gap-1.5 bg-neutral-900/90 p-1 rounded-2xl border border-neutral-800">
            {mapResult.months.map((m) => (
              <button
                key={m.monthIndex}
                onClick={() => {
                  sound.playCardSelect();
                  setActiveMonthTab(m.monthIndex);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-serif transition-colors ${
                  activeMonthTab === m.monthIndex
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                第 {m.monthIndex} 个月
              </button>
            ))}
          </div>

          {/* Active Month 4 Cards & Roadmap */}
          {(() => {
            const activeMonth = mapResult.months[activeMonthTab - 1];
            return (
              <div className="w-full glass-panel rounded-3xl p-4 border border-amber-500/20 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-amber-200">
                      {activeMonth.monthTitle}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-serif">
                      阶段主题：{activeMonth.focusTheme}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30">
                    支持度 · {activeMonth.monthlyScore}
                  </span>
                </div>

                {/* 4 Cards Matrix */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: '事业功名', card: activeMonth.cards.career },
                    { label: '财富资产', card: activeMonth.cards.wealth },
                    { label: '情感和合', card: activeMonth.cards.love },
                    { label: '身心内在', card: activeMonth.cards.inner },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setModalCard(item.card)}
                      className="p-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-400/50 cursor-pointer transition-all space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-serif text-neutral-400">
                        <span>{item.label}</span>
                        <span className="text-amber-400 group-hover:scale-105 transition-transform">✦</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-12 rounded-lg bg-neutral-950 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-300">
                          {item.card.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-serif font-bold text-neutral-200 truncate block">
                            {item.card.cardName}
                          </span>
                          <span className="text-[9px] text-neutral-400 truncate block">
                            {item.card.archetype} · {item.card.elementName}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Roadmap */}
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <span className="text-xs font-serif font-bold text-neutral-300 block">
                    本月行动实操地图 (3大要旨)
                  </span>
                  {activeMonth.actionRoadmap.map((act, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-serif text-neutral-200">
                      <span className="w-4 h-4 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Bottom CTA */}
          <button
            onClick={() => {
              sound.playCardSelect();
              setStage('intro');
            }}
            className="w-full py-3.5 rounded-2xl bg-neutral-900 border border-neutral-700 text-neutral-300 font-serif text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重新推演九十日天机图</span>
          </button>
        </div>
      )}

      {/* Card Detail Modal */}
      <CardDetailModal
        card={modalCard}
        onClose={() => setModalCard(null)}
      />
    </div>
  );
}
