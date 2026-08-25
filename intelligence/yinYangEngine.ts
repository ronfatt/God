import { OracleCardData } from '@/types/oracle';

export type YinYangState = 'yang_dominant' | 'yin_dominant' | 'balanced';

export interface YinYangAnalysisResult {
  yinCount: number;
  yangCount: number;
  yinPercent: number;
  yangPercent: number;
  state: YinYangState;
  stateLabel: string;
  interpretation: string;
  strategyAdvice: string;
}

export function analyzeYinYang(cards: OracleCardData[]): YinYangAnalysisResult {
  let yinCount = 0;
  let yangCount = 0;

  cards.forEach((c) => {
    if (c.yinYang === 'yang') yangCount++;
    else yinCount++;
  });

  const total = cards.length || 1;
  const yangPercent = Math.round((yangCount / total) * 100);
  const yinPercent = 100 - yangPercent;

  let state: YinYangState = 'balanced';
  let stateLabel = '阴阳平衡 · 调和中道';
  let interpretation = '乾坤相抱，动静相兼，当前时机适合内修底盘、外顺事势。';
  let strategyAdvice = '保持从容步调，既不过度冒进，亦不闭门自守，随缘而动。';

  if (yangPercent >= 65) {
    state = 'yang_dominant';
    stateLabel = '阳势旺盛 · 锐意进取';
    interpretation = '当前格局充盈主动、开拓、执行与决断的刚强能量，外部机缘正在加速显化。';
    strategyAdvice = '顺势果断出击，把握主动权，但须注意戒骄戒躁，兼顾细节防范摩擦。';
  } else if (yinPercent >= 65) {
    state = 'yin_dominant';
    stateLabel = '阴势潜藏 · 涵养蓄力';
    interpretation = '当前牌局更倾向于向内沉淀、深度思考、洞察暗流与等待信息完全清晰。';
    strategyAdvice = '以退为进，多做梳理、疗愈与资源蓄积，切忌在情势不明朗时草率决断。';
  }

  return {
    yinCount,
    yangCount,
    yinPercent,
    yangPercent,
    state,
    stateLabel,
    interpretation,
    strategyAdvice,
  };
}
