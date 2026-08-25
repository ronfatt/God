export type MomentumType =
  | 'rising'
  | 'declining'
  | 'recovery'
  | 'breakthrough'
  | 'transformative'
  | 'stable'
  | 'volatile'
  | 'blocked';

export interface MomentumPatternConfig {
  type: MomentumType;
  title: string;
  subtitle: string;
  summary: string;
  badgeColor: string;
  defaultSequence: [string, string, string];
}

export const MOMENTUM_PATTERNS: Record<MomentumType, MomentumPatternConfig> = {
  rising: {
    type: 'rising',
    title: '渐入佳境',
    subtitle: '低开高走 · 步步为营',
    summary: '起初虽有阻滞或低谷，但随着行动推进，局势正在由弱变强，渐入通畅坦途。',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60',
    defaultSequence: ['蓄力筑基', '机运显露', '大势攀升'],
  },
  declining: {
    type: 'declining',
    title: '先盛后缓',
    subtitle: '繁华收敛 · 守成为上',
    summary: '开局声势浩大，后续进入平稳收敛期。当前不是扩张之时，而应稳固成果、防患未然。',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
    defaultSequence: ['高位显赫', '动能平缓', '内敛沉淀'],
  },
  recovery: {
    type: 'recovery',
    title: '低谷回升',
    subtitle: '阴尽阳生 · 否极泰来',
    summary: '经历过最艰苦的考验与消耗后，能量正在强劲反弹，贵人与生机正在靠近。',
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/60',
    defaultSequence: ['深谷受挫', '暗中蓄力', '破土复苏'],
  },
  breakthrough: {
    type: 'breakthrough',
    title: '破局上升',
    subtitle: '雷厉风行 · 斩断阻碍',
    summary: '面临明确考验，但凭借果断行动与敏锐洞察，成功冲破重重桎梏，斩获全新格局。',
    badgeColor: 'text-yellow-300 border-yellow-400/50 bg-yellow-950/60',
    defaultSequence: ['遭遇瓶颈', '雷霆破阵', '登峰胜出'],
  },
  transformative: {
    type: 'transformative',
    title: '先破后立',
    subtitle: '舍旧脱胎 · 灵根涅槃',
    summary: '旧有的模式、关系或消耗必须彻底画上句号，方能腾出空间拥抱全新周期的丰盛。',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/60',
    defaultSequence: ['旧局终结', '深度清理', '新生萌发'],
  },
  stable: {
    type: 'stable',
    title: '稳中推进',
    subtitle: '乾坤安泰 · 细水长流',
    summary: '前后能量均衡祥和，波澜不惊。适合按部就班深耕主业，持之以恒必有丰厚回报。',
    badgeColor: 'text-blue-400 border-blue-500/40 bg-blue-950/60',
    defaultSequence: ['根基稳固', '有序行进', '厚积薄发'],
  },
  volatile: {
    type: 'volatile',
    title: '波澜局势',
    subtitle: '高低起伏 · 顺势机变',
    summary: '能量变化剧烈，充满不确定性与意外事件。考验敏捷反应与定力，切忌孤注一掷。',
    badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-950/60',
    defaultSequence: ['突发震荡', '左右权衡', '应变定局'],
  },
  blocked: {
    type: 'blocked',
    title: '暂缓蓄势',
    subtitle: '以退为进 · 静观其变',
    summary: '眼前存在多重阻碍与迷雾，强行冲刺容易撞壁。当下上策是韬光养晦，静待天时转化。',
    badgeColor: 'text-neutral-400 border-neutral-600/50 bg-neutral-900/80',
    defaultSequence: ['阻滞显现', '修整防备', '静待转机'],
  },
};
