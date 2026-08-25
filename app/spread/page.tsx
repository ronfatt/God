'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { SpreadType } from '@/types/oracle';
import { SPREAD_CONFIGS } from '@/data/cards';
import { Sparkles, Crown, ArrowRight, Layers, Coins, ShieldCheck } from 'lucide-react';
import { sound } from '@/lib/sound';
import { cn } from '@/lib/utils';
import { Storage } from '@/lib/storage';
import { motion } from 'framer-motion';

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
        // Fallback or grant for demo
      }
    }

    router.push(
      `/draw?category=${encodeURIComponent(category)}&q=${encodeURIComponent(
        question
      )}&spread=${spreadType}`
    );
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none animate-fade-in">
      <TopHeader title="选择牌阵" showBack onBack={() => router.push('/question')} />

      {/* Title */}
      <div className="pt-2 text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/70 border border-amber-400/60 text-amber-950 text-[10.5px] font-serif font-bold shadow-2xs">
          <span>02 · 布阵列象</span>
        </div>
        <h1 className="text-2xl font-serif font-black text-gold-gradient tracking-wide">
          选择你的演卦阵法
        </h1>
        <p className="text-xs text-stone-600 font-serif font-medium">
          阵法越深，所显天地人三才及九宫命理越详尽通透
        </p>
      </div>

      {/* Spread Cards */}
      <div className="space-y-3.5 pt-1">
        {/* 1. 三才神谕 */}
        <motion.div
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => handleSelectSpread('three', 0)}
          className="w-full p-4.5 rounded-3xl glass-panel-gold border-2 border-amber-400 hover:border-amber-500 transition-all duration-300 cursor-pointer relative overflow-hidden group shadow-xs hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-400/80 flex items-center justify-center text-amber-950 font-serif font-black text-base shadow-xs group-hover:scale-105 transition-transform">
                三才
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-black text-stone-900 group-hover:text-amber-950 transition-colors">
                    三才神谕
                  </h3>
                  <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 font-serif font-bold">
                    每日免费 1 次
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase font-bold block">
                  3 Cards · 天 / 人 / 地
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-serif font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                免费
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 font-serif mt-3 leading-relaxed font-medium bg-white/60 p-2.5 rounded-2xl border border-stone-200/60">
            天、地、人三维交织，快速剖析事件过去根源、当下症结与未来走向。
          </p>

          <div className="mt-3 pt-2.5 border-t border-amber-900/10 flex items-center justify-between text-xs">
            <span className="text-[11px] text-stone-500 font-serif">推荐日常决断、单点疑惑</span>
            <span className="text-amber-900 font-serif font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>立即布阵</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </div>
        </motion.div>

        {/* 2. 六合命盘 */}
        <motion.div
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => handleSelectSpread('six', 20)}
          className="w-full p-4.5 rounded-3xl glass-panel border-2 border-stone-200 hover:border-amber-400 transition-all duration-300 cursor-pointer relative overflow-hidden group shadow-xs hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-950 font-serif font-black text-base shadow-xs group-hover:scale-105 transition-transform">
                六合
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-black text-stone-900 group-hover:text-amber-950 transition-colors">
                    六合命盘
                  </h3>
                  <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-serif font-bold">
                    深度全盘
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase font-bold block">
                  6 Cards · 本命/财富/事业/感情/贵人/未来
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-800 font-mono font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>20 天机令</span>
            </div>
          </div>

          <p className="text-xs text-stone-700 font-serif mt-3 leading-relaxed font-medium bg-white/60 p-2.5 rounded-2xl border border-stone-200/60">
            全方位洞悉人生六大核心支柱，深度剖析本命与未来90天综合运势。
          </p>

          <div className="mt-3 pt-2.5 border-t border-amber-900/10 flex items-center justify-between text-xs">
            <span className="text-[11px] text-stone-500 font-serif">深度剖析多维人生命题</span>
            <span className="text-amber-900 font-serif font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>立即布阵</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </div>
        </motion.div>

        {/* 3. 九宫天命 (奇门大阵) */}
        <motion.div
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => handleSelectSpread('nine', 50)}
          className="w-full p-4.5 rounded-3xl glass-panel border-2 border-purple-300 hover:border-purple-500 transition-all duration-300 cursor-pointer relative overflow-hidden group shadow-xs hover:shadow-md bg-gradient-to-br from-purple-50/40 via-white to-amber-50/30"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-300 flex items-center justify-center text-purple-950 font-serif font-black text-base shadow-xs group-hover:scale-105 transition-transform">
                九宫
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-black text-stone-900 group-hover:text-amber-950 transition-colors">
                    九宫天命 · 奇门大阵
                  </h3>
                  <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-purple-100 border border-purple-300 text-purple-900 font-serif font-bold flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5 text-purple-700" />
                    <span>宗师殿堂</span>
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase font-bold block">
                  9 Cards · 3×3 奇门全维大卦
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-800 font-mono font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>50 天机令</span>
            </div>
          </div>

          <p className="text-xs text-stone-700 font-serif mt-3 leading-relaxed font-medium bg-white/60 p-2.5 rounded-2xl border border-stone-200/60">
            3×3 奇门遁甲阵法，涵盖本命、财富、事业、阻碍、转机等九重命门。
          </p>

          <div className="mt-3 pt-2.5 border-t border-purple-900/10 flex items-center justify-between text-xs">
            <span className="text-[11px] text-stone-500 font-serif">年度转折、重大决策终极推演</span>
            <span className="text-purple-900 font-serif font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>开启奇门</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SpreadPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-serif text-stone-500">正在布置天机法坛...</div>}>
      <SpreadContent />
    </Suspense>
  );
}
