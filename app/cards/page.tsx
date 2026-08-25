'use client';

import React, { useState, useEffect } from 'react';
import { TopHeader } from '@/components/Layout/TopHeader';
import { OracleCardData, Suit } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';
import { Storage } from '@/lib/storage';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { sound } from '@/lib/sound';
import { Layers, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CardsPage() {
  const [selectedSuit, setSelectedSuit] = useState<Suit | 'all'>('all');
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);

  useEffect(() => {
    const user = Storage.getUser();
    setCollectedIds(user.collectedCardIds || []);
  }, []);

  const suitTabs = [
    { id: 'all', label: '全部', symbol: '✦' },
    { id: 'heart', label: '心界', symbol: '♥', color: 'text-rose-700' },
    { id: 'diamond', label: '财界', symbol: '♦', color: 'text-amber-700' },
    { id: 'club', label: '生界', symbol: '♣', color: 'text-emerald-800' },
    { id: 'spade', label: '玄界', symbol: '♠', color: 'text-purple-900' },
  ];

  const filteredCards = selectedSuit === 'all'
    ? ORACLE_CARDS
    : ORACLE_CARDS.filter((c) => c.suit === selectedSuit);

  const handleCardClick = (card: OracleCardData) => {
    sound.playCardSelect();
    setModalCard(card);
  };

  const collectedCount = ORACLE_CARDS.filter((c) => collectedIds.includes(c.id)).length;
  const progressPercent = Math.round((collectedCount / ORACLE_CARDS.length) * 100);

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="神谕图鉴 · 圣典" />

      {/* Progress Header */}
      <div className="w-full glass-panel rounded-3xl p-4 border border-amber-300 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-serif font-bold text-stone-900">
              东方神明圣相录
            </h3>
          </div>
          <span className="text-xs font-mono font-black text-amber-800">
            {collectedCount} / 52 张 ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Realm Category Filter Tabs */}
      <div className="flex items-center justify-between gap-1 p-1 rounded-2xl bg-white border border-stone-200 shadow-xs">
        {suitTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playCardSelect();
              setSelectedSuit(tab.id as Suit | 'all');
            }}
            className={cn(
              'flex-1 py-1.5 rounded-xl text-xs font-serif flex items-center justify-center gap-1 transition-all',
              selectedSuit === tab.id
                ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            )}
          >
            <span className={tab.color}>{tab.symbol}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 4-Column Grid for 52 Cards */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {filteredCards.map((card) => {
          const isCollected = collectedIds.includes(card.id);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={cn(
                'group relative rounded-xl border p-1.5 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 select-none shadow-xs',
                isCollected
                  ? 'bg-gradient-to-b from-white to-amber-50/60 border-amber-300 hover:border-amber-500 hover:shadow-md'
                  : 'bg-stone-50/60 border-stone-200 opacity-60'
              )}
              style={{ aspectRatio: '2/3' }}
            >
              {/* Top Rank & Suit */}
              <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="text-stone-900">{card.rank}</span>
                <span className="text-amber-800 font-serif">
                  {card.suit === 'heart' ? '♥' : card.suit === 'diamond' ? '♦' : card.suit === 'club' ? '♣' : '♠'}
                </span>
              </div>

              {/* Center Initial Symbol */}
              <div className="w-8 h-8 rounded-full border border-amber-400/40 bg-white flex items-center justify-center text-xs font-serif font-black text-amber-900 shadow-xs">
                {card.archetype ? card.archetype.charAt(0) : card.cardName.charAt(0)}
              </div>

              {/* Bottom Card Name */}
              <div className="w-full text-center">
                <span className="text-[9.5px] font-serif font-bold text-stone-900 truncate block">
                  {card.cardName}
                </span>
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
