import { TarotCard, SpreadConfig } from "./types";

export const CARD_BACK_URL =
  "https://pic1.imgdb.cn/item/6930fd73d5fdcd03ca9efb12.png";

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
    imageUrl: "https://pic1.imgdb.cn/item/6930fd93d5fdcd03ca9efbd5.png",
    suit: "Wands",
  },
  {
    id: "wands-08",
    name: "权杖八",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd91d5fdcd03ca9efbc6.png",
    suit: "Wands",
  },
  {
    id: "wands-09",
    name: "权杖九",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd91d5fdcd03ca9efbca.png",
    suit: "Wands",
  },
  {
    id: "wands-10",
    name: "权杖十",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd91d5fdcd03ca9efbc5.png",
    suit: "Wands",
  },
  {
    id: "wands-11",
    name: "权杖侍从",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd91d5fdcd03ca9efbcb.png",
    suit: "Wands",
  },
  {
    id: "wands-12",
    name: "权杖骑士",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd91d5fdcd03ca9efbc7.png",
    suit: "Wands",
  },
  {
    id: "wands-13",
    name: "权杖王后",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd91d5fdcd03ca9efbc8.png",
    suit: "Wands",
  },
  {
    id: "wands-02",
    name: "权杖二",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ed5fdcd03ca9efbb2.png",
    suit: "Wands",
  },
  {
    id: "wands-03",
    name: "权杖三",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ed5fdcd03ca9efbb3.png",
    suit: "Wands",
  },
  {
    id: "wands-04",
    name: "权杖四",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ed5fdcd03ca9efbb9.png",
    suit: "Wands",
  },
  {
    id: "wands-05",
    name: "权杖五",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ed5fdcd03ca9efbb7.png",
    suit: "Wands",
  },
  {
    id: "wands-07",
    name: "权杖七",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ed5fdcd03ca9efbb4.png",
    suit: "Wands",
  },
  {
    id: "wands-06",
    name: "权杖六",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ed5fdcd03ca9efbb6.png",
    suit: "Wands",
  },
  {
    id: "swords-11",
    name: "宝剑侍从",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ad5fdcd03ca9efba0.png",
    suit: "Swords",
  },
  {
    id: "swords-12",
    name: "宝剑骑士",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ad5fdcd03ca9efba2.png",
    suit: "Swords",
  },
  {
    id: "swords-13",
    name: "宝剑王后",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ad5fdcd03ca9efba1.png",
    suit: "Swords",
  },
  {
    id: "swords-14",
    name: "宝剑国王",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ad5fdcd03ca9efba3.png",
    suit: "Swords",
  },
  {
    id: "swords-10",
    name: "宝剑十",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ad5fdcd03ca9efb9e.png",
    suit: "Swords",
  },
  {
    id: "wands-01",
    name: "权杖一",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd8ad5fdcd03ca9efb9f.png",
    suit: "Wands",
  },
  {
    id: "swords-05",
    name: "宝剑五",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd87d5fdcd03ca9efb8e.png",
    suit: "Swords",
  },
  {
    id: "swords-06",
    name: "宝剑六",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd87d5fdcd03ca9efb8f.png",
    suit: "Swords",
  },
  {
    id: "swords-07",
    name: "宝剑七",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd87d5fdcd03ca9efb8d.png",
    suit: "Swords",
  },
  {
    id: "swords-09",
    name: "宝剑九",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd88d5fdcd03ca9efb92.png",
    suit: "Swords",
  },
  {
    id: "swords-04",
    name: "宝剑四",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd87d5fdcd03ca9efb8c.png",
    suit: "Swords",
  },
  {
    id: "swords-08",
    name: "宝剑八",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd87d5fdcd03ca9efb90.png",
    suit: "Swords",
  },
  {
    id: "pentacles-14",
    name: "星币国王",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd84d5fdcd03ca9efb7f.png",
    suit: "Pentacles",
  },
  {
    id: "swords-01",
    name: "宝剑一",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd84d5fdcd03ca9efb7b.png",
    suit: "Swords",
  },
  {
    id: "pentacles-13",
    name: "星币王后",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd84d5fdcd03ca9efb7e.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-12",
    name: "星币骑士",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd84d5fdcd03ca9efb7a.png",
    suit: "Pentacles",
  },
  {
    id: "swords-03",
    name: "宝剑三",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd84d5fdcd03ca9efb7c.png",
    suit: "Swords",
  },
  {
    id: "swords-02",
    name: "宝剑二",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd84d5fdcd03ca9efb7d.png",
    suit: "Swords",
  },
  {
    id: "pentacles-08",
    name: "星币八",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd81d5fdcd03ca9efb66.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-09",
    name: "星币九",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd81d5fdcd03ca9efb67.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-10",
    name: "星币十",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd81d5fdcd03ca9efb68.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-11",
    name: "星币侍从",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd81d5fdcd03ca9efb63.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-06",
    name: "星币六",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd81d5fdcd03ca9efb64.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-07",
    name: "星币七",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd81d5fdcd03ca9efb65.png",
    suit: "Pentacles",
  },
  {
    id: "cups-14",
    name: "圣杯国王",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ed5fdcd03ca9efb50.png",
    suit: "Cups",
  },
  {
    id: "pentacles-01",
    name: "星币一",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ed5fdcd03ca9efb4f.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-04",
    name: "星币四",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ed5fdcd03ca9efb53.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-02",
    name: "星币二",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ed5fdcd03ca9efb51.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-03",
    name: "星币三",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ed5fdcd03ca9efb52.png",
    suit: "Pentacles",
  },
  {
    id: "pentacles-05",
    name: "星币五",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ed5fdcd03ca9efb54.png",
    suit: "Pentacles",
  },
  {
    id: "cups-11",
    name: "圣杯侍从",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ad5fdcd03ca9efb3e.png",
    suit: "Cups",
  },
  {
    id: "cups-09",
    name: "圣杯九",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ad5fdcd03ca9efb3d.png",
    suit: "Cups",
  },
  {
    id: "cups-10",
    name: "圣杯十",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ad5fdcd03ca9efb40.png",
    suit: "Cups",
  },
  {
    id: "cups-12",
    name: "圣杯骑士",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ad5fdcd03ca9efb3f.png",
    suit: "Cups",
  },
  {
    id: "cups-13",
    name: "圣杯王后",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ad5fdcd03ca9efb3c.png",
    suit: "Cups",
  },
  {
    id: "cups-08",
    name: "圣杯八",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd7ad5fdcd03ca9efb3a.png",
    suit: "Cups",
  },
  {
    id: "cups-02",
    name: "圣杯二",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd76d5fdcd03ca9efb23.png",
    suit: "Cups",
  },
  {
    id: "cups-03",
    name: "圣杯三",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd76d5fdcd03ca9efb24.png",
    suit: "Cups",
  },
  {
    id: "cups-05",
    name: "圣杯五",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd76d5fdcd03ca9efb25.png",
    suit: "Cups",
  },
  {
    id: "cups-04",
    name: "圣杯四",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd76d5fdcd03ca9efb22.png",
    suit: "Cups",
  },
  {
    id: "cups-06",
    name: "圣杯六",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd76d5fdcd03ca9efb27.png",
    suit: "Cups",
  },
  {
    id: "cups-07",
    name: "圣杯七",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd76d5fdcd03ca9efb26.png",
    suit: "Cups",
  },
  {
    id: "major-20",
    name: "审判",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd73d5fdcd03ca9efb16.png",
    suit: "Major",
  },
  {
    id: "major-18",
    name: "月亮",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd73d5fdcd03ca9efb13.png",
    suit: "Major",
  },
  {
    id: "major-19",
    name: "太阳",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd73d5fdcd03ca9efb14.png",
    suit: "Major",
  },
  {
    id: "major-21",
    name: "世界",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd73d5fdcd03ca9efb15.png",
    suit: "Major",
  },
  {
    id: "cups-01",
    name: "圣杯一",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd74d5fdcd03ca9efb17.png",
    suit: "Cups",
  },
  {
    id: "major-15",
    name: "恶魔",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd70d5fdcd03ca9efafb.png",
    suit: "Major",
  },
  {
    id: "major-16",
    name: "高塔",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd70d5fdcd03ca9efafc.png",
    suit: "Major",
  },
  {
    id: "major-12",
    name: "倒吊人",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd70d5fdcd03ca9efaf7.png",
    suit: "Major",
  },
  {
    id: "major-13",
    name: "死神",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd70d5fdcd03ca9efafa.png",
    suit: "Major",
  },
  {
    id: "major-17",
    name: "星星",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd70d5fdcd03ca9efb00.png",
    suit: "Major",
  },
  {
    id: "major-14",
    name: "节制",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd70d5fdcd03ca9efaf8.png",
    suit: "Major",
  },
  {
    id: "major-09",
    name: "隐士",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd6bd5fdcd03ca9efae3.png",
    suit: "Major",
  },
  {
    id: "major-08",
    name: "力量",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd6cd5fdcd03ca9efae4.png",
    suit: "Major",
  },
  {
    id: "major-10",
    name: "命运之轮",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd6cd5fdcd03ca9efae9.png",
    suit: "Major",
  },
  {
    id: "major-06",
    name: "恋人",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd6cd5fdcd03ca9efae6.png",
    suit: "Major",
  },
  {
    id: "major-07",
    name: "战车",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd6cd5fdcd03ca9efae5.png",
    suit: "Major",
  },
  {
    id: "major-11",
    name: "正义",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd6cd5fdcd03ca9efaea.png",
    suit: "Major",
  },
  {
    id: "major-01",
    name: "魔术师",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd64d5fdcd03ca9efabc.png",
    suit: "Major",
  },
  {
    id: "major-00",
    name: "愚人",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd64d5fdcd03ca9efabd.png",
    suit: "Major",
  },
  {
    id: "major-03",
    name: "皇后",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd64d5fdcd03ca9efaba.png",
    suit: "Major",
  },
  {
    id: "major-05",
    name: "教皇",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd64d5fdcd03ca9efabf.png",
    suit: "Major",
  },
  {
    id: "major-04",
    name: "皇帝",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd64d5fdcd03ca9efabb.png",
    suit: "Major",
  },
  {
    id: "major-02",
    name: "女祭司",
    imageUrl: "https://pic1.imgdb.cn/item/6930fd64d5fdcd03ca9efabe.png",
    suit: "Major",
  },
];

export const getDeck = () => {
  return CARD_DATA.map((card) => ({
    ...card,
    isReversed: Math.random() < 0.2, // 20% chance of reversal
  }));
};
