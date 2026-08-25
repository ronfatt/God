'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { UserProfile } from '@/types/oracle';
import { Storage, DEFAULT_USER } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { generateHistoryInsights, HistoryInsightsResult } from '@/intelligence';
import { PaywallModal } from '@/components/Premium/PaywallModal';
import {
  User,
  Coins,
  Flame,
  Layers,
  Sparkles,
  Shield,
  Edit3,
  Check,
  Volume2,
  VolumeX,
  TrendingUp,
  AlertCircle,
  Clock,
  Compass,
  Crown,
  ArrowRight,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [insights, setInsights] = useState<HistoryInsightsResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [gender, setGender] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const data = Storage.getUser();
    const history = Storage.getHistory();
    setUser(data);
    setNameInput(data.name);
    setBirthDate(data.birthDate || '1996-08-18');
    setBirthPlace(data.birthPlace || '浙江 · 杭州');
    setGender(data.gender || '坤造 (女)');
    setIsMuted(sound.getMuted());

    const insightData = generateHistoryInsights(history);
    setInsights(insightData);
  }, []);

  const handleSaveProfile = () => {
    sound.playCardSelect();
    const updated: UserProfile = {
      ...user,
      name: nameInput,
      birthDate,
      birthPlace,
      gender,
    };
    setUser(updated);
    Storage.saveUser(updated);
    Storage.saveBirthProfile({
      nickname: nameInput,
      birthDate,
      birthPlace,
      gender: gender as any,
    });
    setIsEditing(false);
  };

  const handleAddTokens = () => {
    sound.playBassHit();
    Storage.addTokens(50, '每日免费补给');
    setUser(Storage.getUser());
  };

  const handleToggleSound = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  const handleResetData = () => {
    sound.playBassHit();
    Storage.resetAllData();
    setShowResetConfirm(false);
    setUser(DEFAULT_USER);
    window.location.reload();
  };

  const elementStats = [
    { name: '水', percent: insights?.elementDistribution30Days.water ?? 38, color: '#06B6D4', label: '玄水智谋' },
    { name: '金', percent: insights?.elementDistribution30Days.metal ?? 26, color: '#EAB308', label: '刚毅决断' },
    { name: '木', percent: insights?.elementDistribution30Days.wood ?? 18, color: '#10B981', label: '生机成长' },
    { name: '火', percent: insights?.elementDistribution30Days.fire ?? 10, color: '#F43F5E', label: '热情显化' },
    { name: '土', percent: insights?.elementDistribution30Days.earth ?? 8, color: '#F59E0B', label: '厚重承载' },
  ];

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4">
      <TopHeader title="命主档案" />

      {/* User Hero Card */}
      <div className="w-full glass-panel rounded-3xl p-5 border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-neutral-900 to-black border-2 border-amber-400/50 flex items-center justify-center text-2xl text-amber-300 shadow-lg">
            <span>{user.avatar || '☯'}</span>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-bold font-mono">
              VIP
            </span>
          </div>

          {/* Nickname & Zodiac */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-neutral-100">
                {user.name}
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-neutral-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? '取消' : '修改'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
              <span className="px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 font-serif text-[11px]">
                {user.zodiac || '丙子鼠'} · 坤造
              </span>
              <span className="text-neutral-400 text-[11px]">
                {user.birthPlace || '浙江 · 杭州'}
              </span>
            </div>
          </div>
        </div>

        {/* Editing Drawer */}
        {isEditing && (
          <div className="mt-4 pt-3 border-t border-neutral-800 space-y-2.5 animate-fade-in">
            <div>
              <label className="text-[10px] text-neutral-400 font-serif block mb-1">道号 / 昵称</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-400 font-serif block mb-1">出生日期</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 font-serif block mb-1">乾坤性别</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
                >
                  <option value="坤造 (女)">坤造 (女)</option>
                  <option value="乾造 (男)">乾造 (男)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-serif block mb-1">出生地点</label>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full mt-2 py-2 rounded-xl bg-amber-500 text-black font-serif font-bold text-xs flex items-center justify-center gap-1 shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存命盘资料</span>
            </button>
          </div>
        )}

        {/* Sub metrics stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-800/80 text-center">
          <div>
            <div className="text-[10px] text-neutral-400 font-serif">天机令</div>
            <div className="text-base font-mono font-bold text-amber-300">
              🪙 {user.tokens}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 font-serif">连续占验</div>
            <div className="text-base font-mono font-bold text-rose-400">
              🔥 {user.streak} 天
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 font-serif">收集图鉴</div>
            <div className="text-base font-mono font-bold text-emerald-400">
              {user.collectedCardIds?.length || 17} / 52
            </div>
          </div>
        </div>
      </div>

      {/* V3 Destiny Dashboard Fast Entry Banner */}
      <div
        onClick={() => {
          sound.playCardSelect();
          router.push('/profile/destiny');
        }}
        className="w-full glass-panel rounded-2xl p-4 border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-neutral-900 to-neutral-950 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-serif font-bold text-amber-200">
              天机档案 · 长期命势总揽
            </h3>
            <p className="text-[10px] text-neutral-400 font-serif">
              7D / 30D / 90D 周期切换 · 五张核心神谕
            </p>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
      </div>

      {/* 个人近期命势总览 */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>我的近期命势洞察</span>
          </h4>
          <span className="text-[10px] text-amber-400 font-serif">
            {insights?.trendLabel || '气运稳步上扬'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-serif">
          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px]">主元素倾向</span>
            <span className="text-cyan-300 font-bold text-sm">玄水 (38%)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px]">核心主题</span>
            <span className="text-amber-300 font-bold text-sm">关系整理 · 疗愈</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px]">主要动力</span>
            <span className="text-emerald-300 font-bold text-sm">向内观察蓄势</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px]">目前牌势</span>
            <span className="text-purple-300 font-bold text-sm">低谷回升 · 顺流</span>
          </div>
        </div>

        <p className="text-xs text-neutral-300 font-serif leading-relaxed bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-800">
          {insights?.themeSummary}
        </p>
      </div>

      {/* Repeated Card Alert */}
      {insights?.repeatedCardAlert && (
        <div className="w-full p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-2.5 text-xs font-serif">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300">
                重复神谕 · {insights.repeatedCardAlert.card.cardName} ({insights.repeatedCardAlert.card.archetype}) × {insights.repeatedCardAlert.count}
              </span>
            </div>
            <p className="text-neutral-300 text-[11px]">
              {insights.repeatedCardAlert.message}
            </p>
          </div>
        </div>
      )}

      {/* 7-Day Score Trend Chart */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-neutral-300">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>近 7 日命势指数走势</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {insights?.trendLabel}
          </span>
        </div>

        {/* Trend Line Visual */}
        <div className="flex items-end justify-between gap-1 h-20 pt-2 px-1 border-b border-neutral-800">
          {insights?.recent7DaysScoreTrend.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] font-mono text-amber-300 font-bold">{item.score}</span>
              <div
                style={{ height: `${Math.max(20, (item.score - 50) * 1.8)}%` }}
                className="w-full max-w-[18px] bg-gradient-to-t from-amber-500/20 to-amber-400 rounded-t-md shadow-[0_0_8px_rgba(212,175,55,0.3)] transition-all duration-500"
              />
              <span className="text-[8px] text-neutral-400 truncate max-w-full font-serif">
                {item.date.slice(-3)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Membership Banner */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-500/30">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-neutral-200">尊享天机会员</div>
            <div className="text-[10px] text-neutral-400">解锁九宫大阵 · AI 深度演卦</div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playCardSelect();
            setIsPaywallOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-serif font-bold text-xs shadow-md active:scale-95 transition-all"
        >
          查看特权
        </button>
      </div>

      {/* Token Top-up Demo */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-500/30">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-neutral-200">天机令补给</div>
            <div className="text-[10px] text-neutral-400">演卦代币 · 每日免费领取</div>
          </div>
        </div>

        <button
          onClick={handleAddTokens}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-300 font-serif font-bold text-xs active:scale-95 transition-all"
        >
          领取 +50 令
        </button>
      </div>

      {/* Settings & Sound */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-neutral-800 space-y-2.5">
        <h4 className="text-xs font-serif font-bold text-neutral-300">系统偏好与资料管理</h4>

        <div className="flex items-center justify-between py-1 text-xs font-serif">
          <div className="flex items-center gap-2 text-neutral-300">
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span>神圣音效 (古磬钟声/洗牌)</span>
          </div>
          <button
            onClick={handleToggleSound}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              !isMuted ? 'bg-amber-500' : 'bg-neutral-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                !isMuted ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Data Reset Button */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-serif">重置我的天机档案</span>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-serif hover:bg-rose-900/60 transition-colors"
          >
            重置资料
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="w-full p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-serif font-bold">
          <Shield className="w-3.5 h-3.5 text-amber-400/80" />
          <span>关于天机52 · 文化体验声明</span>
        </div>
        <p className="text-[11px] text-neutral-400 font-serif leading-relaxed">
          天机52以东方文化、象征系统及娱乐互动为基础，所有内容仅供个人反思、娱乐及文化体验，不构成医疗、法律、投资或其他专业建议。
        </p>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
      />

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-[340px] bg-neutral-950 border border-rose-500/40 rounded-3xl p-5 shadow-2xl space-y-3 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-serif font-bold text-rose-200">
                确定重置天机档案？
              </h3>
              <p className="text-xs text-neutral-300 font-serif leading-relaxed">
                此操作将清空本地所有占验记录与档案数据，无法撤销。
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-serif text-xs"
                >
                  取消
                </button>
                <button
                  onClick={handleResetData}
                  className="py-2.5 rounded-xl bg-rose-600 text-white font-serif font-bold text-xs"
                >
                  确认重置
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
