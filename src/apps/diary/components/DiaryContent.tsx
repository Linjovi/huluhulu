import React, { useMemo } from 'react';
import { DiaryBlock } from '../types';
import { safeParseHtmlToBlocks } from '../utils/parseHtmlToBlocks';
import { DiaryBlockRenderer } from './DiaryBlockRenderer';
import { useScrollAnimationBatch, getAnimationStyle } from '../hooks/useScrollAnimation';

interface DiaryContentProps {
  /** 富文本 HTML 内容 */
  htmlContent: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 日记内容组件
 * 将富文本解析为段落块并渲染，支持滚动动画
 */
export const DiaryContent: React.FC<DiaryContentProps> = ({
  htmlContent,
  className = '',
}) => {
  // 解析 HTML 为段落块
  const blocks = useMemo(() => {
    return safeParseHtmlToBlocks(htmlContent);
  }, [htmlContent]);

  // 批量滚动动画 - 使用更柔和的配置
  const { setRef, isAnimated } = useScrollAnimationBatch(blocks.length);

  // 如果解析失败或无内容，显示原始内容
  if (blocks.length === 0 && htmlContent) {
    return (
      <div
        className={`px-6 py-6 prose prose-pink max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  return (
    <div className={`px-6 py-6 ${className}`}>
      {blocks.map((block: DiaryBlock, index: number) => {
        const animated = isAnimated(index);
        const animationStyle = getAnimationStyle(animated, false);

        return (
          <div
            key={block.id}
            ref={setRef(index)}
            data-block-index={index}
            style={animationStyle}
          >
            <DiaryBlockRenderer block={block} />
          </div>
        );
      })}
    </div>
  );
};

export default DiaryContent;
