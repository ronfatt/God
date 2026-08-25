'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { buildOracleJourney, JourneySummaryData } from '@/oracle-journey/journeyEngine';
import { ChevronRight } from 'lucide-react';
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
        <div className="p-8 text-center text-amber-800 font-serif text-xs">
          正在载入天机轨迹...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="我的天机轨迹 · Journey" showBack onBack={() => router.push('/')} />

      {/* Hero Trajectory Summary */}
      <div className="w-full glass-panel rounded-3xl p-5 border border-amber-300 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-amber-600" />
            <h3 className="text-xs font-serif font-black text-amber-900 tracking-widest uppercase">
              气运演进主线
            </h3>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-serif bg-amber-100 border border-amber-300 text-amber-900 font-bold">
            当前阶段 · {journeyData.currentPhaseName}
          </span>
        </div>

        {/* 3 Step Trajectory Pills */}
        <div className="flex items-center justify-between py-2 border-y border-stone-200 my-2">
          {journeyData.trajectorySequence.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-amber-700 font-bold">0{idx + 1}</span>
                <span className="text-xs font-serif font-bold text-stone-900 mt-0.5">{step}</span>
              </div>
              {idx < journeyData.trajectorySequence.length - 1 && (
                <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-xs text-stone-700 font-serif leading-relaxed bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/60">
          {journeyData.journeyNarrative}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2">
        {/* Period Filter */}
        <div className="flex items-center justify-between gap-1 bg-white p-1 rounded-2xl border border-stone-200 shadow-xs">
          {(['7d', '30d', '90d', '1y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                sound.playCardSelect();
                setPeriod(p);
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-serif transition-colors ${
                period === p
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
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
                  ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                  : 'bg-white text-stone-500 border border-stone-200'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Nodes */}
      <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-amber-300 before:to-stone-200">
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
            <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-500 text-amber-900 font-mono text-[9px] font-bold flex items-center justify-center z-10 shadow-xs group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all">
              {idx + 1}
            </div>

            {/* Node Card */}
            <div className="flex-1 p-3.5 rounded-2xl glass-panel border border-stone-200 group-hover:border-amber-400 space-y-1.5 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400">
                  {node.date} · {node.domainName}
                </span>
                <span className="text-[10px] font-serif font-bold text-amber-900 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                  {node.phaseName}
                </span>
              </div>

              <h4 className="text-xs font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                问：{node.question}
              </h4>

              <div className="flex items-center justify-between text-xs font-serif text-stone-500 pt-1 border-t border-stone-100">
                <span className="text-amber-800 font-mono font-medium">
                  【{node.majorCard.name}】· {node.dominantElementName}
                </span>
                <div className="flex items-center gap-1 text-amber-800 font-mono font-bold">
                  <span>支持度 {node.score}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
