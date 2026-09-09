'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, KeyRound, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { AdminService } from '@/lib/adminService';

interface AdminAuthProps {
  onSuccess: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('请输入天机总枢通行口令');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const ok = AdminService.login(passcode);
      if (ok) {
        onSuccess();
      } else {
        setErrorMsg('口令不符，天机禁制未解（默认口令：tianji888）');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background mystical aura */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-900/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-stone-900/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6"
      >
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 text-stone-950 shadow-lg shadow-amber-500/20 mb-2 border border-amber-300/40">
            <Shield className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-serif tracking-widest text-amber-400 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>天机司 · 总枢禁制</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-2xl font-serif font-black text-stone-100 tracking-wide">
            天机52 管理总枢
          </h1>
          <p className="text-xs text-stone-400 font-serif">
            元象能量馆 · 核心中后台运营与调度系统
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-serif font-medium text-stone-300 flex items-center justify-between">
              <span>总枢认证口令</span>
              <span className="text-[10px] text-amber-400/80 font-mono">PASSCODE</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-amber-400/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="请输入天机管理员通行秘钥..."
                className="w-full pl-10 pr-4 py-3 bg-stone-950/80 border border-stone-700/80 rounded-2xl text-sm font-mono text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
                autoFocus
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-400 font-serif pt-1 flex items-center gap-1">
                <span>⚠️</span> {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-serif font-black text-sm tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">解禁认证中...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>开启天机总枢</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-stone-800 text-center">
          <p className="text-[11px] text-stone-500 font-serif">
            天机52属于元象能量馆旗下版权 · 翻版必究
          </p>
        </div>
      </motion.div>
    </div>
  );
};
