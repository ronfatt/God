'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { ORACLE_CARDS } from '@/data/cards';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { OracleCardData } from '@/types/oracle';
import { Sparkles, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function CardAdminDashboardPage() {
  const router = useRouter();
  const [selectedRealm, setSelectedRealm] = useState<string>('all');
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);

  const filteredCards = selectedRealm === 'all'
    ? ORACLE_CARDS
    : ORACLE_CARDS.filter((c) => c.suit === selectedRealm);

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="神谕圣相生产工坊 (52/52 就绪)" showBack onBack={() => router.push('/cards')} />

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-serif">
        <div className="p-3.5 rounded-3xl glass-panel border border-amber-300 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-[10px]">
            <span>视觉立绘就绪</span>
            <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div className="text-lg font-mono font-black text-amber-900 flex items-center gap-1.5">
            <span>52 / 52</span>
            <span className="text-xs text-emerald-700 font-serif font-bold">(100% 全量生成)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
            <div
              style={{ width: '100%' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-3xl glass-panel border border-cyan-300 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-[10px]">
            <span>四大界世界观</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
          </div>
          <div className="text-lg font-mono font-black text-cyan-950 flex items-center gap-1.5">
            <span>4 / 4 界</span>
            <span className="text-xs text-cyan-800 font-serif font-bold">(心/财/生/玄)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
            <div style={{ width: '100%' }} className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Realm Filter Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-stone-200 text-xs font-serif overflow-x-auto shadow-xs">
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
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 52 Cards Production Grid with Actual Artwork */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredCards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => setModalCard(card)}
              className="p-2.5 rounded-2xl glass-panel border border-stone-200 hover:border-amber-400 cursor-pointer transition-all space-y-2 shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-amber-800">
                  {card.id}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-md font-serif font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>立绘已核</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-amber-400/80 shadow-xs flex-shrink-0 bg-stone-900">
                  <Image
                    src={`/cards/${card.id}.jpg`}
                    alt={card.cardName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-serif font-bold text-stone-900 truncate block">
                    {card.cardName}
                  </span>
                  <span className="text-[10px] text-amber-800 truncate block font-medium">
                    【{card.archetype}】
                  </span>
                  <span className="text-[9px] text-stone-500 block">
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
