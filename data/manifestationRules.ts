import { QuestionDomain, SpreadType } from '@/types/oracle';

export interface ManifestationRuleConfig {
  scoreThresholds: {
    lightMin: number; // 31
    neutralMin: number; // -30
    neutralMax: number; // 30
    shadowMax: number; // -31
  };
  orientationModifier: {
    upright: number; // +8
    reversed: number; // -12
  };
  elementRelationships: {
    generatedByPrevious: number; // +8
    continuousGenerationBonus: number; // +10
    controlledByPrevious: number; // -10
    overloadThreshold: number; // 65%
    dominantThreshold: number; // 50%
    overloadPenalty: number; // -12
    yangOverloadPenalty: number; // -8
    yinOverloadPenalty: number; // -8
  };
  positionModifiers: Record<string, number>;
  obstaclePenaltyBias: number; // -15
}

export const MANIFESTATION_RULES: ManifestationRuleConfig = {
  scoreThresholds: {
    lightMin: 31,
    neutralMin: -30,
    neutralMax: 30,
    shadowMax: -31,
  },
  orientationModifier: {
    upright: 8,
    reversed: -12,
  },
  elementRelationships: {
    generatedByPrevious: 8,
    continuousGenerationBonus: 10,
    controlledByPrevious: -10,
    overloadThreshold: 0.65,
    dominantThreshold: 0.50,
    overloadPenalty: -12,
    yangOverloadPenalty: -8,
    yinOverloadPenalty: -8,
  },
  positionModifiers: {
    wealth: 12,
    career: 10,
    love: 12,
    nobleman: 10,
    self: 8,
    sky: 6,
    man: 8,
    earth: 10,
    'pos-1': 10, // 财富宫
    'pos-2': 8,  // 天命宫
    'pos-3': 10, // 事业宫
    'pos-4': 10, // 贵人宫
    'pos-5': 12, // 中宫
    'pos-6': -12,// 阻碍宫
    'pos-7': 10, // 感情宫
    'pos-8': 10, // 转机宫
    'pos-9': 10, // 未来宫
  },
  obstaclePenaltyBias: -15,
};

