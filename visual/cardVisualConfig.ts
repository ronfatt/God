import { Suit } from '@/types/oracle';
import { CardVisualRarity, getCardRarity } from './cardRarity';
import { REALM_THEMES } from './realmThemes';

export interface CardVisualConfig {
  cardId: string;
  realm: Suit;
  visualTier: CardVisualRarity;
  frameStyle: string;
  primarySymbol: string;
  secondarySymbols: string[];
  backgroundStyle: string;
  particleStyle: string;
  glowStyle: string;
  texture: string;
  imagePath: string;
  animatedAsset?: string;
  artworkStatus: 'approved' | 'draft' | 'placeholder';
}

export function getCardVisualConfig(cardId: string, suit: Suit, archetype: string): CardVisualConfig {
  const visualTier = getCardRarity(cardId);
  const theme = REALM_THEMES[suit];

  const realmPathMap: Record<Suit, string> = {
    heart: 'heart',
    diamond: 'diamond',
    club: 'club',
    spade: 'spade',
  };

  const imagePath = `/cards/${realmPathMap[suit]}/${cardId}.webp`;

  // Fallback symbol based on suit and archetype
  let primarySymbol = '☯';
  if (suit === 'heart') primarySymbol = '🪷';
  else if (suit === 'diamond') primarySymbol = '🪙';
  else if (suit === 'club') primarySymbol = '🌿';
  else if (suit === 'spade') primarySymbol = '⚡';

  if (archetype.includes('阿弥陀佛') || archetype.includes('大日如来')) primarySymbol = '☸';
  if (archetype.includes('观音') || archetype.includes('药师')) primarySymbol = '🪷';
  if (archetype.includes('赵公明') || archetype.includes('聚宝盆')) primarySymbol = '🏺';
  if (archetype.includes('青龙') || archetype.includes('哪吒')) primarySymbol = '🐉';
  if (archetype.includes('太极') || archetype.includes('老君')) primarySymbol = '☯';
  if (archetype.includes('钟馗') || archetype.includes('二郎')) primarySymbol = '👁';

  return {
    cardId,
    realm: suit,
    visualTier,
    frameStyle: theme.borderColor,
    primarySymbol,
    secondarySymbols: [suit.toUpperCase(), theme.symbol],
    backgroundStyle: theme.gradientBg,
    particleStyle: theme.particleStyle.color,
    glowStyle: theme.glowColor,
    texture: theme.motif,
    imagePath,
    artworkStatus: visualTier === 'sacred' || visualTier === 'major' ? 'approved' : 'draft',
  };
}
