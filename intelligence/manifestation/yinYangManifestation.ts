import { YinYang } from '@/types/oracle';
import { MANIFESTATION_RULES } from '@/data/manifestationRules';

export function calculateYinYangManifestationModifier(
  cardYinYang: YinYang,
  yangRatio: number,
  yinRatio: number
): { score: number; reasonCodes: string[]; description?: string } {
  let score = 0;
  const reasonCodes: string[] = [];
  let description: string | undefined;

  if (yangRatio >= 0.75) {
    if (cardYinYang === 'yang') {
      // 极阳之局，阳牌易躁进
      score += MANIFESTATION_RULES.elementRelationships.yangOverloadPenalty;
      reasonCodes.push('YANG_OVERLOAD');
      description = '全盘阳动过强 (≥75%)，行事恐过于迅疾冒进 (-8)';
    } else {
      // 阳盛之局中出现阴牌，反成珍贵调候
      score += 6;
      description = '全盘阳盛中显阴柔，起调和平衡之功 (+6)';
    }
  } else if (yinRatio >= 0.75) {
    if (cardYinYang === 'yin') {
      // 极阴之局，阴牌易退缩迟滞
      score += MANIFESTATION_RULES.elementRelationships.yinOverloadPenalty;
      reasonCodes.push('YIN_OVERLOAD');
      description = '全盘阴柔过甚 (≥75%)，恐多思迟疑缺乏决断 (-8)';
    } else {
      // 阴盛之局中出现阳牌，犹如寒夜火炬
      score += 6;
      description = '全盘沉寂中现阳刚生机，破局关键 (+6)';
    }
  }

  return {
    score,
    reasonCodes,
    description,
  };
}
