'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { SpreadType } from '@/types/oracle';
import { SPREAD_CONFIGS } from '@/data/cards';
import { Sparkles, Crown, ArrowRight, Layers, Coins } from 'lucide-react';
import { sound } from '@/lib/sound';
import { cn } from '@/lib/utils';
import { Storage } from '@/lib/storage';

function SpreadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'general';
  const question = searchParams.get('q') || '今日神谕·乾坤运势';

  const handleSelectSpread = (spreadType: SpreadType, tokenCost: number) => {
    sound.playCardSelect();

    if (tokenCost > 0) {
      const success = Storage.consumeTokens(tokenCost);
      if (!success) {
        alert('天机令不足，已为您提供免费演卦体验！');
      }
    }

    router.push(
      `/draw?category=${encodeURIComponent(category)}&q=${encodeURIComponent(
        question
      )}&spread=${spreadType}`
    );
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-6 space-y-4">
      <TopHeader showBack onBack={() => router.push('/question')} />

      {/* Title */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-serif mb-1">
          <span>02 · 布阵列象</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-gold-gradient tracking-wide">
          选择你的牌阵
        </h1>
        <p className="text-xs text-neutral-400 font-serif mt-1">
          阵法越深，所显天机越详尽通透
        </p>
      </div>

      {/* Spread Cards */}
      <div className="space-y-4 pt-2">
        {/* 1. 三才神谕 */}
        <div
          onClick={() => handleSelectSpread('three', 0)}
          className="w-full p-4 rounded-2xl glass-panel border border-amber-500/20 hover:border-amber-400/60 transition-all duration-300 active:scale-[0.98] cursor-pointer relative overflow-hidden group shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-amber-300 font-serif font-bold text-base shadow-inner">
                三才
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                    三才神谕
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-serif">
                    每日免费 1 次
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-sans tracking-wider uppercase">
                  3 Cards · 天 / 人 / 地
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-400">免费</span>
            </div>
          </div>

          <p className="text-xs text-neutral-300 font-serif mt-3 leading-relaxed">
            适合快速判断具体问题：过去因缘 (天) ➔ 当前症结 (人) ➔ 未来走向 (地)。
          </p>

          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-7 rounded border border-amber-400/30 bg-amber-950/40 text-[9px] flex items-center justify-center text-amber-300">天</span>
              <span className="w-5 h-7 rounded border border-amber-400/30 bg-amber-950/40 text-[9px] flex items-center justify-center text-amber-300">人</span>
              <span className="w-5 h-7 rounded border border-amber-400/30 bg-amber-950/40 text-[9px] flex items-center justify-center text-amber-300">地</span>
            </div>

            <span className="text-xs font-serif font-bold text-amber-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>开始三才神谕</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 2. 六合命盘 */}
        <div
          onClick={() => handleSelectSpread('six', 20)}
          className="w-full p-4 rounded-2xl glass-panel border border-amber-500/30 hover:border-amber-400 transition-all duration-300 active:scale-[0.98] cursor-pointer relative overflow-hidden group shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-amber-300 font-serif font-bold text-base shadow-inner">
                六合
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                    六合命盘
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-serif">
                    综合分析
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-sans tracking-wider uppercase">
                  6 Cards · 本命/财富/事业/感情/贵人/未来90天
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-300 text-xs font-mono font-bold">
              <Coins className="w-3.5 h-3.5" />
              <span>20 令</span>
            </div>
          </div>

          <p className="text-xs text-neutral-300 font-serif mt-3 leading-relaxed">
            全景扫描人生六大维度：本命心性、财富蓄积、事业权柄、感情缘分、外部贵人与未来三个月吉凶。
          </p>

          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-serif">
              适合事业转折与深度解惑
            </span>

            <span className="text-xs font-serif font-bold text-amber-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>布设六合命盘</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 3. 九宫天命 (PREMIUM 3x3 阵法) */}
        <div
          onClick={() => handleSelectSpread('nine', 50)}
          className="w-full p-4.5 rounded-2xl bg-gradient-to-b from-[#1c170d] via-[#100d08] to-[#080705] border-2 border-amber-400/70 hover:border-amber-300 transition-all duration-300 active:scale-[0.98] cursor-pointer relative overflow-hidden group shadow-[0_0_30px_rgba(212,175,55,0.25)]"
        >
          {/* Animated Gold Flow Border Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent animate-gold-shine pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-serif font-bold text-base shadow-[0_0_12px_rgba(212,175,55,0.3)]">
                九宫
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-bold text-gold-gradient group-hover:brightness-125 transition-all">
                    九宫天命
                  </h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5 fill-black" />
                    PREMIUM
                  </span>
                </div>
                <span className="text-[10px] text-amber-300/80 font-sans tracking-wider uppercase">
                  9 Cards · 3 × 3 奇门阵法
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-300 text-xs font-mono font-bold">
              <Coins className="w-3.5 h-3.5" />
              <span>50 令</span>
            </div>
          </div>

          <p className="text-xs text-neutral-200 font-serif mt-3 leading-relaxed relative z-10">
            最高规格东方奇门九宫阵：涵盖本命中宫、财富、事业、感情、阻碍、转机与终极未来，中宫太极通灵至深。
          </p>

          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between relative z-10">
            <div className="grid grid-cols-3 gap-1 opacity-70">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'w-3.5 h-3.5 rounded-sm border border-amber-400/40 text-[7px] flex items-center justify-center text-amber-300',
                    i === 4 && 'bg-amber-400 text-black font-bold'
                  )}
                >
                  {i === 4 ? '中' : '✦'}
                </span>
              ))}
            </div>

            <span className="text-xs font-serif font-bold text-amber-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>开启九宫天命</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpreadPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-amber-300">正在布置神谕阵法...</div>}>
      <SpreadContent />
    </Suspense>
  );
}
