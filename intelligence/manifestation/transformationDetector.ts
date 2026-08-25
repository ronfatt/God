import { OracleCardData } from '@/types/oracle';
import { TRANSFORMATION_PATTERNS, TransformationPattern } from '@/data/transformationPatterns';

export interface TransformationDetectionResult {
  isTransformative: boolean;
  pattern?: TransformationPattern;
  narrative?: string;
  confidence: 'high' | 'medium' | 'low';
}

export function detectTransformation(
  cards: OracleCardData[],
  cardIndex: number
): TransformationDetectionResult {
  const currentCard = cards[cardIndex];
  if (!currentCard) {
    return { isTransformative: false, confidence: 'low' };
  }

  // 1. Check known multi-card Transformation Patterns
  for (const pattern of TRANSFORMATION_PATTERNS) {
    const [firstId, secondId] = pattern.triggerCardIds;

    // Check if pattern is present in sequence
    const hasFirst = cards.some((c, idx) => c.id === firstId && idx <= cardIndex);
    const hasSecond = cards.some((c, idx) => c.id === secondId && idx >= cardIndex);

    if (hasFirst && hasSecond) {
      return {
        isTransformative: true,
        pattern,
        narrative: pattern.narrative,
        confidence: pattern.confidence,
      };
    }
  }

  // 2. Semantic Ending -> Beginning Transition (e.g. Spade/Ending in Past -> Club/Growth in Future)
  const isEndingCard = currentCard.id === 'S-3' || currentCard.id === 'S-2' || currentCard.id === 'S-10';
  const hasFutureGrowth = cards.some((c, idx) => idx > cardIndex && (c.suit === 'club' || c.id === 'H-A' || c.id === 'D-A'));

  if (isEndingCard && hasFutureGrowth) {
    return {
      isTransformative: true,
      narrative: '旧有因缘正在清退，为后续生机拓展彻底腾出空间，属于典范的破旧立新转化局。',
      confidence: 'high',
    };
  }

  // 3. Disruption -> Breakthrough (e.g. Thunder/S-5 -> Wisdom/Order)
  if (currentCard.id === 'S-5' && cards.some((c) => c.id === 'C-2' || c.id === 'C-9' || c.id === 'D-K')) {
    return {
      isTransformative: true,
      narrative: '突发震荡打破固有僵局，促成后续格局的升级与突破。',
      confidence: 'medium',
    };
  }

  return {
    isTransformative: false,
    confidence: 'low',
  };
}
