'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Download, Check, Shield, Eye, EyeOff, Sparkles } from 'lucide-react';
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
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-[400px] max-h-[90vh] bg-[#0c0e15] border border-amber-500/30 rounded-3xl p-5 shadow-2xl overflow-y-auto space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-serif font-bold text-amber-200">
                分享我的天机神谕
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Aspect Ratio Switch */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`px-3 py-1 rounded-full text-xs font-serif transition-colors ${
                aspectRatio === '9:16'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
              }`}
            >
              9:16 灵感快拍 (Story)
            </button>
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`px-3 py-1 rounded-full text-xs font-serif transition-colors ${
                aspectRatio === '1:1'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
              }`}
            >
              1:1 方形海报 (Post)
            </button>
          </div>

          {/* The Share Card Canvas Preview */}
          <div
            className={`w-full mx-auto rounded-2xl bg-gradient-to-b from-[#181a24] via-[#0d0f16] to-black border-2 border-amber-500/40 p-5 flex flex-col justify-between relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)] ${
              aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-square'
            }`}
          >
            {/* Background Watermark Taiji */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-amber-500/[0.03] select-none pointer-events-none">
              ☯
            </div>

            {/* Top Brand */}
            <div className="flex items-center justify-between text-[10px] font-serif text-amber-400/80 border-b border-amber-500/20 pb-2">
              <span className="tracking-widest">天机52 · 东方神谕</span>
              <span>{new Date().toLocaleDateString('zh-CN')}</span>
            </div>

            {/* Card Content Hero */}
            <div className="space-y-2.5 text-center my-auto py-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-serif bg-amber-950/80 border border-amber-500/40 text-amber-300">
                {reading.momentumAnalysis.title} · {reading.elementsAnalysis.dominantLabel}
              </span>

              <h2 className="text-2xl font-serif font-extrabold text-gold-gradient tracking-wide">
                {shareData.themeTitle}
              </h2>

              <p className="text-xs text-amber-300/80 font-serif italic">
                {shareData.themeSubtitle}
              </p>

              {/* Cards Mini Badge */}
              <div className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-[11px] font-serif text-neutral-200">
                {shareData.mainCardsText}
              </div>

              {/* Question Text if enabled */}
              {shareData.questionText && (
                <div className="text-[10px] text-amber-400 font-serif">
                  问：{shareData.questionText}
                </div>
              )}

              {/* Score Badges */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <div className="text-center">
                  <div className="text-[9px] text-neutral-400 font-serif">综合命势</div>
                  <div className="text-sm font-mono font-bold text-amber-300">{shareData.overallScore}</div>
                </div>
                <div className="w-px h-6 bg-neutral-800" />
                <div className="text-center">
                  <div className="text-[9px] text-neutral-400 font-serif">行动指数</div>
                  <div className="text-sm font-mono font-bold text-yellow-400">{shareData.actionScore}</div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Quote */}
            <div className="border-t border-amber-500/20 pt-2 text-center space-y-1">
              <p className="text-[10px] font-serif text-neutral-400 italic">
                “每一次抽牌，都是一个点。当点连接成线，你会看见自己的轨迹。”
              </p>
              <div className="text-[9px] font-mono text-amber-500/60 tracking-wider">
                TIANJI 52 — EASTERN ORACLE
              </div>
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-xs font-serif">
            <div className="flex items-center justify-between text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>隐私安全模式</span>
              </span>
              <span className="text-[10px] text-neutral-500">默认不公开问题详情</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span>海报包含我的具体问题文字</span>
              <button
                onClick={() => setPrivacy({ ...privacy, includeQuestion: !privacy.includeQuestion })}
                className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${
                  privacy.includeQuestion ? 'bg-amber-500' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform ${
                    privacy.includeQuestion ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleCopyShare}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{isCopied ? '已复制天机海报与分享文案' : '保存 / 复制分享海报'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
