export type SubscriptionTier = 'free' | 'plus' | 'pro';

export interface UserEntitlement {
  tier: SubscriptionTier;
  tierName: string;
  expiresAt?: string;
  features: string[];
}

export const TIER_CONFIGS: Record<SubscriptionTier, { name: string; badge: string; price: string; features: string[] }> = {
  free: {
    name: '缘起 · 基础版',
    badge: 'FREE',
    price: '免费',
    features: [
      '每日天机一牌',
      '基础三才 3 牌占验',
      '近 7 日历史档案',
      '基础五行与气运分析',
    ],
  },
  plus: {
    name: '通玄 · 进阶版',
    badge: 'PLUS',
    price: '¥38 / 月',
    features: [
      '无限次三才 3 牌起卦',
      '六合 6 牌全维命盘',
      '追问澄清牌 (Clarifier)',
      '近 30 日命势轨迹分析',
      '每周七日深度复盘报告',
      '每日天机令额外赠送',
    ],
  },
  pro: {
    name: '归一 · 尊享版',
    badge: 'PRO',
    price: '¥98 / 月',
    features: [
      '九宫 9 牌终极天命大阵',
      'AI 深度多维叙事智能解卦',
      '90 天与 365 天年度天机年鉴',
      '30 日全维命势报告 (Monthly Report)',
      '高阶个人命格加权 (Personal Modifier)',
      '永久无限历史档案与导出',
    ],
  },
};

export function checkFeatureAccess(tier: SubscriptionTier, featureKey: 'spread_six' | 'spread_nine' | 'ai_deep' | 'monthly_report' | 'year_archive'): boolean {
  if (tier === 'pro') return true;
  if (tier === 'plus') {
    return featureKey === 'spread_six';
  }
  return false;
}
