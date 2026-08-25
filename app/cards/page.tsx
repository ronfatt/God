'use client';

import React, { useState, useEffect } from 'react';
import { TopHeader } from '@/components/Layout/TopHeader';
import { OracleCardData, Suit } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';
import { Storage } from '@/lib/storage';
import { OracleCard } from '@/components/Cards/OracleCard';
import { CardBack } from '@/components/Cards/CardBack';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { sound } from '@/lib/sound';
import { Layers, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
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
    { id: 'heart', label: '心界', symbol: '♥', color: 'text-rose-400' },
    { id: 'diamond', label: '财界', symbol: '♦', color: 'text-amber-400' },
    { id: 'club', label: '生界', symbol: '♣', color: 'text-emerald-400' },
    { id: 'spade', label: '玄界', symbol: '♠', color: 'text-purple-400' },
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
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4">
      <TopHeader title="神谕图鉴 · 圣典" />

      {/* Progress Header */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-amber-500/20 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-serif font-bold text-amber-200">
              东方神明圣相录
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300">
            {collectedCount} / 52 张 ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700 shadow-[0_0_8px_#D4AF37]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Realm Category Filter Tabs */}
      <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-neutral-900/80 border border-neutral-800">
        {suitTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playCardSelect();
              setSelectedSuit(tab.id as Suit | 'all');
            }}
            className={cn(
              'flex-1 py-1.5 rounded-lg text-xs font-serif flex items-center justify-center gap-1 transition-all',
              selectedSuit === tab.id
                ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold shadow-md'
                : 'text-neutral-400 hover:text-neutral-200'
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
                'relative flex flex-col items-center cursor-pointer group transition-all duration-300 active:scale-95',
                !isCollected && 'opacity-50 grayscale hover:opacity-80 hover:grayscale-0'
              )}
            >
              <div className="w-full">
                <OracleCard card={card} size="sm" isCompact />
              </div>

              {/* Status Badge */}
              <div className="mt-1 text-center w-full">
                <span className="text-[10px] font-serif font-semibold text-neutral-200 block truncate">
                  {card.name}
                </span>
                <span className="text-[8px] text-neutral-400 font-mono block -mt-0.5">
                  {card.rank} {card.elementName}
                </span>
              </div>

              {/* Uncollected Lock Icon */}
              {!isCollected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black/80 flex items-center justify-center text-[9px] text-neutral-400 border border-neutral-700 pointer-events-none">
                  <Lock className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <CardDetailModal
        card={modalCard}
        onClose={() => setModalCard(null)}
      />
    </div>
  );
}
