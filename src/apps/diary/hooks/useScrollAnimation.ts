import { useEffect, useRef, useState, useCallback } from 'react';

interface AnimationConfig {
  /** 触发阈值 (0-1) */
  threshold?: number;
  /** 根元素边距 */
  rootMargin?: string;
  /** 动画时长 (ms) */
  duration?: number;
  /** 是否尊重用户的减少动画偏好 */
  respectReducedMotion?: boolean;
}

interface AnimationState {
  /** 是否已触发动画 */
  hasAnimated: boolean;
  /** 是否正在动画中 */
  isAnimating: boolean;
  /** 是否可见 */
  isVisible: boolean;
}

const DEFAULT_CONFIG: Required<AnimationConfig> = {
  threshold: 0.15,
  rootMargin: '0px 0px -30px 0px',
  duration: 500,
  respectReducedMotion: true,
};

/**
 * 检查用户是否偏好减少动画
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 单个元素的滚动动画 Hook
 */
export function useScrollAnimation(config: AnimationConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<AnimationState>({
    hasAnimated: false,
    isAnimating: false,
    isVisible: false,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 如果用户偏好减少动画，直接显示
    if (finalConfig.respectReducedMotion && prefersReducedMotion()) {
      setState({
        hasAnimated: true,
        isAnimating: false,
        isVisible: true,
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !state.hasAnimated) {
            // 元素进入视口，触发动画
            setState((prev) => ({
              ...prev,
              isAnimating: true,
              isVisible: true,
            }));

            // 动画结束后更新状态
            setTimeout(() => {
              setState((prev) => ({
                ...prev,
                hasAnimated: true,
                isAnimating: false,
              }));
            }, finalConfig.duration);

            // 停止观察（动画只触发一次）
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: finalConfig.threshold,
        rootMargin: finalConfig.rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [finalConfig, state.hasAnimated]);

  return {
    ref,
    ...state,
  };
}

/**
 * 多个元素的滚动动画 Hook
 * 用于批量管理多个块的动画状态
 */
export function useScrollAnimationBatch(
  blockCount: number,
  config: AnimationConfig = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [animatedBlocks, setAnimatedBlocks] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 检查是否应该跳过动画
  const shouldSkipAnimation = finalConfig.respectReducedMotion && prefersReducedMotion();

  useEffect(() => {
    // 如果用户偏好减少动画，全部标记为已动画
    if (shouldSkipAnimation) {
      const allIndices = new Set(Array.from({ length: blockCount }, (_, i) => i));
      setAnimatedBlocks(allIndices);
      return;
    }

    // 创建 Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.blockIndex);
            if (!isNaN(index)) {
              setAnimatedBlocks((prev) => {
                const newSet = new Set(prev);
                newSet.add(index);
                return newSet;
              });
              // 动画只触发一次，停止观察
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: finalConfig.threshold,
        rootMargin: finalConfig.rootMargin,
      }
    );

    // 观察所有元素
    refs.current.forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [blockCount, shouldSkipAnimation, finalConfig.threshold, finalConfig.rootMargin]);

  // 设置 ref 的回调函数
  const setRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  }, []);

  // 检查某个块是否已动画
  const isAnimated = useCallback(
    (index: number) => animatedBlocks.has(index),
    [animatedBlocks]
  );

  return {
    setRef,
    isAnimated,
    animatedCount: animatedBlocks.size,
    totalCount: blockCount,
  };
}

/**
 * 获取动画样式
 * 使用更柔和的动画曲线和更小的偏移量
 */
export function getAnimationStyle(isAnimated: boolean, isAnimating: boolean): React.CSSProperties {
  if (isAnimated) {
    return {
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'opacity 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  }

  return {
    opacity: 0.3,
    transform: 'translateY(16px)',
    transition: 'opacity 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };
}

export default useScrollAnimation;
