import { OracleCardData, SpreadType, QuestionCategory, ReadingAnalysis } from '@/types/oracle';
import { classifyQuestion, ClassifiedQuestion } from './questionClassifier';
import { buildReadingContext, ReadingContext } from './readingContext';
import { detectCombinations, CombinationResult } from './combinationEngine';
import { analyzeElements, ElementAnalysisResult } from './elementEngine';
import { analyzeYinYang, YinYangAnalysisResult } from './yinYangEngine';
import { analyzeMomentum, MomentumAnalysisResult } from './momentumEngine';
import { analyzeTiming, TimingAnalysisResult } from './timingEngine';
import { calculateScores, ScoreAnalysisResult } from './scoreEngine';
import { buildNarrative, NarrativeResult } from './narrativeBuilder';
import { generateFollowUps, FollowUpOption } from './followUpEngine';

export interface IntelligenceReadingResult extends ReadingAnalysis {
  // Enhanced Intelligence V2 Fields
  questionClassified: ClassifiedQuestion;
  readingContext: ReadingContext;
  momentumAnalysis: MomentumAnalysisResult;
  elementsAnalysis: ElementAnalysisResult;
  yinYangAnalysis: YinYangAnalysisResult;
  combinationsAnalysis: CombinationResult[];
  timingAnalysis: TimingAnalysisResult;
  scoreAnalysis: ScoreAnalysisResult;
  narrativeAnalysis: NarrativeResult;
  followUpOptions: FollowUpOption[];
}

export function runIntelligenceEngine(
  cards: OracleCardData[],
  question: string,
  category: QuestionCategory = 'general',
  spreadType: SpreadType = 'three',
  isClarifier = false,
  parentReadingId?: string
): IntelligenceReadingResult {
  // Step 1: Classify Question
  const questionClassified = classifyQuestion(question, category);

  // Step 2: Build Reading Context with Position Modifiers
  const readingContext = buildReadingContext(
    cards,
    question,
    questionClassified.domain,
    questionClassified.subCategory,
    questionClassified.intent,
    spreadType,
    isClarifier,
    parentReadingId
  );

  // Step 3: Combination Engine & Tag Pattern Matching
  const combinationsAnalysis = detectCombinations(cards);

  // Step 4: Five Elements Engine
  const elementsAnalysis = analyzeElements(cards);

  // Step 5: Yin Yang Engine
  const yinYangAnalysis = analyzeYinYang(cards);

  // Step 6: Momentum Engine (8 core patterns)
  const momentumAnalysis = analyzeMomentum(cards);

  // Step 7: Timing Engine
  const timingAnalysis = analyzeTiming(cards, momentumAnalysis.type);

  // Step 8: Multi-dimensional Score Engine
  const scoreAnalysis = calculateScores(
    cards,
    questionClassified.domain,
    combinationsAnalysis,
    elementsAnalysis,
    momentumAnalysis.type
  );

  // Step 9: Narrative Builder (Grounded Eastern Wisdom Text)
  const narrativeAnalysis = buildNarrative(
    cards,
    questionClassified,
    momentumAnalysis,
    elementsAnalysis,
    yinYangAnalysis,
    combinationsAnalysis,
    timingAnalysis,
    scoreAnalysis
  );

  // Step 10: Follow-up Engine
  const followUpOptions = generateFollowUps(
    questionClassified.domain,
    questionClassified.subCategory,
    questionClassified.intent,
    cards
  );

  // Backward Compatible Mapping to ReadingAnalysis
  const readingId = readingContext.readingId;
  const dateStr = new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' });

  return {
    id: readingId,
    date: dateStr,
    timestamp: Date.now(),
    question: question || '今日神谕·乾坤运势',
    category,
    spreadType,
    cards: cards.map((c, i) => ({
      positionId: `pos_${i}`,
      cardId: c.id,
    })),
    overallScore: scoreAnalysis.overall,
    wealthScore: scoreAnalysis.wealth,
    careerScore: scoreAnalysis.career,
    loveScore: scoreAnalysis.love,
    noblemanScore: scoreAnalysis.noble,
    oracleQuote: narrativeAnalysis.coreTheme.summaryQuote,
    elementTrend: {
      sequence: cards.map((c) => c.elementName),
      interaction: elementsAnalysis.relationship === '五行相生' ? 'generate' : elementsAnalysis.relationship === '能量淬炼' ? 'restrain' : 'harmonious',
      description: elementsAnalysis.relationshipDesc,
    },
    dominantElement: elementsAnalysis.dominant,
    actionAdvices: [
      narrativeAnalysis.actions[0] || '保持从容笃定。',
      narrativeAnalysis.actions[1] || '主动与良师沟通。',
      narrativeAnalysis.actions[2] || '凡事留三分余地。',
    ],
    timeline: {
      near: timingAnalysis.primaryWindow + '：' + timingAnalysis.timingDesc,
      mid: timingAnalysis.secondaryWindow + '：局势逐步清晰明朗。',
      far: '未来3-6个月：长远格局稳固成型。',
    },
    luckyElements: {
      color: elementsAnalysis.dominant === 'water' ? '玄黑水墨 · 苍青蓝' : elementsAnalysis.dominant === 'fire' ? '朱砂红 · 玫瑰金' : elementsAnalysis.dominant === 'wood' ? '天青色 · 翡翠绿' : elementsAnalysis.dominant === 'metal' ? '流金白 · 纯金黄' : '琥珀黄 · 暖檀金',
      direction: elementsAnalysis.dominant === 'water' ? '正北 · 玄冥智水' : elementsAnalysis.dominant === 'fire' ? '正南 · 离火大运' : elementsAnalysis.dominant === 'wood' ? '正东 · 生发之地' : elementsAnalysis.dominant === 'metal' ? '正西 · 聚金收敛' : '中宫 / 西南',
      time: elementsAnalysis.dominant === 'water' ? '21:00 - 23:00' : elementsAnalysis.dominant === 'fire' ? '11:00 - 13:00' : elementsAnalysis.dominant === 'wood' ? '05:00 - 09:00' : elementsAnalysis.dominant === 'metal' ? '15:00 - 19:00' : '13:00 - 15:00',
      element: elementsAnalysis.dominantName,
      number: elementsAnalysis.dominant === 'water' ? 8 : elementsAnalysis.dominant === 'fire' ? 9 : elementsAnalysis.dominant === 'wood' ? 3 : elementsAnalysis.dominant === 'metal' ? 7 : 5,
    },

    // V2 Enhanced Fields
    questionClassified,
    readingContext,
    momentumAnalysis,
    elementsAnalysis,
    yinYangAnalysis,
    combinationsAnalysis,
    timingAnalysis,
    scoreAnalysis,
    narrativeAnalysis,
    followUpOptions,
  };
}

export * from './questionClassifier';
export * from './readingContext';
export * from './combinationEngine';
export * from './elementEngine';
export * from './yinYangEngine';
export * from './momentumEngine';
export * from './timingEngine';
export * from './scoreEngine';
export * from './followUpEngine';
export * from './historyInsightEngine';
export * from './narrativeBuilder';
