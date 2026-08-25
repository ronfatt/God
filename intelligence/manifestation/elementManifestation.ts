import { Element } from '@/types/oracle';
import { MANIFESTATION_RULES } from '@/data/manifestationRules';

const GENERATING_MAP: Record<Element, Element> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

const CONTROLLING_MAP: Record<Element, Element> = {
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
  metal: 'wood',
};

export function calculateElementManifestationModifier(
  cardElement: Element,
  elementCounts: Record<Element, number>,
  totalCards: number,
  prevCardElement?: Element
): { relationScore: number; balanceScore: number; reasonCodes: string[]; description?: string } {
  let relationScore = 0;
  let balanceScore = 0;
  const reasonCodes: string[] = [];
  const reasons: string[] = [];

  // 1. Neighbor Element Generating / Controlling
  if (prevCardElement) {
    if (GENERATING_MAP[prevCardElement] === cardElement) {
      relationScore += MANIFESTATION_RULES.elementRelationships.generatedByPrevious;
      reasonCodes.push('ELEMENT_SUPPORTED');
      reasons.push(`得前序 ${prevCardElement} 相生助长 (+8)`);
    } else if (CONTROLLING_MAP[prevCardElement] === cardElement) {
      relationScore += MANIFESTATION_RULES.elementRelationships.controlledByPrevious;
      reasonCodes.push('ELEMENT_CONTROLLED');
      reasons.push(`受前序 ${prevCardElement} 克制施压 (-10)`);
    }
  }

  // 2. Overload & Dominance Detection (过旺转影)
  const currentElementCount = elementCounts[cardElement] || 1;
  const percentage = currentElementCount / Math.max(1, totalCards);

  if (percentage >= MANIFESTATION_RULES.elementRelationships.overloadThreshold) {
    // 超过 65% 严重过旺
    balanceScore += MANIFESTATION_RULES.elementRelationships.overloadPenalty;
    reasonCodes.push('ELEMENT_OVERLOAD');
    reasons.push(`牌阵中 ${cardElement} 气过旺 (${Math.round(percentage * 100)}%)，有过犹不及之虞 (-12)`);
  } else if (percentage >= MANIFESTATION_RULES.elementRelationships.dominantThreshold) {
    balanceScore -= 4;
    reasons.push(`${cardElement} 气主导`);
  }

  return {
    relationScore,
    balanceScore,
    reasonCodes,
    description: reasons.join(' · '),
  };
}
