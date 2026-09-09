'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Compass, Coins, Sparkles, ArrowUpRight, ShieldCheck, Flame, CircleDollarSign } from 'lucide-react';

interface AdminOverviewProps {
  kpis: {
    totalUsers: number;
    totalDraws: number;
    totalTokensInCirculation: number;
    totalRevenue: number;
    threeCardDraws: number;
    oneCardDraws: number;
    totalCards: number;
  };
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ kpis, onNavigateTab }) => {
  const cards = [
    {
      title: '全服注册道友',
      value: kpis.totalUsers,
      sub: '已开辟天机命籍',
      icon: Users,
      color: 'from-amber-500/20 to-amber-900/10 border-amber-500/30 text-amber-400',
      tab: 'users',
    },
    {
      title: '神谕推演总数',
      value: kpis.totalDraws,
      sub: `三才阵: ${kpis.threeCardDraws} | 单牌: ${kpis.oneCardDraws}`,
      icon: Compass,
      color: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30 text-cyan-400',
      tab: 'readings',
    },
    {
      title: '全服流通灵石',
      value: `${kpis.totalTokensInCirculation} 灵石`,
      sub: '道友钱包总结存',
      icon: Coins,
      color: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30 text-emerald-400',
      tab: 'users',
    },
    {
      title: '神谕圣相就绪',
      value: `${kpis.totalCards} / 52`,
      sub: '四大界全量立绘上线',
      icon: Sparkles,
      color: 'from-purple-500/20 to-purple-900/10 border-purple-500/30 text-purple-400',
      tab: 'cards',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-stone-950 border border-amber-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-stone-100 flex items-center gap-2">
              <span>天机总枢能量平稳</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-mono">
                ONLINE · READY
              </span>
            </h2>
            <p className="text-xs text-stone-400 font-serif mt-0.5">
              灵石发放、三才占卜扣除与生辰干支算法已全量协同运行。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('settings')}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-serif border border-stone-700 transition-all flex items-center gap-1.5"
          >
            <span>运营参数配置</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onNavigateTab(c.tab)}
              className={`p-4 sm:p-5 rounded-3xl bg-gradient-to-br ${c.color} border shadow-lg hover:brightness-110 cursor-pointer transition-all flex flex-col justify-between space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif text-stone-300 font-medium">
                  {c.title}
                </span>
                <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-700/50">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-mono font-black text-stone-100 tracking-tight">
                  {c.value}
                </div>
                <div className="text-[11px] font-serif text-stone-400 mt-1">
                  {c.sub}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Ops & Divination Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Module 1: Quick Actions */}
        <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="text-sm font-serif font-bold text-stone-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>常用管理通道</span>
            </h3>
            <span className="text-[10px] text-stone-500 font-mono">SHORTCUTS</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('users')}
              className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/50 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-serif font-bold text-stone-200 group-hover:text-amber-400 flex items-center justify-between">
                <span>道友灵石调配</span>
                <Coins className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[11px] text-stone-400 font-serif">
                增补/扣减灵石，补发活动奖励
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('readings')}
              className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-cyan-500/50 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-serif font-bold text-stone-200 group-hover:text-cyan-400 flex items-center justify-between">
                <span>全服卦象监察</span>
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-[11px] text-stone-400 font-serif">
                查验道友求卜问题与抽牌结果
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('cards')}
              className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-purple-500/50 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-serif font-bold text-stone-200 group-hover:text-purple-400 flex items-center justify-between">
                <span>52圣相立绘库</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-[11px] text-stone-400 font-serif">
                查验四大界立绘面相与神谕文案
              </p>
            </button>

            <button
              onClick={() => onNavigateTab('orders')}
              className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-emerald-500/50 text-left space-y-1 transition-all group"
            >
              <div className="text-xs font-serif font-bold text-stone-200 group-hover:text-emerald-400 flex items-center justify-between">
                <span>结缘充值流水</span>
                <CircleDollarSign className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-stone-400 font-serif">
                查看灵石套餐充值结缘记录
              </p>
            </button>
          </div>
        </div>

        {/* Module 2: System Status & Economy Rule */}
        <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="text-sm font-serif font-bold text-stone-200 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>当前平台经济参数</span>
            </h3>
            <span className="text-[10px] text-stone-500 font-mono">RULES</span>
          </div>

          <div className="space-y-2.5 text-xs font-serif">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-stone-400">新道友注册即赠礼</span>
              <span className="font-mono font-bold text-amber-400">150 灵石 (一次性)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-stone-400">一牌定音 (单牌断事)</span>
              <span className="font-mono font-bold text-emerald-400">免费 · 每日限 3 次</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-stone-400">三才天地人阵法</span>
              <span className="font-mono font-bold text-amber-400">10 灵石 / 次</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800">
              <span className="text-stone-400">生辰干支算法引擎</span>
              <span className="font-mono font-bold text-cyan-400">庚申/丙子等动态六十甲子</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
