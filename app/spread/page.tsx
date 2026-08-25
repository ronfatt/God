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
      const success = Storage.consumeTokens(tokenCost, `开启 ${spreadType} 牌阵`);
      if (!success) {
        // Soft fallback
      }
    }

    router.push(
      `/draw?category=${encodeURIComponent(category)}&q=${encodeURIComponent(
        question
      )}&spread=${spreadType}`
    );
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader showBack onBack={() => router.push('/question')} />

      {/* Title */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-serif mb-1 font-bold">
          <span>02 · 布阵列象</span>
        </div>
        <h1 className="text-2xl font-serif font-extrabold text-gold-gradient tracking-wide">
          选择你的牌阵
        </h1>
        <p className="text-xs text-stone-500 font-serif mt-1">
          阵法越深，所显天机越详尽通透
        </p>
      </div>

      {/* Spread Cards */}
      <div className="space-y-3.5 pt-2">
        {/* 1. 三才神谕 */}
        <div
          onClick={() => handleSelectSpread('three', 0)}
          className="w-full p-4 rounded-3xl glass-panel border border-amber-300 hover:border-amber-500 transition-all duration-300 active:scale-[0.98] cursor-pointer relative overflow-hidden group shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-900 font-serif font-black text-base shadow-xs">
                三才
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                    三才神谕
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-serif font-bold">
                    每日免费 1 次
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-sans tracking-wider uppercase font-semibold">
                  3 Cards · 天 / 人 / 地
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-700">免费</span>
            </div>
          </div>

          <p className="text-xs text-stone-600 font-serif mt-3 leading-relaxed">
            适合快速判断具体问题：过去因缘 (天) ➔ 当前症结 (人) ➔ 未来走向 (地)。
          </p>

          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-7 rounded-md border border-amber-400 bg-amber-50 text-[9.5px] font-bold flex items-center justify-center text-amber-900">天</span>
              <span className="w-5 h-7 rounded-md border border-amber-400 bg-amber-50 text-[9.5px] font-bold flex items-center justify-center text-amber-900">人</span>
              <span className="w-5 h-7 rounded-md border border-amber-400 bg-amber-50 text-[9.5px] font-bold flex items-center justify-center text-amber-900">地</span>
            </div>

            <span className="text-xs font-serif font-bold text-amber-900 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>开始三才神谕</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 2. 六合命盘 */}
        <div
          onClick={() => handleSelectSpread('six', 20)}
          className="w-full p-4 rounded-3xl glass-panel border border-amber-300/80 hover:border-amber-500 transition-all duration-300 active:scale-[0.98] cursor-pointer relative overflow-hidden group shadow-sm bg-gradient-to-b from-amber-50/40 to-white"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-100/80 border border-amber-400 flex items-center justify-center text-amber-950 font-serif font-black text-base shadow-xs">
                六合
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                    六合命盘
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-serif font-bold">
                    进阶推演
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-sans tracking-wider uppercase font-semibold">
                  6 Cards · 乾坤全盘
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-amber-800">20 令</span>
            </div>
          </div>

          <p className="text-xs text-stone-600 font-serif mt-3 leading-relaxed">
            深入洞察多维因缘：本命基底、财富机遇、事业权柄、感情归宿、贵人相扶与未来90天大势。
          </p>

          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <span key={i} className="w-4 h-6 rounded-md border border-amber-300 bg-white text-[8px] font-mono font-bold flex items-center justify-center text-amber-900">
                  {i}
                </span>
              ))}
            </div>

            <span className="text-xs font-serif font-bold text-amber-900 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>进入六合命盘</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 3. 九宫天命 */}
        <div
          onClick={() => handleSelectSpread('nine', 50)}
          className="w-full p-4 rounded-3xl glass-panel border-2 border-amber-400 hover:border-amber-600 transition-all duration-300 active:scale-[0.98] cursor-pointer relative overflow-hidden group shadow-md bg-gradient-to-b from-amber-50 via-white to-amber-50"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-300 border border-amber-500 flex items-center justify-center text-stone-950 font-serif font-black text-base shadow-xs">
                九宫
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-extrabold text-gold-gradient group-hover:text-amber-900 transition-colors">
                    九宫天命大阵
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold font-serif shadow-xs">
                    PRO 尊享
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-sans tracking-wider uppercase font-semibold">
                  9 Cards · 终极大卦
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-amber-900">50 令</span>
            </div>
          </div>

          <p className="text-xs text-stone-700 font-serif mt-3 leading-relaxed">
            神圣终极全息演卦：太极中宫、隐秘阻碍、深层贵人、外在环境、转机突破与终极天机尽释。
          </p>

          <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
            <div className="grid grid-cols-3 gap-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <span key={i} className="w-3 h-3 rounded-xs border border-amber-400 bg-amber-100/80 text-[6.5px] font-mono font-bold flex items-center justify-center text-amber-900">
                  {i}
                </span>
              ))}
            </div>

            <span className="text-xs font-serif font-black text-amber-900 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>启运九宫大阵</span>
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
    <Suspense fallback={<div className="p-8 text-center text-amber-800 font-serif text-xs">正在布阵列象...</div>}>
      <SpreadContent />
    </Suspense>
  );
}
