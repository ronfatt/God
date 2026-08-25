'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Sparkles, Shield, Zap } from 'lucide-react';
import { TIER_CONFIGS, SubscriptionTier } from '@/premium/entitlement';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUpgrade?: (tier: SubscriptionTier) => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, onSuccessUpgrade }) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('plus');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = (tier: SubscriptionTier) => {
    sound.playBassHit();
    const entitlement = Storage.getEntitlement();
    const updated = {
      ...entitlement,
      tier,
      tierName: TIER_CONFIGS[tier].name,
      features: TIER_CONFIGS[tier].features,
    };
    Storage.setEntitlement(updated);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onSuccessUpgrade?.(tier);
      onClose();
    }, 1500);
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
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-[390px] max-h-[90vh] bg-gradient-to-b from-[#161922] via-[#0d0f16] to-[#07080c] border border-amber-500/40 rounded-3xl p-5 shadow-[0_0_50px_rgba(212,175,55,0.25)] overflow-y-auto space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-serif font-bold text-amber-200">
                解锁更深层的天机
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-neutral-300 font-serif leading-relaxed text-center">
            升级至高级会员，开启九宫大阵、AI 深度推演、30 日命势报告与长远天机年鉴。
          </p>

          {/* Tier Selection Cards */}
          <div className="space-y-2.5">
            {(['plus', 'pro'] as SubscriptionTier[]).map((t) => {
              const cfg = TIER_CONFIGS[t];
              const isSelected = selectedTier === t;
              return (
                <div
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-950 border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {t === 'pro' && (
                    <span className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-xl bg-amber-500 text-black text-[9px] font-bold font-mono">
                      RECOMMENDED
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-xs font-serif font-bold text-amber-200">{cfg.name}</h4>
                      <span className="text-base font-mono font-extrabold text-gold-gradient">{cfg.price}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-amber-400 bg-amber-500 text-black' : 'border-neutral-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <ul className="text-[11px] font-serif text-neutral-300 space-y-1">
                    {cfg.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-1 text-[10px] font-serif text-neutral-400">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>随时可取消订阅 · 演示环境模拟开通</span>
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <button
              onClick={() => handleUpgrade(selectedTier)}
              disabled={isSuccess}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>天机特权开通成功！</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 fill-black" />
                  <span>立即结缘开通 {TIER_CONFIGS[selectedTier].badge} 尊享特权</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
