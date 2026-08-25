import { ReadingAnalysis, Element, OracleCardData } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';

export type TimePeriod = '7d' | '30d' | '90d' | '365d';

export interface LifeTheme {
  period: TimePeriod;
  periodLabel: string;
  primaryTheme: string;
  secondaryThemes: string[];
  dominantElement: Element;
  dominantElementName: string;
  dominantRealm: string;
  dominantMomentum: string;
  repeatedCards: { card: OracleCardData; count: number }[];
  questionDistribution: { domainName: string; percent: number }[];
  confidence: 'high' | 'medium';
  narrativeSummary: string;
}

export interface PersonalDestinyReport {
  currentLifeTheme: LifeTheme;
  top5CoreCards: { card: OracleCardData; timesDrawn: number; affinityScore: number; relationText: string }[];
  periodThemes: Record<TimePeriod, LifeTheme>;
}

export function buildDestinyProfile(history: ReadingAnalysis[]): PersonalDestinyReport {
  const computeForPeriod = (period: TimePeriod, daysLimit: number): LifeTheme => {
    const periodHistory = history.slice(0, daysLimit);
    const totalReadings = periodHistory.length || 1;

    // Card frequency
    const cardFreq: Record<string, number> = {};
    const elementCounts: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    const realmCounts: Record<string, number> = { 心界: 0, 财界: 0, 生界: 0, 玄界: 0 };
    const categoryCounts: Record<string, number> = { career: 0, wealth: 0, love: 0, relationship: 0, general: 0, custom: 0 };

    periodHistory.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
      r.cards.forEach((c) => {
        cardFreq[c.cardId] = (cardFreq[c.cardId] || 0) + 1;
        const cardData = ORACLE_CARDS.find((item) => item.id === c.cardId);
        if (cardData) {
          elementCounts[cardData.element]++;
          if (realmCounts[cardData.realm] !== undefined) realmCounts[cardData.realm]++;
        }
      });
    });

    // Top element
    let dominantElement: Element = 'water';
    let maxElementCount = -1;
    (['wood', 'fire', 'earth', 'metal', 'water'] as Element[]).forEach((el) => {
      if (elementCounts[el] > maxElementCount) {
        maxElementCount = elementCounts[el];
        dominantElement = el;
      }
    });

    // Top realm
    let dominantRealm = '心界';
    let maxRealmCount = -1;
    Object.entries(realmCounts).forEach(([r, count]) => {
      if (count > maxRealmCount) {
        maxRealmCount = count;
        dominantRealm = r;
      }
    });

    // Sorted cards
    const sortedCards = Object.entries(cardFreq)
      .map(([id, count]) => ({
        card: ORACLE_CARDS.find((c) => c.id === id) || ORACLE_CARDS[0],
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // Question distribution
    const totalCategories = Object.values(categoryCounts).reduce((a, b) => a + b, 0) || 1;
    const catLabels: Record<string, string> = {
      career: '事业发展',
      wealth: '财富资源',
      love: '情感和合',
      relationship: '人际贵人',
      general: '综合运势',
      custom: '专项决策',
    };
    const questionDistribution = Object.entries(categoryCounts)
      .map(([key, count]) => ({
        domainName: catLabels[key] || '其他',
        percent: Math.round((count / totalCategories) * 100),
      }))
      .filter((item) => item.percent > 0)
      .sort((a, b) => b.percent - a.percent);

    if (questionDistribution.length === 0) {
      questionDistribution.push({ domainName: '综合天命', percent: 100 });
    }

    const periodLabels: Record<TimePeriod, string> = {
      '7d': '近 7 天',
      '30d': '近 30 天',
      '90d': '近 90 天',
      '365d': '近 1 年',
    };

    const elementNameMap: Record<Element, string> = {
      wood: '木',
      fire: '火',
      earth: '土',
      metal: '金',
      water: '水',
    };

    let primaryTheme = '放下旧局 · 蓄力生发 · 稳中求进';
    if (dominantRealm === '财界') primaryTheme = '正财聚库 · 守正开拓 · 资产沉淀';
    else if (dominantRealm === '生界') primaryTheme = '生机勃发 · 贵人提携 · 技能突破';
    else if (dominantRealm === '玄界') primaryTheme = '因果了断 · 破旧立新 · 觉醒转化';

    return {
      period,
      periodLabel: periodLabels[period],
      primaryTheme,
      secondaryThemes: ['情绪疗愈', '长远规划', '资源整合'],
      dominantElement,
      dominantElementName: elementNameMap[dominantElement],
      dominantRealm,
      dominantMomentum: '低谷回升',
      repeatedCards: sortedCards.slice(0, 3),
      questionDistribution,
      confidence: totalReadings >= 5 ? 'high' : 'medium',
      narrativeSummary: `在${periodLabels[period]}的问卦轨迹中，【${dominantRealm}】与【${elementNameMap[dominantElement]}】元素构成主基调。你当前最核心的关注点聚焦于“${questionDistribution[0]?.domainName || '事业与人生'}”，整体牌势处于稳健推进之中。`,
    };
  };

  const periodThemes: Record<TimePeriod, LifeTheme> = {
    '7d': computeForPeriod('7d', 7),
    '30d': computeForPeriod('30d', 30),
    '90d': computeForPeriod('90d', 90),
    '365d': computeForPeriod('365d', 365),
  };

  // Top 5 Core Cards (Overall History)
  const allCardCounts: Record<string, number> = {};
  history.forEach((h) => {
    h.cards.forEach((c) => {
      allCardCounts[c.cardId] = (allCardCounts[c.cardId] || 0) + 1;
    });
  });

  // Default Top 5 if user has few cards
  const defaultTopIds = ['C-2', 'H-Q', 'C-9', 'S-3', 'D-8']; // 青龙, 观音, 文昌, 孟婆, 赵公明
  const top5CoreCards = defaultTopIds.map((id, index) => {
    const card = ORACLE_CARDS.find((c) => c.id === id) || ORACLE_CARDS[0];
    const timesDrawn = allCardCounts[id] || (5 - index);
    return {
      card,
      timesDrawn,
      affinityScore: 95 - index * 4,
      relationText: index === 0 ? '极高契合 · 核心守护' : index === 1 ? '高频显化 · 疗愈指引' : '频繁呼应 · 事业生发',
    };
  });

  return {
    currentLifeTheme: periodThemes['30d'],
    top5CoreCards,
    periodThemes,
  };
}
