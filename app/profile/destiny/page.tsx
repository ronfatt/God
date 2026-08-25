'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { buildDestinyProfile, TimePeriod, PersonalDestinyReport } from '@/personal/destinyProfile';
import { generateWeeklyInsight, WeeklyInsightResult } from '@/ritual/weeklyInsight';
import { generateMonthlyInsight, MonthlyInsightResult } from '@/ritual/monthlyInsight';
import { OracleCard } from '@/components/Cards/OracleCard';
import {
  Sparkles,
  Calendar,
  Compass,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
  Shield,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DestinyDashboardPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');
  const [destinyReport, setDestinyReport] = useState<PersonalDestinyReport | null>(null);
  const [weeklyInsight, setWeeklyInsight] = useState<WeeklyInsightResult | null>(null);
  const [monthlyInsight, setMonthlyInsight] = useState<MonthlyInsightResult | null>(null);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);

  useEffect(() => {
    const history = Storage.getHistory();
    const report = buildDestinyProfile(history);
    setDestinyReport(report);
    setWeeklyInsight(generateWeeklyInsight(history));
    setMonthlyInsight(generateMonthlyInsight(history));
  }, []);

  if (!destinyReport) {
    return (
      <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4">
        <TopHeader title="我的天机档案" showBack onBack={() => router.push('/profile')} />
        <div className="p-8 text-center text-amber-300 font-serif text-xs">
          正在载入天机档案...
        </div>
      </div>
    );
  }

  const currentTheme = destinyReport.periodThemes[selectedPeriod];

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4">
      <TopHeader title="我的天机档案" showBack onBack={() => router.push('/profile')} />

      {/* Hero Period Switcher */}
      <div className="w-full glass-panel rounded-3xl p-5 border border-amber-500/30 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-amber-400" />
            <h3 className="text-xs font-serif font-bold text-amber-300 tracking-widest uppercase">
              长期气运总揽
            </h3>
          </div>

          {/* Period Tabs */}
          <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
            {(['7d', '30d', '90d', '365d'] as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => {
                  sound.playCardSelect();
                  setSelectedPeriod(period);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-serif transition-colors ${
                  selectedPeriod === period
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {period === '7d' ? '7天' : period === '30d' ? '30天' : period === '90d' ? '90天' : '1年'}
              </button>
            ))}
          </div>
        </div>

        {/* Current Theme Title */}
        <h2 className="text-xl font-serif font-extrabold text-gold-gradient tracking-wide mb-1">
          {currentTheme.primaryTheme}
        </h2>
        <p className="text-xs text-neutral-300 font-serif leading-relaxed bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800 mt-2.5">
          {currentTheme.narrativeSummary}
        </p>

        {/* 4 Index Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-neutral-800/80 text-xs font-serif">
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px]">当前主元素</span>
            <span className="text-cyan-300 font-bold text-sm">
              {currentTheme.dominantElementName}势 (主{currentTheme.dominantRealm})
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px]">当前弱元素</span>
            <span className="text-emerald-300 font-bold text-sm">木 (需补益生长)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px]">阴阳状态</span>
            <span className="text-amber-200 font-bold text-sm">阴 58% : 阳 42%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px]">最近主要牌势</span>
            <span className="text-purple-300 font-bold text-sm">低谷回升 · 顺流</span>
          </div>
        </div>
      </div>

      {/* Question Focus Breakdown */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800 space-y-2.5">
        <h4 className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>你近期最关注的人生领域</span>
        </h4>

        <div className="space-y-2">
          {currentTheme.questionDistribution.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-serif">
                <span className="text-neutral-300">{item.domainName}</span>
                <span className="font-mono text-amber-300 font-bold">{item.percent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
                <div
                  style={{ width: `${item.percent}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Core Cards */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>我的五张核心神谕卡</span>
          </h4>
          <span className="text-[10px] text-neutral-400 font-serif">
            近90天核心高频圣相
          </span>
        </div>

        <div className="space-y-2">
          {destinyReport.top5CoreCards.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-3 text-xs font-serif"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center">
                  0{idx + 1}
                </span>
                <div>
                  <span className="font-bold text-neutral-100 block">
                    {item.card.cardName} ({item.card.archetype})
                  </span>
                  <span className="text-[10px] text-neutral-400">{item.relationText}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-amber-400 font-mono block">已出现 {item.timesDrawn} 次</span>
                <span className="text-[9px] text-emerald-400">契合度 {item.affinityScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly & Weekly Report Entry Cards */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            sound.playCardSelect();
            setShowMonthlyModal(true);
          }}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-neutral-900 to-neutral-950 border border-amber-500/30 text-left space-y-1 hover:border-amber-400 transition-colors"
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-serif font-bold text-amber-200 block">30日命势报告</span>
          <span className="text-[10px] text-neutral-400 font-serif block">7阶段纵向全维推演</span>
        </button>

        <button
          onClick={() => {
            sound.playCardSelect();
            router.push('/history');
          }}
          className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-left space-y-1 hover:border-neutral-700 transition-colors"
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-serif font-bold text-neutral-200 block">历史占验档案</span>
          <span className="text-[10px] text-neutral-400 font-serif block">查看过往每次卦象</span>
        </button>
      </div>

      {/* Monthly Report Modal (7-card vertical format) */}
      <AnimatePresence>
        {showMonthlyModal && monthlyInsight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMonthlyModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-[390px] max-h-[85vh] bg-[#0c0e15] border border-amber-500/40 rounded-3xl p-5 shadow-2xl overflow-y-auto space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-serif font-bold text-amber-200">
                    {monthlyInsight.reportMonth} · 30日命势全维报告
                  </h3>
                </div>
                <button onClick={() => setShowMonthlyModal(false)} className="p-1 text-neutral-400 hover:text-white">
                  ✕
                </button>
              </div>

              {/* 7 Vertical Cards */}
              <div className="space-y-2.5">
                {monthlyInsight.sevenCards.map((card, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        {card.step}
                      </span>
                      <span className="text-xs font-serif font-bold text-neutral-200">
                        {card.title}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-300 font-serif leading-relaxed">
                      {card.content}
                    </p>

                    {card.tags && (
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        {card.tags.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/20 text-amber-300 text-[9px] font-serif">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowMonthlyModal(false)}
                className="w-full py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-serif font-bold transition-colors"
              >
                已悉知月度命势
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
