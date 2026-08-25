'use client';

import React from 'react';
import Link from 'next/link';
import { TopHeader } from '@/components/Layout/TopHeader';
import { EnergyCircle } from '@/components/Oracle/EnergyCircle';
import { DailyOneCard } from '@/components/Oracle/DailyOneCard';
import { Sparkles, ArrowRight, BookOpen, Layers, Flame, Compass } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function HomePage() {
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
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
          <span>今日天机 · 乾坤运转</span>
        </div>

        <h1 className="text-3xl font-serif font-extrabold tracking-[0.2em] text-gold-gradient drop-shadow-md">
          天机52
        </h1>
        <p className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-sans -mt-0.5">
          TIANJI 52 · EASTERN ORACLE
        </p>

        {/* Daily Oracle Short Wisdom */}
        <p className="text-xs font-serif text-neutral-300 mt-2 px-6 italic">
          “顺势而行，万物负阴而抱阳，机会正在靠近。”
        </p>
      </section>

      {/* Energy Ring Section */}
      <section>
        <EnergyCircle
          score={82}
          wealth={78}
          career={84}
          love={72}
          nobleman={91}
        />
      </section>

      {/* Primary Main CTA */}
      <section className="w-full">
        <Link
          href="/question"
          onClick={handleStartOracle}
          className="relative group w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-black font-serif font-extrabold text-lg flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] active:scale-[0.98] transition-all duration-300 overflow-hidden"
        >
          {/* Shimmer Light Sweep */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none" />

          <Sparkles className="w-5 h-5 fill-black animate-pulse" />
          <span className="tracking-widest">开启今日神谕</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Daily One Card Section */}
      <section>
        <DailyOneCard />
      </section>

      {/* Quick Access Portals */}
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
            <div className="text-[10px] text-neutral-400 font-sans">连续 7 天占验</div>
          </div>
        </Link>
      </section>
    </div>
  );
}
