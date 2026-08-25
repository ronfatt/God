import { OracleCardData, Element } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';

export interface MonthQuarterAnalysis {
  monthIndex: number;
  monthTitle: string; // "第一个月 · 整理蓄势"
  cards: {
    career: OracleCardData;
    wealth: OracleCardData;
    love: OracleCardData;
    inner: OracleCardData;
  };
  overallMomentum: string;
  focusTheme: string;
  monthlyScore: number;
  actionRoadmap: string[];
}

export interface NinetyDayDestinyMapResult {
  id: string;
  generatedAt: string;
  months: [MonthQuarterAnalysis, MonthQuarterAnalysis, MonthQuarterAnalysis];
  overallTrajectory: string; // "整理 ➔ 回升 ➔ 扩张"
  peakMonthTitle: string;
  adjustmentMonthTitle: string;
  summaryQuote: string;
  totalCards: OracleCardData[];
}

export function generateNinetyDayDestinyMap(selected12Cards: OracleCardData[]): NinetyDayDestinyMapResult {
  const cards = selected12Cards.length >= 12 ? selected12Cards : ORACLE_CARDS.slice(0, 12);

  const parseMonth = (startIndex: number, monthNum: number, defaultTheme: string): MonthQuarterAnalysis => {
    const cCareer = cards[startIndex];
    const cWealth = cards[startIndex + 1];
    const cLove = cards[startIndex + 2];
    const cInner = cards[startIndex + 3];

    const avgScore = Math.round((cCareer.energyLevel + cWealth.energyLevel + cLove.energyLevel + cInner.energyLevel) * 4.8 + 55);

    const monthTitles = ['首月 · 奠基整理', '次月 · 生机破晓', '季末 · 鼎盛显耀'];
    const momentums = ['暂缓蓄势', '低谷回升', '乘势腾飞'];

    const roadmaps = [
      [
        `【事业】${cCareer.upright.split('。')[0]}`,
        `【财务】清理冗余支出，设立资金安全底盘`,
        `【心境】保持从容，向内观照与复盘`,
      ],
      [
        `【事业】主动对外沟通，链接关键贵人`,
        `【财务】关注新兴渠道与正财突破口`,
        `【情感】真诚倾听，化解此前沟通隔阂`,
      ],
      [
        `【事业】果断放大有效业务，确立领军优势`,
        `【财务】收获阶段性成果，做好长线资产沉淀`,
        `【心境】知进知退，保持谦逊与大局观`,
      ],
    ];

    return {
      monthIndex: monthNum,
      monthTitle: monthTitles[monthNum - 1],
      cards: {
        career: cCareer,
        wealth: cWealth,
        love: cLove,
        inner: cInner,
      },
      overallMomentum: momentums[monthNum - 1],
      focusTheme: defaultTheme,
      monthlyScore: Math.min(98, Math.max(65, avgScore)),
      actionRoadmap: roadmaps[monthNum - 1],
    };
  };

  const month1 = parseMonth(0, 1, '旧局整理与底盘防漏');
  const month2 = parseMonth(4, 2, '贵人显现与新机试水');
  const month3 = parseMonth(8, 3, '势能爆发与定鼎成果');

  return {
    id: `map90_${Date.now()}`,
    generatedAt: new Date().toLocaleDateString('zh-CN'),
    months: [month1, month2, month3],
    overallTrajectory: `${month1.overallMomentum} ➔ ${month2.overallMomentum} ➔ ${month3.overallMomentum}`,
    peakMonthTitle: month3.monthTitle,
    adjustmentMonthTitle: month1.monthTitle,
    summaryQuote: '前一个月重在守正修整，中间月份机运破局，第三阶段的事业与财富支持度明显迎来实质跃迁。',
    totalCards: cards.slice(0, 12),
  };
}
