'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { buildOracleJourney, JourneySummaryData, JourneyNode } from '@/oracle-journey/journeyEngine';
import { Sparkles, Compass, Clock, ArrowRight, Flame, Layers, Filter, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JourneyPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [domainFilter, setDomainFilter] = useState('all');
  const [journeyData, setJourneyData] = useState<JourneySummaryData | null>(null);

  useEffect(() => {
    const history = Storage.getHistory();
    const data = buildOracleJourney(history, period, domainFilter);
    setJourneyData(data);
  }, [period, domainFilter]);

  if (!journeyData) {
    return (
      <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4">
        <TopHeader title="我的天机轨迹" showBack onBack={() => router.push('/')} />
        <div className="p-8 text-center text-amber-300 font-serif text-xs">
          正在载入天机轨迹...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="我的天机轨迹 · Journey" showBack onBack={() => router.push('/')} />

      {/* Hero Trajectory Summary */}
      <div className="w-full glass-panel rounded-3xl p-5 border border-amber-500/30 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-amber-400" />
            <h3 className="text-xs font-serif font-bold text-amber-300 tracking-widest uppercase">
              气运演进主线
            </h3>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-serif bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold">
            当前阶段 · {journeyData.currentPhaseName}
          </span>
        </div>

        {/* 3 Step Trajectory Pills */}
        <div className="flex items-center justify-between py-2 border-y border-neutral-800/80 my-2">
          {journeyData.trajectorySequence.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-amber-400 font-bold">0{idx + 1}</span>
                <span className="text-xs font-serif font-bold text-neutral-100 mt-0.5">{step}</span>
              </div>
              {idx < journeyData.trajectorySequence.length - 1 && (
                <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500/30 via-amber-400 to-amber-500/30 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-xs text-neutral-300 font-serif leading-relaxed bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800">
          {journeyData.journeyNarrative}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2">
        {/* Period Filter */}
        <div className="flex items-center justify-between gap-1 bg-neutral-900/80 p-1 rounded-2xl border border-neutral-800">
          {(['7d', '30d', '90d', '1y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                sound.playCardSelect();
                setPeriod(p);
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-serif transition-colors ${
                period === p
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {p === '7d' ? '近7天' : p === '30d' ? '近30天' : p === '90d' ? '近90天' : '近1年'}
            </button>
          ))}
        </div>

        {/* Domain Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', name: '全部领域' },
            { id: 'career', name: '事业' },
            { id: 'wealth', name: '财富' },
            { id: 'love', name: '感情' },
            { id: 'general', name: '综合' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => {
                sound.playCardSelect();
                setDomainFilter(d.id);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-serif transition-colors flex-shrink-0 ${
                domainFilter === d.id
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 font-bold'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Nodes */}
      <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-500/60 before:via-amber-400/20 before:to-neutral-800">
        {journeyData.nodes.map((node, idx) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => {
              sound.playCardSelect();
              router.push(`/result?id=${node.readingId}`);
            }}
            className="flex items-start gap-3 pl-1 relative group cursor-pointer"
          >
            {/* Timeline Dot */}
            <div className="w-6 h-6 rounded-full bg-neutral-900 border-2 border-amber-400 text-amber-300 font-mono text-[9px] font-bold flex items-center justify-center z-10 shadow-md group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all">
              {idx + 1}
            </div>

            {/* Node Card */}
            <div className="flex-1 p-3.5 rounded-2xl glass-panel border border-neutral-800 group-hover:border-amber-500/40 space-y-1.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-400">
                  {node.date} · {node.domainName}
                </span>
                <span className="text-[10px] font-serif font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30">
                  {node.phaseName}
                </span>
              </div>

              <h4 className="text-xs font-serif font-bold text-neutral-100 group-hover:text-amber-200 transition-colors">
                问：{node.question}
              </h4>

              <div className="flex items-center justify-between text-xs font-serif text-neutral-400 pt-1 border-t border-neutral-800/60">
                <span className="text-amber-400/90 font-mono">
                  【{node.majorCard.name}】· {node.dominantElementName}
                </span>
                <div className="flex items-center gap-1 text-amber-300 font-mono font-bold">
                  <span>支持度 {node.score}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
