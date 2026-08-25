import { Element, OracleCardData } from '@/types/oracle';

export type ElementBalanceState = 'balanced' | 'slightly_dominant' | 'dominant' | 'overloaded' | 'deficient';

export interface ElementAnalysisResult {
  dominant: Element;
  dominantName: string;
  dominantLabel: string;
  percentages: Record<Element, number>;
  counts: Record<Element, number>;
  balanceState: ElementBalanceState;
  relationship: string;
  relationshipDesc: string;
  advice: {
    favorable: string[]; // 宜
    unfavorable: string[]; // 避免
  };
}

const ELEMENT_LABELS: Record<Element, { name: string; trait: string; keywords: string[] }> = {
  wood: { name: '木', trait: '木主生发生长', keywords: ['学习', '成长', '拓展', '进阶'] },
  fire: { name: '火', trait: '火主礼明热情', keywords: ['显化', '执行', '热情', '破局'] },
  earth: { name: '土', trait: '土主厚重承载', keywords: ['沉淀', '稳定', '累积', '底盘'] },
  metal: { name: '金', trait: '金主义气刚决', keywords: ['决断', '规则', '秩序', '清算'] },
  water: { name: '水', trait: '水主灵动智谋', keywords: ['情绪', '直觉', '观察', '流动'] },
};

const GENERATION_MAP: Record<Element, Element> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood',
};

const DESTRUCTION_MAP: Record<Element, Element> = {
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
  metal: 'wood',
};

const ELEMENT_ACTION_ADVICE: Record<Element, { favorable: string[]; unfavorable: string[] }> = {
  water: {
    favorable: ['保持深度观察与复盘', '真诚倾听与温润沟通', '理清内在真实情绪与底线'],
    unfavorable: ['情绪化草率拍板', '陷入内耗无限期拖延行动', '被外部虚言蒙蔽'],
  },
  fire: {
    favorable: ['雷厉风行抓住关键窗口', '尽情展示实力与核心成果', '主动出击破开僵局'],
    unfavorable: ['冲动易怒引发言语摩擦', '盲目跟风过度加杠杆扩张', '急功近利'],
  },
  wood: {
    favorable: ['深耕核心专业技能升级', '向良师益友谦逊求教', '播下长期复利的新种子'],
    unfavorable: ['同时涉足过多领域分散精力', '好高骛远忽视基本功', '纸上谈兵'],
  },
  metal: {
    favorable: ['严格依照契约与规章办事', '果断斩断低效与消耗性事务', '厘清账目与权责划分'],
    unfavorable: ['言辞过于苛刻不近人情', '死板教条缺乏商业弹性', '钻牛角尖'],
  },
  earth: {
    favorable: ['做好长期财务与资产储蓄', '深耕主业与本地实体根基', '给予新生事物充足生长周期'],
    unfavorable: ['固步自封拒绝合理创新', '过度保守错过时代风口', '过度担忧'],
  },
};

export function analyzeElements(cards: OracleCardData[]): ElementAnalysisResult {
  const counts: Record<Element, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  cards.forEach((c) => {
    if (counts[c.element] !== undefined) {
      counts[c.element]++;
    }
  });

  const total = cards.length || 1;
  const percentages: Record<Element, number> = {
    wood: Math.round((counts.wood / total) * 100),
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    metal: Math.round((counts.metal / total) * 100),
    water: Math.round((counts.water / total) * 100),
  };

  // Find dominant
  let dominant: Element = 'water';
  let maxCount = -1;
  const allElements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  for (const el of allElements) {
    if (counts[el] > maxCount) {
      maxCount = counts[el];
      dominant = el;
    }
  }

  // Balance State
  const maxPercent = percentages[dominant];
  let balanceState: ElementBalanceState = 'balanced';
  if (maxPercent >= 60) balanceState = 'overloaded';
  else if (maxPercent >= 40) balanceState = 'dominant';
  else if (maxPercent >= 30) balanceState = 'slightly_dominant';
  else balanceState = 'balanced';

  // Relationship description
  let relationship = '五行调和';
  let relationshipDesc = '全局五行流转均衡，各元素相互承托，格局平稳内敛。';

  if (cards.length >= 2) {
    const first = cards[0].element;
    const second = cards[1].element;
    const third = cards.length >= 3 ? cards[2].element : null;

    if (GENERATION_MAP[first] === second || (third && GENERATION_MAP[second] === third)) {
      relationship = '五行相生';
      relationshipDesc = `呈现【${ELEMENT_LABELS[first].name}生${ELEMENT_LABELS[second].name}】顺势循环，先发动力自然转化为后续实质收益。`;
    } else if (DESTRUCTION_MAP[first] === second || (third && DESTRUCTION_MAP[second] === third)) {
      relationship = '能量淬炼';
      relationshipDesc = `呈现【${ELEMENT_LABELS[first].name}克${ELEMENT_LABELS[second].name}】相克淬砺之象，当下属于破旧立新、磨合调整的关键过渡期。`;
    }
  }

  const dominantInfo = ELEMENT_LABELS[dominant];
  const dominantLabel = `${dominantInfo.name}势${maxPercent >= 40 ? '偏旺' : '显主'}`;

  return {
    dominant,
    dominantName: dominantInfo.name,
    dominantLabel,
    percentages,
    counts,
    balanceState,
    relationship,
    relationshipDesc,
    advice: ELEMENT_ACTION_ADVICE[dominant],
  };
}
