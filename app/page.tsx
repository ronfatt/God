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
  Flame,
  Compass,
  Map,
  Clock,
  Coins,
  Shield,
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
          “抽到的是牌，留下的是轨迹。真正值得看的，是你正在形成的模式。”
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

      {/* 04. 你的30日轨迹 (Oracle Journey Preview) */}
      <section
        onClick={() => {
          sound.playCardSelect();
          router.push('/journey');
        }}
        className="w-full glass-panel rounded-2xl p-3.5 border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-neutral-900 to-neutral-950 flex items-center justify-between cursor-pointer hover:border-amber-400/60 transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold text-amber-200">
              你的 30 日生命轨迹
            </h4>
            <span className="text-[10px] text-neutral-400 font-serif">
              清算旧局 ➔ 低谷回升 ➔ 乘势进取
            </span>
          </div>
        </div>

        <span className="text-xs text-amber-400 font-serif flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
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
        className="w-full glass-panel rounded-2xl p-4 border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-950 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all group shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 group-hover:scale-105 transition-transform">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-serif font-bold text-amber-200">
                九十日全维天机图
              </h3>
              <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black text-[9px] font-mono font-bold">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-serif mt-0.5">
              看见接下来三个阶段的事业、财富与内在走势
            </p>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
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
          href="/about"
          onClick={() => sound.playCardSelect()}
          className="glass-panel p-3.5 rounded-2xl border border-neutral-800 hover:border-amber-500/40 flex items-center gap-3 transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-neutral-200">关于天机</div>
            <div className="text-[10px] text-neutral-400 font-sans">世界观与方案</div>
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
