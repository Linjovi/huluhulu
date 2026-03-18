import {
  DiaryBlock,
  ParseOptions,
  DEFAULT_TEXT_TAGS,
  DEFAULT_IMAGE_TAGS,
} from '../types';

/**
 * 将富文本 HTML 解析为段落块数组
 * @param html 富文本 HTML 字符串
 * @param options 解析选项
 * @returns 段落块数组
 */
export function parseHtmlToBlocks(
  html: string,
  options: ParseOptions = {}
): DiaryBlock[] {
  const {
    keepEmptyBlocks = false,
    textTags = DEFAULT_TEXT_TAGS,
    imageTags = DEFAULT_IMAGE_TAGS,
  } = options;

  if (!html || typeof html !== 'string') {
    return [];
  }

  // 使用 DOMParser 解析 HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  const blocks: DiaryBlock[] = [];
  let blockIndex = 0;

  /**
   * 生成块 ID
   */
  const generateBlockId = (): string => {
    return `block-${blockIndex++}`;
  };

  /**
   * 检查是否为文本标签
   */
  const isTextTag = (tagName: string): boolean => {
    return textTags.includes(tagName.toLowerCase());
  };

  /**
   * 检查是否为图片标签
   */
  const isImageTag = (tagName: string): boolean => {
    return imageTags.includes(tagName.toLowerCase());
  };

  /**
   * 处理文本节点
   */
  const processTextNode = (node: Text, parentTagName: string): void => {
    const text = node.textContent?.trim();
    if (!text && !keepEmptyBlocks) return;

    // 如果父元素是文本标签，创建文本块
    if (isTextTag(parentTagName)) {
      blocks.push({
        id: generateBlockId(),
        type: 'text',
        content: text || '',
        tagName: parentTagName,
      });
    }
  };

  /**
   * 处理元素节点
   */
  const processElement = (element: Element): void => {
    const tagName = element.tagName.toLowerCase();

    // 处理图片标签
    if (isImageTag(tagName)) {
      const imgElement = element as HTMLImageElement;
      const src = imgElement.src || imgElement.getAttribute('src') || '';
      const alt = imgElement.alt || imgElement.getAttribute('alt') || '';

      if (src) {
        blocks.push({
          id: generateBlockId(),
          type: 'image',
          content: src,
          caption: alt || undefined,
          tagName: 'img',
        });
      }
      return;
    }

    // 处理文本标签
    if (isTextTag(tagName)) {
      // 检查是否包含图片子元素
      const hasImageChild = element.querySelector('img') !== null;
      
      if (hasImageChild) {
        // 如果包含图片，递归处理子节点，不把整个元素当作文本块
        const children = Array.from(element.childNodes);
        for (const child of children) {
          traverseNode(child, tagName);
        }
        return;
      }
      
      const textContent = element.textContent?.trim();
      
      // 如果为空且不保留空块，跳过
      if (!textContent && !keepEmptyBlocks) {
        return;
      }

      // 获取元素的 innerHTML 以保留内联格式
      const innerContent = element.innerHTML;
      
      blocks.push({
        id: generateBlockId(),
        type: 'text',
        content: innerContent || textContent || '',
        tagName,
      });
      return;
    }

    // 处理 br 标签 - 合并到前一个文本块或忽略
    if (tagName === 'br') {
      // br 标签不单独创建块，由父元素处理
      return;
    }

    // 未知标签：提取文本内容创建文本块
    const textContent = element.textContent?.trim();
    if (textContent) {
      blocks.push({
        id: generateBlockId(),
        type: 'text',
        content: textContent,
        tagName,
      });
    }
  };

  /**
   * 递归遍历 DOM 节点
   */
  const traverseNode = (node: Node, parentTagName: string = 'div'): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      processTextNode(node as Text, parentTagName);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // 图片标签单独处理
      if (isImageTag(tagName)) {
        processElement(element);
        return;
      }

      // 文本标签直接处理
      if (isTextTag(tagName)) {
        processElement(element);
        return;
      }

      // br 标签跳过
      if (tagName === 'br') {
        return;
      }

      // 其他标签递归处理子节点
      const children = Array.from(node.childNodes);
      for (const child of children) {
        traverseNode(child, tagName);
      }
    }
  };

  // 遍历 body 的所有子节点
  const children = Array.from(body.childNodes);
  for (const child of children) {
    traverseNode(child);
  }

  return blocks;
}

/**
 * 检查是否支持 DOMParser
 */
export function isDOMParserSupported(): boolean {
  return typeof DOMParser !== 'undefined';
}

/**
 * 安全解析 HTML（带错误处理）
 * @param html 富文本 HTML 字符串
 * @param options 解析选项
 * @returns 段落块数组，解析失败返回空数组
 */
export function safeParseHtmlToBlocks(
  html: string,
  options: ParseOptions = {}
): DiaryBlock[] {
  try {
    if (!isDOMParserSupported()) {
      console.warn('DOMParser is not supported in this environment');
      return [];
    }
    return parseHtmlToBlocks(html, options);
  } catch (error) {
    console.error('Failed to parse HTML to blocks:', error);
    return [];
  }
}
