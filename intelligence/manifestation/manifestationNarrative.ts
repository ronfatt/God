import {
  CardManifestationResult,
  OverallManifestationResult,
  QuestionDomain,
  QuestionIntent,
} from '@/types/oracle';

export function generateManifestationNarrative(
  cardResults: CardManifestationResult[],
  overall: OverallManifestationResult,
  domain: QuestionDomain,
  question: string
): string {
  const lines: string[] = [];

  // 1. Overall Spread Manifestation Intro
  lines.push(`【${overall.title}】${overall.subtitle}`);
  lines.push(overall.summary);
  lines.push('');

  // 2. Individual Card Manifestation Breakdown
  lines.push('【牌位显相洞察】');
  cardResults.forEach((res, i) => {
    const statusText =
      res.manifestation === 'light'
        ? '✦ 光相 · 顺势显化'
        : res.manifestation === 'shadow'
        ? '⚠ 影相 · 失衡显化'
        : res.manifestation === 'transformative'
        ? '☯ 转化相 · 破旧转新'
        : '◎ 平相 · 能量未定';

    lines.push(
      `${i + 1}. 【${res.cardName} · ${res.archetype}】（${statusText} / 支持度:${res.supportScore} 考验度:${res.challengeScore}）\n   ${res.mainMeaning}`
    );
  });

  return lines.join('\n');
}
