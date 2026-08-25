export type Suit = 'heart' | 'diamond' | 'club' | 'spade';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type YinYang = 'yin' | 'yang';
export type ArchetypeType = 'deity' | 'buddha' | 'bodhisattva' | 'immortal' | 'beast' | 'artifact' | 'symbol';

export type SpreadType = 'three' | 'six' | 'nine';
export type QuestionCategory = 'love' | 'wealth' | 'career' | 'relationship' | 'general' | 'custom';
export type QuestionDomain = 'love' | 'career' | 'wealth' | 'relationship' | 'life' | 'decision';
export type QuestionIntent = 'future' | 'decision' | 'outcome' | 'obstacle' | 'opportunity' | 'timing' | 'person' | 'advice';

// 官方天机卡牌数据库模型
export type TianjiCard = {
  id: string;
  suit: Suit;
  rank: Rank;
  realm: string;
  cardName: string;
  archetype: string;
  type: ArchetypeType;
  element: Element;
  yinYang: YinYang;
  keywords: string[];
  upright: string;
  shadow: string;
  love: string;
  career: string;
  wealth: string;
  oracle: string;
};

// UI 扩展类型，兼容 TianjiCard
export interface OracleCardData extends TianjiCard {
  name: string; // 方便UI调用，等于 cardName
  elementName: string; // '木' | '火' | '土' | '金' | '水'
  energyLevel: number; // 1-5 星级
  energyTitle: string; // 天赐 / 顺势 / 平衡 / 考验 / 转化
  gradient: string;
  advice?: string;
  oracleMessage?: string;
}

export interface SpreadPosition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gridArea?: string;
}

export interface SpreadConfig {
  type: SpreadType;
  title: string;
  nameEn: string;
  cardCount: number;
  description: string;
  tokenCost: number;
  isPremium?: boolean;
  positions: SpreadPosition[];
}

export interface CardDrawResult {
  position: SpreadPosition;
  card: OracleCardData;
  isRevealed: boolean;
}

export interface ReadingAnalysis {
  id: string;
  date: string;
  timestamp: number;
  question: string;
  category: QuestionCategory;
  spreadType: SpreadType;
  cards: { positionId: string; cardId: string }[];
  overallScore: number;
  wealthScore: number;
  careerScore: number;
  loveScore: number;
  noblemanScore: number;
  oracleQuote: string;
  elementTrend: {
    sequence: string[];
    interaction: 'generate' | 'restrain' | 'harmonious' | 'complex';
    description: string;
  };
  dominantElement: Element;
  actionAdvices: [string, string, string];
  timeline: {
    near: string;
    mid: string;
    far: string;
  };
  luckyElements: {
    color: string;
    direction: string;
    time: string;
    element: string;
    number: number;
  };
}

export interface UserProfile {
  name: string;
  avatar: string;
  tokens: number;
  streak: number;
  lastDrawDate?: string;
  totalDraws: number;
  birthDate?: string;
  birthTime?: string;
  gender?: string;
  birthPlace?: string;
  zodiac?: string;
  mainElement?: Element;
  collectedCardIds: string[];
}
