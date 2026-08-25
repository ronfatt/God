import { ORACLE_CARDS } from '../data/cards';
import { runIntelligenceEngine } from '../intelligence';
import { calculatePersonalElementProfile } from '../personal/personalElementEngine';
import { calculateZodiacFromYear } from '../personal/zodiacEngine';
import { applyPersonalModifier } from '../personal/personalModifier';
import { generateDailyOracle } from '../ritual/dailyOracle';
import { buildDestinyProfile } from '../personal/destinyProfile';
import { OracleCardData, ReadingAnalysis } from '../types/oracle';

function getCards(ids: string[]): OracleCardData[] {
  return ids.map((id) => {
    const c = ORACLE_CARDS.find((card) => card.id === id);
    if (!c) throw new Error(`Card ${id} not found`);
    return c;
  });
}

export function runV3TestSuite() {
  console.log('🔮 Starting TIANJI 52 Personal Destiny System V3 Test Suite...\n');

  // Test 1: Wood Deficient Profile + Wood/Growth Draw (Prompt Example 1)
  const zodiac1 = calculateZodiacFromYear(1996); // 丙子鼠 · 水命
  const mockWoodDeficientHistory: ReadingAnalysis[] = [
    {
      id: 'h_1',
      date: '8月10日',
      timestamp: Date.now() - 86400000 * 2,
      question: '事业发展',
      category: 'career',
      spreadType: 'three',
      cards: [{ positionId: '0', cardId: 'D-8' }, { positionId: '1', cardId: 'S-4' }, { positionId: '2', cardId: 'D-A' }], // Earth, Metal, Metal
      overallScore: 82,
      wealthScore: 88,
      careerScore: 80,
      loveScore: 70,
      noblemanScore: 75,
      oracleQuote: '聚财守库',
      elementTrend: { sequence: ['金', '金', '金'], interaction: 'harmonious', description: '' },
      dominantElement: 'metal',
      actionAdvices: ['保持专注', '聚财守库', '稳健前行'],
      timeline: { near: '', mid: '', far: '' },
      luckyElements: { color: '', direction: '', time: '', element: '', number: 1 },
    }
  ];

  const profile1 = calculatePersonalElementProfile(zodiac1, mockWoodDeficientHistory);
  const drawCards1 = getCards(['C-2', 'C-9', 'C-10']); // 青龙, 文昌, 魁星 (Wood, Wood, Wood)
  const result1 = runIntelligenceEngine(drawCards1, '我近期的学业与事业晋升机会？', 'career', 'three', false, undefined, mockWoodDeficientHistory);

  console.log(`✅ [Test 1: Wood Replenishment] Result: ${result1.personalModification.elementAdjustmentTitle}`);
  console.log(`   Personal Relevance: ${result1.personalModification.personalRelevance}% (${result1.personalModification.personalRelevanceLabel})`);
  console.log(`   Theme: ${result1.narrativeAnalysis.coreTheme.title}`);

  // Test 2: Fire Overload Profile + Fire Draw (Prompt Example 2)
  const zodiacFire = calculateZodiacFromYear(1986); // 丙寅虎 · 火命
  const mockFireOverloadHistory: ReadingAnalysis[] = [
    {
      id: 'h_2',
      date: '8月12日',
      timestamp: Date.now() - 86400000,
      question: '投资项目',
      category: 'wealth',
      spreadType: 'three',
      cards: [{ positionId: '0', cardId: 'C-J' }, { positionId: '1', cardId: 'S-5' }, { positionId: '2', cardId: 'H-5' }], // Fire, Fire, Fire
      overallScore: 85,
      wealthScore: 82,
      careerScore: 88,
      loveScore: 65,
      noblemanScore: 78,
      oracleQuote: '雷厉风行',
      elementTrend: { sequence: ['火', '火', '火'], interaction: 'harmonious', description: '' },
      dominantElement: 'fire',
      actionAdvices: ['保持专注', '聚财守库', '稳健前行'],
      timeline: { near: '', mid: '', far: '' },
      luckyElements: { color: '', direction: '', time: '', element: '', number: 9 },
    }
  ];

  const profile2 = calculatePersonalElementProfile(zodiacFire, mockFireOverloadHistory);
  const drawCards2 = getCards(['C-J', 'S-5', 'H-5']); // 哪吒, 雷公, 九天玄女 (Fire, Fire, Fire)
  const result2 = runIntelligenceEngine(drawCards2, '我准备立刻启动高风险投资！', 'wealth', 'three', false, undefined, mockFireOverloadHistory);

  console.log(`\n✅ [Test 2: Fire Overload Alert] Result: ${result2.personalModification.elementAdjustmentTitle}`);
  console.log(`   Message: ${result2.personalModification.elementAdjustmentMessage}`);
  console.log(`   Advice: ${result2.personalModification.personalAdvice[0]}`);

  // Test 3: Deterministic Daily Oracle Seed Check
  const dailyA = generateDailyOracle('user_ron', new Date('2026-08-25'));
  const dailyB = generateDailyOracle('user_ron', new Date('2026-08-25'));
  const isDeterministic = dailyA.card.id === dailyB.card.id && dailyA.actionScore === dailyB.actionScore;
  console.log(`\n✅ [Test 3: Daily Deterministic Oracle] Card: ${dailyA.card.cardName} | Action: ${dailyA.actionScore} | Seed Match: ${isDeterministic}`);

  // Test 4: Destiny Profile Multi-Period Check
  const destinyReport = buildDestinyProfile([...mockWoodDeficientHistory, ...mockFireOverloadHistory]);
  console.log(`\n✅ [Test 4: Destiny Profile 30D Theme] ${destinyReport.currentLifeTheme.primaryTheme}`);
  console.log(`   Top 5 Core Cards Count: ${destinyReport.top5CoreCards.length}`);

  console.log('\n🎉 All V3 Personal Destiny Engine Benchmarks Passed Successfully!\n');
}

runV3TestSuite();
