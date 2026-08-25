'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { ORACLE_CARDS } from '@/data/cards';
import { getCardVisualConfig } from '@/visual/cardVisualConfig';
import { OracleCard } from '@/components/Cards/OracleCard';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { OracleCardData } from '@/types/oracle';
import { Sparkles, Layers, Image as ImageIcon, CheckCircle, Clock, Filter, Code } from 'lucide-react';

export default function CardAdminDashboardPage() {
  const router = useRouter();
  const [selectedRealm, setSelectedRealm] = useState<string>('all');
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);

  const filteredCards = selectedRealm === 'all'
    ? ORACLE_CARDS
    : ORACLE_CARDS.filter((c) => c.suit === selectedRealm);

  const approvedCount = ORACLE_CARDS.filter((c, i) => i % 2 === 0).length; // Simulated approved artwork count

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="神谕圣相生产工坊 (Admin)" showBack onBack={() => router.push('/cards')} />

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-serif">
        <div className="p-3 rounded-2xl glass-panel border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-[10px]">
            <span>视觉立绘就绪</span>
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-mono font-bold text-amber-300">
            {approvedCount} / 52
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
            <div
              style={{ width: `${(approvedCount / 52) * 100}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl glass-panel border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-[10px]">
            <span>动态特效赋能</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-mono font-bold text-cyan-300">
            18 / 52
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
            <div style={{ width: '35%' }} className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Realm Filter Tabs */}
      <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-2xl border border-neutral-800 text-xs font-serif overflow-x-auto">
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
            className={`px-3 py-1.5 rounded-xl transition-colors flex-shrink-0 ${
              selectedRealm === tab.id
                ? 'bg-amber-500 text-black font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 52 Cards Production Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredCards.map((card, idx) => {
          const config = getCardVisualConfig(card.id, card.suit, card.archetype);
          return (
            <div
              key={card.id}
              onClick={() => setModalCard(card)}
              className="p-2.5 rounded-2xl glass-panel border border-neutral-800 hover:border-amber-400/60 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400">
                  {card.id}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-serif ${
                    config.artworkStatus === 'approved'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {config.artworkStatus === 'approved' ? '立绘已核' : '规范占位'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-14 rounded-lg bg-neutral-950 border border-amber-500/30 flex items-center justify-center text-lg">
                  {config.primarySymbol}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-serif font-bold text-neutral-100 truncate block">
                    {card.cardName}
                  </span>
                  <span className="text-[10px] text-amber-300/80 truncate block">
                    {card.archetype}
                  </span>
                  <span className="text-[9px] text-neutral-500 block">
                    {card.elementName} · {card.yinYang === 'yang' ? '阳' : '阴'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Lore Detail Modal */}
      <CardDetailModal
        card={modalCard}
        onClose={() => setModalCard(null)}
      />
    </div>
  );
}
