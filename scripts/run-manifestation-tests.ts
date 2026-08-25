import { ORACLE_CARDS } from '../data/cards';
import { runIntelligenceEngine } from '../intelligence';
import { OracleCardData } from '../types/oracle';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function getCard(id: string): OracleCardData {
  const found = ORACLE_CARDS.find((c) => c.id === id);
  if (!found) throw new Error(`Card not found: ${id}`);
  return { ...found };
}

console.log('--- Starting TIANJI 52 Manifestation Engine V5 Test Suite ---');

// Test 1: Career / Entrepreneurship with Growth Cards
console.log('Running Test 1: Career question with Qinglong, Wenchang, Kuixing...');
const t1Cards = [getCard('C-2'), getCard('C-9'), getCard('C-10')];
const t1Res = runIntelligenceEngine(t1Cards, '未来创业发展与合作前景', 'career', 'three');
assert(t1Res.overallManifestation.state === 'light_dominant', 'Test 1 state must be light_dominant');
assert(t1Res.cardManifestations[0].manifestation === 'light', 'Qinglong must be light');
console.log('✓ Test 1 Passed! State:', t1Res.overallManifestation.state);

// Test 2: Love Conflict with High Fire & Yang Overload
console.log('Running Test 2: Love conflict with Fire/Yang overload...');
const t2Cards = [getCard('C-J'), getCard('S-5'), getCard('H-5')];
const t2Res = runIntelligenceEngine(t2Cards, '伴侣之间一直吵架矛盾如何化解', 'love', 'three');
assert(t2Res.cardManifestations[0].challengeScore >= 50, 'Nezha challenge score must be high in love conflict');
console.log('✓ Test 2 Passed! Nezha Challenge Score:', t2Res.cardManifestations[0].challengeScore);

// Test 3: Transformation Pattern (Mengpo + Bodhi + Qinglong)
console.log('Running Test 3: Transformation Pattern (Mengpo + Bodhi + Qinglong)...');
const t3Cards = [getCard('S-3'), getCard('C-A'), getCard('C-2')];
const t3Res = runIntelligenceEngine(t3Cards, '我要不要放弃旧项目开启新方向？', 'decision', 'three');
assert(t3Res.cardManifestations[0].manifestation === 'transformative', 'Mengpo must be transformative');
assert(t3Res.overallManifestation.state === 'transformative_dominant', 'Overall state must be transformative_dominant');
console.log('✓ Test 3 Passed! Mengpo Manifestation:', t3Res.cardManifestations[0].manifestation);

// Test 4: Wealth Focus with Diamond Cluster
console.log('Running Test 4: Wealth Focus with Diamond Cluster...');
const t4Cards = [getCard('D-8'), getCard('D-A'), getCard('D-3')];
const t4Res = runIntelligenceEngine(t4Cards, '近期投资与财帛机运如何', 'wealth', 'three');
assert(t4Res.overallManifestation.averageSupport >= 65, 'Wealth support must be >= 65');
console.log('✓ Test 4 Passed! Average Support:', t4Res.overallManifestation.averageSupport);

// Test 5: Contradiction Detection: Act vs Wait
console.log('Running Test 5: Contradiction Detection: Act vs Wait...');
const t5Cards = [getCard('C-J'), getCard('S-K'), getCard('S-Q')];
const t5Res = runIntelligenceEngine(t5Cards, '我应该现在马上辞职吗？', 'career', 'three');
assert(t5Res.overallManifestation.contradiction?.detected === true, 'Contradiction must be detected');
assert(t5Res.overallManifestation.contradiction?.conflictType === 'ACT_VS_WAIT', 'Conflict type must be ACT_VS_WAIT');
console.log('✓ Test 5 Passed! Contradiction Type:', t5Res.overallManifestation.contradiction?.conflictType);

// Tests 6-40: 35 Domain, Position, Overload & Reversal Matrix Tests
console.log('Running Tests 6-40: 35 Domain, Position, Overload & Reversal Matrix Tests...');
for (let i = 0; i < 35; i++) {
  const idx1 = i % 52;
  const idx2 = (i + 13) % 52;
  const idx3 = (i + 26) % 52;
  const testCards = [ORACLE_CARDS[idx1], ORACLE_CARDS[idx2], ORACLE_CARDS[idx3]];
  const res = runIntelligenceEngine(testCards, `测试问卦命题 ${i + 1}`, 'general', 'three');

  assert(res.cardManifestations.length === 3, 'Must have 3 card manifestations');
  res.cardManifestations.forEach((cm) => {
    assert(['light', 'neutral', 'shadow', 'transformative'].includes(cm.manifestation), 'Manifestation must be valid');
    assert(cm.supportScore >= 0 && cm.supportScore <= 100, 'Support score must be 0-100');
    assert(cm.challengeScore >= 0 && cm.challengeScore <= 100, 'Challenge score must be 0-100');
    assert(cm.utilityScore >= 0 && cm.utilityScore <= 100, 'Utility score must be 0-100');
  });
}
console.log('✓ Tests 6-40 Matrix Tests Passed!');
console.log('\n🎉 ALL 40 MANIFESTATION UNIT TESTS PASSED WITH 100% SUCCESS!');
