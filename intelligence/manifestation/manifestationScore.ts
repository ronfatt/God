import {
  OracleCardData,
  QuestionDomain,
  QuestionIntent,
  SpreadPosition,
  CardOrientation,
  CardManifestationResult,
  ManifestationType,
  ManifestationBreakdown,
  Element,
} from '@/types/oracle';
import { CARD_CORE_NATURE_MAP, MANIFESTATION_RULES } from '@/data/manifestationRules';
import { calculateQuestionManifestationModifier } from './questionManifestation';
import { calculatePositionManifestationModifier } from './positionManifestation';
import { calculateElementManifestationModifier } from './elementManifestation';
import { calculateYinYangManifestationModifier } from './yinYangManifestation';
import { calculateNeighborManifestationModifier } from './neighborManifestation';
import { calculatePersonalManifestationModifier } from './personalManifestation';
import { calculateOrientationManifestationModifier } from './orientationManifestation';
import { detectTransformation } from './transformationDetector';
import { BirthProfile } from '@/personal/birthProfile';

export function computeCardManifestation(
  card: OracleCardData,
  index: number,
  allCards: OracleCardData[],
  position: SpreadPosition,
  domain: QuestionDomain,
  intent: QuestionIntent,
  elementCounts: Record<Element, number>,
  yangRatio: number,
  yinRatio: number,
  orientation: CardOrientation = 'upright',
  birthProfile?: BirthProfile,
  combinationScore = 0
): CardManifestationResult {
  const cardId = card.id;
  const coreInfo = CARD_CORE_NATURE_MAP[cardId] || { nature: card.keywords, baseScore: 4 };

  // 1. Base Score
  const base = coreInfo.baseScore;

  // 2. Position Modifier
  const posMod = calculatePositionManifestationModifier(position.id, card.suit, card.archetype, cardId);

  // 3. Question Modifier
  const qMod = calculateQuestionManifestationModifier(cardId, card.suit, card.element, domain, intent);

  // 4. Element Modifier & Overload
  const prevCard = index > 0 ? allCards[index - 1] : undefined;
  const nextCard = index < allCards.length - 1 ? allCards[index + 1] : undefined;
  const elemMod = calculateElementManifestationModifier(card.element, elementCounts, allCards.length, prevCard?.element);

  // 5. Yin Yang Modifier
  const yyMod = calculateYinYangManifestationModifier(card.yinYang, yangRatio, yinRatio);

  // 6. Neighbor Influence
  const nMod = calculateNeighborManifestationModifier(card, prevCard, nextCard);

  // 7. Personal Profile
  const pMod = calculatePersonalManifestationModifier(card, birthProfile);

  // 8. Orientation
  const oMod = calculateOrientationManifestationModifier(orientation);

  // 9. Combinations Modifier
  const combinations = combinationScore;

  // 10. Transformation Detection
  const transDetection = detectTransformation(allCards, index);

  // Calculate Breakdown and Final Score
  const finalScore =
    base +
    posMod.score +
    qMod.score +
    elemMod.relationScore +
    elemMod.balanceScore +
    yyMod.score +
    nMod.score +
    combinations +
    pMod.score +
    oMod.score;

  const breakdown: ManifestationBreakdown = {
    base,
    position: posMod.score,
    question: qMod.score,
    elementRelation: elemMod.relationScore,
    elementBalance: elemMod.balanceScore,
    yinYang: yyMod.score,
    neighbors: nMod.score,
    combinations,
    personal: pMod.score,
    orientation: oMod.score,
    finalScore,
  };

  // Compile Reason Codes
  const reasonCodes: string[] = [];
  if (posMod.reason) reasonCodes.push(posMod.isObstacleBias ? 'OBSTACLE_POSITION' : 'POSITION_FAVOR');
  if (qMod.reason) reasonCodes.push('QUESTION_MATCH');
  reasonCodes.push(...elemMod.reasonCodes);
  reasonCodes.push(...yyMod.reasonCodes);
  reasonCodes.push(...nMod.reasonCodes);
  reasonCodes.push(...pMod.reasonCodes);
  reasonCodes.push(...oMod.reasonCodes);
  if (transDetection.isTransformative) reasonCodes.push('TRANSFORMATION_PATTERN');

  // Determine Manifestation State
  let manifestation: ManifestationType = 'neutral';

  if (transDetection.isTransformative) {
    manifestation = 'transformative';
  } else if (finalScore >= MANIFESTATION_RULES.scoreThresholds.lightMin) {
    manifestation = 'light';
  } else if (finalScore <= MANIFESTATION_RULES.scoreThresholds.shadowMax) {
    manifestation = 'shadow';
  } else {
    manifestation = 'neutral';
  }

  // Derive Support, Challenge, and Utility Scores (0-100)
  const supportScore = Math.max(10, Math.min(100, Math.round(50 + finalScore * 0.6)));
  const challengeScore = Math.max(10, Math.min(100, Math.round(50 - finalScore * 0.5 + (posMod.isObstacleBias ? 25 : 0))));
  const utilityScore = Math.max(20, Math.min(100, Math.round(40 + qMod.relevance * 0.4 + (manifestation === 'transformative' ? 30 : 15))));

  // Meanings
  const manifestationData = card.manifestation?.[manifestation];
  const mainMeaning = manifestationData?.meaning || (manifestation === 'shadow' ? card.shadow : card.upright);
  const domainMeaning =
    manifestationData?.[domain === 'relationship' ? 'love' : domain === 'decision' ? 'career' : domain] ||
    (domain === 'love' ? card.love : domain === 'career' ? card.career : domain === 'wealth' ? card.wealth : card.upright);

  return {
    cardId: card.id,
    cardName: card.cardName || card.name,
    archetype: card.archetype,
    manifestation,
    manifestationScore: finalScore,
    supportScore,
    challengeScore,
    utilityScore,
    confidence: transDetection.isTransformative ? transDetection.confidence : finalScore > 45 || finalScore < -45 ? 'high' : 'medium',
    mainMeaning,
    domainMeaning,
    reasonCodes,
    breakdown,
    orientation,
  };
}
