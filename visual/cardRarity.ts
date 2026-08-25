export type CardVisualRarity = 'standard' | 'resonant' | 'major' | 'sacred';

export interface CardRarityConfig {
  rarity: CardVisualRarity;
  nameZh: string;
  badgeColor: string;
  haloGlow: string;
  frameBorder: string;
  particleDensity: number;
}

export const CARD_RARITY_CONFIGS: Record<CardVisualRarity, CardRarityConfig> = {
  standard: {
    rarity: 'standard',
    nameZh: '天机常位',
    badgeColor: 'text-neutral-300 border-neutral-700 bg-neutral-900/60',
    haloGlow: '0 0 12px rgba(212, 175, 55, 0.15)',
    frameBorder: 'border-amber-500/30',
    particleDensity: 3,
  },
  resonant: {
    rarity: 'resonant',
    nameZh: '气运共鸣',
    badgeColor: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60',
    haloGlow: '0 0 20px rgba(6, 182, 212, 0.25)',
    frameBorder: 'border-cyan-400/50',
    particleDensity: 6,
  },
  major: {
    rarity: 'major',
    nameZh: '大象显化',
    badgeColor: 'text-amber-300 border-amber-500/60 bg-amber-950/80',
    haloGlow: '0 0 28px rgba(212, 175, 55, 0.4)',
    frameBorder: 'border-amber-400/70',
    particleDensity: 10,
  },
  sacred: {
    rarity: 'sacred',
    nameZh: '至尊圣相',
    badgeColor: 'text-yellow-200 border-yellow-300/80 bg-gradient-to-r from-amber-900 to-yellow-950',
    haloGlow: '0 0 40px rgba(253, 230, 138, 0.65)',
    frameBorder: 'border-yellow-300 shadow-[0_0_15px_rgba(253,230,138,0.5)]',
    particleDensity: 16,
  },
};

export function getCardRarity(cardId: string): CardVisualRarity {
  const sacredIds = ['H-A', 'H-K', 'D-A', 'D-K', 'C-A', 'C-K', 'S-A', 'S-K'];
  const majorIds = ['H-Q', 'H-7', 'D-8', 'D-10', 'C-2', 'C-9', 'C-Q', 'S-3', 'S-4', 'S-9', 'S-10'];
  const resonantIds = ['H-2', 'H-3', 'H-5', 'H-J', 'D-2', 'D-3', 'D-5', 'D-J', 'C-3', 'C-7', 'C-10', 'C-J', 'S-2', 'S-5', 'S-J', 'S-Q'];

  if (sacredIds.includes(cardId)) return 'sacred';
  if (majorIds.includes(cardId)) return 'major';
  if (resonantIds.includes(cardId)) return 'resonant';
  return 'standard';
}
