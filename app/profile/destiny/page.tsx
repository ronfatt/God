'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { buildDestinyProfile, TimePeriod, PersonalDestinyReport } from '@/personal/destinyProfile';
import { generateWeeklyInsight, WeeklyInsightResult } from '@/ritual/weeklyInsight';
import { generateMonthlyInsight, MonthlyInsightResult } from '@/ritual/monthlyInsight';
import {
  Sparkles,
  Calendar,
  Compass,
  TrendingUp,
  Award,
  Layers,
  FileText,
  Clock,
  ArrowRight,
  X,
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
        <div className="p-8 text-center text-amber-800 font-serif text-xs">
          正在载入天机档案...
        </div>
      </div>
    );
  }

  const currentTheme = destinyReport.periodThemes[selectedPeriod];

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="我的天机档案" showBack onBack={() => router.push('/profile')} />

      {/* Hero Period Switcher */}
      <div className="w-full glass-panel rounded-3xl p-5 border border-amber-300 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-amber-600" />
            <h3 className="text-xs font-serif font-black text-amber-900 tracking-widest uppercase">
              长期气运总揽
            </h3>
          </div>

          {/* Period Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-xs">
            {(['7d', '30d', '90d', '365d'] as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => {
                  sound.playCardSelect();
                  setSelectedPeriod(period);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-serif transition-colors ${
                  selectedPeriod === period
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {period === '7d' ? '7天' : period === '30d' ? '30天' : period === '90d' ? '90天' : '1年'}
              </button>
            ))}
          </div>
        </div>

        {/* Current Theme Title */}
        <h2 className="text-xl font-serif font-black text-gold-gradient tracking-wide mb-1">
          {currentTheme.primaryTheme}
        </h2>
        <p className="text-xs text-stone-700 font-serif leading-relaxed bg-amber-50/60 p-3 rounded-2xl border border-amber-200/60 mt-2.5">
          {currentTheme.narrativeSummary}
        </p>

        {/* 3 Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-200 text-center">
          <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
            <div className="text-[10px] text-stone-500 font-serif">主导元素</div>
            <div className="text-xs font-serif font-bold text-amber-900 mt-0.5">{currentTheme.dominantElementName}</div>
          </div>
          <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
            <div className="text-[10px] text-stone-500 font-serif">主界领域</div>
            <div className="text-xs font-serif font-bold text-purple-900 mt-0.5">{currentTheme.dominantRealm}</div>
          </div>
          <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
            <div className="text-[10px] text-stone-500 font-serif">阶段势能</div>
            <div className="text-xs font-serif font-bold text-emerald-800 mt-0.5">{currentTheme.dominantMomentum}</div>
          </div>
        </div>
      </div>

      {/* Top 5 Core Cards */}
      <div className="w-full glass-panel rounded-3xl p-4 border border-stone-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-stone-900">
            <Award className="w-4 h-4 text-amber-700" />
            <span>我的 5 张核心神谕卡</span>
          </div>
          <span className="text-[10px] text-stone-500 font-serif">
            近30天最高频共鸣
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {destinyReport.top5CoreCards.map((item, idx) => (
            <div
              key={idx}
              className="p-2 rounded-2xl bg-white border border-stone-200 flex flex-col items-center justify-between text-center space-y-1 shadow-xs"
            >
              <span className="text-[9px] font-mono font-bold text-amber-800">
                0{idx + 1}
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-xs font-serif font-bold text-amber-900 shadow-xs">
                {item.card.cardName.charAt(0)}
              </div>
              <span className="text-[9px] font-serif font-bold text-stone-800 truncate max-w-full">
                {item.card.cardName}
              </span>
              <span className="text-[8px] text-stone-400 font-mono">
                {item.timesDrawn}次
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 30-Day Full Report Button */}
      <div className="w-full">
        <button
          onClick={() => {
            sound.playCardSelect();
            setShowMonthlyModal(true);
          }}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-amber-100 via-white to-amber-100 border border-amber-400 hover:border-amber-500 flex items-center justify-between shadow-sm group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-stone-950 shadow-xs group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-serif font-bold text-stone-900">
                查看 30 日全维命势报告 (Monthly Report)
              </h3>
              <p className="text-[10px] text-stone-500 font-serif mt-0.5">
                包含起运点、突破口与七阶段全景演进
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-800 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Monthly Report Modal */}
      <AnimatePresence>
        {showMonthlyModal && monthlyInsight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMonthlyModal(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-[420px] max-h-[85vh] bg-[#FAF8F5] border-2 border-amber-400 rounded-3xl shadow-2xl p-5 overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <h3 className="text-sm font-serif font-bold text-stone-900">
                    {monthlyInsight.reportMonth} · 30 日全维命势报告
                  </h3>
                </div>
                <button
                  onClick={() => setShowMonthlyModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 7 Vertical Cards Format */}
              <div className="space-y-2.5">
                <span className="text-xs font-serif font-bold text-stone-900 block">
                  七大维度全景命势深度复盘
                </span>
                {monthlyInsight.sevenCards.map((sc, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-stone-900">
                        {sc.step} · {sc.title}
                      </span>
                      {sc.tags && (
                        <div className="flex items-center gap-1">
                          {sc.tags.map((t, idx) => (
                            <span key={idx} className="text-[9px] font-serif px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 font-serif leading-relaxed">
                      {sc.content}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowMonthlyModal(false)}
                className="w-full py-3.5 rounded-2xl bg-amber-500 text-stone-950 font-serif font-black text-xs hover:bg-amber-400 transition-colors shadow-xs"
              >
                已悉知月度天机
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
