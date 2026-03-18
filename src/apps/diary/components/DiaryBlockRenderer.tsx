import React from 'react';
import { DiaryBlock } from '../types';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';

interface DiaryBlockRendererProps {
  block: DiaryBlock;
  className?: string;
  isAnimating?: boolean;
  animationStyle?: React.CSSProperties;
}

/**
 * 日记块渲染器
 * 根据块类型路由到对应的组件
 */
export const DiaryBlockRenderer: React.FC<DiaryBlockRendererProps> = ({
  block,
  className = '',
  isAnimating = false,
  animationStyle,
}) => {
  // 合并动画样式
  const containerStyle: React.CSSProperties = {
    ...animationStyle,
  };

  // 根据块类型渲染对应组件
  const renderBlock = () => {
    switch (block.type) {
      case 'text':
        return <TextBlock block={block} className={className} />;
      case 'image':
        return <ImageBlock block={block} className={className} />;
      default:
        // 未知类型：记录警告并返回空
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  };

  return (
    <div
      className={`diary-block ${isAnimating ? 'diary-block-animating' : ''}`}
      style={containerStyle}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {renderBlock()}
    </div>
  );
};

export default DiaryBlockRenderer;
