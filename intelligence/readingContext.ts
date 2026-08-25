import { OracleCardData, SpreadType, QuestionDomain, QuestionIntent } from '@/types/oracle';

export interface PositionContextAnalysis {
  positionId: string;
  positionTitle: string;
  card: OracleCardData;
  contextMeaning: string;
  relevanceScore: number;
  isSynergistic: boolean;
}

export interface ReadingContext {
  readingId: string;
  question: string;
  domain: QuestionDomain;
  subCategory: string;
  intent: QuestionIntent;
  spread: SpreadType;
  createdAt: string;
  cards: OracleCardData[];
  positionAnalyses: PositionContextAnalysis[];
  isClarifier?: boolean;
  parentReadingId?: string;
}

export function buildReadingContext(
  cards: OracleCardData[],
  question: string,
  domain: QuestionDomain,
  subCategory: string,
  intent: QuestionIntent,
  spread: SpreadType,
  isClarifier = false,
  parentReadingId?: string
): ReadingContext {
  const positionAnalyses: PositionContextAnalysis[] = cards.map((card, idx) => {
    let positionId = `pos_${idx}`;
    let positionTitle = '本位';
    let contextMeaning = card.upright;
    let relevanceScore = 10;
    let isSynergistic = false;

    // 1. 三才神谕位置分析
    if (spread === 'three') {
      if (idx === 0) {
        positionId = 'sky';
        positionTitle = '天 · 过去前因';
        if (card.archetype === '孟婆' || card.keywords.includes('放下') || card.keywords.includes('过去')) {
          contextMeaning = '过往的经历、旧有执念或前因与“放下旧模式”紧密相关，过去的因缘已完成它的历史使命。';
        } else if (card.realm === '心界') {
          contextMeaning = `前因源自内在情感与人际关系的积淀，【${card.cardName}】的因缘种下了今日之局。`;
        } else if (card.realm === '财界') {
          contextMeaning = `此事前期的资源配置与现实物质基础起到了决定性铺垫作用。`;
        } else {
          contextMeaning = `初始大环境与前因受【${card.cardName}】所指引：${card.upright}`;
        }
      } else if (idx === 1) {
        positionId = 'man';
        positionTitle = '人 · 当下状态';
        contextMeaning = `当下自身心境与核心处境：正在经历【${card.cardName}】阶段，${card.upright}`;
      } else if (idx === 2) {
        positionId = 'earth';
        positionTitle = '地 · 未来结果';
        if (card.archetype === '孟婆') {
          contextMeaning = '未来事态走向要求你必须真正告别旧局，主动止损或放下，方能迎来新章。';
        } else if (card.realm === '生界' || card.keywords.includes('成长') || card.keywords.includes('突破')) {
          contextMeaning = `终局大吉，生机勃发，【${card.cardName}】预示着突破性进展与长远成长。`;
        } else {
          contextMeaning = `最终发展趋势与行动着落点：${card.upright}`;
        }
      }
    }

    // 2. 六合命盘位置分析
    else if (spread === 'six') {
      const posKeys = ['self', 'wealth', 'career', 'love', 'noble', 'future90'];
      const posTitles = ['本命 · 核心格局', '财富 · 财库机运', '事业 · 职场格局', '感情 · 缘分羁绊', '贵人 · 外部助力', '未来 · 90天吉凶'];
      positionId = posKeys[idx] || `pos_${idx}`;
      positionTitle = posTitles[idx] || '六合格局';

      if (positionId === 'wealth') {
        if (card.realm === '财界') {
          relevanceScore += 12;
          isSynergistic = true;
          contextMeaning = `财星归位！【${card.cardName}】在财富宫位能量极大释放：${card.wealth}`;
        } else {
          contextMeaning = `财富维度的显化受到【${card.cardName}】影响：${card.wealth}`;
        }
      } else if (positionId === 'love') {
        if (card.realm === '心界') {
          relevanceScore += 12;
          isSynergistic = true;
          contextMeaning = `心界主神坐镇感情宫！【${card.cardName}】赋予极深缘分契合：${card.love}`;
        } else if (card.archetype === '赵公明' || card.realm === '财界') {
          contextMeaning = `感情宫出现财界牌相，提示当前关系中“现实条件、物质资源分配或掌控欲”成为沟通焦点，需平衡面包与真情。`;
        } else {
          contextMeaning = `情感走向受【${card.cardName}】指引：${card.love}`;
        }
      } else if (positionId === 'career') {
        contextMeaning = `事业职场宫位呈现【${card.cardName}】：${card.career}`;
      } else if (positionId === 'noble') {
        contextMeaning = `贵人与外援磁场：遇到具有【${card.archetype}】特质的高人提携指点。`;
      } else if (positionId === 'future90') {
        contextMeaning = `未来90天关键节点推演：${card.upright}`;
      } else {
        contextMeaning = `自身内在元神与本性格局：${card.upright}`;
      }
    }

    // 3. 九宫天命分析
    else if (spread === 'nine') {
      const nineKeys = ['wealth', 'destiny', 'career', 'noble', 'centerCore', 'obstacle', 'love', 'turningPoint', 'future'];
      const nineTitles = ['财富宫', '天命宫', '事业宫', '贵人宫', '本命宫 (中宫)', '阻碍宫', '感情宫', '转机宫', '未来宫'];
      positionId = nineKeys[idx] || `pos_${idx}`;
      positionTitle = nineTitles[idx] || '九宫位';

      if (positionId === 'obstacle') {
        if (card.energyLevel >= 4 || card.realm === '生界' || card.realm === '心界') {
          contextMeaning = `阻碍宫出现吉牌【${card.cardName}】，代表你自身拥有极其强大的内在资源与智慧，足以轻松跨越眼前障碍。`;
        } else {
          contextMeaning = `潜在瓶颈与盲点提示：谨防【${card.shadow}】中所述的负面消耗。`;
        }
      } else if (positionId === 'turningPoint') {
        if (card.realm === '玄界' || card.energyLevel <= 2) {
          contextMeaning = `转机宫出现变局牌【${card.cardName}】，昭示必须经历一次关键的主动改变与破旧立新，真正的转机方会显现。`;
        } else {
          contextMeaning = `破局的关键钥匙：发挥【${card.cardName}】的积极能量，${card.upright}`;
        }
      } else if (positionId === 'centerCore') {
        contextMeaning = `中宫太极坐镇核心：【${card.cardName}·${card.archetype}】统领全盘，决定全局主基调。`;
      } else {
        contextMeaning = `${positionTitle}呈现【${card.cardName}】：${card.upright}`;
      }
    }

    return {
      positionId,
      positionTitle,
      card,
      contextMeaning,
      relevanceScore,
      isSynergistic,
    };
  });

  return {
    readingId: 'ctx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    question,
    domain,
    subCategory,
    intent,
    spread,
    createdAt: new Date().toISOString(),
    cards,
    positionAnalyses,
    isClarifier,
    parentReadingId,
  };
}
