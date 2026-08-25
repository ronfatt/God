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
  if (profile.nickname && profile.nickname !== '天机缘主') score += 20;
  if (profile.birthDate) score += 30;
  if (profile.birthTime) score += 15;
  if (profile.birthPlace) score += 15;
  return Math.min(100, score);
}
