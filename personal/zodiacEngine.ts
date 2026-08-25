import { Element } from '@/types/oracle';

export interface ZodiacInfo {
  animal: string; // 鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪
  element: Element; // wood, fire, earth, metal, water
  elementName: string; // 木、火、土、金、水
  ganZhi: string; // e.g. "丙子"
  fullTitle: string; // e.g. "丙子鼠 · 水命"
  yearTrait: string;
}

const ZODIAC_ANIMALS = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
const HEAVENLY_STEMS = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'];
const STEM_ELEMENTS: Record<string, { el: Element; name: string }> = {
  甲: { el: 'wood', name: '木' },
  乙: { el: 'wood', name: '木' },
  丙: { el: 'fire', name: '火' },
  丁: { el: 'fire', name: '火' },
  戊: { el: 'earth', name: '土' },
  己: { el: 'earth', name: '土' },
  庚: { el: 'metal', name: '金' },
  辛: { el: 'metal', name: '金' },
  壬: { el: 'water', name: '水' },
  癸: { el: 'water', name: '水' },
};

const ZODIAC_TRAITS: Record<string, string> = {
  鼠: '机敏灵动，善察微变，水聚财源。',
  牛: '厚重坚毅，笃行不怠，土载万物。',
  虎: '雄姿勃发，锐意进取，木生威仪。',
  兔: '温润灵秀，知进知退，静水流深。',
  龙: '乘风破浪，格局宏阔，天命所归。',
  蛇: '洞悉暗流，深谋远虑，智火明心。',
  马: '奔腾昂扬，雷厉风行，离火显耀。',
  羊: '祥和宽厚，积善成德，温润承道。',
  猴: '机变百出，通达无碍，金玉其质。',
  鸡: '守正司晨，明辨是非，刚金立界。',
  狗: '忠勇敦厚，恪尽职守，厚土守库。',
  猪: '福泽绵长，豁达澄澈，玄水涵濡。',
};

export function calculateZodiacFromYear(year: number): ZodiacInfo {
  if (!year || isNaN(year)) {
    return {
      animal: '龙',
      element: 'water',
      elementName: '水',
      ganZhi: '壬辰',
      fullTitle: '壬辰龙 · 水命',
      yearTrait: ZODIAC_TRAITS['龙'],
    };
  }

  const animal = ZODIAC_ANIMALS[year % 12];
  const stem = HEAVENLY_STEMS[year % 10];
  const stemInfo = STEM_ELEMENTS[stem] || { el: 'water', name: '水' };
  const ganZhi = `${stem}${animal}`;

  return {
    animal,
    element: stemInfo.el,
    elementName: stemInfo.name,
    ganZhi,
    fullTitle: `${ganZhi}${animal} · ${stemInfo.name}命`,
    yearTrait: ZODIAC_TRAITS[animal] || '顺天应时，厚积薄发。',
  };
}
