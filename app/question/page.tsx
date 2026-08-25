'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { QuestionCategory } from '@/types/oracle';
import { Heart, Coins, Briefcase, Users, Moon, Sparkles, ArrowRight, X, Compass } from 'lucide-react';
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
      titleEn: 'Love & Affinity',
      realmTag: '♥ 心界共鸣',
      desc: '正缘桃花 · 情感走向 · 修复与和合',
      icon: Heart,
      color: 'from-rose-50/80 via-white to-rose-50/40',
      border: 'border-rose-300/80 hover:border-rose-400',
      iconColor: 'text-rose-700 bg-rose-100/80 border-rose-300',
      defaultQuestion: '我近期的感情走向与桃花正缘如何？',
    },
    {
      id: 'wealth' as QuestionCategory,
      title: '财富 · 财帛',
      titleEn: 'Wealth & Commerce',
      realmTag: '♦ 财界生发',
      desc: '正偏财运 · 投资机遇 · 聚财生金',
      icon: Coins,
      color: 'from-amber-50/90 via-white to-amber-50/40',
      border: 'border-amber-400 hover:border-amber-500',
      iconColor: 'text-amber-800 bg-amber-100/90 border-amber-400',
      defaultQuestion: '我接下来的财运与投资机运如何？',
    },
    {
      id: 'career' as QuestionCategory,
      title: '事业 · 功名',
      titleEn: 'Career & Power',
      realmTag: '♣ 生界进取',
      desc: '晋升突破 · 跳槽创业 · 智谋与名望',
      icon: Briefcase,
      color: 'from-emerald-50/80 via-white to-emerald-50/40',
      border: 'border-emerald-300/80 hover:border-emerald-400',
      iconColor: 'text-emerald-800 bg-emerald-100/80 border-emerald-300',
      defaultQuestion: '我未来3个月事业发展与晋升机缘如何？',
    },
    {
      id: 'relationship' as QuestionCategory,
      title: '人际 · 贵人',
      titleEn: 'Allies & Benefactors',
      realmTag: '♣ 贵人扶持',
      desc: '良师提携 · 合作契合 · 化解纷扰',
      icon: Users,
      color: 'from-cyan-50/80 via-white to-cyan-50/40',
      border: 'border-cyan-300/80 hover:border-cyan-400',
      iconColor: 'text-cyan-800 bg-cyan-100/80 border-cyan-300',
      defaultQuestion: '我近期是否会遇到关键贵人与得力助手？',
    },
    {
      id: 'general' as QuestionCategory,
      title: '综合 · 天命',
      titleEn: 'Destiny & Fortune',
      realmTag: '♠ 玄界洞察',
      desc: '乾坤大势 · 身心安泰 · 阶段破局',
      icon: Moon,
      color: 'from-purple-50/80 via-white to-purple-50/40',
      border: 'border-purple-300/80 hover:border-purple-400',
      iconColor: 'text-purple-800 bg-purple-100/80 border-purple-300',
      defaultQuestion: '我当下的整体运势走向与破局指引是什么？',
    },
    {
      id: 'custom' as QuestionCategory,
      title: '亲笔 · 自定义',
      titleEn: 'Custom Inquiry',
      realmTag: '☯ 心诚则应',
      desc: '亲笔写下心中最关切的困惑 · 专属推演',
      icon: Sparkles,
      color: 'from-amber-100/70 via-white to-amber-50/80',
      border: 'border-amber-500/80 hover:border-amber-600',
      iconColor: 'text-amber-900 bg-amber-200/80 border-amber-500',
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

  const handleCustomSubmit = () => {
    if (!customQuestion.trim()) return;
    sound.playBassHit();
    setIsModalOpen(false);
    router.push(`/spread?category=custom&q=${encodeURIComponent(customQuestion)}`);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none animate-fade-in">
      <TopHeader title="问卦择事" showBack onBack={() => router.push('/')} />

      {/* Header Introduction */}
      <div className="pt-2 text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/70 border border-amber-400/60 text-amber-950 text-[10.5px] font-serif font-bold shadow-2xs">
          <span>01 · 诚心定意</span>
        </div>
        <h1 className="text-2xl font-serif font-black text-gold-gradient tracking-wide">
          你心中关切何事？
        </h1>
        <p className="text-xs text-stone-600 font-serif font-medium">
          天机感应，因念而生 · 请选择对应的命理向度
        </p>
      </div>

      {/* Category List Cards */}
      <div className="grid grid-cols-1 gap-3 pt-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleSelectCategory(cat)}
              className={cn(
                'w-full p-4 rounded-3xl bg-gradient-to-r border-2 cursor-pointer transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-md flex items-center justify-between group',
                cat.color,
                cat.border
              )}
            >
              <div className="flex items-center gap-3.5">
                {/* Icon Emblem */}
                <div className={cn('w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xs transition-transform group-hover:scale-105', cat.iconColor)}>
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>

                {/* Details */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-serif font-black text-stone-900 group-hover:text-amber-950 transition-colors">
                      {cat.title}
                    </h3>
                    <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-white/90 border border-stone-200 text-stone-600 font-serif font-bold">
                      {cat.realmTag}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-serif font-medium">
                    {cat.desc}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="p-2 rounded-full bg-white/80 border border-stone-200 text-stone-400 group-hover:text-amber-900 group-hover:border-amber-400 group-hover:translate-x-1 transition-all shadow-2xs">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Custom Question Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm p-6 rounded-3xl bg-[#FAF8F5] border-2 border-amber-400/80 shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 border border-amber-400 flex items-center justify-center text-amber-900 font-serif text-lg shadow-xs">
                  ☯
                </div>
                <h3 className="text-lg font-serif font-black text-stone-900">
                  亲笔书写你的困惑
                </h3>
                <p className="text-xs text-stone-500 font-serif">
                  越具体清晰，天机指引越精准明晰
                </p>
              </div>

              <textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="例如：我当下该不该接受新的合伙人邀请？"
                className="w-full h-28 p-3 rounded-2xl bg-white border border-stone-300 text-stone-900 text-sm font-serif focus:outline-hidden focus:border-amber-500 shadow-inner resize-none placeholder:text-stone-400"
                maxLength={80}
              />

              <button
                onClick={handleCustomSubmit}
                disabled={!customQuestion.trim()}
                className={cn(
                  'w-full py-3.5 rounded-2xl font-serif font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all',
                  customQuestion.trim()
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-95'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                )}
              >
                <Sparkles className="w-4 h-4" />
                <span>定意起卦 ➔ 选择牌阵</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
