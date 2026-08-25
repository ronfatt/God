import { OracleCardData } from '@/types/oracle';

export function calculateNeighborManifestationModifier(
  currentCard: OracleCardData,
  prevCard?: OracleCardData,
  nextCard?: OracleCardData
): { score: number; reasonCodes: string[]; description?: string } {
  let score = 0;
  const reasonCodes: string[] = [];
  const descriptions: string[] = [];

  const curId = currentCard.id;

  // Example: 雷公 (S-5) 旁边有 青龙 (C-2) 或 菩提树 (C-A) -> 震雷破局催生新生
  if (curId === 'S-5') {
    const hasGrowthNeighbor = [prevCard?.id, nextCard?.id].some((id) => id === 'C-2' || id === 'C-A');
    const hasSevereEndingNeighbor = [prevCard?.id, nextCard?.id].some((id) => id === 'S-4' || id === 'S-10');

    if (hasGrowthNeighbor) {
      score += 15;
      reasonCodes.push('TRANSFORMATION_GROWTH_NEIGHBOR');
      descriptions.push('毗邻生长突破之神，突发震荡反成破局契机 (+15)');
    } else if (hasSevereEndingNeighbor) {
      score -= 10;
      reasonCodes.push('SEVERE_CHALLENGE_NEIGHBOR');
      descriptions.push('毗邻清算严苛之神，警惕剧烈震荡带来的消耗 (-10)');
    }
  }

  // Example: 孟婆 (S-3) 紧随新生神牌
  if (curId === 'S-3') {
    if (nextCard?.suit === 'club' || nextCard?.id === 'H-A') {
      score += 12;
      reasonCodes.push('RELEASE_FOR_NEW_CYCLE');
      descriptions.push('后承新生生发之气，旧念放下恰为新生铺路 (+12)');
    }
  }

  // 同界别连续呼应加持
  if (prevCard && prevCard.suit === currentCard.suit) {
    score += 4;
    descriptions.push('同界气脉贯通');
  }

  return {
    score,
    reasonCodes,
    description: descriptions.join(' · '),
  };
}
