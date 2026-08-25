'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="隐私政策" showBack onBack={() => router.push('/profile')} />

      <div className="w-full glass-panel rounded-3xl p-5 border border-amber-300 space-y-4 text-xs font-serif text-stone-700 leading-relaxed shadow-sm">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm border-b border-stone-200 pb-2">
          <Shield className="w-4 h-4 text-emerald-700" />
          <span>天机52 · 用户隐私与数据安全保护准则</span>
        </div>

        <div className="space-y-1">
          <h4 className="text-stone-900 font-bold">1. 本地优先存储原则</h4>
          <p className="text-stone-600">
            您的出生时间、出生地点、占验问题文字及历史卦象默认优先存储于您的本地设备中，绝不对外公开或擅自出售。
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-stone-900 font-bold">2. 私密问卦与分享保护</h4>
          <p className="text-stone-600">
            开启「私密问卦」模式后，系统不会保留具体问题文字；在生成天机海报时，默认自动隐去敏感提问与个人信息。
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-stone-900 font-bold">3. 数据删除与重置权</h4>
          <p className="text-stone-600">
            您可在个人中心随时一键清除本地所有天机档案与占验记录，数据删除后无法撤销。
          </p>
        </div>
      </div>
    </div>
  );
}
