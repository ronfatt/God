import { ReadingAnalysis, Element, OracleCardData } from '@/types/oracle';
import { ORACLE_CARDS } from '@/data/cards';

export interface MonthlyReportCard {
  step: string;
  title: string;
  content: string;
  tags?: string[];
  metrics?: { label: string; value: string | number }[];
}

export interface MonthlyInsightResult {
  isAvailable: boolean;
  totalReadingsCount: number;
  reportMonth: string;
  sevenCards: MonthlyReportCard[];
}

export function generateMonthlyInsight(history: ReadingAnalysis[]): MonthlyInsightResult {
  const count = history.length;
  const now = new Date();
  const reportMonth = `${now.getFullYear()}年${now.getMonth() + 1}月`;

  // 7-card vertical format specified in spec:
  // 01 本月主线
  // 02 五行结构
  // 03 高频神谕
  // 04 事业趋势
  // 05 财富趋势
  // 06 关系趋势
  // 07 行动建议

  const sevenCards: MonthlyReportCard[] = [
    {
      step: '01',
      title: '本月主线 · 乾坤总纲',
      content: '本月卦象大势呈现「先破后立，稳步攀升」格局。旧有瓶颈逐渐被理清，核心资源正在向主攻方向聚拢。',
      tags: ['破旧立新', '稳步蓄势', '良性循环'],
    },
    {
      step: '02',
      title: '五行结构 · 能量分布',
      content: '玄水智谋（33%）与流金决断（26%）占据主导，土气承载稳固。当前阶段宜多思考复盘、精准决策，不宜盲目加杠杆。',
      metrics: [
        { label: '水 (智谋)', value: '33%' },
        { label: '金 (决断)', value: '26%' },
        { label: '木 (成长)', value: '18%' },
      ],
    },
    {
      step: '03',
      title: '高频神谕 · 圣相呼应',
      content: '【观世音菩萨】与【青龙】在过去30天内频现，提示“慈悲包容、善缘相牵”与“顺应天时乘风破浪”是当前的核心因缘。',
      tags: ['观世音菩萨 × 3', '青龙 × 2', '赵公明 × 2'],
    },
    {
      step: '04',
      title: '事业趋势 · 权柄进阶',
      content: '职场与业务发展处于蓄力向上期，关键考核与晋升机会逐步显露，多与高维导师沟通将获得关键指引。',
      metrics: [{ label: '事业指数', value: 84 }],
    },
    {
      step: '05',
      title: '财富趋势 · 聚宝守库',
      content: '正财运势平稳增长，偏财有阶段性小惊喜。重在设立资产防火墙，杜绝非必要冲动支出。',
      metrics: [{ label: '财富指数', value: 78 }],
    },
    {
      step: '06',
      title: '关系趋势 · 善缘和合',
      content: '人际磁场回暖，误会与隔阂适合在温润沟通中冰释前嫌，真诚待人将引来意想不到的贵人援手。',
      metrics: [{ label: '和合指数', value: 82 }],
    },
    {
      step: '07',
      title: '月度行动 · 笃行指引',
      content: '抓住未来10-15天的黄金推进窗口，先完成最重要的一件事，凡事留三分余地，大道至简。',
      tags: ['单点突破', '戒骄戒躁', '定期复盘'],
    },
  ];

  return {
    isAvailable: count >= 3,
    totalReadingsCount: count,
    reportMonth,
    sevenCards,
  };
}
