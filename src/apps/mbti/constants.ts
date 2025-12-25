import { MBTIType } from "./types";

export const MBTI_LIST: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

/**
 * Maps MBTI types to specific avatar seeds and colors that evoke the 16personalities characters.
 * Analysts (NT) - Purple
 * Diplomats (NF) - Green
 * Sentinels (SJ) - Blue
 * Explorers (SP) - Yellow
 */
export const getMBTIAvatar = (mbti: MBTIType) => {
  const seeds: Record<MBTIType, string> = {
    'INFJ': 'George',    
    'INFP': 'Sasha',     
    'ENFP': 'Leo',       
    'ENFJ': 'Willow',    
    'INTJ': 'Felix',     
    'INTP': 'Max',       
    'ENTJ': 'Milo',      
    'ENTP': 'Oliver',    
    'ISTJ': 'Jack',      
    'ISFJ': 'Jasper',    
    'ESTJ': 'Toby',      
    'ESFJ': 'Zoe',       
    'ISTP': 'Finn',      
    'ISFP': 'Luna',      
    'ESTP': 'Bibi',      
    'ESFP': 'Cookie',    
  };

  const group = mbti.substring(1, 3);
  const groupColors: Record<string, string> = {
    'NT': 'a331c3', // Purple (Analysts)
    'NF': '33a474', // Green (Diplomats)
    'SJ': '4298b4', // Blue (Sentinels)
    'SP': 'e4ae3a', // Yellow (Explorers)
  };

  const bgColor = groupColors[group] || 'fce4ec';
  // 使用 DiceBear Adventurer 风格，虽然不是专门的猫，但比较可爱。
  // 可以考虑换成 'croodles' 或 'fun-emoji' 如果有更像猫的。
  // 不过为了保持用户代码的一致性，先用这个。
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seeds[mbti]}&backgroundColor=${bgColor}&backgroundType=solid`;
};

export const getMBTIColor = (mbti: MBTIType) => {
  const group = mbti.substring(1, 3);
  const colors: Record<string, string> = {
    'NT': '#a331c3', // Analysts
    'NF': '#33a474', // Diplomats
    'SJ': '#4298b4', // Sentinels
    'SP': '#e4ae3a', // Explorers
  };
  return colors[group] || '#F687B3';
};

export const getRelationshipLabel = (index: number) => {
  if (index < 30) return '初识喵';
  if (index < 60) return '好友喵';
  return '亲密喵';
};

