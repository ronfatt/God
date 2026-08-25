import { OracleCardData, SpreadType, QuestionCategory } from '@/types/oracle';
import { runIntelligenceEngine, IntelligenceReadingResult } from '@/intelligence';
import { ORACLE_CARDS } from '@/data/cards';

export function analyzeCards(
  drawnCards: OracleCardData[],
  question: string,
  category: QuestionCategory = 'general',
  spreadType: SpreadType = 'three',
  isClarifier = false,
  parentReadingId?: string
): IntelligenceReadingResult {
  return runIntelligenceEngine(drawnCards, question, category, spreadType, isClarifier, parentReadingId);
}

export function getCardById(id: string): OracleCardData | undefined {
  return ORACLE_CARDS.find((c) => c.id === id);
}
