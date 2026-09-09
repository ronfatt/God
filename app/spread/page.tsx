'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { SpreadType, UserProfile } from '@/types/oracle';
import { SPREAD_CONFIGS } from '@/data/cards';
import { Sparkles, Crown, ArrowRight, Layers, Coins, Lock, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { sound } from '@/lib/sound';
import { Storage, MAX_DAILY_ONE_CARD_DRAWS } from '@/lib/storage';
import { AuthModal } from '@/components/Auth/AuthModal';
import { motion, AnimatePresence } from 'framer-motion';

function SpreadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'general';
  const question = searchParams.get('q') || '今日神谕·乾坤运势';
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dailyOneRemaining, setDailyOneRemaining] = useState<number>(3);
  const [user, setUser] = useState<UserProfile>(Storage.getUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    setDailyOneRemaining(Storage.getDailyOneCardRemaining());
    setUser(Storage.getUser());

    const handleStorageChange = () => {
      setDailyOneRemaining(Storage.getDailyOneCardRemaining());
      setUser(Storage.getUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showToast = (msg: string) => {
    sound.playBassHit();
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectSpread = (spreadType: SpreadType, tokenCost: number, isComingSoon?: boolean) => {
    if (isComingSoon) {
      showToast('【敬请期待】该高级阵法正在宗师殿堂加持校准中，基础版暂不开放');
      return;
    }

    if (spreadType === 'one') {
      if (!Storage.canDrawOneCard()) {
        showToast('【今日限额已满】一牌定音每日限 3 次免费结缘。明日子时重置，或体验「三才神谕」推演！');
        return;
      }
    }

    if (spreadType === 'three' || tokenCost > 0) {
      const currentWallet = Storage.getWallet();
      const currentUser = Storage.getUser();
      const availableTokens = currentWallet.balance ?? currentUser.tokens ?? 0;

      if (availableTokens < tokenCost) {
        showToast(`【灵石不足】三才神谕需扣除 ${tokenCost} 灵石（当前剩余 ${availableTokens}）。注册开辟缘籍即可获赠 150 灵石！`);
        setTimeout(() => setIsAuthOpen(true), 900);
        return;
      }

      // Deduct tokens
      const success = Storage.consumeTokens(tokenCost, `开启 ${spreadType === 'three' ? '三才神谕' : spreadType} 牌阵`);
      if (!success) {
        showToast('灵石扣除未成功，请稍后再试');
        return;
      }
    }

    sound.playCardSelect();

    router.push(
      `/draw?category=${encodeURIComponent(category)}&q=${encodeURIComponent(
        question
      )}&spread=${spreadType}`
    );
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none animate-fade-in relative">
      <TopHeader title="选择牌阵" showBack onBack={() => router.push('/question')} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-stone-900/95 text-amber-300 border border-amber-500/60 shadow-2xl text-xs font-serif flex items-center gap-2 max-w-[340px] text-center backdrop-blur-md"
          >
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="pt-2 text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/70 border border-amber-400/60 text-amber-950 text-[10.5px] font-serif font-bold shadow-2xs">
          <span>02 · 布阵列象</span>
        </div>
        <h1 className="text-2xl font-serif font-black text-gold-gradient tracking-wide">
          选择你的演卦阵法
        </h1>
        <p className="text-xs text-stone-600 font-serif font-medium">
          基础版优先开放「一牌定音」(每日3次) 与「三才神谕」(10灵石)
        </p>
      </div>

      {/* Spread Cards */}
      <div className="space-y-3.5 pt-1">
        {/* 1. 一牌定音 (Single Card - 每日限 3 次) */}
        <motion.div
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => handleSelectSpread('one', 0, false)}
          className={`w-full p-4.5 rounded-3xl glass-panel-gold border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group shadow-xs hover:shadow-md ${
            dailyOneRemaining > 0 ? 'border-amber-400 hover:border-amber-500' : 'border-stone-300 opacity-90'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 border border-amber-400/80 flex items-center justify-center text-amber-950 font-serif font-black text-base shadow-xs group-hover:scale-105 transition-transform">
                一牌
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-black text-stone-900 group-hover:text-amber-950 transition-colors">
                    一牌定音 · 基础神谕
                  </h3>
                  <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 font-serif font-bold flex items-center gap-0.5">
                    <span>每日限3次</span>
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase font-bold block">
                  1 Card · 直指本心 · 独断乾坤
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-serif font-black px-2.5 py-0.5 rounded-full border ${
                dailyOneRemaining > 0
                  ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                  : 'text-stone-500 bg-stone-100 border-stone-300'
              }`}>
                {dailyOneRemaining > 0 ? `免费 · 余 ${dailyOneRemaining}/3 次` : '今日已用完 (0/3)'}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 font-serif mt-3 leading-relaxed font-medium bg-white/60 p-2.5 rounded-2xl border border-stone-200/60">
            直指本心，一牌显圣。针对今日气机或当下单一疑问，快速洞悉天地核心指引。
          </p>

          <div className="mt-3 pt-2.5 border-t border-amber-900/10 flex items-center justify-between text-xs">
            <span className="text-[11px] text-stone-500 font-serif flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-700" />
              <span>今日剩余可用: <b className="text-amber-900 font-mono">{dailyOneRemaining}</b> 次</span>
            </span>
            <span className="text-amber-900 font-serif font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{dailyOneRemaining > 0 ? '立即抽牌' : '今日已满'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </div>
        </motion.div>

        {/* 2. 三才神谕 (Three Cards - 扣除 10 灵石) */}
        <motion.div
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => handleSelectSpread('three', 10, false)}
          className="w-full p-4.5 rounded-3xl glass-panel border-2 border-stone-200 hover:border-amber-400 transition-all duration-300 cursor-pointer relative overflow-hidden group shadow-xs hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center text-amber-950 font-serif font-black text-base shadow-xs group-hover:scale-105 transition-transform">
                三才
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-black text-stone-900 group-hover:text-amber-950 transition-colors">
                    三才神谕 · 乾坤推演
                  </h3>
                  <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-serif font-bold">
                    完整开放
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase font-bold block">
                  3 Cards · 天 / 人 / 地 三维交织
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-950 font-mono font-black text-xs bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-400 shadow-2xs">
                <Coins className="w-3.5 h-3.5 text-amber-700" />
                <span>10 灵石</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-700 font-serif mt-3 leading-relaxed font-medium bg-white/60 p-2.5 rounded-2xl border border-stone-200/60">
            天、地、人三维交织，深度剖析事件过去根源、当下症结与未来走向。
          </p>

          <div className="mt-3 pt-2.5 border-t border-amber-900/10 flex items-center justify-between text-xs">
            <span className="text-[11px] text-stone-500 font-serif">推荐全面分析因缘、状态与走向（消耗10灵石）</span>
            <span className="text-amber-900 font-serif font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>立即布阵</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </div>
        </motion.div>

        {/* 3. 六合命盘 (Six Cards - 敬请期待) */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          onClick={() => handleSelectSpread('six', 20, true)}
          className="w-full p-4.5 rounded-3xl bg-stone-100/80 border-2 border-dashed border-stone-300/80 cursor-pointer relative overflow-hidden group opacity-85 hover:opacity-100 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-600 font-serif font-black text-base shadow-xs">
                六合
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-black text-stone-700">
                    六合命盘
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-serif font-black flex items-center gap-1 shadow-2xs">
                    <Lock className="w-2.5 h-2.5 text-amber-800" />
                    <span>敬请期待</span>
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono tracking-wider uppercase font-bold block">
                  6 Cards · 本命/财富/事业/感情/贵人/未来
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-stone-500 font-mono font-bold text-xs bg-stone-200/80 px-2 py-0.5 rounded-full border border-stone-300">
              <Coins className="w-3.5 h-3.5 text-stone-500" />
              <span>20 灵石</span>
            </div>
          </div>

          <p className="text-xs text-stone-500 font-serif mt-3 leading-relaxed font-medium bg-white/40 p-2.5 rounded-2xl border border-stone-200/40">
            全方位洞悉人生六大核心支柱，深度剖析本命与未来90天综合运势。（暂不开放）
          </p>

          <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between text-xs">
            <span className="text-[11px] text-amber-900/80 font-serif font-bold">宗师殿堂加持校准中 · 敬请期待</span>
            <span className="text-stone-400 font-serif font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>暂未开放</span>
            </span>
          </div>
        </motion.div>

        {/* 4. 九宫天命 (Nine Cards - 敬请期待) */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          onClick={() => handleSelectSpread('nine', 50, true)}
          className="w-full p-4.5 rounded-3xl bg-purple-50/40 border-2 border-dashed border-purple-200/80 cursor-pointer relative overflow-hidden group opacity-85 hover:opacity-100 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100/70 border border-purple-200 flex items-center justify-center text-purple-900 font-serif font-black text-base shadow-xs">
                九宫
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-black text-stone-700">
                    九宫天命 · 奇门大阵
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 border border-purple-300 text-purple-950 font-serif font-black flex items-center gap-1 shadow-2xs">
                    <Lock className="w-2.5 h-2.5 text-purple-800" />
                    <span>敬请期待</span>
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono tracking-wider uppercase font-bold block">
                  9 Cards · 3×3 奇门全维大卦
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-stone-500 font-mono font-bold text-xs bg-stone-200/80 px-2 py-0.5 rounded-full border border-stone-300">
              <Coins className="w-3.5 h-3.5 text-stone-500" />
              <span>50 灵石</span>
            </div>
          </div>

          <p className="text-xs text-stone-500 font-serif mt-3 leading-relaxed font-medium bg-white/40 p-2.5 rounded-2xl border border-stone-200/40">
            3×3 奇门遁甲阵法，涵盖本命、财富、事业、阻碍、转机等九重命门。（暂不开放）
          </p>

          <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between text-xs">
            <span className="text-[11px] text-purple-900/80 font-serif font-bold">奇门大阵封印演练中 · 敬请期待</span>
            <span className="text-stone-400 font-serif font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>暂未开放</span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* Auth Modal for Token Top-up/Registration */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode="register"
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />
    </div>
  );
}

export default function SpreadPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-serif text-stone-500">正在布置天机法坛...</div>}>
      <SpreadContent />
    </Suspense>
  );
}

