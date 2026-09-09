'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminUserRecord, AdminService } from '@/lib/adminService';
import { Search, Coins, Plus, Minus, X, Check, RefreshCw, UserCheck, Calendar, MapPin, Sparkles } from 'lucide-react';

interface AdminUsersProps {
  users: AdminUserRecord[];
  onRefresh: () => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(50);
  const [adjustReason, setAdjustReason] = useState<string>('天机司活动赠予');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.nickname.toLowerCase().includes(q) ||
      (u.zodiac && u.zodiac.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  const handleAdjustTokens = async (isAdd: boolean) => {
    if (!selectedUser) return;
    const delta = isAdd ? Math.abs(adjustAmount) : -Math.abs(adjustAmount);
    setIsSubmitting(true);
    setResultMsg(null);

    const res = await AdminService.adjustUserTokens(selectedUser.id, delta, adjustReason);
    setIsSubmitting(false);

    if (res.success) {
      setResultMsg({ type: 'success', text: res.message });
      // Update local selected user tokens
      if (res.newTokens !== undefined) {
        setSelectedUser({ ...selectedUser, tokens: res.newTokens });
      }
      setTimeout(() => {
        onRefresh();
      }, 1000);
    } else {
      setResultMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索道号、昵称、干支生肖..."
            className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-serif text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-serif">
          <span className="text-stone-400 text-xs">
            共 <strong className="font-mono text-amber-400">{filteredUsers.length}</strong> 位道友
          </span>
          <button
            onClick={onRefresh}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新名册</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-serif">
            <thead className="bg-stone-950/80 text-stone-400 border-b border-stone-800 font-medium">
              <tr>
                <th className="py-3 px-4">道友 / 账号</th>
                <th className="py-3 px-4">生辰干支 · 命格</th>
                <th className="py-3 px-4">归属地</th>
                <th className="py-3 px-4">灵石存量</th>
                <th className="py-3 px-4">推演次数</th>
                <th className="py-3 px-4">注册时间</th>
                <th className="py-3 px-4 text-right">调配操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500 font-serif">
                    未检索到符合条件的道友
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-xs">
                          {u.nickname ? u.nickname.slice(0, 1) : '☯'}
                        </div>
                        <div>
                          <div className="font-bold text-stone-100 flex items-center gap-1.5">
                            <span>{u.nickname}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 font-mono">
                              @{u.username}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono">
                            {u.email || '未填邮箱'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                          {u.zodiac}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {u.gender}
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                        {u.birthDate}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-300 text-xs">
                      {u.birthPlace}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {u.tokens}
                      </span>
                      <span className="text-[10px] text-stone-500 ml-1">灵石</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-stone-200">
                        {u.totalDraws}
                      </span>
                      <span className="text-[10px] text-stone-500 ml-1">次</span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-stone-400 font-mono">
                      {u.createdAt ? u.createdAt.slice(0, 10) : '-'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setResultMsg(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-serif transition-all"
                      >
                        调配灵石
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Tokens Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute right-4 top-4 p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-100">
                    灵石增发与调配
                  </h3>
                  <p className="text-xs text-stone-400 font-serif">
                    目标道友：<strong className="text-amber-400">{selectedUser.nickname}</strong> (@{selectedUser.username})
                  </p>
                </div>
              </div>

              {/* Current balance indicator */}
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs font-serif">
                <span className="text-stone-400">当前灵石结余</span>
                <span className="font-mono text-lg font-bold text-amber-400">
                  {selectedUser.tokens} 灵石
                </span>
              </div>

              {/* Adjust inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-serif text-stone-300">
                    调整数额 (灵石)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[20, 50, 100, 200].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAdjustAmount(num)}
                        className={`py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                          adjustAmount === num
                            ? 'bg-amber-500 text-stone-950 border-amber-400'
                            : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        +{num}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm font-mono text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-serif text-stone-300">
                    调配原因 / 备注
                  </label>
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="例如：内测回馈、活动赠礼、申诉补发"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-serif text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {resultMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-serif flex items-center gap-2 ${
                    resultMsg.type === 'success'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>{resultMsg.text}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleAdjustTokens(true)}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-serif font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>发放增补 (+{adjustAmount})</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleAdjustTokens(false)}
                  className="py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-rose-300 border border-rose-900/40 font-serif font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>核减扣除 (-{adjustAmount})</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
