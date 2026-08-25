'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Clock, MapPin, User, Check, Shield } from 'lucide-react';
import { BirthProfile } from '@/personal/birthProfile';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [nickname, setNickname] = useState('天机居士');
  const [birthDate, setBirthDate] = useState('1996-08-18');
  const [birthTime, setBirthTime] = useState('10:30');
  const [birthPlace, setBirthPlace] = useState('浙江 · 杭州');
  const [gender, setGender] = useState<'乾造 (男)' | '坤造 (女)' | '未透露'>('坤造 (女)');

  const handleSave = () => {
    sound.playCardSelect();
    const updated: Partial<BirthProfile> = {
      nickname,
      birthDate,
      birthTime,
      birthPlace,
      gender,
    };
    Storage.saveBirthProfile(updated);
    Storage.setOnboardingCompleted();
    onComplete();
  };

  const handleSkip = () => {
    sound.playCardSelect();
    Storage.setOnboardingCompleted();
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-[380px] bg-[#FAF8F5] border-2 border-amber-400 rounded-3xl p-5 shadow-2xl space-y-4"
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 text-xl font-bold mx-auto flex items-center justify-center shadow-xs">
              ☯
            </div>
            <h2 className="text-lg font-serif font-extrabold text-gold-gradient pt-1">
              建立你的天机档案
            </h2>
            <p className="text-[11px] text-stone-500 font-serif">
              输入出生时辰以解锁个人五行偏向与专属神谕加权
            </p>
          </div>

          {/* Form */}
          <div className="space-y-2.5 text-xs font-serif">
            <div>
              <label className="text-[10px] text-stone-600 block mb-1 flex items-center gap-1 font-medium">
                <User className="w-3 h-3 text-amber-700" />
                <span>道号 / 昵称</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="例如：天机居士"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-serif shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-600 block mb-1 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-amber-700" />
                  <span>出生日期</span>
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-mono shadow-inner"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-600 block mb-1 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-amber-700" />
                  <span>出生时辰</span>
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-mono shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-600 block mb-1 flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  <span>出生地点</span>
                </label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="例如：浙江杭州"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-serif shadow-inner"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-600 block mb-1 font-medium">乾坤造化</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-serif shadow-inner"
                >
                  <option value="坤造 (女)">坤造 (女)</option>
                  <option value="乾造 (男)">乾造 (男)</option>
                  <option value="未透露">保密</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-[10px] text-stone-600 font-serif">
            <Shield className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
            <span>资料默认仅保存在您当前设备本地，严守隐私。</span>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-xs shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>保存并开启天机档案</span>
            </button>

            <button
              onClick={handleSkip}
              className="w-full py-2 text-[11px] text-stone-400 hover:text-stone-700 font-serif transition-colors text-center"
            >
              稍后填写，先体验抽牌 ➔
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
