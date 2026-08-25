'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OracleCardData } from '@/types/oracle';
import { OracleCard } from '@/components/Cards/OracleCard';
import { X, Sparkles, Heart, Briefcase, Coins, Compass, Sun, Moon } from 'lucide-react';
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
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Bottom Sheet Modal */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-[440px] max-h-[85vh] bg-[#0c0e15] border-t border-amber-500/30 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Handle & Close */}
          <div className="w-full flex items-center justify-between px-6 pt-4 pb-2 border-b border-neutral-800/60">
            <div className="flex items-center gap-2">
              <span className="text-amber-300 text-lg">☯</span>
              <h2 className="text-base font-serif font-bold text-amber-200">
                神谕圣典 · {card.cardName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Card Hero Preview */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="w-24 flex-shrink-0">
                <OracleCard card={card} size="sm" isCompact />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-lg font-serif font-bold text-amber-100">{card.cardName}</span>
                  <span className="text-xs text-amber-400/90 font-serif">【{card.archetype}】</span>
                </div>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-serif">
                    {card.realm || suitInfo.name} ({card.rank})
                  </span>
                  <span className={`px-2 py-0.5 rounded-md font-serif ${elementStyle.bg} ${elementStyle.text}`}>
                    {card.elementName} · {card.yinYang === 'yang' ? '阳' : '阴'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-800/80 text-amber-300/80 font-serif text-[10px]">
                    {TYPE_NAME_MAP[card.type] || card.type}
                  </span>
                </div>
                <div className="text-xs text-amber-300/90 font-serif font-medium mt-0.5">
                  关键词：{card.keywords.join(' · ')}
                </div>
              </div>
            </div>

            {/* Oracle Message */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-serif font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>神谕玄机启示</span>
              </div>
              <p className="text-xs text-neutral-200 font-serif italic leading-relaxed">
                “{card.oracle}”
              </p>
            </div>

            {/* Upright & Shadow Duality */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Upright */}
              <div className="p-3 rounded-xl bg-neutral-900/70 border border-emerald-500/20">
                <div className="flex items-center gap-1 text-xs font-serif font-bold text-emerald-400 mb-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span>顺势 · 正位</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                  {card.upright}
                </p>
              </div>

              {/* Shadow */}
              <div className="p-3 rounded-xl bg-neutral-900/70 border border-purple-500/20">
                <div className="flex items-center gap-1 text-xs font-serif font-bold text-purple-400 mb-1">
                  <Moon className="w-3.5 h-3.5" />
                  <span>考验 · 逆位</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                  {card.shadow}
                </p>
              </div>
            </div>

            {/* Three Realms Breakdown: Love / Career / Wealth */}
            <div className="space-y-2">
              <h4 className="text-xs font-serif font-bold text-neutral-300">三界具体指引</h4>

              {/* Love */}
              <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-rose-500/20 flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-serif font-bold text-rose-300 block">感情 · 缘分</span>
                  <p className="text-[11px] text-neutral-300 leading-relaxed mt-0.5">{card.love}</p>
                </div>
              </div>

              {/* Career */}
              <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-emerald-500/20 flex items-start gap-2.5">
                <Briefcase className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-serif font-bold text-emerald-300 block">事业 · 功名</span>
                  <p className="text-[11px] text-neutral-300 leading-relaxed mt-0.5">{card.career}</p>
                </div>
              </div>

              {/* Wealth */}
              <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-amber-500/20 flex items-start gap-2.5">
                <Coins className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-serif font-bold text-amber-300 block">财富 · 资产</span>
                  <p className="text-[11px] text-neutral-300 leading-relaxed mt-0.5">{card.wealth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Close Action */}
          <div className="p-4 border-t border-neutral-800/80 bg-[#090b10]">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-serif text-sm transition-colors"
            >
              关闭
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
