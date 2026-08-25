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
  Map,
  Clock,
  Info,
} from 'lucide-react';

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
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      {/* Top Navigation & Status */}
      <TopHeader />

      {/* Hero Brand & Slogan */}
      <section className="flex flex-col items-center text-center pt-2 pb-1 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-serif mb-2 font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>今日天机 · 乾坤运转</span>
        </div>

        <h1 className="text-3xl font-serif font-black tracking-[0.2em] text-gold-gradient drop-shadow-xs">
          天机52
        </h1>
        <p className="text-[10px] tracking-[0.35em] text-amber-800 uppercase font-sans font-bold -mt-0.5">
          TIANJI 52 · EASTERN ORACLE
        </p>

        <p className="text-xs font-serif text-stone-600 mt-2 px-6 italic font-medium">
          “抽到的是牌，留下的是轨迹。真正值得看的，是你正在形成的模式。”
        </p>
      </section>

      {/* 01. 今日天机 (Daily Oracle with Deterministic Seed) */}
      {dailyData && (
        <section className="w-full glass-panel rounded-3xl p-4 border border-amber-300 space-y-3 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 rounded-full bg-amber-600" />
              <h3 className="text-xs font-serif font-black text-amber-900">
                {dailyData.themeTitle}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-serif bg-amber-100 border border-amber-300 text-amber-900 font-bold">
              行动指数 · {dailyData.actionScore}
            </span>
          </div>

          <p className="text-xs text-stone-700 font-serif leading-relaxed bg-amber-50/60 p-3 rounded-2xl border border-amber-200/60">
            {dailyData.themeSummary}
          </p>

          {/* 5-Dimension score pills */}
          <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-serif">
            <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
              <span className="text-stone-500 block text-[9px]">事业</span>
              <span className="text-amber-900 font-mono font-black">{dailyData.fiveDimensions.career}</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
              <span className="text-stone-500 block text-[9px]">财富</span>
              <span className="text-amber-900 font-mono font-black">{dailyData.fiveDimensions.wealth}</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
              <span className="text-stone-500 block text-[9px]">感情</span>
              <span className="text-rose-900 font-mono font-black">{dailyData.fiveDimensions.love}</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
              <span className="text-stone-500 block text-[9px]">贵人</span>
              <span className="text-emerald-900 font-mono font-black">{dailyData.fiveDimensions.nobleman}</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-xs">
              <span className="text-stone-500 block text-[9px]">行动</span>
              <span className="text-amber-950 font-mono font-black">{dailyData.fiveDimensions.action}</span>
            </div>
          </div>

          {/* 宜 & 缓一缓 */}
          <div className="grid grid-cols-2 gap-2 text-xs font-serif pt-1">
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] shadow-xs">
              <span className="text-emerald-900 font-bold block mb-0.5">今日宜</span>
              <span className="text-stone-700">{dailyData.favorableActions.slice(0, 2).join('、')}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-[11px] shadow-xs">
              <span className="text-rose-900 font-bold block mb-0.5">缓一缓</span>
              <span className="text-stone-700">{dailyData.cautiousActions[0]}</span>
            </div>
          </div>
        </section>
      )}

      {/* 02. 开始问卦 (Primary Main CTA) */}
      <section className="w-full">
        <Link
          href="/question"
          onClick={handleStartOracle}
          className="relative group w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-base flex items-center justify-center gap-2.5 shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] active:scale-[0.98] transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none" />
          <Sparkles className="w-5 h-5 fill-stone-950 animate-pulse" />
          <span className="tracking-widest">开启三才 / 六合 / 九宫起卦</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* 03. For You (横向个人化卡片) */}
      <section className="w-full glass-panel rounded-3xl p-4 border border-stone-200 space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-700" />
            <span>为你推演 · For You</span>
          </span>
          <Link
            href="/profile/destiny"
            className="text-[11px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-0.5 font-serif"
          >
            <span>天机档案</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-serif pt-1">
          <div className="p-2.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <span className="text-[10px] text-stone-500 block">近期主元素</span>
            <span className="text-cyan-900 font-bold text-xs">玄水智谋</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <span className="text-[10px] text-stone-500 block">30日主题</span>
            <span className="text-amber-900 font-bold text-xs">关系整理</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <span className="text-[10px] text-stone-500 block">今日行动</span>
            <span className="text-emerald-900 font-bold text-xs">观察 ➔ 沟通</span>
          </div>
        </div>
      </section>

      {/* 04. 你的30日轨迹 (Oracle Journey Preview) */}
      <section
        onClick={() => {
          sound.playCardSelect();
          router.push('/journey');
        }}
        className="w-full glass-panel rounded-3xl p-4 border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all group shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold text-stone-900">
              你的 30 日生命轨迹
            </h4>
            <span className="text-[10px] text-stone-500 font-serif">
              清算旧局 ➔ 低谷回升 ➔ 乘势进取
            </span>
          </div>
        </div>

        <span className="text-xs text-amber-800 font-serif font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          <span>查看轨迹</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </section>

      {/* 05. 90-Day Destiny Map Banner */}
      <section
        onClick={() => {
          sound.playCardSelect();
          router.push('/destiny-map/90');
        }}
        className="w-full glass-panel rounded-3xl p-4 border-2 border-amber-400 bg-gradient-to-r from-amber-100/70 via-white to-amber-100/70 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all group shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-stone-950 group-hover:scale-105 transition-transform shadow-xs">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-serif font-black text-stone-900">
                九十日全维天机图
              </h3>
              <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-stone-950 text-[9px] font-mono font-black">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-stone-600 font-serif mt-0.5">
              看见接下来三个阶段的事业、财富与内在走势
            </p>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-amber-800 group-hover:translate-x-1 transition-transform" />
      </section>

      {/* 06. Daily 3D One Card */}
      <section>
        <DailyOneCard />
      </section>

      {/* 07. Quick Access Portals */}
      <section className="grid grid-cols-2 gap-3 pt-1">
        <Link
          href="/cards"
          onClick={() => sound.playCardSelect()}
          className="glass-panel p-4 rounded-3xl border border-stone-200 hover:border-amber-400 flex items-center gap-3 transition-all group shadow-xs"
        >
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-stone-900">神谕图鉴</div>
            <div className="text-[10px] text-stone-500 font-sans">52张全卡圣典</div>
          </div>
        </Link>

        <Link
          href="/about"
          onClick={() => sound.playCardSelect()}
          className="glass-panel p-4 rounded-3xl border border-stone-200 hover:border-rose-400 flex items-center gap-3 transition-all group shadow-xs"
        >
          <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 group-hover:scale-105 transition-transform">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-stone-900">关于天机</div>
            <div className="text-[10px] text-stone-500 font-sans">世界观与方案</div>
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
