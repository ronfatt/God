import { Element, ReadingAnalysis } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';
import { ZodiacInfo } from './zodiacEngine';

export interface PersonalElementProfile {
  natal: Record<Element, number>;
  recent: Record<Element, number>;
  combined: Record<Element, number>;
  dominant: Element;
  dominantName: string;
  deficient: Element[];
  deficientNames: string[];
  balanceState: string;
  disclaimer: string;
}

export function calculatePersonalElementProfile(
  zodiac: ZodiacInfo,
  history: ReadingAnalysis[]
): PersonalElementProfile {
  // 1. Natal baseline distribution based on birth year element
  const natal: Record<Element, number> = { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
  natal[zodiac.element] = 40;
  // Normalize natal
  const otherElements: Element[] = (['wood', 'fire', 'earth', 'metal', 'water'] as Element[]).filter((e) => e !== zodiac.element);
  otherElements.forEach((e) => {
    natal[e] = 15;
  });

  // 2. Recent history element distribution
  const recentCounts: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  let totalCardsCount = 0;

  history.slice(0, 30).forEach((reading) => {
    reading.cards.forEach((c) => {
      const cardData = ORACLE_CARDS.find((card) => card.id === c.cardId);
      if (cardData) {
        recentCounts[cardData.element]++;
        totalCardsCount++;
      }
    });
  });

  const recent: Record<Element, number> = { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
  if (totalCardsCount > 0) {
    (['wood', 'fire', 'earth', 'metal', 'water'] as Element[]).forEach((el) => {
      recent[el] = Math.round((recentCounts[el] / totalCardsCount) * 100);
    });
  }

  // 3. Combined: 30% Natal + 70% Recent History
  const combined: Record<Element, number> = { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
  (['wood', 'fire', 'earth', 'metal', 'water'] as Element[]).forEach((el) => {
    combined[el] = Math.round(natal[el] * 0.3 + recent[el] * 0.7);
  });

  // Identify dominant
  let dominant: Element = 'water';
  let maxPercent = -1;
  (['wood', 'fire', 'earth', 'metal', 'water'] as Element[]).forEach((el) => {
    if (combined[el] > maxPercent) {
      maxPercent = combined[el];
      dominant = el;
    }
  });

  // Identify deficient (elements < 14%)
  const deficient: Element[] = (['wood', 'fire', 'earth', 'metal', 'water'] as Element[]).filter((el) => combined[el] < 14);

  const elementNameMap: Record<Element, string> = {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水',
  };

  const balanceState = maxPercent >= 38 ? `${elementNameMap[dominant]}势偏旺` : '五行调和均衡';

  return {
    natal,
    recent,
    combined,
    dominant,
    dominantName: elementNameMap[dominant],
    deficient,
    deficientNames: deficient.map((e) => elementNameMap[e]),
    balanceState,
    disclaimer: '根据出生年份与近期抽牌记录生成的象征性倾向分析，非传统绝对八字命盘。',
  };
}
