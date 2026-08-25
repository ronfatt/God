import { MANIFESTATION_RULES } from '@/data/manifestationRules';

export function calculatePositionManifestationModifier(
  positionId: string,
  suit: string,
  archetype: string,
  cardId: string
): { score: number; isObstacleBias: boolean; reason?: string } {
  let score = 0;
  let isObstacleBias = false;
  let reason: string | undefined;

  // Standard Position Map
  if (positionId === 'wealth' || positionId === 'pos-1') {
    if (suit === 'diamond') {
      score += MANIFESTATION_RULES.positionModifiers.wealth;
      reason = '财界神牌居于财富正位，生发通达 (+12)';
    } else {
      score += 4;
    }
  } else if (positionId === 'career' || positionId === 'pos-3') {
    if (suit === 'club' || cardId === 'D-K' || cardId === 'C-2') {
      score += MANIFESTATION_RULES.positionModifiers.career;
      reason = '进取威德之神居于事业位，得位得势 (+10)';
    } else {
      score += 3;
    }
  } else if (positionId === 'love' || positionId === 'pos-7') {
    if (suit === 'heart') {
      score += MANIFESTATION_RULES.positionModifiers.love;
      reason = '心界慈光居于感情位，水乳交融 (+12)';
    } else {
      score += 2;
    }
  } else if (positionId === 'nobleman' || positionId === 'pos-4') {
    if (suit === 'club' || suit === 'heart') {
      score += MANIFESTATION_RULES.positionModifiers.nobleman;
      reason = '贵人贤达正位护持 (+10)';
    } else {
      score += 3;
    }
  } else if (positionId === 'pos-6' || positionId.includes('obstacle')) {
    // 阻碍位特殊规则 (Shadow Interpretation Bias)
    isObstacleBias = true;
    score += MANIFESTATION_RULES.obstaclePenaltyBias;
    reason = '落入阻碍考验位，核心能量易呈现过度或执念偏向 (-15)';
  } else if (positionId === 'pos-5' || positionId === 'self') {
    score += 8;
    reason = '立于中宫本命主宰位，气场主导全盘 (+8)';
  } else {
    score += 4;
  }

  return {
    score,
    isObstacleBias,
    reason,
  };
}
