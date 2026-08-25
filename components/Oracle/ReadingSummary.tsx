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
} from 'lucide-react';
import { formatElementColor } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ShareCardModal } from '@/components/Sharing/ShareCardModal';
import { PaywallModal } from '@/components/Premium/PaywallModal';

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
  const [selectedExplainCombo, setSelectedExplainCombo] = useState(reading.combinationsAnalysis?.[0] || null);

  // Accordions
  const [showElementsAccordion, setShowElementsAccordion] = useState(true);
  const [showDomainAccordion, setShowDomainAccordion] = useState(true);

  const momentum = reading.momentumAnalysis;
  const scores = reading.scoreAnalysis;
  const elements = reading.elementsAnalysis;
  const yinYang = reading.yinYangAnalysis;
  const timing = reading.timingAnalysis;
  const narrative = reading.narrativeAnalysis;
  const combos = reading.combinationsAnalysis || [];
  const personalMod = reading.personalModification;

  const currentNarrativeText = narrative.modeNarratives?.[activeNarrativeMode] || narrative.synthesisNarrative;

  return (
    <div className="w-full space-y-4 select-none">
      {/* ========================================================= */}
      {/* 01. 核心结论 (Hero Core Verdict) */}
      {/* ========================================================= */}
      <div className="w-full glass-panel rounded-3xl p-5 border border-amber-500/30 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-amber-400" />
            <h3 className="text-xs font-serif font-bold text-amber-300 tracking-widest uppercase">
              本次天机 · 核心总纲
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-2 py-0.5 rounded-full text-[10px] font-serif border border-amber-500/40 bg-amber-950/60 text-amber-300 hover:bg-amber-900 flex items-center gap-1 transition-colors"
            >
              <Share2 className="w-3 h-3" />
              <span>分享海报</span>
            </button>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <h2 className="text-2xl font-serif font-extrabold text-gold-gradient tracking-wide mb-1">
          {narrative.coreTheme.title}
        </h2>
        <p className="text-xs text-amber-300/80 font-serif italic mb-3">
          {narrative.coreTheme.subtitle}
        </p>

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
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-serif transition-colors flex-shrink-0 ${
                activeNarrativeMode === m.key
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
              }`}
            >
              {m.label}解读
            </button>
          ))}
        </div>

        {/* Dynamic Mode Synthesis Paragraph */}
        <div className="text-sm font-serif text-neutral-200 leading-relaxed bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800 whitespace-pre-line">
          {currentNarrativeText}
        </div>

        {/* 3 Core Index Badges */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-800/80 text-center">
          <div className="p-2 rounded-xl bg-neutral-900/80 border border-amber-500/20">
            <div className="text-[10px] text-neutral-400 font-serif">综合支持度</div>
            <div className="text-xl font-mono font-extrabold text-amber-300">{scores.overall}</div>
          </div>
          <div className="p-2 rounded-xl bg-neutral-900/80 border border-yellow-500/20">
            <div className="text-[10px] text-neutral-400 font-serif">行动势能</div>
            <div className="text-xl font-mono font-extrabold text-yellow-400">{scores.action}</div>
          </div>
          <div className="p-2 rounded-xl bg-neutral-900/80 border border-purple-500/20">
            <div className="text-[10px] text-neutral-400 font-serif">挑战淬炼</div>
            <div className="text-xl font-mono font-extrabold text-purple-300">{scores.challenge}</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* V3 对你的影响 (Personal Relevance & Modification Banner) */}
      {/* ========================================================= */}
      {personalMod && (
        <div className="w-full glass-panel rounded-2xl p-4 border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-neutral-900 to-neutral-950 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-serif font-bold text-amber-200">
                对你的个人影响 · {personalMod.elementAdjustmentTitle}
              </h4>
            </div>

            <button
              onClick={() => setIsPersonalExplainOpen(true)}
              className="text-[10px] text-amber-300 hover:text-white flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 transition-colors"
            >
              <span>关联度 {personalMod.personalRelevance}%</span>
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 font-serif leading-relaxed">
            {personalMod.elementAdjustmentMessage}
          </p>

          {/* Repeated Archetype Alert if triggered */}
          {personalMod.repeatedArchetypeAlert && (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs font-serif text-amber-200">
              <span className="font-bold block mb-0.5">
                高频神谕原型 · {personalMod.repeatedArchetypeAlert.cardName} ({personalMod.repeatedArchetypeAlert.archetype}) × {personalMod.repeatedArchetypeAlert.count}
              </span>
              <span className="text-[11px] text-neutral-300">
                {personalMod.repeatedArchetypeAlert.insight}
              </span>
            </div>
          )}

          {/* Compare Previous Reading in same domain */}
          {personalMod.trendComparison && (
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-serif space-y-1">
              <div className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>与上次同类问卦相比：{personalMod.trendComparison.trendEvaluation === 'improving' ? '趋势显著改善' : '稳步调整中'}</span>
              </div>
              <p className="text-[11px] text-neutral-300">
                {personalMod.trendComparison.trendMessage}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 02. 本次牌势 (Momentum Animated 3-Node Sequence) */}
      {/* ========================================================= */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>本次牌势 · 气运轨迹</span>
          </h4>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-serif border ${momentum.badgeColor}`}>
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
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-neutral-900 border border-amber-400/50 flex items-center justify-center text-xs font-mono font-bold text-amber-300 shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                  0{idx + 1}
                </div>
                <span className="text-[11px] font-serif font-bold text-neutral-200 mt-1.5 text-center">
                  {step}
                </span>
              </motion.div>

              {idx < momentum.sequence.length - 1 && (
                <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500/40 via-amber-400/80 to-amber-500/40 mx-2 -mt-5 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-xs text-neutral-300 font-serif leading-relaxed bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-800/80">
          {momentum.summary}
        </p>
      </div>

      {/* ========================================================= */}
      {/* 04. 重要牌势组合 (Combination Cards) & Explain Why */}
      {/* ========================================================= */}
      {combos.length > 0 && (
        <div className="w-full glass-panel rounded-2xl p-4 border border-amber-500/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>重要牌势组合</span>
            </h4>
            <button
              onClick={() => {
                setSelectedExplainCombo(combos[0]);
                setIsExplainModalOpen(true);
              }}
              className="text-[10px] text-amber-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              <span>为什么这样解读？</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {combos.slice(0, 2).map((combo, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 via-neutral-900 to-neutral-950 border border-amber-500/20 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-amber-300">
                    {combo.cardNames.join(' + ')}
                  </span>
                  <span className="text-[10px] text-amber-400 font-serif font-bold">
                    ★★★★★ {combo.title}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 font-serif leading-relaxed">
                  {combo.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 05. 专题领域洞察 (Domain Narrative) */}
      {/* ========================================================= */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800 space-y-2">
        <button
          onClick={() => setShowDomainAccordion(!showDomainAccordion)}
          className="w-full flex items-center justify-between text-left"
        >
          <h4 className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>专项运势推演 ({reading.questionClassified?.subCategoryName || '命盘洞察'})</span>
          </h4>
          {showDomainAccordion ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {showDomainAccordion && (
          <div className="space-y-2 pt-1 animate-fade-in">
            <p className="text-xs text-neutral-200 font-serif leading-relaxed bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
              {narrative.domainNarrative}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs font-serif">
                <span className="text-neutral-400">财富机遇</span>
                <span className="text-amber-300 font-mono font-bold">{scores.wealth}</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs font-serif">
                <span className="text-neutral-400">事业权柄</span>
                <span className="text-emerald-300 font-mono font-bold">{scores.career}</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs font-serif">
                <span className="text-neutral-400">情感和合</span>
                <span className="text-rose-300 font-mono font-bold">{scores.love}</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs font-serif">
                <span className="text-neutral-400">贵人扶持</span>
                <span className="text-purple-300 font-mono font-bold">{scores.noble}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 06. 五行流转与阴阳平衡 */}
      {/* ========================================================= */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800 space-y-3">
        <button
          onClick={() => setShowElementsAccordion(!showElementsAccordion)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-serif">☯</span>
            <h4 className="text-xs font-serif font-bold text-neutral-300">
              五行偏向与阴阳平衡 ({elements.dominantLabel})
            </h4>
          </div>
          {showElementsAccordion ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {showElementsAccordion && (
          <div className="space-y-3 pt-1 animate-fade-in">
            <div className="w-full h-2.5 rounded-full bg-neutral-900 overflow-hidden flex border border-neutral-800">
              <div style={{ width: `${elements.percentages.wood}%` }} className="h-full bg-emerald-500" title="木" />
              <div style={{ width: `${elements.percentages.fire}%` }} className="h-full bg-rose-500" title="火" />
              <div style={{ width: `${elements.percentages.earth}%` }} className="h-full bg-amber-500" title="土" />
              <div style={{ width: `${elements.percentages.metal}%` }} className="h-full bg-yellow-400" title="金" />
              <div style={{ width: `${elements.percentages.water}%` }} className="h-full bg-cyan-400" title="水" />
            </div>

            <div className="flex items-center justify-between text-[10px] font-serif text-neutral-400 px-1">
              <span>木 {elements.percentages.wood}%</span>
              <span>火 {elements.percentages.fire}%</span>
              <span>土 {elements.percentages.earth}%</span>
              <span>金 {elements.percentages.metal}%</span>
              <span>水 {elements.percentages.water}%</span>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs font-serif">
              <span className="text-neutral-400">阴阳态势</span>
              <span className="text-amber-200 font-bold">{yinYang.stateLabel}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-serif">
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                <span className="text-emerald-400 font-bold block">宜 · 顺势而行</span>
                <ul className="text-[11px] text-neutral-300 space-y-0.5 list-disc list-inside">
                  {elements.advice.favorable.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/20 space-y-1">
                <span className="text-rose-400 font-bold block">避 · 慎防消耗</span>
                <ul className="text-[11px] text-neutral-300 space-y-0.5 list-disc list-inside">
                  {elements.advice.unfavorable.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 07. 关键时间窗口 */}
      {/* ========================================================= */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>关键能量窗口</span>
          </h4>
          <span className="text-[10px] text-amber-300 font-serif font-bold px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30">
            {timing.primaryWindow}
          </span>
        </div>

        <p className="text-xs text-neutral-200 font-serif leading-relaxed bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-800">
          {timing.timingDesc} 次要观察窗口为 <span className="text-amber-300">{timing.secondaryWindow}</span>。
        </p>
      </div>

      {/* ========================================================= */}
      {/* 08. 行动建议与注意事项 */}
      {/* ========================================================= */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800 space-y-3">
        <h4 className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>今日处事建议与注意事项</span>
        </h4>

        <div className="space-y-2">
          {narrative.actions.map((act, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-900/50 border border-neutral-800/80 text-xs font-serif text-neutral-200">
              <span className="w-4 h-4 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{act}</span>
            </div>
          ))}
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-amber-500/20 text-xs font-serif text-amber-200/90 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span>特别防范</span>
          </div>
          <p className="text-[11px] text-neutral-300">{narrative.cautions[0]}</p>
        </div>

        {/* 今日一句 Closing Quote */}
        {personalMod?.closingOraclePhrase && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 to-neutral-900 border border-amber-500/30 text-center">
            <span className="text-[11px] text-amber-300 font-serif italic">
              “{personalMod.closingOraclePhrase}”
            </span>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 09. 继续追问天机 (Follow-Up Engine & Clarifier) */}
      {/* ========================================================= */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-amber-500/40 space-y-3 bg-gradient-to-b from-[#131722] to-[#0a0c12]">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>继续追问天机 · 澄清深意</span>
          </h4>
          <button
            onClick={() => setIsPaywallOpen(true)}
            className="text-[10px] text-amber-400/90 hover:text-amber-300 flex items-center gap-1 font-serif"
          >
            <Crown className="w-3 h-3" />
            <span>特权充能</span>
          </button>
        </div>

        <p className="text-xs text-neutral-300 font-serif">
          针对当前卦象，您可以选择一个核心方向进一步抽牌澄清：
        </p>

        <div className="space-y-2 pt-1">
          {reading.followUpOptions?.map((opt) => (
            <div
              key={opt.id}
              className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/60 hover:border-amber-400 flex items-center justify-between gap-2 transition-all group"
            >
              <div className="flex-1">
                <span className="text-xs font-serif text-neutral-200 group-hover:text-amber-300 transition-colors block">
                  {opt.question}
                </span>
                <span className="text-[9px] text-neutral-400 font-serif">
                  领域：{opt.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onSelectFollowUp?.(opt.question, 1)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-amber-950 border border-amber-500/30 text-amber-300 text-[10px] font-serif transition-colors"
                >
                  1牌澄清 (10令)
                </button>
                <button
                  onClick={() => onSelectFollowUp?.(opt.question, 3)}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-serif font-bold shadow-md active:scale-95 transition-all"
                >
                  3牌深推 (20令)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 10. Developer Debug Mode (?debug=true) */}
      {/* ========================================================= */}
      {isDebugMode && (
        <div className="w-full p-4 rounded-2xl bg-black border border-emerald-500/40 text-emerald-400 font-mono text-[11px] space-y-2 overflow-x-auto">
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-300">
            <Code className="w-4 h-4" />
            <span>TIANJI 52 V3 Engine Diagnostic Debug</span>
          </div>
          <pre className="text-[10px] leading-relaxed text-emerald-300/80">
            {JSON.stringify(
              {
                questionClassified: reading.questionClassified,
                momentum: reading.momentumAnalysis.type,
                combinations: reading.combinationsAnalysis.map((c) => c.title),
                elementsDominant: reading.elementsAnalysis.dominantLabel,
                timingWindow: reading.timingAnalysis.primaryWindow,
                scores: reading.scoreAnalysis,
                personalModification: reading.personalModification,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {/* Explain Why Modal */}
      <AnimatePresence>
        {isExplainModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExplainModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative z-10 w-full max-w-[440px] max-h-[80vh] bg-[#0c0e15] border-t border-amber-500/30 rounded-t-3xl shadow-2xl p-5 overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-serif font-bold text-amber-200">
                    天机推演逻辑 · 为什么这样解读？
                  </h3>
                </div>
                <button onClick={() => setIsExplainModalOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-serif text-neutral-300">
                <p className="text-neutral-400 leading-relaxed">
                  《天机52》智能引擎并非随机生成吉凶，而是根据<span className="text-amber-300 font-bold">【牌位上下文 + 五行流转 + 组合牌义 + 阴阳动能】</span>严格推导：
                </p>

                {selectedExplainCombo && (
                  <div className="p-3 rounded-xl bg-neutral-900 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>命理组合：{selectedExplainCombo.title}</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      {selectedExplainCombo.patternReason}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {selectedExplainCombo.tags.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-neutral-800 text-amber-400/80 text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsExplainModalOpen(false)}
                className="w-full py-3 rounded-xl bg-neutral-800 text-neutral-200 font-serif text-xs hover:bg-neutral-700 transition-colors"
              >
                我已明悉天机
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Personal Relevance Explain Modal (为什么与我相关？) */}
      <AnimatePresence>
        {isPersonalExplainOpen && personalMod && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPersonalExplainOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative z-10 w-full max-w-[440px] max-h-[80vh] bg-[#0c0e15] border-t border-amber-500/30 rounded-t-3xl shadow-2xl p-5 overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-serif font-bold text-amber-200">
                    天机档案 · 为什么与我深度相关？
                  </h3>
                </div>
                <button onClick={() => setIsPersonalExplainOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-serif text-neutral-300">
                <p className="text-neutral-400 leading-relaxed">
                  系统将本次神谕与你的<span className="text-amber-300 font-bold">【出生年份五行 + 近30天占验轨迹 + 当前问卦领域】</span>进行了深度矩阵拟合：
                </p>

                {personalMod.explainReasons.map((reason, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <span className="text-amber-400 font-bold block">{reason.title}</span>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">{reason.detail}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsPersonalExplainOpen(false)}
                className="w-full py-3 rounded-xl bg-amber-500 text-black font-serif font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                已悉知个人关联
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
