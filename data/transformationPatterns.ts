export interface TransformationPattern {
  id: string;
  name: string;
  triggerCardIds: [string, string]; // [First, Second]
  patternType: 'release_to_growth' | 'ending_to_beginning' | 'disruption_to_breakthrough' | 'destruction_to_renewal' | 'clearing_to_order';
  description: string;
  narrative: string;
  confidence: 'high' | 'medium';
}

export const TRANSFORMATION_PATTERNS: TransformationPattern[] = [
  {
    id: 'mengpo_bodhi',
    name: '旧尽新生 · 忘却与觉醒',
    triggerCardIds: ['S-3', 'C-A'], // 孟婆 + 菩提树
    patternType: 'release_to_growth',
    description: '旧关系、旧模式彻底放下，内在觉悟与新生命周期同步生发。',
    narrative: '孟婆与菩提树相遇，象征着过去执念的彻底消融与心智觉悟的新萌发。这不是失去，而是为新生彻底腾出了沃土。',
    confidence: 'high',
  },
  {
    id: 'mengpo_dragon',
    name: '斩断旧茧 · 龙腾万里',
    triggerCardIds: ['S-3', 'C-2'], // 孟婆 + 青龙
    patternType: 'ending_to_beginning',
    description: '旧局清退之后，立刻迎来强劲的上升与扩张机遇。',
    narrative: '孟婆的了结之后紧随青龙的腾飞，预示着旧束缚解开之日，即是事业与人生乘势而起之时。',
    confidence: 'high',
  },
  {
    id: 'leigong_dragon',
    name: '震雷破局 · 亢龙有悔',
    triggerCardIds: ['S-5', 'C-2'], // 雷公 + 青龙
    patternType: 'disruption_to_breakthrough',
    description: '剧烈的突发变化震碎了原有的僵局，反而迅速催生全新机遇。',
    narrative: '雷公的当头棒喝打破了长期沉闷，在突变之中，青龙的上升之势被瞬间激发，属于极速破局的大转换。',
    confidence: 'high',
  },
  {
    id: 'yanluo_taiji',
    name: '终局审判 · 阴阳重塑',
    triggerCardIds: ['S-10', 'S-A'], // 阎罗王 + 太极
    patternType: 'destruction_to_renewal',
    description: '旧因果彻底清算，系统重启回归天地两仪平衡。',
    narrative: '阎罗王清算旧账之后，太极两仪重新运转，过去的功过纠葛已告一段落，新的因果秩序正在重立。',
    confidence: 'high',
  },
  {
    id: 'wuchang_treasure',
    name: '了结尘缘 · 聚宝回春',
    triggerCardIds: ['S-2', 'D-A'], // 黑白无常 + 聚宝盆
    patternType: 'clearing_to_order',
    description: '解决长期拖延的旧债务与纷争后，财运稳健筑底复苏。',
    narrative: '因果清结后紧跟聚宝盆，说明财务上的消耗漏洞已被封堵，真正的资金积累与资产沉淀正式启动。',
    confidence: 'medium',
  },
  {
    id: 'zhongkui_wenchang',
    name: '涤除邪祟 · 魁星点斗',
    triggerCardIds: ['S-4', 'C-9'], // 钟馗 + 文昌帝君
    patternType: 'disruption_to_breakthrough',
    description: '扫清阻碍与小人之后，正道功名与考运豁然开朗。',
    narrative: '钟馗的强力清障使外部干扰散去，文昌帝君的智慧与名望能够毫无阻碍地发挥，格局大为清明。',
    confidence: 'high',
  },
  {
    id: 'nezha_taishang',
    name: '降龙伏虎 · 归于虚静',
    triggerCardIds: ['C-J', 'S-K'], // 哪吒 + 太上老君
    patternType: 'clearing_to_order',
    description: '前期剧烈行动与破立之后，迅速收敛沉淀为高维大智慧。',
    narrative: '前期需要哪吒般的大胆突破与敢作敢当，后期则需要太上老君的清静无为以守大成。动静相得益彰。',
    confidence: 'medium',
  },
];
