'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { sound } from '@/lib/sound';
import { COMMERCIAL_PRODUCTS } from '@/commerce/products';
import {
  Sparkles,
  Compass,
  Layers,
  ArrowRight,
  Shield,
  Check,
  Flame,
  Clock,
  HelpCircle,
} from 'lucide-react';

export default function AboutLandingPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-10 space-y-6 select-none">
      <TopHeader title="关于天机52" showBack onBack={() => router.push('/')} />

      {/* Hero Section */}
      <section className="text-center pt-3 pb-2 space-y-2 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-serif">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>TIANJI 52 · 东方神谕智能系统</span>
        </div>

        <h1 className="text-3xl font-serif font-extrabold text-gold-gradient tracking-[0.15em] drop-shadow-md">
          看见此刻的势
        </h1>

        <p className="text-xs text-neutral-300 font-serif leading-relaxed px-4">
          东方神谕、五行流转与个人轨迹，组成属于你的 52 张天机。不是告诉你命运已被注定，而是让你看清此刻的局势正在往哪里走。
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              sound.playCardSelect();
              router.push('/question');
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>开启今日神谕</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4 Realms Identity Showcase */}
      <section className="space-y-3">
        <div className="text-center space-y-1">
          <h2 className="text-base font-serif font-bold text-amber-200">
            四界宏大世界观 · 52张东方圣相
          </h2>
          <p className="text-[11px] text-neutral-400 font-serif">
            融合扑克 52 张精妙数理与东方佛道神明、上古瑞兽、神圣法器
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-rose-950/30 to-neutral-900 border border-rose-500/30 space-y-1">
            <span className="text-xs font-serif font-bold text-rose-300 block">♥ 心界 (Heart)</span>
            <span className="text-[10px] text-neutral-400 block">情感 · 家庭 · 疗愈 · 内在</span>
            <p className="text-[10px] text-neutral-300 leading-relaxed pt-1">
              阿弥陀佛、观世音菩萨、月老、和合二仙
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-950/30 to-neutral-900 border border-amber-500/30 space-y-1">
            <span className="text-xs font-serif font-bold text-amber-300 block">♦ 财界 (Diamond)</span>
            <span className="text-[10px] text-neutral-400 block">财富 · 事业 · 资源 · 权力</span>
            <p className="text-[10px] text-neutral-300 leading-relaxed pt-1">
              赵公明、关圣帝君、聚宝盆、貔貅
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-neutral-900 border border-emerald-500/30 space-y-1">
            <span className="text-xs font-serif font-bold text-emerald-300 block">♣ 生界 (Club)</span>
            <span className="text-[10px] text-neutral-400 block">成长 · 机会 · 学习 · 贵人</span>
            <p className="text-[10px] text-neutral-300 leading-relaxed pt-1">
              青龙、菩提树、文昌帝君、魁星
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-950/30 to-neutral-900 border border-purple-500/30 space-y-1">
            <span className="text-xs font-serif font-bold text-purple-300 block">♠ 玄界 (Spade)</span>
            <span className="text-[10px] text-neutral-400 block">转化 · 挑战 · 命运 · 觉醒</span>
            <p className="text-[10px] text-neutral-300 leading-relaxed pt-1">
              太极、太上老君、孟婆、钟馗
            </p>
          </div>
        </div>
      </section>

      {/* Spreads & Destiny Map */}
      <section className="glass-panel rounded-3xl p-4 border border-neutral-800 space-y-3">
        <h3 className="text-sm font-serif font-bold text-neutral-200">
          演卦体系与天机推演
        </h3>

        <div className="space-y-2 text-xs font-serif">
          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-amber-300 font-bold block">三才神谕 (3 Cards)</span>
              <span className="text-[10px] text-neutral-400">天时前因 · 当下人境 · 未来地果</span>
            </div>
            <span className="text-[10px] text-emerald-400">免费体验</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-amber-300 font-bold block">六合命盘 (6 Cards)</span>
              <span className="text-[10px] text-neutral-400">本命 · 财富 · 事业 · 感情 · 贵人 · 90天</span>
            </div>
            <span className="text-[10px] text-amber-400">进阶命盘</span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-amber-300 font-bold block">九宫天命 (9 Cards)</span>
              <span className="text-[10px] text-neutral-400">太极中宫 · 阻碍破解 · 关键转机全揽</span>
            </div>
            <span className="text-[10px] text-purple-300">尊享大阵</span>
          </div>
        </div>
      </section>

      {/* Subscription Pricing */}
      <section className="space-y-3">
        <h3 className="text-sm font-serif font-bold text-center text-amber-200">
          结缘特权与会员方案
        </h3>

        <div className="space-y-2.5">
          {COMMERCIAL_PRODUCTS.filter((p) => p.type === 'subscription').map((sub) => (
            <div
              key={sub.id}
              className={`p-4 rounded-2xl border ${
                sub.entitlementTier === 'pro'
                  ? 'bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-950 border-amber-400'
                  : 'bg-neutral-900/60 border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-serif font-bold text-neutral-100">{sub.nameZh}</span>
                <span className="text-sm font-mono font-bold text-amber-300">{sub.priceDisplay}</span>
              </div>
              <ul className="text-[11px] font-serif text-neutral-400 space-y-0.5">
                {sub.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural Disclaimer */}
      <section className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-1.5 text-center">
        <div className="flex items-center justify-center gap-1 text-xs text-neutral-400 font-serif font-bold">
          <Shield className="w-3.5 h-3.5 text-amber-400/80" />
          <span>东方文化体验声明</span>
        </div>
        <p className="text-[11px] text-neutral-400 font-serif leading-relaxed">
          天机52以东方哲学、象征体系与直觉体验为基础，所有内容旨在启发个人反思与文化探索，不构成医疗、法律、投资等专业结论。
        </p>
      </section>
    </div>
  );
}
