import { OracleCardData } from '@/types/oracle';
import { IntelligenceReadingResult } from '@/intelligence';
import { SharePrivacySettings } from './sharePrivacy';

export interface ShareCardData {
  title: string;
  themeTitle: string;
  themeSubtitle: string;
  mainCardsText: string;
  dominantElementName: string;
  actionScore: number;
  overallScore: number;
  questionText?: string;
  nicknameText?: string;
  brandFooter: string;
  closingQuote: string;
  cards: OracleCardData[];
}

export function buildShareCardData(
  reading: IntelligenceReadingResult,
  privacy: SharePrivacySettings,
  nickname = '天机缘主'
): ShareCardData {
  const cards = reading.readingContext.cards;
  const mainCardsText = cards.map((c) => `${c.cardName} (${c.archetype})`).join(' · ');

  return {
    title: '天机52 · 东方神谕',
    themeTitle: reading.narrativeAnalysis.coreTheme.title,
    themeSubtitle: reading.narrativeAnalysis.coreTheme.subtitle,
    mainCardsText,
    dominantElementName: reading.elementsAnalysis.dominantName,
    actionScore: reading.scoreAnalysis.action,
    overallScore: reading.scoreAnalysis.overall,
    questionText: privacy.includeQuestion && !privacy.isPrivateReading ? reading.question : undefined,
    nicknameText: privacy.includeNickname ? nickname : undefined,
    brandFooter: '天机52 · TIANJI 52 EASTERN ORACLE',
    closingQuote: reading.narrativeAnalysis.coreTheme.summaryQuote,
    cards: cards.slice(0, 3),
  };
}
