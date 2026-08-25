import { OracleCardData, QuestionDomain } from '@/types/oracle';
import { ClassifiedQuestion } from './questionClassifier';
import { MomentumAnalysisResult } from './momentumEngine';
import { ElementAnalysisResult } from './elementEngine';
import { YinYangAnalysisResult } from './yinYangEngine';
import { CombinationResult } from './combinationEngine';
import { TimingAnalysisResult } from './timingEngine';
import { ScoreAnalysisResult } from './scoreEngine';

export type NarrativeMode = 'standard' | 'concise' | 'deep' | 'action' | 'rational';

export interface NarrativeResult {
  mode: NarrativeMode;
  coreTheme: {
    title: string;
    subtitle: string;
    summaryQuote: string;
  };
  synthesisNarrative: string;
  domainNarrative: string;
  actions: string[];
  cautions: string[];
  modeNarratives: Record<NarrativeMode, string>;
}

export function buildNarrative(
  cards: OracleCardData[],
  questionInfo: ClassifiedQuestion,
  momentum: MomentumAnalysisResult,
  elements: ElementAnalysisResult,
  yinYang: YinYangAnalysisResult,
  combinations: CombinationResult[],
  timing: TimingAnalysisResult,
  scores: ScoreAnalysisResult,
  activeMode: NarrativeMode = 'standard'
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

  // 3. Synthesis Narratives by Mode
  // Mode: Standard
  const standardText = [
    `此次针对【${questionInfo.original}】起卦，牌势整体呈现「${momentum.title}」之象。当前局面的主要机运并非急于求成或单方面强攻，而在于顺应「${momentum.sequence.join(' ➔ ')}」的自然时序。`,
    combinations.length > 0
      ? `牌阵中显著显现【${combinations[0].title}】神明格局：${combinations[0].meaning} 坐镇终局的【${lastCard.cardName}·${lastCard.archetype}】特别提醒：“${lastCard.oracle || lastCard.oracleMessage}”`
      : `核心牌位由【${midCard.cardName}】坐镇，其正位昭示：${midCard.upright}，提示以稳健之姿承接当下的变化。`,
    `五行层面，${elements.dominantLabel}，${elements.relationshipDesc} ${yinYang.stateLabel}。结合时序推演，${timing.primaryWindow} 将是机缘显化与做出实质调整的关键窗口。`,
    scores.questionRelevanceInsight || '',
  ]
    .filter(Boolean)
    .join('\n\n');

  // Mode: Concise (3-5 punchy sentences)
  const conciseText = `当前局势核心在于「${momentum.title}」。${combinations[0] ? `【${combinations[0].title}】表明${combinations[0].meaning}` : `核心受【${midCard.cardName}】承托，建议稳扎稳打。`}五行${elements.dominantLabel}，未来${timing.primaryWindow}为关键窗口。行动原则：${firstCard.keywords[0]}为基，顺势而为。`;

  // Mode: Deep (Full lore & philosophical context)
  const deepText = [
    `【天机本源】凡问天地因缘，必观气数之动静。此次起卦，卦气自【${firstCard.cardName}】起承，经由【${midCard.cardName}】转进，最终归于【${lastCard.cardName}】定鼎，构成「${momentum.title}」的深沉演进。`,
    `【神谕圣相】${combinations.length > 0 ? `经典阵法【${combinations[0].title}】已成，${combinations[0].meaning}` : `【${midCard.cardName}·${midCard.archetype}】昭示：“${midCard.upright}”`} 终局【${lastCard.cardName}】以“${lastCard.oracle || lastCard.oracleMessage}”点破迷津。`,
    `【乾坤律动】五行之中，${elements.dominantLabel}（占${elements.percentages[elements.dominant]}%），${elements.relationshipDesc} ${yinYang.interpretation} 在${timing.primaryWindow}的显化期内，宜以修己安人为本。`,
  ].join('\n\n');

  // Mode: Action (Direct action focus)
  const actionText = [
    `【行动第一步】立即落实：${firstCard.upright?.split('。')[0] || '理清核心诉求，稳住基本盘'}。`,
    `【行动第二步】抓紧推进：${midCard.upright?.split('。')[0] || '主动与核心贵人建立协同'}。`,
    `【关键窗口】在 ${timing.primaryWindow} 内完成实质落地，同时避免：${elements.advice.unfavorable.join('、')}。`,
  ].join('\n\n');

  // Mode: Rational (Algorithm & strategic structural analysis)
  const rationalText = [
    `【结构分析】本次分析基于「${momentum.title}」动能模型与${elements.dominantLabel}偏向（占比${elements.percentages[elements.dominant]}%）。`,
    `【关键因果】卡牌序列在“${firstCard.keywords[0]}”与“${lastCard.keywords[0]}”之间建立了较强的逻辑因果链。综合支持度指数为 ${scores.overall}，行动势能 ${scores.action}，外部挑战 ${scores.challenge}。`,
    `【策略结论】数据表明阻碍属于阶段性磨合，建议在 ${timing.primaryWindow} 窗口内保持纪律性执行，避免情绪化决策。`,
  ].join('\n\n');

  const modeNarratives: Record<NarrativeMode, string> = {
    standard: standardText,
    concise: conciseText,
    deep: deepText,
    action: actionText,
    rational: rationalText,
  };

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
    mode: activeMode,
    coreTheme: {
      title,
      subtitle,
      summaryQuote,
    },
    synthesisNarrative: modeNarratives[activeMode] || standardText,
    domainNarrative,
    actions,
    cautions,
    modeNarratives,
  };
}
