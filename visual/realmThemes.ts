import { Suit, Element } from '@/types/oracle';

export interface RealmThemeConfig {
  suit: Suit;
  name: string;
  nameZh: string;
  englishTitle: string;
  coreValues: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientBg: string;
  glowColor: string;
  borderColor: string;
  particleStyle: {
    color: string;
    shape: 'lotus' | 'gold_dust' | 'tendril' | 'mist';
    animation: string;
  };
  symbol: string;
  motif: string;
  soundPadTone: string;
}

export const REALM_THEMES: Record<Suit, RealmThemeConfig> = {
  heart: {
    suit: 'heart',
    name: 'Heart',
    nameZh: '心界',
    englishTitle: 'REALM OF HEART & HEALING',
    coreValues: ['情感', '家庭', '人际', '疗愈', '内在慈悲'],
    primaryColor: '#881326', // 深酒红
    secondaryColor: '#E11D48', // 玫瑰金红
    accentColor: '#FDE68A', // 柔金
    gradientBg: 'linear-gradient(135deg, #1c070c 0%, #300c14 50%, #0d0406 100%)',
    glowColor: 'rgba(225, 29, 72, 0.35)',
    borderColor: 'rgba(244, 63, 94, 0.45)',
    particleStyle: {
      color: '#FB7185',
      shape: 'lotus',
      animation: 'animate-pulse-slow',
    },
    symbol: '♥',
    motif: '慈航水波 · 宝莲花纹',
    soundPadTone: 'water_chime',
  },
  diamond: {
    suit: 'diamond',
    name: 'Diamond',
    nameZh: '财界',
    englishTitle: 'REALM OF WEALTH & POWER',
    coreValues: ['财富', '事业', '资源', '权力', '资产守正'],
    primaryColor: '#B45309', // 琥珀金
    secondaryColor: '#D4AF37', // 纯正黑金
    accentColor: '#FEF08A', // 亮金
    gradientBg: 'linear-gradient(135deg, #1f1406 0%, #38240b 50%, #0d0802 100%)',
    glowColor: 'rgba(212, 175, 55, 0.4)',
    borderColor: 'rgba(212, 175, 55, 0.55)',
    particleStyle: {
      color: '#FBBF24',
      shape: 'gold_dust',
      animation: 'animate-float-up',
    },
    symbol: '♦',
    motif: '古钱回纹 · 聚宝灵阵',
    soundPadTone: 'gold_resonance',
  },
  club: {
    suit: 'club',
    name: 'Club',
    nameZh: '生界',
    englishTitle: 'REALM OF GROWTH & ASCENT',
    coreValues: ['成长', '机会', '学习', '贵人', '破土生发'],
    primaryColor: '#064E3B', // 玉石青
    secondaryColor: '#10B981', // 翡翠绿
    accentColor: '#A7F3D0', // 青玉微光
    gradientBg: 'linear-gradient(135deg, #041a14 0%, #0d3629 50%, #020d09 100%)',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
    particleStyle: {
      color: '#34D399',
      shape: 'tendril',
      animation: 'animate-growth-pulse',
    },
    symbol: '♣',
    motif: '青龙祥云 · 菩提灵枝',
    soundPadTone: 'wood_wind',
  },
  spade: {
    suit: 'spade',
    name: 'Spade',
    nameZh: '玄界',
    englishTitle: 'REALM OF DESTINY & AWAKENING',
    coreValues: ['转化', '挑战', '命运', '觉醒', '因果破局'],
    primaryColor: '#4C1D95', // 墨紫
    secondaryColor: '#8B5CF6', // 紫电银光
    accentColor: '#E9D5FF', // 银芒
    gradientBg: 'linear-gradient(135deg, #10081d 0%, #23123d 50%, #07030c 100%)',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    borderColor: 'rgba(139, 92, 246, 0.55)',
    particleStyle: {
      color: '#C084FC',
      shape: 'mist',
      animation: 'animate-swirl-slow',
    },
    symbol: '♠',
    motif: '太极雷纹 · 冥府幽光',
    soundPadTone: 'thunder_mist',
  },
};
