'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TopHeader } from '@/components/Layout/TopHeader';
import { Shield } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-8 space-y-4 select-none">
      <TopHeader title="服务条款与免责声明" showBack onBack={() => router.push('/profile')} />

      <div className="w-full glass-panel rounded-3xl p-5 border border-amber-300 space-y-4 text-xs font-serif text-stone-700 leading-relaxed shadow-sm">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm border-b border-stone-200 pb-2">
          <Shield className="w-4 h-4 text-amber-700" />
          <span>服务条款与文化体验准则</span>
        </div>

        <div className="space-y-1">
          <h4 className="text-stone-900 font-bold">1. 东方文化探索与娱乐定位</h4>
          <p className="text-stone-600">
            天机52以东方哲学、传统五行及象征体系为基础，所有推演结果仅供文化探索、个人反思与娱乐参考，不具备任何医疗、法律、投资或专业决策效力。
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-stone-900 font-bold">2. 高风险问题免责</h4>
          <p className="text-stone-600">
            系统严格禁止并拒绝预测生死、疾病诊断、股市短线买卖或彩票号码。用户应理性看待人生选择，对其个人决定负完全责任。
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-stone-900 font-bold">3. 虚拟天机令与订阅</h4>
          <p className="text-stone-600">
            天机令属于平台内用于解锁高级牌阵与功能的虚拟积分，不可反向兑换为真实法定货币。
          </p>
        </div>
      </div>
    </div>
  );
}
