/**
 * 日记段落块类型定义
 */

/** 块类型常量 */
export type DiaryBlockType = 'text' | 'image';

/** 日记段落块接口 */
export interface DiaryBlock {
  /** 块唯一标识（基于索引生成） */
  id: string;
  /** 块类型：文本或图片 */
  type: DiaryBlockType;
  /** 块内容：文本内容或图片 URL */
  content: string;
  /** 图片说明（仅图片块） */
  caption?: string;
  /** 原始 HTML 标签名 */
  tagName?: string;
}

/** 解析选项 */
export interface ParseOptions {
  /** 是否保留空文本块 */
  keepEmptyBlocks?: boolean;
  /** 自定义文本标签列表 */
  textTags?: string[];
  /** 自定义图片标签列表 */
  imageTags?: string[];
}

/** 默认支持的文本标签 */
export const DEFAULT_TEXT_TAGS = [
  'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'span', 'strong', 'em', 'b', 'i', 'blockquote', 'li'
];

/** 默认支持的图片标签 */
export const DEFAULT_IMAGE_TAGS = ['img'];

/** 日记数据接口（扩展原有接口） */
export interface DiaryData {
  id: string;
  title?: string;
  content: string; // 富文本 HTML
  mood?: string;
  weather?: string;
  date: string;
  author?: string;
}

/** 日记响应接口 */
export interface DiaryResponse {
  success: boolean;
  data?: DiaryData;
  error?: string;
}
