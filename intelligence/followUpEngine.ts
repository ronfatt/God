import { QuestionDomain, QuestionIntent, OracleCardData } from '@/types/oracle';

export interface FollowUpOption {
  id: string;
  question: string;
  category: string;
  tokenCost1Card: number;
  tokenCost3Cards: number;
}

export function generateFollowUps(
  domain: QuestionDomain,
  subCategory: string,
  intent: QuestionIntent,
  cards: OracleCardData[]
): FollowUpOption[] {
  const options: FollowUpOption[] = [];

  if (domain === 'love') {
    if (subCategory.includes('reconciliation') || subCategory.includes('single')) {
      options.push({
        id: 'f_love_1',
        question: '对方目前的真实心境与态度究竟如何？',
        category: '对方心境',
        tokenCost1Card: 10,
        tokenCost3Cards: 20,
      });
      options.push({
        id: 'f_love_2',
        question: '这段关系在未来90天内最容易出现的转折节点是什么？',
        category: '时间窗口',
        tokenCost1Card: 10,
        tokenCost3Cards: 20,
      });
      options.push({
        id: 'f_love_3',
        question: '我当下应该主动联系，还是继续保持距离观察？',
        category: '行动抉择',
        tokenCost1Card: 10,
        tokenCost3Cards: 20,
      });
    } else {
      options.push({
        id: 'f_love_4',
        question: '我们双方在价值观或长远规划上的最大契合点与隐患是什么？',
        category: '长远契合',
        tokenCost1Card: 10,
        tokenCost3Cards: 20,
      });
      options.push({
        id: 'f_love_5',
        question: '如何化解彼此心中未曾说出口的顾虑？',
        category: '破局沟通',
        tokenCost1Card: 10,
        tokenCost3Cards: 20,
      });
    }
  } else if (domain === 'career') {
    if (subCategory.includes('resignation')) {
      options.push({
        id: 'f_career_1',
        question: '如果我选择留下来，未来90天局势会有好转吗？',
        category: '留守推演',
        tokenCost1Card: 10,
        tokenCost3Cards: 20,
      });
      options.push({
        id: 'f_career_2',
        question: '外部新机会最大的方向与行业赛道在哪里？',
        category: '新机探索',
        tokenCost1Card: 10,
        tokenCost3Cards: 20,
      });
      options.push({
        id: 'f_career_3',
        question: '跳槽的最佳行动时间窗口是什么时候？',
        category: '择机行动',
        tokenCost1Card: 10,
        tokenCost3Cards: 20,
      });
    } else {
      options.push({
        id: 'f_career_4',
        question: '近期谁会成为我晋升或突破的核心贵人？',
        category: '贵人显现',
        tokenCost1Card: 10,
        tokenCost3Cards: 20,
      });
      options.push({
        id: 'f_career_5',
        question: '目前手头项目最大的潜在瓶颈与防范点是什么？',
        category: '避坑指引',
        tokenCost1Card: 10,
        tokenCost3Cards: 20,
      });
    }
  } else if (domain === 'wealth') {
    options.push({
      id: 'f_wealth_1',
      question: '眼前这个财运机会背后是否存在未被注意的风险？',
      category: '风控洞察',
      tokenCost1Card: 10,
      tokenCost3Cards: 20,
    });
    options.push({
      id: 'f_wealth_2',
      question: '未来3个月内哪种收益渠道的增长潜力最大？',
      category: '渠道甄别',
      tokenCost1Card: 10,
      tokenCost3Cards: 20,
    });
    options.push({
      id: 'f_wealth_3',
      question: '当前适合做长期资产定投还是保持高流动性？',
      category: '配置建议',
      tokenCost1Card: 10,
      tokenCost3Cards: 20,
    });
  } else {
    // General Life / Decision
    options.push({
      id: 'f_gen_1',
      question: '针对当前局势，我最核心的第一步实操行动应该是什么？',
      category: '第一步行动',
      tokenCost1Card: 10,
      tokenCost3Cards: 20,
    });
    options.push({
      id: 'f_gen_2',
      question: '在未来30天内，我最需要警惕的人或环境是什么？',
      category: '防患未然',
      tokenCost1Card: 10,
      tokenCost3Cards: 20,
    });
    options.push({
      id: 'f_gen_3',
      question: '这件事的最终走向会如何重塑我的人生态势？',
      category: '终局定鼎',
      tokenCost1Card: 10,
      tokenCost3Cards: 20,
    });
  }

  return options.slice(0, 4);
}
