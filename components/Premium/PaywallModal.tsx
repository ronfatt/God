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
          className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-[390px] max-h-[90vh] bg-[#FAF8F5] border-2 border-amber-400 rounded-3xl p-5 shadow-2xl overflow-y-auto space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-serif font-bold text-stone-900">
                解锁更深层的天机
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-800">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-stone-600 font-serif leading-relaxed text-center">
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
                      ? 'bg-gradient-to-r from-amber-100 via-white to-amber-50 border-amber-500 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-amber-300'
                  }`}
                >
                  {t === 'pro' && (
                    <span className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-xl bg-amber-500 text-stone-950 text-[9px] font-black font-mono">
                      RECOMMENDED
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-xs font-serif font-bold text-stone-900">{cfg.name}</h4>
                      <span className="text-base font-mono font-black text-amber-800">{cfg.price}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-amber-500 border-amber-500 text-stone-950 shadow-xs' : 'border-stone-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <ul className="space-y-1 text-[11px] text-stone-600 font-serif">
                    {cfg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Upgrade CTA */}
          <button
            onClick={() => handleUpgrade(selectedTier)}
            disabled={isSuccess}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-xs shadow-[0_4px_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>恭喜！特权已成功开启</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-stone-950" />
                <span>立即开启 {TIER_CONFIGS[selectedTier].name} 特权</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1 text-[10px] text-stone-400 font-serif">
            <Shield className="w-3 h-3" />
            <span>随时可取消 · 安全结缘承诺</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
