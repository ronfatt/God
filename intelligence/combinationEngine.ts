import { OracleCardData } from '@/types/oracle';
import { CARD_COMBINATIONS, CardCombination } from '@/data/cardCombinations';

export interface CombinationResult {
  title: string;
  meaning: string;
  effect: 'positive' | 'challenging' | 'transformative' | 'neutral';
  scoreModifier: number;
  tags: string[];
  cards: OracleCardData[];
  cardNames: string[];
  patternReason: string; // Explains why this combination was triggered for "为什么这样解读？"
}

export function detectCombinations(cards: OracleCardData[]): CombinationResult[] {
  const results: CombinationResult[] = [];
  const cardIds = cards.map((c) => c.id);
  const cardArchetypes = cards.map((c) => c.archetype);

  // 1. Direct Combination Match from curated database
  for (const combo of CARD_COMBINATIONS) {
    const isMatch = combo.cards.every((cid) => cardIds.includes(cid));
    if (isMatch) {
      const matchedCards = cards.filter((c) => combo.cards.includes(c.id));
      results.push({
        title: combo.title,
        meaning: combo.meaning,
        effect: combo.effect,
        scoreModifier: combo.scoreModifier,
        tags: combo.tags,
        cards: matchedCards,
        cardNames: matchedCards.map((c) => `${c.cardName} (${c.archetype})`),
        patternReason: `由【${matchedCards.map((c) => c.cardName).join(' + ')}】触发经典命理组合【${combo.title}】，牌相关键词 [${matchedCards.map((c) => c.keywords.slice(0, 2).join('/')).join(' 与 ')}] 形成深度互鸣。`,
      });
    }
  }

  // 2. Tag Pattern Matching Engine (Dynamic semantic synthesis)
  const allKeywords = cards.flatMap((c) => c.keywords);
  const allKeywordsSet = new Set(allKeywords);

  // Pattern: Release + Wealth + Growth
  const hasRelease = allKeywordsSet.has('放下') || allKeywordsSet.has('告别') || allKeywordsSet.has('清算') || cardIds.includes('S-3');
  const hasWealth = allKeywordsSet.has('积累') || allKeywordsSet.has('资产') || allKeywordsSet.has('财富') || allKeywordsSet.has('进账') || cards.some((c) => c.realm === '财界');
  const hasGrowth = allKeywordsSet.has('成长') || allKeywordsSet.has('上升') || allKeywordsSet.has('突破') || cards.some((c) => c.realm === '生界');
  const hasHealing = allKeywordsSet.has('疗愈') || allKeywordsSet.has('修复') || allKeywordsSet.has('安宁') || allKeywordsSet.has('包容');
  const hasRelationship = allKeywordsSet.has('缘分') || allKeywordsSet.has('相遇') || allKeywordsSet.has('合作') || cards.some((c) => c.realm === '心界');
  const hasProtection = allKeywordsSet.has('守财') || allKeywordsSet.has('守护') || allKeywordsSet.has('斩断') || allKeywordsSet.has('界限');
  const hasLearning = allKeywordsSet.has('学习') || allKeywordsSet.has('智慧') || allKeywordsSet.has('考试') || allKeywordsSet.has('清醒');

  if (hasRelease && hasWealth && hasGrowth && !results.some((r) => r.title.includes('舍旧聚财'))) {
    results.unshift({
      title: '舍旧 ➔ 得财 ➔ 腾升',
      meaning: '过往的心理包袱与旧局正在结束，资源与财力开始沉淀聚拢，进一步催动人生格局向上跨越。',
      effect: 'transformative',
      scoreModifier: 24,
      tags: ['release', 'wealth', 'growth'],
      cards: cards.slice(0, 3),
      cardNames: cards.slice(0, 3).map((c) => c.cardName),
      patternReason: '系统检测到【释怀断舍离】+【财源汇聚】+【生机腾跃】三阶演进链条，形成“先破后立、继而高飞”的顺行势能。',
    });
  } else if (hasHealing && hasRelationship && !results.some((r) => r.title.includes('慈缘') || r.title.includes('良缘'))) {
    results.push({
      title: '慈缘和合 · 疗愈生暖',
      meaning: '关系中的隔阂与创伤得到温润抚平，彼此沟通更加真诚，信任度与默契显著回升。',
      effect: 'positive',
      scoreModifier: 16,
      tags: ['healing', 'relationship'],
      cards: cards.filter((c) => c.realm === '心界'),
      cardNames: cards.filter((c) => c.realm === '心界').map((c) => c.cardName),
      patternReason: '心界牌相与疗愈关键词形成共振，预示情感磁场回暖，适合以柔克刚。',
    });
  } else if (hasWealth && hasProtection && !results.some((r) => r.title.includes('守库') || r.title.includes('守财'))) {
    results.push({
      title: '聚财守成 · 筑牢底盘',
      meaning: '不仅具备创造新收益的敏锐嗅觉，更能设立严密的资产防火墙，杜绝盲目消耗。',
      effect: 'positive',
      scoreModifier: 15,
      tags: ['wealth', 'protection'],
      cards: cards.filter((c) => c.realm === '财界'),
      cardNames: cards.filter((c) => c.realm === '财界').map((c) => c.cardName),
      patternReason: '财星与护守神明呼应，表明当前最有效的生财之道在于“守正防漏、复利积累”。',
    });
  } else if (hasLearning && !results.some((r) => r.title.includes('文运') || r.title.includes('学有所成'))) {
    results.push({
      title: '文星启智 · 识见精进',
      meaning: '思维逻辑与洞察力处于高维活跃期，在学习、备考、创作及专业决策上具备非凡穿透力。',
      effect: 'positive',
      scoreModifier: 16,
      tags: ['learning', 'clarity'],
      cards: cards.filter((c) => c.keywords.includes('智慧') || c.keywords.includes('学习')),
      cardNames: cards.filter((c) => c.keywords.includes('智慧') || c.keywords.includes('学习')).map((c) => c.cardName),
      patternReason: '文星与智慧牌相交织，形成强烈的“专业壁垒提升”气运。',
    });
  }

  // If no combination detected, create contextual fallback triad
  if (results.length === 0 && cards.length >= 2) {
    const c1 = cards[0];
    const c2 = cards[1];
    results.push({
      title: `【${c1.cardName}】与【${c2.cardName}】交泰`,
      meaning: `${c1.cardName}（${c1.archetype}）的${c1.keywords[0]}与${c2.cardName}（${c2.archetype}）的${c2.keywords[0]}相互交织，指引以平衡姿态应对事态进展。`,
      effect: 'neutral',
      scoreModifier: 8,
      tags: ['harmony', 'balance'],
      cards: [c1, c2],
      cardNames: [c1.cardName, c2.cardName],
      patternReason: `两张牌的五行（${c1.elementName} 与 ${c2.elementName}）与阴阳特质形成多维互补，平稳内敛。`,
    });
  }

  return results;
}
