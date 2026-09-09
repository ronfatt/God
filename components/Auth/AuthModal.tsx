'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Storage } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { UserProfile } from '@/types/oracle';
import { Sparkles, X, User, Lock, Mail, Phone, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'register',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!username.trim()) {
      setError('请输入道号或用户名');
      return;
    }

    if (mode === 'register') {
      const res = Storage.registerAccount({
        username,
        password: password || undefined,
        email: email || undefined,
        phone: phone || undefined,
      });

      if (!res.success) {
        setError(res.message);
      } else if (res.user) {
        sound.playZenChime(528, 1.5);
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 800);
      }
    } else {
      const res = Storage.loginAccount(username, password || undefined);
      if (!res.success) {
        setError(res.message);
      } else if (res.user) {
        sound.playZenChime(440, 1.2);
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 800);
      }
    }
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
          className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-[380px] bg-[#FAF8F5] border-2 border-amber-400 rounded-3xl p-5 shadow-2xl space-y-4 select-none"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-400 text-amber-950 text-xl font-bold mx-auto flex items-center justify-center shadow-xs">
              ☯
            </div>
            <h2 className="text-xl font-serif font-black text-gold-gradient pt-1">
              {mode === 'register' ? '开辟天机缘籍 · 免费注册' : '天机归位 · 缘籍登录'}
            </h2>
            <p className="text-xs text-stone-500 font-serif">
              {mode === 'register'
                ? '注册会员即可永久保存每日一牌、占验记录与本命气运轨迹'
                : '登录您的道号以同步全部历史占验与灵石'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-2xl bg-amber-100/60 p-1 border border-amber-300/60">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-xl font-serif text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              缘籍注册 (赠150灵石)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-xl font-serif text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              已有账户登录
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs font-serif pt-1">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-1">
              <label className="text-[11px] text-stone-700 font-bold block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span>道号 / 用户名 <span className="text-amber-800">*</span></span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入您的专属道号 (例如：天机客)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-serif shadow-inner"
              />
            </div>

            {/* Optional Email/Phone for Register */}
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-700 font-bold block flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-700" />
                    <span>绑定邮箱 (选填，用于找回与神谕周报)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@tianji.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-serif shadow-inner"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-stone-700 font-bold block flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-amber-700" />
                    <span>手机号码 (选填)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="选填手机号"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-mono shadow-inner"
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] text-stone-700 font-bold block flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>密码 {mode === 'register' && '(选填，留空则快捷免密)'}</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? '设置登录密码或留空' : '请输入账户密码'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-mono shadow-inner"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-serif font-black text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 border border-amber-300"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>{mode === 'register' ? '立即开辟缘籍 · 领150灵石' : '立即登录 · 归位命格'}</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>
          </form>

          {/* Safe Privacy Footer */}
          <div className="pt-2 text-center border-t border-stone-200/80">
            <span className="text-[10px] text-stone-400 font-serif flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>本命八字与神谕记录受端到端加密保护</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
