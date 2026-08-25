'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { QuestionCategory } from '@/types/oracle';
import { Heart, Coins, Briefcase, Users, Moon, Sparkles, ArrowRight, X } from 'lucide-react';
import { sound } from '@/lib/sound';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    {
      id: 'love' as QuestionCategory,
      title: '感情 · 缘分',
      titleEn: 'Love & Relation',
      symbol: '❤️',
      desc: '正缘桃花 · 情感走向 · 修复与和合',
      icon: Heart,
      color: 'from-rose-50 to-white',
      border: 'border-rose-300 hover:border-rose-500',
      iconColor: 'text-rose-600',
      defaultQuestion: '我近期的感情走向与桃花正缘如何？',
    },
    {
      id: 'wealth' as QuestionCategory,
      title: '财富 · 财帛',
      titleEn: 'Wealth & Finance',
      symbol: '💰',
      desc: '正偏财运 · 投资机遇 · 财库丰盈',
      icon: Coins,
      color: 'from-amber-50 to-white',
      border: 'border-amber-300 hover:border-amber-500',
      iconColor: 'text-amber-600',
      defaultQuestion: '我接下来的财运与投资机运如何？',
    },
    {
      id: 'career' as QuestionCategory,
      title: '事业 · 功名',
      titleEn: 'Career & Power',
      symbol: '💼',
      desc: '晋升突破 · 跳槽创业 · 项目落地',
      icon: Briefcase,
      color: 'from-emerald-50 to-white',
      border: 'border-emerald-300 hover:border-emerald-500',
      iconColor: 'text-emerald-700',
      defaultQuestion: '我未来3个月事业发展与晋升机缘如何？',
    },
    {
      id: 'relationship' as QuestionCategory,
      title: '人际 · 贵人',
      titleEn: 'Allies & Harmony',
      symbol: '👥',
      desc: '良师提携 · 合作契合 · 远离小人',
      icon: Users,
      color: 'from-purple-50 to-white',
      border: 'border-purple-300 hover:border-purple-500',
      iconColor: 'text-purple-700',
      defaultQuestion: '我近期是否会遇到关键贵人与得力助手？',
    },
    {
      id: 'general' as QuestionCategory,
      title: '综合 · 天命',
      titleEn: 'Destiny & Fortune',
      symbol: '🌙',
      desc: '乾坤大势 · 身心安泰 · 阶段推演',
      icon: Moon,
      color: 'from-cyan-50 to-white',
      border: 'border-cyan-300 hover:border-cyan-500',
      iconColor: 'text-cyan-700',
      defaultQuestion: '我当下的整体运势走向与破局指引是什么？',
    },
    {
      id: 'custom' as QuestionCategory,
      title: '自定义 · 问事',
      titleEn: 'Custom Inquiry',
      symbol: '🔮',
      desc: '亲笔写下最关切的问题 · 专属推演',
      icon: Sparkles,
      color: 'from-amber-100/60 via-white to-amber-50',
      border: 'border-amber-400 hover:border-amber-600',
      iconColor: 'text-amber-700',
      defaultQuestion: '',
    },
  ];

  const handleSelectCategory = (cat: typeof categories[0]) => {
    sound.playCardSelect();
    setSelectedCategory(cat.id);

    if (cat.id === 'custom') {
      setIsModalOpen(true);
    } else {
      router.push(`/spread?category=${cat.id}&q=${encodeURIComponent(cat.defaultQuestion)}`);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    sound.playBassHit();
    setIsModalOpen(false);
    router.push(`/spread?category=custom&q=${encodeURIComponent(customQuestion.trim())}`);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="请问天机" showBack onBack={() => router.push('/')} />

      {/* Hero Title */}
      <div className="text-center space-y-1 py-1">
        <h2 className="text-2xl font-serif font-extrabold text-gold-gradient tracking-wide">
          选择你的求问领域
        </h2>
        <p className="text-xs text-stone-500 font-serif">
          心诚则灵 · 意念专一 · 契合当下因缘
        </p>
      </div>

      {/* 6 Category Tiles */}
      <div className="grid grid-cols-1 gap-2.5">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => handleSelectCategory(cat)}
              className={cn(
                'group relative p-4 rounded-2xl glass-panel border cursor-pointer transition-all duration-300 shadow-sm flex items-center justify-between',
                'hover:shadow-[0_8px_25px_rgba(212,175,55,0.2)] hover:-translate-y-0.5',
                cat.border
              )}
            >
              <div className="flex items-center gap-3.5">
                <div className={cn('p-2.5 rounded-xl bg-amber-50/80 border border-amber-300/60 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform')}>
                  <Icon className={cn('w-5 h-5', cat.iconColor)} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                      {cat.title}
                    </span>
                    <span className="text-[10px] text-stone-400 font-sans uppercase">
                      {cat.titleEn}
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 font-serif mt-0.5">
                    {cat.desc}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-800 opacity-80 group-hover:opacity-100 group-hover:bg-amber-100 transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Custom Question Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-sm bg-[#FAF8F5] border-2 border-amber-400 rounded-3xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <h3 className="text-sm font-serif font-bold text-stone-900">
                    亲笔书写你的困惑
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCustomSubmit} className="space-y-3">
                <textarea
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="例如：我准备在今年下半年与朋友合伙创业，未来走势与注意事项如何？"
                  rows={4}
                  className="w-full p-3.5 rounded-2xl bg-white border border-amber-300/80 text-stone-900 placeholder:text-stone-400 text-xs font-serif focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 transition-all resize-none shadow-inner"
                  autoFocus
                />

                <div className="flex items-center justify-between text-[11px] text-stone-400 font-serif px-1">
                  <span>诚心静念 · 意向越明确越吉</span>
                  <span>{customQuestion.length}/100</span>
                </div>

                <button
                  type="submit"
                  disabled={!customQuestion.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-sm shadow-[0_4px_16px_rgba(212,175,55,0.35)] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                >
                  进入神谕牌阵
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
