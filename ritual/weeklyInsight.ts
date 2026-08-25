import { OracleCardData, Element, ReadingAnalysis } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';

export interface WeeklyInsightResult {
  isAvailable: boolean;
  readingsCount: number;
  weekDominantElement: Element;
  weekDominantElementName: string;
  weekMainCard: OracleCardData;
  weekTrajectory: string;
  weekKeywords: string[];
  narrative: string;
  nextWeekSuggestions: string[];
}

export function generateWeeklyInsight(history: ReadingAnalysis[]): WeeklyInsightResult {
  const recent7 = history.slice(0, 7);
  const count = recent7.length;

  if (count < 3) {
    return {
      isAvailable: false,
      readingsCount: count,
      weekDominantElement: 'water',
      weekDominantElementName: '水',
      weekMainCard: ORACLE_CARDS[1], // 青龙
      weekTrajectory: '蓄力回升',
      weekKeywords: ['行动', '学习', '贵人'],
      narrative: '完成至少 3 次天机占验后，系统将自动解锁本周深度走势推演。',
      nextWeekSuggestions: ['每日坚持抽一牌体验天机流转', '记录身边因缘变化'],
    };
  }

  // Count elements
  const elementCounts: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const cardCounts: Record<string, number> = {};

  recent7.forEach((r) => {
    r.cards.forEach((c) => {
      cardCounts[c.cardId] = (cardCounts[c.cardId] || 0) + 1;
      const card = ORACLE_CARDS.find((item) => item.id === c.cardId);
      if (card) elementCounts[card.element]++;
    });
  });

  let dominant: Element = 'wood';
  let maxCount = -1;
  (['wood', 'fire', 'earth', 'metal', 'water'] as Element[]).forEach((el) => {
    if (elementCounts[el] > maxCount) {
      maxCount = elementCounts[el];
      dominant = el;
    }
  });

  // Top card
  const topCardId = Object.entries(cardCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'C-2';
  const weekMainCard = ORACLE_CARDS.find((c) => c.id === topCardId) || ORACLE_CARDS[1];

  const elNames: Record<Element, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };

  return {
    isAvailable: true,
    readingsCount: count,
    weekDominantElement: dominant,
    weekDominantElementName: elNames[dominant],
    weekMainCard,
    weekTrajectory: '由静转动 · 步步攀升',
    weekKeywords: weekMainCard.keywords.slice(0, 3),
    narrative: `本周整体牌势由内向沉淀逐步转向主动执行。【${elNames[dominant]}】元素显著增强，表明新的计划、关键人脉与专业进阶正在成为主要推动力。`,
    nextWeekSuggestions: [
      `聚焦于【${weekMainCard.cardName}】所指引的长期优势，果断推进关键事项。`,
      `向外链接至少一位具有行业经验的良师益友。`,
      `理清手头事务轻重缓急，避免在低价值细节中空耗。`,
    ],
  };
}
