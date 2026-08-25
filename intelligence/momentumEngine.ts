import { OracleCardData } from '@/types/oracle';
import { MomentumType, MOMENTUM_PATTERNS, MomentumPatternConfig } from '@/data/momentumPatterns';

export interface MomentumAnalysisResult {
  type: MomentumType;
  title: string;
  subtitle: string;
  summary: string;
  badgeColor: string;
  sequence: [string, string, string];
  energyCurve: number[];
}

export function analyzeMomentum(cards: OracleCardData[]): MomentumAnalysisResult {
  if (cards.length === 0) {
    const config = MOMENTUM_PATTERNS.stable;
    return { ...config, sequence: config.defaultSequence, energyCurve: [75, 75, 75] };
  }

  // Energy levels mapped to 0-100 values
  const energyLevels = cards.map((c) => {
    // Check if it's a high challenge card (Meng Po, Thunder, Yanluo, BlackWhite)
    if (['S-2', 'S-3', 'S-5', 'S-10'].includes(c.id)) return 45;
    if (['S-4', 'S-J', 'C-J', 'C-7'].includes(c.id)) return 85; // High action
    if (c.energyLevel === 5) return 92;
    if (c.energyLevel === 4) return 80;
    if (c.energyLevel === 3) return 65;
    return 50;
  });

  const cardIds = cards.map((c) => c.id);
  const cardRealms = cards.map((c) => c.realm);

  // Check Transformative condition (has release / ending followed by beginning / wealth / growth)
  const hasEndingFirst = ['S-2', 'S-3', 'S-5'].includes(cards[0].id) || cards[0].keywords.includes('放下') || cards[0].keywords.includes('告别');
  const hasGrowthLater = cards.slice(1).some((c) => c.realm === '生界' || c.realm === '财界' || c.keywords.includes('成长') || c.keywords.includes('聚宝盆'));

  let type: MomentumType = 'stable';
  let dynamicSequence: [string, string, string] = ['起势', '承转', '合道'];

  if (hasEndingFirst && hasGrowthLater) {
    type = 'transformative';
    dynamicSequence = [cards[0].keywords[0] || '旧局清算', cards[1]?.keywords[0] || '深度转化', cards[cards.length - 1]?.keywords[0] || '新生萌发'];
  } else if (cards.length >= 3) {
    const e1 = energyLevels[0];
    const e2 = energyLevels[1];
    const e3 = energyLevels[2];

    const hasHighAction = cards.some((c) => ['C-J', 'C-7', 'S-4', 'D-8', 'C-2'].includes(c.id));
    const hasChallenge = cards.some((c) => c.realm === '玄界');

    if (hasChallenge && hasHighAction && e3 >= 75) {
      type = 'breakthrough';
      dynamicSequence = ['瓶颈初现', '果断破阵', '大势告捷'];
    } else if (e1 < 60 && e2 <= 70 && e3 >= 78) {
      type = 'recovery';
      dynamicSequence = ['深谷微光', '稳步蓄力', '否极泰来'];
    } else if (e1 <= e2 && e2 <= e3 && e3 - e1 >= 15) {
      type = 'rising';
      dynamicSequence = ['步步为营', '顺势而上', '渐入佳境'];
    } else if (e1 >= e2 && e2 >= e3 && e1 - e3 >= 15) {
      type = 'declining';
      dynamicSequence = ['繁华初显', '动能平缓', '收敛守正'];
    } else if (Math.abs(e1 - e2) >= 25 || Math.abs(e2 - e3) >= 25) {
      type = 'volatile';
      dynamicSequence = ['风云变幻', '机敏应对', '定鼎大局'];
    } else if (cards.filter((c) => c.realm === '玄界').length >= 2) {
      type = 'blocked';
      dynamicSequence = ['考验重重', '审慎防备', '静候转机'];
    } else {
      type = 'stable';
      dynamicSequence = ['四平八稳', '有序推进', '厚积薄发'];
    }
  } else {
    // 2-card or simple spread
    type = 'rising';
    dynamicSequence = ['顺势启航', '生机显化', '大成在望'];
  }

  const pattern = MOMENTUM_PATTERNS[type];

  return {
    type,
    title: pattern.title,
    subtitle: pattern.subtitle,
    summary: pattern.summary,
    badgeColor: pattern.badgeColor,
    sequence: dynamicSequence,
    energyCurve: energyLevels.slice(0, 3),
  };
}
