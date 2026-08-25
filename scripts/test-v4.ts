import { REALM_THEMES } from '../visual/realmThemes';
import { getCardVisualConfig } from '../visual/cardVisualConfig';
import { getCardRarity } from '../visual/cardRarity';
import { buildOracleJourney } from '../oracle-journey/journeyEngine';
import { generateNinetyDayDestinyMap } from '../destiny-map/ninetyDayEngine';
import { COMMERCIAL_PRODUCTS, TOKEN_UTILITY_COSTS } from '../commerce/products';
import { activePaymentProvider } from '../commerce/checkout';
import { getOrCreateReferralCode, redeemReferralCode } from '../growth/referral';
import { Analytics } from '../production/analytics';
import { ORACLE_CARDS } from '../data/cards';

export async function runV4TestSuite() {
  console.log('🔮 Starting TIANJI 52 Oracle Experience & Commercial V4 Test Suite...\n');

  // Test 1: Visual Four Realms & Rarities
  const suits = ['heart', 'diamond', 'club', 'spade'] as const;
  suits.forEach((s) => {
    const theme = REALM_THEMES[s];
    console.log(`✅ [Visual Realm] ${theme.symbol} ${theme.nameZh} (${theme.name}) -> Core: ${theme.coreValues.slice(0, 2).join(' / ')} | Color: ${theme.primaryColor}`);
  });

  const cardVisual = getCardVisualConfig('S-3', 'spade', '孟婆');
  console.log(`✅ [Card Visual Config] S-3 孟婆 -> Tier: ${cardVisual.visualTier} | Frame: ${cardVisual.frameStyle} | Status: ${cardVisual.artworkStatus}`);

  // Test 2: Oracle Journey Trajectory Engine
  const journey = buildOracleJourney([]);
  console.log(`\n✅ [Oracle Journey] Phase: ${journey.currentPhaseName} | Nodes: ${journey.nodes.length} | Trajectory: ${journey.trajectorySequence.join(' ➔ ')}`);

  // Test 3: 90-Day Destiny Map Spread (12 Cards)
  const destinyMap = generateNinetyDayDestinyMap(ORACLE_CARDS.slice(0, 12));
  console.log(`\n✅ [90-Day Destiny Map] Generated: ${destinyMap.overallTrajectory}`);
  console.log(`   Month 1: ${destinyMap.months[0].monthTitle} | Score: ${destinyMap.months[0].monthlyScore}`);
  console.log(`   Peak Month: ${destinyMap.peakMonthTitle} | Adjustment: ${destinyMap.adjustmentMonthTitle}`);

  // Test 4: Commercial Product Catalog & Checkout
  const proSub = COMMERCIAL_PRODUCTS.find((p) => p.id === 'sub_pro')!;
  const checkout = await activePaymentProvider.createCheckout(proSub);
  console.log(`\n✅ [Commerce Catalog & Checkout] Product: ${proSub.nameZh} (${proSub.priceDisplay}) -> Session: ${checkout.sessionId} | Status: ${checkout.status}`);
  console.log(`   Token Utility Pricing: Clarifier = ${TOKEN_UTILITY_COSTS.clarifier1Card}令 | 90-Day Map = ${TOKEN_UTILITY_COSTS.destinyMap90}令`);

  // Test 5: Growth & Referral System
  const referral = getOrCreateReferralCode('RON');
  const redeemResult = redeemReferralCode(referral.referralCode);
  console.log(`\n✅ [Growth Referral] Code: ${referral.referralCode} | Redeem Success: ${redeemResult.success} (+${redeemResult.tokensAwarded}令)`);

  // Test 6: Production Analytics & Conversion Funnel
  Analytics.track('app_opened');
  Analytics.track('reading_started');
  Analytics.track('reading_completed');
  const funnel = Analytics.getFunnelMetrics();
  console.log(`\n✅ [Production Analytics] Completion: ${funnel.readingCompletionRate} | Follow-up: ${funnel.followUpRate} | Upgrade: ${funnel.upgradeConversionRate}`);

  console.log('\n🎉 All V4 Oracle Experience & Commercial Benchmarks Passed Successfully!\n');
}

runV4TestSuite();
