'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Check, Shield, Eye, EyeOff } from 'lucide-react';
import { IntelligenceReadingResult } from '@/intelligence';
import { SharePrivacySettings, DEFAULT_SHARE_PRIVACY } from '@/sharing/sharePrivacy';
import { buildShareCardData, ShareCardData } from '@/sharing/shareCardGenerator';
import { sound } from '@/lib/sound';

interface ShareCardModalProps {
  isOpen: boolean;
  reading: IntelligenceReadingResult;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ isOpen, reading, onClose }) => {
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1'>('9:16');
  const [privacy, setPrivacy] = useState<SharePrivacySettings>(DEFAULT_SHARE_PRIVACY);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const shareData: ShareCardData = buildShareCardData(reading, privacy, '天机缘主');

  const handleCopyShare = () => {
    sound.playBassHit();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-[400px] max-h-[90vh] bg-[#FAF8F5] border-2 border-amber-400 rounded-3xl p-5 shadow-2xl overflow-y-auto space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-serif font-bold text-stone-900">
                分享我的天机神谕
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-800">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Aspect Ratio Switch */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`px-3 py-1 rounded-full text-xs font-serif transition-colors ${
                aspectRatio === '9:16'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              9:16 灵感快拍 (Story)
            </button>
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`px-3 py-1 rounded-full text-xs font-serif transition-colors ${
                aspectRatio === '1:1'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              1:1 方形海报 (Post)
            </button>
          </div>

          {/* The Share Card Canvas Preview */}
          <div
            className={`w-full mx-auto rounded-3xl bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F3EDE0] border-2 border-amber-400/80 p-5 flex flex-col justify-between relative overflow-hidden shadow-md ${
              aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-square'
            }`}
          >
            {/* Background Watermark Taiji */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-amber-700/[0.04] select-none pointer-events-none">
              ☯
            </div>

            {/* Top Brand */}
            <div className="flex items-center justify-between text-[10px] font-serif text-amber-900 border-b border-amber-300 pb-2">
              <span className="font-bold tracking-widest uppercase">TIANJI 52 · 东方神谕</span>
              <span className="font-mono text-stone-500 font-bold">综合指数 {shareData.overallScore}</span>
            </div>

            {/* Core Theme & Cards */}
            <div className="text-center space-y-2 my-auto">
              <div className="inline-block px-3 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-serif font-bold">
                {shareData.dominantElementName} · {shareData.themeSubtitle}
              </div>

              <h2 className="text-xl font-serif font-extrabold text-gold-gradient tracking-wide">
                {shareData.themeTitle}
              </h2>

              <p className="text-xs text-stone-700 font-serif italic px-2">
                “{shareData.closingQuote}”
              </p>

              {/* Cards Row */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {shareData.cards.map((c, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-white border border-amber-300 text-center space-y-0.5 shadow-xs"
                  >
                    <span className="text-[9px] font-serif font-bold text-amber-900 block">{c.cardName || c.name}</span>
                    <span className="text-[8px] text-stone-500 block">{c.archetype}</span>
                  </div>
                ))}
              </div>

              {/* Optional Question if privacy enabled */}
              {shareData.questionText && (
                <div className="text-[10px] text-stone-500 font-serif pt-1">
                  问：{shareData.questionText}
                </div>
              )}
            </div>

            {/* Bottom Footer */}
            <div className="pt-3 border-t border-amber-300 flex items-center justify-between text-[9px] font-serif text-stone-500">
              <span className="text-amber-900 font-bold">{shareData.brandFooter}</span>
              <span className="font-mono text-stone-400">tianji52.com</span>
            </div>
          </div>

          {/* Privacy Toggles */}
          <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs font-serif shadow-xs">
            <div className="flex items-center justify-between text-stone-700">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>隐私设置 · 包含问卦内容</span>
              </div>
              <button
                onClick={() => setPrivacy({ ...privacy, includeQuestion: !privacy.includeQuestion })}
                className={`p-1 rounded-lg border ${
                  privacy.includeQuestion
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-stone-100 border-stone-200 text-stone-400'
                }`}
              >
                {privacy.includeQuestion ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleCopyShare}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-xs shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" />
                <span>海报链接已复制到剪贴板</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>复制分享海报与链接</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
