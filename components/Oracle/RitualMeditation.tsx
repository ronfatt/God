'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/sound';
import { Sparkles, Heart, Flame, Shield, ArrowRight, Volume2, VolumeX, CheckCircle } from 'lucide-react';

interface RitualMeditationProps {
  question: string;
  category: string;
  onComplete: () => void;
  onSkip?: () => void;
}

export const RitualMeditation: React.FC<RitualMeditationProps> = ({
  question,
  category,
  onComplete,
  onSkip,
}) => {
  // Step: 1 (静心调息) -> 2 (虔诚发愿/持咒) -> 3 (灵台启悟/祈请)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [chantCount, setChantCount] = useState<number>(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  // Breathing Loop for Step 1
  useEffect(() => {
    if (currentStep !== 1) return;

    sound.playZenChime(432, 1.5);

    const timer1 = setTimeout(() => setBreathPhase('hold'), 3000);
    const timer2 = setTimeout(() => setBreathPhase('exhale'), 5500);
    const timer3 = setTimeout(() => {
      setBreathPhase('inhale');
      setCurrentStep(2);
      sound.playZenChime(528, 1.5);
    }, 8500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentStep]);

  // Chant mantra increment for Step 2
  const handleChant = () => {
    sound.playBassHit();
    const next = chantCount + 1;
    setChantCount(next);
    if (next >= 3) {
      setTimeout(() => {
        setCurrentStep(3);
        sound.playZenChime(639, 2.0);
      }, 500);
    }
  };

  const handleStartDraw = () => {
    sound.playZenChime(852, 2.5);
    onComplete();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 space-y-6 select-none relative overflow-hidden">
      {/* Background Sacred Aura Field */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: currentStep === 1 ? [1, 1.25, 1] : currentStep === 2 ? [1.1, 1.3, 1.1] : [1.2, 1.45, 1.2],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28)_0%,rgba(180,140,50,0.08)_50%,transparent_70%)] blur-2xl"
        />
      </div>

      {/* Header Badge */}
      <div className="flex items-center justify-between w-full max-w-sm px-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-400 text-amber-950 text-xs font-serif font-black shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>天机启卜 · 东方洗心祈请礼</span>
        </div>

        {onSkip && (
          <button
            onClick={onSkip}
            className="text-[11px] font-serif text-stone-500 hover:text-amber-900 transition-colors underline underline-offset-2"
          >
            跳过仪式
          </button>
        )}
      </div>

      {/* 3-Step Progress Indicators */}
      <div className="flex items-center justify-center gap-8 relative z-10">
        {[
          { step: 1, title: '静心调息' },
          { step: 2, title: '默念心咒' },
          { step: 3, title: '感应发愿' },
        ].map((item) => {
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;

          return (
            <div key={item.step} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-black border-2 transition-all duration-500 shadow-xs ${
                  isDone
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : isActive
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 text-stone-950 scale-110 shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                    : 'bg-white border-stone-300 text-stone-400'
                }`}
              >
                {isDone ? <CheckCircle className="w-4 h-4" /> : `0${item.step}`}
              </div>
              <span
                className={`text-[11px] font-serif font-bold ${
                  isActive ? 'text-amber-950' : isDone ? 'text-amber-800' : 'text-stone-400'
                }`}
              >
                {item.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Stage for Steps */}
      <AnimatePresence mode="wait">
        {/* STEP 1: 静心调息 (Breathing Mandala) */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm flex flex-col items-center text-center space-y-5 relative z-10"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-black text-stone-900">
                第一礼 · 屏息凝神
              </h3>
              <p className="text-xs text-stone-600 font-serif leading-relaxed">
                请放下杂念，跟随光晕律动深呼吸，连接天地气机
              </p>
            </div>

            {/* Breathing Animated Sphere */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: breathPhase === 'inhale' ? 1.35 : breathPhase === 'hold' ? 1.35 : 0.85,
                }}
                transition={{ duration: breathPhase === 'hold' ? 0 : 3.2, ease: 'easeInOut' }}
                className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 opacity-80 border-2 border-amber-300 shadow-[0_0_30px_rgba(212,175,55,0.45)] flex items-center justify-center"
              >
                <span className="text-stone-950 font-serif font-black text-sm tracking-widest">
                  {breathPhase === 'inhale' ? '吸气 · 纳福' : breathPhase === 'hold' ? '屏息 · 凝神' : '呼气 · 释怀'}
                </span>
              </motion.div>
            </div>

            <button
              onClick={() => {
                setCurrentStep(2);
                sound.playZenChime(528, 1.5);
              }}
              className="px-5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-serif font-bold text-xs hover:bg-amber-200 transition-all shadow-xs active:scale-95"
            >
              心已清净 · 进入下一步
            </button>
          </motion.div>
        )}

        {/* STEP 2: 虔诚持咒 (Chant 3 Times) */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm flex flex-col items-center text-center space-y-4 relative z-10"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-black text-stone-900">
                第二礼 · 默诵正念心咒
              </h3>
              <p className="text-xs text-stone-600 font-serif">
                心怀善念，感应神明。在心中默念并点击结印（共 3 次）
              </p>
            </div>

            {/* Sacred Mantra Glass Scroll */}
            <div className="w-full p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-400/80 space-y-2 shadow-sm">
              <span className="text-[11px] font-serif font-bold text-amber-800 tracking-wider block">
                【天机正道真言】
              </span>
              <p className="text-base sm:text-lg font-serif font-black text-amber-950 tracking-widest leading-relaxed">
                “心存善念 · 顺天应时<br />诸行无常 · 乾坤自清”
              </p>
            </div>

            {/* Chant Button with Progress Ring */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleChant}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-serif font-black text-sm shadow-[0_4px_18px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 border border-amber-300 active:scale-95 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>心已默诵 · 点击结印 ({chantCount} / 3)</span>
            </motion.button>
          </motion.div>
        )}

        {/* STEP 3: 灵台启悟 / 祈请神谕 (Final Confirmation) */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm flex flex-col items-center text-center space-y-4 relative z-10"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-black text-stone-900">
                第三礼 · 祈请天机法相
              </h3>
              <p className="text-xs text-stone-600 font-serif">
                心意已通达，祈请东方五十二尊法相圣相指引
              </p>
            </div>

            {/* Question Echo Banner */}
            <div className="w-full p-4 rounded-2xl bg-white/90 border border-amber-300 space-y-1.5 shadow-xs text-left">
              <span className="text-[10.5px] font-serif font-bold text-amber-800">
                求问事宜：
              </span>
              <p className="text-sm font-serif font-black text-stone-900 leading-snug">
                “{question}”
              </p>
            </div>

            {/* Primary Sacred Action CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartDraw}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-serif font-black text-base shadow-[0_6px_25px_rgba(212,175,55,0.45)] border-2 border-amber-300 flex items-center justify-center gap-2"
            >
              <span>开启乾坤洗牌 · 领受神谕</span>
              <ArrowRight className="w-5 h-5 text-stone-950" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
