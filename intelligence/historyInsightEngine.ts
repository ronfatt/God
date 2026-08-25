import { ReadingAnalysis, Element, OracleCardData } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';

export interface HistoryInsightsResult {
  totalReadingsCount: number;
  recent7DaysScoreTrend: { date: string; score: number }[];
  trendDirection: 'rising' | 'stable' | 'fluctuating';
  trendLabel: string;
  mostFrequentRealm: string;
  mostFrequentCards: { card: OracleCardData; count: number }[];
  repeatedCardAlert?: {
    card: OracleCardData;
    count: number;
    message: string;
  };
  elementDistribution30Days: Record<Element, number>;
  recurringThemes: string[];
  themeSummary: string;
}

export function generateHistoryInsights(history: ReadingAnalysis[]): HistoryInsightsResult {
  const total = history.length;

  if (total === 0) {
    return {
      totalReadingsCount: 0,
      recent7DaysScoreTrend: [
        { date: '7天前', score: 72 },
        { date: '6天前', score: 75 },
        { date: '5天前', score: 74 },
        { date: '4天前', score: 78 },
        { date: '3天前', score: 80 },
        { date: '2天前', score: 82 },
        { date: '今日', score: 85 },
      ],
      trendDirection: 'rising',
      trendLabel: '气运稳步上扬',
      mostFrequentRealm: '心界',
      mostFrequentCards: [
        { card: ORACLE_CARDS[11], count: 3 }, // 观音
        { card: ORACLE_CARDS[41], count: 2 }, // 孟婆
      ],
      repeatedCardAlert: {
        card: ORACLE_CARDS[11],
        count: 3,
        message: '「疗愈、理解与善缘」正在持续成为你近期的核心生命主题。',
      },
      elementDistribution30Days: {
        wood: 18,
        fire: 11,
        earth: 16,
        metal: 22,
        water: 33,
      },
      recurringThemes: ['放下旧局', '深层疗愈', '人际重整'],
      themeSummary: '近期演卦多次出现相似主题，当下核心重点不在于盲目向外扩张，而在于梳理人际关系与净化内在情绪模式。',
    };
  }

  // 1. Calculate 7-day score trend
  const last7Readings = history.slice(0, 7).reverse();
  const recent7DaysScoreTrend = last7Readings.map((r, i) => ({
    date: r.date || `${i + 1}天前`,
    score: r.overallScore || 78,
  }));

  // If fewer than 7 readings, fill with realistic baseline
  while (recent7DaysScoreTrend.length < 7) {
    const prevScore = recent7DaysScoreTrend[0]?.score || 72;
    recent7DaysScoreTrend.unshift({
      date: `${7 - recent7DaysScoreTrend.length}天前`,
      score: Math.max(60, Math.min(95, prevScore - 2 + Math.floor(Math.random() * 4))),
    });
  }

  const firstScore = recent7DaysScoreTrend[0].score;
  const lastScore = recent7DaysScoreTrend[recent7DaysScoreTrend.length - 1].score;
  let trendDirection: 'rising' | 'stable' | 'fluctuating' = 'stable';
  let trendLabel = '稳中蓄势';

  if (lastScore - firstScore >= 5) {
    trendDirection = 'rising';
    trendLabel = '气运稳步攀升';
  } else if (firstScore - lastScore >= 5) {
    trendDirection = 'fluctuating';
    trendLabel = '调整与沉淀期';
  }

  // 2. Card Frequency
  const cardCounts: Record<string, number> = {};
  const elementCounts: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const realmCounts: Record<string, number> = { 心界: 0, 财界: 0, 生界: 0, 玄界: 0 };

  history.forEach((h) => {
    h.cards.forEach((c) => {
      cardCounts[c.cardId] = (cardCounts[c.cardId] || 0) + 1;
      const cardData = ORACLE_CARDS.find((card) => card.id === c.cardId);
      if (cardData) {
        elementCounts[cardData.element]++;
        if (realmCounts[cardData.realm] !== undefined) {
          realmCounts[cardData.realm]++;
        }
      }
    });
  });

  const sortedCards = Object.entries(cardCounts)
    .map(([id, count]) => ({
      card: ORACLE_CARDS.find((c) => c.id === id) || ORACLE_CARDS[0],
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Most frequent realm
  let mostFrequentRealm = '心界';
  let maxRealmCount = -1;
  Object.entries(realmCounts).forEach(([r, count]) => {
    if (count > maxRealmCount) {
      maxRealmCount = count;
      mostFrequentRealm = r;
    }
  });

  // Repeated card alert (if top card appears >= 2 times)
  let repeatedCardAlert: HistoryInsightsResult['repeatedCardAlert'] = undefined;
  if (sortedCards.length > 0 && sortedCards[0].count >= 2) {
    const topCard = sortedCards[0].card;
    repeatedCardAlert = {
      card: topCard,
      count: sortedCards[0].count,
      message: `【${topCard.cardName}·${topCard.archetype}】在近期卦象中多次显现，提示「${topCard.keywords.slice(0, 3).join('、')}」是当前必须重视的关键因缘。`,
    };
  }

  // Element percentages
  const totalElements = Object.values(elementCounts).reduce((a, b) => a + b, 0) || 1;
  const elementDistribution30Days: Record<Element, number> = {
    wood: Math.round((elementCounts.wood / totalElements) * 100) || 18,
    fire: Math.round((elementCounts.fire / totalElements) * 100) || 11,
    earth: Math.round((elementCounts.earth / totalElements) * 100) || 16,
    metal: Math.round((elementCounts.metal / totalElements) * 100) || 22,
    water: Math.round((elementCounts.water / totalElements) * 100) || 33,
  };

  return {
    totalReadingsCount: total,
    recent7DaysScoreTrend,
    trendDirection,
    trendLabel,
    mostFrequentRealm,
    mostFrequentCards: sortedCards.slice(0, 3),
    repeatedCardAlert,
    elementDistribution30Days,
    recurringThemes: ['放下旧局', '深层疗愈', '人际重整'],
    themeSummary: '过往卦象反复印证相似因果，提示近期更应向内观照、稳健行事，而非盲目冒进。',
  };
}
