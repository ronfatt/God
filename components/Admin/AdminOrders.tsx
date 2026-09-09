'use client';

import React, { useState } from 'react';
import { AdminOrderRecord } from '@/lib/adminService';
import { CircleDollarSign, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface AdminOrdersProps {
  orders: AdminOrderRecord[];
  onRefresh: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.username.toLowerCase().includes(q) ||
      o.productName.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q)
    );
  });

  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((acc, o) => acc + o.amount, 0);

  return (
    <div className="space-y-4 select-none">
      {/* Top Banner KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-serif">
        <div className="p-4 rounded-2xl bg-stone-900/80 border border-emerald-500/30 space-y-1">
          <div className="text-stone-400 text-[11px]">累计结缘流通金额</div>
          <div className="text-xl font-mono font-black text-emerald-400">
            MYR {totalRevenue.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900/80 border border-amber-500/30 space-y-1">
          <div className="text-stone-400 text-[11px]">已完成灵石注入</div>
          <div className="text-xl font-mono font-black text-amber-400">
            {orders.filter((o) => o.status === 'paid').reduce((a, b) => a + b.tokens, 0)} 灵石
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900/80 border border-cyan-500/30 space-y-1">
          <div className="text-stone-400 text-[11px]">有效订单总数</div>
          <div className="text-xl font-mono font-black text-cyan-400">
            {orders.length} 笔
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索订单号、道号、套餐名称..."
            className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-serif text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-serif">
            <thead className="bg-stone-950/80 text-stone-400 border-b border-stone-800 font-medium">
              <tr>
                <th className="py-3 px-4">结缘订单号</th>
                <th className="py-3 px-4">道友账号</th>
                <th className="py-3 px-4">结缘套餐</th>
                <th className="py-3 px-4">注入灵石</th>
                <th className="py-3 px-4">结缘金额</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4">时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500 font-serif">
                    暂无充值流水记录
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-stone-400">
                      {o.id}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-100">
                      @{o.username}
                    </td>
                    <td className="py-3 px-4 text-stone-200">
                      {o.productName}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      +{o.tokens}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {o.currency} {o.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {o.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>已结缘</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
                          <Clock className="w-2.5 h-2.5" />
                          <span>处理中</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                      {o.createdAt ? o.createdAt.slice(0, 16).replace('T', ' ') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
