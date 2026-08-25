import { Rank } from '@/types/oracle';

export type TimingWindowType = 'immediate' | 'near' | 'medium' | 'long';

export interface TimingWindowConfig {
  type: TimingWindowType;
  label: string;
  daysRange: string;
  description: string;
}

export const TIMING_WINDOWS: Record<TimingWindowType, TimingWindowConfig> = {
  immediate: {
    type: 'immediate',
    label: '即刻萌动',
    daysRange: '未来 1–7 天',
    description: '能量处于初始引动期，适合观察细微征兆与快速反应。',
  },
  near: {
    type: 'near',
    label: '显化窗口',
    daysRange: '未来 7–30 天',
    description: '核心机缘与实质动作显露期，最容易出现关键转折或突破。',
  },
  medium: {
    type: 'medium',
    label: '推进定鼎',
    daysRange: '未来 30–90 天',
    description: '前期布局结出阶段性硕果，局势走向清晰明朗。',
  },
  long: {
    type: 'long',
    label: '长远周转',
    daysRange: '未来 3–6 个月',
    description: '深层命运与长线周期的重构，需要长久耐力与深厚根基。',
  },
};

export const RANK_TIMING_WEIGHTS: Record<Rank, { speed: 'fast' | 'medium' | 'slow'; window: TimingWindowType; phase: string }> = {
  'A': { speed: 'fast', window: 'immediate', phase: '新始启程' },
  '2': { speed: 'fast', window: 'immediate', phase: '初生萌芽' },
  '3': { speed: 'fast', window: 'near', phase: '互动聚势' },
  '4': { speed: 'medium', window: 'near', phase: '根基筑稳' },
  '5': { speed: 'fast', window: 'near', phase: '变动突显' },
  '6': { speed: 'medium', window: 'near', phase: '调整修持' },
  '7': { speed: 'medium', window: 'medium', phase: '深度淬炼' },
  '8': { speed: 'medium', window: 'medium', phase: '成熟蓄力' },
  '9': { speed: 'slow', window: 'medium', phase: '大成在望' },
  '10': { speed: 'slow', window: 'medium', phase: '圆满终局' },
  'J': { speed: 'fast', window: 'immediate', phase: '迅敏先锋' },
  'Q': { speed: 'medium', window: 'near', phase: '温润显化' },
  'K': { speed: 'slow', window: 'long', phase: '定鼎大统' },
};
