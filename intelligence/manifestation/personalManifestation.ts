import { OracleCardData, Element } from '@/types/oracle';
import { BirthProfile } from '@/personal/birthProfile';

export function calculatePersonalManifestationModifier(
  card: OracleCardData,
  birthProfile?: BirthProfile
): { score: number; reasonCodes: string[]; description?: string } {
  let score = 0;
  const reasonCodes: string[] = [];
  let description: string | undefined;

  if (!birthProfile) {
    return { score: 0, reasonCodes: [] };
  }

  const birthYear = birthProfile.birthDate ? parseInt(birthProfile.birthDate.split('-')[0], 10) : 1996;

  // 检查是否补充了用户的偏弱元素 (五行互补)
  if (card.element === 'wood' && birthYear % 2 === 0) {
    score += 6;
    reasonCodes.push('PERSONAL_ELEMENT_SUPPORT');
    description = '补充本命生发之木气 (+6)';
  } else if (card.element === 'water') {
    score += 4;
    description = '润养心神智慧 (+4)';
  }

  return {
    score,
    reasonCodes,
    description,
  };
}
