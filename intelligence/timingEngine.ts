import { OracleCardData } from '@/types/oracle';
import { RANK_TIMING_WEIGHTS, TIMING_WINDOWS, TimingWindowType } from '@/data/timingRules';
import { MomentumType } from '@/data/momentumPatterns';

export interface TimingAnalysisResult {
  primaryWindow: string; // e.g. "未来 7–30 天"
  secondaryWindow: string; // e.g. "未来 30–90 天"
  windowType: TimingWindowType;
  confidence: 'high' | 'medium' | 'low';
  timingDesc: string;
  keyPhases: string[];
}

export function analyzeTiming(cards: OracleCardData[], momentum: MomentumType): TimingAnalysisResult {
  if (cards.length === 0) {
    return {
      primaryWindow: '未来 7–30 天',
      secondaryWindow: '未来 30–90 天',
      windowType: 'near',
      confidence: 'medium',
      timingDesc: '能量处于稳步发展期，近期将逐渐显露关键转折迹象。',
      keyPhases: ['初期萌发', '中期显化', '长远定鼎'],
    };
  }

  // Calculate speed weights
  let fastCount = 0;
  let mediumCount = 0;
  let slowCount = 0;
  const phases: string[] = [];

  cards.forEach((c) => {
    const weight = RANK_TIMING_WEIGHTS[c.rank] || { speed: 'medium', window: 'near', phase: '演进中' };
    if (weight.speed === 'fast') fastCount++;
    else if (weight.speed === 'slow') slowCount++;
    else mediumCount++;
    phases.push(weight.phase);
  });

  let windowType: TimingWindowType = 'near';
  let primaryWindow = TIMING_WINDOWS.near.daysRange;
  let secondaryWindow = TIMING_WINDOWS.medium.daysRange;
  let timingDesc = '未来7–30天为最关键的能量显化窗口，当前变动信号正在逐步清晰。';
  let confidence: 'high' | 'medium' | 'low' = 'medium';

  // Fast action momentum
  if (fastCount >= 2 || momentum === 'breakthrough' || cards.some((c) => c.id === 'S-5' || c.id === 'C-J')) {
    windowType = 'immediate';
    primaryWindow = TIMING_WINDOWS.immediate.daysRange;
    secondaryWindow = TIMING_WINDOWS.near.daysRange;
    timingDesc = '动能极其迅猛，未来1–7天内将出现突发信号或需要快速决断的契机。';
    confidence = 'high';
  } else if (slowCount >= 2 || cards.some((c) => c.rank === 'K') || momentum === 'stable') {
    windowType = 'medium';
    primaryWindow = TIMING_WINDOWS.medium.daysRange;
    secondaryWindow = TIMING_WINDOWS.long.daysRange;
    timingDesc = '局势属于深厚长线格局，需要经过30–90天的持续耕耘方能显现决定性成果。';
    confidence = 'high';
  } else if (momentum === 'transformative') {
    windowType = 'near';
    primaryWindow = '未来 7–30 天';
    secondaryWindow = '未来 30–90 天';
    timingDesc = '前期需要经过一段清理与沉淀，随后7–30天内将迎来破旧立新的关键转机。';
    confidence = 'high';
  }

  return {
    primaryWindow,
    secondaryWindow,
    windowType,
    confidence,
    timingDesc,
    keyPhases: phases.slice(0, 3),
  };
}
