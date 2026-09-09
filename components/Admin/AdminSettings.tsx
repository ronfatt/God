'use client';

import React, { useState, useEffect } from 'react';
import { AdminService, AdminSystemConfig } from '@/lib/adminService';
import { Settings, Save, Sparkles, Megaphone, Coins, Check, AlertCircle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [config, setConfig] = useState<AdminSystemConfig>(AdminService.getSystemConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setConfig(AdminService.getSystemConfig());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    AdminService.saveSystemConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 select-none max-w-3xl">
      {/* Save action header */}
      <div className="flex items-center justify-between bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-serif font-bold text-stone-100">
              平台经济与系统全局规则配置
            </h3>
            <p className="text-[11px] text-stone-400 font-serif">
              调整新用户灵石礼遇、阵法算力消耗与全服公告
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-serif font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? '配置已生效保存' : '保存全局配置'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-serif flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>天机司系统参数已成功更新并持久化！</span>
        </div>
      )}

      {/* Module 1: Token Economy */}
      <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-md space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <Coins className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-serif font-bold text-stone-200">
            灵石经济与算力规则
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-serif text-stone-300 flex items-center justify-between">
              <span>新道友入门礼赠</span>
              <span className="text-[10px] text-amber-400 font-mono">一次性</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={config.welcomeTokens}
                onChange={(e) =>
                  setConfig({ ...config, welcomeTokens: Math.max(0, parseInt(e.target.value) || 0) })
                }
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-mono font-bold text-stone-100 focus:outline-none focus:border-amber-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-stone-500 font-serif">
                灵石
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-serif">
              新用户成功注册即刻赠送
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-serif text-stone-300 flex items-center justify-between">
              <span>三才天地人推演消耗</span>
              <span className="text-[10px] text-amber-400 font-mono">单次扣除</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={config.spreadCost}
                onChange={(e) =>
                  setConfig({ ...config, spreadCost: Math.max(0, parseInt(e.target.value) || 0) })
                }
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-mono font-bold text-stone-100 focus:outline-none focus:border-amber-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-stone-500 font-serif">
                灵石/次
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-serif">
              不足时自动弹出结缘充能
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-serif text-stone-300 flex items-center justify-between">
              <span>一牌定音每日上限</span>
              <span className="text-[10px] text-emerald-400 font-mono">每日重置</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={config.dailyFreeLimit}
                onChange={(e) =>
                  setConfig({ ...config, dailyFreeLimit: Math.max(1, parseInt(e.target.value) || 1) })
                }
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-mono font-bold text-stone-100 focus:outline-none focus:border-amber-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-stone-500 font-serif">
                次/天
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-serif">
              每日 00:00 自动刷新可用次数
            </p>
          </div>
        </div>
      </div>

      {/* Module 2: Announcement & Broadcasting */}
      <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-serif font-bold text-stone-200">
              全服天机公告与玄学寄语
            </h4>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-serif text-stone-400">开启公告广播</span>
            <input
              type="checkbox"
              checked={config.announcementActive}
              onChange={(e) => setConfig({ ...config, announcementActive: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-stone-950 border-stone-700"
            />
          </label>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-serif text-stone-300">
              公告标题
            </label>
            <input
              type="text"
              value={config.announcementTitle}
              onChange={(e) => setConfig({ ...config, announcementTitle: e.target.value })}
              placeholder="例如：甲辰龙年 · 伏羲易卦大吉之兆"
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-serif text-stone-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-serif text-stone-300">
              公告详情
            </label>
            <textarea
              rows={3}
              value={config.announcementContent}
              onChange={(e) => setConfig({ ...config, announcementContent: e.target.value })}
              placeholder="输入呈现在前台的玄学指引或维护公告..."
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-serif text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
