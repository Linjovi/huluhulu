/**
 * 日记段落块类型定义
 */

/** 块类型常量 */
export type DiaryBlockType = 'text' | 'image' | 'video';

/** 日记段落块接口 */
export interface DiaryBlock {
  /** 块唯一标识（基于索引生成） */
  id: string;
  /** 块类型：文本、图片或视频 */
  type: DiaryBlockType;
  /** 块内容：文本内容或媒体 URL */
  content: string;
  /** 图片/视频说明 */
  caption?: string;
}

/** 日记数据接口（简化版） */
export interface DiaryData {
  /** 日期ID，格式：YYYYMMDD */
  date: string;
  /** 纯文本内容 */
  content: string;
}

/** 日记响应接口 */
export interface DiaryResponse {
  success: boolean;
  data?: DiaryData;
  error?: string;
}
