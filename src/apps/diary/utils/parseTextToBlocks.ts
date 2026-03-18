import { DiaryBlock } from '../types';

/** 图片 URL 正则：匹配常见图片格式 */
const IMAGE_URL_REGEX = /(https?:\/\/[^\s<>"']+\.(?:jpg|jpeg|png|gif|webp|bmp|svg)(?:\?[^\s<>"']*)?)/gi;

/** 视频 URL 正则：匹配常见视频格式 */
const VIDEO_URL_REGEX = /(https?:\/\/[^\s<>"']+\.(?:mp4|webm|mov|avi|mkv|m4v)(?:\?[^\s<>"']*)?)/gi;

/** 合并的媒体 URL 正则 */
const MEDIA_URL_REGEX = new RegExp(
  `(https?:\\/\\/[^\\s<>"']+\\.(?:jpg|jpeg|png|gif|webp|bmp|svg|mp4|webm|mov|avi|mkv|m4v)(?:\\?[^\\s<>"']*)?)`,
  'gi'
);

/**
 * 判断 URL 是否为图片
 */
function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(url);
}

/**
 * 判断 URL 是否为视频
 */
function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|avi|mkv|m4v)(\?|$)/i.test(url);
}

/**
 * 将纯文本解析为段落块数组
 * 自动检测文本中的 image/video 链接并转换为对应块
 * @param text 纯文本内容
 * @returns 段落块数组
 */
export function parseTextToBlocks(text: string): DiaryBlock[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const blocks: DiaryBlock[] = [];
  let blockIndex = 0;

  // 按换行分割文本
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 空行跳过
    if (!trimmedLine) {
      continue;
    }

    // 检查是否是纯媒体链接行
    const mediaMatch = trimmedLine.match(MEDIA_URL_REGEX);
    
    if (mediaMatch && mediaMatch.length === 1 && trimmedLine === mediaMatch[0]) {
      // 整行只有一个媒体链接，直接创建媒体块
      const url = mediaMatch[0];
      if (isImageUrl(url)) {
        blocks.push({
          id: `block-${blockIndex++}`,
          type: 'image',
          content: url,
        });
      } else if (isVideoUrl(url)) {
        blocks.push({
          id: `block-${blockIndex++}`,
          type: 'video',
          content: url,
        });
      }
    } else {
      // 包含文本的行，需要处理其中的媒体链接
      // 先收集所有媒体链接位置
      const mediaPositions: Array<{ start: number; end: number; url: string; type: 'image' | 'video' }> = [];
      let match: RegExpExecArray | null;
      
      // 重置正则
      MEDIA_URL_REGEX.lastIndex = 0;
      
      while ((match = MEDIA_URL_REGEX.exec(trimmedLine)) !== null) {
        const url = match[0];
        mediaPositions.push({
          start: match.index,
          end: match.index + url.length,
          url,
          type: isImageUrl(url) ? 'image' : 'video',
        });
      }

      if (mediaPositions.length === 0) {
        // 没有媒体链接，纯文本
        blocks.push({
          id: `block-${blockIndex++}`,
          type: 'text',
          content: trimmedLine,
        });
      } else {
        // 有媒体链接，分割处理
        let lastEnd = 0;
        
        for (const pos of mediaPositions) {
          // 添加链接前的文本
          if (pos.start > lastEnd) {
            const textBefore = trimmedLine.slice(lastEnd, pos.start).trim();
            if (textBefore) {
              blocks.push({
                id: `block-${blockIndex++}`,
                type: 'text',
                content: textBefore,
              });
            }
          }
          
          // 添加媒体块
          blocks.push({
            id: `block-${blockIndex++}`,
            type: pos.type,
            content: pos.url,
          });
          
          lastEnd = pos.end;
        }
        
        // 添加最后剩余的文本
        if (lastEnd < trimmedLine.length) {
          const textAfter = trimmedLine.slice(lastEnd).trim();
          if (textAfter) {
            blocks.push({
              id: `block-${blockIndex++}`,
              type: 'text',
              content: textAfter,
            });
          }
        }
      }
    }
  }

  return blocks;
}

/**
 * 安全解析文本（带错误处理）
 * @param text 纯文本内容
 * @returns 段落块数组，解析失败返回空数组
 */
export function safeParseTextToBlocks(text: string): DiaryBlock[] {
  try {
    return parseTextToBlocks(text);
  } catch (error) {
    console.error('Failed to parse text to blocks:', error);
    return [];
  }
}
