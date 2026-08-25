import {
  OracleCardData,
  QuestionDomain,
  QuestionIntent,
  SpreadPosition,
  CardOrientation,
  CardManifestationResult,
  OverallManifestationResult,
  OverallManifestationState,
  Element,
} from '@/types/oracle';
import { computeCardManifestation } from './manifestationScore';
import { BirthProfile } from '@/personal/birthProfile';

export function runManifestationEngine(
  cards: OracleCardData[],
  positions: SpreadPosition[],
  domain: QuestionDomain,
  intent: QuestionIntent,
  elementCounts: Record<Element, number>,
  yangRatio: number,
  yinRatio: number,
  orientations: CardOrientation[] = [],
  birthProfile?: BirthProfile,
  combinationScore = 0
): {
  cardManifestations: CardManifestationResult[];
  overallManifestation: OverallManifestationResult;
} {
  const cardManifestations: CardManifestationResult[] = cards.map((card, idx) => {
    const position = positions[idx] || {
      id: `pos-${idx + 1}`,
      title: `第 ${idx + 1} 位`,
      subtitle: '',
      description: '',
    };
    const orientation = orientations[idx] || 'upright';

    return computeCardManifestation(
      card,
      idx,
      cards,
      position,
      domain,
      intent,
      elementCounts,
      yangRatio,
      yinRatio,
      orientation,
      birthProfile,
      combinationScore
    );
  });

  // Calculate Overall Manifestation State
  const lightCount = cardManifestations.filter((c) => c.manifestation === 'light').length;
  const neutralCount = cardManifestations.filter((c) => c.manifestation === 'neutral').length;
  const shadowCount = cardManifestations.filter((c) => c.manifestation === 'shadow').length;
  const transformativeCount = cardManifestations.filter((c) => c.manifestation === 'transformative').length;

  const total = Math.max(1, cards.length);
  const avgScore = Math.round(cardManifestations.reduce((sum, c) => sum + c.manifestationScore, 0) / total);
  const avgSupport = Math.round(cardManifestations.reduce((sum, c) => sum + c.supportScore, 0) / total);
  const avgChallenge = Math.round(cardManifestations.reduce((sum, c) => sum + c.challengeScore, 0) / total);
  const avgUtility = Math.round(cardManifestations.reduce((sum, c) => sum + c.utilityScore, 0) / total);

  // Check Contradictions (e.g. Act vs Wait: 哪吒 vs 太上老君)
  let contradiction: OverallManifestationResult['contradiction'] = undefined;
  const hasActCard = cards.some((c) => c.id === 'C-J' || c.id === 'S-5');
  const hasWaitCard = cards.some((c) => c.id === 'S-K' || c.id === 'H-10');

  if (hasActCard && hasWaitCard) {
    contradiction = {
      detected: true,
      conflictType: 'ACT_VS_WAIT',
      description: '牌阵中同时显现「主动突破（哪吒/雷公）」与「沉静观察（太上老君/普贤）」两种力量。',
      advice: '前期需要主动破除旧有僵局，但后期更宜收敛沉淀、保持审慎观察，动静相济。',
    };
  }

  let state: OverallManifestationState = 'mixed';
  let title = '分歧并存局';
  let subtitle = '顺逆交织 · 见机行事';
  let summary = '当前机会与阻力同时存在，决定成败的关键不在大势而在具体的执行方式。';

  if (contradiction?.detected) {
    state = 'contradiction';
    title = '动静交织局';
    subtitle = '刚柔并济 · 审时度势';
    summary = contradiction.description + ' ' + contradiction.advice;
  } else if (transformativeCount >= 1 && (transformativeCount / total) >= 0.3) {
    state = 'transformative_dominant';
    title = '破旧立新转化局';
    subtitle = '旧局松动 · 新机正在孕育';
    summary = '当前并非单纯的吉凶局，而是旧秩序正在退出、新周期正在开启的深刻蜕变期。';
  } else if (lightCount / total >= 0.6) {
    state = 'light_dominant';
    title = '顺势亨通局';
    subtitle = '诸力顺畅 · 乘势进取';
    summary = '诸神核心力量处于健康流布状态，外部助力充分，适合顺应天时坚定推进。';
  } else if (shadowCount / total >= 0.5) {
    state = 'shadow_dominant';
    title = '修整沉潜局';
    subtitle = '阻力集中 · 宜守不宜急推';
    summary = '当前各方能量多有失衡或过度使用之象，重点应放在梳理内部漏洞与防范风险，不宜盲目扩张。';
  } else if (neutralCount / total >= 0.5) {
    state = 'neutral_dominant';
    title = '平稳待机局';
    subtitle = '气机初萌 · 蓄力观察';
    summary = '当下一应因缘正在缓慢汇聚，方向尚未完全成型，保持耐心与扎实准备为上策。';
  }

  return {
    cardManifestations,
    overallManifestation: {
      state,
      title,
      subtitle,
      summary,
      lightCount,
      neutralCount,
      shadowCount,
      transformativeCount,
      averageManifestationScore: avgScore,
      averageSupport: avgSupport,
      averageChallenge: avgChallenge,
      averageUtility: avgUtility,
      contradiction,
    },
  };
}
