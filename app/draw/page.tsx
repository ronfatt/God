'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { OracleCardData, SpreadType, QuestionCategory, CardDrawResult, ReadingAnalysis } from '@/types/oracle';
import { SPREAD_CONFIGS } from '@/data/cards';
import { ShuffleAnimation } from '@/components/Oracle/ShuffleAnimation';
import { CardDeck } from '@/components/Oracle/CardDeck';
import { ThreeCardSpread } from '@/components/Oracle/ThreeCardSpread';
import { SixCardSpread } from '@/components/Oracle/SixCardSpread';
import { NineCardSpread } from '@/components/Oracle/NineCardSpread';
import { ReadingSummary } from '@/components/Oracle/ReadingSummary';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { analyzeCards } from '@/lib/readingEngine';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { Sparkles, Eye, ArrowRight, RotateCcw, Share2, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

function DrawContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') as QuestionCategory) || 'general';
  const question = searchParams.get('q') || '今日神谕·乾坤运势';
  const spreadType = (searchParams.get('spread') as SpreadType) || 'three';

  const spreadConfig = SPREAD_CONFIGS.find((s) => s.type === spreadType) || SPREAD_CONFIGS[0];

  // Flow State: 'shuffle' -> 'deck' -> 'reveal' -> 'result'
  const [phase, setPhase] = useState<'shuffle' | 'deck' | 'reveal' | 'result'>('shuffle');
  const [drawnCards, setDrawnCards] = useState<CardDrawResult[]>([]);
  const [readingResult, setReadingResult] = useState<ReadingAnalysis | null>(null);
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);

  // Once shuffle is done
  const handleShuffleComplete = () => {
    setPhase('deck');
  };

  // Once user selects cards from 52-card deck
  const handleCardsSelected = (selected: OracleCardData[]) => {
    const formatted: CardDrawResult[] = selected.map((card, idx) => ({
      position: spreadConfig.positions[idx],
      card,
      isRevealed: false,
    }));
    setDrawnCards(formatted);
    setPhase('reveal');
  };

  // Flip individual card in spread
  const handleFlipCard = (index: number) => {
    const updated = [...drawnCards];
    updated[index].isRevealed = true;
    setDrawnCards(updated);

    // If all cards are revealed, calculate reading result
    const allRevealed = updated.every((c) => c.isRevealed);
    if (allRevealed) {
      const cardsOnly = updated.map((c) => c.card);
      const analysis = analyzeCards(cardsOnly, question, category, spreadType);
      setReadingResult(analysis);
      Storage.saveReading(analysis);

      // Celebration celestial burst
      setTimeout(() => {
        try {
          confetti({
            particleCount: 70,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#FDE68A', '#E11D48', '#10B981', '#A855F7'],
          });
        } catch {}
      }, 700);
    }
  };

  // Reveal All remaining cards at once
  const handleRevealAll = () => {
    sound.playBassHit();
    const updated = drawnCards.map((c) => ({ ...c, isRevealed: true }));
    setDrawnCards(updated);

    const cardsOnly = updated.map((c) => c.card);
    const analysis = analyzeCards(cardsOnly, question, category, spreadType);
    setReadingResult(analysis);
    Storage.saveReading(analysis);

    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#FDE68A', '#E11D48', '#10B981', '#A855F7'],
      });
    } catch {}
  };

  const isAllRevealed = drawnCards.length > 0 && drawnCards.every((c) => c.isRevealed);

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4">
      <TopHeader
        title={spreadConfig.title}
        showBack
        onBack={() => {
          if (phase === 'result') {
            router.push('/');
          } else {
            router.push('/spread');
          }
        }}
      />

      {/* Progress & Step Indicator */}
      <div className="w-full flex items-center justify-between px-2 pt-1 text-xs font-serif border-b border-neutral-800/80 pb-2">
        <span className="text-amber-400 font-bold truncate max-w-[200px]">
          问：{question}
        </span>
        <span className="text-neutral-400">
          {phase === 'shuffle' && '第一阶段 · 洗牌聚气'}
          {phase === 'deck' && '第二阶段 · 直觉抽牌'}
          {phase === 'reveal' && '第三阶段 · 翻牌显圣'}
          {phase === 'result' && '第四阶段 · 天机尽释'}
        </span>
      </div>

      {/* STEP 1: SHUFFLE */}
      {phase === 'shuffle' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <h2 className="text-xl font-serif font-bold text-gold-gradient">
              52张东方神明扑克
            </h2>
            <p className="text-xs text-neutral-400 font-serif mt-1">
              静心默念你的问题，点击下方按钮开始洗牌
            </p>
          </div>

          <ShuffleAnimation onComplete={handleShuffleComplete} />
        </div>
      )}

      {/* STEP 2: 52-CARD COVERFLOW DECK */}
      {phase === 'deck' && (
        <div className="flex-1 flex flex-col items-center">
          <CardDeck
            requiredCount={spreadConfig.cardCount}
            onCardsSelected={handleCardsSelected}
          />
        </div>
      )}

      {/* STEP 3 & 4: SPREAD REVEAL & RESULT */}
      {(phase === 'reveal' || phase === 'result') && (
        <div className="flex-1 flex flex-col items-center space-y-4 animate-fade-in">
          {/* Action Bar for Quick Reveal */}
          {!isAllRevealed && (
            <div className="w-full flex items-center justify-between bg-neutral-900/60 p-2.5 rounded-xl border border-amber-500/20">
              <span className="text-xs font-serif text-amber-300">
                请逐一点击卡牌翻开显圣
              </span>
              <button
                onClick={handleRevealAll}
                className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-serif hover:border-amber-300 flex items-center gap-1 active:scale-95 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>一键翻牌</span>
              </button>
            </div>
          )}

          {/* Render Active Spread Array */}
          <div className="w-full">
            {spreadType === 'three' && (
              <ThreeCardSpread
                cards={drawnCards}
                onFlipCard={handleFlipCard}
                onCardClick={(card) => setModalCard(card)}
              />
            )}

            {spreadType === 'six' && (
              <SixCardSpread
                cards={drawnCards}
                onFlipCard={handleFlipCard}
                onCardClick={(card) => setModalCard(card)}
              />
            )}

            {spreadType === 'nine' && (
              <NineCardSpread
                cards={drawnCards}
                onFlipCard={handleFlipCard}
                onCardClick={(card) => setModalCard(card)}
              />
            )}
          </div>

          {/* If all cards are revealed, show Reading Engine Analysis */}
          {isAllRevealed && readingResult && (
            <div className="w-full space-y-4 pt-3 border-t border-neutral-800 animate-fade-in">
              <ReadingSummary reading={readingResult} />

              {/* Bottom Actions */}
              <div className="pt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    sound.playCardSelect();
                    router.push('/history');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>天机已载入历史档案 · 查看记录</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sound.playCardSelect();
                    router.push('/question');
                  }}
                  className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-serif text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>问另一事 · 重新起卦</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Detail Modal */}
      <CardDetailModal
        card={modalCard}
        onClose={() => setModalCard(null)}
      />
    </div>
  );
}

export default function DrawPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-amber-300">正在进入神谕空间...</div>}>
      <DrawContent />
    </Suspense>
  );
}
