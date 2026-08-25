'use client';

import React, { useState } from 'react';
import { IntelligenceReadingResult, NarrativeMode } from '@/intelligence';
import {
  Sparkles,
  Compass,
  Clock,
  Zap,
  Heart,
  Briefcase,
  Coins,
  Users,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Flame,
  ShieldCheck,
  Tag,
  Code,
  X,
  Share2,
  TrendingUp,
  Crown,
  UserCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { formatElementColor } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ShareCardModal } from '@/components/Sharing/ShareCardModal';
import { PaywallModal } from '@/components/Premium/PaywallModal';
import { CardManifestationResult } from '@/types/oracle';

interface ReadingSummaryProps {
  reading: IntelligenceReadingResult;
  onSelectFollowUp?: (questionText: string, cardCount: 1 | 3) => void;
}

export const ReadingSummary: React.FC<ReadingSummaryProps> = ({ reading, onSelectFollowUp }) => {
  const searchParams = useSearchParams();
  const isDebugMode = searchParams.get('debug') === 'true';

  const [activeNarrativeMode, setActiveNarrativeMode] = useState<NarrativeMode>('standard');
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isPersonalExplainOpen, setIsPersonalExplainOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [selectedExplainCard, setSelectedExplainCard] = useState<CardManifestationResult | null>(null);

  // Accordions
  const [showElementsAccordion, setShowElementsAccordion] = useState(true);
  const [showDomainAccordion, setShowDomainAccordion] = useState(true);
  const [showManifestationAccordion, setShowManifestationAccordion] = useState(true);

  const momentum = reading.momentumAnalysis;
  const scores = reading.scoreAnalysis;
  const elements = reading.elementsAnalysis;
  const yinYang = reading.yinYangAnalysis;
  const timing = reading.timingAnalysis;
  const narrative = reading.narrativeAnalysis;
  const combos = reading.combinationsAnalysis || [];
  const personalMod = reading.personalModification;
  const cardManifestations = reading.cardManifestations || [];
  const overallManifestation = reading.overallManifestation;

  const currentNarrativeText = narrative.modeNarratives?.[activeNarrativeMode] || narrative.synthesisNarrative;

  return (
    <div className="w-full space-y-4 select-none animate-fade-in">
      {/* ========================================================= */}
      {/* 01. 核心结论 (Hero Core Verdict) */}
      {/* ========================================================= */}
      <div className="w-full glass-panel-gold rounded-3xl p-5 border-2 border-amber-400/80 relative overflow-hidden shadow-[0_12px_35px_rgba(180,140,50,0.18)]">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-amber-600 to-amber-800" />
            <h3 className="text-xs font-serif font-black text-amber-950 tracking-widest uppercase">
              本次天机 · 核心总纲
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1 rounded-full text-[11px] font-serif font-black border border-amber-400/80 bg-amber-100/80 text-amber-950 hover:bg-amber-200 flex items-center gap-1 shadow-2xs transition-all active:scale-95"
            >
              <Share2 className="w-3 h-3 text-amber-700" />
              <span>分享神谕海报</span>
            </button>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-gold-gradient tracking-wide mb-1">
          {narrative.coreTheme.title}
        </h2>
        <p className="text-xs text-amber-900 font-serif italic mb-3.5 font-bold">
          {narrative.coreTheme.subtitle}
        </p>

        {/* V5 Overall Manifestation Banner */}
        {overallManifestation && (
          <div className="mb-3.5 p-3 rounded-2xl bg-white/90 border border-amber-300/80 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-black text-amber-950 flex items-center gap-1.5">
                <span className="text-sm">☯</span>
                <span>{overallManifestation.title} · {overallManifestation.subtitle}</span>
              </span>
              <div className="flex items-center gap-1 text-[10px] font-serif font-bold">
                {overallManifestation.lightCount > 0 && <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900">{overallManifestation.lightCount}光相</span>}
                {overallManifestation.transformativeCount > 0 && <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-900">{overallManifestation.transformativeCount}转化相</span>}
                {overallManifestation.shadowCount > 0 && <span className="px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-700">{overallManifestation.shadowCount}影相</span>}
                {overallManifestation.neutralCount > 0 && <span className="px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600">{overallManifestation.neutralCount}平相</span>}
              </div>
            </div>
            <p className="text-xs text-stone-700 font-serif leading-relaxed">
              {overallManifestation.summary}
            </p>
          </div>
        )}

        {/* Narrative Mode Selector */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
          {(
            [
              { key: 'standard', label: '标准' },
              { key: 'concise', label: '简洁' },
              { key: 'deep', label: '深度' },
              { key: 'action', label: '行动' },
              { key: 'rational', label: '理性' },
            ] as { key: NarrativeMode; label: string }[]
          ).map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveNarrativeMode(m.key)}
              className={`px-3 py-1 rounded-full text-[11px] font-serif font-bold transition-all flex-shrink-0 ${
                activeNarrativeMode === m.key
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white/80 text-stone-600 border border-stone-200 hover:text-stone-900'
              }`}
            >
              {m.label}解读
            </button>
          ))}
        </div>

        {/* Dynamic Mode Synthesis Paragraph */}
        <div className="text-xs sm:text-sm font-serif text-stone-800 leading-relaxed bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-amber-300/50 whitespace-pre-line shadow-inner">
          {currentNarrativeText}
        </div>

        {/* 3 Core V5 Index Badges: Support / Challenge / Utility */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-amber-900/10 text-center">
          <div className="p-2.5 rounded-2xl bg-white border border-amber-300/60 shadow-2xs">
            <div className="text-[10px] text-stone-500 font-serif font-medium">当前支持度 (Support)</div>
            <div className="text-xl font-mono font-black text-amber-900">
              {overallManifestation ? overallManifestation.averageSupport : scores.overall}
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-rose-300/60 shadow-2xs">
            <div className="text-[10px] text-stone-500 font-serif font-medium">阻力考验度 (Challenge)</div>
            <div className="text-xl font-mono font-black text-rose-900">
              {overallManifestation ? overallManifestation.averageChallenge : scores.challenge}
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-emerald-300/60 shadow-2xs">
            <div className="text-[10px] text-stone-500 font-serif font-medium">破局价值度 (Utility)</div>
            <div className="text-xl font-mono font-black text-emerald-950">
              {overallManifestation ? overallManifestation.averageUtility : scores.action}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* V5 核心显相明细 (Manifestation Breakdown Cards)           */}
      {/* ========================================================= */}
      {cardManifestations.length > 0 && (
        <div className="w-full glass-panel rounded-3xl p-4 border border-amber-300 space-y-3 shadow-xs">
          <div
            onClick={() => setShowManifestationAccordion(!showManifestationAccordion)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-serif font-black text-stone-900">
                诸神显相分析 · 光 / 平 / 影 / 转化四相
              </h4>
            </div>
            {showManifestationAccordion ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </div>

          {showManifestationAccordion && (
            <div className="space-y-2.5 pt-1 animate-fade-in">
              {cardManifestations.map((item, idx) => {
                const isLight = item.manifestation === 'light';
                const isShadow = item.manifestation === 'shadow';
                const isTrans = item.manifestation === 'transformative';

                return (
                  <div
                    key={item.cardId + idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isLight
                        ? 'bg-gradient-to-r from-amber-50/90 via-white to-amber-50/50 border-amber-300'
                        : isTrans
                        ? 'bg-gradient-to-r from-purple-50/90 via-white to-amber-50/60 border-purple-300'
                        : isShadow
                        ? 'bg-gradient-to-r from-stone-100/90 via-white to-stone-50 border-stone-300'
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-black text-stone-900">
                            {idx + 1}. 【{item.cardName} · {item.archetype}】
                          </span>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[9.5px] font-serif font-bold border ${
                              isLight
                                ? 'bg-amber-100 border-amber-400 text-amber-950'
                                : isTrans
                                ? 'bg-purple-100 border-purple-400 text-purple-950'
                                : isShadow
                                ? 'bg-stone-200 border-stone-400 text-stone-800'
                                : 'bg-stone-100 border-stone-300 text-stone-600'
                            }`}
                          >
                            {isLight ? '✦ 光相 · 顺势显化' : isTrans ? '☯ 转化相 · 破旧转新' : isShadow ? '⚠ 影相 · 失衡显化' : '◎ 平相 · 能量未定'}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                          支持: {item.supportScore} · 考验: {item.challengeScore} · 效用: {item.utilityScore}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedExplainCard(item);
                          setIsExplainModalOpen(true);
                        }}
                        className="text-[10px] text-amber-900 hover:text-amber-950 font-serif font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 transition-colors shadow-2xs"
                      >
                        <span>显相成因</span>
                        <Info className="w-3 h-3 text-amber-700" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-700 font-serif leading-relaxed mt-2 bg-white/70 p-2.5 rounded-xl border border-stone-200/60 font-medium">
                      {item.mainMeaning}
                    </p>

                    {/* Quick 2-3 Reason Bullets */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {item.reasonCodes.slice(0, 3).map((code, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-[9.5px] px-2 py-0.2 rounded-md bg-stone-100 text-stone-600 font-serif"
                        >
                          {code === 'POSITION_FAVOR' ? '✓ 位居顺位' : code === 'QUESTION_MATCH' ? '✓ 问事高度契合' : code === 'ELEMENT_SUPPORTED' ? '✓ 得五行相生' : code === 'ELEMENT_OVERLOAD' ? '⚠ 元素过旺转影' : code === 'TRANSFORMATION_PATTERN' ? '☯ 触发转运格局' : code}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* V3 对你的影响 (Personal Relevance & Modification Banner) */}
      {/* ========================================================= */}
      {personalMod && (
        <div className="w-full glass-panel rounded-2xl p-4 border border-amber-400/50 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-serif font-bold text-amber-900">
                对你的个人影响 · {personalMod.elementAdjustmentTitle}
              </h4>
            </div>

            <button
              onClick={() => setIsPersonalExplainOpen(true)}
              className="text-[10px] font-serif font-bold text-amber-800 hover:text-amber-950 flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 transition-colors"
            >
              <span>关联度 {personalMod.personalRelevance}%</span>
              <HelpCircle className="w-3 h-3 text-amber-700" />
            </button>
          </div>

          <p className="text-xs text-stone-700 font-serif leading-relaxed">
            {personalMod.elementAdjustmentMessage}
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* 02. 本次牌势 (Momentum Animated 3-Node Sequence) */}
      {/* ========================================================= */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-amber-300/40 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>本次牌势 · 气运轨迹</span>
          </h4>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-serif font-bold bg-amber-100 text-amber-900 border border-amber-300">
            {momentum.title}
          </span>
        </div>

        {/* 3-Step Animated Nodes */}
        <div className="flex items-center justify-between relative py-2 px-1">
          {momentum.sequence.map((step, idx) => (
            <React.Fragment key={idx}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.2 + 0.1, duration: 0.4 }}
                className="flex flex-col items-center z-10"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-500 flex items-center justify-center text-xs font-mono font-black text-amber-900 shadow-xs">
                  0{idx + 1}
                </div>
                <span className="text-[11px] font-serif font-bold text-stone-800 mt-1.5 text-center">
                  {step}
                </span>
              </motion.div>

              {idx < momentum.sequence.length - 1 && (
                <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 mx-2 -mt-5 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-xs text-stone-700 font-serif leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
          {momentum.summary}
        </p>
      </div>

      {/* ========================================================= */}
      {/* 03. 行动建议 (Action Guidance: 3 Dos, 1 Avoid) */}
      {/* ========================================================= */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-amber-300/40 space-y-2.5 shadow-xs">
        <h4 className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>天机指引 · 行动定见</span>
        </h4>

        <div className="space-y-1.5">
          {narrative.actions.map((act, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs font-serif text-stone-800 bg-white/70 p-2.5 rounded-xl border border-stone-200/60">
              <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-mono font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed font-medium">{act}</span>
            </div>
          ))}
        </div>

        {narrative.cautions && (
          <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs font-serif text-rose-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">宜缓三思：</span>
              <p className="text-stone-700 leading-relaxed font-medium">{narrative.cautions}</p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 04. 追问澄清 (Follow-up Questions)                       */}
      {/* ========================================================= */}
      {reading.followUpOptions && reading.followUpOptions.length > 0 && (
        <div className="w-full glass-panel rounded-2xl p-4 border border-amber-300/40 space-y-2.5 shadow-xs">
          <h4 className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>心有未决 · 灵犀追问</span>
          </h4>

          <div className="space-y-2">
            {reading.followUpOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectFollowUp && onSelectFollowUp(opt.question, 1)}
                className="w-full text-left p-3 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors block">
                    {opt.question}
                  </span>
                  <span className="text-[10px] text-stone-500 font-serif">
                    {opt.category}
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-[10px] font-serif font-bold text-amber-900 whitespace-nowrap flex-shrink-0">
                  一牌定音
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* V5 Manifestation Explain Bottom Sheet */}
      <AnimatePresence>
        {isExplainModalOpen && selectedExplainCard && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExplainModalOpen(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative z-10 w-full max-w-[440px] max-h-[85vh] bg-[#FAF8F5] border-t-2 border-amber-400 rounded-t-3xl shadow-2xl p-5 overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-sm font-serif font-black text-stone-900">
                    显相成因 · 【{selectedExplainCard.cardName} · {selectedExplainCard.archetype}】
                  </h3>
                  <span className="text-[11px] text-amber-900 font-serif font-bold">
                    当前判定为：{selectedExplainCard.manifestation === 'light' ? '✦ 光相' : selectedExplainCard.manifestation === 'transformative' ? '☯ 转化相' : selectedExplainCard.manifestation === 'shadow' ? '⚠ 影相' : '◎ 平相'}
                  </span>
                </div>
                <button onClick={() => setIsExplainModalOpen(false)} className="p-1 text-stone-500 hover:text-stone-900">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Explanatory Reasons */}
              <div className="space-y-2 text-xs font-serif text-stone-700">
                <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
                  <span className="font-bold text-stone-900 block">综合研判维度：</span>
                  <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                    牌的本质不变，显相取决于「问事契合度 + 牌阵方位 + 五行生克平衡 + 阴阳过旺调候 + 邻牌呼应 + 个人本命补益」。
                  </p>
                </div>

                {/* Score Breakdown (Always visible in cleaner UI) */}
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2">
                  <span className="font-bold text-amber-950 block text-[11px]">显相分数拆解 (Manifestation Breakdown)</span>
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
                    <div className="bg-white p-2 rounded-xl border border-stone-200 flex justify-between">
                      <span className="text-stone-600 font-serif">牌面基准分</span>
                      <span className="font-bold">{selectedExplainCard.breakdown.base > 0 ? `+${selectedExplainCard.breakdown.base}` : selectedExplainCard.breakdown.base}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-200 flex justify-between">
                      <span className="text-stone-600 font-serif">阵位加成</span>
                      <span className="font-bold">{selectedExplainCard.breakdown.position > 0 ? `+${selectedExplainCard.breakdown.position}` : selectedExplainCard.breakdown.position}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-200 flex justify-between">
                      <span className="text-stone-600 font-serif">问事契合</span>
                      <span className="font-bold">{selectedExplainCard.breakdown.question > 0 ? `+${selectedExplainCard.breakdown.question}` : selectedExplainCard.breakdown.question}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-200 flex justify-between">
                      <span className="text-stone-600 font-serif">五行调候</span>
                      <span className="font-bold">{selectedExplainCard.breakdown.elementRelation + selectedExplainCard.breakdown.elementBalance > 0 ? `+${selectedExplainCard.breakdown.elementRelation + selectedExplainCard.breakdown.elementBalance}` : selectedExplainCard.breakdown.elementRelation + selectedExplainCard.breakdown.elementBalance}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-200 flex justify-between">
                      <span className="text-stone-600 font-serif">阴阳态势</span>
                      <span className="font-bold">{selectedExplainCard.breakdown.yinYang > 0 ? `+${selectedExplainCard.breakdown.yinYang}` : selectedExplainCard.breakdown.yinYang}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-stone-200 flex justify-between">
                      <span className="text-stone-600 font-serif">邻位互感</span>
                      <span className="font-bold">{selectedExplainCard.breakdown.neighbors > 0 ? `+${selectedExplainCard.breakdown.neighbors}` : selectedExplainCard.breakdown.neighbors}</span>
                    </div>
                  </div>
                  <div className="pt-1.5 flex items-center justify-between text-xs font-serif font-black text-amber-950 border-t border-amber-200">
                    <span>最终显相分 (Final Score)</span>
                    <span className="font-mono text-sm">{selectedExplainCard.manifestationScore > 0 ? `+${selectedExplainCard.manifestationScore}` : selectedExplainCard.manifestationScore}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsExplainModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-amber-500 text-stone-950 font-serif font-black text-xs hover:bg-amber-400 transition-colors shadow-xs"
              >
                已明悉此牌显相之由
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        reading={reading}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
      />
    </div>
  );
};
