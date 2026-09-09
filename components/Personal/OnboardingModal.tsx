'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Clock, MapPin, User, Check, Shield } from 'lucide-react';
import { BirthProfile } from '@/personal/birthProfile';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { MALAYSIA_REGIONS } from '@/data/regions';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [mounted, setMounted] = useState(false);
  const [nickname, setNickname] = useState('天机居士');
  const [birthDate, setBirthDate] = useState('1996-08-18');
  const [birthTime, setBirthTime] = useState('10:30');
  const [birthPlace, setBirthPlace] = useState('吉隆坡 (Kuala Lumpur)');
  const [gender, setGender] = useState<'乾造 (男)' | '坤造 (女)' | '未透露'>('坤造 (女)');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

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

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs"
        />

        {/* Modal Window with Max Height & Scroll for Mobile screens */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-[390px] max-h-[90vh] bg-[#FAF8F5] border-2 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5 flex flex-col overflow-y-auto my-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-3.5 right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors z-20"
          >
            <span className="text-xl leading-none">✕</span>
          </button>

          {/* Header */}
          <div className="text-center space-y-1 pt-0.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-400 text-amber-950 text-lg font-bold mx-auto flex items-center justify-center shadow-xs">
              ☯
            </div>
            <h2 className="text-base sm:text-lg font-serif font-black text-gold-gradient pt-0.5">
              建立你的天机档案
            </h2>
            <p className="text-[11px] text-stone-500 font-serif">
              输入出生时辰以解锁个人五行偏向与专属神谕加权
            </p>
          </div>

          {/* Form */}
          <div className="space-y-2.5 text-xs font-serif">
            <div>
              <label className="text-[10px] text-stone-600 block mb-1 flex items-center gap-1 font-bold">
                <User className="w-3 h-3 text-amber-700" />
                <span>道号 / 昵称</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="例如：天机居士"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-serif shadow-inner text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-600 block mb-1 flex items-center gap-1 font-bold">
                  <Calendar className="w-3 h-3 text-amber-700" />
                  <span>出生日期</span>
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-mono shadow-inner text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-600 block mb-1 flex items-center gap-1 font-bold">
                  <Clock className="w-3 h-3 text-amber-700" />
                  <span>出生时辰</span>
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-mono shadow-inner text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-600 block mb-1 flex items-center gap-1 font-bold">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  <span>出生地点 (马来西亚)</span>
                </label>
                <select
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-serif shadow-inner text-xs truncate"
                >
                  {MALAYSIA_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-stone-600 block mb-1 font-bold">乾坤造化</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-serif shadow-inner text-xs"
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
          <div className="space-y-1.5 pt-0.5">
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-xs shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>保存并开启天机档案</span>
            </button>

            <button
              onClick={handleSkip}
              className="w-full py-1.5 text-[11px] text-stone-400 hover:text-stone-700 font-serif transition-colors text-center cursor-pointer"
            >
              稍后填写，先体验抽牌 ➔
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
