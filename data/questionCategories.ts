import { QuestionDomain, QuestionIntent } from '@/types/oracle';

export interface SubCategoryConfig {
  id: string;
  domain: QuestionDomain;
  name: string;
  keywords: string[];
  defaultIntent: QuestionIntent;
  sampleQuestions: string[];
}

export const QUESTION_SUBCATEGORIES: SubCategoryConfig[] = [
  // 感情细分类 (Love)
  {
    id: 'love_single',
    domain: 'love',
    name: '单身寻缘',
    keywords: ['单身', '脱单', '正缘', '桃花', '何时脱单', '找对象', '恋爱'],
    defaultIntent: 'future',
    sampleQuestions: ['我未来半年内会遇到正缘吗？', '我目前的脱单机运如何？'],
  },
  {
    id: 'love_new_relationship',
    domain: 'love',
    name: '新恋情暧昧',
    keywords: ['暧昧', '新认识', '刚开始', '喜欢他', '喜欢她', '发展可能', '追求'],
    defaultIntent: 'opportunity',
    sampleQuestions: ['我和刚认识的这个人有发展可能吗？', '对方对我是认真的吗？'],
  },
  {
    id: 'love_existing',
    domain: 'love',
    name: '现有伴侣关系',
    keywords: ['伴侣', '交往中', '在一起', '另一半', '感情现状', '关系走向', '相处'],
    defaultIntent: 'outcome',
    sampleQuestions: ['我和伴侣未来的感情走向如何？', '我们目前的感情状态如何进一步提升？'],
  },
  {
    id: 'love_reconciliation',
    domain: 'love',
    name: '复合挽回',
    keywords: ['前任', '复合', '挽回', '还有机会吗', '放不下', '重归于好', '前男友', '前女友'],
    defaultIntent: 'future',
    sampleQuestions: ['我跟前任还有机会复合吗？', '前任现在对我是什么态度？'],
  },
  {
    id: 'love_commitment',
    domain: 'love',
    name: '承诺与长久',
    keywords: ['适合长期发展', '值得托付', '结婚', '定下来', '见父母', '订婚', '承诺'],
    defaultIntent: 'decision',
    sampleQuestions: ['这个人适合长期发展与共度余生吗？', '我们是否适合在近期谈论婚约？'],
  },
  {
    id: 'love_conflict',
    domain: 'love',
    name: '感情矛盾冲突',
    keywords: ['吵架', '冷战', '矛盾', '沟通不畅', '第三者', '怀疑', '争执', '疲惫'],
    defaultIntent: 'obstacle',
    sampleQuestions: ['我们最近冷战该如何破局？', '为什么我们总在同一个问题上争吵？'],
  },

  // 事业细分类 (Career)
  {
    id: 'career_current',
    domain: 'career',
    name: '现有岗位发展',
    keywords: ['目前工作', '公司现状', '工作状态', '岗位前景', '工作发展'],
    defaultIntent: 'outcome',
    sampleQuestions: ['我目前的工作岗位在下半年发展如何？', '在当前公司还能获得突破吗？'],
  },
  {
    id: 'career_promotion',
    domain: 'career',
    name: '升职晋升',
    keywords: ['升职', '提拔', '评级', '晋升', '当主管', '加薪', '职位提升'],
    defaultIntent: 'opportunity',
    sampleQuestions: ['我今年有升职加薪的机会吗？', '领导对我近期的表现如何评价？'],
  },
  {
    id: 'career_resignation',
    domain: 'career',
    name: '跳槽离职决策',
    keywords: ['辞职', '跳槽', '换工作', '离开公司', '离职', '该走吗', '换部门'],
    defaultIntent: 'decision',
    sampleQuestions: ['我现在应该辞职跳槽吗？', '换到新行业对我的长远发展有利吗？'],
  },
  {
    id: 'career_business',
    domain: 'career',
    name: '创业开拓',
    keywords: ['创业', '做生意', '自己干', '开店', '独立做', '副业', '新项目'],
    defaultIntent: 'opportunity',
    sampleQuestions: ['我准备自己创业开公司，前景如何？', '这个新项目现在适合启动吗？'],
  },
  {
    id: 'career_partnership',
    domain: 'career',
    name: '商业合伙与协作',
    keywords: ['合伙', '合作', '搭档', '找合伙人', '签署协议', '团队'],
    defaultIntent: 'decision',
    sampleQuestions: ['这个合伙人值得深度信任与合作吗？', '双方合作的核心利益如何平衡？'],
  },
  {
    id: 'career_competition',
    domain: 'career',
    name: '职场竞争与瓶颈',
    keywords: ['小人', '竞争', '考核', '竞聘', '打压', '排挤', '瓶颈'],
    defaultIntent: 'obstacle',
    sampleQuestions: ['职场竞争中我该如何脱颖而出并防范暗箭？', '如何突破目前的业务停滞期？'],
  },

  // 财富细分类 (Wealth)
  {
    id: 'wealth_income',
    domain: 'wealth',
    name: '正财收入增长',
    keywords: ['正财', '收入', '工资', '进账', '赚更多', '提成', '业务收益'],
    defaultIntent: 'outcome',
    sampleQuestions: ['我近期的收入会有明显增长吗？', '如何提升我的主要赚钱能力？'],
  },
  {
    id: 'wealth_opportunity',
    domain: 'wealth',
    name: '偏财与新财路',
    keywords: ['偏财', '新财路', '商机', '外快', '横财', '意外之财'],
    defaultIntent: 'opportunity',
    sampleQuestions: ['我近期是否有新的偏财与副业机会？', '眼前这个赚钱机会是否靠谱？'],
  },
  {
    id: 'wealth_investment',
    domain: 'wealth',
    name: '投资与资产配置',
    keywords: ['投资', '股票', '买房', '理财', '基金', '资产配置', '加仓', '止损'],
    defaultIntent: 'decision',
    sampleQuestions: ['近期做这项资产投资的风险与趋势如何？', '当前适合买入还是持币观望？'],
  },
  {
    id: 'wealth_debt_loss',
    domain: 'wealth',
    name: '债务与止损漏财',
    keywords: ['亏损', '负债', '债务', '破财', '漏财', '被骗', '还钱', '止损'],
    defaultIntent: 'obstacle',
    sampleQuestions: ['目前的财务窟窿该如何逐步修复与止损？', '如何化解近期的漏财危机？'],
  },

  // 人际与贵人 (Relationship)
  {
    id: 'relation_noble',
    domain: 'relationship',
    name: '贵人提携',
    keywords: ['贵人', '良师', '高人', '提携', '扶持', '引路人'],
    defaultIntent: 'opportunity',
    sampleQuestions: ['我近期是否会遇到改变命运的关键贵人？', '谁会在当前困境中帮我一把？'],
  },
  {
    id: 'relation_conflict',
    domain: 'relationship',
    name: '人际隔阂与是非',
    keywords: ['是非', '口舌', '误会', '朋友翻脸', '小人', '家庭矛盾'],
    defaultIntent: 'obstacle',
    sampleQuestions: ['身边的人际摩擦该如何圆融化解？', '如何识别并远离消耗我的人？'],
  },

  // 综合人生与决策 (Life & Decision)
  {
    id: 'life_general',
    domain: 'life',
    name: '综合天命运势',
    keywords: ['综合', '总运', '运势', '近况', '乾坤', '人生走势', '未来3个月'],
    defaultIntent: 'future',
    sampleQuestions: ['我未来3个月的整体运势走势如何？', '当下最需要注意的生命课题是什么？'],
  },
  {
    id: 'decision_crossroad',
    domain: 'decision',
    name: '人生十字路口',
    keywords: ['该选哪一个', '二选一', '迷茫', '决定', '选择', '何去何从', '十字路口'],
    defaultIntent: 'decision',
    sampleQuestions: ['面对人生的重大分岔路口，我该如何抉择？', '听从内心还是遵循现实规则？'],
  },
];
