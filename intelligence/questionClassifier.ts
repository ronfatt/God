import { QuestionDomain, QuestionIntent } from '@/types/oracle';
import { QUESTION_SUBCATEGORIES } from '@/data/questionCategories';

export interface ClassifiedQuestion {
  original: string;
  domain: QuestionDomain;
  subCategory: string;
  subCategoryName: string;
  intent: QuestionIntent;
  confidence: number;
}

export function classifyQuestion(question: string, fallbackDomain: string = 'general'): ClassifiedQuestion {
  const cleanQ = (question || '').trim().toLowerCase();

  // If question is empty or default
  if (!cleanQ || cleanQ.includes('今日神谕') || cleanQ.includes('乾坤运势')) {
    const domainMap: Record<string, QuestionDomain> = {
      love: 'love',
      wealth: 'wealth',
      career: 'career',
      relationship: 'relationship',
      general: 'life',
      custom: 'life',
    };
    const domain = domainMap[fallbackDomain] || 'life';
    const sub = domain === 'love' ? 'love_existing' : domain === 'wealth' ? 'wealth_income' : domain === 'career' ? 'career_current' : 'life_general';

    return {
      original: question || '今日神谕·乾坤运势',
      domain,
      subCategory: sub,
      subCategoryName: '综合运势',
      intent: 'future',
      confidence: 0.85,
    };
  }

  // Score each subcategory based on keyword hits
  let bestMatch = QUESTION_SUBCATEGORIES[0];
  let maxScore = 0;

  for (const cat of QUESTION_SUBCATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (cleanQ.includes(kw.toLowerCase())) {
        score += kw.length * 2; // Longer keyword match has higher weight
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = cat;
    }
  }

  // Detect Intent from query syntax
  let intent: QuestionIntent = bestMatch.defaultIntent;
  if (cleanQ.includes('应该') || cleanQ.includes('如何选择') || cleanQ.includes('选哪个') || cleanQ.includes('该不该') || cleanQ.includes('是否')) {
    intent = 'decision';
  } else if (cleanQ.includes('何时') || cleanQ.includes('什么时候') || cleanQ.includes('多久') || cleanQ.includes('时间')) {
    intent = 'timing';
  } else if (cleanQ.includes('阻碍') || cleanQ.includes('困难') || cleanQ.includes('为什么') || cleanQ.includes('瓶颈') || cleanQ.includes('小人')) {
    intent = 'obstacle';
  } else if (cleanQ.includes('谁') || cleanQ.includes('贵人') || cleanQ.includes('对方') || cleanQ.includes('他人')) {
    intent = 'person';
  } else if (cleanQ.includes('建议') || cleanQ.includes('怎么办') || cleanQ.includes('如何做')) {
    intent = 'advice';
  }

  // Fallback domain if no keyword matched
  let domain = bestMatch.domain;
  if (maxScore === 0) {
    if (fallbackDomain === 'love') domain = 'love';
    else if (fallbackDomain === 'wealth') domain = 'wealth';
    else if (fallbackDomain === 'career') domain = 'career';
    else if (fallbackDomain === 'relationship') domain = 'relationship';
    else domain = 'life';
  }

  return {
    original: question,
    domain,
    subCategory: bestMatch.id,
    subCategoryName: bestMatch.name,
    intent,
    confidence: maxScore > 0 ? 0.92 : 0.7,
  };
}
