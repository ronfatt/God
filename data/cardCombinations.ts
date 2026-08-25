import { QuestionDomain } from '@/types/oracle';

export interface CardCombination {
  cards: string[]; // Match by id or archetype/cardName
  type: 'pair' | 'triple';
  domains?: QuestionDomain[];
  title: string;
  meaning: string;
  effect: 'positive' | 'challenging' | 'transformative' | 'neutral';
  scoreModifier: number;
  tags: string[];
}

export const CARD_COMBINATIONS: CardCombination[] = [
  // =========================================================
  // 1. 核心精选组合 (Core Key Combinations from Spec)
  // =========================================================
  {
    cards: ['S-3', 'C-A'], // 孟婆 + 菩提树
    type: 'pair',
    title: '旧尽新生',
    meaning: '旧有情绪、关系或过时模式结束之后，真正的新生机会开始萌芽。',
    effect: 'transformative',
    scoreModifier: 15,
    tags: ['release', 'restart', 'new-cycle', 'growth'],
  },
  {
    cards: ['S-3', 'H-2'], // 孟婆 + 月老
    type: 'pair',
    domains: ['love', 'relationship'],
    title: '旧缘未清',
    meaning: '新的关系机会可能正在靠近，但过去未解的情感包袱仍在暗中牵绊当下。',
    effect: 'challenging',
    scoreModifier: -5,
    tags: ['release', 'relationship', 'obstacle'],
  },
  {
    cards: ['H-2', 'H-Q'], // 月老 + 观音
    type: 'pair',
    domains: ['love', 'relationship'],
    title: '慈缘相牵',
    meaning: '关系迎来深层理解与滋养，非常适合冰释前嫌、建立互信与长久承诺。',
    effect: 'positive',
    scoreModifier: 18,
    tags: ['relationship', 'healing', 'noble'],
  },
  {
    cards: ['H-2', 'H-3'], // 月老 + 和合二仙
    type: 'pair',
    domains: ['love', 'relationship'],
    title: '良缘和合',
    meaning: '人际或伴侣互动大幅增强，双方心意相通，极易达成高度共识。',
    effect: 'positive',
    scoreModifier: 16,
    tags: ['relationship', 'agreement', 'harmony'],
  },
  {
    cards: ['D-8', 'C-2'], // 赵公明 + 青龙
    type: 'pair',
    domains: ['career', 'wealth'],
    title: '财势腾升',
    meaning: '东方生机与威严正财双双显化，事业平台扩张与收益爆发同步到来。',
    effect: 'positive',
    scoreModifier: 20,
    tags: ['wealth', 'growth', 'authority', 'opportunity'],
  },
  {
    cards: ['D-8', 'D-A'], // 赵公明 + 聚宝盆
    type: 'pair',
    domains: ['wealth'],
    title: '聚财成库',
    meaning: '强大的进账渠道与稳定的资产沉淀同时出现，现金流与财库皆极大充盈。',
    effect: 'positive',
    scoreModifier: 22,
    tags: ['wealth', 'accumulation', 'stability'],
  },
  {
    cards: ['D-A', 'D-3'], // 聚宝盆 + 貔貅
    type: 'pair',
    domains: ['wealth'],
    title: '开源守库',
    meaning: '不仅财源广进，更有强力守财护城河，防漏堵损，财富复利稳固。',
    effect: 'positive',
    scoreModifier: 18,
    tags: ['wealth', 'protection', 'stability'],
  },
  {
    cards: ['D-2', 'D-7'], // 金蟾 + 刘海仙人
    type: 'pair',
    domains: ['wealth'],
    title: '流财活跃',
    meaning: '短线财机与偏财极其活跃，机敏变通可获丰厚收益，但须见好就收。',
    effect: 'neutral',
    scoreModifier: 10,
    tags: ['wealth', 'flexibility', 'movement'],
  },
  {
    cards: ['C-9', 'C-10'], // 文昌帝君 + 魁星
    type: 'pair',
    domains: ['career', 'life'],
    title: '文运登科',
    meaning: '考运亨通，文才飞扬，在考核、晋升、竞聘或专业评审中独占鳌头。',
    effect: 'positive',
    scoreModifier: 20,
    tags: ['learning', 'recognition', 'success'],
  },
  {
    cards: ['C-9', 'C-7'], // 文昌帝君 + 吕洞宾
    type: 'pair',
    domains: ['career', 'life'],
    title: '学有所成',
    meaning: '通过名师指点、专业升级或技能深造，实现能力与维度的关键突破。',
    effect: 'positive',
    scoreModifier: 16,
    tags: ['learning', 'clarity', 'growth'],
  },
  {
    cards: ['H-5', 'S-J'], // 九天玄女 + 二郎神
    type: 'pair',
    domains: ['career', 'decision'],
    title: '谋定看真',
    meaning: '天眼破妄洞察事实真相，配合高维兵法策略，破除迷局一击必中。',
    effect: 'positive',
    scoreModifier: 17,
    tags: ['strategy', 'clarity', 'decision'],
  },
  {
    cards: ['S-4', 'D-3'], // 钟馗 + 貔貅
    type: 'pair',
    domains: ['wealth', 'career'],
    title: '止漏守财',
    meaning: '强力清除小人算计与不良财务漏洞，驱除耗损，财富状态迎来根本改善。',
    effect: 'positive',
    scoreModifier: 14,
    tags: ['protection', 'wealth', 'stability'],
  },
  {
    cards: ['S-4', 'S-2'], // 钟馗 + 黑白无常
    type: 'pair',
    title: '断旧清局',
    meaning: '果断斩断无谓纠缠与消耗，旧有负面因果彻底清算，重获清朗自由。',
    effect: 'transformative',
    scoreModifier: 12,
    tags: ['release', 'ending', 'protection'],
  },
  {
    cards: ['S-5', 'S-10'], // 雷公 + 阎罗王
    type: 'pair',
    title: '雷断旧局',
    meaning: '突发外部震荡或决定性事件加速了长期拖延的终结，虽激烈却能定下乾坤。',
    effect: 'challenging',
    scoreModifier: 5,
    tags: ['change', 'ending', 'decision'],
  },
  {
    cards: ['S-5', 'C-A'], // 雷公 + 菩提树
    type: 'pair',
    title: '破后新生',
    meaning: '雷霆震荡打破了僵化局面，反而为深层觉醒与全新方向开辟了道路。',
    effect: 'transformative',
    scoreModifier: 15,
    tags: ['change', 'beginning', 'growth'],
  },
  {
    cards: ['S-9', 'C-A'], // 地藏 + 菩提树
    type: 'pair',
    title: '暗尽生芽',
    meaning: '最艰难的深谷阶段已经走过，深厚的愿力与沉淀化为蓬勃向上的新芽。',
    effect: 'transformative',
    scoreModifier: 18,
    tags: ['healing', 'beginning', 'growth'],
  },
  {
    cards: ['S-A', 'S-K'], // 太极 + 太上老君
    type: 'pair',
    title: '万法归一',
    meaning: '看透万物纷乱的本质，以无为胜有为，复杂局势回归最简明的中道。',
    effect: 'positive',
    scoreModifier: 20,
    tags: ['clarity', 'wisdom', 'balance'],
  },
  {
    cards: ['S-A', 'C-2'], // 太极 + 青龙
    type: 'pair',
    title: '转势上升',
    meaning: '天地大运正在发生决定性转折，顺应天时乘风而起，运势一路走高。',
    effect: 'positive',
    scoreModifier: 19,
    tags: ['change', 'growth', 'opportunity'],
  },
  {
    cards: ['H-Q', 'H-7'], // 观音 + 药师佛
    type: 'pair',
    domains: ['love', 'life'],
    title: '深层疗愈',
    meaning: '身心创伤、人际内耗与长期压力得到甘露琉璃般的深度净化与抚平。',
    effect: 'positive',
    scoreModifier: 18,
    tags: ['healing', 'peace', 'recovery'],
  },
  {
    cards: ['D-K', 'D-8'], // 关帝 + 赵公明
    type: 'pair',
    domains: ['career', 'wealth'],
    title: '权财并进',
    meaning: '行业威信、正义号召力与巨额商业资源同聚一身，立鼎江山。',
    effect: 'positive',
    scoreModifier: 22,
    tags: ['authority', 'wealth', 'leadership'],
  },

  // =========================================================
  // 2. 情感与人际命域组合 (Love & Relationships)
  // =========================================================
  {
    cards: ['H-A', 'H-Q'], // 阿弥陀佛 + 观音
    type: 'pair',
    domains: ['love', 'life'],
    title: '大圆满之境',
    meaning: '内心澄澈安定，爱与宽容充满心扉，所有旧怨皆化作慈悲福德。',
    effect: 'positive',
    scoreModifier: 20,
    tags: ['healing', 'peace', 'love'],
  },
  {
    cards: ['H-4', 'H-10'], // 注生娘娘 + 普贤菩萨
    type: 'pair',
    domains: ['love'],
    title: '家道兴盛',
    meaning: '家庭规划落实为具体长远承诺，家庭成员同心同德，稳固安泰。',
    effect: 'positive',
    scoreModifier: 16,
    tags: ['family', 'commitment', 'stability'],
  },
  {
    cards: ['H-3', 'H-6'], // 和合二仙 + 慈航真人
    type: 'pair',
    domains: ['love', 'relationship'],
    title: '冰释前嫌',
    meaning: '温柔且有底线的倾听打破冷战僵局，彼此重新找回温情与信任。',
    effect: 'positive',
    scoreModifier: 16,
    tags: ['harmony', 'healing', 'relationship'],
  },
  {
    cards: ['H-5', 'H-9'], // 九天玄女 + 文殊菩萨
    type: 'pair',
    domains: ['love', 'decision'],
    title: '智驭情关',
    meaning: '在亲密关系中保持清醒觉察与高情商，不被情绪裹挟，立于不败之地。',
    effect: 'positive',
    scoreModifier: 15,
    tags: ['wisdom', 'clarity', 'strategy'],
  },
  {
    cards: ['H-8', 'C-4'], // 妈祖 + 仙鹤
    type: 'pair',
    domains: ['love', 'relationship'],
    title: '远方佳音',
    meaning: '异地恋情、远方故友或跨地域合作迎来令人欣慰的安稳与进展。',
    effect: 'positive',
    scoreModifier: 14,
    tags: ['movement', 'protection', 'peace'],
  },
  {
    cards: ['H-J', 'H-2'], // 善财童子 + 月老
    type: 'pair',
    domains: ['love'],
    title: '初遇悸动',
    meaning: '充满青春活力与新鲜感的浪漫机缘出现，彼此吸引，探索未知。',
    effect: 'positive',
    scoreModifier: 15,
    tags: ['beginning', 'relationship', 'joy'],
  },
  {
    cards: ['H-K', 'D-Q'], // 大日如来 + 吉祥天女
    type: 'pair',
    domains: ['love', 'wealth'],
    title: '神仙眷侣',
    meaning: '物质富足与精神共鸣兼具的高维伴侣格局，相互成就，福泽绵长。',
    effect: 'positive',
    scoreModifier: 22,
    tags: ['wealth', 'love', 'success'],
  },

  // =========================================================
  // 3. 财富与商业命域组合 (Wealth & Commerce)
  // =========================================================
  {
    cards: ['D-A', 'D-5'], // 聚宝盆 + 五路财神
    type: 'pair',
    domains: ['wealth'],
    title: '五方纳宝',
    meaning: '多条业务渠道与资产沉淀同步爆发，四方财源通达无碍。',
    effect: 'positive',
    scoreModifier: 20,
    tags: ['wealth', 'growth', 'opportunity'],
  },
  {
    cards: ['D-4', 'D-6'], // 土地公 + 福德正神
    type: 'pair',
    domains: ['wealth', 'career'],
    title: '厚德载福',
    meaning: '深耕本土与主业信誉，厚道经营带来长期稳定的现金流与口碑反哺。',
    effect: 'positive',
    scoreModifier: 15,
    tags: ['stability', 'trust', 'wealth'],
  },
  {
    cards: ['D-10', 'D-9'], // 范蠡 + 比干
    type: 'pair',
    domains: ['wealth', 'career'],
    title: '商道宗范',
    meaning: '商业周期进退自如，兼具清正原则与严谨审计，基业长青。',
    effect: 'positive',
    scoreModifier: 18,
    tags: ['strategy', 'clarity', 'wealth'],
  },
  {
    cards: ['D-J', 'D-2'], // 招财童子 + 金蟾
    type: 'pair',
    domains: ['wealth'],
    title: '喜迎新财',
    meaning: '新订单、小兼职或意外红包接二连三，资金流动性显著改善。',
    effect: 'positive',
    scoreModifier: 14,
    tags: ['wealth', 'opportunity', 'joy'],
  },
  {
    cards: ['D-K', 'C-K'], // 关圣帝君 + 玉皇大帝
    type: 'pair',
    domains: ['career', 'decision'],
    title: '至尊定局',
    meaning: '行业最高治理权威与忠义信誉兼具，建立不可撼动的庞大商业秩序。',
    effect: 'positive',
    scoreModifier: 24,
    tags: ['authority', 'leadership', 'success'],
  },
  {
    cards: ['D-7', 'C-5'], // 刘海仙人 + 八仙
    type: 'pair',
    domains: ['wealth', 'career'],
    title: '八方巧取',
    meaning: '跨界资源整合与灵巧变通带来出人意料的商机变现。',
    effect: 'positive',
    scoreModifier: 15,
    tags: ['flexibility', 'team', 'opportunity'],
  },

  // =========================================================
  // 4. 生长、学业与事业晋升组合 (Growth & Career)
  // =========================================================
  {
    cards: ['C-A', 'C-2'], // 菩提树 + 青龙
    type: 'pair',
    domains: ['career', 'life'],
    title: '龙破初晓',
    meaning: '高远愿景在扎实根基中破土而出，顺应天时扶摇直上九万里。',
    effect: 'positive',
    scoreModifier: 20,
    tags: ['beginning', 'growth', 'opportunity'],
  },
  {
    cards: ['C-3', 'C-Q'], // 麒麟 + 西王母
    type: 'pair',
    domains: ['career', 'life'],
    title: '祥瑞成林',
    meaning: '仁厚德行引动顶级平台与核心资源倾斜，桃李满天下，成果丰硕。',
    effect: 'positive',
    scoreModifier: 18,
    tags: ['noble', 'growth', 'recognition'],
  },
  {
    cards: ['C-5', 'C-J'], // 八仙 + 哪吒
    type: 'pair',
    domains: ['career'],
    title: '先锋破阵',
    meaning: '团队协同与敢打敢拼的破局锐气相结合，迅速攻下行业坚固壁垒。',
    effect: 'positive',
    scoreModifier: 17,
    tags: ['action', 'breakthrough', 'team'],
  },
  {
    cards: ['C-6', 'C-8'], // 张果老 + 铁拐李
    type: 'pair',
    domains: ['career', 'decision'],
    title: '逆旅化境',
    meaning: '从看似不利的缺陷与挫折中逆向破局，提炼出不可替代的核心壁垒。',
    effect: 'transformative',
    scoreModifier: 15,
    tags: ['wisdom', 'recovery', 'strategy'],
  },
  {
    cards: ['C-7', 'S-J'], // 吕洞宾 + 二郎神
    type: 'pair',
    domains: ['career', 'decision'],
    title: '慧剑诛妄',
    meaning: '天眼洞悉伪装，利剑斩断所有虚妄与低效，以雷厉风行之姿确立权威。',
    effect: 'positive',
    scoreModifier: 18,
    tags: ['clarity', 'decision', 'action'],
  },

  // =========================================================
  // 5. 玄界、因果转化与觉醒突破组合 (Destiny & Transcendence)
  // =========================================================
  {
    cards: ['S-A', 'S-Q'], // 太极 + 斗姆元君
    type: 'pair',
    domains: ['life'],
    title: '乾坤回天',
    meaning: '众星拱照化解凶煞，宿命维度的深层转运节点到来，顺应天道大吉。',
    effect: 'positive',
    scoreModifier: 22,
    tags: ['destiny', 'protection', 'peace'],
  },
  {
    cards: ['S-2', 'S-3'], // 黑白无常 + 孟婆
    type: 'pair',
    title: '彻底释怀',
    meaning: '旧阶段与旧因果已成过往云烟，彻底放下不再回头，心灵迎来新生。',
    effect: 'transformative',
    scoreModifier: 10,
    tags: ['ending', 'release', 'transformation'],
  },
  {
    cards: ['S-6', 'S-J'], // 电母 + 二郎神
    type: 'pair',
    domains: ['decision', 'career'],
    title: '烛幽天眼',
    meaning: '直觉闪现与事实证据高度吻合，一切隐藏细节大白于天下。',
    effect: 'positive',
    scoreModifier: 16,
    tags: ['clarity', 'truth', 'wisdom'],
  },
  {
    cards: ['S-7', 'S-8'], // 判官 + 城隍
    type: 'pair',
    domains: ['career', 'decision'],
    title: '公道昭然',
    meaning: '严守法律、契约与流程边界，在仲裁与考核中收获绝对公正的支持。',
    effect: 'positive',
    scoreModifier: 14,
    tags: ['justice', 'protection', 'rules'],
  },
  {
    cards: ['S-9', 'H-6'], // 地藏菩萨 + 慈航真人
    type: 'pair',
    domains: ['life', 'love'],
    title: '苦尽甘来',
    meaning: '历经沧桑之后获得最深沉的抚平与救拔，慈光普照，化险为夷。',
    effect: 'transformative',
    scoreModifier: 17,
    tags: ['healing', 'noble', 'recovery'],
  },

  // =========================================================
  // 6. 三牌超级连环故事组合 (Triple Combinations)
  // =========================================================
  {
    cards: ['S-3', 'D-A', 'C-2'], // 孟婆 + 聚宝盆 + 青龙
    type: 'triple',
    title: '舍旧聚财 · 运势腾升',
    meaning: '过去的包袱彻底终结，资源与资金迅速聚拢，并强力推动人生进入腾飞上升周期。',
    effect: 'transformative',
    scoreModifier: 28,
    tags: ['release', 'wealth', 'growth', 'super-triad'],
  },
  {
    cards: ['S-4', 'S-J', 'D-8'], // 钟馗 + 二郎神 + 赵公明
    type: 'triple',
    domains: ['career', 'wealth'],
    title: '除障看真 · 权财并揽',
    meaning: '以雷霆之势扫除暗中小人，洞察核心商业脉络，正财大单稳稳落袋。',
    effect: 'positive',
    scoreModifier: 26,
    tags: ['protection', 'clarity', 'wealth'],
  },
  {
    cards: ['H-2', 'H-3', 'H-Q'], // 月老 + 和合二仙 + 观音
    type: 'triple',
    domains: ['love', 'relationship'],
    title: '天赐良缘 · 三世修和',
    meaning: '红线相牵、心意相合并伴随至深慈悲包容，情感走向最圆满的终身归宿。',
    effect: 'positive',
    scoreModifier: 28,
    tags: ['relationship', 'harmony', 'healing'],
  },
  {
    cards: ['C-9', 'C-10', 'C-K'], // 文昌 + 魁星 + 玉帝
    type: 'triple',
    domains: ['career'],
    title: '魁首登极 · 统御四方',
    meaning: '文曲星照、独占鳌头并最终登上最高决策岗位，名动天下。',
    effect: 'positive',
    scoreModifier: 30,
    tags: ['learning', 'recognition', 'authority'],
  },
  {
    cards: ['D-A', 'D-3', 'D-K'], // 聚宝盆 + 貔貅 + 关帝
    type: 'triple',
    domains: ['wealth'],
    title: '聚守鼎立 · 财尊万代',
    meaning: '进财丰足、守库无漏并拥有无可撼动的诚信声望，财富基业坚不可摧。',
    effect: 'positive',
    scoreModifier: 28,
    tags: ['wealth', 'protection', 'authority'],
  },
  {
    cards: ['S-5', 'S-3', 'C-A'], // 雷公 + 孟婆 + 菩提树
    type: 'triple',
    title: '雷动释怀 · 灵根涅槃',
    meaning: '突发剧变虽打破幻想，却促成了对过去的彻底告别，迎来生命的崭新蜕变。',
    effect: 'transformative',
    scoreModifier: 22,
    tags: ['change', 'release', 'beginning'],
  },
  {
    cards: ['H-7', 'H-Q', 'H-A'], // 药师佛 + 观音 + 阿弥陀佛
    type: 'triple',
    domains: ['life', 'love'],
    title: '三佛光照 · 身心大净',
    meaning: '身心创伤尽皆化解，获得无量安宁与福佑，重获纯净生命力。',
    effect: 'positive',
    scoreModifier: 27,
    tags: ['healing', 'peace', 'spiritual'],
  },
  {
    cards: ['D-7', 'D-10', 'D-8'], // 刘海 + 范蠡 + 赵公明
    type: 'triple',
    domains: ['wealth'],
    title: '商道大成 · 财通天地',
    meaning: '兼具灵动机变、周期进退大智慧与正财掌控力，商界纵横无往不利。',
    effect: 'positive',
    scoreModifier: 27,
    tags: ['wealth', 'strategy', 'flexibility'],
  },
  {
    cards: ['S-A', 'C-2', 'D-K'], // 太极 + 青龙 + 关帝
    type: 'triple',
    domains: ['career', 'life'],
    title: '乾坤定势 · 威震八荒',
    meaning: '天道周转迎来顺风期，乘势腾飞并确立领军地位，事业大成。',
    effect: 'positive',
    scoreModifier: 29,
    tags: ['destiny', 'growth', 'authority'],
  },
];
