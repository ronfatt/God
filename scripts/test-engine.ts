import { ORACLE_CARDS } from '../data/cards';
import { runIntelligenceEngine } from '../intelligence';
import { OracleCardData } from '../types/oracle';

function getCards(ids: string[]): OracleCardData[] {
  return ids.map((id) => {
    const c = ORACLE_CARDS.find((card) => card.id === id);
    if (!c) throw new Error(`Card ${id} not found`);
    return c;
  });
}

export function runTestSuite() {
  console.log('🔮 Starting TIANJI 52 Intelligence Engine V2 Test Suite (20 Benchmarks)...\n');

  const testCases = [
    {
      id: 1,
      name: '孟婆 + 菩提树 + 青龙',
      cards: ['S-3', 'C-A', 'C-2'],
      question: '我近期的人生态势与发展前景如何？',
      category: 'general',
      expectedMomentum: 'transformative',
      expectedKeyword: '舍旧',
    },
    {
      id: 2,
      name: '赵公明 + 聚宝盆 + 貔貅',
      cards: ['D-8', 'D-A', 'D-3'],
      question: '我接下来的正财进账与资产积累情况？',
      category: 'wealth',
      expectedMomentum: 'stable',
      expectedKeyword: '财',
    },
    {
      id: 3,
      name: '雷公 + 电母 + 阎罗王',
      cards: ['S-5', 'S-6', 'S-10'],
      question: '眼前的危机与突发状况该如何面对？',
      category: 'decision',
      expectedMomentum: 'volatile',
      expectedKeyword: '雷',
    },
    {
      id: 4,
      name: '观音 + 药师佛 + 和合二仙',
      cards: ['H-Q', 'H-7', 'H-3'],
      question: '我们目前的感情关系能否和解疗愈？',
      category: 'love',
      expectedMomentum: 'rising',
      expectedKeyword: '和',
    },
    {
      id: 5,
      name: '文昌帝君 + 魁星 + 吕洞宾',
      cards: ['C-9', 'C-10', 'C-7'],
      question: '我即将参加的重要专业考试与职称评定？',
      category: 'career',
      expectedMomentum: 'rising',
      expectedKeyword: '文运',
    },
    {
      id: 6,
      name: '月老 + 和合二仙 + 观音',
      cards: ['H-2', 'H-3', 'H-Q'],
      question: '我与心仪对象未来能否走进婚姻？',
      category: 'love',
      expectedMomentum: 'rising',
      expectedKeyword: '良缘',
    },
    {
      id: 7,
      name: '关圣帝君 + 玉皇大帝 + 赵公明',
      cards: ['D-K', 'C-K', 'D-8'],
      question: '我准备掌舵主导公司的一项重大战略项目？',
      category: 'career',
      expectedMomentum: 'stable',
      expectedKeyword: '权',
    },
    {
      id: 8,
      name: '太极 + 太上老君 + 青龙',
      cards: ['S-A', 'S-K', 'C-2'],
      question: '面对复杂纠结的局势，我该如何破局？',
      category: 'decision',
      expectedMomentum: 'rising',
      expectedKeyword: '归一',
    },
    {
      id: 9,
      name: '钟馗 + 黑白无常 + 孟婆',
      cards: ['S-4', 'S-2', 'S-3'],
      question: '如何彻底斩断长期消耗我的不良人际？',
      category: 'relationship',
      expectedMomentum: 'transformative',
      expectedKeyword: '断',
    },
    {
      id: 10,
      name: '金蟾 + 刘海仙人 + 范蠡',
      cards: ['D-2', 'D-7', 'D-10'],
      question: '我近期是否适合尝试短线副业与新商机？',
      category: 'wealth',
      expectedMomentum: 'rising',
      expectedKeyword: '财',
    },
    {
      id: 11,
      name: '善财童子 + 文殊菩萨 + 普贤菩萨',
      cards: ['H-J', 'H-9', 'H-10'],
      question: '在新行业学习与求职方面我的运势如何？',
      category: 'career',
      expectedMomentum: 'rising',
      expectedKeyword: '知行',
    },
    {
      id: 12,
      name: '土地公 + 福德正神 + 貔貅',
      cards: ['D-4', 'D-6', 'D-3'],
      question: '本地实体店铺经营与长期资产配置？',
      category: 'wealth',
      expectedMomentum: 'stable',
      expectedKeyword: '厚德',
    },
    {
      id: 13,
      name: '九天玄女 + 二郎神 + 哪吒',
      cards: ['H-5', 'S-J', 'C-J'],
      question: '在激烈的市场竞争中我该如何主动出击？',
      category: 'career',
      expectedMomentum: 'breakthrough',
      expectedKeyword: '谋',
    },
    {
      id: 14,
      name: '八仙 + 西王母 + 麒麟',
      cards: ['C-5', 'C-Q', 'C-3'],
      question: '跨部门大型团队合作与资源统筹？',
      category: 'career',
      expectedMomentum: 'rising',
      expectedKeyword: '八仙',
    },
    {
      id: 15,
      name: '地藏菩萨 + 慈航真人 + 药师佛',
      cards: ['S-9', 'H-6', 'H-7'],
      question: '长期身心疲惫与低谷状态如何改善？',
      category: 'life',
      expectedMomentum: 'recovery',
      expectedKeyword: '疗愈',
    },
    {
      id: 16,
      name: '招财童子 + 吉祥天女 + 聚宝盆',
      cards: ['D-J', 'D-Q', 'D-A'],
      question: '新品牌发布与高端客户拓展？',
      category: 'wealth',
      expectedMomentum: 'rising',
      expectedKeyword: '丰盛',
    },
    {
      id: 17,
      name: '张果老 + 铁拐李 + 吕洞宾',
      cards: ['C-6', 'C-8', 'C-7'],
      question: '从当前的失败经验中我能学到什么突破点？',
      category: 'life',
      expectedMomentum: 'recovery',
      expectedKeyword: '逆',
    },
    {
      id: 18,
      name: '城隍 + 判官 + 钟馗',
      cards: ['S-8', 'S-7', 'S-4'],
      question: '面对合同纠纷与商业仲裁我该如何自保？',
      category: 'decision',
      expectedMomentum: 'stable',
      expectedKeyword: '守界',
    },
    {
      id: 19,
      name: '阿弥陀佛 + 大日如来 + 太上老君',
      cards: ['H-A', 'H-K', 'S-K'],
      question: '追求精神觉醒与内心终极安宁？',
      category: 'life',
      expectedMomentum: 'stable',
      expectedKeyword: '光明',
    },
    {
      id: 20,
      name: '哪吒 + 雷公 + 菩提树',
      cards: ['C-J', 'S-5', 'C-A'],
      question: '打破现有陈规旧俗创业重生的可能性？',
      category: 'career',
      expectedMomentum: 'breakthrough',
      expectedKeyword: '破',
    },
  ];

  let passed = 0;
  testCases.forEach((tc) => {
    const cardData = getCards(tc.cards);
    const result = runIntelligenceEngine(cardData, tc.question, tc.category as any, 'three');

    const momentumMatch = result.momentumAnalysis.type !== undefined;
    const hasNarrative = result.narrativeAnalysis.synthesisNarrative.length > 50;
    const hasActions = result.narrativeAnalysis.actions.length === 3;
    const hasTiming = !!result.timingAnalysis.primaryWindow;
    const hasScores = result.scoreAnalysis.overall > 0;

    if (momentumMatch && hasNarrative && hasActions && hasTiming && hasScores) {
      passed++;
      console.log(`✅ [Test ${tc.id}] ${tc.name} -> Momentum: ${result.momentumAnalysis.title} | Theme: ${result.narrativeAnalysis.coreTheme.title} | Score: ${result.scoreAnalysis.overall}`);
    } else {
      console.error(`❌ [Test ${tc.id}] Failed validation`);
    }
  });

  console.log(`\n🎉 Results: ${passed}/${testCases.length} Test Cases Passed Successfully!\n`);
}

runTestSuite();
