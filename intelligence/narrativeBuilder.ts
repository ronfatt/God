import { OracleCardData, QuestionDomain } from '@/types/oracle';
import { ClassifiedQuestion } from './questionClassifier';
import { MomentumAnalysisResult } from './momentumEngine';
import { ElementAnalysisResult } from './elementEngine';
import { YinYangAnalysisResult } from './yinYangEngine';
import { CombinationResult } from './combinationEngine';
import { TimingAnalysisResult } from './timingEngine';
import { ScoreAnalysisResult } from './scoreEngine';

export interface NarrativeResult {
  coreTheme: {
    title: string;
    subtitle: string;
    summaryQuote: string;
  };
  synthesisNarrative: string;
  domainNarrative: string;
  actions: string[];
  cautions: string[];
}

export function buildNarrative(
  cards: OracleCardData[],
  questionInfo: ClassifiedQuestion,
  momentum: MomentumAnalysisResult,
  elements: ElementAnalysisResult,
  yinYang: YinYangAnalysisResult,
  combinations: CombinationResult[],
  timing: TimingAnalysisResult,
  scores: ScoreAnalysisResult
): NarrativeResult {
  const firstCard = cards[0];
  const lastCard = cards[cards.length - 1];
  const midCard = cards[Math.floor(cards.length / 2)];

  // 1. Core Theme Title & Subtitle
  let title = momentum.title;
  let subtitle = momentum.subtitle;

  if (combinations.length > 0) {
    title = combinations[0].title;
    subtitle = `${momentum.title} · ${elements.relationship}`;
  }

  // 2. Summary Quote
  let summaryQuote = `${firstCard.keywords[0]} ➔ ${midCard.keywords[0]} ➔ ${lastCard.keywords[0]}。${lastCard.oracle || lastCard.oracleMessage}`;
  if (combinations.length > 0) {
    summaryQuote = `【${combinations[0].title}】${combinations[0].meaning} ${lastCard.oracle || lastCard.oracleMessage}`;
  }

  // 3. Synthesis Narrative
  const parts: string[] = [];

  // Paragraph 1: Momentum & Question Stance
  parts.push(
    `此次针对【${questionInfo.original}】起卦，牌势整体呈现「${momentum.title}」之象。当前局面的主要机运并非急于求成或单方面强攻，而在于顺应「${momentum.sequence.join(' ➔ ')}」的自然时序。`
  );

  // Paragraph 2: Combination & Position Dynamics
  if (combinations.length > 0) {
    parts.push(
      `牌阵中显著显现【${combinations[0].title}】神明格局：${combinations[0].meaning} 坐镇终局的【${lastCard.cardName}·${lastCard.archetype}】特别提醒：“${lastCard.oracle || lastCard.oracleMessage}”`
    );
  } else {
    parts.push(
      `核心牌位由【${midCard.cardName}】坐镇，其正位昭示：${midCard.upright}，提示以稳健之姿承接当下的变化。`
    );
  }

  // Paragraph 3: Elements & Timing Window
  parts.push(
    `五行层面，${elements.dominantLabel}，${elements.relationshipDesc} ${yinYang.stateLabel}。结合时序推演，${timing.primaryWindow} 将是机缘显化与做出实质调整的关键窗口。`
  );

  // Paragraph 4: Question Relevance Special Note
  if (scores.questionRelevanceInsight) {
    parts.push(scores.questionRelevanceInsight);
  }

  const synthesisNarrative = parts.join('\n\n');

  // 4. Domain Specific Narrative
  let domainNarrative = '';
  if (questionInfo.domain === 'love') {
    domainNarrative = `情感层面：${lastCard.love} 当前更倾向于以真诚与长远共识为基石，避免盲目猜测。`;
  } else if (questionInfo.domain === 'wealth') {
    domainNarrative = `财富层面：${lastCard.wealth} 强调建立长久抗风险资产与防范漏洞，不宜孤注一掷。`;
  } else if (questionInfo.domain === 'career') {
    domainNarrative = `事业层面：${lastCard.career} 把握主动权与专业升级，贵人助力将逐步明朗。`;
  } else {
    domainNarrative = `综合态势：${lastCard.upright} 保持身心平衡与笃定信念，顺应大势自能安泰。`;
  }

  // 5. Actions (3 Practical Real-world Steps)
  const actions = [
    firstCard.upright ? `【根基】${firstCard.upright.split('。')[0]}。` : '保持内心笃定，理清核心诉求。',
    midCard.upright ? `【推进】${midCard.upright.split('。')[0]}。` : '主动与关键良师益友保持沟通。',
    elements.advice.favorable[0] ? `【调和】宜${elements.advice.favorable[0]}。` : '凡事留三分余地，顺势而为。',
  ];

  // 6. Cautions (2 Realistic Caveats)
  const cautions = [
    lastCard.shadow ? `防范【${lastCard.cardName}】逆位隐患：${lastCard.shadow.split('。')[0]}。` : '谨防急功近利引发不必要的摩擦。',
    `五行提示：避免${elements.advice.unfavorable.join('、')}。`,
  ];

  return {
    coreTheme: {
      title,
      subtitle,
      summaryQuote,
    },
    synthesisNarrative,
    domainNarrative,
    actions,
    cautions,
  };
}
