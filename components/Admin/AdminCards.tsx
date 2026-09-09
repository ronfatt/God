'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ORACLE_CARDS } from '@/data/cards';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { OracleCardData } from '@/types/oracle';
import { Sparkles, Image as ImageIcon, CheckCircle2, Search } from 'lucide-react';

export const AdminCards: React.FC = () => {
  const [selectedRealm, setSelectedRealm] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);

  const filteredCards = ORACLE_CARDS.filter((c) => {
    const matchRealm = selectedRealm === 'all' || c.suit === selectedRealm;
    const matchSearch =
      c.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.archetype.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.elementName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRealm && matchSearch;
  });

  return (
    <div className="space-y-4 select-none">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-serif">
        <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-amber-500/30 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 text-[11px]">
            <span>视觉立绘就绪状态</span>
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-mono font-black text-amber-400 flex items-center gap-2">
            <span>52 / 52</span>
            <span className="text-xs text-emerald-400 font-serif font-bold">(100% 全量生成完成)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full w-full" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-cyan-500/30 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 text-[11px]">
            <span>四大界世界观分布</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-mono font-black text-cyan-400 flex items-center gap-2">
            <span>4 / 4 界</span>
            <span className="text-xs text-cyan-300 font-serif font-bold">(心13 · 财13 · 生13 · 玄13)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900/80 p-3 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-serif">
          {[
            { id: 'all', name: '全部 (52)' },
            { id: 'heart', name: '♥ 心界 (13)' },
            { id: 'diamond', name: '♦ 财界 (13)' },
            { id: 'club', name: '♣ 生界 (13)' },
            { id: 'spade', name: '♠ 玄界 (13)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRealm(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all flex-shrink-0 ${
                selectedRealm === tab.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200 bg-stone-950/60'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索牌名、原型、牌号..."
            className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-xs font-serif text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* 52 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            onClick={() => setModalCard(card)}
            className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-400/80 cursor-pointer transition-all space-y-2.5 shadow-sm group hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-amber-400">
                {card.id}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md font-serif font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>立绘就绪</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative w-14 h-20 rounded-xl overflow-hidden border border-amber-400/60 shadow-xs flex-shrink-0 bg-stone-950">
                <Image
                  src={`/cards/${card.id}.jpg`}
                  alt={card.cardName}
                  fill
                  sizes="60px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-serif font-bold text-stone-100 truncate block group-hover:text-amber-300">
                  {card.cardName}
                </span>
                <span className="text-[10px] text-amber-400/90 truncate block font-medium mt-0.5">
                  【{card.archetype}】
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  {card.elementName} · {card.yinYang === 'yang' ? '阳' : '阴'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card Lore Detail Modal */}
      <CardDetailModal
        card={modalCard}
        onClose={() => setModalCard(null)}
      />
    </div>
  );
};
