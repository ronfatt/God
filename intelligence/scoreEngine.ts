import { OracleCardData, QuestionDomain } from '@/types/oracle';
import { CombinationResult } from './combinationEngine';
import { ElementAnalysisResult } from './elementEngine';
import { MomentumType } from '@/data/momentumPatterns';

export interface ScoreAnalysisResult {
  overall: number;
  love: number;
  career: number;
  wealth: number;
  noble: number;
  action: number;
  challenge: number;
  confidence: 'high' | 'medium' | 'low';
  confidenceReason: string;
  questionRelevanceInsight?: string;
}

export function calculateScores(
  cards: OracleCardData[],
  domain: QuestionDomain,
  combinations: CombinationResult[],
  elements: ElementAnalysisResult,
  momentum: MomentumType
): ScoreAnalysisResult {
  const avgLevel = cards.reduce((acc, c) => acc + c.energyLevel, 0) / (cards.length || 1);
  let base = 62 + avgLevel * 5.5;

  // Add combination bonus
  const comboBonus = combinations.reduce((acc, c) => acc + c.scoreModifier, 0);
  base += Math.min(15, comboBonus * 0.4);

  // Element harmony bonus
  if (elements.relationship === '五行相生') base += 5;
  if (elements.balanceState === 'balanced') base += 3;

  // Momentum modifier
  if (momentum === 'rising' || momentum === 'breakthrough') base += 6;
  if (momentum === 'transformative') base += 4;
  if (momentum === 'declining' || momentum === 'blocked') base -= 4;

  const overall = Math.min(98, Math.max(55, Math.round(base)));

  // Domain specifics
  const heartCount = cards.filter((c) => c.realm === '心界').length;
  const diamondCount = cards.filter((c) => c.realm === '财界').length;
  const clubCount = cards.filter((c) => c.realm === '生界').length;
  const spadeCount = cards.filter((c) => c.realm === '玄界').length;

  const love = Math.min(99, Math.max(50, Math.round(base + heartCount * 7 - (spadeCount > 1 ? 3 : 0))));
  const wealth = Math.min(99, Math.max(50, Math.round(base + diamondCount * 7 + (clubCount > 0 ? 2 : 0))));
  const career = Math.min(99, Math.max(50, Math.round(base + clubCount * 6 + diamondCount * 3)));
  const noble = Math.min(99, Math.max(55, Math.round(base + heartCount * 3 + clubCount * 4)));

  // Action score (High if Yang cards, Nezha, Zhongkui, Zhao Gongming, Erlang Shen)
  let actionScore = 65;
  cards.forEach((c) => {
    if (c.yinYang === 'yang') actionScore += 4;
    if (['C-J', 'S-4', 'S-J', 'D-8', 'C-7', 'C-10'].includes(c.id)) actionScore += 8;
  });
  const action = Math.min(99, Math.max(40, actionScore));

  // Challenge score (High if Xuan realm, Mengpo, Thunder, BlackWhite, Yanluo)
  let challengeScore = 30 + spadeCount * 14;
  if (cards.some((c) => ['S-2', 'S-3', 'S-5', 'S-10'].includes(c.id))) challengeScore += 18;
  const challenge = Math.min(95, Math.max(25, challengeScore));

  // Confidence assessment
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  let confidenceReason = '牌义与五行流转清晰契合，信息指向明确。';

  if (combinations.length >= 1 && (elements.balanceState === 'dominant' || elements.balanceState === 'slightly_dominant')) {
    confidence = 'high';
    confidenceReason = '牌阵出现经典组合共鸣，五行与牌势特征高度一致，信号极其强烈。';
  } else if (cards.length >= 3 && spadeCount > 0 && heartCount > 0 && diamondCount > 0 && clubCount > 0) {
    confidence = 'medium';
    confidenceReason = '各界能量均有分布，提示局面较为多元，需多线并进。';
  }

  // Question Relevance Check
  let questionRelevanceInsight: string | undefined;
  if (domain === 'wealth' && diamondCount === 0 && heartCount >= 2) {
    questionRelevanceInsight = '【天机点穴】此次牌局并未将重心落于直接的金钱收益，而是极其显著地指向“情感、人际信任与口碑”。当前的财机极大概率通过人脉关系与善缘间接显化。';
  } else if (domain === 'career' && clubCount === 0 && diamondCount === 0 && heartCount >= 2) {
    questionRelevanceInsight = '【天机点穴】事业问题中出现多张心界牌，昭示当前职场的核心关键不在于单纯的技术竞争，而在于团队氛围、情绪沟通与上下级信任。';
  }

  return {
    overall,
    love,
    career,
    wealth,
    noble,
    action,
    challenge,
    confidence,
    confidenceReason,
    questionRelevanceInsight,
  };
}
