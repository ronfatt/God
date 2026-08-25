'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { OracleCardData, SpreadType, QuestionCategory, CardDrawResult } from '@/types/oracle';
import { SPREAD_CONFIGS } from '@/data/cards';
import { RitualMeditation } from '@/components/Oracle/RitualMeditation';
import { ShuffleAnimation } from '@/components/Oracle/ShuffleAnimation';
import { CutDeckAnimation } from '@/components/Oracle/CutDeckAnimation';
import { CardDeck } from '@/components/Oracle/CardDeck';
import { ThreeCardSpread } from '@/components/Oracle/ThreeCardSpread';
import { SixCardSpread } from '@/components/Oracle/SixCardSpread';
import { NineCardSpread } from '@/components/Oracle/NineCardSpread';
import { ReadingSummary } from '@/components/Oracle/ReadingSummary';
import { CardDetailModal } from '@/components/Oracle/CardDetailModal';
import { CombinationResonanceBanner } from '@/components/Oracle/CombinationResonanceBanner';
import { analyzeCards } from '@/lib/readingEngine';
import { IntelligenceReadingResult } from '@/intelligence';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { Sparkles, Eye, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

function DrawContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') as QuestionCategory) || 'general';
  const initialQuestion = searchParams.get('q') || '今日神谕·乾坤运势';
  const initialSpreadType = (searchParams.get('spread') as SpreadType) || 'three';

  const [question, setQuestion] = useState(initialQuestion);
  const [spreadType, setSpreadType] = useState<SpreadType>(initialSpreadType);
  const [isClarifier, setIsClarifier] = useState(false);
  const [parentReadingId, setParentReadingId] = useState<string | undefined>(undefined);

  const spreadConfig = SPREAD_CONFIGS.find((s) => s.type === spreadType) || SPREAD_CONFIGS[0];

  // Flow State: 'ritual' (东方洗心祈请) -> 'shuffle' -> 'cut' -> 'deck' -> 'reveal' -> 'result'
  const [phase, setPhase] = useState<'ritual' | 'shuffle' | 'cut' | 'deck' | 'reveal' | 'result'>('ritual');
  const [drawnCards, setDrawnCards] = useState<CardDrawResult[]>([]);
  const [readingResult, setReadingResult] = useState<IntelligenceReadingResult | null>(null);
  const [modalCard, setModalCard] = useState<OracleCardData | null>(null);

  // Once ritual is complete -> go to Shuffle
  const handleRitualComplete = () => {
    setPhase('shuffle');
  };

  // Skip ritual directly
  const handleSkipRitual = () => {
    setPhase('shuffle');
  };

  // Once shuffle is done -> go to Cut Deck
  const handleShuffleComplete = () => {
    setPhase('cut');
  };

  // Once cut is done -> go to Deck Draw
  const handleCutComplete = (cutIndex: number) => {
    setPhase('deck');
  };

  // Once user selects cards from 52-card deck
  const handleCardsSelected = (selected: OracleCardData[]) => {
    const formatted: CardDrawResult[] = selected.map((card, idx) => ({
      position: spreadConfig.positions[idx] || {
        id: `pos_${idx}`,
        title: isClarifier ? `澄清位 · 0${idx + 1}` : `本位 · 0${idx + 1}`,
        subtitle: 'Clarifier',
        description: '追问澄清推演',
      },
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

    const allRevealed = updated.every((c) => c.isRevealed);
    if (allRevealed) {
      const cardsOnly = updated.map((c) => c.card);
      const analysis = analyzeCards(cardsOnly, question, category, spreadType, isClarifier, parentReadingId);
      setReadingResult(analysis);
      Storage.saveReading(analysis);

      setTimeout(() => {
        try {
          confetti({
            particleCount: 80,
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
    const analysis = analyzeCards(cardsOnly, question, category, spreadType, isClarifier, parentReadingId);
    setReadingResult(analysis);
    Storage.saveReading(analysis);

    try {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#FDE68A', '#E11D48', '#10B981', '#A855F7'],
      });
    } catch {}
  };

  // Handle Follow Up Clarifier trigger
  const handleFollowUpSelect = (followUpText: string, cardCount: 1 | 3) => {
    sound.playBassHit();
    const tokenCost = cardCount === 1 ? 10 : 20;
    Storage.consumeTokens(tokenCost, '追问澄清消耗');

    setParentReadingId(readingResult?.id);
    setQuestion(followUpText);
    setIsClarifier(true);
    setSpreadType(cardCount === 1 ? 'three' : 'three');
    setDrawnCards([]);
    setReadingResult(null);
    setPhase('deck');
  };

  const isAllRevealed = drawnCards.length > 0 && drawnCards.every((c) => c.isRevealed);
  const cardCountToDraw = isClarifier ? (spreadType === 'three' ? 3 : 1) : spreadConfig.cardCount;

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader
        title={isClarifier ? '追问澄清神谕' : spreadConfig.title}
        showBack
        onBack={() => {
          if (phase === 'result' || isAllRevealed) {
            router.push('/');
          } else {
            router.back();
          }
        }}
      />

      {/* Question Context Banner & Phase Progress Tracker */}
      <div className="w-full flex items-center justify-between px-2 pt-1 text-xs font-serif border-b border-stone-200 pb-2">
        <span className="text-amber-900 font-bold truncate max-w-[200px]">
          {isClarifier ? '追问：' : '问：'}{question}
        </span>
        <span className="text-stone-500 text-[11px] font-medium">
          {phase === 'ritual' && '第一阶段 · 洗心祈请'}
          {phase === 'shuffle' && '第二阶段 · 乾坤洗牌'}
          {phase === 'cut' && '第三阶段 · 切牌定序'}
          {phase === 'deck' && '第四阶段 · 直觉抽牌'}
          {phase === 'reveal' && '第五阶段 · 翻牌显圣'}
          {phase === 'result' && '第六阶段 · 天机尽释'}
        </span>
      </div>

      {/* STEP 0: RITUAL MEDITATION (洗心祈请仪式) */}
      {phase === 'ritual' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <RitualMeditation
            question={question}
            category={category}
            onComplete={handleRitualComplete}
            onSkip={handleSkipRitual}
          />
        </div>
      )}

      {/* STEP 1: SHUFFLE */}
      {phase === 'shuffle' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <h2 className="text-xl font-serif font-black text-gold-gradient">
              52张东方神明扑克
            </h2>
            <p className="text-xs text-stone-500 font-serif mt-1">
              静心默念你的问题，点击下方按钮开始洗牌
            </p>
          </div>

          <ShuffleAnimation onComplete={handleShuffleComplete} />
        </div>
      )}

      {/* STEP 2: CUT DECK */}
      {phase === 'cut' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <CutDeckAnimation onCutComplete={handleCutComplete} />
        </div>
      )}

      {/* STEP 3: 52-CARD COVERFLOW DECK */}
      {phase === 'deck' && (
        <div className="flex-1 flex flex-col items-center">
          <CardDeck
            requiredCount={cardCountToDraw}
            onCardsSelected={handleCardsSelected}
          />
        </div>
      )}

      {/* STEP 4 & 5: SPREAD REVEAL & RESULT */}
      {(phase === 'reveal' || phase === 'result') && (
        <div className="flex-1 flex flex-col items-center space-y-4 animate-fade-in">
          {/* Action Bar for Quick Reveal */}
          {!isAllRevealed && (
            <div className="w-full flex items-center justify-between bg-amber-50/80 p-3 rounded-2xl border border-amber-300 shadow-xs">
              <span className="text-xs font-serif font-bold text-amber-900">
                请逐一点击卡牌翻开显圣
              </span>
              <button
                onClick={handleRevealAll}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-serif font-black hover:bg-amber-400 flex items-center gap-1 active:scale-95 transition-all shadow-xs"
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

          {/* Major Combination Resonance Banner if triggered */}
          {isAllRevealed && readingResult?.combinationsAnalysis?.[0] && (
            <CombinationResonanceBanner
              combination={readingResult.combinationsAnalysis[0]}
            />
          )}

          {/* If all cards are revealed, show Intelligence Reading Summary */}
          {isAllRevealed && readingResult && (
            <div className="w-full space-y-4 pt-2">
              <ReadingSummary
                reading={readingResult}
                onSelectFollowUp={handleFollowUpSelect}
              />

              {/* Bottom Fixed Action to Start New or View History */}
              <div className="w-full flex items-center gap-2 pt-2">
                <button
                  onClick={() => router.push('/spread')}
                  className="flex-1 py-3.5 rounded-2xl bg-amber-500 text-stone-950 font-serif font-black text-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>再启新问 · 重占天机</span>
                </button>
                <button
                  onClick={() => router.push('/history')}
                  className="px-5 py-3.5 rounded-2xl bg-white border border-amber-300 text-amber-900 font-serif font-bold text-xs hover:bg-amber-50 transition-all shadow-xs active:scale-95"
                >
                  查看历史
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Detail Bottom Sheet Modal */}
      <CardDetailModal
        card={modalCard}
        onClose={() => setModalCard(null)}
      />
    </div>
  );
}

export default function DrawPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-serif">正在沟通天地气机...</p>
          </div>
        </div>
      }
    >
      <DrawContent />
    </Suspense>
  );
}
