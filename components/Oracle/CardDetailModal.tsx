'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OracleCardData } from '@/types/oracle';
import { OracleCard } from '@/components/Cards/OracleCard';
import { X, Sparkles, Heart, Briefcase, Coins, Sun, Moon } from 'lucide-react';
import { formatSuitInfo, formatElementColor } from '@/lib/utils';

interface CardDetailModalProps {
  card: OracleCardData | null;
  onClose: () => void;
}

const TYPE_NAME_MAP: Record<string, string> = {
  deity: '尊神',
  buddha: '如来佛祖',
  bodhisattva: '菩萨摩诃萨',
  immortal: '列位道仙',
  beast: '天机瑞兽',
  artifact: '东方上古法器',
  symbol: '乾坤道宗象征',
};

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
  if (!card) return null;

  const suitInfo = formatSuitInfo(card.suit);
  const elementStyle = formatElementColor(card.element);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
        />

        {/* Bottom Sheet Modal */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-[440px] max-h-[85vh] bg-[#FAF8F5] border-t-2 border-amber-400 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Handle & Close */}
          <div className="w-full flex items-center justify-between px-6 pt-4 pb-2 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="text-amber-700 text-lg">☯</span>
              <h2 className="text-base font-serif font-black text-stone-900">
                神谕圣典 · {card.cardName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Card Hero Preview */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-24 flex-shrink-0">
                <OracleCard card={card} size="sm" isCompact />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-lg font-serif font-black text-stone-900">{card.cardName}</span>
                  <span className="text-xs text-amber-800 font-serif font-bold">【{card.archetype}】</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-serif">
                    {card.realm || suitInfo.name} ({card.rank})
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-serif ${elementStyle.bg} ${elementStyle.text}`}>
                    {card.elementName} · {card.yinYang === 'yang' ? '阳' : '阴'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-serif text-[10px] font-bold">
                    {TYPE_NAME_MAP[card.type] || card.type}
                  </span>
                </div>
                <div className="text-xs text-stone-600 font-serif mt-0.5 font-medium">
                  关键词：{card.keywords.join(' · ')}
                </div>
              </div>
            </div>

            {/* Oracle Message */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-amber-900 font-serif font-black mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                <span>神谕天机密语</span>
              </div>
              <p className="text-xs text-stone-700 font-serif italic leading-relaxed">
                “{card.oracle}”
              </p>
            </div>

            {/* Upright & Shadow */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-1 text-xs font-serif font-bold text-emerald-900 mb-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span>顺势 · 正位</span>
                </div>
                <p className="text-[11px] text-stone-700 leading-relaxed font-sans">
                  {card.upright}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-1 text-xs font-serif font-bold text-purple-900 mb-1">
                  <Moon className="w-3.5 h-3.5" />
                  <span>考验 · 逆位</span>
                </div>
                <p className="text-[11px] text-stone-700 leading-relaxed font-sans">
                  {card.shadow}
                </p>
              </div>
            </div>

            {/* 3 Realms Detail */}
            <div className="space-y-2 pt-1 border-t border-stone-200">
              <span className="text-xs font-serif font-bold text-stone-900 block">
                三界具体显化
              </span>

              <div className="p-2.5 rounded-xl bg-white border border-rose-200 flex items-start gap-2 shadow-xs">
                <Heart className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-serif font-bold text-rose-900">感情 · 缘分</span>
                  <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">{card.love}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 flex items-start gap-2 shadow-xs">
                <Briefcase className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-serif font-bold text-emerald-900">事业 · 功名</span>
                  <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">{card.career}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-start gap-2 shadow-xs">
                <Coins className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-serif font-bold text-amber-900">财富 · 资产</span>
                  <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">{card.wealth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="p-4 border-t border-stone-200 bg-white">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-stone-900 text-stone-100 font-serif font-bold text-xs hover:bg-stone-800 transition-colors shadow-xs"
            >
              已阅知神谕圣相
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
