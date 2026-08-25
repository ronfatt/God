'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Clock, MapPin, User, Check, X, Shield } from 'lucide-react';
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
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-[380px] bg-gradient-to-b from-[#151924] via-[#0e1017] to-[#08090d] border border-amber-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(212,175,55,0.2)] space-y-4"
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xl font-bold mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              ☯
            </div>
            <h2 className="text-lg font-serif font-bold text-gold-gradient pt-1">
              建立你的天机档案
            </h2>
            <p className="text-[11px] text-neutral-400 font-serif">
              输入出生时辰以解锁个人五行偏向与专属神谕加权
            </p>
          </div>

          {/* Form */}
          <div className="space-y-2.5 text-xs font-serif">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-amber-400" />
                <span>道号 / 昵称</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="例如：天机居士"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>出生日期</span>
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>出生时间</span>
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>出生地点</span>
                </label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="省份 · 城市"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-400 font-serif text-[11px]"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">乾坤性别</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-400 font-serif text-[11px]"
                >
                  <option value="坤造 (女)">坤造 (女)</option>
                  <option value="乾造 (男)">乾造 (男)</option>
                  <option value="未透露">暂不透露</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-serif justify-center">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>所有资料仅存储于本地设备，严格保护隐私</span>
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>开启天机命盘</span>
            </button>

            <button
              onClick={handleSkip}
              className="w-full py-2 text-center text-xs font-serif text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              稍后填写，先体验神谕 ➔
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
