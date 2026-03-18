import React from 'react';
import { DiaryBlock } from '../types';

interface TextBlockProps {
  block: DiaryBlock;
  className?: string;
}

/**
 * 文本块组件
 * 支持富文本内联格式渲染
 */
export const TextBlock: React.FC<TextBlockProps> = ({ block, className = '' }) => {
  // 根据原始标签名选择合适的语义化标签
  const getTag = (): keyof JSX.IntrinsicElements => {
    switch (block.tagName) {
      case 'h1':
        return 'h1';
      case 'h2':
        return 'h2';
      case 'h3':
        return 'h3';
      case 'h4':
        return 'h4';
      case 'h5':
        return 'h5';
      case 'h6':
        return 'h6';
      case 'blockquote':
        return 'blockquote';
      case 'li':
        return 'li';
      default:
        return 'p';
    }
  };

  // 根据标签名选择样式
  const getStyleClass = (): string => {
    switch (block.tagName) {
      case 'h1':
        return 'text-2xl font-bold text-gray-800 mb-4';
      case 'h2':
        return 'text-xl font-bold text-gray-800 mb-3';
      case 'h3':
        return 'text-lg font-semibold text-gray-800 mb-2';
      case 'h4':
      case 'h5':
      case 'h6':
        return 'text-base font-semibold text-gray-800 mb-2';
      case 'blockquote':
        return 'border-l-4 border-pink-300 pl-4 italic text-gray-600 my-4';
      case 'li':
        return 'text-gray-700 leading-relaxed mb-2';
      default:
        return 'text-gray-700 leading-relaxed mb-4';
    }
  };

  const Tag = getTag();
  const styleClass = getStyleClass();

  return (
    <Tag
      className={`${styleClass} ${className}`}
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
};

export default TextBlock;
