import { CardOrientation } from '@/types/oracle';
import { MANIFESTATION_RULES } from '@/data/manifestationRules';

export function calculateOrientationManifestationModifier(
  orientation: CardOrientation = 'upright'
): { score: number; reasonCodes: string[]; description: string } {
  if (orientation === 'reversed') {
    return {
      score: MANIFESTATION_RULES.orientationModifier.reversed,
      reasonCodes: ['REVERSED_ORIENTATION'],
      description: '逆位显象：能量内敛延缓或显化阻滞 (-12)',
    };
  }

  return {
    score: MANIFESTATION_RULES.orientationModifier.upright,
    reasonCodes: ['UPRIGHT_ORIENTATION'],
    description: '正位显象：核心力量顺畅流布 (+8)',
  };
}
