import { TarotCard, SpreadConfig } from "./types";

export const CARD_BACK_URL =
  "https://pic1.imgdb.cn/item/693004fe4c455cbabc96a496.png";

export const SPREAD_CONFIGS: SpreadConfig[] = [
  {
    id: "single",
    name: "单牌指引",
    description:
      "抽取一张牌，获得当下的核心洞察与建议。适合每日运势或简单问题的快速解答。",
    cards: 1,
    positions: [
      { id: "core", name: "核心指引", description: "当下最核心的能量与建议" },
    ],
  },
  {
    id: "time-triangle",
    name: "圣三角",
    description:
      "经典的过去、现在、未来牌阵。透视时间线上的因果关系，预测事情的发展走向。",
    cards: 3,
    positions: [
      { id: "past", name: "过去溯源", description: "导致现状的过去原因" },
      { id: "present", name: "当下能量", description: "目前的状况与挑战" },
      { id: "future", name: "未来启示", description: "未来的发展趋势" },
    ],
  },
  {
    id: "elements",
    name: "四元素",
    description:
      "基于火、水、风、土四元素的全面分析。涵盖行动、情感、思维与物质四个层面。",
    cards: 4,
    positions: [
      {
        id: "fire",
        name: "火元素 (行动/事业)",
        description: "行动力、职业发展与热情",
      },
      {
        id: "water",
        name: "水元素 (情感/人际)",
        description: "情感状态、直觉与人际关系",
      },
      {
        id: "air",
        name: "风元素 (思维/挑战)",
        description: "逻辑思维、沟通与面临的挑战",
      },
      {
        id: "earth",
        name: "土元素 (物质/财运)",
        description: "物质基础、金钱与身体健康",
      },
    ],
  },
];

