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
} from 'lucide-react';

export default function AboutLandingPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-10 space-y-6 select-none">
      <TopHeader title="关于天机52" showBack onBack={() => router.push('/')} />

      {/* Hero Section */}
      <section className="text-center pt-3 pb-2 space-y-2 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-serif font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>TIANJI 52 · 东方神谕智能系统</span>
        </div>

        <h1 className="text-3xl font-serif font-black text-gold-gradient tracking-[0.15em] drop-shadow-xs">
          看见此刻的势
        </h1>

        <p className="text-xs text-stone-600 font-serif leading-relaxed px-4">
          东方神谕、五行流转与个人轨迹，组成属于你的 52 张天机。不是告诉你命运已被注定，而是让你看清此刻的局势正在往哪里走。
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              sound.playCardSelect();
              router.push('/question');
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-sm shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>开启今日神谕</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4 Realms Identity Showcase */}
      <section className="space-y-3">
        <div className="text-center space-y-1">
          <h2 className="text-base font-serif font-bold text-stone-900">
            四界宏大世界观 · 52张东方圣相
          </h2>
          <p className="text-[11px] text-stone-500 font-serif">
            融合扑克 52 张精妙数理与东方佛道神明、上古瑞兽、神圣法器
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1 shadow-xs">
            <span className="text-xs font-serif font-black text-rose-900 block">♥ 心界 (Heart)</span>
            <span className="text-[10px] text-stone-500 block">情感 · 家庭 · 疗愈 · 内在</span>
            <p className="text-[10px] text-stone-600 leading-relaxed pt-1">
              阿弥陀佛、观世音菩萨、月老、和合二仙
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 space-y-1 shadow-xs">
            <span className="text-xs font-serif font-black text-amber-950 block">♦ 财界 (Diamond)</span>
            <span className="text-[10px] text-stone-500 block">财富 · 事业 · 资源 · 权力</span>
            <p className="text-[10px] text-stone-600 leading-relaxed pt-1">
              赵公明、关圣帝君、聚宝盆、貔貅
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 shadow-xs">
            <span className="text-xs font-serif font-black text-emerald-900 block">♣ 生界 (Club)</span>
            <span className="text-[10px] text-stone-500 block">成长 · 机会 · 学习 · 贵人</span>
            <p className="text-[10px] text-stone-600 leading-relaxed pt-1">
              青龙、菩提树、文昌帝君、魁星
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1 shadow-xs">
            <span className="text-xs font-serif font-black text-purple-900 block">♠ 玄界 (Spade)</span>
            <span className="text-[10px] text-stone-500 block">转化 · 挑战 · 命运 · 觉醒</span>
            <p className="text-[10px] text-stone-600 leading-relaxed pt-1">
              太极、太上老君、孟婆、钟馗
            </p>
          </div>
        </div>
      </section>

      {/* Spreads & Destiny Map */}
      <section className="glass-panel rounded-3xl p-4 border border-stone-200 space-y-3 shadow-xs">
        <h3 className="text-sm font-serif font-bold text-stone-900">
          演卦体系与天机推演
        </h3>

        <div className="space-y-2 text-xs font-serif">
          <div className="p-3 rounded-2xl bg-white border border-stone-200 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-stone-900 font-bold block">三才神谕 (3 Cards)</span>
              <span className="text-[10px] text-stone-500">天时前因 · 当下人境 · 未来地果</span>
            </div>
            <span className="text-[10px] text-emerald-800 font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">免费体验</span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-stone-200 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-stone-900 font-bold block">六合命盘 (6 Cards)</span>
              <span className="text-[10px] text-stone-500">本命 · 财富 · 事业 · 感情 · 贵人 · 90天</span>
            </div>
            <span className="text-[10px] text-amber-900 font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">进阶命盘</span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-stone-200 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-stone-900 font-bold block">九宫天命 (9 Cards)</span>
              <span className="text-[10px] text-stone-500">太极中宫 · 阻碍破解 · 关键转机全揽</span>
            </div>
            <span className="text-[10px] text-purple-900 font-bold px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200">尊享大阵</span>
          </div>
        </div>
      </section>

      {/* Subscription Pricing */}
      <section className="space-y-3">
        <h3 className="text-sm font-serif font-bold text-center text-stone-900">
          结缘特权与会员方案
        </h3>

        <div className="space-y-2.5">
          {COMMERCIAL_PRODUCTS.filter((p) => p.type === 'subscription').map((sub) => (
            <div
              key={sub.id}
              className={`p-4 rounded-3xl border shadow-xs ${
                sub.entitlementTier === 'pro'
                  ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-400'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-serif font-black text-stone-900">{sub.nameZh}</span>
                <span className="text-sm font-mono font-black text-amber-800">{sub.priceDisplay}</span>
              </div>
              <ul className="text-[11px] font-serif text-stone-600 space-y-0.5">
                {sub.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-600 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural Disclaimer */}
      <section className="p-4 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-1.5 text-center shadow-xs">
        <div className="flex items-center justify-center gap-1 text-xs text-stone-600 font-serif font-bold">
          <Shield className="w-3.5 h-3.5 text-amber-700" />
          <span>东方文化体验声明</span>
        </div>
        <p className="text-[11px] text-stone-500 font-serif leading-relaxed">
          天机52以东方哲学、象征体系与直觉体验为基础，所有内容旨在启发个人反思与文化探索，不构成医疗、法律、投资等专业结论。
        </p>
      </section>
    </div>
  );
}
