'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TopHeader } from '@/components/Layout/TopHeader';
import { OracleCardData, Suit } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';
import { Storage } from '@/lib/storage';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { sound } from '@/lib/sound';
import { Layers, Sparkles, Image as ImageIcon, Eye, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const REALM_POSTERS = [
  {
    id: 'heart',
    title: '心界 · HEART REALM',
    subtitle: '爱与关系 · 家庭与缘分 · 疗愈与成长 · 内在之心',
    mantra: '天机所示 · 心之所向 · 自在圆满',
    image: '/realms/heart_realm_poster.jpg',
    color: 'border-rose-400 text-rose-900 bg-rose-50',
  },
  {
    id: 'diamond',
    title: '财界 · DIAMOND REALM',
    subtitle: '财富与机遇 · 资源与流通 · 商贸与权势 · 聚财生财 · 富足圆满',
    mantra: '天机所示 · 心之所向 · 自在圆满',
    image: '/realms/diamond_realm_poster.jpg',
    color: 'border-amber-400 text-amber-900 bg-amber-50',
  },
  {
    id: 'club',
    title: '生界 · CLUB REALM',
    subtitle: '生长与机遇 · 学习与智慧 · 贵人相助 · 向上拓展',
    mantra: '天机所示 · 心之所向 · 自在圆满',
    image: '/realms/club_realm_poster.jpg',
    color: 'border-emerald-400 text-emerald-900 bg-emerald-50',
  },
  {
    id: 'spade',
    title: '玄界 · SPADE REALM',
    subtitle: '命运 · 蜕变 · 挑战 · 终结 · 觉醒 · 灵力',
    mantra: '天机所示 · 玄界所归 · 万象因果 · 自在轮回',
    image: '/realms/spade_realm_poster.jpg',
    color: 'border-purple-400 text-purple-900 bg-purple-50',
  },
];

export default function CardsPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'posters'>('cards');
  const [selectedSuit, setSelectedSuit] = useState<Suit | 'all'>('all');
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);
  const [fullPoster, setFullPoster] = useState<string | null>(null);

  useEffect(() => {
    const user = Storage.getUser();
    setCollectedIds(user.collectedCardIds || []);
  }, []);

  const suitTabs = [
    { id: 'all', label: '全部 (52)', symbol: '✦' },
    { id: 'heart', label: '心界 (13)', symbol: '♥', color: 'text-rose-700' },
    { id: 'diamond', label: '财界 (13)', symbol: '♦', color: 'text-amber-700' },
    { id: 'club', label: '生界 (13)', symbol: '♣', color: 'text-emerald-800' },
    { id: 'spade', label: '玄界 (13)', symbol: '♠', color: 'text-purple-900' },
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
      <TopHeader title="神谕圣典 · 52张全卡" />

      {/* View Mode Toggle: Cards vs 4 Realms Posters */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <button
          onClick={() => {
            sound.playCardSelect();
            setViewMode('cards');
          }}
          className={cn(
            'flex-1 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5',
            viewMode === 'cards'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>52 张神谕圣相</span>
        </button>

        <button
          onClick={() => {
            sound.playCardSelect();
            setViewMode('posters');
          }}
          className={cn(
            'flex-1 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5',
            viewMode === 'posters'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          )}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>四大界全图海报 (4 Realms)</span>
        </button>
      </div>

      {/* MODE 1: 52 CARDS GRID */}
      {viewMode === 'cards' && (
        <div className="space-y-4 animate-fade-in">
          {/* Progress Header */}
          <div className="w-full glass-panel rounded-3xl p-4 border border-amber-300 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-serif font-bold text-stone-900">
                  东方神明圣相集 · 已收录
                </h3>
              </div>
              <span className="text-xs font-mono font-black text-amber-800">
                {collectedCount} / 52 张 ({progressPercent}%)
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Realm Category Filter Tabs */}
          <div className="flex items-center justify-between gap-1 p-1 rounded-2xl bg-white border border-stone-200 shadow-xs overflow-x-auto">
            {suitTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playCardSelect();
                  setSelectedSuit(tab.id as Suit | 'all');
                }}
                className={cn(
                  'flex-1 py-1.5 px-2 rounded-xl text-xs font-serif flex items-center justify-center gap-1 transition-all whitespace-nowrap',
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

          {/* 3-Column Grid for High-Quality Card Thumbnails */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {filteredCards.map((card) => {
              const isCollected = collectedIds.includes(card.id);

              return (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.04, y: -4 }}
                  onClick={() => handleCardClick(card)}
                  className={cn(
                    'group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 shadow-md bg-stone-900 flex flex-col justify-between',
                    card.suit === 'heart' && 'border-rose-400/70 hover:border-rose-400',
                    card.suit === 'diamond' && 'border-amber-400/90 hover:border-amber-300',
                    card.suit === 'club' && 'border-emerald-400/70 hover:border-emerald-400',
                    card.suit === 'spade' && 'border-purple-400/70 hover:border-purple-400'
                  )}
                  style={{ aspectRatio: '2/3.5' }}
                >
                  {/* Card Artwork Image */}
                  <div className="relative w-full h-full">
                    <Image
                      src={`/cards/${card.id}.jpg`}
                      alt={card.cardName}
                      fill
                      sizes="(max-width: 768px) 33vw, 20vw"
                      className="object-cover"
                    />

                    {/* Inset Gold Filigree */}
                    <div className="absolute inset-0.5 rounded-xl border border-amber-300/30 pointer-events-none" />

                    {/* Uncollected Lock Overlay if not yet collected */}
                    {!isCollected && (
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-full bg-black/60 backdrop-blur-xs text-[8.5px] font-serif text-amber-200 border border-amber-400/40">
                        未收录
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: 4 REALMS FULL MASTER POSTERS */}
      {viewMode === 'posters' && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-base font-serif font-black text-gold-gradient">
              四大界宏大世界观全维法相
            </h2>
            <p className="text-xs text-stone-500 font-serif">
              点击海报即可全屏沉浸式鉴赏高清立绘大图
            </p>
          </div>

          <div className="space-y-4">
            {REALM_POSTERS.map((poster) => (
              <div
                key={poster.id}
                onClick={() => {
                  sound.playCardSelect();
                  setFullPoster(poster.image);
                }}
                className={cn(
                  'p-4 rounded-3xl border-2 space-y-2.5 cursor-pointer shadow-sm hover:shadow-lg transition-all group',
                  poster.color
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-serif font-black">{poster.title}</h3>
                    <p className="text-[10px] text-stone-600 font-serif mt-0.5">{poster.subtitle}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white text-stone-900 shadow-xs group-hover:scale-105 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Poster Preview */}
                <div className="relative w-full rounded-2xl overflow-hidden border border-black/10 shadow-inner" style={{ aspectRatio: '724/1024' }}>
                  <Image
                    src={poster.image}
                    alt={poster.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>

                <div className="text-center text-[10px] font-serif text-stone-500 italic">
                  “{poster.mantra}”
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Poster Viewer Modal */}
      <AnimatePresence>
        {fullPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/95 backdrop-blur-md">
            <button
              onClick={() => setFullPoster(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-[420px] max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '724/1024' }}>
              <Image
                src={fullPoster}
                alt="Full Poster"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Card Lore Detail Modal */}
      <CardDetailModal
        card={modalCard}
        onClose={() => setModalCard(null)}
      />
    </div>
  );
}