const CARD_DATA: Omit<TarotCard, "isReversed">[] = [
  {
    id: "wands-14",
    name: "权杖国王",
    imageUrl: "https://pic1.imgdb.cn/item/693005214c455cbabc96a5c5.png",
    suit: "Wands",
  },
  {
    id: "wands-08",
    name: "权杖八",
    imageUrl: "https://pic1.imgdb.cn/item/6930051e4c455cbabc96a5b0.png",
    suit: "Wands",
  },
  {
    id: "wands-09",
    name: "权杖九",
    imageUrl: "https://pic1.imgdb.cn/item/6930051e4c455cbabc96a5b1.png",
    suit: "Wands",
  },
  {
    id: "wands-10",
    name: "权杖十",
    imageUrl: "https://pic1.imgdb.cn/item/6930051e4c455cbabc96a5b2.png",
    suit: "Wands",
  },
  {
    id: "wands-11",
    name: "权杖侍从",
    imageUrl: "https://pic1.imgdb.cn/item/6930051e4c455cbabc96a5b3.png",
    suit: "Wands",
  },
  {
    id: "wands-12",
    name: "权杖骑士",
    imageUrl: "https://pic1.imgdb.cn/item/6930051e4c455cbabc96a5b4.png",
    suit: "Wands",
  },
  {
    id: "wands-13",
    name: "权杖王后",
    imageUrl: "https://pic1.imgdb.cn/item/6930051e4c455cbabc96a5b5.png",
    suit: "Wands",
  },
  {
    id: "wands-02",
    name: "权杖二",
    imageUrl: "https://pic1.imgdb.cn/item/6930051b4c455cbabc96a593.png",
    suit: "Wands",
  },
  {
    id: "wands-03",
    name: "权杖三",
    imageUrl: "https://pic1.imgdb.cn/item/6930051b4c455cbabc96a595.png",
    suit: "Wands",
  },
  {
    id: "wands-04",
    name: "权杖四",
    imageUrl: "https://pic1.imgdb.cn/item/6930051b4c455cbabc96a596.png",
    suit: "Wands",
  },
  {
    id: "wands-05",
    name: "权杖五",
    imageUrl: "https://pic1.imgdb.cn/item/6930051b4c455cbabc96a597.png",
    suit: "Wands",
  },
  {
    id: "wands-07",
    name: "权杖七",
    imageUrl: "https://pic1.imgdb.cn/item/6930051b4c455cbabc96a598.png",
    suit: "Wands",
  },
  {
    id: "wands-06",
    name: "权杖六",
    imageUrl: "https://pic1.imgdb.cn/item/6930051b4c455cbabc96a599.png",
    suit: "Wands",
  },
  {
    id: "swords-11",
    name: "宝剑侍从",
    imageUrl: "https://pic1.imgdb.cn/item/693005184c455cbabc96a575.png",
    suit: "Swords",
  },
  {
    id: "swords-12",
    name: "宝剑骑士",
    imageUrl: "https://pic1.imgdb.cn/item/693005184c455cbabc96a577.png",
    suit: "Swords",
  },
  {
    id: "swords-13",
    name: "宝剑王后",
    imageUrl: "https://pic1.imgdb.cn/item/693005184c455cbabc96a578.png",
    suit: "Swords",
  },
  {
    id: "swords-14",
    name: "宝剑国王",
    imageUrl: "https://pic1.imgdb.cn/item/693005184c455cbabc96a579.png",
    suit: "Swords",
  },
  {
    id: "swords-10",
    name: "宝剑十",
    imageUrl: "https://pic1.imgdb.cn/item/693005184c455cbabc96a57a.png",
    suit: "Swords",
  },
  {
    id: "wands-01",
    name: "权杖一",
    imageUrl: "https://pic1.imgdb.cn/item/693005184c455cbabc96a57b.png",
    suit: "Wands",
  },
  {
    id: "swords-05",
    name: "宝剑五",
    imageUrl: "https://pic1.imgdb.cn/item/693005154c455cbabc96a55e.png",
    suit: "Swords",
  },
  {
    id: "swords-06",
    name: "宝剑六",
    imageUrl: "https://pic1.imgdb.cn/item/693005154c455cbabc96a55f.png",
    suit: "Swords",
  },
  {
    id: "swords-07",
    name: "宝剑七",
    imageUrl: "https://pic1.imgdb.cn/item/693005154c455cbabc96a560.png",
    suit: "Swords",
  },
  {
    id: "swords-09",
    name: "宝剑九",
    imageUrl: "https://pic1.imgdb.cn/item/693005154c455cbabc96a561.png",
    suit: "Swords",
  },
  {
    id: "swords-04",
    name: "宝剑四",
    imageUrl: "https://pic1.imgdb.cn/item/693005154c455cbabc96a562.png",
    suit: "Swords",
  },
  {
    id: "swords-08",
    name: "宝剑八",
    imageUrl: "https://pic1.imgdb.cn/item/693005154c455cbabc96a564.png",
    suit: "Swords",
  },
  {
    id: "pentacles-14",
    name: "星币国王",
    imageUrl: "https://pic1.imgdb.cn/item/693005124c455cbabc96a541.png",
    suit: "Pentacles",
  },
  {
    id: "swords-01",
    name: "宝剑一",
    imageUrl: "https://pic1.imgdb.cn/item/693005124c455cbabc96a542.png",
    suit: "Swords",
  },
  {
    id: "pentacles-13",
    name: "星币王后",
    imageUrl: "https://pic1.imgdb.cn/item/693005124c455cbabc96a543.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-12",
    name: "星币骑士",
    imageUrl: "https://pic1.imgdb.cn/item/693005124c455cbabc96a544.png",
    suit: "Pentacles",
  },
  {
    id: "swords-03",
    name: "宝剑三",
    imageUrl: "https://pic1.imgdb.cn/item/693005124c455cbabc96a546.png",
    suit: "Swords",
  },
  {
    id: "swords-02",
    name: "宝剑二",
    imageUrl: "https://pic1.imgdb.cn/item/693005124c455cbabc96a547.png",
    suit: "Swords",
  },
  {
    id: "pentacles-08",
    name: "星币八",
    imageUrl: "https://pic1.imgdb.cn/item/6930050e4c455cbabc96a521.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-09",
    name: "星币九",
    imageUrl: "https://pic1.imgdb.cn/item/6930050e4c455cbabc96a522.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-10",
    name: "星币十",
    imageUrl: "https://pic1.imgdb.cn/item/6930050e4c455cbabc96a523.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-11",
    name: "星币侍从",
    imageUrl: "https://pic1.imgdb.cn/item/6930050e4c455cbabc96a525.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-06",
    name: "星币六",
    imageUrl: "https://pic1.imgdb.cn/item/6930050e4c455cbabc96a527.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-07",
    name: "星币七",
    imageUrl: "https://pic1.imgdb.cn/item/6930050e4c455cbabc96a528.png",
    suit: "Pentacles",
  },
  {
    id: "cups-14",
    name: "圣杯国王",
    imageUrl: "https://pic1.imgdb.cn/item/6930050b4c455cbabc96a502.png",
    suit: "Cups",
  },
  {
    id: "pentacles-01",
    name: "星币一",
    imageUrl: "https://pic1.imgdb.cn/item/6930050b4c455cbabc96a503.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-04",
    name: "星币四",
    imageUrl: "https://pic1.imgdb.cn/item/6930050b4c455cbabc96a504.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-02",
    name: "星币二",
    imageUrl: "https://pic1.imgdb.cn/item/6930050b4c455cbabc96a505.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-03",
    name: "星币三",
    imageUrl: "https://pic1.imgdb.cn/item/6930050b4c455cbabc96a506.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-05",
    name: "星币五",
    imageUrl: "https://pic1.imgdb.cn/item/6930050b4c455cbabc96a507.png",
    suit: "Pentacles",
  },
  {
    id: "cups-11",
    name: "圣杯侍从",
    imageUrl: "https://pic1.imgdb.cn/item/693005074c455cbabc96a4e3.png",
    suit: "Cups",
  },
  {
    id: "cups-09",
    name: "圣杯九",
    imageUrl: "https://pic1.imgdb.cn/item/693005074c455cbabc96a4e4.png",
    suit: "Cups",
  },
  {
    id: "cups-10",
    name: "圣杯十",
    imageUrl: "https://pic1.imgdb.cn/item/693005074c455cbabc96a4e7.png",
    suit: "Cups",
  },
  {
    id: "cups-12",
    name: "圣杯骑士",
    imageUrl: "https://pic1.imgdb.cn/item/693005074c455cbabc96a4e8.png",
    suit: "Cups",
  },
  {
    id: "cups-13",
    name: "圣杯王后",
    imageUrl: "https://pic1.imgdb.cn/item/693005074c455cbabc96a4e9.png",
    suit: "Cups",
  },
  {
    id: "cups-08",
    name: "圣杯八",
    imageUrl: "https://pic1.imgdb.cn/item/693005074c455cbabc96a4ea.png",
    suit: "Cups",
  },
  {
    id: "cups-02",
    name: "圣杯二",
    imageUrl: "https://pic1.imgdb.cn/item/693005034c455cbabc96a4bc.png",
    suit: "Cups",
  },
  {
    id: "cups-03",
    name: "圣杯三",
    imageUrl: "https://pic1.imgdb.cn/item/693005034c455cbabc96a4bd.png",
    suit: "Cups",
  },
  {
    id: "cups-05",
    name: "圣杯五",
    imageUrl: "https://pic1.imgdb.cn/item/693005034c455cbabc96a4be.png",
    suit: "Cups",
  },
  {
    id: "cups-04",
    name: "圣杯四",
    imageUrl: "https://pic1.imgdb.cn/item/693005034c455cbabc96a4bf.png",
    suit: "Cups",
  },
  {
    id: "cups-06",
    name: "圣杯六",
    imageUrl: "https://pic1.imgdb.cn/item/693005034c455cbabc96a4c0.png",
    suit: "Cups",
  },
  {
    id: "cups-07",
    name: "圣杯七",
    imageUrl: "https://pic1.imgdb.cn/item/693005034c455cbabc96a4c1.png",
    suit: "Cups",
  },
  {
    id: "major-20",
    name: "审判",
    imageUrl: "https://pic1.imgdb.cn/item/693004fe4c455cbabc96a498.png",
    suit: "Major",
  },
  {
    id: "major-18",
    name: "月亮",
    imageUrl: "https://pic1.imgdb.cn/item/693004fe4c455cbabc96a499.png",
    suit: "Major",
  },
  {
    id: "major-19",
    name: "太阳",
    imageUrl: "https://pic1.imgdb.cn/item/693004fe4c455cbabc96a49a.png",
    suit: "Major",
  },
  {
    id: "major-21",
    name: "世界",
    imageUrl: "https://pic1.imgdb.cn/item/693004fe4c455cbabc96a49b.png",
    suit: "Major",
  },
  {
    id: "cups-01",
    name: "圣杯一",
    imageUrl: "https://pic1.imgdb.cn/item/693004fe4c455cbabc96a49d.png",
    suit: "Cups",
  },
  {
    id: "major-15",
    name: "恶魔",
    imageUrl: "https://pic1.imgdb.cn/item/693004f74c455cbabc96a465.png",
    suit: "Major",
  },
  {
    id: "major-16",
    name: "高塔",
    imageUrl: "https://pic1.imgdb.cn/item/693004f74c455cbabc96a466.png",
    suit: "Major",
  },
  {
    id: "major-12",
    name: "倒吊人",
    imageUrl: "https://pic1.imgdb.cn/item/693004f74c455cbabc96a467.png",
    suit: "Major",
  },
  {
    id: "major-13",
    name: "死神",
    imageUrl: "https://pic1.imgdb.cn/item/693004f74c455cbabc96a468.png",
    suit: "Major",
  },
  {
    id: "major-17",
    name: "星星",
    imageUrl: "https://pic1.imgdb.cn/item/693004f74c455cbabc96a469.png",
    suit: "Major",
  },
  {
    id: "major-14",
    name: "节制",
    imageUrl: "https://pic1.imgdb.cn/item/693004f74c455cbabc96a46a.png",
    suit: "Major",
  },
  {
    id: "major-09",
    name: "隐士",
    imageUrl: "https://pic1.imgdb.cn/item/693004e54c455cbabc96a3dc.png",
    suit: "Major",
  },
  {
    id: "major-08",
    name: "力量",
    imageUrl: "https://pic1.imgdb.cn/item/693004e54c455cbabc96a3de.png",
    suit: "Major",
  },
  {
    id: "major-10",
    name: "命运之轮",
    imageUrl: "https://pic1.imgdb.cn/item/693004e54c455cbabc96a3e0.png",
    suit: "Major",
  },
  {
    id: "major-06",
    name: "恋人",
    imageUrl: "https://pic1.imgdb.cn/item/693004e54c455cbabc96a3e1.png",
    suit: "Major",
  },
  {
    id: "major-07",
    name: "战车",
    imageUrl: "https://pic1.imgdb.cn/item/693004e54c455cbabc96a3e2.png",
    suit: "Major",
  },
  {
    id: "major-11",
    name: "正义",
    imageUrl: "https://pic1.imgdb.cn/item/693004e54c455cbabc96a3e4.png",
    suit: "Major",
  },
  {
    id: "major-01",
    name: "魔术师",
    imageUrl: "https://pic1.imgdb.cn/item/693004a1d5fdcd03ca9c4c43.png",
    suit: "Major",
  },
  {
    id: "major-00",
    name: "愚人",
    imageUrl: "https://pic1.imgdb.cn/item/693004a1d5fdcd03ca9c4c44.png",
    suit: "Major",
  },
  {
    id: "major-03",
    name: "皇后",
    imageUrl: "https://pic1.imgdb.cn/item/693004a1d5fdcd03ca9c4c45.png",
    suit: "Major",
  },
  {
    id: "major-05",
    name: "教皇",
    imageUrl: "https://pic1.imgdb.cn/item/693004a1d5fdcd03ca9c4c46.png",
    suit: "Major",
  },
  {
    id: "major-04",
    name: "皇帝",
    imageUrl: "https://pic1.imgdb.cn/item/693004a1d5fdcd03ca9c4c48.png",
    suit: "Major",
  },
  {
    id: "major-02",
    name: "女祭司",
    imageUrl: "https://pic1.imgdb.cn/item/693004a1d5fdcd03ca9c4c47.png",
    suit: "Major",
  },
];

export const getDeck = () => {
  return CARD_DATA.map((card) => ({
    ...card,
    isReversed: Math.random() < 0.2, // 20% chance of reversal
  }));
};
