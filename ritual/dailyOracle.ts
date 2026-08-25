import { OracleCardData, Element } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';

export interface DailyOracleResult {
  dateStr: string;
  seed: string;
  card: OracleCardData;
  themeTitle: string;
  themeSummary: string;
  element: Element;
  elementName: string;
  actionScore: number;
  fiveDimensions: {
    career: number;
    wealth: number;
    love: number;
    nobleman: number;
    action: number;
  };
  favorableActions: string[]; // 今日宜 (max 3)
  cautiousActions: string[]; // 今日缓一缓 (max 2)
  dailyAids: {
    elementName: string;
    luckyColor: string;
    luckyDirection: string;
    luckyTimeWindow: string;
    luckyNumber: number;
  };
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function generateDailyOracle(userId = 'user_default', targetDate?: Date): DailyOracleResult {
  const dateObj = targetDate || new Date();
  const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
  const seedStr = `${userId}_${dateStr}`;
  const hash = simpleHash(seedStr);

  const cardIndex = hash % ORACLE_CARDS.length;
  const card = ORACLE_CARDS[cardIndex];

  const baseScore = 65 + (hash % 26); // 65 - 90

  const fiveDimensions = {
    career: Math.min(98, Math.max(60, baseScore + ((hash >> 2) % 15) - 7)),
    wealth: Math.min(98, Math.max(60, baseScore + ((hash >> 4) % 15) - 7)),
    love: Math.min(98, Math.max(60, baseScore + ((hash >> 6) % 15) - 7)),
    nobleman: Math.min(98, Math.max(65, baseScore + ((hash >> 8) % 12))),
    action: Math.min(98, Math.max(60, baseScore + ((hash >> 10) % 15) - 5)),
  };

  const actionScore = fiveDimensions.action;

  // Favorable & Cautious actions from card archetype
  const favorablePool = [
    `推进【${card.keywords[0] || '核心主业'}】重点事项`,
    `与良师益友进行深度沟通`,
    `整理复盘近期财务与资产`,
    `学习进修新领域的知识体系`,
    `向内观照并做一次深度断舍离`,
  ];
  const favorableActions = favorablePool.slice(0, 3);

  const cautiousPool = [
    '冲动拍板重大不可逆决策',
    '被无意义口舌是非消耗精力',
    '因短期焦虑过度加杠杆',
  ];
  const cautiousActions = cautiousPool.slice(0, 2);

  const aidColors: Record<Element, string> = {
    wood: '青绿 · 翡翠玉石色',
    fire: '朱砂红 · 玫瑰金',
    earth: '琥珀黄 · 暖檀金',
    metal: '流金白 · 亮纯金',
    water: '玄黑水墨 · 苍青蓝',
  };

  const aidDirections: Record<Element, string> = {
    wood: '正东 · 生机启元',
    fire: '正南 · 离火当令',
    earth: '中宫 / 西南 · 厚重安泰',
    metal: '正西 · 金气聚敛',
    water: '正北 · 玄冥智水',
  };

  const aidTimeWindows: Record<Element, string> = {
    wood: '07:00 – 09:00 (辰时 · 木气生发)',
    fire: '11:00 – 13:00 (午时 · 离火显耀)',
    earth: '13:00 – 15:00 (未时 · 稳固承载)',
    metal: '15:00 – 17:00 (申时 · 刚金收敛)',
    water: '21:00 – 23:00 (亥时 · 玄水归藏)',
  };

  const luckyNumbers: Record<Element, number> = {
    wood: 3,
    fire: 9,
    earth: 5,
    metal: 7,
    water: 8,
  };

  return {
    dateStr,
    seed: seedStr,
    card,
    themeTitle: `今日主牌 · ${card.cardName}（${card.archetype}）`,
    themeSummary: card.upright,
    element: card.element,
    elementName: card.elementName,
    actionScore,
    fiveDimensions,
    favorableActions,
    cautiousActions,
    dailyAids: {
      elementName: card.elementName,
      luckyColor: aidColors[card.element],
      luckyDirection: aidDirections[card.element],
      luckyTimeWindow: aidTimeWindows[card.element],
      luckyNumber: luckyNumbers[card.element],
    },
  };
}
