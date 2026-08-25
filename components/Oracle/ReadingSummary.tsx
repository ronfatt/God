'use client';

import React from 'react';
import { ReadingAnalysis } from '@/types/oracle';
import { Sparkles, Compass, Clock, Zap, ShieldCheck, Heart, Briefcase, Coins, Users, ArrowRight } from 'lucide-react';
import { formatElementColor } from '@/lib/utils';

interface ReadingSummaryProps {
  reading: ReadingAnalysis;
}

export const ReadingSummary: React.FC<ReadingSummaryProps> = ({ reading }) => {
  const dominantElementStyle = formatElementColor(reading.dominantElement);

  const radarMetrics = [
    { label: '综合命势', score: reading.overallScore, color: '#D4AF37', icon: Sparkles },
    { label: '财富机遇', score: reading.wealthScore, color: '#F59E0B', icon: Coins },
    { label: '事业功名', score: reading.careerScore, color: '#10B981', icon: Briefcase },
    { label: '情感和合', score: reading.loveScore, color: '#E11D48', icon: Heart },
    { label: '贵人引荐', score: reading.noblemanScore, color: '#A855F7', icon: Users },
  ];

  return (
    <div className="w-full space-y-4 select-none">
      {/* 01. 今日天机 Core Quote */}
      <div className="w-full glass-panel rounded-2xl p-5 border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-4 rounded-full bg-amber-400" />
          <h3 className="text-xs font-serif font-bold text-amber-300 tracking-widest uppercase">
            今日天机 · 神谕圣断
          </h3>
        </div>

        <blockquote className="text-base font-serif font-bold text-neutral-100 leading-relaxed drop-shadow-sm">
          “{reading.oracleQuote}”
        </blockquote>

        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 font-serif pt-2 border-t border-neutral-800/80">
          <span>问题：{reading.question}</span>
          <span>{reading.date}</span>
        </div>
      </div>

      {/* 02. 五项能量弧形条 (Radar Style Energy Bars) */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>五维命势流转</span>
          </h4>
          <span className="text-[10px] text-amber-400/80 font-serif">
            指数评级 · {reading.overallScore >= 85 ? '乾坤大吉' : reading.overallScore >= 75 ? '顺风顺水' : '修身守正'}
          </span>
        </div>

        <div className="space-y-2.5 pt-1">
          {radarMetrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-serif">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Icon className="w-3 h-3" style={{ color: item.color }} />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-200">{item.score}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800/80">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}66`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 03. 五行生克与走势分析 */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
            <span className="text-amber-400 font-serif">☯</span>
            <span>五行走势 · 气运互动</span>
          </h4>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-serif border ${dominantElementStyle.bg} ${dominantElementStyle.text} ${dominantElementStyle.border}`}>
            {reading.elementTrend.interaction === 'generate' ? '相生顺势' : reading.elementTrend.interaction === 'restrain' ? '能量淬炼' : '五行调和'}
          </span>
        </div>

        {/* Elements sequence flow */}
        <div className="flex items-center justify-center gap-2 py-2">
          {reading.elementTrend.sequence.map((el, i) => (
            <React.Fragment key={i}>
              <div className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-sm font-serif font-bold text-amber-300 shadow-inner">
                {el}
              </div>
              {i < reading.elementTrend.sequence.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed font-serif bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
          {reading.elementTrend.description}
        </p>
      </div>

      {/* 04. 今日行动建议 (3 Practical Advices) */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800/80 space-y-3">
        <h4 className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>今日建议 · 处事法度</span>
        </h4>

        <div className="space-y-2">
          {reading.actionAdvices.map((advice, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800/60"
            >
              <span className="w-5 h-5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                0{index + 1}
              </span>
              <p className="text-xs text-neutral-200 font-serif leading-relaxed">
                {advice}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 05. 能量时间预测窗口 (Timeline) */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800/80 space-y-3">
        <h4 className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>能量窗口 · 时序推演</span>
        </h4>

        <div className="relative pl-4 border-l border-amber-500/30 space-y-3.5 my-1">
          {/* Near */}
          <div className="relative">
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#D4AF37]" />
            <div className="text-[11px] font-serif font-bold text-amber-300">未来 1–7 天 (当下萌发)</div>
            <p className="text-xs text-neutral-300 font-serif mt-0.5">{reading.timeline.near}</p>
          </div>

          {/* Mid */}
          <div className="relative">
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-600" />
            <div className="text-[11px] font-serif font-bold text-amber-400/90">7–30 天 (机运显露)</div>
            <p className="text-xs text-neutral-300 font-serif mt-0.5">{reading.timeline.mid}</p>
          </div>

          {/* Far */}
          <div className="relative">
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-600" />
            <div className="text-[11px] font-serif font-bold text-neutral-400">30–90 天 (局势定鼎)</div>
            <p className="text-xs text-neutral-300 font-serif mt-0.5">{reading.timeline.far}</p>
          </div>
        </div>
      </div>

      {/* 06. 今日助力 (Lucky Elements) */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800/80 space-y-3">
        <h4 className="text-xs font-serif font-bold text-neutral-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>今日助力 · 趋吉磁场</span>
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs font-serif">
          <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-400">幸运颜色</span>
            <span className="text-amber-200 font-semibold">{reading.luckyElements.color}</span>
          </div>

          <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-400">幸运方位</span>
            <span className="text-amber-200 font-semibold">{reading.luckyElements.direction}</span>
          </div>

          <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-400">吉利时辰</span>
            <span className="text-amber-200 font-semibold">{reading.luckyElements.time}</span>
          </div>

          <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-400">幸运数字</span>
            <span className="text-amber-200 font-bold font-mono text-sm">{reading.luckyElements.number}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
