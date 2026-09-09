'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ReadingAnalysis } from '@/types/oracle';
import { Search, Compass, Eye, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface AdminReadingsProps {
  readings: ReadingAnalysis[];
  onRefresh: () => void;
}

export const AdminReadings: React.FC<AdminReadingsProps> = ({ readings, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReading, setSelectedReading] = useState<ReadingAnalysis | null>(null);
  const [spreadFilter, setSpreadFilter] = useState<'all' | 'single' | 'three_card'>('all');

  const filtered = readings.filter((r) => {
    const matchSpread = spreadFilter === 'all' || r.spreadType === spreadFilter;
    const matchSearch =
      r.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.oracleQuote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSpread && matchSearch;
  });

  return (
    <div className="space-y-4 select-none">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索卦题、神谕断言..."
              className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-serif text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Spread Filter */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-serif">
            <button
              onClick={() => setSpreadFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                spreadFilter === 'all'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setSpreadFilter('three_card')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                spreadFilter === 'three_card'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              三才阵
            </button>
            <button
              onClick={() => setSpreadFilter('single')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                spreadFilter === 'single'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              单牌
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-serif">
          <span className="text-stone-400">
            共 <strong className="font-mono text-cyan-400">{filtered.length}</strong> 条卦象日志
          </span>
          <button
            onClick={onRefresh}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新</span>
          </button>
        </div>
      </div>

      {/* Readings Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((r) => (
          <div
            key={r.id}
            onClick={() => setSelectedReading(r)}
            className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-3 shadow-md group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-serif font-bold ${
                    r.spreadType === 'three_card'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {r.spreadType === 'three_card' ? '三才天地人' : '一牌定音'}
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  {r.date}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                综合卦气: {r.overallScore}
              </span>
            </div>

            <div className="text-sm font-serif font-bold text-stone-100 line-clamp-1 group-hover:text-cyan-300 transition-colors">
              “{r.question}”
            </div>

            {/* Cards Drawn in reading */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto">
              {r.cards.map((c, i) => (
                <div
                  key={c.id + i}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-950 border border-stone-800 flex-shrink-0"
                >
                  <div className="relative w-5 h-7 rounded overflow-hidden flex-shrink-0 bg-stone-900">
                    <Image
                      src={`/cards/${c.id}.jpg`}
                      alt={c.cardName}
                      fill
                      sizes="20px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-serif text-stone-300 font-medium">
                    {c.cardName}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-xs font-serif text-stone-400 line-clamp-2 bg-stone-950/50 p-2 rounded-xl border border-stone-800/80 italic">
              {r.oracleQuote}
            </div>
          </div>
        ))}
      </div>

      {/* Reading Detail Modal */}
      {selectedReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-stone-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-serif font-bold text-stone-100">
                  神谕卦象深度监察
                </h3>
              </div>
              <button
                onClick={() => setSelectedReading(null)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-xs font-serif hover:bg-stone-700"
              >
                关闭
              </button>
            </div>

            <div className="space-y-3 text-xs font-serif">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="text-stone-400 text-[11px]">求卜问事</div>
                <div className="text-sm font-bold text-stone-100">
                  {selectedReading.question}
                </div>
              </div>

              {/* Cards Grid */}
              <div className="space-y-1.5">
                <div className="text-stone-400 text-[11px]">圣相显像</div>
                <div className="grid grid-cols-3 gap-2">
                  {selectedReading.cards.map((c, i) => (
                    <div
                      key={c.id + i}
                      className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-center space-y-1.5"
                    >
                      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-amber-500/30">
                        <Image
                          src={`/cards/${c.id}.jpg`}
                          alt={c.cardName}
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      </div>
                      <div className="font-bold text-stone-200 text-xs">{c.cardName}</div>
                      <div className="text-[10px] text-amber-400 font-mono">
                        {c.suit.toUpperCase()} · {c.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                  <div className="text-[10px] text-stone-400">财帛运势</div>
                  <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">
                    {selectedReading.wealthScore}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                  <div className="text-[10px] text-stone-400">事业功名</div>
                  <div className="font-mono font-bold text-cyan-400 text-sm mt-0.5">
                    {selectedReading.careerScore}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                  <div className="text-[10px] text-stone-400">姻缘情感</div>
                  <div className="font-mono font-bold text-rose-400 text-sm mt-0.5">
                    {selectedReading.loveScore}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-stone-950 border border-stone-800">
                  <div className="text-[10px] text-stone-400">贵人扶持</div>
                  <div className="font-mono font-bold text-purple-400 text-sm mt-0.5">
                    {selectedReading.noblemanScore}
                  </div>
                </div>
              </div>

              {/* Oracle Insight Quote */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 to-stone-950 border border-amber-500/30 text-amber-200 italic">
                “{selectedReading.oracleQuote}”
              </div>

              {/* Action advice */}
              {selectedReading.actionAdvices && selectedReading.actionAdvices.length > 0 && (
                <div className="space-y-1">
                  <div className="text-stone-400 text-[11px]">玄机指引与改运方策</div>
                  <ul className="space-y-1 list-disc pl-4 text-stone-300">
                    {selectedReading.actionAdvices.map((adv, idx) => (
                      <li key={idx}>{adv}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
