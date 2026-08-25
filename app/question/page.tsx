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
      color: 'from-rose-950/60 to-neutral-950',
      border: 'border-rose-500/30 hover:border-rose-400',
      iconColor: 'text-rose-400',
      defaultQuestion: '我近期的感情走向与桃花正缘如何？',
    },
    {
      id: 'wealth' as QuestionCategory,
      title: '财富 · 财帛',
      titleEn: 'Wealth & Finance',
      symbol: '💰',
      desc: '正偏财运 · 投资机遇 · 财库丰盈',
      icon: Coins,
      color: 'from-amber-950/60 to-neutral-950',
      border: 'border-amber-500/30 hover:border-amber-400',
      iconColor: 'text-amber-400',
      defaultQuestion: '我接下来的财运与投资机运如何？',
    },
    {
      id: 'career' as QuestionCategory,
      title: '事业 · 功名',
      titleEn: 'Career & Power',
      symbol: '💼',
      desc: '晋升突破 · 跳槽创业 · 项目落地',
      icon: Briefcase,
      color: 'from-emerald-950/60 to-neutral-950',
      border: 'border-emerald-500/30 hover:border-emerald-400',
      iconColor: 'text-emerald-400',
      defaultQuestion: '我未来3个月事业发展与晋升机缘如何？',
    },
    {
      id: 'relationship' as QuestionCategory,
      title: '人际 · 贵人',
      titleEn: 'Allies & Harmony',
      symbol: '👥',
      desc: '良师提携 · 合作契合 · 远离小人',
      icon: Users,
      color: 'from-purple-950/60 to-neutral-950',
      border: 'border-purple-500/30 hover:border-purple-400',
      iconColor: 'text-purple-400',
      defaultQuestion: '我近期是否会遇到关键贵人与得力助手？',
    },
    {
      id: 'general' as QuestionCategory,
      title: '综合 · 天命',
      titleEn: 'Destiny & Fortune',
      symbol: '🌙',
      desc: '乾坤大势 · 身心安泰 · 阶段推演',
      icon: Moon,
      color: 'from-blue-950/60 to-neutral-950',
      border: 'border-blue-500/30 hover:border-blue-400',
      iconColor: 'text-cyan-400',
      defaultQuestion: '我当下的整体运势走向与破局指引是什么？',
    },
    {
      id: 'custom' as QuestionCategory,
      title: '自定义 · 问事',
      titleEn: 'Custom Inquiry',
      symbol: '🔮',
      desc: '亲笔写下最关切的问题 · 专属推演',
      icon: Sparkles,
      color: 'from-yellow-950/60 via-amber-950/40 to-neutral-950',
      border: 'border-amber-400/50 hover:border-amber-300',
      iconColor: 'text-yellow-300',
      defaultQuestion: '',
    },
  ];

  const handleSelectCategory = (cat: typeof categories[0]) => {
    sound.playCardSelect();
    setSelectedCategory(cat.id);

    if (cat.id === 'custom') {
      setIsModalOpen(true);
    } else {
      // Direct advance with default question
      router.push(`/spread?category=${cat.id}&q=${encodeURIComponent(cat.defaultQuestion)}`);
    }
  };

  const handleConfirmCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    sound.playBassHit();
    setIsModalOpen(false);
    router.push(`/spread?category=custom&q=${encodeURIComponent(customQuestion)}`);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-6 space-y-4">
      <TopHeader showBack onBack={() => router.push('/')} />

      {/* Title */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-serif mb-1">
          <span>01 · 诚意正心</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-gold-gradient tracking-wide">
          你今天想问什么？
        </h1>
        <p className="text-xs text-neutral-400 font-serif mt-1">
          心诚则灵 · 选定你想洞察的命理领域
        </p>
      </div>

      {/* 6 Large Category Selection Cards */}
      <div className="grid grid-cols-1 gap-3 pt-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className={cn(
                'w-full p-4 rounded-2xl bg-gradient-to-r border text-left flex items-center justify-between transition-all duration-300 active:scale-[0.98] group relative overflow-hidden',
                cat.color,
                cat.border,
                cat.id === 'custom' && 'shadow-[0_0_20px_rgba(212,175,55,0.2)]'
              )}
            >
              <div className="flex items-center gap-3.5 relative z-10">
                {/* Symbol Box */}
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-neutral-700/60 flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-inner">
                  {cat.symbol}
                </div>

                {/* Text Content */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-serif font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                      {cat.title}
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-sans tracking-wider uppercase">
                      {cat.titleEn}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-serif mt-0.5">
                    {cat.desc}
                  </p>
                </div>
              </div>

              {/* Right Arrow */}
              <div className="relative z-10 text-neutral-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
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
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-sm glass-panel rounded-3xl p-5 border border-amber-400/40 shadow-2xl bg-[#0e1018]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm">
                  <span>🔮</span>
                  <span>请输入你最想知道的问题</span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmCustom} className="mt-4 space-y-4">
                <div>
                  <textarea
                    rows={3}
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="例如：我未来3个月事业会有什么变化？"
                    className="w-full p-3 rounded-xl bg-neutral-900/90 border border-neutral-700 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 resize-none font-serif leading-relaxed"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomQuestion('我未来3个月事业会有什么重大转机？');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-amber-300 transition-colors"
                  >
                    事业转机
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomQuestion('我和当下的有缘人未来走向如何？');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-amber-300 transition-colors"
                  >
                    情感走向
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!customQuestion.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed tracking-wider"
                >
                  开启专属神谕
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
