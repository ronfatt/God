'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminService, AdminUserRecord, AdminOrderRecord } from '@/lib/adminService';
import { AdminAuth } from '@/components/Admin/AdminAuth';
import { AdminOverview } from '@/components/Admin/AdminOverview';
import { AdminUsers } from '@/components/Admin/AdminUsers';
import { AdminReadings } from '@/components/Admin/AdminReadings';
import { AdminCards } from '@/components/Admin/AdminCards';
import { AdminSettings } from '@/components/Admin/AdminSettings';
import { AdminOrders } from '@/components/Admin/AdminOrders';
import { ReadingAnalysis } from '@/types/oracle';
import {
  LayoutDashboard,
  Users,
  Compass,
  Sparkles,
  CircleDollarSign,
  Settings,
  LogOut,
  RefreshCw,
  ExternalLink,
  Shield,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);

  // Loaded Data
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [readings, setReadings] = useState<ReadingAnalysis[]>([]);
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [kpis, setKpis] = useState<any>({
    totalUsers: 0,
    totalDraws: 0,
    totalTokensInCirculation: 0,
    totalRevenue: 0,
    threeCardDraws: 0,
    oneCardDraws: 0,
    totalCards: 52,
  });

  // 1. Initial auth check
  useEffect(() => {
    const ok = AdminService.isAuthenticated();
    setIsAuthenticated(ok);
    if (ok) {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, []);

  // 2. Load all dashboard data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [uList, rList, oList, kpiData] = await Promise.all([
        AdminService.fetchUsers(),
        AdminService.fetchReadings(),
        Promise.resolve(AdminService.fetchOrders()),
        AdminService.getOverviewKPIs(),
      ]);

      setUsers(uList);
      setReadings(rList);
      setOrders(oList);
      setKpis(kpiData);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AdminService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminAuth onSuccess={() => {
      setIsAuthenticated(true);
      loadAllData();
    }} />;
  }

  const tabs = [
    { id: 'overview', name: '总览看板', icon: LayoutDashboard },
    { id: 'users', name: '道友管理', icon: Users, badge: users.length },
    { id: 'readings', name: '卦象监察', icon: Compass, badge: readings.length },
    { id: 'cards', name: '52圣相工坊', icon: Sparkles },
    { id: 'orders', name: '结缘流水', icon: CircleDollarSign },
    { id: 'settings', name: '系统配置', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-serif font-black tracking-wide text-stone-100">
                天机52 · 总枢管理司
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                ADMIN v3.0
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-serif hidden sm:block">
              元象能量馆旗下版权管理中心
            </p>
          </div>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-2 text-xs font-serif">
          <button
            onClick={() => router.push('/')}
            className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 flex items-center gap-1.5 transition-all text-[11px]"
            title="查看前台神谕系统"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">访问前台</span>
          </button>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 flex items-center gap-1.5 transition-all text-[11px]"
            title="刷新总枢数据"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">刷新数据</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 flex items-center gap-1.5 transition-all text-[11px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>退出</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 bg-stone-900/80 p-1.5 rounded-2xl border border-stone-800 overflow-x-auto shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-serif font-medium transition-all flex items-center gap-2 flex-shrink-0 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive
                        ? 'bg-stone-950/20 text-stone-950'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <AdminOverview kpis={kpis} onNavigateTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'users' && (
            <AdminUsers users={users} onRefresh={loadAllData} />
          )}

          {activeTab === 'readings' && (
            <AdminReadings readings={readings} onRefresh={loadAllData} />
          )}

          {activeTab === 'cards' && <AdminCards />}

          {activeTab === 'orders' && (
            <AdminOrders orders={orders} onRefresh={loadAllData} />
          )}

          {activeTab === 'settings' && <AdminSettings />}
        </motion.div>
      </div>

      {/* Footer copyright */}
      <footer className="py-4 border-t border-stone-800 text-center text-xs text-stone-500 font-serif">
        天机52属于元象能量馆旗下版权 · 翻版必究
      </footer>
    </div>
  );
}