// 52 张牌默认初始分 (-10 ~ +10) 与不变核心本质
export const CARD_CORE_NATURE_MAP: Record<string, { nature: string[]; baseScore: number }> = {
  // Heart ♥ 心界
  'H-A': { nature: ['希望', '重生', '安定', '光明之源'], baseScore: 6 },
  'H-2': { nature: ['缘分', '相遇', '连接', '和合之桥'], baseScore: 7 },
  'H-3': { nature: ['合作', '默契', '平衡', '双向奔赴'], baseScore: 6 },
  'H-4': { nature: ['滋养', '孕育', '包容', '生生不息'], baseScore: 5 },
  'H-5': { nature: ['智谋', '策略', '指引', '高维破局'], baseScore: 4 },
  'H-6': { nature: ['倾听', '渡化', '疗愈', '安抚情绪'], baseScore: 4 },
  'H-7': { nature: ['修复', '净化', '调整', '根本疗愈'], baseScore: 3 },
  'H-8': { nature: ['庇佑', '定心', '守望', '平安归航'], baseScore: 5 },
  'H-9': { nature: ['智慧', '明辨', '洞察', '清净正念'], baseScore: 6 },
  'H-10': { nature: ['践行', '大愿', '稳健', '行愿无尽'], baseScore: 5 },
  'H-J': { nature: ['赤诚', '学习', '机缘', '谦逊求道'], baseScore: 4 },
  'H-Q': { nature: ['大慈', '倾听', '化解', '慈航普度'], baseScore: 7 },
  'H-K': { nature: ['本源', '普照', '觉醒', '至高光明'], baseScore: 8 },

  // Diamond ♦ 财界
  'D-A': { nature: ['聚积', '底蕴', '丰盛', '财源根基'], baseScore: 8 },
  'D-2': { nature: ['吐宝', '敏锐', '吸纳', '商机嗅觉'], baseScore: 6 },
  'D-3': { nature: ['镇守', '纳财', '进取', '威慑偏财'], baseScore: 7 },
  'D-4': { nature: ['护佑', '根基', '稳定', '一方安泰'], baseScore: 5 },
  'D-5': { nature: ['通达', '八方', '流通', '多维进财'], baseScore: 8 },
  'D-6': { nature: ['福报', '德行', '正信', '厚德载物'], baseScore: 6 },
  'D-7': { nature: ['灵动', '戏宝', '变通', '机巧得利'], baseScore: 5 },
  'D-8': { nature: ['正财', '统御', '权柄', '雷厉风行'], baseScore: 6 },
  'D-9': { nature: ['公正', '无私', '审慎', '清正财德'], baseScore: 4 },
  'D-10': { nature: ['韬略', '进退', '周期', '大商之智'], baseScore: 7 },
  'D-J': { nature: ['迎福', '生机', '喜悦', '初发财机'], baseScore: 5 },
  'D-Q': { nature: ['吉庆', '优雅', '繁盛', '富足庄严'], baseScore: 7 },
  'D-K': { nature: ['信义', '忠诚', '护法', '一诺千金'], baseScore: 8 },

  // Club ♣ 生界
  'C-A': { nature: ['觉照', '根扎', '萌发', '智慧起点'], baseScore: 6 },
  'C-2': { nature: ['腾飞', '生机', '机遇', '扩张上升'], baseScore: 8 },
  'C-3': { nature: ['祥瑞', '仁德', '才智', '盛世吉兆'], baseScore: 7 },
  'C-4': { nature: ['高洁', '长青', '超然', '延年益寿'], baseScore: 5 },
  'C-5': { nature: ['各显神通', '奇遇', '同盟', '多元互补'], baseScore: 6 },
  'C-6': { nature: ['倒骑', '反思', '隐忍', '返璞归真'], baseScore: 3 },
  'C-7': { nature: ['断念', '侠义', '斩执', '慧剑出鞘'], baseScore: 5 },
  'C-8': { nature: ['葫芦妙药', '破相', '医治', '暗藏玄机'], baseScore: 4 },
  'C-9': { nature: ['功名', '文运', '考运', '文韬武略'], baseScore: 7 },
  'C-10': { nature: ['独占鳌头', '决胜', '科考', '拔得头筹'], baseScore: 7 },
  'C-J': { nature: ['破立', '无畏', '翻江', '打破常规'], baseScore: 4 },
  'C-Q': { nature: ['母仪', '寿数', '权柄', '仙府造化'], baseScore: 7 },
  'C-K': { nature: ['统御', '至尊', '秩序', '乾坤定鼎'], baseScore: 8 },

  // Spade ♠ 玄界
  'S-A': { nature: ['两仪', '演化', '平衡', '万象归真'], baseScore: 5 },
  'S-2': { nature: ['因果', '赏善罚恶', '了结', '定数难逃'], baseScore: -2 },
  'S-3': { nature: ['放下', '遗忘', '断舍', '跨越轮回'], baseScore: -2 },
  'S-4': { nature: ['驱邪', '震慑', '清障', '正气凛然'], baseScore: 3 },
  'S-5': { nature: ['天劫', '当头棒喝', '惊雷', '突变震荡'], baseScore: 0 },
  'S-6': { nature: ['照彻', '电光', '分明', '迅疾明了'], baseScore: 1 },
  'S-7': { nature: ['功过', '审视', '文书', '铁面无私'], baseScore: -1 },
  'S-8': { nature: ['护土', '城池', '公理', '赏罚分明'], baseScore: 3 },
  'S-9': { nature: ['大悲', '誓愿', '度尽', '深渊托底'], baseScore: 4 },
  'S-10': { nature: ['终局', '审判', '清算', '律法无情'], baseScore: -4 },
  'S-J': { nature: ['天眼', '洞察', '清剿', '直击本质'], baseScore: 5 },
  'S-Q': { nature: ['星宿', '斗极', '本命', '统御众星'], baseScore: 6 },
  'S-K': { nature: ['无为', '道法', '自然', '化生万物'], baseScore: 7 },
};
