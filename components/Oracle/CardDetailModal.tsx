'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OracleCardData } from '@/types/oracle';
import { OracleCard } from '@/components/Cards/OracleCard';
import { X, Sparkles, Heart, Briefcase, Coins, Sun, Moon, Zap, ShieldCheck } from 'lucide-react';
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
  const manif = card.manifestationResult;

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
          className="relative z-10 w-full max-w-[440px] max-h-[88vh] bg-[#FAF8F5] border-t-2 border-amber-400 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
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

                {/* V5 Manifestation Current Badge if Available */}
                {manif && (
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-serif font-black border ${
                        manif.manifestation === 'light'
                          ? 'bg-amber-100 border-amber-400 text-amber-950'
                          : manif.manifestation === 'transformative'
                          ? 'bg-purple-100 border-purple-400 text-purple-950'
                          : manif.manifestation === 'shadow'
                          ? 'bg-stone-200 border-stone-400 text-stone-800'
                          : 'bg-stone-100 border-stone-300 text-stone-600'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>当次显相：{manif.manifestation === 'light' ? '光相 · 顺势显化' : manif.manifestation === 'transformative' ? '转化相 · 破旧转新' : manif.manifestation === 'shadow' ? '影相 · 失衡显化' : '平相 · 能量未定'}</span>
                    </span>
                  </div>
                )}

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

            {/* V5 4-Phase Manifestation Spectrum (光相 / 平相 / 影相 / 转化相) */}
            <div className="space-y-2 pt-1 border-t border-stone-200">
              <span className="text-xs font-serif font-bold text-stone-900 block">
                四相显化全谱系 (Manifestation Spectrum)
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs font-serif">
                {/* Light */}
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-300">
                  <span className="font-bold text-amber-950 block mb-0.5">✦ 光相 · 顺势</span>
                  <p className="text-[11px] text-stone-700 leading-relaxed">
                    {card.manifestation?.light?.meaning || card.upright}
                  </p>
                </div>

                {/* Neutral */}
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-700 block mb-0.5">◎ 平相 · 未定</span>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {card.manifestation?.neutral?.meaning || '能量初现，静候时机成型。'}
                  </p>
                </div>

                {/* Shadow */}
                <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-300">
                  <span className="font-bold text-stone-800 block mb-0.5">⚠ 影相 · 失衡</span>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {card.manifestation?.shadow?.meaning || card.shadow}
                  </p>
                </div>

                {/* Transformative */}
                <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-300">
                  <span className="font-bold text-purple-950 block mb-0.5">☯ 转化相 · 破立</span>
                  <p className="text-[11px] text-stone-700 leading-relaxed">
                    {card.manifestation?.transformative?.meaning || '旧局解体，新机由此生发。'}
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Realms Detail */}
            <div className="space-y-2 pt-1 border-t border-stone-200">
              <span className="text-xs font-serif font-bold text-stone-900 block">
                各领域指引
              </span>

              <div className="p-2.5 rounded-xl bg-white border border-rose-200 flex items-start gap-2 shadow-xs">
                <Heart className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-serif font-bold text-rose-900">感情 · 缘分</span>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    {card.manifestation?.light?.love || card.love}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 flex items-start gap-2 shadow-xs">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-serif font-bold text-emerald-900">事业 · 功名</span>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    {card.manifestation?.light?.career || card.career}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-start gap-2 shadow-xs">
                <Coins className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-serif font-bold text-amber-900">财富 · 机遇</span>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    {card.manifestation?.light?.wealth || card.wealth}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-stone-200 bg-white">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-amber-500 text-stone-950 font-serif font-black text-xs hover:bg-amber-400 transition-colors shadow-xs"
            >
              已阅神谕典籍
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
