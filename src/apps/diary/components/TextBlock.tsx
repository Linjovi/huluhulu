import React from 'react';
import { DiaryBlock } from '../types';

interface TextBlockProps {
  block: DiaryBlock;
  className?: string;
}

/**
 * 文本块组件
 * 渲染纯文本内容
 */
export const TextBlock: React.FC<TextBlockProps> = ({ block, className = '' }) => {
  return (
    <p className={`text-gray-700 leading-relaxed mb-4 ${className}`}>
      {block.content}
    </p>
  );
};

export default TextBlock;
