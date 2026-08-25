export type Suit = 'heart' | 'diamond' | 'club' | 'spade';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type YinYang = 'yin' | 'yang';
export type ArchetypeType = 'deity' | 'buddha' | 'bodhisattva' | 'immortal' | 'beast' | 'artifact' | 'symbol';

export type SpreadType = 'three' | 'six' | 'nine';
export type QuestionCategory = 'love' | 'wealth' | 'career' | 'relationship' | 'general' | 'custom';
export type QuestionDomain = 'love' | 'career' | 'wealth' | 'relationship' | 'life' | 'decision';
export type QuestionIntent = 'future' | 'decision' | 'outcome' | 'obstacle' | 'opportunity' | 'timing' | 'person' | 'advice';

// =========================================================
// V5 Manifestation Types (光相 / 平相 / 影相 / 转化相)
// =========================================================

export type ManifestationType = 'light' | 'neutral' | 'shadow' | 'transformative';
export type CardOrientation = 'upright' | 'reversed';

export interface ManifestationDomainDetail {
  meaning: string;
  keywords: string[];
  love: string;
  career: string;
  wealth: string;
  life: string;
}

export interface CardManifestation {
  light: ManifestationDomainDetail;
  neutral: ManifestationDomainDetail;
  shadow: ManifestationDomainDetail;
  transformative: ManifestationDomainDetail;
}

export interface ManifestationBreakdown {
  base: number;
  position: number;
  question: number;
  elementRelation: number;
  elementBalance: number;
  yinYang: number;
  neighbors: number;
  combinations: number;
  personal: number;
  orientation: number;
  finalScore: number;
}

export interface CardManifestationResult {
  cardId: string;
  cardName: string;
  archetype: string;
  manifestation: ManifestationType;
  manifestationScore: number; // -100 to +100
  supportScore: number; // 0 - 100
  challengeScore: number; // 0 - 100
  utilityScore: number; // 0 - 100
  confidence: 'low' | 'medium' | 'high';
  mainMeaning: string;
  domainMeaning: string;
  reasonCodes: string[];
  breakdown: ManifestationBreakdown;
  orientation?: CardOrientation;
}

export type OverallManifestationState = 
  | 'light_dominant' 
  | 'shadow_dominant' 
  | 'transformative_dominant' 
  | 'neutral_dominant' 
  | 'mixed' 
  | 'contradiction';

export interface OverallManifestationResult {
  state: OverallManifestationState;
  title: string;
  subtitle: string;
  summary: string;
  lightCount: number;
  neutralCount: number;
  shadowCount: number;
  transformativeCount: number;
  averageManifestationScore: number;
  averageSupport: number;
  averageChallenge: number;
  averageUtility: number;
  contradiction?: {
    detected: boolean;
    conflictType: string;
    description: string;
    advice: string;
  };
}

// 官方天机卡牌数据库模型 (含 V5 扩展)
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
  coreNature?: string[]; // V5 核心本质 (永恒不变的核心力量)
  baseScore?: number; // V5 初始基准分 (-10 ~ +10)
  manifestation?: CardManifestation; // V5 四相显化释义模型
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
  image?: string; // 52张高精圣相立绘路径
  advice?: string;
  oracleMessage?: string;
  manifestationResult?: CardManifestationResult; // V5 当次运算生成的显相结果
}

export interface SpreadPosition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gridArea?: string;
  isObstacle?: boolean;
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
  orientation?: CardOrientation;
  manifestationResult?: CardManifestationResult;
}

export interface ReadingAnalysis {
  id: string;
  date: string;
  timestamp: number;
  question: string;
  category: QuestionCategory;
  spreadType: SpreadType;
  cards: { 
    positionId: string; 
    cardId: string; 
    manifestation?: ManifestationType; 
    manifestationScore?: number;
    orientation?: CardOrientation;
  }[];
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
  // V5 Manifestation Additions
  overallManifestation?: OverallManifestationResult;
  cardManifestations?: CardManifestationResult[];
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
