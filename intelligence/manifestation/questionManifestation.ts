import { QuestionDomain, QuestionIntent } from '@/types/oracle';

export function calculateQuestionManifestationModifier(
  cardId: string,
  suit: string,
  element: string,
  domain: QuestionDomain,
  intent: QuestionIntent
): { score: number; relevance: number; reason?: string } {
  let score = 0;
  let relevance = 50;
  let reason: string | undefined;

  // Domain specific matching
  if (domain === 'love' || domain === 'relationship') {
    if (suit === 'heart') {
      score += 12;
      relevance += 35;
      reason = '与情感人际主题高度契合 (+12)';
    } else if (cardId === 'C-J' || cardId === 'S-5') {
      // 哪吒、雷公在感情中容易有冲突影相偏向
      score -= 10;
      relevance += 20;
      reason = '急躁争锋之气易在情感关系中加剧矛盾 (-10)';
    } else if (cardId === 'H-2' || cardId === 'H-3' || cardId === 'H-Q') {
      score += 15;
      relevance += 40;
      reason = '正缘和合之神强烈加持情感吉兆 (+15)';
    }
  } else if (domain === 'wealth') {
    if (suit === 'diamond') {
      score += 12;
      relevance += 35;
      reason = '与财帛资粮诉求高度共鸣 (+12)';
    } else if (cardId === 'D-8' || cardId === 'D-A' || cardId === 'D-3' || cardId === 'D-5') {
      score += 15;
      relevance += 40;
      reason = '财神法宝当令主导资金流通 (+15)';
    } else if (suit === 'heart') {
      // 问财抽到大量心界牌：指向人情或关系生财
      score -= 2;
      relevance -= 10;
      reason = '焦点非直接金钱，需由人际合作间接导入 (-2)';
    }
  } else if (domain === 'career' || domain === 'decision') {
    if (suit === 'club') {
      score += 10;
      relevance += 30;
      reason = '与事业功名、开拓成长顺势呼应 (+10)';
    } else if (cardId === 'C-J') {
      // 哪吒在事业创业中是极强行动突破
      score += 12;
      relevance += 35;
      reason = '敢于破旧立新的魄力助力事业破局 (+12)';
    } else if (cardId === 'C-2' || cardId === 'C-9' || cardId === 'C-10') {
      score += 14;
      relevance += 35;
      reason = '青龙文昌大吉之神护佑功名晋升 (+14)';
    }
  } else if (domain === 'life') {
    if (suit === 'spade') {
      score += 8;
      relevance += 25;
      reason = '与因果天命、身心修持深度契合 (+8)';
    }
  }

  // Intent specific tuning
  if (intent === 'obstacle') {
    score -= 6;
    reason = (reason ? reason + ' · ' : '') + '问局阻碍考验偏向 (-6)';
  } else if (intent === 'opportunity') {
    score += 6;
    reason = (reason ? reason + ' · ' : '') + '问局机缘开拓偏向 (+6)';
  }

  return {
    score: Math.max(-20, Math.min(25, score)),
    relevance: Math.max(10, Math.min(100, relevance)),
    reason,
  };
}
