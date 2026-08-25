'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Flame,
  Compass,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
} from 'lucide-react';

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dailyData, setDailyData] = useState<DailyOracleResult | null>(null);
  const [user, setUser] = useState(Storage.getUser());

  useEffect(() => {
    // Check onboarding
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
    <div className="flex-1 flex flex-col px-4 pt-1 pb-6 space-y-4">
      {/* Top Navigation & Status */}
      <TopHeader />

      {/* Hero Brand & Slogan */}
      <section className="flex flex-col items-center text-center pt-2 pb-1 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-serif mb-2 shadow-inner">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>今日天机 · 乾坤运转</span>
        </div>

        <h1 className="text-3xl font-serif font-extrabold tracking-[0.2em] text-gold-gradient drop-shadow-md">
          天机52
        </h1>
        <p className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-sans -mt-0.5">
          TIANJI 52 · EASTERN ORACLE
        </p>

        <p className="text-xs font-serif text-neutral-300 mt-2 px-6 italic">
          “每一次抽牌，都是一个点。当点连接成线，你会看见自己的轨迹。”
        </p>
      </section>

      {/* 01. 今日天机 (Daily Oracle with Deterministic Seed) */}
      {dailyData && (
        <section className="w-full glass-panel rounded-3xl p-4 border border-amber-500/30 space-y-3 relative overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.12)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 rounded-full bg-amber-400" />
              <h3 className="text-xs font-serif font-bold text-amber-300">
                {dailyData.themeTitle}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-serif bg-amber-950/60 border border-amber-500/30 text-amber-400">
              行动指数 · {dailyData.actionScore}
            </span>
          </div>

          <p className="text-xs text-neutral-200 font-serif leading-relaxed bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
            {dailyData.themeSummary}
          </p>

          {/* 5-Dimension score pills */}
          <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-serif">
            <div className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800">
              <span className="text-neutral-400 block text-[9px]">事业</span>
              <span className="text-amber-300 font-mono font-bold">{dailyData.fiveDimensions.career}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800">
              <span className="text-neutral-400 block text-[9px]">财富</span>
              <span className="text-amber-300 font-mono font-bold">{dailyData.fiveDimensions.wealth}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800">
              <span className="text-neutral-400 block text-[9px]">感情</span>
              <span className="text-rose-300 font-mono font-bold">{dailyData.fiveDimensions.love}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800">
              <span className="text-neutral-400 block text-[9px]">贵人</span>
              <span className="text-emerald-300 font-mono font-bold">{dailyData.fiveDimensions.nobleman}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800">
              <span className="text-neutral-400 block text-[9px]">行动</span>
              <span className="text-yellow-400 font-mono font-bold">{dailyData.fiveDimensions.action}</span>
            </div>
          </div>

          {/* 宜 & 缓一缓 */}
          <div className="grid grid-cols-2 gap-2 text-xs font-serif pt-1">
            <div className="p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px]">
              <span className="text-emerald-400 font-bold block mb-1">今日宜</span>
              <span className="text-neutral-300">{dailyData.favorableActions.slice(0, 2).join('、')}</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-950/20 border border-rose-500/20 text-[11px]">
              <span className="text-rose-400 font-bold block mb-1">缓一缓</span>
              <span className="text-neutral-300">{dailyData.cautiousActions[0]}</span>
            </div>
          </div>
        </section>
      )}

      {/* 02. 开始问卦 (Primary Main CTA) */}
      <section className="w-full">
        <Link
          href="/question"
          onClick={handleStartOracle}
          className="relative group w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-black font-serif font-extrabold text-lg flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] active:scale-[0.98] transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none" />
          <Sparkles className="w-5 h-5 fill-black animate-pulse" />
          <span className="tracking-widest">开启三才 / 六合 / 九宫起卦</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* 03. For You (横向个人化卡片) */}
      <section className="w-full glass-panel rounded-2xl p-3.5 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>为你推演 · For You</span>
          </span>
          <Link
            href="/profile/destiny"
            className="text-[10px] text-amber-400/80 hover:text-amber-300 flex items-center gap-0.5 font-serif"
          >
            <span>天机档案</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-serif pt-1">
          <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">近期主元素</span>
            <span className="text-cyan-300 font-bold text-xs">玄水智谋</span>
          </div>
          <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">30日主题</span>
            <span className="text-amber-300 font-bold text-xs">关系整理</span>
          </div>
          <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">今日行动</span>
            <span className="text-emerald-300 font-bold text-xs">观察 ➔ 沟通</span>
          </div>
        </div>
      </section>

      {/* 04. Daily 3D One Card */}
      <section>
        <DailyOneCard />
      </section>

      {/* 05. Quick Access Portals */}
      <section className="grid grid-cols-2 gap-3 pt-1">
        <Link
          href="/cards"
          onClick={() => sound.playCardSelect()}
          className="glass-panel p-3.5 rounded-2xl border border-neutral-800 hover:border-amber-500/40 flex items-center gap-3 transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-amber-950/40 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-neutral-200">神谕图鉴</div>
            <div className="text-[10px] text-neutral-400 font-sans">52张全卡圣典</div>
          </div>
        </Link>

        <Link
          href="/history"
          onClick={() => sound.playCardSelect()}
          className="glass-panel p-3.5 rounded-2xl border border-neutral-800 hover:border-amber-500/40 flex items-center gap-3 transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-neutral-200">天机记录</div>
            <div className="text-[10px] text-neutral-400 font-sans">🔥 7 天连续占验</div>
          </div>
        </Link>
      </section>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </div>
  );
}
