import { OracleCardData, ReadingAnalysis } from '@/types/oracle';
import { IntelligenceReadingResult } from '@/intelligence';
import { PersonalElementProfile } from './personalElementEngine';
import { BirthProfile } from './birthProfile';

export interface PersonalModificationResult {
  personalRelevance: number; // 0 - 100
  personalRelevanceLabel: string;
  elementAdjustmentType: 'replenish' | 'overload' | 'harmonize';
  elementAdjustmentTitle: string;
  elementAdjustmentMessage: string;
  personalAdvice: string[];
  repeatedArchetypeAlert?: {
    archetype: string;
    cardName: string;
    count: number;
    insight: string;
  };
  trendComparison?: {
    previousQuestion: string;
    previousMomentum: string;
    currentMomentum: string;
    trendEvaluation: 'improving' | 'stable' | 'cautious';
    trendMessage: string;
  };
  closingOraclePhrase: string;
  explainReasons: {
    title: string;
    detail: string;
  }[];
}

export function applyPersonalModifier(
  v2Result: IntelligenceReadingResult,
  personalElement: PersonalElementProfile,
  history: ReadingAnalysis[],
  birthProfile?: BirthProfile
): PersonalModificationResult {
  const drawnCards = v2Result.readingContext.cards;
  const currentDominant = v2Result.elementsAnalysis.dominant;
  const currentDominantName = v2Result.elementsAnalysis.dominantName;
  const domain = v2Result.questionClassified.domain;

  // 1. Element Replenish vs Overload logic
  let elementAdjustmentType: 'replenish' | 'overload' | 'harmonize' = 'harmonize';
  let elementAdjustmentTitle = '五行承接 · 顺势而动';
  let elementAdjustmentMessage = `本次牌势五行流转与你的近期个人气场高度吻合，各方能量承接得当。`;
  const personalAdvice: string[] = [];

  const isCurrentReplenishingDeficient = personalElement.deficient.includes(currentDominant);
  const isCurrentOverloadingDominant = personalElement.dominant === currentDominant && personalElement.combined[currentDominant] >= 35;

  if (isCurrentReplenishingDeficient) {
    elementAdjustmentType = 'replenish';
    elementAdjustmentTitle = `${currentDominantName}气补足 · 喜遇甘霖`;
    elementAdjustmentMessage = `你近期个人气场中【${currentDominantName}】元素偏弱，本次牌局显著显现${currentDominantName}势，恰如其分地补充了你最需要的生长、破局与外拓动能。`;
    personalAdvice.push(`把握【${currentDominantName}】所带来的补益，主动拓展新项目与良师益友接触。`);
  } else if (isCurrentOverloadingDominant) {
    elementAdjustmentType = 'overload';
    elementAdjustmentTitle = `${currentDominantName}势叠加 · 刚柔相济`;
    elementAdjustmentMessage = `你近期个人气场中【${currentDominantName}】本身已较为旺盛，本次牌局再次加持，提示行动势能极其充沛，但切忌急躁冒进，宜守中道。`;
    personalAdvice.push(`势能强劲时更需多一分沉着，重大决定先隔夜复盘，避免盲目加杠杆。`);
  } else {
    personalAdvice.push(`依循【${v2Result.elementsAnalysis.dominantName}】的指引，稳健推进行动步调。`);
  }

  // 2. Personal Relevance Score (0 - 100)
  let relevance = 75;
  if (isCurrentReplenishingDeficient || isCurrentOverloadingDominant) relevance += 10;
  if (history.length > 5) relevance += 5;
  if (birthProfile?.birthDate) relevance += 8;
  const personalRelevance = Math.min(99, Math.max(68, relevance));
  const personalRelevanceLabel = personalRelevance >= 85 ? '极高关联' : '深度契合';

  // 3. Repeated Archetype Detection (Across 30 days)
  let repeatedArchetypeAlert: PersonalModificationResult['repeatedArchetypeAlert'] = undefined;
  const archetypeCounts: Record<string, { count: number; cardName: string }> = {};

  history.slice(0, 30).forEach((r) => {
    r.cards.forEach((c) => {
      archetypeCounts[c.cardId] = archetypeCounts[c.cardId] || { count: 0, cardName: '' };
      archetypeCounts[c.cardId].count++;
    });
  });

  // Check if any drawn card today is a high-frequency archetype
  for (const card of drawnCards) {
    const historical = archetypeCounts[card.id];
    if (historical && historical.count >= 2) {
      const totalCount = historical.count + 1;
      repeatedArchetypeAlert = {
        archetype: card.archetype,
        cardName: card.cardName,
        count: totalCount,
        insight: `【${card.cardName}·${card.archetype}】在你近期的命盘中已第 ${totalCount} 次显圣，“${card.keywords.slice(0, 3).join('、')}”正在持续构成你当下的核心生命演化课题。`,
      };
      break;
    }
  }

  // 4. Compare Previous Reading in Same Domain
  let trendComparison: PersonalModificationResult['trendComparison'] = undefined;
  const previousSameDomain = history.find(
    (h) => h.category === v2Result.category && h.id !== v2Result.id
  );

  if (previousSameDomain) {
    const currentMomentumTitle = v2Result.momentumAnalysis.title;
    const isImproving = v2Result.scoreAnalysis.overall >= previousSameDomain.overallScore;

    trendComparison = {
      previousQuestion: previousSameDomain.question,
      previousMomentum: previousSameDomain.overallScore >= 80 ? '渐入佳境' : '暂缓蓄势',
      currentMomentum: currentMomentumTitle,
      trendEvaluation: isImproving ? 'improving' : 'cautious',
      trendMessage: isImproving
        ? `与上次同类问卦相比，本次综合支持度由 ${previousSameDomain.overallScore} 提升至 ${v2Result.scoreAnalysis.overall}，局势呈现清晰的破局上扬趋势。`
        : `与上次同类问卦相比，当前局势更要求沉下心来修整与防范漏洞，不宜强行加速。`,
    };
  }

  // 5. Closing Oracle Phrase
  const closingOraclePhrase =
    v2Result.narrativeAnalysis.actions[0]
      ? `天机寄语：不需要知悉所有前路答案，先踏实完成眼前最关键的一步。`
      : `顺应天时，内观己心，大道至简。`;

  // 6. Explain Personalization reasons
  const explainReasons = [
    {
      title: '个人五行结构对比',
      detail: `你近期命性格局中【${personalElement.dominantName}】占 ${personalElement.combined[personalElement.dominant]}%，本次牌局显化【${currentDominantName}】(${v2Result.elementsAnalysis.percentages[currentDominant]}%)，产生${elementAdjustmentType === 'replenish' ? '强力补益' : '势能共振'}。`,
    },
    {
      title: '关注领域与意图契合',
      detail: `你当前聚焦于【${v2Result.questionClassified.subCategoryName}】，所抽神谕圣相在【${v2Result.readingContext.spread === 'three' ? '三才天地人' : '宫位'}】中形成了高度呼应。`,
    },
    {
      title: '历史牌势与因果演进',
      detail: `结合过去占验轨迹，当前正处于「${v2Result.momentumAnalysis.title}」的能量转化节点，个人综合关联度达 ${personalRelevance}%。`,
    },
  ];

  return {
    personalRelevance,
    personalRelevanceLabel,
    elementAdjustmentType,
    elementAdjustmentTitle,
    elementAdjustmentMessage,
    personalAdvice,
    repeatedArchetypeAlert,
    trendComparison,
    closingOraclePhrase,
    explainReasons,
  };
}
