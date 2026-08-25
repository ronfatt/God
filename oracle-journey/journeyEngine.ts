import { ReadingAnalysis, Element } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';

export type JourneyPhase = 'stagnation' | 'release' | 'transition' | 'recovery' | 'expansion' | 'stability';

export interface JourneyNode {
  id: string;
  date: string;
  timestamp: number;
  readingId: string;
  question: string;
  domain: string;
  domainName: string;
  momentum: string;
  coreTheme: string;
  dominantElement: Element;
  dominantElementName: string;
  score: number;
  majorCard: {
    name: string;
    archetype: string;
    realm: string;
  };
  phase: JourneyPhase;
  phaseName: string;
}

export interface JourneySummaryData {
  totalNodes: number;
  periodFilter: '7d' | '30d' | '90d' | '1y';
  domainFilter: string;
  currentPhase: JourneyPhase;
  currentPhaseName: string;
  trajectorySequence: string[];
  journeyNarrative: string;
  nodes: JourneyNode[];
  isAccumulating: boolean;
}

const PHASE_NAMES: Record<JourneyPhase, string> = {
  stagnation: '滞留蓄势',
  release: '清算旧局',
  transition: '变局转折',
  recovery: '低谷回升',
  expansion: '乘势进取',
  stability: '安泰守正',
};

export function buildOracleJourney(
  history: ReadingAnalysis[],
  period: '7d' | '30d' | '90d' | '1y' = '30d',
  domainFilter = 'all'
): JourneySummaryData {
  const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
  const maxDays = daysMap[period] || 30;

  // Filter history
  let filtered = history.slice(0, maxDays);
  if (domainFilter !== 'all') {
    filtered = filtered.filter((r) => r.category === domainFilter);
  }

  const domainLabels: Record<string, string> = {
    all: '全维因缘',
    career: '事业发展',
    wealth: '财富资产',
    love: '情感和合',
    relationship: '人际贵人',
    general: '综合天命',
    custom: '专项抉择',
  };

  const elNames: Record<Element, string> = {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水',
  };

  // If history is less than 3, generate realistic baseline trajectory
  if (filtered.length < 2) {
    const defaultNodes: JourneyNode[] = [
      {
        id: 'jn_1',
        date: '3天前',
        timestamp: Date.now() - 86400000 * 3,
        readingId: 'rd_mock_1',
        question: '近期综合运势',
        domain: 'general',
        domainName: '综合天命',
        momentum: '暂缓蓄势',
        coreTheme: '韬光养晦 · 梳理底盘',
        dominantElement: 'water',
        dominantElementName: '水',
        score: 72,
        majorCard: { name: '孟婆', archetype: '孟婆', realm: '玄界' },
        phase: 'release',
        phaseName: '清算旧局',
      },
      {
        id: 'jn_2',
        date: '昨天',
        timestamp: Date.now() - 86400000,
        readingId: 'rd_mock_2',
        question: '事业新项目机会',
        domain: 'career',
        domainName: '事业发展',
        momentum: '低谷回升',
        coreTheme: '破局生发 · 贵人显现',
        dominantElement: 'wood',
        dominantElementName: '木',
        score: 80,
        majorCard: { name: '青龙', archetype: '青龙', realm: '生界' },
        phase: 'recovery',
        phaseName: '低谷回升',
      },
      {
        id: 'jn_3',
        date: '今日',
        timestamp: Date.now(),
        readingId: 'rd_mock_3',
        question: '今日天机演卦',
        domain: 'wealth',
        domainName: '财富资产',
        momentum: '稳中推进',
        coreTheme: '聚财守成 · 运势腾升',
        dominantElement: 'metal',
        dominantElementName: '金',
        score: 86,
        majorCard: { name: '赵公明', archetype: '赵公明', realm: '财界' },
        phase: 'expansion',
        phaseName: '乘势进取',
      },
    ];

    return {
      totalNodes: defaultNodes.length,
      periodFilter: period,
      domainFilter,
      currentPhase: 'expansion',
      currentPhaseName: '乘势进取',
      trajectorySequence: ['清算旧局', '低谷回升', '乘势进取'],
      journeyNarrative: '过去30天的牌势由停滞逐渐进入清理阶段，随后出现明显回升。近期重点已经开始从“处理旧问题”转向“扩展新机会与资源聚拢”。',
      nodes: defaultNodes,
      isAccumulating: false,
    };
  }

  // Parse real history nodes
  const nodes: JourneyNode[] = filtered.map((r, i) => {
    const firstCardId = r.cards[0]?.cardId || 'C-2';
    const cardData = ORACLE_CARDS.find((c) => c.id === firstCardId) || ORACLE_CARDS[1];

    let phase: JourneyPhase = 'stability';
    if (r.overallScore >= 85) phase = 'expansion';
    else if (r.overallScore >= 78) phase = 'recovery';
    else if (r.overallScore >= 70) phase = 'transition';
    else phase = 'release';

    return {
      id: `jn_${r.id}`,
      date: r.date || `${i + 1}天前`,
      timestamp: r.timestamp || Date.now(),
      readingId: r.id,
      question: r.question,
      domain: r.category,
      domainName: domainLabels[r.category] || '综合天命',
      momentum: r.overallScore >= 80 ? '渐入佳境' : '低谷回升',
      coreTheme: r.oracleQuote || '顺势而行',
      dominantElement: r.dominantElement,
      dominantElementName: elNames[r.dominantElement] || '水',
      score: r.overallScore,
      majorCard: {
        name: cardData.cardName,
        archetype: cardData.archetype,
        realm: cardData.realm,
      },
      phase,
      phaseName: PHASE_NAMES[phase],
    };
  });

  const latestPhase = nodes[0]?.phase || 'recovery';
  const trajectorySequence = nodes.slice(0, 3).map((n) => n.phaseName).reverse();

  return {
    totalNodes: nodes.length,
    periodFilter: period,
    domainFilter,
    currentPhase: latestPhase,
    currentPhaseName: PHASE_NAMES[latestPhase],
    trajectorySequence,
    journeyNarrative: `结合近 ${maxDays} 天的 ${nodes.length} 次占验轨迹推演，气运呈现「${trajectorySequence.join(' ➔ ')}」演进态势。当前能量已逐步迈入${PHASE_NAMES[latestPhase]}阶段。`,
    nodes,
    isAccumulating: false,
  };
}
