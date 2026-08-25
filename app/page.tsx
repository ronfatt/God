'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { DailyOneCard } from '@/components/Oracle/DailyOneCard';
import { OnboardingModal } from '@/components/Personal/OnboardingModal';
import { generateDailyOracle, DailyOracleResult } from '@/ritual/dailyOracle';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Compass,
  Clock,
  Map,
  ShieldCheck,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dailyData, setDailyData] = useState<DailyOracleResult | null>(null);
  const [user, setUser] = useState(Storage.getUser());

  useEffect(() => {
    if (!Storage.isOnboardingCompleted()) {
      setShowOnboarding(true);
    }
    const oracle = generateDailyOracle(user.name);
    setDailyData(oracle);
    setUser(Storage.getUser());
  }, []);

  const handleStartOracle = () => {
    sound.playCardSelect();
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-2 pb-8 space-y-4 select-none animate-fade-in">
      {/* Top Navigation & Status */}
      <TopHeader />

      {/* Hero Brand & Slogan */}
      <section className="flex flex-col items-center text-center pt-2 pb-1 relative">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100/80 via-amber-50 to-amber-100/80 border border-amber-400/50 text-amber-950 text-[11px] font-serif mb-2 font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 fill-amber-600/30" />
          <span>甲辰年 · 今日乾坤定数</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-[0.22em] text-gold-gradient drop-shadow-sm">
          天机52
        </h1>
        <p className="text-[10px] tracking-[0.4em] text-amber-900 uppercase font-mono font-black -mt-0.5 opacity-90">
          TIANJI 52 · EASTERN ORACLE
        </p>

        <div className="relative mt-2.5 max-w-xs">
          <p className="text-xs font-serif text-stone-600 italic font-medium leading-relaxed px-4">
            “抽到的是牌，显化的是势。观照正在形成的命运共振。”
          </p>
        </div>
      </section>

      {/* 01. 今日天机 (Daily Oracle with Deterministic Seed) */}
      {dailyData && (
        <section className="w-full glass-panel-gold rounded-3xl p-4.5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-amber-600 to-amber-800" />
              <h3 className="text-sm font-serif font-black text-amber-950">
                {dailyData.themeTitle}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-[10.5px] font-serif bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-400/60 text-amber-950 font-black shadow-2xs">
              行动气场 · {dailyData.actionScore}
            </span>
          </div>

          <p className="text-xs text-stone-800 font-serif leading-relaxed bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-amber-300/40 shadow-2xs">
            {dailyData.themeSummary}
          </p>

          {/* 5-Dimension score pills */}
          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-serif">
            <div className="p-2 rounded-xl bg-white/90 border border-stone-200 shadow-2xs">
              <span className="text-stone-500 block text-[9.5px]">事业</span>
              <span className="text-amber-950 font-mono font-black text-xs">{dailyData.fiveDimensions.career}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/90 border border-stone-200 shadow-2xs">
              <span className="text-stone-500 block text-[9.5px]">财富</span>
              <span className="text-amber-950 font-mono font-black text-xs">{dailyData.fiveDimensions.wealth}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/90 border border-stone-200 shadow-2xs">
              <span className="text-stone-500 block text-[9.5px]">感情</span>
              <span className="text-rose-900 font-mono font-black text-xs">{dailyData.fiveDimensions.love}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/90 border border-stone-200 shadow-2xs">
              <span className="text-stone-500 block text-[9.5px]">贵人</span>
              <span className="text-emerald-900 font-mono font-black text-xs">{dailyData.fiveDimensions.nobleman}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/90 border border-stone-200 shadow-2xs">
              <span className="text-stone-500 block text-[9.5px]">行动</span>
              <span className="text-amber-950 font-mono font-black text-xs">{dailyData.fiveDimensions.action}</span>
            </div>
          </div>

          {/* 宜 & 缓一缓 */}
          <div className="grid grid-cols-2 gap-2 text-xs font-serif pt-0.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-300 text-[11px] shadow-2xs">
              <span className="text-emerald-950 font-black block mb-0.5 flex items-center gap-1">
                <span>✦ 今日所宜</span>
              </span>
              <span className="text-stone-700 font-medium">{dailyData.favorableActions.slice(0, 2).join('、')}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-300 text-[11px] shadow-2xs">
              <span className="text-rose-950 font-black block mb-0.5 flex items-center gap-1">
                <span>✕ 宜缓三思</span>
              </span>
              <span className="text-stone-700 font-medium">{dailyData.cautiousActions[0]}</span>
            </div>
          </div>
        </section>
      )}

      {/* 02. 开始问卦 (Primary Main CTA) */}
      <section className="w-full">
        <Link
          href="/question"
          onClick={handleStartOracle}
          className="relative group w-full py-4.5 px-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-base flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(212,175,55,0.48)] hover:shadow-[0_12px_36px_rgba(212,175,55,0.65)] active:scale-[0.98] transition-all duration-300 overflow-hidden border border-amber-300/60"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none" />
          <Sparkles className="w-5 h-5 fill-stone-950 animate-spin-slow" />
          <span className="tracking-[0.2em]">开启三才 · 六合 · 九宫起卦</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
        </Link>
      </section>

      {/* 03. 今日一牌灵犀 (Daily One Card Centerpiece) */}
      <DailyOneCard />

      {/* 04. For You (横向个人化卡片) */}
      <section className="w-full glass-panel rounded-3xl p-4 border border-stone-200/80 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-black text-stone-900 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-700" />
            <span>为你推演 · 本命气机</span>
          </span>
          <Link
            href="/profile/destiny"
            className="text-[11px] text-amber-900 hover:text-amber-950 font-black flex items-center gap-0.5 font-serif"
          >
            <span>天机档案</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-serif">
          <div className="p-2.5 rounded-2xl bg-white border border-stone-200/70 shadow-2xs">
            <span className="text-[10px] text-stone-500 block">近期主气</span>
            <span className="text-cyan-950 font-black text-xs">玄水智谋</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-stone-200/70 shadow-2xs">
            <span className="text-[10px] text-stone-500 block">30日主题</span>
            <span className="text-amber-950 font-black text-xs">破局生长</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-stone-200/70 shadow-2xs">
            <span className="text-[10px] text-stone-500 block">今日行动</span>
            <span className="text-emerald-950 font-black text-xs">观察 ➔ 决断</span>
          </div>
        </div>
      </section>

      {/* 05. 你的30日轨迹 (Oracle Journey Preview) */}
      <section
        onClick={() => {
          sound.playCardSelect();
          router.push('/journey');
        }}
        className="w-full glass-panel rounded-3xl p-4 border border-amber-300/80 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/60 flex items-center justify-between cursor-pointer hover:border-amber-500 hover:shadow-md transition-all group shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-400/60 text-amber-900 group-hover:scale-105 transition-transform shadow-2xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-black text-stone-900">
              你的 30 日生命轨迹
            </h4>
            <span className="text-[10px] text-stone-500 font-serif font-medium">
              清算旧局 ➔ 低谷回升 ➔ 乘势进取
            </span>
          </div>
        </div>

        <span className="text-xs text-amber-900 font-serif font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>查看轨迹</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      </section>

      {/* 06. 90-Day Destiny Map Banner */}
      <section
        onClick={() => {
          sound.playCardSelect();
          router.push('/destiny-map/90');
        }}
        className="w-full glass-panel rounded-3xl p-4 border border-purple-300/70 bg-gradient-to-r from-purple-50/50 via-white to-purple-50/50 flex items-center justify-between cursor-pointer hover:border-purple-400 hover:shadow-md transition-all group shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-300 text-purple-900 group-hover:scale-105 transition-transform shadow-2xs">
            <Map className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-black text-stone-900">
              90 日人生全景图谱
            </h4>
            <span className="text-[10px] text-stone-500 font-serif font-medium">
              12张天机大牌 · 阶段转折与破局
            </span>
          </div>
        </div>

        <span className="text-xs text-purple-900 font-serif font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>开启推演</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      </section>

      {/* 07. Quick Portals (2 Columns) */}
      <section className="grid grid-cols-2 gap-2.5 pt-1">
        <Link
          href="/cards"
          onClick={() => sound.playCardSelect()}
          className="p-3.5 rounded-3xl glass-panel border border-stone-200/80 hover:border-amber-400 flex flex-col justify-between space-y-2 shadow-xs group transition-all"
        >
          <div className="flex items-center justify-between">
            <Layers className="w-4 h-4 text-amber-700 group-hover:scale-110 transition-transform" />
            <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-amber-100/80 text-amber-900 font-serif font-bold">52张全卡</span>
          </div>
          <div>
            <h4 className="text-xs font-serif font-black text-stone-900">神谕圣相典籍</h4>
            <p className="text-[10px] text-stone-500 font-serif">四大界神明法相图谱</p>
          </div>
        </Link>

        <Link
          href="/about"
          onClick={() => sound.playCardSelect()}
          className="p-3.5 rounded-3xl glass-panel border border-stone-200/80 hover:border-amber-400 flex flex-col justify-between space-y-2 shadow-xs group transition-all"
        >
          <div className="flex items-center justify-between">
            <Sparkles className="w-4 h-4 text-amber-700 group-hover:scale-110 transition-transform" />
            <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-amber-100/80 text-amber-900 font-serif font-bold">天机道</span>
          </div>
          <div>
            <h4 className="text-xs font-serif font-black text-stone-900">东方神谕世界观</h4>
            <p className="text-[10px] text-stone-500 font-serif">天机52设计理念与道统</p>
          </div>
        </Link>
      </section>

      {/* Onboarding Modal for New Initiates */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => {
          setShowOnboarding(false);
          setUser(Storage.getUser());
        }}
      />
    </div>
  );
}
