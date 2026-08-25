export interface CommercialProduct {
  id: string;
  type: 'subscription' | 'token_pack' | 'one_time';
  name: string;
  nameZh: string;
  price: number;
  currency: string;
  priceDisplay: string;
  description: string;
  tokenAmount?: number;
  entitlementTier?: 'free' | 'plus' | 'pro';
  features: string[];
  isPopular?: boolean;
}

export const COMMERCIAL_PRODUCTS: CommercialProduct[] = [
  // Subscriptions
  {
    id: 'sub_free',
    type: 'subscription',
    name: 'Free Starter',
    nameZh: '缘起 · 基础版',
    price: 0,
    currency: 'MYR',
    priceDisplay: 'RM0 / 月',
    description: '每日天机一牌与基础三才占验',
    entitlementTier: 'free',
    features: ['每日天机一牌', '每日一次三才 3 牌占验', '近 7 日历史档案', '基础五行与气运分析'],
  },
  {
    id: 'sub_plus',
    type: 'subscription',
    name: 'Plus Plan',
    nameZh: '通玄 · 进阶版',
    price: 19.9,
    currency: 'MYR',
    priceDisplay: 'RM19.90 / 月',
    description: '无限三才演卦与六合命盘解锁',
    entitlementTier: 'plus',
    isPopular: true,
    features: [
      '无限次三才 3 牌起卦',
      '六合 6 牌全维命盘',
      '追问澄清牌 (Clarifier)',
      '近 30 日命势轨迹分析 (Oracle Journey)',
      '每周七日深度复盘报告',
      '每月赠送 150 天机令',
    ],
  },
  {
    id: 'sub_pro',
    type: 'subscription',
    name: 'Pro Destiny',
    nameZh: '归一 · 尊享版',
    price: 39.9,
    currency: 'MYR',
    priceDisplay: 'RM39.90 / 月',
    description: '九宫大阵、90日天机图与AI深度解卦',
    entitlementTier: 'pro',
    features: [
      '九宫 9 牌终极天命大阵',
      '九十日全维天机图 (90-Day Destiny Map)',
      'AI 深度多维叙事智能解卦',
      '90 天与 365 天长期人生主线',
      '30 日全维命势报告 (Monthly Report)',
      '高阶个人命格加权 (Personal Modifier)',
      '每月赠送 500 天机令',
    ],
  },

  // Token Packs
  {
    id: 'token_pack_100',
    type: 'token_pack',
    name: '100 Tokens',
    nameZh: '100 天机令 · 初阶灵石',
    price: 4.9,
    currency: 'MYR',
    priceDisplay: 'RM4.90',
    description: '适合单次体验追问与六合起卦',
    tokenAmount: 100,
    features: ['可用于 10 次单牌澄清', '或 5 次六合命盘'],
  },
  {
    id: 'token_pack_300',
    type: 'token_pack',
    name: '300 Tokens',
    nameZh: '300 天机令 · 进阶宝袋',
    price: 9.9,
    currency: 'MYR',
    priceDisplay: 'RM9.90',
    description: '热销规格，满足多轮深入追问',
    tokenAmount: 300,
    isPopular: true,
    features: ['可用于 6 次九宫大阵', '或 2 次九十日天机图', '多赠 30 天机令'],
  },
  {
    id: 'token_pack_800',
    type: 'token_pack',
    name: '800 Tokens',
    nameZh: '800 天机令 · 乾坤锦囊',
    price: 19.9,
    currency: 'MYR',
    priceDisplay: 'RM19.90',
    description: '大容量储值，尊享起卦无忧',
    tokenAmount: 800,
    features: ['可用于 16 次九宫大阵', '或 6 次九十日天机图', '多赠 150 天机令'],
  },
];

export const TOKEN_UTILITY_COSTS = {
  clarifier1Card: 10,
  followUp3Cards: 20,
  spreadSix: 20,
  spreadNine: 50,
  destinyMap90: 50,
  deepNarrative: 30,
};
