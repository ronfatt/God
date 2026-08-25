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
  Coins,
  Flame,
  Sparkles,
  Shield,
  Edit3,
  Check,
  Volume2,
  VolumeX,
  TrendingUp,
  AlertCircle,
  Compass,
  Crown,
  ArrowRight,
  Trash2,
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

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="命主档案" />

      {/* User Hero Card */}
      <div className="w-full glass-panel rounded-3xl p-5 border border-amber-300 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 flex items-center justify-center text-2xl text-amber-900 shadow-xs">
            <span>{user.avatar || '☯'}</span>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 text-[9px] font-black font-mono">
              VIP
            </span>
          </div>

          {/* Nickname & Zodiac */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-black text-stone-900">
                {user.name}
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-amber-800 hover:text-amber-950 font-serif font-bold flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? '取消' : '修改'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
              <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-serif text-[11px] font-bold">
                {user.zodiac || '丙子鼠'} · 坤造
              </span>
              <span className="text-stone-500 text-[11px]">
                {user.birthPlace || '浙江 · 杭州'}
              </span>
            </div>
          </div>
        </div>

        {/* Editing Drawer */}
        {isEditing && (
          <div className="mt-4 pt-3 border-t border-stone-200 space-y-2.5 animate-fade-in">
            <div>
              <label className="text-[10px] text-stone-500 font-serif block mb-1 font-medium">道号 / 昵称</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-serif"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-500 font-serif block mb-1 font-medium">出生日期</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 font-serif block mb-1 font-medium">乾坤性别</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-serif"
                >
                  <option value="坤造 (女)">坤造 (女)</option>
                  <option value="乾造 (男)">乾造 (男)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-stone-500 font-serif block mb-1 font-medium">出生地点</label>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-serif"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full mt-2 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-serif font-black text-xs flex items-center justify-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存命盘资料</span>
            </button>
          </div>
        )}

        {/* Sub metrics stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-200 text-center">
          <div>
            <div className="text-[10px] text-stone-500 font-serif font-medium">天机令</div>
            <div className="text-base font-mono font-black text-amber-800">
              🪙 {user.tokens}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stone-500 font-serif font-medium">连续占验</div>
            <div className="text-base font-mono font-black text-rose-800">
              🔥 {user.streak} 天
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stone-500 font-serif font-medium">收集图鉴</div>
            <div className="text-base font-mono font-black text-emerald-800">
              {user.collectedCardIds?.length || 17} / 52
            </div>
          </div>
        </div>
      </div>

      {/* V4 Destiny Dashboard Fast Entry Banner */}
      <div
        onClick={() => {
          sound.playCardSelect();
          router.push('/profile/destiny');
        }}
        className="w-full glass-panel rounded-2xl p-4 border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all shadow-xs group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-serif font-bold text-stone-900">
              天机档案 · 长期命势总揽
            </h3>
            <p className="text-[10px] text-stone-500 font-serif">
              7D / 30D / 90D 周期切换 · 五张核心神谕
            </p>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-amber-800 group-hover:translate-x-1 transition-transform" />
      </div>

      {/* 个人近期命势总览 */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-stone-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>我的近期命势洞察</span>
          </h4>
          <span className="text-[10px] text-amber-800 font-serif font-bold">
            {insights?.trendLabel || '气运稳步上扬'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-serif">
          <div className="p-2.5 rounded-xl bg-white border border-stone-200 shadow-xs">
            <span className="text-stone-500 block text-[10px]">主元素倾向</span>
            <span className="text-cyan-800 font-bold text-sm">玄水 (38%)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-stone-200 shadow-xs">
            <span className="text-stone-500 block text-[10px]">核心主题</span>
            <span className="text-amber-800 font-bold text-sm">关系整理 · 疗愈</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-stone-200 shadow-xs">
            <span className="text-stone-500 block text-[10px]">主要动力</span>
            <span className="text-emerald-800 font-bold text-sm">向内观察蓄势</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-stone-200 shadow-xs">
            <span className="text-stone-500 block text-[10px]">目前牌势</span>
            <span className="text-purple-900 font-bold text-sm">低谷回升 · 顺流</span>
          </div>
        </div>

        <p className="text-xs text-stone-700 font-serif leading-relaxed bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
          {insights?.themeSummary}
        </p>
      </div>

      {/* Repeated Card Alert */}
      {insights?.repeatedCardAlert && (
        <div className="w-full p-3 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-2.5 text-xs font-serif shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900">
                重复神谕 · {insights.repeatedCardAlert.card.cardName} ({insights.repeatedCardAlert.card.archetype}) × {insights.repeatedCardAlert.count}
              </span>
            </div>
            <p className="text-stone-600 text-[11px]">
              {insights.repeatedCardAlert.message}
            </p>
          </div>
        </div>
      )}

      {/* 7-Day Score Trend Chart */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-stone-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-stone-900">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>近 7 日命势指数走势</span>
          </div>
          <span className="text-[10px] text-emerald-800 font-mono font-bold">
            {insights?.trendLabel}
          </span>
        </div>

        {/* Trend Line Visual */}
        <div className="flex items-end justify-between gap-1 h-20 pt-2 px-1 border-b border-stone-200">
          {insights?.recent7DaysScoreTrend.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] font-mono text-amber-900 font-bold">{item.score}</span>
              <div
                style={{ height: `${Math.max(20, (item.score - 50) * 1.8)}%` }}
                className="w-full max-w-[18px] bg-gradient-to-t from-amber-300 to-amber-500 rounded-t-md shadow-xs transition-all duration-500"
              />
              <span className="text-[8px] text-stone-500 truncate max-w-full font-serif">
                {item.date.slice(-3)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Membership Banner */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-amber-400/80 bg-gradient-to-r from-amber-50 via-white to-amber-50 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-stone-900">尊享天机会员</div>
            <div className="text-[10px] text-stone-500">解锁九宫大阵 · AI 深度演卦</div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playCardSelect();
            setIsPaywallOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-serif font-black text-xs shadow-xs active:scale-95 transition-all"
        >
          查看特权
        </button>
      </div>

      {/* Token Top-up Demo */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-stone-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-stone-900">天机令补给</div>
            <div className="text-[10px] text-stone-500">演卦代币 · 每日免费领取</div>
          </div>
        </div>

        <button
          onClick={handleAddTokens}
          className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-serif font-bold text-xs active:scale-95 transition-all shadow-xs"
        >
          领取 +50 令
        </button>
      </div>

      {/* Settings & Sound */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-stone-200 space-y-2.5 shadow-xs">
        <h4 className="text-xs font-serif font-bold text-stone-900">系统偏好与资料管理</h4>

        <div className="flex items-center justify-between py-1 text-xs font-serif">
          <div className="flex items-center gap-2 text-stone-700">
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
            <span>神圣音效 (古磬钟声/洗牌)</span>
          </div>
          <button
            onClick={handleToggleSound}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              !isMuted ? 'bg-amber-500' : 'bg-stone-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                !isMuted ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Data Reset Button */}
        <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-serif">重置我的天机档案</span>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-serif font-bold hover:bg-rose-100 transition-colors"
          >
            重置资料
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="w-full p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-stone-600 font-serif font-bold">
          <Shield className="w-3.5 h-3.5 text-amber-700" />
          <span>关于天机52 · 文化体验声明</span>
        </div>
        <p className="text-[11px] text-stone-500 font-serif leading-relaxed">
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
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-[340px] bg-[#FAF8F5] border-2 border-rose-300 rounded-3xl p-5 shadow-2xl space-y-3 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-300 text-rose-600 mx-auto flex items-center justify-center shadow-xs">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-serif font-bold text-stone-900">
                确定重置天机档案？
              </h3>
              <p className="text-xs text-stone-600 font-serif leading-relaxed">
                此操作将清空本地所有占验记录与档案数据，无法撤销。
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-2.5 rounded-xl bg-stone-200 text-stone-700 font-serif text-xs font-bold"
                >
                  取消
                </button>
                <button
                  onClick={handleResetData}
                  className="py-2.5 rounded-xl bg-rose-600 text-white font-serif font-bold text-xs shadow-xs"
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
