import { OracleCardData, SpreadType, QuestionCategory, ReadingAnalysis, Element } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';

// 五行生克字典
const GENERATION_CYCLE: Record<Element, Element> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

const DESTRUCTION_CYCLE: Record<Element, Element> = {
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
  metal: 'wood',
};

const ELEMENT_NAMES: Record<Element, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

export function analyzeCards(
  drawnCards: OracleCardData[],
  question: string,
  category: QuestionCategory,
  spreadType: SpreadType
): ReadingAnalysis {
  // 1. 统计五行分布
  const elementCounts: Record<Element, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };
  drawnCards.forEach((c) => {
    elementCounts[c.element]++;
  });

  // 主导元素
  let dominantElement: Element = 'water';
  let maxCount = -1;
  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  for (const el of elements) {
    if (elementCounts[el] > maxCount) {
      maxCount = elementCounts[el];
      dominantElement = el;
    }
  }

  // 2. 五行生克流转关系判断
  const elementSequence = drawnCards.map((c) => c.elementName);
  let interaction: 'generate' | 'restrain' | 'harmonious' | 'complex' = 'harmonious';
  let interactionDesc = '';

  if (drawnCards.length >= 2) {
    const first = drawnCards[0].element;
    const second = drawnCards[1].element;
    const third = drawnCards.length >= 3 ? drawnCards[2].element : null;

    if (GENERATION_CYCLE[first] === second || (third && GENERATION_CYCLE[second] === third)) {
      interaction = 'generate';
      interactionDesc = `呈现【${ELEMENT_NAMES[first]}生${ELEMENT_NAMES[second]}】相生顺势之象，气运流转通畅，先发之意正在化为后续实质产出。`;
    } else if (DESTRUCTION_CYCLE[first] === second || (third && DESTRUCTION_CYCLE[second] === third)) {
      interaction = 'restrain';
      interactionDesc = `呈现【${ELEMENT_NAMES[first]}克${ELEMENT_NAMES[second]}】能量淬炼之象，当下正处于破而后立、调整磨合的关键过渡期，需要耐心平衡。`;
    } else {
      interaction = 'harmonious';
      interactionDesc = `五行能量多维互补，格局平稳内敛，适宜稳扎稳打，静待天时顺应。`;
    }
  }

  // 3. 动态评分计算 (Base 70 + Energy Weights + Synergy)
  const avgEnergy = drawnCards.reduce((acc, c) => acc + c.energyLevel, 0) / (drawnCards.length || 1);
  const baseScore = Math.min(96, Math.max(68, Math.round(62 + avgEnergy * 6.5)));

  // 根据牌阵中出现的各界牌微调各维度
  const heartCount = drawnCards.filter((c) => c.suit === 'heart').length;
  const diamondCount = drawnCards.filter((c) => c.suit === 'diamond').length;
  const clubCount = drawnCards.filter((c) => c.suit === 'club').length;
  const spadeCount = drawnCards.filter((c) => c.suit === 'spade').length;

  const wealthScore = Math.min(99, Math.max(65, baseScore + diamondCount * 4 - spadeCount * 1 + Math.floor(Math.random() * 5)));
  const careerScore = Math.min(99, Math.max(65, baseScore + clubCount * 4 + diamondCount * 2 + Math.floor(Math.random() * 4)));
  const loveScore = Math.min(99, Math.max(65, baseScore + heartCount * 5 - (spadeCount > 1 ? 3 : 0) + Math.floor(Math.random() * 4)));
  const noblemanScore = Math.min(99, Math.max(68, baseScore + (heartCount + clubCount) * 3 + Math.floor(Math.random() * 5)));

  // 4. 天机核心总结语
  const firstCard = drawnCards[0];
  const lastCard = drawnCards[drawnCards.length - 1];
  const midCard = drawnCards[Math.floor(drawnCards.length / 2)];

  let oracleQuote = '顺势而行，旧局渐终，新的生机已然在暗中蓄力。';
  if (spreadType === 'three') {
    const p1 = firstCard.keywords[0] || '知因';
    const p2 = midCard.keywords[0] || '明势';
    const p3 = lastCard.keywords[0] || '得果';
    oracleQuote = `【天机连理】${p1} ➔ ${p2} ➔ ${p3}。${lastCard.oracle || lastCard.oracleMessage}`;
  } else if (spreadType === 'six') {
    oracleQuote = `六合交泰，${dominantElement === 'water' || dominantElement === 'metal' ? '以柔制刚，暗藏化劫成祥之机' : '生机盎然，宜以积极进取之姿定局'}。${lastCard.oracle || lastCard.oracleMessage}`;
  } else {
    oracleQuote = `九宫归位，中宫【${midCard.cardName || midCard.name}·${midCard.archetype}】坐镇枢纽，${midCard.oracle || midCard.oracleMessage}`;
  }

  // 5. 今日行动建议 (Action Advices)
  const advices: [string, string, string] = [
    firstCard.upright || firstCard.advice || '保持内心笃定，勿因外界细微干扰而轻易改变原定策略。',
    midCard.upright || midCard.advice || '主动与身边的良师益友保持沟通，虚心倾听不同视角的意见。',
    lastCard.upright || lastCard.advice || '凡事留三分余地，下午酉时至戌时更有利于落地核心事务。',
  ];

  // 6. 时间预测窗口 (Timeline)
  let near = '运势平稳内收，适合沉淀思路与查漏补缺，不宜盲目冒进。';
  let mid = '贵人助力与外部信号逐渐清晰，合作谈判与新机缘将显著增加。';
  let far = '迎来关键转折节点，前期布局将结出实质果实，局面彻底豁然开朗。';

  if (dominantElement === 'fire' || dominantElement === 'metal') {
    near = '节奏明显加快，突发灵感与短线机会增多，注意迅速决断。';
    mid = '迎来关键竞争与展示阶段，全力以赴必能脱颖而出。';
    far = '成果稳固成型，确立全新的主导地位与收益周期。';
  } else if (dominantElement === 'water') {
    near = '适合以退为进，多做梳理与疗愈，避免正面硬碰硬。';
    mid = '润物无声，暗中人脉与资金流动顺畅，柳暗花明。';
    far = '大江奔流归大海，所有过往困扰化为滋养新生的沃土。';
  }

  // 7. 今日助力 (Lucky Elements)
  const luckyColors: Record<Element, string> = {
    wood: '天青色 · 翡翠绿',
    fire: '朱砂红 · 玫瑰金',
    earth: '琥珀黄 · 暖檀金',
    metal: '流金白 · 纯金黄',
    water: '玄黑水墨 · 苍青蓝',
  };

  const luckyDirs: Record<Element, string> = {
    wood: '正东 · 生发之地',
    fire: '正南 · 离火大运',
    earth: '中宫 / 西南 · 承载厚德',
    metal: '正西 · 聚金收敛',
    water: '正北 · 玄冥智水',
  };

  const luckyTimes: Record<Element, string> = {
    wood: '05:00 - 09:00 (卯辰之交)',
    fire: '11:00 - 13:00 (午时正阳)',
    earth: '13:00 - 15:00 (未时厚土)',
    metal: '15:00 - 19:00 (申酉聚金)',
    water: '21:00 - 23:00 (亥时清露)',
  };

  const luckyNumbers: Record<Element, number> = {
    wood: 3,
    fire: 9,
    earth: 5,
    metal: 7,
    water: 8,
  };

  return {
    id: 'reading_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    date: new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' }),
    timestamp: Date.now(),
    question: question || '今日神谕·乾坤运势',
    category,
    spreadType,
    cards: drawnCards.map((c, i) => ({
      positionId: `pos_${i}`,
      cardId: c.id,
    })),
    overallScore: baseScore,
    wealthScore,
    careerScore,
    loveScore,
    noblemanScore,
    oracleQuote,
    elementTrend: {
      sequence: elementSequence,
      interaction,
      description: interactionDesc,
    },
    dominantElement,
    actionAdvices: advices,
    timeline: {
      near,
      mid,
      far,
    },
    luckyElements: {
      color: luckyColors[dominantElement],
      direction: luckyDirs[dominantElement],
      time: luckyTimes[dominantElement],
      element: ELEMENT_NAMES[dominantElement],
      number: luckyNumbers[dominantElement],
    },
  };
}

export function getCardById(id: string): OracleCardData | undefined {
  return ORACLE_CARDS.find((c) => c.id === id);
}
