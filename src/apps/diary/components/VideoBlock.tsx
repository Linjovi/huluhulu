import React, { useState, useRef } from 'react';
import { DiaryBlock } from '../types';

interface VideoBlockProps {
  block: DiaryBlock;
  className?: string;
}

/**
 * 根据视频 URL 生成封面图 URL
 * 支持 thumbsnap.com 等常见视频托管服务
 */
const getPosterUrl = (videoUrl: string): string | undefined => {
  // thumbsnap.com: 将 .mp4 替换为 .jpg
  if (videoUrl.includes('thumbsnap.com')) {
    return videoUrl.replace(/\.mp4$/i, '.jpg');
  }
  // 其他平台可根据需要扩展
  return undefined;
};

/**
 * 视频块组件
 * 自动播放、静音、循环，类似 GIF 效果
 */
export const VideoBlock: React.FC<VideoBlockProps> = ({ block, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleError = () => {
    setHasError(true);
  };

  // 自动生成封面图
  const posterUrl = getPosterUrl(block.content);

  return (
    <figure className={`my-4 ${className}`}>
      {/* 视频容器 */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100">
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
            <span className="text-sm">视频加载失败</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={block.content}
            poster={posterUrl}
            controls
            playsInline
            onError={handleError}
            className="w-full h-auto"
          >
            您的浏览器不支持视频播放
          </video>
        )}
      </div>

      {/* 视频说明 */}
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
};

export default VideoBlock;
