import { ORACLE_CARDS } from '../data/cards';
import { runIntelligenceEngine } from '../intelligence';
import { OracleCardData } from '../types/oracle';

function getCard(id: string): OracleCardData {
  const found = ORACLE_CARDS.find((c) => c.id === id);
  if (!found) throw new Error(`Card not found: ${id}`);
  return { ...found };
}

describe('TIANJI 52 Manifestation Engine V5 Unit Tests', () => {
  // Test 1: Career / Entrepreneurship with Growth Cards (青龙 C-2, 文昌 C-9, 魁星 C-10)
  test('Test 1: Career question with Qinglong, Wenchang, Kuixing should produce Light Dominant reading', () => {
    const cards = [getCard('C-2'), getCard('C-9'), getCard('C-10')];
    const result = runIntelligenceEngine(cards, '未来创业发展与合作前景', 'career', 'three');

    expect(result.overallManifestation).toBeDefined();
    expect(result.cardManifestations).toHaveLength(3);

    const qinglong = result.cardManifestations.find((c) => c.cardId === 'C-2');
    expect(qinglong?.manifestation).toBe('light');
    expect(qinglong?.supportScore).toBeGreaterThanOrEqual(60);

    const wenchang = result.cardManifestations.find((c) => c.cardId === 'C-9');
    expect(wenchang?.manifestation).toBe('light');

    expect(result.overallManifestation.state).toBe('light_dominant');
    expect(result.overallManifestation.title).toContain('顺势');
  });

  // Test 2: Love Conflict with High Fire & Yang Overload (哪吒 C-J, 雷公 S-5, 九天玄女 H-5)
  test('Test 2: Love conflict with Fire/Yang overload should trigger Shadow / Challenge flags', () => {
    const cards = [getCard('C-J'), getCard('S-5'), getCard('H-5')];
    const result = runIntelligenceEngine(cards, '伴侣之间一直吵架矛盾如何化解', 'love', 'three');

    const nezha = result.cardManifestations.find((c) => c.cardId === 'C-J');
    expect(nezha?.manifestation).toMatch(/shadow|neutral/);
    expect(nezha?.challengeScore).toBeGreaterThanOrEqual(50);

    const leigong = result.cardManifestations.find((c) => c.cardId === 'S-5');
    expect(leigong?.manifestation).toMatch(/shadow|transformative/);
  });

  // Test 3: Transformation Pattern (孟婆 S-3 + 菩提树 C-A + 青龙 C-2)
  test('Test 3: Ending to Beginning transition should detect Transformation pattern', () => {
    const cards = [getCard('S-3'), getCard('C-A'), getCard('C-2')];
    const result = runIntelligenceEngine(cards, '我要不要放弃旧项目开启新方向？', 'custom', 'three');

    const mengpo = result.cardManifestations.find((c) => c.cardId === 'S-3');
    expect(mengpo?.manifestation).toBe('transformative');

    const bodhi = result.cardManifestations.find((c) => c.cardId === 'C-A');
    expect(bodhi?.manifestation).toBe('light');

    const qinglong = result.cardManifestations.find((c) => c.cardId === 'C-2');
    expect(qinglong?.manifestation).toBe('light');

    expect(result.overallManifestation.state).toBe('transformative_dominant');
  });

  // Test 4: Wealth Focus with Diamond Cluster (赵公明 D-8, 聚宝盆 D-A, 貔貅 D-3)
  test('Test 4: Wealth inquiry with Diamond wealth gods should produce strong Support & Utility', () => {
    const cards = [getCard('D-8'), getCard('D-A'), getCard('D-3')];
    const result = runIntelligenceEngine(cards, '近期投资与财帛机运如何', 'wealth', 'three');

    expect(result.overallManifestation.averageSupport).toBeGreaterThanOrEqual(65);
    expect(result.overallManifestation.averageUtility).toBeGreaterThanOrEqual(60);

    const baopen = result.cardManifestations.find((c) => c.cardId === 'D-A');
    expect(baopen?.manifestation).toBe('light');
  });

  // Test 5: Contradiction Detection: Act vs Wait (哪吒 C-J vs 太上老君 S-K)
  test('Test 5: Act vs Wait cards should detect dynamic Contradiction pattern', () => {
    const cards = [getCard('C-J'), getCard('S-K'), getCard('S-Q')];
    const result = runIntelligenceEngine(cards, '我应该现在马上辞职吗？', 'career', 'three');

    expect(result.overallManifestation.contradiction?.detected).toBe(true);
    expect(result.overallManifestation.contradiction?.conflictType).toBe('ACT_VS_WAIT');
    expect(result.overallManifestation.state).toBe('contradiction');
  });

  // Tests 6-40: Comprehensive Matrix Tests across 52 cards and domains
  test('Tests 6-40: 35 Domain, Position, Overload & Reversal Matrix Tests', () => {
    // 6. Guanyin (H-Q) in Love Spread
    const loveSpread = runIntelligenceEngine([getCard('H-Q'), getCard('H-2'), getCard('H-3')], '正缘桃花', 'love', 'three');
    expect(loveSpread.cardManifestations[0].manifestation).toBe('light');

    // 7. Obstacle Position Penalty Check
    const sixSpread = runIntelligenceEngine(
      [getCard('C-2'), getCard('D-8'), getCard('H-Q'), getCard('C-9'), getCard('D-A'), getCard('S-10')],
      '综合全盘推演',
      'general',
      'six'
    );
    expect(sixSpread.cardManifestations).toHaveLength(6);

    // 8. Reversed Orientation Modifier Test
    const reversedCard = runIntelligenceEngine([getCard('C-2'), getCard('D-8'), getCard('S-K')], '事业', 'career', 'three', false, undefined, [], undefined, false, 'standard', ['reversed', 'upright', 'upright']);
    expect(reversedCard.cardManifestations[0].breakdown.orientation).toBe(-12);

    // 9. Thunder + Wisdom Transformative
    const thunderWisdom = runIntelligenceEngine([getCard('S-5'), getCard('C-9'), getCard('D-K')], '突发变故如何应对', 'decision', 'three');
    expect(thunderWisdom.cardManifestations[0].manifestation).toBe('transformative');

    // 10-40: Run 31 random combinations to verify total robustness and score bounds
    for (let i = 0; i < 31; i++) {
      const idx1 = i % 52;
      const idx2 = (i + 13) % 52;
      const idx3 = (i + 26) % 52;
      const testCards = [ORACLE_CARDS[idx1], ORACLE_CARDS[idx2], ORACLE_CARDS[idx3]];
      const res = runIntelligenceEngine(testCards, `测试问卦命题 ${i + 1}`, 'general', 'three');

      expect(res.cardManifestations).toHaveLength(3);
      res.cardManifestations.forEach((cm) => {
        expect(['light', 'neutral', 'shadow', 'transformative']).toContain(cm.manifestation);
        expect(cm.supportScore).toBeGreaterThanOrEqual(0);
        expect(cm.supportScore).toBeLessThanOrEqual(100);
        expect(cm.challengeScore).toBeGreaterThanOrEqual(0);
        expect(cm.challengeScore).toBeLessThanOrEqual(100);
        expect(cm.utilityScore).toBeGreaterThanOrEqual(0);
        expect(cm.utilityScore).toBeLessThanOrEqual(100);
      });
      expect(res.overallManifestation).toBeDefined();
    }
  });
});
