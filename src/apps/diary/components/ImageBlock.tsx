import React, { useState } from 'react';
import { DiaryBlock } from '../types';

interface ImageBlockProps {
  block: DiaryBlock;
  className?: string;
}

/**
 * 图片块组件
 * 支持懒加载和加载状态显示
 */
export const ImageBlock: React.FC<ImageBlockProps> = ({ block, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <figure className={`my-4 ${className}`}>
      {/* 图片容器 */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100">
        {/* 加载骨架屏 */}
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
            <div className="w-full h-48 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* 错误状态 */}
        {hasError ? (
          <div className="w-full h-48 flex flex-col items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm">图片加载失败</span>
          </div>
        ) : (
          <img
            src={block.content}
            alt={block.caption || '日记图片'}
            loading="lazy"
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-auto transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
      </div>

      {/* 图片说明 */}
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageBlock;
