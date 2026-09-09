export interface BirthProfile {
  userId: string;
  nickname: string;
  birthDate?: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  birthPlace?: string; // e.g. "浙江 · 杭州"
  timezone?: string;
  gender?: '乾造 (男)' | '坤造 (女)' | '未透露';
  zodiacAnimal?: string; // 鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪
  zodiacElement?: string; // 木、火、土、金、水
  birthYearElement?: string;
  profileCompleteness: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
}

export function calculateProfileCompleteness(profile: Partial<BirthProfile>): number {
  let score = 20; // Default base
  if (profile.nickname && profile.nickname !== '随喜居士' && profile.nickname !== '天机缘主') score += 20;
  if (profile.birthDate) score += 30;
  if (profile.birthTime) score += 15;
  if (profile.birthPlace) score += 15;
  return Math.min(100, score);
}

export function calculateZodiacFromBirthDate(birthDateStr?: string): {
  zodiac: string; // e.g. "庚申猴"
  zodiacAnimal: string; // e.g. "猴"
  mainElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
} {
  if (!birthDateStr) {
    return { zodiac: '丙子鼠', zodiacAnimal: '鼠', mainElement: 'water' };
  }

  const year = parseInt(birthDateStr.slice(0, 4), 10);
  if (isNaN(year) || year < 1900) {
    return { zodiac: '丙子鼠', zodiacAnimal: '鼠', mainElement: 'water' };
  }

  const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const ELEMENT_MAP: ('wood' | 'fire' | 'earth' | 'metal' | 'water')[] = [
    'wood', 'wood',   // 甲乙 -> 木
    'fire', 'fire',   // 丙丁 -> 火
    'earth', 'earth', // 戊己 -> 土
    'metal', 'metal', // 庚辛 -> 金
    'water', 'water', // 壬癸 -> 水
  ];

  const stemIdx = (((year - 4) % 10) + 10) % 10;
  const branchIdx = (((year - 4) % 12) + 12) % 12;

  const stem = STEMS[stemIdx];
  const branch = BRANCHES[branchIdx];
  const animal = ANIMALS[branchIdx];
  const element = ELEMENT_MAP[stemIdx];

  return {
    zodiac: `${stem}${branch}${animal}`,
    zodiacAnimal: animal,
    mainElement: element,
  };
}

